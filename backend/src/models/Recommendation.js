const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
    orgId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    reason: {
        type: String,
    },
    impactScore: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'completed'],
        default: 'pending',
    },
}, { timestamps: true });

module.exports = mongoose.model('Recommendation', recommendationSchema);
