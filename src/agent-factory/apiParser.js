/**
 * Agent Factory - API Parser
 * Interpreta documentação técnica de APIs (Swagger/JSON).
 */
const apiParser = {
    /**
     * Analisa um arquivo de definição de API.
     * @param {Object} apiDefinition 
     */
    async parse(apiDefinition) {
        console.log('🌐 Analisando documentação de API...');

        const endpoints = [];

        if (apiDefinition.paths) {
            Object.entries(apiDefinition.paths).forEach(([path, methods]) => {
                Object.entries(methods).forEach(([method, detail]) => {
                    endpoints.push({
                        url: path,
                        method: method.toUpperCase(),
                        summary: detail.summary || detail.description,
                        operationId: detail.operationId
                    });
                });
            });
        }

        return endpoints;
    }
};

module.exports = apiParser;
