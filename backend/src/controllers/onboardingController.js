const OnboardingService = require('../services/OnboardingService');

exports.completeOnboarding = async (req, res) => {
    try {
        const { businessType, goal, teamSize, channel, userId } = req.body;

        if (!userId) {
            return res.status(400).json({ success: false, error: 'User ID is required' });
        }

        const result = await OnboardingService.completeOnboarding(userId, { businessType, goal, teamSize, channel });

        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('Onboarding Error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
