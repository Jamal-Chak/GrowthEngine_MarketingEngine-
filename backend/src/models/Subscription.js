const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    plan: {
        type: String,
        enum: ['free', 'pro', 'team'],
        default: 'free'
    },
    status: {
        type: String,
        enum: ['active', 'cancelled', 'expired', 'past_due'],
        default: 'active'
    },
    flutterwaveSubscriptionId: {
        type: String
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date
    },
    nextBillingDate: {
        type: Date
    },
    features: {
        missionsLimit: { type: Number, default: 10 }, // -1 for unlimited
        aiRecommendationsLimit: { type: Number, default: 5 },
        teamMembersLimit: { type: Number, default: 0 }
    }
}, {
    timestamps: true
});

// Calculate limits based on plan before saving
subscriptionSchema.pre('save', function (next) {
    if (this.isModified('plan')) {
        switch (this.plan) {
            case 'pro':
                this.features = {
                    missionsLimit: -1,
                    aiRecommendationsLimit: 50,
                    teamMembersLimit: 0
                };
                break;
            case 'team':
                this.features = {
                    missionsLimit: -1,
                    aiRecommendationsLimit: 200,
                    teamMembersLimit: 10
                };
                break;
            case 'free':
            default:
                this.features = {
                    missionsLimit: 10,
                    aiRecommendationsLimit: 5,
                    teamMembersLimit: 0
                };
        }
    }
    next();
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;
