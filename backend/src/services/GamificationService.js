const Gamification = require('../models/Gamification');

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

// XP Calculation Rules
const XP_RULES = {
    MISSION_COMPLETE: 100,
    MISSION_STEP: 20,
    DAILY_LOGIN: 10,
    STREAK_BONUS: 50, // Per day in streak
    BADGE_UNLOCK: (rarity) => {
        const multipliers = { common: 1, uncommon: 2, rare: 3, epic: 5, legendary: 10 };
        return 50 * (multipliers[rarity] || 1);
    },
};

// Level Progression (XP required for each level)
const calculateXPForLevel = (level) => {
    // Progressive XP requirements: Level 1 = 100 XP, increases by 10% each level
    return Math.floor(100 * Math.pow(1.1, level - 1));
};

class GamificationService {
    /**
     * Get or create gamification profile
     */
    async getProfile(userId) {
        let profile = await Gamification.findOne({ userId });
        if (!profile) {
            profile = await Gamification.create({
                userId,
                xp: 0,
                level: 1,
                badges: [],
                achievements: {
                    missionsCompleted: 0,
                    currentStreak: 0,
                    longestStreak: 0,
                    lastActivityDate: new Date(),
                },
            });
        }
        return profile;
    }

    /**
     * Award XP with reason tracking
     */
    async awardXP(userId, amount, reason = 'Unknown') {
        const profile = await this.getProfile(userId);
        const oldLevel = profile.level;

        profile.xp += amount;

        // Calculate new level
        let newLevel = profile.level;
        let xpForNextLevel = calculateXPForLevel(newLevel);

        while (profile.xp >= xpForNextLevel) {
            newLevel++;
            xpForNextLevel = calculateXPForLevel(newLevel);
        }

        const leveledUp = newLevel > oldLevel;
        profile.level = newLevel;

        // Check for level-based badges
        if (leveledUp) {
            if (newLevel === 10 && !profile.badges.includes('level_10')) {
                await this.awardBadge(userId, 'level_10');
            }
            if (newLevel === 25 && !profile.badges.includes('level_25')) {
                await this.awardBadge(userId, 'level_25');
            }
        }

        await profile.save();

        return {
            profile,
            leveledUp,
            oldLevel,
            newLevel,
            xpAwarded: amount,
            reason,
        };
    }

    /**
     * Award a badge
     */
    async awardBadge(userId, badgeId) {
        const profile = await this.getProfile(userId);
        const badge = BADGES[badgeId];

        if (!badge) {
            throw new Error(`Badge ${badgeId} not found`);
        }

        if (profile.badges.includes(badgeId)) {
            return { profile, alreadyUnlocked: true };
        }

        profile.badges.push(badgeId);

        // Award badge XP
        if (badge.xpReward) {
            profile.xp += badge.xpReward;
        }

        await profile.save();

        return {
            profile,
            badge,
            newlyUnlocked: true,
        };
    }

    /**
     * Handle mission completion
     */
    async onMissionComplete(userId, missionData = {}) {
        const profile = await this.getProfile(userId);

        // Increment missions completed
        profile.achievements.missionsCompleted = (profile.achievements.missionsCompleted || 0) + 1;

        // Update streak
        const today = new Date().toDateString();
        const lastActivity = new Date(profile.achievements.lastActivityDate).toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();

        if (lastActivity === today) {
            // Already completed something today, no streak change
        } else if (lastActivity === yesterday) {
            // Consecutive day
            profile.achievements.currentStreak = (profile.achievements.currentStreak || 0) + 1;
        } else {
            // Streak broken
            profile.achievements.currentStreak = 1;
        }

        // Update longest streak
        if (profile.achievements.currentStreak > (profile.achievements.longestStreak || 0)) {
            profile.achievements.longestStreak = profile.achievements.currentStreak;
        }

        profile.achievements.lastActivityDate = new Date();

        // Check for badges
        const badges = [];

        // First mission
        if (profile.achievements.missionsCompleted === 1) {
            badges.push(await this.awardBadge(userId, 'first_mission'));
        }

        // Milestone badges
        if (profile.achievements.missionsCompleted === 10) {
            badges.push(await this.awardBadge(userId, 'missions_10'));
        }
        if (profile.achievements.missionsCompleted === 50) {
            badges.push(await this.awardBadge(userId, 'missions_50'));
        }

        // Streak badges
        if (profile.achievements.currentStreak === 3) {
            badges.push(await this.awardBadge(userId, 'mission_streak_3'));
        }
        if (profile.achievements.currentStreak === 7) {
            badges.push(await this.awardBadge(userId, 'mission_streak_7'));
        }

        // Time-based badges
        const hour = new Date().getHours();
        if (hour < 8) {
            badges.push(await this.awardBadge(userId, 'early_bird'));
        }
        if (hour >= 23) {
            badges.push(await this.awardBadge(userId, 'night_owl'));
        }

        await profile.save();

        return {
            profile,
            badgesUnlocked: badges.filter(b => b.newlyUnlocked),
        };
    }

    /**
     * Get user statistics
     */
    async getStats(userId) {
        const profile = await this.getProfile(userId);
        const currentLevelXP = profile.level > 1 ? calculateXPForLevel(profile.level - 1) : 0;
        const nextLevelXP = calculateXPForLevel(profile.level);
        const xpProgress = profile.xp - currentLevelXP;
        const xpNeeded = nextLevelXP - currentLevelXP;

        return {
            level: profile.level,
            xp: profile.xp,
            xpForNextLevel: nextLevelXP,
            xpProgress,
            xpNeeded,
            progressPercentage: (xpProgress / xpNeeded) * 100,
            badges: profile.badges.map(id => BADGES[id]).filter(Boolean),
            badgeCount: profile.badges.length,
            achievements: profile.achievements,
        };
    }

    /**
     * Get all available badges
     */
    getAllBadges() {
        return Object.values(BADGES);
    }

    /**
     * Get leaderboard
     */
    async getLeaderboard(limit = 10) {
        const topUsers = await Gamification.find()
            .sort({ xp: -1, level: -1 })
            .limit(limit)
            .lean();

        return topUsers;
    }
}

module.exports = new GamificationService();
