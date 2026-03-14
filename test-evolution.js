require("dotenv").config();

async function testEvolution() {
    const apiUrl = process.env.EVOLUTION_API_URL;
    const apiKey = process.env.EVOLUTION_API_KEY;
    const instance = process.env.EVOLUTION_INSTANCE_NAME;

    console.log(`🔍 Testando conexão com a Evolution API: ${apiUrl}`);
    console.log(`📦 Instância: ${instance}`);

    try {
        const response = await fetch(`${apiUrl}/instance/fetchInstances`, {
            method: 'GET',
            headers: {
                'apikey': apiKey
            }
        });

        if (response.ok) {
            const data = await response.json();
            console.log("\n✅ Sucesso! Conectado à Evolution API.");
            console.log("📂 Instâncias encontradas:");
            data.forEach(inst => {
                console.log(`- Nome: ${inst.instanceName} | Status: ${inst.status} | Phone: ${inst.owner || 'Não conectado'}`);
            });
            
            const exists = data.find(i => i.instanceName === instance);
            if (exists) {
                console.log(`\n🎯 A instância '${instance}' existe e está pronta.`);
            } else {
                console.log(`\n⚠️ A instância '${instance}' NÃO foi encontrada no servidor.`);
            }
        } else {
            const error = await response.text();
            console.error(`❌ Erro ao listar instâncias (${response.status}):`, error);
        }
    } catch (error) {
        console.error("❌ Erro de conexão física:", error.message);
    }
}

testEvolution();
