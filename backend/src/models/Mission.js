const mongoose = require('mongoose');

const missionSchema = new mongoose.Schema({
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
    steps: [{
        description: String,
        completed: {
            type: Boolean,
            default: false,
        },
    }],
    completed: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

module.exports = mongoose.model('Mission', missionSchema);
