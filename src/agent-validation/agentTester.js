/**
 * Agent Validation - Agent Tester
 * Executa o agente contra os cenários gerados.
 */
const agentTester = {
    /**
     * Testa um agente específico.
     */
    async runTests(agentInstance, scenarios) {
        console.log(`🏃 Executando bateria de testes para o agente: ${agentInstance.name}...`);

        const results = [];

        for (const scenario of scenarios) {
            try {
                const startTime = Date.now();
                const output = await agentInstance[scenario.skillName](scenario.input);
                const duration = Date.now() - startTime;

                results.push({
                    skill: scenario.skillName,
                    output,
                    expected: scenario.expected,
                    duration,
                    success: true
                });
            } catch (error) {
                results.push({
                    skill: scenario.skillName,
                    error: error.message,
                    success: false
                });
            }
        }

        return results;
    }
};

module.exports = agentTester;
