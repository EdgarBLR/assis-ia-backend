require('dotenv').config();
const vectorService = require('../src/services/vectorService');

async function main() {
    try {
        console.log('🧪 Testando Busca Semântica (RAG)...');

        // 1. Salvar um exemplo
        console.log('📝 Indexando documento de teste...');
        await vectorService.saveEmbedding('test-rag-1', 'O prazo para entrega da ECF (Escrituração Contábil Fiscal) é o último dia útil de julho.', { topic: 'ECF' });

        // 2. Buscar por similaridade
        console.log('🔍 Buscando por: "qual o prazo da contabilidade fiscal?"');
        const results = await vectorService.searchSimilar('qual o prazo da contabilidade fiscal?', 1);

        console.log('✅ Resultado encontrado:');
        console.log(JSON.stringify(results, null, 2));

        if (results.length > 0 && results[0].similarity > 0.8) {
            console.log('🚀 TESTE DE RAG CONCLUÍDO COM SUCESSO!');
        } else {
            console.log('⚠️ Teste de RAG inconclusivo (similaridade baixa).');
        }

    } catch (error) {
        console.error('❌ Erro no teste de RAG:', error);
    }
}

main();
