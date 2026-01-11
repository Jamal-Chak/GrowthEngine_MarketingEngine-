const RecommendationService = require('../services/RecommendationService');

const getRecommendations = async (req, res) => {
    try {
        // Use orgId from query or default to 'default-org' for development
        const orgId = req.query.orgId || 'default-org';

        console.log(`Fetching recommendations for orgId: ${orgId}`);

        const recommendations = await RecommendationService.generateRecommendations(orgId);

        res.json({
            success: true,
            data: recommendations,
            count: recommendations.length
        });
    } catch (error) {
        console.error('Error in getRecommendations:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch recommendations'
        });
    }
};

module.exports = { getRecommendations };
