const authController = require('../controllers/authController');

async function authRoutes(fastify, options) {
    const prisma = options.prisma;

    fastify.post('/login', (request, reply) => authController.login(request, reply, fastify, prisma));
    fastify.post('/register', (request, reply) => authController.register(request, reply, prisma));
    fastify.get('/api/me', { preHandler: [fastify.authenticate] }, authController.me);
}

module.exports = authRoutes;
