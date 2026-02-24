require("dotenv").config();
const { Client } = require("@notionhq/client");

const notion = new Client({
    auth: process.env.NOTION_TOKEN,
});

async function checkParent() {
    const parentId = "3fe36831-8d45-441f-a31c-5babb68d515c";
    const dataSourceId = "fc3c79bd-81ac-412b-8be8-f15995826474";

    try {
        console.log(`Checking Parent Database ${parentId}...`);
        const db = await notion.databases.retrieve({ database_id: parentId });
        console.log("Parent DB Found:", db.title?.[0]?.plain_text || "Untitled");
        console.log("Parent DB Properties:", Object.keys(db.properties));
    } catch (e) {
        console.log("Parent DB Retrieve Failed:", e.message);
    }

    try {
        console.log(`Checking Data Source ${dataSourceId}...`);
        const ds = await notion.dataSources.retrieve({ data_source_id: dataSourceId });
        console.log("Data Source JSON:", JSON.stringify(ds, null, 2));
    } catch (e) {
        console.log("Data Source Retrieve Failed:", e.message);
    }
}

checkParent();
