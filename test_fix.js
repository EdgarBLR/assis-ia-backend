require("dotenv").config();
const { Client } = require("@notionhq/client");

const notion = new Client({
    auth: process.env.NOTION_TOKEN,
});

async function test() {
    try {
        console.log("Attempting query with dataSources.query...");
        const response = await notion.dataSources.query({
            data_source_id: process.env.NOTION_DATABASE_ID,
        });
        console.log("Success! Results count:", response.results.length);
    } catch (error) {
        console.error("Test Query Failed:", error.message);
        // If it fails, let's try the raw request way
        try {
            console.log("Attempting raw request to databases/query...");
            const rawResponse = await notion.request({
                path: `databases/${process.env.NOTION_DATABASE_ID}/query`,
                method: "post",
                body: {}
            });
            console.log("Raw Success! Results count:", rawResponse.results.length);
        } catch (rawError) {
            console.error("Raw Request Failed:", rawError.message);
        }
    }
}

test();
