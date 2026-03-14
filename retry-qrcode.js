require('dotenv').config();

async function retryConnect() {
    const apiUrl = process.env.EVOLUTION_API_URL;
    const apiKey = process.env.EVOLUTION_API_KEY;
    const instance = process.env.EVOLUTION_INSTANCE_NAME;

    console.log("Tentando obter o QR Code (max 5 tentativas)...");

    for (let i = 0; i < 5; i++) {
        try {
            const response = await fetch(`${apiUrl}/instance/connect/${instance}`, {
                method: 'GET',
                headers: { 'apikey': apiKey }
            });
            const data = await response.json();
            
            if (data.base64) {
                console.log("\n✅ QR Code obtido com sucesso!");
                const fs = require('fs');
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
                console.log('Salvo em qrcode.html. Por favor, abra esse arquivo no navegador!');
                return;
            } else {
                console.log(`Tentativa ${i+1}: QR Code ainda não disponível. Retorno:`, data);
            }
        } catch (e) {
            console.error(`Tentativa ${i+1} falhou:`, e.message);
        }
        await new Promise(r => setTimeout(r, 3000));
    }
    console.log("❌ Não foi possível obter o QR Code após 5 tentativas.");
}

retryConnect();
