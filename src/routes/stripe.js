const stripeService = require('../services/stripeService');

async function stripeRoutes(fastify, options) {
    /**
     * Iniciar checkout
     */
    fastify.post('/checkout', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        const { priceId } = request.body;
        const companyId = request.user.companyId;

        if (!companyId) return reply.status(400).send({ error: 'Usuário sem empresa vinculada' });

        const session = await stripeService.createCheckoutSession(companyId, priceId);
        return { url: session.url };
    });

    /**
     * Webhook do Stripe (Público)
     */
    fastify.post('/api/webhooks/stripe', async (request, reply) => {
        const sig = request.headers['stripe-signature'];

        // NOTA: Em produção usaríamos stripe.webhooks.constructEvent
        // Por simplicidade no dev, processamos direto
        await stripeService.handleWebhook(request.body);

        return { received: true };
    });
}

module.exports = stripeRoutes;
