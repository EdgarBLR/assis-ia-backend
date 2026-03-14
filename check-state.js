require('dotenv').config();

async function checkState() {
    const apiUrl = process.env.EVOLUTION_API_URL;
    const apiKey = process.env.EVOLUTION_API_KEY;
    const instance = process.env.EVOLUTION_INSTANCE_NAME;

    try {
        const response = await fetch(`${apiUrl}/instance/connectionState/${instance}`, {
            method: 'GET',
            headers: { 'apikey': apiKey }
        });
        const data = await response.json();
        console.log("Estado da Instância:", data);
    } catch(e) {
        console.error("Erro:", e.message);
    }
}
checkState();
