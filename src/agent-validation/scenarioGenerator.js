/**
 * Agent Validation - Scenario Generator
 * Cria casos de teste para validar as habilidades do agente.
 */
const scenarioGenerator = {
    /**
     * Gera cenários de teste baseados nas skills do agente.
     */
    generateScenarios(agentName, skills) {
        console.log(`🧪 Gerando cenários de teste para ${agentName}...`);

        return skills.map(skill => {
            return {
                skillName: skill.name,
                input: { test: true, data: `Mock data for ${skill.name}` },
                expected: { status: 'SUCCESS', action: skill.name }
            };
        });
    }
};

module.exports = scenarioGenerator;
