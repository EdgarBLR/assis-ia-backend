const OpenAI = require('openai');
let openai;

/**
 * Agent Factory - Skill Extractor
 * Identifica habilidades e mapeia comandos a partir de conhecimento extraído.
 */
const skillExtractor = {
    /**
     * Extrai habilidades técnicas de uma lista de fatos/documentação.
     */
    async extract(knowledgeChunks, apiEndpoints) {
        if (!openai) {
            openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        }
        console.log('🧠 Extraindo habilidades via IA...');

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: `Você é um engenheiro de prompts. Analise o conhecimento de manuais e os endpoints de API fornecidos. 
                    Identifique quais "habilidades" (skills) um agente automatizado pode realizar.
                    Retorne um JSON contendo um array "skills", onde cada item tem: "name", "description", "endpoint", "method".
                    IMPORTANTE: O campo "name" deve ser obrigatoriamente em camelCase e ser um identificador JavaScript válido (sem espaços ou acentos).`
                },
                {
                    role: "user",
                    content: `Conhecimento: ${JSON.stringify(knowledgeChunks)}\n\nEndpoints: ${JSON.stringify(apiEndpoints)}`
                }
            ],
            response_format: { type: "json_object" }
        });

        return JSON.parse(response.choices[0].message.content).skills;
    }
};

module.exports = skillExtractor;
