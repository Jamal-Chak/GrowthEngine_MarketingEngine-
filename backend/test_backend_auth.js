const axios = require('axios');

const API_URL = 'http://localhost:5000/api/auth';

async function testBackendAuth() {
    const email = `backend_test_${Date.now()}@example.com`;
    const password = 'password123';
    const orgName = 'Test Org';

    console.log('\n--- Testing Backend Registration ---');
    try {
        const res = await axios.post(`${API_URL}/register`, {
            email,
            password,
            orgName
        });
        console.log('✅ Register Success:', res.data._id);
    } catch (error) {
        console.error('❌ Register Failed:', error.message);
        if (error.response) console.error('Response:', error.response.data);
        return; // Stop if register fails
    }

    console.log('\n--- Testing Backend Login ---');
    try {
        const res = await axios.post(`${API_URL}/login`, {
            email,
            password
        });
        console.log('✅ Login Success! Token received:', res.data.token ? 'Yes' : 'No');
    } catch (error) {
        console.error('❌ Login Failed:', error.message);
        if (error.response) console.error('Response:', error.response.data);
    }
}

testBackendAuth();
