require('dotenv').config();

async function createInstance() {
    const apiUrl = process.env.EVOLUTION_API_URL;
    const apiKey = process.env.EVOLUTION_API_KEY;
    const instance = process.env.EVOLUTION_INSTANCE_NAME;

    console.log(`Criando instância: ${instance} em ${apiUrl}`);

    try {
        const response = await fetch(`${apiUrl}/instance/create`, {
            method: 'POST',
            headers: {
                'apikey': apiKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                instanceName: instance,
                qrcode: true,
                integration: "WHATSAPP-BAILEYS"
            })
        });

        const data = await response.json();
        
        if (response.ok) {
            console.log(`\n✅ Instância ${instance} criada com sucesso!`);
            // Se retornar a base64, não vamos imprimir tudo no terminal porque é muito grande
            if (data.qrcode && data.qrcode.base64) {
               console.log("QR Code gerado na resposta com sucesso.");
            } else {
               console.log(JSON.stringify(data, null, 2));
            }
        } else {
            console.error("❌ Erro ao criar instância:", JSON.stringify(data, null, 2));
        }
    } catch (e) {
         console.error("Erro de requisição:", e.message);
    }
}

createInstance();
