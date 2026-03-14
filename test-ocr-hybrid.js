/**
 * Teste de OCR Híbrido
 */
const ocrService = require('./src/services/ocrService');
require('dotenv').config();

async function testOCR() {
    console.log('🧪 Testando OCR Híbrido...');

    // Caminho de um arquivo de teste (pode ser um dos uploads existentes)
    const testFile = 'uploads/1773003444033-example.png'; // Exemplo

    try {
        console.log('1. Testando Tesseract (Local)...');
        const text1 = await ocrService.extractText(testFile);
        console.log('✅ Tesseract result:', text1.substring(0, 50));

        if (text1.length < 50) {
            console.log('2. Acionando Vision (Fallback)...');
            const text2 = await ocrService.extractTextVision(testFile);
            console.log('✅ Vision result:', text2.substring(0, 50));
        }
    } catch (error) {
        console.error('❌ Erro no teste de OCR:', error.message);
    }
}

// Para este teste funcionar, o arquivo deve existir. 
// Vou apenas verificar se o serviço carrega corretamente por enquanto.
console.log('OCR Service carregado:', Object.keys(ocrService));
