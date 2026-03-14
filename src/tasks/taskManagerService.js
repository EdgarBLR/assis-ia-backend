const { documentQueue } = require('../jobs/documentProcessor');

const taskManagerService = {
    /**
     * Cria um novo processo contábil com passos iniciais.
     * @param {object} prisma - Instância do Prisma
     * @param {string} companyId - ID da empresa
     * @param {string} name - Nome do processo (ex: "Processamento de Nota Fiscal")
     */
    async createProcess(prisma, companyId, name) {
        return prisma.process.create({
            data: {
                name,
                companyId,
                status: 'IN_PROGRESS',
            }
        });
    },

    /**
     * Adiciona um passo ao processo e opcionalmente dispara um job no BullMQ.
     */
    async addStep(prisma, processId, name, jobData = null) {
        const step = await prisma.step.create({
            data: {
                name,
                status: 'PENDING',
                dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Default 24h
                processId
            }
        });

        if (jobData) {
            // Se houver dados de job, adiciona na fila correspondente
            // Por enquanto, todos vão para document-processing
            await documentQueue.add('process-doc', {
                ...jobData,
                stepId: step.id,
                processId: processId
            });

            await prisma.step.update({
                where: { id: step.id },
                data: { status: 'QUEUED' }
            });
        }

        return step;
    },

    /**
     * Atualiza o status de um passo.
     */
    async updateStepStatus(prisma, stepId, status) {
        return prisma.step.update({
            where: { id: stepId },
            data: { status }
        });
    },

    /**
     * Finaliza o processo se todos os passos estiverem concluídos.
     */
    async checkProcessCompletion(prisma, processId) {
        const remainingSteps = await prisma.step.count({
            where: {
                processId,
                status: { notIn: ['COMPLETED', 'FAILED'] }
            }
        });

        if (remainingSteps === 0) {
            await prisma.process.update({
                where: { id: processId },
                data: { status: 'COMPLETED' }
            });
        }
    }
};

module.exports = taskManagerService;
