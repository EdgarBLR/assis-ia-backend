const documentController = require('../controllers/documentController');

async function documentRoutes(fastify, options) {
    const prisma = options.prisma;
    const documentQueue = options.documentQueue;

    fastify.post('/api/documents/upload', { preHandler: [fastify.authenticate] }, (request, reply) =>
        documentController.upload(request, reply, prisma, documentQueue)
    );

    fastify.get('/api/documents/:id', { preHandler: [fastify.authenticate] }, (request, reply) =>
        documentController.getById(request, reply, prisma)
    );

    fastify.get('/api/portal/documents', { preHandler: [fastify.authenticate] }, (request, reply) =>
        documentController.getPortalDocuments(request, reply, prisma)
    );

    /**
     * Aprovação/Correção Humana (Loop de Aprendizado)
     */
    fastify.patch('/api/documents/:id/approve', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        const { id } = request.params;
        const { analysis, feedback } = request.body;
        const learningService = require('../context-manager/learningService');

        // 1. Atualizar o documento
        await prisma.document.update({
            where: { id },
            data: { status: 'APPROVED_BY_HUMAN' }
        });

        // 2. Acionar o aprendizado
        const result = await learningService.processFeedback(id, analysis, 1.0, feedback);

        return result;
    });
}

module.exports = documentRoutes;
