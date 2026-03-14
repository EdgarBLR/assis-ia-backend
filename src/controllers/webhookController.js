const webhookController = {
    async whatsappVerify(request, reply) {
        const mode = request.query['hub.mode'];
        const token = request.query['hub.verify_token'];
        const challenge = request.query['hub.challenge'];

        if (mode && token === (process.env.WHATSAPP_VERIFY_TOKEN || 'assis_os_token')) {
            return challenge;
        }
        reply.status(403).send();
    },

    async whatsappReceive(request, reply) {
        const body = request.body;
        console.log('WhatsApp Webhook received:', JSON.stringify(body, null, 2));

        // TODO: Extrair mídia do WhatsApp, salvar e adicionar na fila
        return { status: 'RECEIVED' };
    },

    async n8nCallback(request, reply, prisma) {
        const { action, documentId, data } = request.body;
        console.log(`n8n Webhook received action: ${action} for doc: ${documentId}`);

        if (action === 'update_document' && documentId) {
            await prisma.document.update({
                where: { id: documentId },
                data: {
                    ...data,
                    updatedAt: new Date()
                }
            });
            return { success: true, message: 'Document updated' };
        }

        return { success: true, message: 'Webhook processed' };
    }
};

module.exports = webhookController;
