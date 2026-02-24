require("dotenv").config();
const { Client } = require("@notionhq/client");

const notion = new Client({
    auth: process.env.NOTION_TOKEN,
});

async function createTask() {
    const dbId = "3fe36831-8d45-441f-a31c-5babb68d515c";
    try {
        console.log(`Attempting to create a task in database ${dbId}...`);
        const response = await notion.pages.create({
            parent: { database_id: dbId },
            properties: {
                "Tarefa": {
                    title: [
                        {
                            text: {
                                content: "Tarefa de Teste ASSIS IA",
                            },
                        },
                    ],
                },
                "Status": {
                    select: {
                        name: "Pendente",
                    },
                },
            },
        });
        console.log("SUCCESS! Task created with ID:", response.id);

        console.log("Now querying database again...");
        const queryResponse = await notion.request({
            path: `databases/${dbId}/query`,
            method: "post",
            body: {}
        });
        console.log("Results count now:", queryResponse.results.length);
        if (queryResponse.results.length > 0) {
            console.log("Tasks found!");
            queryResponse.results.forEach(p => {
                const title = p.properties.Tarefa?.title?.[0]?.plain_text || "unnamed";
                console.log(`- ${title}`);
            });
        }
    } catch (error) {
        console.error("Operation Failed:", error.message);
        if (error.body) {
            console.error("Error Detail:", error.body);
        }
    }
}

createTask();
