const mongoose = require('mongoose');

const gamificationProfileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    points: { type: Number, default: 0 },
    badges: [{ type: String }],
    achievements: {
        missionsCompleted: { type: Number, default: 0 },
        currentStreak: { type: Number, default: 0 },
        longestStreak: { type: Number, default: 0 },
        lastActivityDate: { type: Date },
        totalXPEarned: { type: Number, default: 0 }
    }
}, { timestamps: true });

module.exports = mongoose.model('GamificationProfile', gamificationProfileSchema);
