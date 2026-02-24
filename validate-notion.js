// Simple test using fetch directly (like the extension does)

require("dotenv").config();

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const DATABASE_ID = process.env.NOTION_DATABASE_ID;

async function testNotionAPI() {
    console.log("🔍 NOTION API VALIDATION\n");

    // Test 1: Get database info
    console.log("1️⃣ Fetching database info...");
    try {
        const response = await fetch(
            `https://api.notion.com/v1/databases/${DATABASE_ID}`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${NOTION_TOKEN}`,
                    'Notion-Version': '2022-06-28'
                }
            }
        );

        if (!response.ok) {
            const error = await response.json();
            console.log(`   ❌ Error: ${error.message}`);
            console.log(`   Code: ${error.code}`);
            return;
        }

        const dbInfo = await response.json();
        console.log(`   ✅ Database: ${dbInfo.title?.[0]?.plain_text || 'Untitled'}`);
        console.log(`\n   Properties:`);

        for (const [name, prop] of Object.entries(dbInfo.properties)) {
            console.log(`   - ${name}: ${prop.type}`);
        }
        console.log();

        // Test 2: Query without filter
        console.log("2️⃣ Querying all items (no filter)...");
        const queryResponse = await fetch(
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

        const queryData = await response.json();
        console.log(`   ✅ Found ${queryData.results?.length || 0} items`);

        if (queryData.results && queryData.results.length > 0) {
            console.log(`\n   First item properties:`);
            const firstItem = queryData.results[0];
            for (const [name, prop] of Object.entries(firstItem.properties)) {
                let value = 'N/A';
                if (prop.title && prop.title[0]) value = prop.title[0].plain_text;
                else if (prop.rich_text && prop.rich_text[0]) value = prop.rich_text[0].plain_text;
                else if (prop.select) value = prop.select.name;
                else if (prop.relation) value = `${prop.relation.length} relations`;

                console.log(`   - ${name} (${prop.type}): ${value}`);
            }
        }

    } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
    }

    console.log("\n✅ Validation complete!");
}

testNotionAPI();
