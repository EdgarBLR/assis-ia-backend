require("dotenv").config();

async function listDatabases() {
    const token = process.env.NOTION_TOKEN;
    console.log("🔍 Procurando bancos de dados no Notion com o seu token local...");

    try {
        const response = await fetch('https://api.notion.com/v1/search', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                filter: {
                    property: 'object',
                    value: 'database'
                }
            })
        });

        if (response.ok) {
            const data = await response.json();
            console.log(`\n✅ Encontrados ${data.results.length} bancos de dados:`);
            data.results.forEach(db => {
                const title = db.title?.[0]?.plain_text || "Sem título";
                console.log(`\n📂 Banco: ${title}`);
                console.log(`🆔 ID: ${db.id}`);
            });
            if (data.results.length === 0) {
                console.log("⚠️ Nenhum banco foi encontrado. Verifique se a integração foi 'convidada' para as páginas no Notion.");
            }
        } else {
            const error = await response.json();
            console.error(`❌ Erro na API do Notion: ${error.message}`);
        }
    } catch (error) {
        console.error("❌ Erro de conexão:", error.message);
    }
}

listDatabases();
