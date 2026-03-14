const webhookController = require('../controllers/webhookController');

async function webhookRoutes(fastify, options) {
    const prisma = options.prisma;

    fastify.get('/webhook', webhookController.whatsappVerify);
    fastify.post('/webhook', webhookController.whatsappReceive);

    // Z-API Webhook Integration
    fastify.post('/api/webhooks/whatsapp', async (request, reply) => {
        const payload = request.body;

        // Verifica se é uma mensagem de texto recebida na Z-API
        if (payload?.text?.message) {
            const text = payload.text.message;
            const remoteJid = payload.phone; // O número de quem enviou (ex: 5511999999999)
            const pushName = payload.senderName || 'Usuário';

            console.log(`📩 WhatsApp (Z-API) de ${pushName} (${remoteJid}): ${text}`);

            const aiGateway = require('../ai-gateway/aiGateway');
            const zapiService = require('../services/zapiService');

            try {
                // Notifica o usuário que estamos processando
                await zapiService.sendProcessing(remoteJid);

                const aiResponse = await aiGateway.chat('WHATSAPP_COMMAND', [
                    { role: 'user', content: text }
                ]);

                // Responde com a IA
                const responseText = `✅ Assis IA entendeu: ${aiResponse.choices[0].message.content}\n\nStatus: ${aiResponse.source}`;
                await zapiService.sendText(remoteJid, responseText);

            } catch (error) {
                console.error('❌ Erro no fluxo de WhatsApp (Z-API):', error);
            }
        }

        return { success: true };
    });

    fastify.post('/api/webhooks/n8n', (request, reply) =>
        webhookController.n8nCallback(request, reply, prisma)
    );
}

module.exports = webhookRoutes;
