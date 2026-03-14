const bcrypt = require('bcryptjs');

const authController = {
    async login(request, reply, fastify, prisma) {
        const { email, password } = request.body;

        const user = await prisma.user.findUnique({
            where: { email },
            include: { tenant: true }
        });

        if (user && await bcrypt.compare(password, user.password)) {
            const token = fastify.jwt.sign({
                id: user.id,
                email: user.email,
                role: user.role,
                tenantId: user.tenantId
            });
            return { token, user: { name: user.name, email: user.email, role: user.role } };
        }

        reply.status(401).send({ error: 'Credenciais inválidas' });
    },

    async register(request, reply, prisma) {
        const { name, email, password, tenantName } = request.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        try {
            const result = await prisma.$transaction(async (tx) => {
                const tenant = await tx.tenant.create({
                    data: { name: tenantName, plan: 'FREE' }
                });

                const user = await tx.user.create({
                    data: {
                        name,
                        email,
                        password: hashedPassword,
                        role: 'ADMIN',
                        tenantId: tenant.id
                    }
                });

                return { user, tenant };
            });

            return result;
        } catch (error) {
            reply.status(400).send({ error: 'Erro ao registrar usuário: ' + error.message });
        }
    },

    async me(request) {
        return { user: request.user };
    }
};

module.exports = authController;
