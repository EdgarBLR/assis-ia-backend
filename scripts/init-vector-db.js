const { Client } = require('pg');
require('dotenv').config();

async function main() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        console.log('🚀 Initializing Vector Database...');
        await client.connect();

        // 1. Enable pgvector extension
        await client.query('CREATE EXTENSION IF NOT EXISTS vector;');
        console.log('✅ Extension pgvector enabled.');

        // 2. Create Vector Table
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

        // 3. Create an index for faster search
        await client.query(`
            CREATE INDEX IF NOT EXISTS "idx_document_embedding" ON "DocumentEmbedding" 
            USING hnsw (embedding vector_cosine_ops);
        `);
        console.log('✅ HNSW Index created.');

    } catch (error) {
        console.error('❌ Error initializing vector DB:', error.message);
    } finally {
        await client.end();
    }
}

main();
