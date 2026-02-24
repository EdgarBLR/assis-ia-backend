require("dotenv").config();
const { Client } = require("@notionhq/client");

const notion = new Client({
    auth: process.env.NOTION_TOKEN,
});

async function checkSpecific() {
    const id = "3fe36831-8d45-441f-a31c-5babb68d515c";
    try {
        console.log(`Directly retrieving database ${id}...`);
        const response = await notion.dataSources.retrieve({
            data_source_id: id,
        });
        console.log("SUCCESS! Database found:", response.name?.[0]?.plain_text || "Untitled");

        console.log("Attempting to query it...");
        const queryResponse = await notion.dataSources.query({
            data_source_id: id,
        });
        console.log("Query Results count:", queryResponse.results.length);
    } catch (error) {
        console.error("Direct Retrieval Failed:", error.message);
    }
}

checkSpecific();
