/**
 * Z-API Service Connector
 * Gerencia o envio de mensagens para o WhatsApp através da Z-API.
 */
class ZapiService {
    get config() {
        return {
            instanceId: process.env.ZAPI_INSTANCE_ID,
            token: process.env.ZAPI_TOKEN,
            clientToken: process.env.ZAPI_CLIENT_TOKEN
        };
    }

    get baseUrl() {
        const { instanceId, token } = this.config;
        return `https://api.z-api.io/instances/${instanceId}/token/${token}`;
    }

    /**
     * Helper para formatar número para padrao internacional simples (ex: 5511999999999)
     */
    formatNumber(number) {
        let clean = number.toString().replace(/\D/g, '');
        if (!clean.startsWith('55') && clean.length <= 11) {
             clean = '55' + clean;
        }
        return clean;
    }

    get headers() {
        const h = { 'Content-Type': 'application/json' };
        if (this.config.clientToken && this.config.clientToken !== 'YOUR_ZAPI_CLIENT_TOKEN') {
            h['Client-Token'] = this.config.clientToken;
        }
        return h;
    }

    /**
     * Envia uma mensagem de texto simples.
     */
    async sendText(number, text) {
        const url = `${this.baseUrl}/send-text`;
        const formattedNumber = this.formatNumber(number);
        console.log(`📱 [Z-API] Enviando WhatsApp para ${formattedNumber}: ${text.substring(0, 30)}...`);

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify({
                    phone: formattedNumber,
                    message: text,
                    delayMessage: 1
                })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(JSON.stringify(data));
            return data;
        } catch (error) {
            console.error('❌ Erro ao enviar Z-API text:', error.message);
            throw error;
        }
    }

    /**
     * Envia um arquivo (PDF, Imagem, etc).
     */
    async sendMedia(number, mediaUrl, fileName, caption = '') {
        const url = `${this.baseUrl}/send-document/extension`;
        const formattedNumber = this.formatNumber(number);
        console.log(`📎 [Z-API] Enviando mídia para ${formattedNumber}: ${fileName}`);

        const extension = fileName.split('.').pop() || 'pdf';

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify({
                    phone: formattedNumber,
                    document: mediaUrl,
                    fileName: fileName,
                    extension: extension,
                    caption: caption
                })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(JSON.stringify(data));
            return data;
        } catch (error) {
            console.error('❌ Erro ao enviar mídia Z-API:', error.message);
            throw error;
        }
    }

    /**
     * Envia um aviso de "Processando..."
     */
    async sendProcessing(number) {
        return this.sendText(number, '⏳ A Assis IA está processando seu pedido... Por favor, aguarde um instante.');
    }
}

module.exports = new ZapiService();
