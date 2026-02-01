const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testEmail() {
    console.log('\n--- Testing Email Service ---');
    try {
        const res = await axios.post(`${API_URL}/email/test`, {
            to: 'test@example.com'
        });
        console.log('✅ Email Test: Success!', res.data);
    } catch (error) {
        console.error('❌ Email Test: Failed', error.response ? error.response.data : error.message);
    }
}

async function testHealth() {
    console.log('\n--- Checking Server Health ---');
    try {
        const res = await axios.get(`${API_URL}/health`);
        console.log('✅ Health Check: Success!', res.data);
    } catch (error) {
        console.error('❌ Health Check: Failed', error.message);
    }
}

async function runTests() {
    console.log('Waiting for server to ensure it is up...');
    await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3s for startup
    await testHealth();
    await testEmail();
}

runTests();
