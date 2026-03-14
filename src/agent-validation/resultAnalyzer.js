/**
 * Agent Validation - Result Analyzer
 * Analisa os resultados dos testes e calcula o score de confiança.
 */
const resultAnalyzer = {
    /**
     * Analisa o relatório de testes.
     */
    analyze(results) {
        console.log('📊 Analisando resultados da validação...');

        const total = results.length;
        const passed = results.filter(r => r.success && this.matchesExpected(r.output, r.expected)).length;

        const confidence = total > 0 ? passed / total : 0;

        return {
            confidence,
            approved: confidence >= 0.9,
            details: results
        };
    },

    /**
     * Verifica se o output bate com o esperado (lógica simplificada).
     */
    matchesExpected(output, expected) {
        return output.status === expected.status && output.action === expected.action;
    }
};

module.exports = resultAnalyzer;
