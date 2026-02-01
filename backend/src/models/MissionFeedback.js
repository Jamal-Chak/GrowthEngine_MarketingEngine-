const mongoose = require('mongoose');

const missionFeedbackSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    missionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mission', required: true },
    rating: { type: Boolean, required: true }, // true = helpful, false = not helpful
    comment: { type: String }
}, { timestamps: true });

missionFeedbackSchema.index({ missionId: 1 });

module.exports = mongoose.model('MissionFeedback', missionFeedbackSchema);
