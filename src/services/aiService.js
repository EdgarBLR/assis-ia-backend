const OpenAI = require('openai');

let openaiClient;

function getOpenAIClient() {
    if (!process.env.OPENAI_API_KEY) {
        throw new Error('OPENAI_API_KEY não configurada. Defina a variável de ambiente para habilitar classificação/extracao por IA.');
    }

    if (!openaiClient) {
        openaiClient = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }

    return openaiClient;
}

const aiService = {
    /**
     * Classifica o tipo de documento baseado no texto extraído.
     * @param {string} text
     */
    async classifyDocument(text) {
        try {
            const openai = getOpenAIClient();
            const response = await openai.chat.completions.create({
                model: 'gpt-4o',
                messages: [
                    {
                        role: 'system',
                        content: "Você é um assistente contábil especializado em classificar documentos. Responda APENAS com uma das categorias: 'NF-E', 'EXTRATO_BANCARIO', 'GUIA_IMPOSTO', 'CONTRATO' ou 'OUTROS'."
                    },
                    {
                        role: 'user',
                        content: `Classifique este texto de documento:\n\n${text.substring(0, 2000)}`
                    }
                ],
                temperature: 0,
            });

            return response.choices[0].message.content.trim();
        } catch (error) {
            console.error('Erro ao classificar documento:', error);
            throw error;
        }
    },

    /**
     * Extrai dados estruturados de um documento.
     * @param {string} text
     * @param {string} type
     */
    async extractData(text, type) {
        try {
            const openai = getOpenAIClient();
            const response = await openai.chat.completions.create({
                model: 'gpt-4o',
                messages: [
                    {
                        role: 'system',
                        content: `Você é um assistente contábil. Extraia os dados principais do documento do tipo ${type} e retorne em formato JSON.`
                    },
                    {
                        role: 'user',
                        content: `Texto do documento:\n\n${text.substring(0, 4000)}`
                    }
                ],
                response_format: { type: 'json_object' },
            });

            return JSON.parse(response.choices[0].message.content);
        } catch (error) {
            console.error('Erro ao extrair dados:', error);
            throw error;
        }
    }
};

module.exports = aiService;
