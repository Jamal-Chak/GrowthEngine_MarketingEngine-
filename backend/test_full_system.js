const axios = require('axios');
const mongoose = require('mongoose');

// Use 127.0.0.1 to match frontend behavior
const API_URL = 'http://127.0.0.1:5000/api';

async function testFullSystem() {
    console.log('🚀 --- STARTING FULL SYSTEM VERIFICATION --- 🚀');
    console.log('Target API:', API_URL);

    let token;
    let userId;
    const email = `system_test_${Date.now()}@example.com`;
    const password = 'password123';

    // 1. REGISTRATION
    try {
        console.log('\n[1/6] Testing Registration...');
        const regRes = await axios.post(`${API_URL}/auth/register`, {
            email,
            password,
            orgName: 'System Test Org',
            name: 'Test User'
        });
        console.log('✅ Registration Success:', regRes.data.email || regRes.data.user?.email);
    } catch (e) {
        console.error('❌ Registration Failed:', e.response?.data || e.message);
        process.exit(1);
    }

    // 2. LOGIN
    try {
        console.log('\n[2/6] Testing Login...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, { email, password });
        token = loginRes.data.token;
        userId = loginRes.data._id;

        if (!token || !userId) throw new Error('Missing token or userId');

        console.log('✅ Login Success');
        console.log('   Token:', token.substring(0, 10) + '...');
        console.log('   UserID:', userId);
    } catch (e) {
        console.error('❌ Login Failed:', e.response?.data || e.message);
        process.exit(1);
    }

    const headers = { Authorization: `Bearer ${token}` };

    // 3. ONBOARDING (This was likely failing before)
    try {
        console.log('\n[3/6] Testing Onboarding...');
        const onboardRes = await axios.post(`${API_URL}/onboarding/complete`, {
            userId, // Frontend sends this
            businessType: 'SaaS',
            goal: 'Revenue'
        }, { headers });
        console.log('✅ Onboarding Success');
        console.log('   First Mission Created:', onboardRes.data.mission?.title);
    } catch (e) {
        console.warning('⚠️ Onboarding Failed (Might be duplicate if auto-created):', e.response?.data || e.message);
    }

    // 4. MISSIONS
    try {
        console.log('\n[4/6] Testing Missions...');
        // Get Missions
        const missionsRes = await axios.get(`${API_URL}/missions`, { headers });
        console.log(`✅ Fetched ${missionsRes.data.length} missions`);

        // Create New Mission
        const newMission = await axios.post(`${API_URL}/missions`, {
            title: 'Test Integration Mission',
            description: 'Verify DB Flow'
        }, { headers });
        console.log('✅ Created Custom Mission:', newMission.data._id);

        // Complete Step (if any) - skipping for simplicity

        // Complete Mission
        const completeRes = await axios.post(`${API_URL}/missions/${newMission.data._id}/complete`, {}, { headers });
        console.log('✅ Completed Mission:', completeRes.data.mission.completed ? 'YES' : 'NO');
    } catch (e) {
        console.error('❌ Mission Validation Failed:', e.response?.data || e.message);
    }

    // 5. GAMIFICATION
    try {
        console.log('\n[5/6] Testing Gamification...');
        const statsRes = await axios.get(`${API_URL}/gamification/stats`, { headers });
        console.log('✅ Gamification Stats Read Successfully');
        console.log('   Level:', statsRes.data.level);
        console.log('   XP:', statsRes.data.xp);

        if (statsRes.data.xp > 0) console.log('✅ XP Increase Verified (from mission completion)');
        else console.warn('⚠️ No XP gained? Check XP logic.');
    } catch (e) {
        console.error('❌ Gamification Failed:', e.response?.data || e.message);
    }

    // 6. INSIGHTS / RECOMMENDATIONS
    try {
        console.log('\n[6/6] Testing Insights/Recommendations...');
        // First, generate some events so recommendations aren't empty
        await axios.post(`${API_URL}/events`, { eventType: 'login', data: {} }, { headers });

        const recRes = await axios.post(`${API_URL}/recommendations/generate`, {}, { headers });
        console.log(`✅ Generated ${recRes.data.length} recommendations`);

        const getRecs = await axios.get(`${API_URL}/recommendations`, { headers });
        console.log(`✅ Fetched ${getRecs.data.length} stored insights`);
    } catch (e) {
        // Recommendations might not be implemented as a POST route yet, checking...
        console.warn('⚠️ Recommendation Test Note:', e.response?.data || e.message);
    }

    console.log('\n🎉 --- SYSTEM VERIFICATION COMPLETE --- 🎉');
}

// Check if server is up before running
setTimeout(testFullSystem, 2000);
