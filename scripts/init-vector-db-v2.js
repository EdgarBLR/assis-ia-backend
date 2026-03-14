const { Client } = require('pg');
require('dotenv').config();

async function main() {
    // Ensuring NO sslmode query param in the URL to avoid conflicts
    const connectionString = process.env.DATABASE_URL.split('?')[0];

    const client = new Client({
        connectionString: connectionString,
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        console.log('🚀 Connecting to Database...');
        await client.connect();
        console.log('✅ Connected.');

        console.log('🔧 Enabling pgvector...');
        await client.query('CREATE EXTENSION IF NOT EXISTS vector;');
        console.log('✅ Extension pgvector enabled.');

        console.log('🔧 Creating DocumentEmbedding table...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS "DocumentEmbedding" (
                "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                "documentId" TEXT NOT NULL,
                "content" TEXT NOT NULL,
                "embedding" vector(1536),
                "metadata" JSONB,
                "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✅ Table DocumentEmbedding created.');

        console.log('🔧 Creating HNSW Index...');
        await client.query(`
            CREATE INDEX IF NOT EXISTS "idx_document_embedding" ON "DocumentEmbedding" 
            USING hnsw (embedding vector_cosine_ops);
        `);
        console.log('✅ HNSW Index created.');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await client.end();
    }
}

main();
