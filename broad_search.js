require("dotenv").config();
const { Client } = require("@notionhq/client");

const notion = new Client({
    auth: process.env.NOTION_TOKEN,
});

async function broadSearch() {
    try {
        console.log("Performing broad search (no filters)...");
        const response = await notion.search({});
        console.log(`Results: ${response.results.length}`);
        response.results.forEach(item => {
            console.log(`- Type: ${item.object}, ID: ${item.id}`);
            if (item.object === 'page') {
                const titleProp = Object.values(item.properties || {}).find(p => p.type === 'title');
                console.log(`  Title: ${titleProp?.title?.[0]?.plain_text || "Untitled Page"}`);
            } else if (item.object === 'data_source') {
                console.log(`  Title: ${item.name?.[0]?.plain_text || "Untitled DS"}`);
            }
        });
    } catch (error) {
        console.error("Search Failed:", error.message);
    }
}

broadSearch();
