const Flutterwave = require('flutterwave-node-v3');
const { v4: uuidv4 } = require('uuid');

class PaymentService {
    constructor() {
        try {
            this.flw = new Flutterwave(
                process.env.FLW_PUBLIC_KEY || 'FLWPUBK_TEST-SANDBOX',
                process.env.FLW_SECRET_KEY || 'FLWSECK_TEST-SANDBOX'
            );
        } catch (error) {
            console.warn('Flutterwave initialization failed:', error.message);
            this.flw = null;
        }
    }

    /**
     * Initialize a payment transaction
     * @param {Object} user - User object
     * @param {string} plan - Plan name (pro, team)
     * @param {number} amount - Amount to charge
     * @returns {Promise<Object>} - Payment link and ref
     */
    async initializePayment(user, plan, amount) {
        // MOCK MODE: If keys are default/missing, return local mock link
        if (!this.flw || process.env.FLW_PUBLIC_KEY?.includes('SANDBOX')) {
            console.log('[Payment] Using Mock Gateway (Keys missing/default)');
            const tx_ref = `tx-mock-${uuidv4()}`;
            // Point to our internal mock gateway
            const mockLink = `http://127.0.0.1:${process.env.PORT || 5000}/api/payments/mock-gateway?tx_ref=${tx_ref}&userId=${user._id}&plan=${plan}`;

            return {
                link: mockLink,
                tx_ref
            };
        }

        try {
            const tx_ref = `tx-${uuidv4()}`;

            const payload = {
                tx_ref,
                amount,
                currency: 'USD',
                // Redirect to BACKEND for verification and final redirection to frontend
                redirect_url: `http://127.0.0.1:${process.env.PORT || 5000}/api/payments/callback`,
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
        // MOCK MODE: Verify mock transaction
        if (transactionId.toString().startsWith('mock-id-')) {
            const encodedMeta = transactionId.split('mock-id-')[1];
            const meta = JSON.parse(Buffer.from(encodedMeta, 'base64').toString('ascii'));

            return {
                status: 'successful',
                amount: 19, // Dummy
                currency: 'USD',
                meta: meta // Return decoded userId and plan
            };
        }

        if (!this.flw) throw new Error('Payment service unavailable');
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
