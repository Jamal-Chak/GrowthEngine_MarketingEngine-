const { createClient } = require('@supabase/supabase-js');
// require('dotenv').config({ path: '.env.local' });

// Use environment variables from .env.local if available, otherwise use hardcoded provided in previous steps
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://slstkyszdaiozurjievp.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsc3RreXN6ZGFpb3p1cmppZXZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzMTQwMDMsImV4cCI6MjA4Mzg5MDAwM30.vC4qfLngCx4OdHOD1tIansxVJD5YSo8O1ACSauX56uw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function listUsers() {
    console.log('\n--- Checking Existing Users ---');
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .limit(5);

    if (error) {
        console.error('❌ Failed to list profiles:', error.message);
    } else {
        console.log(`✅ Found ${data.length} profiles:`);
        data.forEach(p => console.log(`- ${p.email} (${p.full_name})`));
    }
}

listUsers();
