const aiGateway = require('./src/ai-gateway/aiGateway');
require('dotenv').config();

/**
 * Script de Verificação: AI Gateway
 * Testa economia via regras, cache e roteamento.
 */
async function testAiGateway() {
    console.log('🏗️ Testando infraestrutura de Otimização de Custos (AI Gateway)...');

    const testCases = [
        {
            name: 'Regra Determinística (Grátis)',
            type: 'COMMAND',
            text: 'Assis, verificar dctfweb'
        },
        {
            name: 'Tarefa Simples (Fast/Mini)',
            type: 'EXTRACTION',
            text: 'Extrair CNPJ de: 00.000.000/0001-91'
        },
        {
            name: 'Análise Complexa (4o)',
            type: 'ANALYSIS',
            text: 'Realizar auditoria tributária completa no contrato de empreitada total em anexo.'
        }
    ];

    for (const test of testCases) {
        console.log(`\n--- Testando: ${test.name} ---`);

        const messages = [{ role: 'user', content: test.text }];

        // Primeira Chamada
        const result1 = await aiGateway.chat(test.type, messages);
        console.log(`Status: ${result1.source} | Modelo: ${result1.model || 'none'}`);

        // Segunda Chamada (Teste de Cache)
        if (result1.source === 'LLM') {
            const result2 = await aiGateway.chat(test.type, messages);
            console.log(`Repetição: ${result2.source} | Modelo: ${result2.model || 'none'}`);
        }
    }

    console.log('\n✅ Teste do AI Gateway concluído.');
}

testAiGateway();
