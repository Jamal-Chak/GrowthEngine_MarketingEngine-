const InsightsService = require('../services/InsightsService');

const getInsights = async (req, res) => {
    try {
        const userId = req.user?.id || req.query.userId;
        const orgId = req.query.orgId || req.user?.orgId;

        const insights = await InsightsService.analyzeUserMetrics(userId, orgId);

        res.json({ insights });
    } catch (error) {
        console.error('Get insights error:', error);
        res.status(500).json({ error: error.message });
    }
};

const getRecommendations = async (req, res) => {
    try {
        const userId = req.user?.id || req.query.userId;
        const orgId = req.query.orgId || req.user?.orgId;

        const recommendations = await InsightsService.generateMissionRecommendations(userId, orgId);

        res.json({ recommendations });
    } catch (error) {
        console.error('Get recommendations error:', error);
        res.status(500).json({ error: error.message });
    }
};

const getMetrics = async (req, res) => {
    try {
        const userId = req.user?.id || req.query.userId;

        const metrics = await InsightsService.getMetricsSummary(userId);

        res.json({ metrics });
    } catch (error) {
        console.error('Get metrics error:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getInsights,
    getRecommendations,
    getMetrics,
};
