/**
 * Agent Manager
 * Registro central de todos os agentes do sistema.
 */
class AgentManager {
    constructor() {
        this.agents = new Map();
    }

    /**
     * Registra um novo agente.
     */
    register(name, agentInstance) {
        console.log(`✅ Agente registrado no sistema: ${name}`);
        this.agents.set(name, agentInstance);
    }

    /**
     * Busca um agente pelo nome.
     */
    getAgent(name) {
        return this.agents.get(name);
    }

    /**
     * Lista todos os agentes ativos.
     */
    listAgents() {
        return Array.from(this.agents.keys());
    }
}

module.exports = new AgentManager();
