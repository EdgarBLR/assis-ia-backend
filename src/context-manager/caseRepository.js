const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const vectorService = require('../decision-engine/vectorService');

/**
 * Repositório de Casos
 * Gerencia a persistência de casos analisados e aprovados.
 */
const caseRepository = {
    /**
     * Salva um novo caso na base de conhecimento.
     */
    async saveCase(documentId, analysis, confidence, feedback = null) {
        try {
            // 1. Criar registro no banco de dados (Tabela de Casos ou metadados de Documentos)
            // Aqui vamos assumir que cada 'Caso' é um documento processado e aprovado.
            const document = await prisma.document.findUnique({ where: { id: documentId } });

            const caseData = {
                case_id: `CASE_${documentId}_${Date.now()}`,
                type: document.type,
                analysis,
                confidence,
                feedback,
                timestamp: new Date().toISOString()
            };

            // 2. Indexar no Vector Database para buscas futuras
            await vectorService.saveEmbedding(documentId, JSON.stringify(analysis), {
                type: 'case',
                classification: document.type,
                confidence: confidence,
                approved: !!feedback
            });

            console.log(`✅ Caso ${caseData.case_id} salvo e indexado com sucesso.`);
            return caseData;
        } catch (error) {
            console.error('Erro ao salvar caso:', error);
            throw error;
        }
    }
};

module.exports = caseRepository;
