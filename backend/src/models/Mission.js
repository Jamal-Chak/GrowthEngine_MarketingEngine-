const mongoose = require('mongoose');

const missionSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true,
    },
    orgId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true,
    },
    recommendationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recommendation',
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: '',
    },
    category: {
        type: String,
        enum: ['onboarding', 'growth', 'retention', 'foundation', 'custom'],
        default: 'custom',
    },
    steps: [{
        description: {
            type: String,
            required: true,
        },
        xpReward: {
            type: Number,
            default: 10,
        },
        completed: {
            type: Boolean,
            default: false,
        },
        completedAt: {
            type: Date,
        },
    }],
    xpReward: {
        type: Number,
        default: 100,
    },
    estimatedTime: {
        type: String,
        default: '30 minutes',
    },
    impactLevel: {
        type: String,
        enum: ['foundation', 'low', 'medium', 'high'],
        default: 'medium',
    },
    completed: {
        type: Boolean,
        default: false,
    },
    completedAt: {
        type: Date,
    },
}, { timestamps: true });

// Indexes for performance
missionSchema.index({ userId: 1, completed: 1 });
missionSchema.index({ userId: 1, category: 1 });

module.exports = mongoose.model('Mission', missionSchema);
