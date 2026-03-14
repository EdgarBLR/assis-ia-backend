const feedbackCollector = require('./feedbackCollector');
const learningEngine = require('./learningEngine');
const agentImprover = require('./agentImprover');
const strategyDiscoverer = require('./strategyDiscoverer');

/**
 * Evolution Manager - Self-Evolution System
 * Coordena o ciclo de vida da evolução autônoma.
 */
class EvolutionManager {
    /**
     * Executa o ciclo de evolução.
     */
    async runCycle() {
        console.log('\n🌟 Self-Evolution: Iniciando ciclo de evolução...');

        // 1. Coleta feedbacks recentes
        const recentData = feedbackCollector.getRecentFeedbacks(100);

        // 2. Análise de Padrões
        const analysis = await learningEngine.analyzePatterns();

        if (analysis) {
            // 3. Aplica melhorias (Regras, Prompts)
            await agentImprover.applyImprovements(analysis);

            // 4. Descobre novas estratégias
            const discovery = await strategyDiscoverer.discover(recentData);
            if (discovery) {
                console.log('💡 Nova estratégia descoberta:', discovery.suggestedAction);
            }
        }

        console.log('🏁 Self-Evolution: Ciclo concluído.\n');
    }
}

module.exports = new EvolutionManager();
