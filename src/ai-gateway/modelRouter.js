/**
 * AI Gateway - Model Router
 * Decide qual modelo de linguagem usar baseado na complexidade da tarefa.
 */
const modelRouter = {
    /**
     * Determina o modelo ideal.
     * @param {string} taskType 
     * @param {string} prompt 
     */
    route(taskType, prompt) {
        console.log(`🚦 Model Router: Roteando tarefa tipo: ${taskType}`);

        const expensiveTasks = ['ANALYSIS', 'LEGAL_DEBATE', 'COMPLEX_EXTRACTION'];

        if (expensiveTasks.includes(taskType) || prompt.length > 2000) {
            console.log('💎 Modelo selecionado: gpt-4o');
            return 'gpt-4o';
        }

        console.log('⚡ Modelo selecionado: gpt-4o-mini');
        return 'gpt-4o-mini';
    }
};

module.exports = modelRouter;
