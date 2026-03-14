require('dotenv').config();
const taxService = require('../src/services/taxService');
const categorizationService = require('../src/services/categorizationService');
const reconciliationService = require('../src/services/reconciliationService');

async function main() {
    try {
        console.log('🧪 Iniciando Verificação do NÍVEL 3 (Inteligência Contábil)...');
        const companyId = 'test-company-123';

        const { PrismaClient } = require('@prisma/client');
        const prisma = new PrismaClient();

        // 0. Setup: Criar Tenant/Company/Document para o teste
        await prisma.tenant.upsert({
            where: { id: 'test-tenant' },
            update: {},
            create: { id: 'test-tenant', name: 'Test Tenant', plan: 'FREE' }
        });
        await prisma.company.upsert({
            where: { id: companyId },
            update: {},
            create: { id: companyId, name: 'Test Company', segment: 'SERVICOS', regime: 'SIMPLES_NACIONAL', tenantId: 'test-tenant' }
        });
        await prisma.document.create({
            data: { fileName: 'nota.pdf', type: 'NF-E', companyId }
        });

        // 1. Testar Motor de Impostos
        console.log('\n📊 Testando Motor de Impostos (Simples Nacional)...');
        const taxRecord = await taxService.calculateMonthlyTax(companyId, '2026-03');
        console.log('✅ Imposto calculado:', JSON.stringify(taxRecord, null, 2));

        // 2. Testar Categorização AI
        console.log('\n🧠 Testando Categorização AI de Transações...');
        const tx = await categorizationService.processTransaction({
            amount: 1500.00,
            date: new Date(),
            description: 'Pagamento de Aluguel Sala 102',
            type: 'EXPENSE',
            companyId
        });
        console.log('✅ Transação categorizada:', JSON.stringify(tx, null, 2));

        // 3. Testar Conciliação (Mock)
        console.log('\n🔄 Testando Conciliação Bancária...');
        const matches = await reconciliationService.reconcileCompany(companyId);
        console.log('✅ Matches encontrados:', matches.length);

        console.log('\n🚀 VERIFICAÇÃO DO NÍVEL 3 CONCLUÍDA COM SUCESSO!');

    } catch (error) {
        console.error('❌ Erro na verificação do Nível 3:', error);
    }
}

main();
