const fastify = require('fastify')({ logger: true });
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');
const util = require('util');
const { pipeline } = require('stream');
const pump = util.promisify(pipeline);

const prisma = new PrismaClient();
const { documentQueue, isDocumentProcessingEnabled } = require('./src/jobs/documentProcessor');
const billingService = require('./src/services/billingService');
const analyticsService = require('./src/services/analyticsService');

// Plugins
fastify.register(require('@fastify/cors'), { origin: '*' });
fastify.register(require('@fastify/multipart'));
fastify.register(require('@fastify/jwt'), {
    secret: process.env.JWT_SECRET || 'assis_ia_temp_secret_2026_!@#',
});

// Decorator for Auth
fastify.decorate('authenticate', async (request, reply) => {
    try {
        await request.jwtVerify();
    } catch (err) {
        reply.status(401).send({ error: 'Não autorizado' });
    }
});

// Routes
fastify.get('/', async () => {
    return { status: 'ASSIS OS API Online 🚀', version: '1.0.0' };
});

// Real Auth
fastify.post('/login', async (request, reply) => {
    const { email, password } = request.body;

    const user = await prisma.user.findUnique({
        where: { email },
        include: { tenant: true }
    });

    if (user && await bcrypt.compare(password, user.password)) {
        const token = fastify.jwt.sign({
            id: user.id,
            email: user.email,
            role: user.role,
            tenantId: user.tenantId
        });
        return { token, user: { name: user.name, email: user.email, role: user.role } };
    }

    reply.status(401).send({ error: 'Credenciais inválidas' });
});

fastify.get('/api/me', { preHandler: [fastify.authenticate] }, async (request) => {
    return { user: request.user };
});

// Register (for initial setup)
fastify.post('/register', async (request, reply) => {
    const { name, email, password, tenantName } = request.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const result = await prisma.$transaction(async (tx) => {
            const tenant = await tx.tenant.create({
                data: { name: tenantName, plan: 'FREE' }
            });

            const user = await tx.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    role: 'ADMIN',
                    tenantId: tenant.id
                }
            });

            return { user, tenant };
        });

        return result;
    } catch (error) {
        reply.status(400).send({ error: 'Erro ao registrar usuário: ' + error.message });
    }
});

// Clients CRUD
fastify.get('/api/clients', { preHandler: [fastify.authenticate] }, async (request) => {
    return prisma.company.findMany({
        where: { tenantId: request.user.tenantId }
    });
});

fastify.post('/api/clients', { preHandler: [fastify.authenticate] }, async (request) => {
    const { name, segment, regime } = request.body;
    return prisma.company.create({
        data: {
            name,
            segment,
            regime,
            tenantId: request.user.tenantId
        }
    });
});

// Documents / Upload
fastify.post('/api/documents/upload', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const data = await request.file();
    if (!data) {
        return reply.status(400).send({ error: 'Nenhum arquivo enviado' });
    }

    const fileName = `${Date.now()}-${data.filename}`;
    const filePath = path.join(__dirname, 'uploads', fileName);

    await pump(data.file, fs.createWriteStream(filePath));

    // 1. Criar registro no banco
    const document = await prisma.document.create({
        data: {
            fileName: data.filename,
            type: 'PENDING',
            createdAt: new Date(),
        }
    });

    // 2. Adicionar na fila de processamento
    if (!isDocumentProcessingEnabled || !documentQueue) {
        return reply.status(503).send({
            id: document.id,
            error: 'Processamento de documentos desativado. Defina ENABLE_DOCUMENT_PROCESSING=true e configure o Redis.'
        });
    }

    await documentQueue.add('process-doc', {
        documentId: document.id,
        filePath: filePath
    });

    return {
        id: document.id,
        message: 'Upload concluído. Documento sendo processado via IA.',
        status: 'PROCESSING'
    };
});

fastify.get('/api/documents/:id', { preHandler: [fastify.authenticate] }, async (request) => {
    return prisma.document.findUnique({
        where: { id: request.params.id }
    });
});

// Billing Routes
fastify.post('/api/billing/checkout', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const { plan, companyId } = request.body;
    try {
        const session = await billingService.createCheckoutSession(companyId, plan);
        return { url: session.url };
    } catch (error) {
        reply.status(500).send({ error: 'Erro ao criar sessão de pagamento' });
    }
});

// Client Portal Routes (Role-based)
fastify.get('/api/portal/documents', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    if (request.user.role !== 'CLIENT') {
        return reply.status(403).send({ error: 'Acesso restrito ao portal do cliente' });
    }

    return prisma.document.findMany({
        where: { companyId: request.user.companyId }
    });
});

fastify.get('/api/portal/processes', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    if (request.user.role !== 'CLIENT') {
        return reply.status(403).send({ error: 'Acesso restrito ao portal do cliente' });
    }

    return prisma.process.findMany({
        where: { companyId: request.user.companyId },
        include: { steps: true }
    });
});

// Analytics Route
fastify.get('/api/analytics', { preHandler: [fastify.authenticate] }, async (request) => {
    return analyticsService.getTenantMetrics(request.user.tenantId);
});

// WhatsApp Webhook Placeholder
fastify.get('/webhook', async (request, reply) => {
    const mode = request.query['hub.mode'];
    const token = request.query['hub.verify_token'];
    const challenge = request.query['hub.challenge'];

    if (mode && token === (process.env.WHATSAPP_VERIFY_TOKEN || 'assis_os_token')) {
        return challenge;
    }
    reply.status(403).send();
});

fastify.post('/webhook', async (request, reply) => {
    const body = request.body;
    console.log('WhatsApp Webhook received:', JSON.stringify(body, null, 2));

    // TODO: Extrair mídia do WhatsApp, salvar e adicionar na fila
    // Isso requer integração com a API da Meta para baixar o arquivo

    return { status: 'RECEIVED' };
});

// Server Start
const start = async () => {
    try {
        const port = process.env.PORT || 3001;
        await fastify.listen({ port, host: '0.0.0.0' });
        console.log(`🚀 Server listening on http://localhost:${port}`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();
