const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Serviço de Orquestração de RPA
 * Gerencia tarefas que robôs externos (agentes) devem executar.
 */
const rpaService = {
    /**
     * Adiciona uma nova tarefa de RPA na fila
     */
    async queueTask(type, data, companyId) {
        const task = await prisma.rPATask.create({
            data: {
                type,
                data,
                companyId,
                status: 'PENDING'
            }
        });
        console.log(`[RPA] Tarefa enfileirada no DB: ${task.type} (${task.id})`);
        return task;
    },

    /**
     * Recupera tarefas pendentes para um agente específico
     */
    async getPendingTasks(type = null) {
        return prisma.rPATask.findMany({
            where: {
                status: 'PENDING',
                ...(type && { type })
            },
            orderBy: { createdAt: 'asc' }
        });
    },

    /**
     * Atualiza o status de uma tarefa
     */
    async updateTaskStatus(taskId, status, result = null, error = null) {
        const task = await prisma.rPATask.update({
            where: { id: taskId },
            data: {
                status,
                result,
                error,
                updatedAt: new Date()
            }
        });
        console.log(`[RPA] Tarefa ${taskId} atualizada para: ${status}`);
        return task;
    }
};

module.exports = rpaService;
