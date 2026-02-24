require("dotenv").config();
const { Client } = require("@notionhq/client");

const notion = new Client({
    auth: process.env.NOTION_TOKEN,
});

async function debugQuery() {
    const dsId = "fc3c79bd-81ac-412b-8be8-f15995826474";
    try {
        console.log(`Querying Data Source ${dsId} with full dump...`);
        const response = await notion.dataSources.query({
            data_source_id: dsId,
        });
        console.log("Response:", JSON.stringify(response, null, 2));
    } catch (error) {
        console.error("Query Failed:", error.message);
    }
}

debugQuery();
