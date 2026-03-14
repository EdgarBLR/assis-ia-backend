const caseRepository = require('./caseRepository');
const memoryService = require('./memoryService');

/**
 * Serviço de Aprendizado
 * Orquestra o loop de feedback entre humano e IA.
 */
const learningService = {
    /**
     * Processa a aprovação ou correção de um usuário sobre uma análise.
     */
    async processFeedback(documentId, analysis, confidence, feedback) {
        console.log(`🧠 Processando feedback para documento ${documentId}...`);

        // 1. Salvar o caso como referência de "verdade" (Ground Truth)
        const savedCase = await caseRepository.saveCase(documentId, analysis, confidence, feedback);

        // 2. Lógica de Evolução (Fase 2 do blueprint)
        // Se houver uma correção (feedback ≠ null), poderíamos marcar para retreinamento
        // ou criar uma regra de exceção no decision-engine.
        if (feedback && feedback.isCorrection) {
            console.log('⚠️ Correção detectada. Atualizando base de estratégias...');
            // Futuro: await strategyService.updateFromCorrection(feedback);
        }

        return {
            status: 'LEARNED',
            caseId: savedCase.case_id,
            improved: true
        };
    }
};

module.exports = learningService;
