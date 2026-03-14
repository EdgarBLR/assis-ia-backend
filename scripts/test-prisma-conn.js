const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('📝 DATABASE_URL:', process.env.DATABASE_URL ? 'FOUND' : 'NOT FOUND');
        if (process.env.DATABASE_URL) {
            console.log('📝 DATABASE_URL (prefix):', process.env.DATABASE_URL.substring(0, 20));
        }
        console.log('🚀 Checking Prisma connection...');
        const userCount = await prisma.user.count();
        console.log(`✅ Connection OK. User count: ${userCount}`);

        const tenantCount = await prisma.tenant.count();
        console.log(`✅ Tenant count: ${tenantCount}`);
    } catch (error) {
        console.error('❌ Prisma Connection Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
