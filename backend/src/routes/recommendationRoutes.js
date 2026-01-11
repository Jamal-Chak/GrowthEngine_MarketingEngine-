const express = require('express');
const router = express.Router();
const { getRecommendations } = require('../controllers/recommendationController');
// const { protect } = require('../middleware/authMiddleware');

// Temporarily remove auth for development
router.get('/', getRecommendations);

module.exports = router;
