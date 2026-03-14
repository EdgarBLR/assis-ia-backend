const { createWorker } = require('tesseract.js');
const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const fs = require('fs');

const ocrService = {
    /**
     * Extrai texto usando Tesseract.js (Local/Rápido)
     */
    async extractText(imagePath) {
        try {
            const worker = await createWorker('por');
            const { data: { text } } = await worker.recognize(imagePath);
            await worker.terminate();
            return text;
        } catch (error) {
            console.error('Erro no OCR Tesseract:', error);
            throw error;
        }
    },

    /**
     * Extrai texto e dados visuais usando OpenAI Vision (Preciso)
     * @param {string} imagePath 
     */
    async extractTextVision(imagePath) {
        try {
            const imageBuffer = fs.readFileSync(imagePath);
            const base64Image = imageBuffer.toString('base64');

            const response = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    {
                        role: "user",
                        content: [
                            { type: "text", text: "Transcreva todo o texto deste documento contábil com máxima precisão. Retorne APENAS o texto extraído." },
                            {
                                type: "image_url",
                                image_url: {
                                    url: `data:image/jpeg;base64,${base64Image}`,
                                },
                            },
                        ],
                    },
                ],
            });

            return response.choices[0].message.content;
        } catch (error) {
            console.error('Erro no OpenAI Vision:', error);
            throw error;
        }
    },

    /**
     * Analisa o layout do documento para identificar campos específicos.
     * @param {string} imagePath 
     */
    async analyzeLayout(imagePath) {
        try {
            const imageBuffer = fs.readFileSync(imagePath);
            const base64Image = imageBuffer.toString('base64');

            const response = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    {
                        role: "system",
                        content: "Você é um especialista em análise de documentos contábeis brasileiros. Analise a imagem e identifique a estrutura: onde estão tabelas, cabeçalhos, valores totais e datas. Retorne um JSON estruturado."
                    },
                    {
                        role: "user",
                        content: [
                            { type: "text", text: "Analise o layout deste documento e retorne os metadados estruturais em JSON." },
                            {
                                type: "image_url",
                                image_url: {
                                    url: `data:image/jpeg;base64,${base64Image}`,
                                },
                            },
                        ],
                    },
                ],
                response_format: { type: "json_object" },
            });

            return JSON.parse(response.choices[0].message.content);
        } catch (error) {
            console.error('Erro na análise de layout Vision:', error);
            throw error;
        }
    }
};

module.exports = ocrService;
