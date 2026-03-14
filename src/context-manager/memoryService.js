const vectorService = require('../decision-engine/vectorService');

/**
 * Camada de Memória (Context Manager)
 * Responsável por buscar contextos similares para auxiliar a decisão da IA.
 */
const memoryService = {
    /**
     * Busca casos similares no histórico para referência.
     * @param {string} text Descrição do caso atual
     */
    async findSimilarCases(text, limit = 3) {
        console.log('🧠 Buscando casos similares na memória...');
        const results = await vectorService.searchSimilar(text, limit);

        // Filtra apenas resultados que tenham 'type: case' nos metadados (se implementado)
        // Por ora, retorna os mais similares do banco de vetores geral
        return results.map(r => ({
            content: r.content,
            metadata: r.metadata,
            similarity: r.similarity
        }));
    },

    /**
     * Busca legislação ou manuais relevantes baseado no texto.
     */
    async findRelevantKnowledge(text) {
        console.log('📚 Buscando legislação e manuais relevantes...');
        // Em uma implementação futura, teríamos coleções separadas no Vector DB
        // Aqui simulamos a busca na mesma base
        return await vectorService.searchSimilar(text, 5);
    }
};

module.exports = memoryService;
