require('dotenv').config();
const fs = require('fs');

async function getQrCode() {
    const apiUrl = process.env.EVOLUTION_API_URL;
    const apiKey = process.env.EVOLUTION_API_KEY;
    const instance = process.env.EVOLUTION_INSTANCE_NAME;

    console.log(`Buscando QR Code da instância: ${instance}...`);

    try {
        const response = await fetch(`${apiUrl}/instance/connect/${instance}`, {
            method: 'GET',
            headers: {
                'apikey': apiKey
            }
        });
        const data = await response.json();
        
        if (data.base64) {
            const html = `
                <html>
                <head><title>QR Code WhatsApp</title></head>
                <body style="display:flex; justify-content:center; align-items:center; height:100vh; background-color:#f0f0f0; font-family: sans-serif;">
                    <div style="background:white; padding:40px; border-radius:10px; box-shadow:0 4px 8px rgba(0,0,0,0.1); text-align:center;">
                        <h1>Assis IA</h1>
                        <h2>Conectar WhatsApp</h2>
                        <p>Abra o WhatsApp no seu celular > Aparelhos Conectados > Conectar Aparelho</p>
                        <img src="${data.base64}" alt="QR Code" style="width:300px; height:300px; border: 1px solid #ccc;" />
                    </div>
                </body>
                </html>
            `;
            fs.writeFileSync('qrcode.html', html);
            console.log('✅ QR Code salvo em qrcode.html com sucesso!');
        } else {
             console.log('Não foi possível encontrar a propriedade base64 no retorno da API:', data);
        }
    } catch (e) {
        console.error("Erro ao buscar QR Code:", e.message);
    }
}

getQrCode();
