const { Client } = require('pg');
require('dotenv').config();

async function main() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        console.log('🚀 Connecting to Database via pg...');
        await client.connect();
        console.log('✅ Connected.');

        // 1. Enable pgvector extension
        console.log('🔧 Enabling pgvector...');
        await client.query('CREATE EXTENSION IF NOT EXISTS vector;');
        console.log('✅ Extension pgvector enabled.');

        // 2. Create Vector Table
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

        // 3. Create Index
        console.log('🔧 Creating HNSW Index...');
        await client.query(`
            CREATE INDEX IF NOT EXISTS "idx_document_embedding" ON "DocumentEmbedding" 
            USING hnsw (embedding vector_cosine_ops);
        `);
        console.log('✅ HNSW Index created.');

    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.stack) console.error(error.stack);
    } finally {
        await client.end();
    }
}

main();
