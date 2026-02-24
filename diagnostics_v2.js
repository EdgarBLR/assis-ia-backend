require("dotenv").config();
const { Client } = require("@notionhq/client");

const notion = new Client({
    auth: process.env.NOTION_TOKEN,
});

console.log("Type of notion.databases.query:", typeof notion.databases.query);
console.log("Is notion.databases.query a function?", (typeof notion.databases.query === 'function'));

// Inspect prototypes
let proto = Object.getPrototypeOf(notion.databases);
console.log("notion.databases Prototype Keys:", Object.getOwnPropertyNames(proto));

async function test() {
    try {
        console.log("Attempting query again...");
        const response = await notion.databases.query({
            database_id: process.env.NOTION_DATABASE_ID,
        });
        console.log("Success! Results count:", response.results.length);
    } catch (error) {
        console.error("Test Query Failed:", error.message);
    }
}

test();
