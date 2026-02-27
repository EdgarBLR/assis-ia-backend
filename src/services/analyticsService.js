const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const analyticsService = {
    /**
     * Retorna métricas gerais do Tenant (Escritório).
     */
    async getTenantMetrics(tenantId) {
        const companies = await prisma.company.findMany({
            where: { tenantId },
            select: { id: true }
        });
        const companyIds = companies.map((company) => company.id);

        const [clientsCount, docsCount, pendingTasks] = await Promise.all([
            prisma.company.count({ where: { tenantId } }),
            prisma.document.count({
                where: companyIds.length > 0 ? {
                    companyId: { in: companyIds }
                } : undefined
            }),
            prisma.process.count({
                where: {
                    companyId: { in: companyIds },
                    status: 'PENDING'
                }
            })
        ]);

        // Simulação de dados para gráficos (últimos 6 meses)
        const productivityData = [
            { month: 'Set', completed: 45, pending: 12 },
            { month: 'Out', completed: 52, pending: 8 },
            { month: 'Nov', completed: 48, pending: 15 },
            { month: 'Dez', completed: 70, pending: 5 },
            { month: 'Jan', completed: 65, pending: 10 },
            { month: 'Fev', completed: 80, pending: 4 },
        ];

        return {
            kpis: {
                clientsCount,
                docsProcessed: docsCount,
                pendingTasks,
                efficiency: '94%'
            },
            productivityData
        };
    }
};

module.exports = analyticsService;
