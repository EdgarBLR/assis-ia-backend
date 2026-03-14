const agentFactoryCore = require('./src/agent-factory/agentFactoryCore');
require('dotenv').config();

/**
 * Script de Geração: Conectores Especializados (MVP)
 */
async function generateConnectors() {
    console.log('🏗️ Gerando conectores eCAC e Domínio via Factory...');

    try {
        // 1. Gerar eCAC Agent
        const ecacDoc = require('./knowledge/api/ecac-definition.json');
        const ecacResult = await agentFactoryCore.createAgent('ecac', 'knowledge/manuals/manual_ecac_snippet.txt', ecacDoc);
        console.log(`✅ Agente eCAC: ${ecacResult.status}`);

        // 2. Gerar Domínio Agent
        const dominioDoc = require('./knowledge/api/dominio-definition.json');
        const dominioResult = await agentFactoryCore.createAgent('dominio', 'knowledge/manuals/manual_dominio_snippet.txt', dominioDoc);
        console.log(`✅ Agente Domínio: ${dominioResult.status}`);

    } catch (error) {
        console.error('❌ Erro na geração dos conectores:', error);
    }
}

generateConnectors();
