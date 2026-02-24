require("dotenv").config();
const { Client } = require("@notionhq/client");

const notion = new Client({
    auth: process.env.NOTION_TOKEN,
});

async function findDatabases() {
    try {
        console.log("Searching for databases...");
        const response = await notion.search({
            filter: {
                property: "object",
                value: "data_source",
            },
        });

        if (response.results.length === 0) {
            console.log("No databases found. The integration likely doesn't have access to any database yet.");
        } else {
            console.log(`Found ${response.results.length} databases:`);
            response.results.forEach(db => {
                console.log(`- Title: ${db.title[0]?.plain_text || "Untitled"}`);
                console.log(`  ID: ${db.id}`);
            });
        }
    } catch (error) {
        console.error("Search Failed:", error.message);
    }
}

findDatabases();
