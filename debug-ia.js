const ocrService = require('./src/services/ocrService');
const aiService = require('./src/services/aiService');
const path = require('path');
const fs = require('fs');

async function testSystem(imagePath) {
    console.log(`🔍 Iniciando teste completo para: ${path.basename(imagePath)}`);

    try {
        if (!fs.existsSync(imagePath)) {
            throw new Error('Arquivo não encontrado: ' + imagePath);
        }

        // 1. OCR
        console.log('⏳ Passo 1: Extraindo texto via OCR (Tesseract.js)...');
        const text = await ocrService.extractText(imagePath);
        console.log('✅ Texto extraído com sucesso (prévia):', text.substring(0, 100) + '...');

        // 2. IA Classification
        console.log('⏳ Passo 2: Analisando documento via IA (GPT-4o)...');
        const classification = await aiService.classifyDocument(text);
        console.log('✅ Classificação da IA:', JSON.stringify(classification, null, 2));

        console.log('\n--- RESULTADO FINAL ---');
        console.log(`📂 Documento: ${path.basename(imagePath)}`);
        console.log(`🏷️  Tipo: ${classification.type}`);
        console.log(`📊 Confiança: ${classification.confidence}`);
        console.log(`📝 Resumo: ${classification.summary}`);
        console.log('-----------------------');

    } catch (error) {
        console.error('❌ Erro durante o teste:', error.message);
    }
}

// O caminho da imagem gerada será passado aqui
const testFile = process.argv[2] || path.join(__dirname, 'uploads', 'test-doc.jpg');
testSystem(testFile);
