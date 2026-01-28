const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const paymentController = require('../controllers/paymentController');

// Initialize payment
router.post('/initialize', protect, paymentController.initializePayment);

// Verify payment (callback from Flutterwave)
// Note: This endpoint is reached via redirect, so it might not have the Bearer token in headers depending on flow
// For security, usually Flutterwave sends signature or we strictly rely on transaction verification with ID
router.get('/callback', paymentController.verifyPayment);

// Get subscription status
router.get('/subscription', protect, paymentController.getSubscriptionFn);

// Cancel subscription
router.post('/cancel', protect, paymentController.cancelSubscription);

module.exports = router;
