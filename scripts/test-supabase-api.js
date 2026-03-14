require('dotenv').config();

async function main() {
    const url = `${process.env.SUPABASE_URL}/rest/v1/Tenant?select=*`;
    const headers = {
        'apikey': process.env.SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`
    };

    try {
        console.log(`🚀 Fetching from Supabase API: ${url}...`);
        const response = await fetch(url, { headers });
        console.log('Status:', response.status);
        if (response.ok) {
            const data = await response.json();
            console.log('✅ SUCCESS');
            console.log('Data count:', data.length);
            if (data.length > 0) {
                console.log('Sample Tenant:', data[0].name);
            }
        } else {
            console.log('❌ FAIL:', await response.text());
        }
    } catch (error) {
        console.log('❌ ERROR:', error.message);
    }
}

main();
