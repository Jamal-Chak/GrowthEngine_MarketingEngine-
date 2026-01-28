const supabase = require('../config/supabase');

class RecommendationService {
    async getForUser(userId) {
        const { data, error } = await supabase
            .from('insights')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    }

    async generateForUser(userId) {
        // 1. Fetch User Context (Goal, Business Type)
        // In a real app we'd fetch profile/org data. 
        // For now, we'll infer or fetch recent events to see usage.

        const { data: events } = await supabase
            .from('events')
            .select('*')
            .eq('user_id', userId)
            .limit(10);

        // 2. Rules Engine (Heuristic)
        const recommendations = [];

        // Rule A: Engagement Check
        if (!events || events.length < 5) {
            recommendations.push({
                title: 'Data Blindspot Detected',
                description: 'We are not seeing enough events to give accurate advice. Install the snippet.',
                type: 'warning',
                impact_score: 9,
                action_url: '/settings/install'
            });
        }

        // Rule B: Always suggest "Referral" for growth (Mock logic)
        recommendations.push({
            title: 'Implement Referral Loop',
            description: 'You have zero viral coefficients. Add a "Invite Team" button.',
            type: 'opportunity',
            impact_score: 8,
            action_url: '/missions/referral-setup'
        });

        // 3. Store Insights
        const insightsToInsert = recommendations.map(rec => ({
            user_id: userId,
            title: rec.title,
            description: rec.description,
            type: rec.type,
            confidence_score: rec.impact_score // mapping to schema
        }));

        const { data: savedInsights, error } = await supabase
            .from('insights')
            .insert(insightsToInsert)
            .select();

        if (error) throw new Error(`Failed to save insights: ${error.message}`);

        return savedInsights;
    }
}

module.exports = new RecommendationService();
