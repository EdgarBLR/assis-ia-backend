require("dotenv").config();
const { Client } = require("@notionhq/client");

const notion = new Client({
    auth: process.env.NOTION_TOKEN,
});

async function listEverything() {
    try {
        console.log("Listing everything accessible...");
        const response = await notion.search({});
        console.log(`Found ${response.results.length} total objects.`);

        for (const item of response.results) {
            console.log(`- Type: ${item.object}`);
            console.log(`  ID: ${item.id}`);
            if (item.object === 'database') {
                console.log(`  Title: ${item.title?.[0]?.plain_text || "Untitled"}`);
            } else if (item.object === 'page') {
                // Try to find a title in properties
                const titleProp = Object.values(item.properties || {}).find(p => p.type === 'title');
                console.log(`  Title: ${titleProp?.title?.[0]?.plain_text || "Untitled Page"}`);
            } else if (item.object === 'data_source') {
                console.log(`  Title: ${item.name?.[0]?.plain_text || "Untitled Data Source"}`);
            }
            console.log(`  Parent: ${item.parent?.type} (${item.parent?.page_id || item.parent?.database_id || item.parent?.workspace_id || "workspace"})`);

            // If it's a database/data_source, query it
            if (item.object === 'database' || item.object === 'data_source') {
                try {
                    const q = await notion.dataSources.query({ data_source_id: item.id });
                    console.log(`  Content count: ${q.results.length}`);
                    if (q.results.length > 0) {
                        console.log("  !!! FOUND CONTENT !!!");
                    }
                } catch (e) {
                    console.log(`  Query error: ${e.message}`);
                }
            }
        }
    } catch (error) {
        console.error("List Everything Failed:", error.message);
    }
}

listEverything();
