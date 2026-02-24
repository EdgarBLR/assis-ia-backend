const Redis = require('ioredis');

async function testRedis() {
    const redis = new Redis({
        host: "localhost",
        port: 6379,
    });

    try {
        await redis.set("teste", "ASSIS IA");
        const valor = await redis.get("teste");
        console.log('Valor recuperado do Redis:', valor);

        if (valor === "ASSIS IA") {
            console.log('✅ Conexão com Redis funcionando perfeitamente!');
        } else {
            console.log('❌ O valor recuperado está incorreto.');
        }
    } catch (err) {
        console.error('❌ Erro ao conectar no Redis:', err.message);
        console.log('Dica: Certifique-se de que o Redis está rodando localmente na porta 6379.');
    } finally {
        redis.disconnect();
    }
}

testRedis();
