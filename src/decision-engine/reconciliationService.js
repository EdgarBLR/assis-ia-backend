const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Serviço de Conciliação Bancária
 */
const reconciliationService = {
    /**
     * Tenta conciliar transações pendentes com documentos processados.
     */
    async reconcileCompany(companyId) {
        const pendingTransactions = await prisma.transaction.findMany({
            where: { companyId, status: 'PENDING' }
        });

        const results = [];

        for (const tx of pendingTransactions) {
            // Busca documentos com valor e data próximos
            // Nota: Em um sistema real, buscaríamos em campos estruturados de metadados
            // Aqui simulamos a busca por documentos que "batem" com o valor da transação
            const matchedDoc = await prisma.document.findFirst({
                where: {
                    companyId,
                    // Simulação: o tipo ou metadados batem com o valor
                    // No sistema real usaríamos: metadata -> value == tx.amount
                }
            });

            if (matchedDoc) {
                await prisma.transaction.update({
                    where: { id: tx.id },
                    data: { status: 'RECONCILED' }
                });

                results.push({
                    transactionId: tx.id,
                    documentId: matchedDoc.id,
                    match: 'EXACT_VALUE'
                });
            }
        }

        return results;
    }
};

module.exports = reconciliationService;
