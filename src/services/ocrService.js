const { createWorker } = require('tesseract.js');

let workerInstance = null;

async function getWorker() {
    if (!workerInstance) {
        workerInstance = await createWorker('por'); // 'por' para português
    }
    return workerInstance;
}

async function terminateWorker() {
    if (workerInstance) {
        await workerInstance.terminate();
        workerInstance = null;
    }
}

process.once('SIGTERM', terminateWorker);
process.once('SIGINT', terminateWorker);

const ocrService = {
    /**
     * Extrai texto de uma imagem ou PDF (via buffer).
     * @param {Buffer|string} imagePath 
     */
    async extractText(imagePath) {
        try {
            const worker = await getWorker();
            const { data: { text } } = await worker.recognize(imagePath);
            return text;
        } catch (error) {
            console.error('Erro no OCR:', error);
            throw error;
        }
    }
};

module.exports = ocrService;
