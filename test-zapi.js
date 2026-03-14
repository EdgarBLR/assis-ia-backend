require('dotenv').config();
const zapiService = require('./src/services/zapiService');

async function test() {
    try {
        const number = process.argv[2] || process.env.TEST_NUMBER || '5517997281859';
        console.log(`Testing Z-API send to ${number}...`);
        const res = await zapiService.sendText(number, 'Olá! Este é um teste da integração Z-API da Assis IA 🚀');
        console.log('Response:', res);
    } catch (e) {
        console.error('Test failed:', e);
    }
}
test();
