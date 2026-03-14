const { Client } = require('pg');

async function main() {
    // Manually parsing the connection string for debugging
    const client = new Client({
        user: 'postgres.rigoqvfzyzkzjqufieup',
        host: 'aws-1-us-east-1.pooler.supabase.com',
        database: 'postgres',
        password: 'Familia05070818#',
        port: 5432,
        ssl: { rejectUnauthorized: false }
    });

    try {
        console.log('🚀 Connecting to Database with explicit params...');
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
