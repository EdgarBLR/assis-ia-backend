require('dotenv').config();
const rpaService = require('../src/services/rpaService');
const ocrService = require('../src/services/ocrService');
const path = require('path');

async function main() {
    try {
        console.log('🧪 Iniciando Verificação do NÍVEL 2...');

        // 1. Testar Persistência RPA
        console.log('\n📦 Testando Persistência RPA via Prisma...');
        const companyId = 'test-company-123';
        const tenantId = 'default-tenant-rpa';

        const { PrismaClient } = require('@prisma/client');
        const prisma = new PrismaClient();

        try {
            // Setup hierarquia: Tenant -> Company
            await prisma.tenant.upsert({
                where: { id: tenantId },
                update: {},
                create: { id: tenantId, name: 'RPA Test Tenant', plan: 'FREE' }
            });

            await prisma.company.upsert({
                where: { id: companyId },
                update: {},
                create: {
                    id: companyId,
                    name: 'RPA Test Company',
                    segment: 'SERVICOS',
                    regime: 'SIMPLES_NACIONAL',
                    tenantId: tenantId
                }
            });
            console.log('✅ Setup de dados (Tenant/Company) pronto.');
        } catch (e) {
            console.error('❌ Erro no setup de dados:', e.message);
            throw e;
        }

        const task = await rpaService.queueTask('EMITIR_GUIA_DAS', { value: 100.50 }, companyId);
        console.log('✅ Tarefa criada:', task.id);

        const pending = await rpaService.getPendingTasks('EMITIR_GUIA_DAS');
        const found = pending.find(t => t.id === task.id);

        if (found) {
            console.log('✅ Verificação de Persistência RPA: SUCESSO!');
        } else {
            console.error('❌ Verificação de Persistência RPA: FALHA (tarefa não encontrada no DB)!');
        }

        // 2. Testar OCR Layout (Se houver imagem disponível)
        // Usaremos uma imagem de upload anterior se existir, ou apenas validaremos a função
        console.log('\n👁️ Testando OCR Layout (Vision)...');
        // Tentando pegar qualquer arquivo na pasta uploads
        const fs = require('fs');
        const uploadsDir = path.join(__dirname, '..', 'uploads');
        const files = fs.readdirSync(uploadsDir).filter(f =>
            /\.(png|jpe?g|webp|gif)$/i.test(f)
        );

        if (files.length > 0) {
            const testFile = path.join(uploadsDir, files[0]);
            console.log(`Usando arquivo para teste: ${files[0]}`);
            const layout = await ocrService.analyzeLayout(testFile);
            console.log('✅ Layout analisado:', JSON.stringify(layout, null, 2));
            console.log('✅ Verificação de OCR Layout: SUCESSO!');
        } else {
            console.log('⚠️ Pulei teste de OCR Layout: Nenhuma imagem encontrada na pasta uploads.');
            console.log('DICA: Faça um upload via API ou coloque uma imagem em /uploads para testar Vision.');
        }

        console.log('\n🚀 VERIFICAÇÃO DO NÍVEL 2 CONCLUÍDA!');

    } catch (error) {
        console.error('❌ Erro na verificação do Nível 2:', error);
    }
}

main();
