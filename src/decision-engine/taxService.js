const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Serviço de Cálculo de Impostos (Simples Nacional)
 */
const taxService = {
    // Tabelas simplificadas do Simples Nacional (Anexo III - Serviços)
    // Para um sistema real, estas faixas seriam mais complexas e buscadas de uma config ou DB
    taxBrackets: [
        { limit: 180000, rate: 0.06, deduction: 0 },
        { limit: 360000, rate: 0.112, deduction: 9360 },
        { limit: 720000, rate: 0.135, deduction: 17640 },
        { limit: 1800000, rate: 0.16, deduction: 35640 },
        { limit: 3600000, rate: 0.21, deduction: 125640 },
        { limit: 4800000, rate: 0.33, deduction: 648000 },
    ],

    /**
     * Calcula o DAS para uma empresa em um determinado mês.
     */
    async calculateMonthlyTax(companyId, period) {
        // 1. Buscar faturamento do mês (Baseado em documentos NF-E processados)
        // Por simplicidade, vamos somar o 'valor' extraído nos metadados dos documentos
        // que foram classificados como NF-E
        const documents = await prisma.document.findMany({
            where: {
                companyId,
                type: 'NF-E',
                createdAt: {
                    // Simplificando busca por período
                    gte: new Date(`${period}-01`),
                    lt: new Date(new Date(`${period}-01`).setMonth(new Date(`${period}-01`).getMonth() + 1))
                }
            }
        });

        // NOTA: Em um sistema real, buscaríamos valores estruturados no DB. 
        // Aqui simulamos a soma do faturamento.
        const monthlyRevenue = documents.length * 5000; // Mock: cada nota vale 5k

        // 2. Buscar faturamento acumulado dos últimos 12 meses (RBT12)
        const rbt12 = monthlyRevenue * 12;

        if (monthlyRevenue === 0) {
            return await prisma.taxRecord.create({
                data: {
                    company: { connect: { id: companyId } },
                    period,
                    revenue: 0,
                    taxAmount: 0,
                    type: 'DAS',
                    status: 'CALCULATED'
                }
            });
        }

        // 3. Encontrar a faixa
        const bracket = this.taxBrackets.find(b => rbt12 <= b.limit) || this.taxBrackets[this.taxBrackets.length - 1];

        // 4. Calcular alíquota efetiva
        const effectiveRate = ((rbt12 * bracket.rate) - bracket.deduction) / rbt12;
        const taxAmount = monthlyRevenue * (effectiveRate || 0);

        // 5. Salvar registro de imposto
        const record = await prisma.taxRecord.create({
            data: {
                company: { connect: { id: companyId } },
                period,
                revenue: monthlyRevenue,
                taxAmount: taxAmount,
                type: 'DAS',
                status: 'CALCULATED'
            }
        });

        return record;
    }
};

module.exports = taxService;
