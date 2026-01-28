const Mission = require('../models/Mission');
const GamificationService = require('./GamificationService');

// Mission Templates
const MISSION_TEMPLATES = {
    onboarding: {
        title: 'Complete Your Profile Setup',
        description: 'Get your account ready for growth tracking',
        category: 'onboarding',
        xpReward: 100,
        steps: [
            { description: 'Add your company information', xpReward: 20 },
            { description: 'Connect your first data source', xpReward: 30 },
            { description: 'Set your growth goals', xpReward: 30 },
            { description: 'Invite your first team member', xpReward: 20 },
        ],
        estimatedTime: '10 minutes',
        impactLevel: 'foundation',
    },
    contentStrategy: {
        title: 'Launch Your Content Strategy',
        description: 'Create and publish your first content piece',
        category: 'growth',
        xpReward: 150,
        steps: [
            { description: 'Research 3 competitor blogs', xpReward: 30 },
            { description: 'Create content calendar for next month', xpReward: 40 },
            { description: 'Write and publish first blog post', xpReward: 50 },
            { description: 'Share on social media channels', xpReward: 30 },
        ],
        estimatedTime: '2-3 hours',
        impactLevel: 'high',
    },
    emailCampaign: {
        title: 'Build Your Email List',
        description: 'Set up lead capture and send first campaign',
        category: 'growth',
        xpReward: 200,
        steps: [
            { description: 'Create lead magnet offer', xpReward: 40 },
            { description: 'Design signup form', xpReward: 30 },
            { description: 'Integrate with email provider', xpReward: 50 },
            { description: 'Write and send welcome sequence', xpReward: 80 },
        ],
        estimatedTime: '3-4 hours',
        impactLevel: 'high',
    },
    analytics: {
        title: 'Set Up Growth Analytics',
        description: 'Track the metrics that matter',
        category: 'foundation',
        xpReward: 120,
        steps: [
            { description: 'Define your key growth metrics', xpReward: 30 },
            { description: 'Set up tracking events', xpReward: 40 },
            { description: 'Create your first dashboard', xpReward: 30 },
            { description: 'Schedule weekly review', xpReward: 20 },
        ],
        estimatedTime: '1 hour',
        impactLevel: 'foundation',
    },
    retention: {
        title: 'Improve Customer Retention',
        description: 'Keep your existing customers engaged',
        category: 'retention',
        xpReward: 180,
        steps: [
            { description: 'Analyze churn reasons', xpReward: 40 },
            { description: 'Create win-back campaign', xpReward: 50 },
            { description: 'Set up customer success check-ins', xpReward: 50 },
            { description: 'Launch loyalty program', xpReward: 40 },
        ],
        estimatedTime: '2 hours',
        impactLevel: 'high',
    },
};

class MissionService {
    /**
     * Create a mission from a template
     */
    async createMissionFromTemplate(userId, orgId, templateKey, customData = {}) {
        const template = MISSION_TEMPLATES[templateKey];
        if (!template) {
            throw new Error(`Mission template '${templateKey}' not found`);
        }

        const mission = await Mission.create({
            userId,
            orgId,
            title: customData.title || template.title,
            description: customData.description || template.description,
            category: template.category,
            steps: template.steps.map(step => ({
                description: step.description,
                xpReward: step.xpReward,
                completed: false,
            })),
            xpReward: template.xpReward,
            estimatedTime: template.estimatedTime,
            impactLevel: template.impactLevel,
            completed: false,
        });

        return mission;
    }

    /**
     * Create a custom mission
     */
    async createMission(userId, orgId, missionData) {
        const mission = await Mission.create({
            userId,
            orgId,
            title: missionData.title,
            description: missionData.description,
            category: missionData.category || 'custom',
            steps: missionData.steps.map(step => ({
                description: typeof step === 'string' ? step : step.description,
                xpReward: typeof step === 'object' ? step.xpReward : 10,
                completed: false,
            })),
            xpReward: missionData.xpReward || 100,
            estimatedTime: missionData.estimatedTime,
            impactLevel: missionData.impactLevel || 'medium',
            completed: false,
        });

        return mission;
    }

    /**
     * Get all missions for a user/organization
     */
    async getMissions(userId, filters = {}) {
        const query = { userId };

        if (filters.completed !== undefined) {
            query.completed = filters.completed;
        }

        if (filters.category) {
            query.category = filters.category;
        }

        return await Mission.find(query).sort({ createdAt: -1 });
    }

    /**
     * Get a single mission by ID
     */
    async getMissionById(missionId, userId) {
        const mission = await Mission.findOne({ _id: missionId, userId });
        if (!mission) {
            throw new Error('Mission not found');
        }
        return mission;
    }

    /**
     * Complete a step in a mission
     */
    async completeStep(missionId, stepIndex, userId) {
        const mission = await this.getMissionById(missionId, userId);

        if (stepIndex < 0 || stepIndex >= mission.steps.length) {
            throw new Error('Invalid step index');
        }

        if (mission.steps[stepIndex].completed) {
            return { mission, alreadyCompleted: true };
        }

        // Mark step as completed
        mission.steps[stepIndex].completed = true;
        mission.steps[stepIndex].completedAt = new Date();

        // Award XP for step completion
        const stepXp = mission.steps[stepIndex].xpReward || 10;
        await GamificationService.awardXP(userId, stepXp, `Completed step: ${mission.steps[stepIndex].description}`);

        // Check if all steps are completed
        const allStepsCompleted = mission.steps.every(step => step.completed);
        if (allStepsCompleted && !mission.completed) {
            mission.completed = true;
            mission.completedAt = new Date();

            // Award mission completion XP
            await GamificationService.awardXP(userId, mission.xpReward, `Completed mission: ${mission.title}`);
        }

        await mission.save();

        return { mission, stepXp, missionCompleted: allStepsCompleted };
    }

    /**
     * Complete entire mission
     */
    async completeMission(missionId, userId) {
        const mission = await this.getMissionById(missionId, userId);

        if (mission.completed) {
            return { mission, alreadyCompleted: true };
        }

        // Mark all steps as completed
        mission.steps.forEach(step => {
            if (!step.completed) {
                step.completed = true;
                step.completedAt = new Date();
            }
        });

        mission.completed = true;
        mission.completedAt = new Date();

        // Award XP
        await GamificationService.awardXP(userId, mission.xpReward, `Completed mission: ${mission.title}`);

        await mission.save();

        return { mission, xpAwarded: mission.xpReward };
    }

    /**
     * Get mission statistics
     */
    async getMissionStats(userId) {
        const [total, completed, inProgress] = await Promise.all([
            Mission.countDocuments({ userId }),
            Mission.countDocuments({ userId, completed: true }),
            Mission.countDocuments({ userId, completed: false }),
        ]);

        const totalXpEarned = await Mission.aggregate([
            { $match: { userId, completed: true } },
            { $group: { _id: null, total: { $sum: '$xpReward' } } },
        ]);

        return {
            total,
            completed,
            inProgress,
            completionRate: total > 0 ? (completed / total) * 100 : 0,
            totalXpEarned: totalXpEarned[0]?.total || 0,
        };
    }

    /**
     * Get available templates
     */
    getTemplates() {
        return MISSION_TEMPLATES;
    }
}

module.exports = new MissionService();
