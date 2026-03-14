const vectorService = require('../decision-engine/vectorService');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Serviço de Categorização Contábil Inteligente
 */
const categorizationService = {
    /**
     * Sugere uma categoria para uma transação baseada na descrição.
     */
    async suggestCategory(description) {
        try {
            // 1. Busca semântica por transações similares no passado
            const context = await vectorService.searchSimilar(description, 3);

            // 2. Se houver matches fortes, usa a categoria do histórico
            if (context.length > 0 && context[0].similarity > 0.85) {
                return context[0].metadata.category;
            }

            // 3. Caso contrário, usa LLM para classificar (Zero-shot)
            const OpenAI = require('openai');
            const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

            const response = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    {
                        role: "system",
                        content: "Você é um contador experiente. Classifique a transação bancária em uma categoria contábil (ex: ALUGUEL, SALÁRIOS, RECEITA_VENDAS, IMPOSTOS, UTILIDADES). Responda APENAS com o nome da categoria."
                    },
                    {
                        role: "user",
                        content: `Classifique esta transação: "${description}"`
                    }
                ]
            });

            return response.choices[0].message.content.trim();
        } catch (error) {
            console.error('Erro na categorização:', error);
            return 'OUTROS';
        }
    },

    /**
     * Processa e categoriza uma nova transação.
     */
    async processTransaction(data) {
        const categoryName = await this.suggestCategory(data.description);

        // Upsert da categoria
        const category = await prisma.accountingCategory.upsert({
            where: { name: categoryName },
            update: {},
            create: { name: categoryName }
        });

        const transaction = await prisma.transaction.create({
            data: {
                amount: data.amount,
                date: data.date,
                description: data.description,
                type: data.type,
                company: { connect: { id: data.companyId } },
                category: { connect: { id: category.id } }
            }
        });

        // Indexa para o futuro (RAG)
        await vectorService.saveEmbedding(transaction.id, data.description, {
            type: 'transaction',
            category: categoryName
        });

        return transaction;
    }
};

module.exports = categorizationService;
