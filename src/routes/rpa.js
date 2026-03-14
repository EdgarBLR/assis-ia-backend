const rpaService = require('../agents/rpaService');

async function rpaRoutes(fastify, options) {
    const prisma = options.prisma;

    /**
     * Get pending RPA tasks (used by agents like dominioAgent)
     */
    fastify.get('/api/rpa/tasks', async (request, reply) => {
        const { type } = request.query;
        const tasks = await rpaService.getPendingTasks(type);
        return tasks;
    });

    /**
     * Create a new RPA task (can be called by n8n or internal services)
     */
    fastify.post('/api/rpa/tasks', async (request, reply) => {
        const { type, data, companyId } = request.body;
        return rpaService.queueTask(type, data, companyId);
    });

    /**
     * Update RPA task status (called by agents)
     */
    fastify.patch('/api/rpa/tasks/:id', async (request, reply) => {
        const { id } = request.params;
        const { status, result } = request.body;
        return rpaService.updateTaskStatus(id, status, result);
    });
}

module.exports = rpaRoutes;
