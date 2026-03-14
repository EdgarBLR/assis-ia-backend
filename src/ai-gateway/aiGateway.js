const OpenAI = require('openai');
const ruleEngine = require('./ruleEngine');
const cacheLayer = require('./cacheLayer');
const modelRouter = require('./modelRouter');

/**
 * AI Gateway - Core Orchestrator
 * Gerencia o pipeline inteligente de chamadas de IA.
 */
class AiGateway {
    constructor() {
        this._openai = null;
    }

    get openai() {
        if (!this._openai) {
            this._openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        }
        return this._openai;
    }

    /**
     * Executa uma chamada de chat de forma otimizada.
     */
    async chat(taskType, messages) {
        const userText = messages[messages.length - 1].content;
        console.log(`🚀 AI Gateway: Processando requisição...`);

        // 1. Rule Engine (Totalmente Grátis)
        const ruleMatch = ruleEngine.match(userText);
        if (ruleMatch) {
            return {
                id: 'rule-' + Date.now(),
                choices: [{ message: { content: JSON.stringify(ruleMatch) } }],
                model: 'rule-engine',
                source: 'RULE'
            };
        }

        // 2. Cache Layer (Rápido e Barato)
        const cacheKey = JSON.stringify(messages);
        const cachedResponse = await cacheLayer.get(cacheKey);
        if (cachedResponse) {
            console.log('✅ AI Gateway: Resposta servida do cache.');
            return { ...cachedResponse, source: 'CACHE' };
        }

        // 3. Model Router (Otimização de Custo)
        const selectedModel = modelRouter.route(taskType, userText);

        console.log(`📡 AI Gateway: Chamando OpenAI (${selectedModel})...`);
        const response = await this.openai.chat.completions.create({
            model: selectedModel,
            messages: messages
        });

        // Salvar no cache para uso futuro
        await cacheLayer.set(cacheKey, response);

        return { ...response, source: 'LLM' };
    }
}

module.exports = new AiGateway();
