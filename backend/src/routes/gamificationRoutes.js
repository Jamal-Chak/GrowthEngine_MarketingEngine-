
const express = require('express');
const router = express.Router();
const { getProfile, getStats } = require('../controllers/gamificationController');

const { protect } = require('../middleware/authMiddleware');

// Allow bypassing auth for demo mode
router.get('/profile', protect, getProfile);
router.get('/stats', protect, getStats);

module.exports = router;
