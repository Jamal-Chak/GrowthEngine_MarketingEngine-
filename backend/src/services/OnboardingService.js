const supabase = require('../config/supabase');

class OnboardingService {
    async completeOnboarding(userId, data) {
        const { businessType, goal, teamSize } = data;

        // 1. Create Organization (Default name for now)
        const { data: org, error: orgError } = await supabase
            .from('organizations')
            .insert({ name: 'My Company', plan: 'free' })
            .select()
            .single();

        if (orgError) throw new Error(`Org creation failed: ${orgError.message}`);

        // 2. Add Member
        const { error: memberError } = await supabase
            .from('organization_members')
            .insert({ organization_id: org.id, user_id: userId, role: 'owner' });

        if (memberError) throw new Error(`Member add failed: ${memberError.message}`);

        // 3. Generate First Mission based on Goal
        let missionData = {
            title: 'Analyze Baseline Metrics',
            description: 'Connect your data sources to establish a baseline.',
            xp_reward: 100,
            category: 'onboarding',
            total_steps: 3,
            steps: [
                { title: 'Connect Data', description: 'Link your primary data source.' },
                { title: 'Review Metrics', description: 'Check your baseline stats.' },
                { title: 'Set Goal', description: 'Define your first target.' }
            ]
        };

        if (goal === 'revenue') {
            missionData.title = 'Optimize Checkout Flow';
            missionData.description = 'Identify drop-off points in your payment process.';
            missionData.steps = [
                { title: 'Analyze Checkout', description: 'Look at funnel drop-off.' },
                { title: 'Simplify Form', description: 'Remove optional fields.' },
                { title: 'Add trust signals', description: 'Add badges and testimonials.' }
            ];
        } else if (goal === 'leads') {
            missionData.title = 'Create Lead Magnet';
            missionData.description = 'Setup a high-value asset to capture emails.';
        } else if (goal === 'retention') {
            missionData.title = 'Setup Email Drip';
            missionData.description = 'Create a 3-part email sequence for new users.';
        }

        // Create Mission Template
        const { data: mission, error: missionError } = await supabase
            .from('missions')
            .insert(missionData)
            .select()
            .single();

        if (missionError) throw new Error(`Mission creation failed: ${missionError.message}`);

        // Assign Instance to User
        const { error: assignError } = await supabase
            .from('user_missions')
            .insert({
                user_id: userId,
                mission_id: mission.id,
                status: 'active',
                owner_id: userId,
                priority: 'high'
            });

        if (assignError) throw new Error(`Mission assignment failed: ${assignError.message}`);

        return { success: true, mission, organization: org };
    }
}

module.exports = new OnboardingService();
