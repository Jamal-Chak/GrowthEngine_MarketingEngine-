const Flutterwave = require('flutterwave-node-v3');
const { v4: uuidv4 } = require('uuid');

class PaymentService {
    constructor() {
        this.flw = new Flutterwave(
            process.env.FLW_PUBLIC_KEY,
            process.env.FLW_SECRET_KEY
        );
    }

    /**
     * Initialize a payment transaction
     * @param {Object} user - User object
     * @param {string} plan - Plan name (pro, team)
     * @param {number} amount - Amount to charge
     * @returns {Promise<Object>} - Payment link and ref
     */
    async initializePayment(user, plan, amount) {
        try {
            const tx_ref = `tx-${uuidv4()}`;

            const payload = {
                tx_ref,
                amount,
                currency: 'USD',
                redirect_url: `${process.env.FRONTEND_URL}/payment/callback`,
                payment_options: 'card',
                customer: {
                    email: user.email,
                    name: user.name,
                },
                customizations: {
                    title: `GrowthEngine ${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan`,
                    description: `Subscription for ${plan} plan`,
                    logo: 'https://your-logo-url.com/logo.png', // Replace with actual logo
                },
                meta: {
                    userId: user._id.toString(),
                    plan: plan
                }
            };

            const response = await this.flw.Payment.standard(payload);

            if (response.status === 'success') {
                return {
                    link: response.data.link,
                    tx_ref
                };
            } else {
                throw new Error(response.message || 'Payment initialization failed');
            }
        } catch (error) {
            console.error('Payment initialization error:', error);
            throw error;
        }
    }

    /**
     * Verify a transaction
     * @param {string} transactionId - Flutterwave transaction ID
     * @returns {Promise<Object>} - Transaction details
     */
    async verifyTransaction(transactionId) {
        try {
            const response = await this.flw.Transaction.verify({ id: transactionId });

            if (response.status === 'success') {
                return response.data;
            } else {
                throw new Error('Transaction verification failed');
            }
        } catch (error) {
            console.error('Transaction verification error:', error);
            throw error;
        }
    }
}

module.exports = new PaymentService();
