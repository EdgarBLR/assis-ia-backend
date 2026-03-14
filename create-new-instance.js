require('dotenv').config();

async function createNewInstance() {
    const apiUrl = process.env.EVOLUTION_API_URL;
    const apiKey = process.env.EVOLUTION_API_KEY;
    const newInstanceName = "assis_ia_2"; // Tentando um nome novo

    console.log(`Criando NOVA instância: ${newInstanceName} em ${apiUrl}`);

    try {
        const response = await fetch(`${apiUrl}/instance/create`, {
            method: 'POST',
            headers: {
                'apikey': apiKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                instanceName: newInstanceName,
                qrcode: true,
                integration: "WHATSAPP-BAILEYS"
            })
        });

        const data = await response.json();
        
        if (response.ok) {
            console.log(`\n✅ Instância ${newInstanceName} criada com sucesso!`);
            if (data.qrcode && data.qrcode.base64) {
               console.log("QR Code gerado na resposta com sucesso.");
               saveQr(data.qrcode.base64);
            } else {
               console.log("Sem QR Code instantâneo. Vamos esperar 5 segundos e tentar buscar o connect:");
               await new Promise(r => setTimeout(r, 5000));
               
               const connectResponse = await fetch(`${apiUrl}/instance/connect/${newInstanceName}`, {
                   method: 'GET',
                   headers: { 'apikey': apiKey }
               });
               const connectData = await connectResponse.json();
               if(connectData.base64) {
                    console.log("Obtivemos o QR Code pelo endpoint de Connect!");
                    saveQr(connectData.base64);
               } else {
                    console.log("Ainda sem QR Code:", connectData);
               }
            }
        } else {
            console.error("❌ Erro ao criar instância:", JSON.stringify(data, null, 2));
        }
    } catch (e) {
         console.error("Erro de requisição:", e.message);
    }
}

function saveQr(base64str) {
    const fs = require('fs');
    const html = `
        <html>
        <head><title>QR Code WhatsApp</title></head>
        <body style="display:flex; justify-content:center; align-items:center; height:100vh; background-color:#f0f0f0; font-family: sans-serif;">
            <div style="background:white; padding:40px; border-radius:10px; box-shadow:0 4px 8px rgba(0,0,0,0.1); text-align:center;">
                <h1>Assis IA</h1>
                <h2>Conectar WhatsApp</h2>
                <p>Abra o WhatsApp no seu celular > Aparelhos Conectados > Conectar Aparelho</p>
                <img src="${base64str}" alt="QR Code" style="width:300px; height:300px; border: 1px solid #ccc;" />
            </div>
        </body>
        </html>
    `;
    fs.writeFileSync('qrcode.html', html);
    console.log('✅ Arquivo qrcode.html GERADO! Abra ele no seu navegador.');
}


createNewInstance();
