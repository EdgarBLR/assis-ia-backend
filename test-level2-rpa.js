/**
 * Script de Verificação - Nível 2 (Automação)
 */
const fetch = require('node-fetch');

const API_URL = 'http://localhost:3001';

async function testRPAFlow() {
    console.log('🧪 Testando Fluxo de RPA...');

    try {
        // 1. Criar uma tarefa de RPA (Simulando n8n ou IA)
        console.log('1. Criando tarefa de RPA...');
        const createRes = await fetch(`${API_URL}/api/rpa/tasks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'DOMINIO_REPORT',
                data: { periodo: '01/2026', tipo: 'BALANCETE' },
                companyId: 'test-company-123'
            })
        });
        const task = await createRes.json();
        console.log('✅ Tarefa criada:', task.id);

        // 2. Verificar se o agente vê a tarefa
        console.log('2. Verificando polling do agente...');
        const pollRes = await fetch(`${API_URL}/api/rpa/tasks?type=DOMINIO_REPORT`);
        const pendingTasks = await pollRes.json();
        const found = pendingTasks.find(t => t.id === task.id);

        if (found) {
            console.log('✅ Agente localizou a tarefa pendente.');
        } else {
            console.error('❌ Agente não encontrou a tarefa!');
        }

    } catch (error) {
        console.error('❌ Erro no teste:', error.message);
    }
}

testRPAFlow();
