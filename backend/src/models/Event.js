const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    eventType: { type: String, required: true }, // e.g., 'page_view', 'click', 'feature_usage'
    eventData: { type: mongoose.Schema.Types.Mixed }, // Flexible JSON data
}, { timestamps: true });

eventSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Event', eventSchema);
