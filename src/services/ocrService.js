const { createWorker } = require('tesseract.js');

const ocrService = {
    /**
     * Extrai texto de uma imagem ou PDF (via buffer).
     * @param {Buffer|string} imagePath 
     */
    async extractText(imagePath) {
        try {
            const worker = await createWorker('por'); // 'por' para português
            const { data: { text } } = await worker.recognize(imagePath);
            await worker.terminate();
            return text;
        } catch (error) {
            console.error('Erro no OCR:', error);
            throw error;
        }
    }
};

module.exports = ocrService;
