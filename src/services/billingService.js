const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_mock');
const prisma = require('../lib/prisma');

const PLAN_PRICES = {
    'PRO': 'price_mock_pro_123',
    'ENTERPRISE': 'price_mock_ent_456'
};

const billingService = {
    /**
     * Cria uma sessão de checkout para assinatura.
     */
    async createCheckoutSession(companyId, plan) {
        if (!PLAN_PRICES[plan]) {
            throw new Error(`Plano inválido: ${plan}`);
        }
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price: PLAN_PRICES[plan],
                quantity: 1,
            }],
            mode: 'subscription',
            success_url: `${process.env.FRONTEND_URL}/dashboard?payment=success`,
            cancel_url: `${process.env.FRONTEND_URL}/dashboard?payment=cancel`,
            metadata: { companyId, plan }
        });

        return session;
    },

    /**
     * Atualiza o status da assinatura no banco de dados.
     */
    async updateSubscription(stripeId, status, currentPeriodEnd, companyId, plan) {
        return prisma.subscription.upsert({
            where: { stripeId },
            update: { status, currentPeriodEnd },
            create: {
                stripeId,
                status,
                currentPeriodEnd,
                plan,
                companyId
            }
        });
    }
};

module.exports = billingService;
