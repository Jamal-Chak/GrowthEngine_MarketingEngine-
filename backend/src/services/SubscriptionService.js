const Subscription = require('../models/Subscription');
const PaymentService = require('./PaymentService');

class SubscriptionService {

    /**
     * Get or create subscription for a user
     * @param {string} userId 
     */
    async getSubscription(userId) {
        let subscription = await Subscription.findOne({ userId });

        if (!subscription) {
            // Create default free subscription
            subscription = await Subscription.create({
                userId,
                plan: 'free'
            });
        }

        return subscription;
    }

    /**
     * Process a successful payment and update subscription
     * @param {string} userId 
     * @param {string} plan 
     * @param {Object} paymentData 
     */
    async upgradeSubscription(userId, plan, paymentData) {
        let subscription = await this.getSubscription(userId);

        subscription.plan = plan;
        subscription.status = 'active';
        subscription.startDate = new Date();

        // Set end date to 30 days from now (simplified monthly billing)
        // In a real scenario, this would be set based on the recurrence logic from Flutterwave
        const nextMonth = new Date();
        nextMonth.setDate(nextMonth.getDate() + 30);
        subscription.endDate = nextMonth;
        subscription.nextBillingDate = nextMonth;

        await subscription.save();
        return subscription;
    }

    /**
     * Check if user has access to a feature based on limits
     * @param {string} userId 
     * @param {string} feature - 'missions' | 'aiRecommendations' | 'team'
     * @param {number} currentCount - Current usage count
     */
    async checkLimit(userId, feature, currentCount) {
        const subscription = await this.getSubscription(userId);

        let limit;
        switch (feature) {
            case 'missions':
                limit = subscription.features.missionsLimit;
                break;
            case 'aiRecommendations':
                limit = subscription.features.aiRecommendationsLimit;
                break;
            case 'team':
                limit = subscription.features.teamMembersLimit;
                break;
            default:
                return true;
        }

        // -1 means unlimited
        if (limit === -1) return true;

        return currentCount < limit;
    }

    /**
     * Initialize upgrade process
     * @param {Object} user 
     * @param {string} plan 
     */
    async initializeUpgrade(user, plan) {
        let amount = 0;
        if (plan === 'pro') amount = 19;
        if (plan === 'team') amount = 49;

        if (amount === 0) throw new Error('Invalid plan selected');

        return await PaymentService.initializePayment(user, plan, amount);
    }
}

module.exports = new SubscriptionService();
