/**
 * Domino Agent (RPA)
 * Responsável por interagir com o sistema contábil Domínio.
 */

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

async function pollTasks() {
    console.log('🤖 DominioAgent: Buscando tarefas...');
    try {
        const response = await fetch(`${BACKEND_URL}/api/rpa/tasks?type=DOMINIO_REPORT`);
        const tasks = await response.json();

        if (tasks.length > 0) {
            for (const task of tasks) {
                console.log(`🚀 Executando tarefa: ${task.id}`);

                // Simulação de execução RPA (Abrir Domínio, Gerar Relatório, etc)
                await new Promise(r => setTimeout(r, 2000));

                await fetch(`${BACKEND_URL}/api/rpa/tasks/${task.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        status: 'COMPLETED',
                        result: { message: 'Relatório gerado com sucesso no Domínio' }
                    })
                });
                console.log(`✅ Tarefa ${task.id} concluída.`);
            }
        }
    } catch (error) {
        console.error('❌ Erro no agente Domínio:', error.message);
    }
}

// Inicia polling a cada 30 segundos
if (require.main === module) {
    setInterval(pollTasks, 30000);
    pollTasks();
}

module.exports = { pollTasks };
