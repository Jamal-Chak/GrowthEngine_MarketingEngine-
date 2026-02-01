
const GamificationService = require('../services/GamificationService');

const getProfile = async (req, res) => {
    try {
        // Fallback to query param if req.user is not set (auth bypassed)
        const userId = req.user?.id || req.query.userId;
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const profile = await GamificationService.getProfile(userId);
        res.json(profile);
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: error.message });
    }
};

const getStats = async (req, res) => {
    try {
        const userId = req.user?.id || req.query.userId;
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const stats = await GamificationService.getStats(userId);
        res.json(stats);
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getProfile,
    getStats
};
