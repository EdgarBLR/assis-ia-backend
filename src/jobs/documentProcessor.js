const { Queue, Worker } = require('bullmq');
const IORedis = require('ioredis');
const ocrService = require('../services/ocrService');
const aiService = require('../services/aiService');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const connection = new IORedis(process.env.REDIS_URL || 'redis://127.0.0.1:6379', {
    maxRetriesPerRequest: null,
});

const documentQueue = new Queue('document-processing', { connection });

const documentWorker = new Worker('document-processing', async (job) => {
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
                // Aqui poderíamos salvar o metadata em uma coluna JSON se existisse
            }
        });

        console.log(`Document ${documentId} processed successfully as ${classification}`);
    } catch (error) {
        console.error(`Error processing document ${documentId}:`, error);
        throw error;
    }
}, { connection });

module.exports = { documentQueue, documentWorker };
