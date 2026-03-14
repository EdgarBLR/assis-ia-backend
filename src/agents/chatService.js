const vectorService = require('./vectorService');

/**
 * Serviço de Memória do Chat
 */
const chatService = {
    /**
     * Salva uma mensagem no histórico
     */
    async saveMessage(prisma, userId, role, content) {
        const msg = await prisma.chatMessage.create({
            data: {
                userId,
                role,
                content
            }
        });

        // Opcional: Indexar mensagens do usuário para busca semântica futura
        if (role === 'user') {
            try {
                await vectorService.saveEmbedding(msg.id, content, { userId, type: 'chat_message' });
            } catch (err) {
                console.error('Erro ao indexar mensagem de chat:', err);
            }
        }

        return msg;
    },

    /**
     * Recupera o histórico de mensagens de um usuário
     */
    async getHistory(prisma, userId, limit = 20) {
        return prisma.chatMessage.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: limit
        });
    },

    /**
     * Busca contexto relevante (RAG) para uma pergunta.
     */
    async getRelevantContext(query) {
        try {
            const similar = await vectorService.searchSimilar(query, 3);
            return similar.map(s => s.content).join('\n---\n');
        } catch (error) {
            console.error('Erro ao buscar contexto RAG:', error);
            return '';
        }
    }
};

module.exports = chatService;
