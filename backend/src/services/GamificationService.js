const GamificationProfile = require('../models/GamificationProfile');
const Mission = require('../models/Mission');
const User = require('../models/User');

// Badge Definitions
const BADGES = {
    // Onboarding Badges
    first_mission: {
        id: 'first_mission',
        name: 'Getting Started',
        description: 'Complete your first mission',
        icon: '🎯',
        rarity: 'common',
        xpReward: 50,
    },
    profile_complete: {
        id: 'profile_complete',
        name: 'All Set Up',
        description: 'Complete your profile setup',
        icon: '✅',
        rarity: 'common',
        xpReward: 30,
    },

    // Mission Badges
    mission_streak_3: {
        id: 'mission_streak_3',
        name: 'On Fire',
        description: 'Complete 3 missions in a row',
        icon: '🔥',
        rarity: 'uncommon',
        xpReward: 100,
    },
    mission_streak_7: {
        id: 'mission_streak_7',
        name: 'Unstoppable',
        description: 'Complete 7 missions in a row',
        icon: '⚡',
        rarity: 'rare',
        xpReward: 250,
    },

    // Milestone Badges
    missions_10: {
        id: 'missions_10',
        name: 'Growth Warrior',
        description: 'Complete 10 missions',
        icon: '🏆',
        rarity: 'uncommon',
        xpReward: 150,
    },
    missions_50: {
        id: 'missions_50',
        name: 'Growth Master',
        description: 'Complete 50 missions',
        icon: '👑',
        rarity: 'epic',
        xpReward: 500,
    },

    // Level Badges
    level_10: {
        id: 'level_10',
        name: 'Rising Star',
        description: 'Reach level 10',
        icon: '⭐',
        rarity: 'uncommon',
        xpReward: 200,
    },
    level_25: {
        id: 'level_25',
        name: 'Growth Veteran',
        description: 'Reach level 25',
        icon: '🌟',
        rarity: 'rare',
        xpReward: 500,
    },

    // Special Badges
    early_bird: {
        id: 'early_bird',
        name: 'Early Bird',
        description: 'Complete a mission before 8 AM',
        icon: '🌅',
        rarity: 'rare',
        xpReward: 100,
    },
    night_owl: {
        id: 'night_owl',
        name: 'Night Owl',
        description: 'Complete a mission after 11 PM',
        icon: '🦉',
        rarity: 'rare',
        xpReward: 100,
    },
    perfectionist: {
        id: 'perfectionist',
        name: 'Perfectionist',
        description: 'Complete 5 missions with all steps done',
        icon: '💯',
        rarity: 'epic',
        xpReward: 300,
    },
};

const XP_RULES = {
    MISSION_COMPLETE: 100,
    MISSION_STEP: 20,
    DAILY_LOGIN: 10,
    STREAK_BONUS: 50,
    BADGE_UNLOCK: (rarity) => {
        const multipliers = { common: 1, uncommon: 2, rare: 3, epic: 5, legendary: 10 };
        return 50 * (multipliers[rarity] || 1);
    },
};

const calculateXPForLevel = (level) => {
    return Math.floor(100 * Math.pow(1.1, level - 1));
};

class GamificationService {
    async getProfile(userId) {
        try {
            let profile = await GamificationProfile.findOne({ userId: userId });

            if (!profile) {
                profile = await GamificationProfile.create({
                    userId: userId,
                    xp: 0,
                    level: 1,
                    points: 0,
                    badges: [],
                    achievements: {
                        missionsCompleted: 0,
                        currentStreak: 0,
                        longestStreak: 0,
                        lastActivityDate: new Date(),
                        totalXPEarned: 0
                    }
                });
            }
            return profile;
        } catch (error) {
            console.warn('GamificationService error. returning mock.', error.message);
            return {
                userId: userId,
                xp: 150,
                level: 2,
                badges: ['first_mission'],
                achievements: {
                    missionsCompleted: 1,
                    currentStreak: 1,
                    longestStreak: 1,
                    lastActivityDate: new Date(),
                }
            };
        }
    }

    async updateProfile(userId, updates) {
        try {
            await GamificationProfile.findOneAndUpdate({ userId: userId }, updates);
        } catch (e) {
            console.error('Failed to update profile:', e.message);
        }
    }

    async awardXP(userId, amount, reason = 'Unknown') {
        const profile = await this.getProfile(userId);
        const oldLevel = profile.level;

        profile.xp += amount;
        if (profile.achievements) profile.achievements.totalXPEarned = (profile.achievements.totalXPEarned || 0) + amount;

        let newLevel = profile.level;
        let xpForNextLevel = calculateXPForLevel(newLevel);

        while (profile.xp >= xpForNextLevel) {
            newLevel++;
            xpForNextLevel = calculateXPForLevel(newLevel);
        }

        const leveledUp = newLevel > oldLevel;
        profile.level = newLevel;

        // Check level badges
        if (leveledUp) {
            if (newLevel === 10 && !profile.badges.includes('level_10')) await this.awardBadge(userId, 'level_10');
            if (newLevel === 25 && !profile.badges.includes('level_25')) await this.awardBadge(userId, 'level_25');
        }

        await profile.save();

        return { profile, leveledUp, oldLevel, newLevel, xpAwarded: amount, reason };
    }

    async awardBadge(userId, badgeId) {
        let profile = await this.getProfile(userId);
        const badge = BADGES[badgeId];

        if (!badge) throw new Error(`Badge ${badgeId} not found`);

        // Ensure badges is array
        if (!Array.isArray(profile.badges)) profile.badges = [];

        if (profile.badges.includes(badgeId)) {
            return { profile, alreadyUnlocked: true };
        }

        profile.badges.push(badgeId);
        await profile.save();

        // Award badge XP
        if (badge.xpReward) {
            await this.awardXP(userId, badge.xpReward, `Badge: ${badge.name}`);
        }

        return { profile, badge, newlyUnlocked: true };
    }

    async onMissionComplete(userId) {
        const profile = await this.getProfile(userId);

        if (!profile.achievements) profile.achievements = {};

        profile.achievements.missionsCompleted = (profile.achievements.missionsCompleted || 0) + 1;

        const today = new Date().toDateString();
        const lastActivity = profile.achievements.lastActivityDate ? new Date(profile.achievements.lastActivityDate).toDateString() : null;
        const yesterday = new Date(Date.now() - 86400000).toDateString();

        if (lastActivity === today) {
            // No streak change
        } else if (lastActivity === yesterday) {
            profile.achievements.currentStreak = (profile.achievements.currentStreak || 0) + 1;
        } else {
            profile.achievements.currentStreak = 1;
        }

        if ((profile.achievements.currentStreak || 0) > (profile.achievements.longestStreak || 0)) {
            profile.achievements.longestStreak = profile.achievements.currentStreak;
        }

        profile.achievements.lastActivityDate = new Date();

        // Mark modified for mixed types if Mongoose doesn't detect deep changes automatically (safeguard)
        profile.markModified('achievements');

        // Check badges
        const badges = [];
        if (profile.achievements.missionsCompleted === 1) badges.push(await this.awardBadge(userId, 'first_mission'));
        if (profile.achievements.missionsCompleted === 10) badges.push(await this.awardBadge(userId, 'missions_10'));
        if (profile.achievements.missionsCompleted === 50) badges.push(await this.awardBadge(userId, 'missions_50'));
        if (profile.achievements.currentStreak === 3) badges.push(await this.awardBadge(userId, 'mission_streak_3'));
        if (profile.achievements.currentStreak === 7) badges.push(await this.awardBadge(userId, 'mission_streak_7'));

        const hour = new Date().getHours();
        if (hour < 8) badges.push(await this.awardBadge(userId, 'early_bird'));
        if (hour >= 23) badges.push(await this.awardBadge(userId, 'night_owl'));

        await profile.save();

        return { profile, badgesUnlocked: badges.filter(b => b.newlyUnlocked) };
    }

    async getStats(userId) {
        const profile = await this.getProfile(userId);
        const currentLevelXP = profile.level > 1 ? calculateXPForLevel(profile.level - 1) : 0;
        const nextLevelXP = calculateXPForLevel(profile.level);
        const xpProgress = profile.xp - currentLevelXP;
        const xpNeeded = nextLevelXP - currentLevelXP;

        // Calculate Founder Score (weekly performance)
        const founderScore = await this.calculateFounderScore(userId);

        return {
            level: profile.level,
            xp: profile.xp,
            xpForNextLevel: nextLevelXP,
            xpProgress,
            xpNeeded,
            progressPercentage: (xpProgress / xpNeeded) * 100,
            badges: (profile.badges || []).map(id => BADGES[id]).filter(Boolean),
            badgeCount: (profile.badges || []).length,
            achievements: profile.achievements || {},
            founderScore,
        };
    }

    async calculateFounderScore(userId) {
        // Founder Score: 0-100 based on weekly performance
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        try {
            // Get missions completed this week
            const missions = await Mission.find({
                userId: userId,
                completed: true,
                completedAt: { $gte: weekAgo }
            });

            const profile = await this.getProfile(userId);
            const achievements = profile.achievements || {};

            // Base Score Components:
            const missionsThisWeek = (missions || []).length;
            const currentStreak = achievements.currentStreak || 0;
            const activityToday = achievements.lastActivityDate ?
                new Date(achievements.lastActivityDate).toDateString() === new Date().toDateString() : false;

            // Calculate score (0-100)
            let score = 0;
            score += Math.min(missionsThisWeek * 15, 50);  // Max 50 for missions (3-4 missions = full points)
            score += Math.min(currentStreak * 5, 25);       // Max 25 for streaks (5 days = full points)
            score += activityToday ? 25 : 0;                // 25 points for activity today

            return Math.min(Math.round(score), 100);
        } catch (error) {
            console.warn('Error calculating Founder Score:', error.message);
            return 50; // Default score
        }
    }

    getAllBadges() { return Object.values(BADGES); }

    async getLeaderboard(limit = 10) {
        const profiles = await GamificationProfile.find().sort({ xp: -1 }).limit(limit).populate('userId', 'email');
        return profiles.map(p => ({
            ...p.toObject(),
            user: p.userId
        }));
    }
}

module.exports = new GamificationService();
