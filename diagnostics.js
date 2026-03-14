require("dotenv").config();
const { Client } = require("@notionhq/client");

const notion = new Client({
    auth: process.env.NOTION_TOKEN,
});

console.log("Notion Client Keys:", Object.keys(notion));
if (notion.databases) {
    console.log("Notion Databases Keys:", Object.keys(notion.databases));
} else {
    console.log("notion.databases is UNDEFINED");
}

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const DATABASE_ID = process.env.NOTION_DATABASE_ID;

async function test() {
    console.log("🔍 Iniciando diagnóstico via API direta...");
    try {
        const response = await fetch(
            `https://api.notion.com/v1/databases/${DATABASE_ID}/query`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${NOTION_TOKEN}`,
                    'Notion-Version': '2022-06-28',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({})
            }
        );

        if (response.ok) {
            const data = await response.json();
            console.log(`✅ Sucesso! Itens encontrados no Notion: ${data.results.length}`);
        } else {
            const error = await response.json();
            console.error(`❌ Erro na API do Notion: ${error.message}`);
        }
    } catch (error) {
        console.error("❌ Erro de conexão:", error.message);
    }
}

test();
