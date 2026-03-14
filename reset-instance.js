require('dotenv').config();
async function reset() {
    const apiUrl = process.env.EVOLUTION_API_URL;
    const apiKey = process.env.EVOLUTION_API_KEY;
    const instance = process.env.EVOLUTION_INSTANCE_NAME;

    try {
        console.log("Deletando instância antiga para evitar travamento...");
        await fetch(`${apiUrl}/instance/delete/${instance}`, {
            method: 'DELETE',
            headers: { 'apikey': apiKey }
        });
        
        console.log("Aguardando 3 segundos...");
        await new Promise(r => setTimeout(r, 3000));
        
        console.log("Recriando instância...");
        let response = await fetch(`${apiUrl}/instance/create`, {
            method: 'POST',
            headers: { 'apikey': apiKey, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                instanceName: instance,
                qrcode: true,
                integration: "WHATSAPP-BAILEYS"
            })
        });
        let data = await response.json();
        
        if (data.qrcode && data.qrcode.base64) {
             console.log("QR Code recebido na criação!");
             saveQr(data.qrcode.base64);
             return;
        } 
        
        console.log("Sem QR Code imediato. Aguardando 5 segundos e tentando buscar via GET connect...");
        await new Promise(r => setTimeout(r, 5000));
        
        response = await fetch(`${apiUrl}/instance/connect/${instance}`, {
             method: 'GET',
             headers: { 'apikey': apiKey }
        });
        data = await response.json();
        if (data.base64) {
             console.log("QR Code recebido via GET connect!");
             saveQr(data.base64);
        } else {
             console.log("Instância criada, mas ainda não retornou QR Code:", data);
        }
        
    } catch(e) {
        console.error(e.message);
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
    console.log('✅ QR Code HTML atualizado com sucesso (qrcode.html)!');
}

reset();
