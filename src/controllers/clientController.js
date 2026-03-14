const clientController = {
    async getClients(request, reply, prisma) {
        return prisma.company.findMany({
            where: { tenantId: request.user.tenantId }
        });
    },

    async createClient(request, reply, prisma) {
        const { name, segment, regime } = request.body;
        return prisma.company.create({
            data: {
                name,
                segment,
                regime,
                tenantId: request.user.tenantId
            }
        });
    },

    async getPortalProcesses(request, reply, prisma) {
        if (request.user.role !== 'CLIENT') {
            return reply.status(403).send({ error: 'Acesso restrito ao portal do cliente' });
        }

        return prisma.process.findMany({
            where: { companyId: request.user.companyId },
            include: { steps: true }
        });
    }
};

module.exports = clientController;
