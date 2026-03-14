/**
 * N8N Service
 * Gerencia disparos de webhooks para o N8N.
 */
class N8nService {
    /**
     * Dispara um webhook no N8N.
     */
    async triggerWebhook(url, data) {
        if (!url) {
            console.warn('⚠️ N8N Webhook URL não configurada. Ignorando disparo.');
            return null;
        }

        console.log(`🔗 Disparando Webhook N8N: ${url}`);

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`N8N Error: ${response.status} - ${errorText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('❌ Erro ao disparar Webhook N8N:', error.message);
            // Non-blocking error
            return null;
        }
    }
}

module.exports = new N8nService();
