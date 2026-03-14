const agentFactoryCore = require('./src/agent-factory/agentFactoryCore');
require('dotenv').config();

/**
 * Script de Verificação: Agent Factory
 * Simula a criação do agente "SERO" a partir de manual e API.
 */
async function testAgentFactory() {
    console.log('🏗️ Testando ciclo de vida da Agent Factory...');

    const mockApiDoc = {
        paths: {
            "/consultar-obra": {
                post: { summary: "Consultar situação da obra no SERO", operationId: "consultarObra" }
            },
            "/regularizar-obra": {
                post: { summary: "Regularizar pendências de obra", operationId: "regularizarObra" }
            }
        }
    };

    try {
        const result = await agentFactoryCore.createAgent(
            'sero',
            'knowledge/manuals/manual_sero_snippet.txt',
            mockApiDoc
        );

        console.log('\n--- RESULTADO FINAL DA FÁBRICA ---');
        console.log(JSON.stringify(result, null, 2));

        if (result.status === 'SUCCESS') {
            console.log('\n✅ Sucesso! Agente gerado, validado e registrado.');
        } else {
            console.log('\n⚠️ O agente foi criado mas não passou na validação.');
        }

    } catch (error) {
        console.error('💥 Falha crítica no teste:', error);
    }
}

testAgentFactory();
