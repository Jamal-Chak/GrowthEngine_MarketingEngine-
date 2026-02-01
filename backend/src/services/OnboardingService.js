// Supabase dependency removed
const MissionService = require('./MissionService');
const AIService = require('./AIService');

class OnboardingService {
    async completeOnboarding(userId, data) {
        const { businessType, goal, channel } = data; // teamSize ignored for Phase 1

        // Note: Skipping Organization creation (table missing) to fix 500 error.
        // Attaching mission directly to user.

        try {
            // Generate Custom AI Strategy
            const aiMissionData = await AIService.generateMarketingStrategy({
                businessType,
                goal,
                channel
            });

            // Create fresh mission from AI data (not template)
            const mission = await MissionService.createMission(userId, null, aiMissionData);

            return { success: true, mission, organization: null };
        } catch (error) {
            console.error('Onboarding Error:', error);
            // Fallback to template if AI fails
            try {
                const fallback = await MissionService.createMissionFromTemplate(userId, null, 'quickWin', {
                    title: 'Audit Your Digital Presence',
                    description: `Goal: ${goal}. Quick audit while we generate your full plan.`
                });
                return { success: true, mission: fallback, organization: null };
            } catch (fallbackError) {
                throw error;
            }
        }
    }
}

module.exports = new OnboardingService();
