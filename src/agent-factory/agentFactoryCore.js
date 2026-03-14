const manualParser = require('./manualParser');
const apiParser = require('./apiParser');
const skillExtractor = require('./skillExtractor');
const agentGenerator = require('./agentGenerator');
const scenarioGenerator = require('../agent-validation/scenarioGenerator');
const agentTester = require('../agent-validation/agentTester');
const resultAnalyzer = require('../agent-validation/resultAnalyzer');
const agentManager = require('../agents/agentManager');

/**
 * Agent Factory Core
 * Orquestra o ciclo completo de criação autônoma de agentes.
 */
const agentFactoryCore = {
    /**
     * Inicia o processo de criação de um novo agente.
     */
    async createAgent(name, manualPath, apiDoc) {
        console.log(`🚀 Iniciando Agent Factory para: ${name}`);

        try {
            // 1. Parse de Conhecimento
            const knowledge = await manualParser.parse(manualPath);
            const endpoints = await apiParser.parse(apiDoc);

            // 2. Extração de Habilidades
            const skills = await skillExtractor.extract(knowledge, endpoints);

            // 3. Geração do Código
            const generationResult = await agentGenerator.generate(name, skills);

            // 4. Instanciação para Validação
            const GeneratedAgentClass = require(generationResult.path);
            const agentInstance = new GeneratedAgentClass();

            // 5. Validação
            const scenarios = scenarioGenerator.generateScenarios(name, skills);
            const testResults = await agentTester.runTests(agentInstance, scenarios);
            const validation = resultAnalyzer.analyze(testResults);

            console.log(`📊 Resultado da Validação: Score ${validation.confidence} | Aprovado: ${validation.approved}`);

            // 6. Registro
            if (validation.approved) {
                agentManager.register(name, agentInstance);
                return {
                    status: 'SUCCESS',
                    agentName: name,
                    confidence: validation.confidence,
                    path: generationResult.path
                };
            } else {
                return {
                    status: 'REJECTED',
                    agentName: name,
                    confidence: validation.confidence,
                    reason: 'Baixo score de confiança nos testes automáticos.'
                };
            }

        } catch (error) {
            console.error('❌ Erro na Agent Factory:', error);
            throw error;
        }
    }
};

module.exports = agentFactoryCore;
