const fs = require('fs');
const path = require('path');

/**
 * Feedback Collector - Self-Evolution System
 * Coleta dados de execução para aprendizado contínuo.
 */
class FeedbackCollector {
    constructor() {
        this.logPath = path.join(__dirname, '..', '..', 'logs', 'feedback_data.json');
        this.ensureLogDir();
    }

    ensureLogDir() {
        const dir = path.dirname(this.logPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        if (!fs.existsSync(this.logPath)) {
            fs.writeFileSync(this.logPath, JSON.stringify([]));
        }
    }

    /**
     * Registra o resultado de uma tarefa.
     */
    async collect(taskData) {
        const { taskType, input, output, status, error, tokens, duration } = taskData;

        const feedback = {
            id: Date.now().toString(),
            taskType,
            input: typeof input === 'string' ? input : JSON.stringify(input),
            output: typeof output === 'string' ? output : JSON.stringify(output),
            status,
            error: error || null,
            tokens: tokens || 0,
            duration: duration || 0,
            createdAt: new Date().toISOString()
        };

        console.log(`📊 Self-Evolution: Coletando feedback para ${taskType} (${status})`);

        try {
            const data = JSON.parse(fs.readFileSync(this.logPath, 'utf8'));
            data.push(feedback);

            // Mantém apenas os últimos 500 registros para o MVP
            if (data.length > 500) data.shift();

            fs.writeFileSync(this.logPath, JSON.stringify(data, null, 2));
            return feedback;
        } catch (err) {
            console.error('❌ Erro ao salvar feedback:', err.message);
        }
    }

    /**
     * Retorna feedbacks recentes para análise.
     */
    getRecentFeedbacks(limit = 100) {
        try {
            const data = JSON.parse(fs.readFileSync(this.logPath, 'utf8'));
            return data.slice(-limit);
        } catch (err) {
            return [];
        }
    }
}

module.exports = new FeedbackCollector();
