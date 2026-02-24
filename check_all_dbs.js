require("dotenv").config();
const { Client } = require("@notionhq/client");

const notion = new Client({
    auth: process.env.NOTION_TOKEN,
});

async function checkAll() {
    const dbs = [
        { name: "📋 Tarefas", id: "fc3c79bd-81ac-412b-8be8-f15995826474" },
        { name: "🏢 Empresas", id: "f5e7c65f-b7c6-4fee-82b0-c2b4c5323cfc" },
        { name: "📚 Base de Conhecimento", id: "93ee378e-c791-41cc-9356-773f4076381d" },
        { name: "📂 Processos Executáveis", id: "9b90e9cf-dd57-455d-a7ee-e94f3cf33e2c" }
    ];

    for (const db of dbs) {
        try {
            console.log(`Checking ${db.name} (${db.id})...`);
            const response = await notion.dataSources.query({
                data_source_id: db.id,
            });
            console.log(`  Count: ${response.results.length}`);
            if (response.results.length > 0) {
                console.log(`  Found data in ${db.name}!`);
            }
        } catch (error) {
            console.error(`  Error checking ${db.name}: ${error.message}`);
        }
    }
}

checkAll();
