const mongoose = require('mongoose');

const insightSchema = new mongoose.Schema({
    userId: { type: String, required: true }, // Changed from ObjectId to String to allow flexibility (UUID/ObjectId)
    type: { type: String, required: true }, // e.g., 'stagnation', 'spike', 'pattern', 'drop'
    severity: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
    title: { type: String, required: true },
    description: { type: String },
    suggestedMission: { type: String }, // Template key
    reason: { type: String },
    isRead: { type: Boolean, default: false },
    isActioned: { type: Boolean, default: false }
}, { timestamps: true });

insightSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Insight', insightSchema);
