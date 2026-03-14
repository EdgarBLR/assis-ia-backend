const agentTribunal = require('./agentTribunal');

/**
 * Camada 5 — Tribunal Virtual
 * Orquestra o Tribunal de Agentes para análise jurídica e tributária profunda.
 */
const tribunalService = {
    /**
     * Analisa um caso específico utilizando o Tribunal de Agentes.
     * @param {string} caseType Tipo do caso (ex: 'LICENCA_MATERNIDADE')
     * @param {Object} context Dados do contexto (texto, metadata, casos similares)
     */
    async analyzeCase(caseType, context) {
        console.log(`⚖️ Tribunal Virtual: Acionando Tribunal de Agentes para ${caseType}...`);

        try {
            // Chama a deliberação multi-agente
            const result = await agentTribunal.evaluate({
                caseType,
                ...context
            });

            return {
                case: caseType,
                ...result
            };
        } catch (error) {
            console.error('Erro no Tribunal Virtual:', error);
            return {
                case: caseType,
                status: 'ERROR',
                finalDecision: 'Análise indisponível no momento.',
                confidence: 0,
                timestamp: new Date().toISOString()
            };
        }
    }
};

module.exports = tribunalService;
