const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Camada 5 — Tribunal de Agentes
 * Orquestra múltiplos agentes especialistas para debater um caso.
 */
class AgentTribunal {
    constructor() {
        this.agents = {
            contabil: { name: 'Agente Contábil', weight: 1, role: 'Analista de lançamentos e classificação contábil.' },
            tributario: { name: 'Agente Tributário', weight: 2, role: 'Especialista em impostos federais (PIS/COFINS/CSLL/IRPJ) e conformidade fiscal.' },
            previdenciario: { name: 'Agente Previdenciário', weight: 2, role: 'Especialista em INSS, FGTS, retenciones de obra e legislação previdenciária.' },
            juridico: { name: 'Agente Jurídico', weight: 3, role: 'Especialista em interpretação de leis, normas regulamentadoras e jurisprudência.' },
            auditor: { name: 'Agente Auditor', weight: 1, role: 'Especialista em identificação de riscos, fraudes e conformidade processual.' }
        };
    }

    /**
     * Solicita a opinião de um agente específico.
     */
    async askAgent(agentKey, caseData) {
        const agent = this.agents[agentKey];
        const { text, metadata, similarCases } = caseData;

        try {
            const response = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    {
                        role: "system",
                        content: `Você é o ${agent.name}. Sua função é: ${agent.role}. 
                        Analise o caso fornecido sob a sua perspectiva técnica. 
                        Retorne em JSON contendo: "decision" (Veredito curto), "reasoning" (Breve justificativa), "laws" (Leis citadas em array).`
                    },
                    {
                        role: "user",
                        content: `Caso: ${text.substring(0, 3000)}\n\nDados Extraídos: ${JSON.stringify(metadata)}\n\nCasos Similares: ${JSON.stringify(similarCases)}`
                    }
                ],
                response_format: { type: "json_object" },
                temperature: 0.2
            });

            const result = JSON.parse(response.choices[0].message.content);
            return {
                agent: agentKey,
                weight: agent.weight,
                ...result
            };
        } catch (error) {
            console.error(`Erro no agente ${agentKey}:`, error);
            return { agent: agentKey, decision: "ERRO", weight: 0, reasoning: "Falha na análise." };
        }
    }

    /**
     * Consolida as opiniões dos agentes (Deliberação).
     */
    async evaluate(caseData) {
        console.log('⚖️ Iniciando Tribunal de Agentes...');

        // Chamada paralela para todos os agentes
        const agentKeys = Object.keys(this.agents);
        const opinions = await Promise.all(agentKeys.map(key => this.askAgent(key, caseData)));

        // Consolidação por "Juiz IA"
        console.log('👨‍⚖️ Juiz IA consolidando decisões...');
        const judgeResponse = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: `Você é o Juiz IA da ASSIS IA. Sua função é consolidar as opiniões de agentes especialistas (Pesos: Jurídico 3, Tributário 2, Previdenciário 2, outros 1).
                    Determine a decisão final baseada no peso e na força dos argumentos.
                    Retorne em JSON: "finalDecision", "confidence" (0-1), "justification" (Justificativa consolidada), "laws" (Array consolidado de leis), "agentsInvolved" (Lista dos agentes que contribuíram).`
                },
                {
                    role: "user",
                    content: `Opiniões dos Agentes:\n${JSON.stringify(opinions)}`
                }
            ],
            response_format: { type: "json_object" },
            temperature: 0
        });

        const finalDecision = JSON.parse(judgeResponse.choices[0].message.content);

        return {
            status: 'CONSOLIDATED',
            opinions,
            ...finalDecision,
            timestamp: new Date().toISOString()
        };
    }
}

module.exports = new AgentTribunal();
