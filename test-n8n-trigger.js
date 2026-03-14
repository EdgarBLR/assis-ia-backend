require('dotenv').config();
const n8nService = require('./src/services/n8nService');

async function testN8NTrigger() {
    console.log('🚀 Testando gatilho do n8n...');

    const mockData = {
        documentId: 'test-doc-123',
        classification: 'NF-E',
        metadata: {
            vendor: 'Empresa Teste',
            amount: 1500.00,
            date: '2026-03-07'
        },
        text: 'Este é um texto de exemplo para teste de integração com n8n.'
    };

    const webhookUrl = process.env.N8N_WEBHOOK_URL;

    if (!webhookUrl || webhookUrl.includes('your-uuid-here')) {
        console.warn('⚠️ N8N_WEBHOOK_URL não configurada corretamente no .env.');
        console.log('Dados que seriam enviados:', JSON.stringify(mockData, null, 2));
        return;
    }

    try {
        console.log(`📡 Enviando dados para: ${webhookUrl}`);
        const result = await n8nService.triggerWebhook(webhookUrl, mockData);
        console.log('✅ Resposta do n8n:', JSON.stringify(result, null, 2));
    } catch (error) {
        console.error('❌ Erro no teste:', error.message);
    }
}

testN8NTrigger();
