require('dotenv').config();
const aiService = require('./src/services/aiService');
const fs = require('fs');
const path = require('path');

async function testIA() {
    const testFilePath = path.join(__dirname, 'uploads', 'test-nfe.txt');

    console.log('📄 Lendo arquivo de teste:', testFilePath);
    const text = fs.readFileSync(testFilePath, 'utf-8');

    console.log('⏳ Enviando para IA (GPT-4o) classificar...');
    const classification = await aiService.classifyDocument(text);

    console.log('\n--- RESULTADO CLASSIFICAÇÃO ---');
    console.log('🏷️  Tipo:', classification);

    console.log('\n⏳ Extraindo dados estruturados da NF-e...');
    const extracted = await aiService.extractData(text, classification);

    console.log('\n--- DADOS EXTRAÍDOS ---');
    console.log(JSON.stringify(extracted, null, 2));
}

testIA().catch(console.error);
