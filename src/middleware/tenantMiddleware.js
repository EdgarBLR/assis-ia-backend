/**
 * Middleware de Isolamento Multi-Tenant
 * Garante que usuários só acessem dados de sua própria empresa/tenant
 */
const tenantMiddleware = (fastify) => {
    fastify.addHook('preHandler', async (request, reply) => {
        // Pula se for rota pública ou webhook
        if (request.url.startsWith('/api/webhooks')) return;

        const user = request.user;
        if (!user) return;

        // Decorator para facilitar buscas filtradas no Prisma
        request.tenantFilter = {
            tenantId: user.tenantId
        };

        if (user.companyId) {
            request.companyFilter = {
                companyId: user.companyId
            };
        }
    });

    /**
     * Utilitário para garantir que um recurso pertence ao tenant/company
     */
    fastify.decorate('checkAccess', (resource, user) => {
        if (resource.tenantId !== user.tenantId) {
            throw new Error('Acesso negado: Tenant divergente');
        }
        if (user.companyId && resource.companyId !== user.companyId) {
            throw new Error('Acesso negado: Empresa divergente');
        }
    });
};

module.exports = tenantMiddleware;
