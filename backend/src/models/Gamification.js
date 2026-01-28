const mongoose = require('mongoose');

const gamificationSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    xp: {
        type: Number,
        default: 0,
        min: 0,
    },
    level: {
        type: Number,
        default: 1,
        min: 1,
    },
    badges: [{
        type: String, // Badge IDs
    }],
    achievements: {
        missionsCompleted: {
            type: Number,
            default: 0,
        },
        currentStreak: {
            type: Number,
            default: 0,
        },
        longestStreak: {
            type: Number,
            default: 0,
        },
        lastActivityDate: {
            type: Date,
            default: Date.now,
        },
        totalXPEarned: {
            type: Number,
            default: 0,
        },
    },
}, { timestamps: true });

// Indexes for leaderboard queries
gamificationSchema.index({ xp: -1, level: -1 });

module.exports = mongoose.model('Gamification', gamificationSchema);
