require("dotenv").config();
const { Client } = require("@notionhq/client");

const notion = new Client({
    auth: process.env.NOTION_TOKEN,
});

async function queryDatabase() {
    try {
        console.log(`Querying database: ${process.env.NOTION_DATABASE_ID}`);
        const response = await notion.dataSources.query({
            data_source_id: process.env.NOTION_DATABASE_ID,
        });

        console.log("Full Response Structure:", Object.keys(response));
        console.log("Results count:", response.results.length);
        if (response.results.length > 0) {
            console.log("First result properties:", Object.keys(response.results[0].properties));
        } else {
            console.log("Response is empty.");
        }
    } catch (error) {
        console.error("Query Failed:", error.message);
    }
}

queryDatabase();
