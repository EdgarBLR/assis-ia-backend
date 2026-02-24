const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
    const email = 'admin@assis.com';
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            console.log('Usuário admin já existe:', email);
            return;
        }

        const tenant = await prisma.tenant.create({
            data: { name: 'Escritório Central', plan: 'PRO' }
        });

        const user = await prisma.user.create({
            data: {
                name: 'Administrador',
                email,
                password: hashedPassword,
                role: 'ADMIN',
                tenantId: tenant.id
            }
        });

        console.log('✅ Admin criado com sucesso!');
        console.log('Email:', email);
        console.log('Senha:', password);
    } catch (error) {
        console.error('Erro ao criar admin:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
