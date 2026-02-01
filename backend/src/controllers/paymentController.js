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

// Mock Gateway Page (Simulates generic payment page)
exports.mockGateway = (req, res) => {
    const { tx_ref, userId, plan } = req.query;

    // Simulate user clicking "Pay Now" -> Redirect to Callback
    // We encode the metadata in the transaction ID so verifyTransaction can decode it (stateless mock)
    const meta = JSON.stringify({ userId, plan });
    const encodedMeta = Buffer.from(meta).toString('base64');
    const mockTransactionId = `mock-id-${encodedMeta}`;

    const callbackUrl = `http://127.0.0.1:${process.env.PORT || 5000}/api/payments/callback?status=successful&transaction_id=${mockTransactionId}&tx_ref=${tx_ref}`;

    // Return a simple HTML page that auto-redirects after 2 seconds
    res.send(`
        <html>
            <body style="font-family: sans-serif; text-align: center; padding: 50px; background: #f0fdf4;">
                <h1 style="color: #166534;">GrowthEngine Secure Payment (MOCK)</h1>
                <p>Processing payment for <strong>${plan}</strong> plan...</p>
                <div style="margin: 20px auto; width: 40px; height: 40px; border: 4px solid #166534; border-top: 4px solid transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                <p style="color: #666;">Do not close this window.</p>
                <script>
                    setTimeout(() => {
                        window.location.href = "${callbackUrl}";
                    }, 2000);
                </script>
                <style>@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }</style>
            </body>
        </html>
    `);
};

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
