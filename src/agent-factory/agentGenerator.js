const fs = require('fs');
const path = require('path');

/**
 * Agent Factory - Agent Generator
 * Gera fisicamente o código do novo agente.
 */
const agentGenerator = {
    /**
     * Gera o código-fonte de um novo agente.
     */
    async generate(agentName, skills) {
        console.log(`🛠️ Gerando código para o agente: ${agentName}...`);

        const className = `${agentName.charAt(0).toUpperCase() + agentName.slice(1)}Agent`;

        let methodsCode = '';
        skills.forEach(skill => {
            // Sanitização extra por segurança
            const safeName = skill.name
                .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove acentos
                .replace(/[^a-zA-Z0-9]/g, "") // Remove caracteres especiais
                .replace(/^\d+/, ''); // Garante que não começa com número

            methodsCode += `
    /**
     * ${skill.description}
     */
    async ${safeName}(params) {
        console.log('🤖 Agente ${agentName} executando: ${skill.name}');
        // Simulação de chamada de API: ${skill.method} ${skill.endpoint}
        return {
            status: 'SUCCESS',
            action: '${skill.name}',
            data: params
        };
    }
`;
        });

        const template = `
/**
 * Agente Gerado Automaticamente pela Agent Factory
 */
class ${className} {
    constructor() {
        this.name = "${agentName}";
        this.skills = ${JSON.stringify(skills.map(s => s.name))};
    }
${methodsCode}
}

module.exports = ${className};
`;

        const fileName = `${agentName}Agent.js`;
        const targetPath = path.join(__dirname, '../agents/generated', fileName);

        fs.writeFileSync(targetPath, template);

        return {
            fileName,
            path: targetPath,
            className
        };
    }
};

module.exports = agentGenerator;
