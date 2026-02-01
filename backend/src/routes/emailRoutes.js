const express = require('express');
const router = express.Router();
const EmailService = require('../services/EmailService');

// Test SMTP connection
router.post('/test', async (req, res) => {
    try {
        const { to } = req.body;
        if (!to) {
            return res.status(400).json({ error: 'Target email "to" is required' });
        }

        const result = await EmailService.sendEmail({
            to,
            subject: 'Test Email from GrowthEngine',
            text: 'This is a test email to verify SMTP configuration.',
            html: '<h1>It works!</h1><p>This is a test email to verify SMTP configuration.</p>'
        });

        if (result.success) {
            res.json(result);
        } else {
            res.status(500).json(result);
        }
    } catch (error) {
        console.error('Test email error:', error);
        res.status(500).json({ error: error.message });
    }
});


// Trigger Weekly Summary for a user (Manual Trigger)
router.post('/weekly-summary', async (req, res) => {
    try {
        const { userId, email } = req.body;

        let user;
        const User = require('../models/User');
        const GamificationService = require('../services/GamificationService');

        if (userId) {
            user = await User.findById(userId);
        } else if (email) {
            user = await User.findOne({ email });
        }

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const stats = await GamificationService.getStats(user._id);
        const emailStats = {
            points: stats.xp,
            streak_days: stats.achievements?.currentStreak || 0,
            completed_missions: stats.achievements?.missionsCompleted || 0
        };

        const result = await EmailService.sendWeeklySummary(
            { ...user.toObject(), name: user.email.split('@')[0] },
            emailStats
        );

        res.json(result);
    } catch (error) {
        console.error('Weekly summary error:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
