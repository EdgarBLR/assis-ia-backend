const taxService = require('../decision-engine/taxService');
const categorizationService = require('../document-engine/categorizationService');
const reconciliationService = require('../decision-engine/reconciliationService');

async function financeRoutes(fastify, options) {
    const { prisma } = options;

    /**
     * Trigger Tax Calculation
     */
    fastify.post('/calculate-tax', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        const { period } = request.body;
        const companyId = request.user.companyId;

        if (!companyId) return reply.status(400).send({ error: 'Empresa não vinculada' });

        const result = await taxService.calculateMonthlyTax(companyId, period);
        return result;
    });

    /**
     * Import Transactions (Simulação)
     */
    fastify.post('/transactions/import', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        const { transactions } = request.body;
        const companyId = request.user.companyId;

        const results = [];
        for (const txData of transactions) {
            const tx = await categorizationService.processTransaction({
                ...txData,
                companyId
            });
            results.push(tx);
        }

        return { imported: results.length, data: results };
    });

    /**
     * Run Reconciliation
     */
    fastify.post('/reconcile', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        const companyId = request.user.companyId;
        const matches = await reconciliationService.reconcileCompany(companyId);
        return { message: 'Conciliação finalizada', matches };
    });

    /**
     * Get Financial Dashboard (Mock)
     */
    fastify.get('/dashboard', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        const companyId = request.user.companyId;
        const taxes = await prisma.taxRecord.findMany({ where: { companyId } });
        const transactions = await prisma.transaction.findMany({
            where: { companyId },
            include: { category: true }
        });

        return {
            summary: {
                totalRevenue: transactions.filter(t => t.type === 'INCOME').reduce((acc, t) => acc + t.amount, 0),
                totalExpenses: transactions.filter(t => t.type === 'EXPENSE').reduce((acc, t) => acc + t.amount, 0),
                taxBalance: taxes.reduce((acc, t) => acc + t.taxAmount, 0)
            },
            taxes,
            recentTransactions: transactions.slice(0, 10)
        };
    });
}

module.exports = financeRoutes;
