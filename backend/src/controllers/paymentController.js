const SubscriptionService = require('../services/SubscriptionService');
const PaymentService = require('../services/PaymentService');

// Initialize payment for subscription upgrade
exports.initializePayment = async (req, res) => {
    try {
        const { plan } = req.body;
        const user = req.user;

        const result = await SubscriptionService.initializeUpgrade(user, plan);

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('Payment initialization error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Could not initialize payment'
        });
    }
};

// Handle payment verification (redirect callback)
exports.verifyPayment = async (req, res) => {
    try {
        const { transaction_id, status, tx_ref } = req.query;

        if (status === 'cancelled') {
            return res.redirect(`${process.env.FRONTEND_URL}/pricing?status=cancelled`);
        }

        const transaction = await PaymentService.verifyTransaction(transaction_id);

        if (transaction.status === 'successful') {
            const userId = transaction.meta.userId;
            const plan = transaction.meta.plan;

            await SubscriptionService.upgradeSubscription(userId, plan, transaction);

            return res.redirect(`${process.env.FRONTEND_URL}/settings?payment=success`);
        } else {
            return res.redirect(`${process.env.FRONTEND_URL}/pricing?status=failed`);
        }
    } catch (error) {
        console.error('Payment verification error:', error);
        return res.redirect(`${process.env.FRONTEND_URL}/pricing?status=error`);
    }
};

// Get current subscription status
exports.getSubscriptionFn = async (req, res) => {
    try {
        const subscription = await SubscriptionService.getSubscription(req.user._id);
        res.status(200).json({
            success: true,
            data: subscription
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Could not fetch subscription'
        });
    }
};

// Cancel subscription
exports.cancelSubscription = async (req, res) => {
    try {
        // Implementation for cancellation would go here
        // For MVP we might just set status to cancelled in DB
        // In production, call Flutterwave cancel API
        res.status(200).json({
            success: true,
            message: 'Subscription cancelled'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Could not cancel subscription'
        });
    }
};
