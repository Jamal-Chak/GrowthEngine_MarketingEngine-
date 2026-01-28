const RecommendationService = require('../services/RecommendationService');

exports.getRecommendations = async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) return res.status(400).json({ error: 'UserId required' });

        const data = await RecommendationService.getForUser(userId);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.generateRecommendations = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) return res.status(400).json({ error: 'UserId required' });

        const data = await RecommendationService.generateForUser(userId);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
