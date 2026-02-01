const axios = require('axios');
const mongoose = require('mongoose');

const API_URL = 'http://localhost:5000/api';

async function testDataMigration() {
    console.log('--- Testing Data Migration to MongoDB ---');

    // 1. Auth / Login (Get Token)
    let token;
    let userId;
    try {
        const email = `migration_test_${Date.now()}@example.com`;
        await axios.post(`${API_URL}/auth/register`, { email, password: 'password123', orgName: 'Migration Org' });
        const loginRes = await axios.post(`${API_URL}/auth/login`, { email, password: 'password123' });
        token = loginRes.data.token;
        userId = loginRes.data._id;
        console.log('✅ Auth (MongoDB): Success');
    } catch (e) {
        console.error('❌ Auth Failed:', e.message);
        return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    // 2. Missions
    try {
        const missionRes = await axios.post(`${API_URL}/missions/template/quickWin`, {}, { headers });
        console.log('✅ Create Mission (MongoDB): Success', missionRes.data.id);

        const missionsRes = await axios.get(`${API_URL}/missions`, { headers });
        if (missionsRes.data.length > 0) console.log('✅ Fetch Missions (MongoDB): Success');
        else console.error('❌ Fetch Missions: Failed (Empty)');
    } catch (e) {
        console.error('❌ Mission Test Failed:', e.message);
    }

    // 3. Events
    try {
        await axios.post(`${API_URL}/events`, { eventType: 'test_event', data: { foo: 'bar' } }, { headers });
        console.log('✅ Track Event (MongoDB): Success');
    } catch (e) {
        console.error('❌ Event Test Failed:', e.message);
    }

    // 4. Gamification
    try {
        const statsRes = await axios.get(`${API_URL}/gamification/stats`, { headers });
        if (statsRes.data.level >= 1) console.log('✅ Gamification Stats (MongoDB): Success');
        else console.error('❌ Gamification Stats: Failed');
    } catch (e) {
        console.error('❌ Gamification Test Failed:', e.message);
    }
}

// Wait for server to start
setTimeout(testDataMigration, 3000);
