/**
 * Script de Verificação: Webhook WhatsApp (Evolution API)
 * Simula o payload enviado pela Evolution API ao receber uma mensagem.
 */
async function testWhatsappWebhook() {
    console.log('🧪 Iniciando teste de Webhook WhatsApp...');

    const mockPayload = {
        "event": "messages.upsert",
        "instance": "assis_ia",
        "data": {
            "key": {
                "remoteJid": "5511999999999@s.whatsapp.net",
                "fromMe": false,
                "id": "ABC123XYZ"
            },
            "pushName": "Edgar (Contador)",
            "message": {
                "conversation": "Assis, verificar dctfweb da empresa ABC"
            }
        }
    };

    try {
        const response = await fetch('http://localhost:3001/api/webhooks/whatsapp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(mockPayload)
        });

        const data = await response.json();
        if (response.ok) {
            console.log('✅ Webhook enviado com sucesso!');
            console.log('Resposta do Servidor:', data);
        } else {
            console.error('❌ Erro ao testar webhook:', data);
        }
    } catch (error) {
        console.error('❌ Erro de conexão:', error.message);
        console.log('DICA: Certifique-se de que o servidor (server.js) está rodando na porta 3001.');
    }
}

testWhatsappWebhook();
