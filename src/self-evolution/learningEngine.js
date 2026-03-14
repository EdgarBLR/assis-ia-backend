const aiGateway = require('../ai-gateway/aiGateway');
const feedbackCollector = require('./feedbackCollector');

/**
 * Learning Engine - Self-Evolution System
 * Analisa feedbacks e detecta padrões de melhoria.
 */
class LearningEngine {
    /**
     * Analisa feedbacks recentes e gera insights de melhoria.
     */
    async analyzePatterns() {
        const feedbacks = feedbackCollector.getRecentFeedbacks(50);
        if (feedbacks.length < 5) {
            console.log('⏳ Self-Evolution: Dados insuficientes para análise (mínimo 5).');
            return null;
        }

        console.log(`🧠 Self-Evolution: Analisando padrões em ${feedbacks.length} feedbacks...`);

        const prompt = `
            Você é o Cérebro de Evolução da Assis IA.
            Analise os feedbacks e responda APENAS com o JSON puro, sem blocos de código markdown.

            Dados:
            ${JSON.stringify(feedbacks.map(f => ({ type: f.taskType, status: f.status, error: f.error, input: f.input })), null, 2)}

            Formato:
            {
                "detectedPatterns": ["padrão"],
                "recommendations": [
                    { "type": "RULE", "pattern": "string_match", "action": "action_name", "reason": "porque" }
                ]
            }
        `;

        try {
            const response = await aiGateway.chat('EVOLUTION_ANALYSIS', [
                { role: 'system', content: 'Você é um otimizador de sistemas. Responda apenas JSON.' },
                { role: 'user', content: prompt }
            ]);

            let content = response.choices[0].message.content;

            // Limpeza de markdown caso o LLM insista
            content = content.replace(/```json/g, '').replace(/```/g, '').trim();

            const analysis = JSON.parse(content);
            console.log('✅ Self-Evolution: Análise de padrões concluída.');
            return analysis;
        } catch (error) {
            console.error('❌ Erro na análise de evolução:', error.message);
            return null;
        }
    }
}

module.exports = new LearningEngine();
