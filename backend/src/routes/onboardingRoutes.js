const express = require('express');
const router = express.Router();
const onboardingController = require('../controllers/onboardingController');

router.post('/complete', onboardingController.completeOnboarding);

module.exports = router;
