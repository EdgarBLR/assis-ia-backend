const fs = require('fs');
const path = require('path');

/**
 * Agent Improver - Self-Evolution System
 * Aplica melhorias nos agentes e no Rule Engine.
 */
class AgentImprover {
    constructor() {
        this.ruleEnginePath = path.join(__dirname, '..', 'ai-gateway', 'ruleEngine.js');
    }

    /**
     * Aplica as recomendações da análise.
     */
    async applyImprovements(analysis) {
        if (!analysis || !analysis.recommendations) return;

        for (const rec of analysis.recommendations) {
            if (rec.type === 'RULE') {
                await this.addNewRule(rec);
            } else if (rec.type === 'PROMPT') {
                await this.updateAgentPrompt(rec);
            }
        }
    }

    /**
     * Adiciona uma nova regra determinística ao Rule Engine.
     */
    async addNewRule(rec) {
        console.log(`🛠️ Self-Evolution: Adicionando nova regra para: ${rec.pattern}`);

        try {
            let content = fs.readFileSync(this.ruleEnginePath, 'utf8');

            // Verifica se a regra já existe para evitar duplicatas
            if (content.includes(rec.pattern)) return;

            const newRule = `            { pattern: /${rec.pattern}/i, action: '${rec.action}' },\n`;

            // Insere no array de regras
            content = content.replace('const rules = [', `const rules = [\n${newRule}`);

            fs.writeFileSync(this.ruleEnginePath, content);
            console.log('✅ Self-Evolution: Rule Engine atualizado com nova regra.');
        } catch (err) {
            console.error('❌ Erro ao atualizar Rule Engine:', err.message);
        }
    }

    /**
     * Atualiza instruções de um agente (Simulado no MVP).
     */
    async updateAgentPrompt(rec) {
        console.log(`✨ Self-Evolution: Melhoria de prompt sugerida para ${rec.agent}: ${rec.update}`);
        // No MVP real, atualizaríamos o arquivo do agente ou o banco de dados de prompts.
    }
}

module.exports = new AgentImprover();
