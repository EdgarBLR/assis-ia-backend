const tribunalService = require('./src/tribunal/tribunalService');
require('dotenv').config();

/**
 * Script de Teste: Tribunal de Agentes
 * Simula um caso de retenção de INSS em subempreitada para validar o debate.
 */
async function testTribunal() {
    console.log('🚀 Iniciando Teste do Tribunal de Agentes...');

    const mockCase = {
        caseType: 'INSS_OBRA_SUBEMPREITADA',
        text: 'Empresa contratou subempreiteira para serviços de hidráulica em obra de construção civil. Foi aplicada a retenção de 11%. É obrigatório ou existe exceção por ser empreitada total?',
        metadata: {
            tipo_contrato: 'empreitada total',
            setor: 'construção civil',
            valor_servico: 50000
        },
        similarCases: [
            {
                content: 'Caso anterior de obra com retenção de 11% confirmada por ser empreitada parcial.',
                similarity: 0.82
            }
        ]
    };

    try {
        const result = await tribunalService.analyzeCase(mockCase.caseType, mockCase);

        console.log('\n--- RESULTADO FINAL DO TRIBUNAL ---');
        console.log(`Veredito: ${result.finalDecision}`);
        console.log(`Confiança: ${result.confidence}`);
        console.log(`Justificativa: ${result.justification}`);
        console.log(`Leis Citadas: ${result.laws.join(', ')}`);
        console.log(`Agentes que Participaram: ${result.agentsInvolved.join(', ')}`);

        console.log('\n--- DETALHES DO DEBATE ---');
        result.opinions.forEach(op => {
            console.log(`[${op.agent.toUpperCase()}] Decisão: ${op.decision} | Peso: ${op.weight}`);
            console.log(`Raciocínio: ${op.reasoning}\n`);
        });

    } catch (error) {
        console.error('Falha no teste:', error);
    }
}

testTribunal();
