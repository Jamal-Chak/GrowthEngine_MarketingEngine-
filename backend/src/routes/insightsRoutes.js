const express = require('express');
const router = express.Router();
const insightsController = require('../controllers/insightsController');

// Get analytics insights for a user
router.get('/insights', insightsController.getInsights);

// Get mission recommendations based on insights
router.get('/recommendations', insightsController.getRecommendations);

// Get metrics summary
router.get('/metrics', insightsController.getMetrics);

module.exports = router;
