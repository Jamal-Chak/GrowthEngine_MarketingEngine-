const mongoose = require('mongoose');

const stepSchema = new mongoose.Schema({
    description: { type: String, required: true },
    xpReward: { type: Number, default: 10 },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date }
});

const missionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orgId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
    templateId: { type: String, required: false }, // Optional: link back to a template key
    title: { type: String, required: true },
    description: { type: String },
    whyMatters: { type: String },
    category: { type: String, enum: ['onboarding', 'growth', 'retention', 'revenue', 'traffic', 'conversion', 'foundation', 'custom'], default: 'custom' },
    xpReward: { type: Number, default: 100 },
    estimatedTime: { type: String },
    impactLevel: { type: String, enum: ['low', 'medium', 'high', 'foundation'], default: 'medium' },
    steps: [stepSchema],
    completed: { type: Boolean, default: false },
    completedAt: { type: Date }
}, { timestamps: true });

// Indexes for performance
missionSchema.index({ userId: 1, completed: 1 });
missionSchema.index({ userId: 1, category: 1 });

module.exports = mongoose.model('Mission', missionSchema);
