const Insight = require('../models/Insight');
const Event = require('../models/Event');
const AIService = require('./AIService');

class RecommendationService {
    async getForUser(userId) {
        try {
            const insights = await Insight.find({ userId: userId }).sort({ createdAt: -1 });
            return insights;
        } catch (error) {
            console.warn('Database error. Returning mock recommendations.', error.message);
            return [
                {
                    id: 'mock-1',
                    title: 'Complete Onboarding',
                    description: 'Finish your profile to get better insights.',
                    type: 'opportunity',
                    confidence_score: 9,
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'mock-2',
                    title: 'Connect Analytics',
                    description: 'Link your Google Analytics to track growth.',
                    type: 'suggestion',
                    confidence_score: 7,
                    createdAt: new Date().toISOString()
                }
            ];
        }
    }

    async generateForUser(userId) {
        // 1. Fetch User Context
        // In reality, we would fetch the User profile to get businessType/Goal.
        // For now, we'll try to find the first mission to infer context or default to 'SaaS'.

        let context = { businessType: 'SaaS', goal: 'Growth', channel: 'LinkedIn' };

        // Try to infer from recent events or missions (omitted for brevity, using defaults)

        // 2. Check Subscription Limit
        const SubscriptionService = require('./SubscriptionService');
        const canGenerate = await SubscriptionService.checkLimit(userId, 'aiRecommendations');

        if (!canGenerate) {
            throw new Error("You have reached your free AI strategy limit. Upgrade to Pro for unlimited strategies.");
        }

        // 3. AI Generation
        const aiStrategy = await AIService.generateMarketingStrategy(context);

        // 3. Create Actionable Mission
        // We import MissionService dynamically to avoid circular dependencies if any (though here it's fine)
        const MissionService = require('./MissionService');

        try {
            const newMission = await MissionService.createMission(userId, null, aiStrategy);

            // 4. Also store as Insight for history (Non-blocking)
            const recommendation = {
                userId: userId,
                title: aiStrategy.title,
                description: aiStrategy.description,
                type: 'opportunity',
                severity: aiStrategy.impactLevel || 'medium',
                suggestedMission: `/missions/${newMission.id}`,
                confidence_score: 8,
                createdAt: new Date()
            };

            try {
                await Insight.create(recommendation);
            } catch (insightError) {
                console.warn('Warning: Failed to save Insight history (Postgres/Mongo mismatch?), but Mission created.', insightError.message);
                // Continue execution so we don't block the user
            }

            // Return specific structure for frontend to handle (or just standard insight array)
            // But frontend expects list of recommendations. 
            // We'll append a flag so frontend knows to reload missions.
            return [{ ...recommendation, isNewMission: true }];
        } catch (error) {
            console.error('Failed to save AI mission/insight:', error);
            throw new Error(`Failed to generate strategy: ${error.message}`);
        }
    }
}

module.exports = new RecommendationService();
