const express = require('express');
const router = express.Router();
const FeedbackService = require('../services/FeedbackService');

// Submit mission feedback
router.post('/submit', async (req, res) => {
    try {
        const { userId, missionId, rating, comment } = req.body;

        if (!userId || !missionId || rating === undefined) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const result = await FeedbackService.submitFeedback(userId, missionId, { rating, comment });

        res.json(result);
    } catch (error) {
        console.error('Submit feedback error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get feedback for a mission
router.get('/mission/:missionId', async (req, res) => {
    try {
        const { missionId } = req.params;
        const feedback = await FeedbackService.getFeedbackByMission(missionId);

        res.json({ feedback });
    } catch (error) {
        console.error('Get feedback error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get mission feedback stats
router.get('/mission/:missionId/stats', async (req, res) => {
    try {
        const { missionId } = req.params;
        const stats = await FeedbackService.getMissionStats(missionId);

        res.json({ stats });
    } catch (error) {
        console.error('Get feedback stats error:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
