const clientController = require('../controllers/clientController');

async function clientRoutes(fastify, options) {
    const prisma = options.prisma;

    fastify.get('/api/clients', { preHandler: [fastify.authenticate] }, (request, reply) =>
        clientController.getClients(request, reply, prisma)
    );

    fastify.post('/api/clients', { preHandler: [fastify.authenticate] }, (request, reply) =>
        clientController.createClient(request, reply, prisma)
    );

    fastify.get('/api/portal/processes', { preHandler: [fastify.authenticate] }, (request, reply) =>
        clientController.getPortalProcesses(request, reply, prisma)
    );
}

module.exports = clientRoutes;
