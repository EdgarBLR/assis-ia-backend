const OpenAI = require('openai');
const { Client } = require('pg');
require('dotenv').config();

const getOpenAI = () => new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const vectorService = {
    /**
     * Gera um embedding para o texto fornecido.
     * @param {string} text 
     */
    async generateEmbedding(text) {
        try {
            const openai = getOpenAI();
            const response = await openai.embeddings.create({
                model: "text-embedding-3-small",
                input: text,
            });
            return response.data[0].embedding;
        } catch (error) {
            console.error('Erro ao gerar embedding:', error);
            throw error;
        }
    },

    /**
     * Salva um embedding no banco de dados.
     */
    async saveEmbedding(documentId, content, metadata = {}) {
        const embedding = await this.generateEmbedding(content);

        const client = new Client({
            connectionString: process.env.DATABASE_URL.split('?')[0],
            ssl: { rejectUnauthorized: false }
        });

        try {
            await client.connect();
            await client.query(
                'INSERT INTO "DocumentEmbedding" ("documentId", "content", "embedding", "metadata") VALUES ($1, $2, $3, $4)',
                [documentId, content, JSON.stringify(embedding), JSON.stringify(metadata)]
            );
        } catch (error) {
            console.error('Erro ao salvar embedding:', error);
            throw error;
        } finally {
            await client.end();
        }
    },

    /**
     * Busca conteúdos similares.
     */
    async searchSimilar(text, limit = 5) {
        const queryEmbedding = await this.generateEmbedding(text);

        const client = new Client({
            connectionString: process.env.DATABASE_URL.split('?')[0],
            ssl: { rejectUnauthorized: false }
        });

        try {
            await client.connect();
            const res = await client.query(
                `SELECT "content", "metadata", 1 - ("embedding" <=> $1) as similarity 
                 FROM "DocumentEmbedding" 
                 ORDER BY similarity DESC 
                 LIMIT $2`,
                [JSON.stringify(queryEmbedding), limit]
            );
            return res.rows;
        } catch (error) {
            console.error('Erro na busca semântica:', error);
            throw error;
        } finally {
            await client.end();
        }
    }
};

module.exports = vectorService;
