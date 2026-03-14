/**
 * Commands Route
 * Centraliza o recebimento de comandos (WhatsApp / Sidebar).
 */
async function commandRoutes(fastify, options) {
    fastify.post('/api/commands', async (request, reply) => {
        const { text } = request.body;
        console.log(`💬 Comando recebido: ${text}`);

        // Aqui simularíamos o processamento via aiService
        // No MVP, redirecionamos para o Tribunal ou Agent Manager

        return {
            status: 'RECEIVED',
            message: 'Comando sendo processado pela Assis IA',
            taskId: `task_${Date.now()}`
        };
    });
}

module.exports = commandRoutes;
