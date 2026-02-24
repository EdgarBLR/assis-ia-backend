// Test script for backend endpoints

const BASE_URL = 'http://localhost:3000';

async function testHealthCheck() {
    console.log('🔍 Testing health check endpoint...');
    const response = await fetch(BASE_URL);
    const data = await response.json();
    console.log('✅ Health check:', data);
    console.log('');
}

async function testFetchAllTasks() {
    console.log('🔍 Testing fetch all tasks...');
    try {
        const response = await fetch(`${BASE_URL}/tarefas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        console.log(`✅ Found ${data.length} tasks`);
        console.log('First task:', data[0]?.properties);
        console.log('');
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

async function testFetchClientTasks() {
    console.log('🔍 Testing fetch tasks by client...');
    try {
        const response = await fetch(`${BASE_URL}/tarefas/cliente`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cliente: 'Alpha' })
        });
        const data = await response.json();
        console.log(`✅ Found ${data.length} tasks for client "Alpha"`);
        console.log('');
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

async function runTests() {
    console.log('🚀 Starting backend tests...\n');
    await testHealthCheck();
    await testFetchAllTasks();
    await testFetchClientTasks();
    console.log('✅ All tests completed!');
}

runTests();
