
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const logStream = fs.createWriteStream('test_output.log', { flags: 'a' });
function log(msg) {
    console.log(msg);
    logStream.write(msg + '\n');
}

const supabaseUrl = 'https://slstkyszdaiozurjievp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsc3RreXN6ZGFpb3p1cmppZXZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzMTQwMDMsImV4cCI6MjA4Mzg5MDAwM30.vC4qfLngCx4OdHOD1tIansxVJD5YSo8O1ACSauX56uw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSignup(email) {
    log(`Testing signup with email: ${email}`);
    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: 'test123456',
        options: {
            data: { full_name: 'Test User' }
        }
    });

    if (error) {
        log(`❌ Error for ${email}: ${error.message} (Status: ${error.status})`);
    } else {
        log(`✅ Success for ${email}: User ID ${data.user.id}`);
    }
    log('---');
}

async function run() {
    // metadata full_name fixed, and using a likely valid domain structure
    await testSignup(`growth.engine.test+${Date.now()}@gmail.com`);
}

run();
