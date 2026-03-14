const feedbackCollector = require('./src/self-evolution/feedbackCollector');
const evolutionManager = require('./src/self-evolution/evolutionManager');
require('dotenv').config();

/**
 * Script de Verificação: Self-Evolution System
 * Simula uma "falha recorrente" para testar se o sistema aprende.
 */
async function testSelfEvolution() {
    console.log('🏗️ Testando infraestrutura de Automação Evolutiva (Self-Evolution)...');

    // 1. Simular falhas repetidas (Padrão de Falha)
    console.log('📉 Simulando falhas repetidas de um comando não mapeado...');
    for (let i = 0; i < 5; i++) {
        await feedbackCollector.collect({
            taskType: 'COMMAND',
            input: 'Assis, emitir certidão de nascimento',
            output: 'Desculpe, não sei como fazer isso.',
            status: 'FAILED',
            error: 'Command not recognized',
            duration: 1500
        });
    }

    // 2. Simular sucessos (Padrão de Sucesso para Cache)
    console.log('📈 Simulando sucessos repetidos para extração...');
    for (let i = 0; i < 3; i++) {
        await feedbackCollector.collect({
            taskType: 'EXTRACTION',
            input: 'Extrair CNPJ de: 12.345.678/0001-90',
            output: '{"cnpj": "12.345.678/0001-90"}',
            status: 'SUCCESS',
            duration: 2500
        });
    }

    // 3. Rodar Ciclo de Evolução
    console.log('\n🔄 Rodando Ciclo de Evolução para analisar os dados simulados...');
    await evolutionManager.runCycle();

    console.log('\n✅ Teste do Self-Evolution concluído.');
}

testSelfEvolution();
