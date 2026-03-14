/**
 * AI Gateway - Cache Layer
 * Gerencia cache de respostas de IA para evitar chamadas redundantes.
 */
const cacheLayer = {
    // Nota: Em produção, usaríamos Redis. Aqui simularemos com um Map simples.
    cache: new Map(),

    /**
     * Busca uma resposta no cache.
     */
    async get(key) {
        console.log(`💾 Cache Layer: Buscando chave: ${key.substring(0, 20)}...`);
        return this.cache.get(key);
    },

    /**
     * Salva uma resposta no cache.
     */
    async set(key, value, ttl = 3600) {
        console.log('💾 Cache Layer: Salvando resposta no cache.');
        this.cache.set(key, value);
    }
};

module.exports = cacheLayer;
