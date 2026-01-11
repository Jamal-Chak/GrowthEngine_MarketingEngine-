const express = require('express');
const router = express.Router();
const { createMission, getMissions } = require('../controllers/missionController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createMission);
router.get('/', protect, getMissions);

module.exports = router;
