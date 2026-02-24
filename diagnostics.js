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

async function test() {
    try {
        console.log("Attempting query...");
        const response = await notion.databases.query({
            database_id: process.env.NOTION_DATABASE_ID,
        });
        console.log("Success! Results count:", response.results.length);
    } catch (error) {
        console.error("Test Query Failed:", error.message);
    }
}

test();
