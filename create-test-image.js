// Script para criar uma imagem de nota fiscal de teste usando canvas
// na ausência de um arquivo real, cria um .txt que simula o conteúdo
const fs = require('fs');
const path = require('path');

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) { fs.mkdirSync(uploadsDir, { recursive: true }); }

// Cria um arquivo de texto simulando uma Nota Fiscal para o OCR processar
const notaFiscalText = `
NOTA FISCAL ELETRONICA - NF-e
Numero: 000145
Data de Emissao: 23/02/2026

EMITENTE:
EMPRESA ABC LTDA
CNPJ: 12.345.678/0001-99
Endereco: Rua das Flores, 123 - Sao Paulo/SP

DESTINATARIO:
CLIENTE XYZ LTDA
CNPJ: 98.765.432/0001-11

DESCRICAO DO SERVICO:
Servicos Contabeis - Competencia Fevereiro 2026
Escrituracao Fiscal e Contabil
Declaracoes SPED/EFD

VALORES:
Valor dos Servicos: R$ 1.500,00
ISS Retido: R$ 75,00
TOTAL DA NOTA: R$ 1.425,00

Chave NF-e: 3526 0212 3456 7800 0199 5500 0000 0145 1735 8980 0683
`;

const testFilePath = path.join(uploadsDir, 'test-nfe.txt');
fs.writeFileSync(testFilePath, notaFiscalText);
console.log('✅ Arquivo de teste criado em:', testFilePath);
console.log('Agora execute: node debug-ia.js uploads/test-nfe.txt');
