const path = require('path');
const fs = require('fs');
const util = require('util');
const { pipeline } = require('stream');
const pump = util.promisify(pipeline);
const rpaService = require('../agents/rpaService');

const documentController = {
    async upload(request, reply, prisma, documentQueue) {
        const data = await request.file();
        if (!data) {
            return reply.status(400).send({ error: 'Nenhum arquivo enviado' });
        }

        const fileName = `${Date.now()}-${data.filename}`;
        // Assuming we're in src/controllers, uploads is at ../../uploads
        const filePath = path.join(__dirname, '..', '..', 'uploads', fileName);

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
        await documentQueue.add('process-doc', {
            documentId: document.id,
            filePath: filePath
        });

        return {
            id: document.id,
            message: 'Upload concluído. Documento sendo processado via IA.',
            status: 'PROCESSING'
        };
    },

    async getById(request, reply, prisma) {
        return prisma.document.findUnique({
            where: { id: request.params.id }
        });
    },

    async getPortalDocuments(request, reply, prisma) {
        if (request.user.role !== 'CLIENT') {
            return reply.status(403).send({ error: 'Acesso restrito ao portal do cliente' });
        }

        return prisma.document.findMany({
            where: { companyId: request.user.companyId }
        });
    }
};

module.exports = documentController;
