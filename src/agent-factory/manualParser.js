/**
 * Agent Factory - Manual Parser
 * Extrai conhecimento estruturado de manuais (PDF/Texto).
 */
const manualParser = {
    /**
     * Simula a extração de texto de um arquivo.
     * @param {string} filePath 
     */
    async parse(filePath) {
        console.log(`📄 Analisando manual: ${filePath}`);

        // Em um cenário real, usaríamos pdf-parse ou OCR.
        // Aqui simularemos o retorno de chunks de texto.
        return [
            "Para consultar um CNO (Cadastro Nacional de Obras), o usuário deve possuir o CNPJ da empresa.",
            "A regularização de obra no SERO exige a validação do CNO e o envio da declaração de débitos.",
            "O encerramento de obra deve ser feito após a emissão do Habite-se."
        ];
    },

    /**
     * Divide o texto em fragmentos menores para processamento.
     */
    chunkText(text, size = 1000) {
        // Lógica simples de chunking por sentenças ou tamanho.
        return text.split('.');
    }
};

module.exports = manualParser;
