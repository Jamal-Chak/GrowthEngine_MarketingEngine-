const Gamification = require('../models/Gamification');

class GamificationService {
    async getProfile(userId) {
        let profile = await Gamification.findOne({ userId });
        if (!profile) {
            profile = await Gamification.create({ userId });
        }
        return profile;
    }

    async addXp(userId, amount) {
        const profile = await this.getProfile(userId);
        profile.xp += amount;

        // Simple level up logic: Level = 1 + floor(xp / 100)
        const newLevel = 1 + Math.floor(profile.xp / 100);
        if (newLevel > profile.level) {
            profile.level = newLevel;
            // Could trigger level up event here
        }

        await profile.save();
        return profile;
    }
}

module.exports = new GamificationService();
