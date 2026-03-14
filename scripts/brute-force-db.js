const { Client } = require('pg');

async function test(name, connectionString) {
    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });
    try {
        process.stdout.write(`Testing ${name}... `);
        await client.connect();
        console.log('✅ SUCCESS');
        return true;
    } catch (error) {
        console.log(`❌ FAIL: ${error.message}`);
        return false;
    } finally {
        await client.end();
    }
}

async function main() {
    const pass = 'Familia05070818#';
    const passEncoded = encodeURIComponent(pass);
    const project = 'rigoqvfzyzkzjqufieup';

    const variants = [
        // No sslmode in URL to avoid overriding the ssl object
        { name: "Pooler, Encoded Pass, User.Project", url: `postgresql://postgres.${project}:${passEncoded}@aws-1-us-east-1.pooler.supabase.com:5432/postgres` },
        { name: "Pooler, Encoded Pass, User Only", url: `postgresql://postgres:${passEncoded}@aws-1-us-east-1.pooler.supabase.com:5432/postgres` },
    ];

    for (const variant of variants) {
        await test(variant.name, variant.url);
    }
}

main();
