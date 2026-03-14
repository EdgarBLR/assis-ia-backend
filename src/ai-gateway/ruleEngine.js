/**
 * AI Gateway - Rule Engine
 * Intercepta comandos conhecidos para execução determinística sem IA.
 */
const ruleEngine = {
    rules: [
        { pattern: /verificar dctfweb/i, action: 'CHECK_DCTFWEB' },
        { pattern: /analisar folha/i, action: 'ANALYZE_PAYROLL' },
        { pattern: /consultar cno/i, action: 'CONSULT_CNO' },
        { pattern: /ajuda/i, action: 'SHOW_HELP' }
    ],

    /**
     * Tenta encontrar uma correspondência de regra para o texto.
     */
    match(text) {
        console.log('🔍 Rule Engine: Verificando regras determinísticas...');
        const match = this.rules.find(r => r.pattern.test(text));

        if (match) {
            console.log(`✅ Regra encontrada: ${match.action}`);
            return {
                type: 'RULE_MATCH',
                action: match.action,
                confidence: 1.0
            };
        }

        return null;
    }
};

module.exports = ruleEngine;
