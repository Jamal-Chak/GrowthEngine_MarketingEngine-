const express = require('express');
const router = express.Router();
const { logEvent, getEvents } = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, logEvent);
router.get('/', protect, getEvents);

module.exports = router;
