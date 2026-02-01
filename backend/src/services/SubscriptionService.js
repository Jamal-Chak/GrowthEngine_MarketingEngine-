const Subscription = require('../models/Subscription');
const PaymentService = require('./PaymentService');

class SubscriptionService {

    async getSubscription(userId) {
        const User = require('../models/User');
        const user = await User.findById(userId);

        if (!user) throw new Error('User not found');

        // Return standardized subscription object
        return {
            plan: user.subscription?.plan || 'free',
            status: user.subscription?.status || 'active',
            features: this.getFeatures(user.subscription?.plan || 'free')
        };
    }

    getFeatures(plan) {
        const plans = {
            free: { missionsLimit: -1, aiRecommendationsLimit: 1, teamMembersLimit: 1 },
            pro: { missionsLimit: -1, aiRecommendationsLimit: -1, teamMembersLimit: 3 },
            agency: { missionsLimit: -1, aiRecommendationsLimit: -1, teamMembersLimit: -1 }
        };
        return plans[plan];
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

        // Debug
        console.log(`[Subscription] Checking limit for ${userId}: ${feature} (Plan: ${subscription.plan})`);

        let limit;
        let actualUsage = currentCount;

        switch (feature) {
            case 'missions':
                limit = subscription.features.missionsLimit;
                break;
            case 'aiRecommendations':
                limit = subscription.features.aiRecommendationsLimit;
                // If usage not passed, calculate it
                if (actualUsage === undefined) {
                    const Insight = require('../models/Insight');
                    actualUsage = await Insight.countDocuments({
                        userId: userId,
                        type: 'opportunity' // Assuming AI strategies are saved as 'opportunity'
                    });
                }
                break;
            case 'team':
                limit = subscription.features.teamMembersLimit;
                break;
            default:
                return true;
        }

        console.log(`[Subscription] Limit: ${limit}, Usage: ${actualUsage}`);

        // -1 means unlimited
        if (limit === -1) return true;

        return actualUsage < limit;
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
