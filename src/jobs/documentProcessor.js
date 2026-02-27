const { Queue, Worker } = require('bullmq');
const IORedis = require('ioredis');
const ocrService = require('../services/ocrService');
const aiService = require('../services/aiService');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const isDocumentProcessingEnabled = process.env.ENABLE_DOCUMENT_PROCESSING === 'true';

let documentQueue = null;
let documentWorker = null;

if (isDocumentProcessingEnabled) {
    const connection = new IORedis(process.env.REDIS_URL || 'redis://127.0.0.1:6379', {
        maxRetriesPerRequest: null,
    });

    connection.on('error', (error) => {
        console.error('Erro de conexão com Redis (fila de documentos):', error.message);
    });

    documentQueue = new Queue('document-processing', { connection });

    documentWorker = new Worker('document-processing', async (job) => {
        const { documentId, filePath } = job.data;
        console.log(`Processing document ${documentId}...`);

        try {
            // 1. OCR
            const text = await ocrService.extractText(filePath);

            // 2. Classificação AI
            const classification = await aiService.classifyDocument(text);

            // 3. Extração de Dados
            const metadata = await aiService.extractData(text, classification);

            // 4. Atualizar Banco de Dados
            await prisma.document.update({
                where: { id: documentId },
                data: {
                    type: classification,
                }
            });

            console.log(`Document ${documentId} processed successfully as ${classification}`);
            return metadata;
        } catch (error) {
            console.error(`Error processing document ${documentId}:`, error);
            throw error;
        }
    }, { connection });

    documentWorker.on('error', (error) => {
        console.error('Erro no worker de documentos:', error.message);
    });
}

module.exports = { documentQueue, documentWorker, isDocumentProcessingEnabled };
