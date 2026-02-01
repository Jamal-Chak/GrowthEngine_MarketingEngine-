const Mission = require('../models/Mission');
const GamificationService = require('./GamificationService');

const MISSION_TEMPLATES = {
    quickWin: {
        title: 'Audit Your Digital Presence',
        description: 'Complete this 5-minute audit to identify your biggest growth opportunities',
        whyMatters: 'Most businesses waste months on the wrong channels. This audit reveals where YOUR customers actually are.',
        category: 'onboarding',
        xpReward: 100,
        steps: [
            { description: 'Google yourself - does your business show up in the first 3 results?', xpReward: 25 },
            { description: 'Search your brand on social media - what do you find?', xpReward: 25 },
            { description: 'Ask ChatGPT: "Where do [your customer type] hang out online?"', xpReward: 25 },
            { description: 'Pick your #1 channel based on what you discovered', xpReward: 25 },
        ],
        estimatedTime: '5 minutes',
        impactLevel: 'foundation',
    },
    onboarding: {
        title: 'Complete Your Profile Setup',
        description: 'Get your account ready for growth tracking',
        whyMatters: 'You can\'t track what you don\'t measure. This setup ensures you see real results.',
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
        title: 'Install Key Tracking Pixels',
        description: 'Ensure you can measure every visitor and conversion.',
        category: 'foundation',
        xpReward: 120,
        estimatedTime: '20 minutes',
        impactLevel: 'foundation',
        steps: [
            { description: 'List your top 3 conversion events (e.g. Purchase, Lead)', xpReward: 30 },
            { description: 'Install GA4 or Meta Pixel on your site', xpReward: 40 },
            { description: 'Verify traffic is being received in real-time', xpReward: 30 },
            { description: 'Add a calendar reminder for Weekly Metrics Review', xpReward: 20 },
        ],
    },
    retention: {
        title: 'Launch a Win-Back Campaign',
        description: 'Re-engage customers who haven\'t visited in 90 days.',
        category: 'retention',
        xpReward: 180,
        estimatedTime: '45 minutes',
        impactLevel: 'high',
        steps: [
            { description: 'Identify customers inactive for 90+ days', xpReward: 40 },
            { description: 'Draft a "We Miss You" email with a small offer', xpReward: 50 },
            { description: 'Set up the campaign in your email tool', xpReward: 50 },
            { description: 'Schedule for delivery tomorrow morning', xpReward: 40 },
        ],
    },

    revenue_growth_1: {
        title: 'Launch a 48-Hour Flash Sale',
        description: 'Generate immediate cash flow with a time-bound offer.',
        whyMatters: 'Urgency-driven offers convert 3-5x better than standard promotions. Get quick revenue without long campaigns.',
        category: 'revenue',
        xpReward: 300,
        estimatedTime: '45 minutes',
        impactLevel: 'high',
        steps: [
            { description: 'Select one product/service to discount (20%+)', xpReward: 50 },
            { description: 'Draft email subject: "48 Hours Only: [Offer]"', xpReward: 50 },
            { description: 'Send email to your existing list', xpReward: 100 },
            { description: 'Post offer on your main social channel', xpReward: 100 },
        ],
    },
    traffic_growth_1: {
        title: 'Repurpose Top Content',
        description: 'Drive traffic without creating new content from scratch.',
        whyMatters: 'Your best content already exists. Repurposing it gets 10x more reach with 1/10th the effort.',
        category: 'traffic',
        xpReward: 250,
        estimatedTime: '30 minutes',
        impactLevel: 'medium',
        steps: [
            { description: 'Identify top performing post from last 90 days', xpReward: 50 },
            { description: 'Convert key points into a social thread/carousel', xpReward: 100 },
            { description: 'Post with link back to original content', xpReward: 50 },
            { description: 'Share link in one relevant community/group', xpReward: 50 },
        ],
    },
    conversion_opt_1: {
        title: 'Add "Risk Reversal" to Signup',
        description: 'Increase conversion rate by removing friction.',
        whyMatters: 'Fear of commitment kills conversions. One simple phrase can boost signups by 30-50%.',
        category: 'conversion',
        xpReward: 200,
        estimatedTime: '15 minutes',
        impactLevel: 'high',
        steps: [
            { description: 'Review your main Call-to-Action area', xpReward: 40 },
            { description: 'Add text: "No credit card required" or "Cancel anytime"', xpReward: 80 },
            { description: 'Verify signup flow works on mobile', xpReward: 40 },
            { description: 'Check that welcome email arrives within 1 min', xpReward: 40 },
        ],
    },
};

class MissionService {
    async createMissionFromTemplate(userId, orgId, templateKey, customData = {}) {
        const template = MISSION_TEMPLATES[templateKey];
        if (!template) throw new Error(`Mission template '${templateKey}' not found`);

        const missionData = {
            userId: userId,
            orgId: orgId,
            templateId: templateKey,
            title: customData.title || template.title,
            description: customData.description || template.description,
            whyMatters: customData.whyMatters || template.whyMatters || '',
            category: template.category,
            steps: template.steps.map(step => ({
                description: step.description,
                xpReward: step.xpReward,
                completed: false,
            })),
            xpReward: template.xpReward,
            estimatedTime: template.estimatedTime,
            impactLevel: template.impactLevel,
            completed: false
        };

        const mission = await Mission.create(missionData);
        return this._transformMission(mission);
    }

    async createMission(userId, orgId, missionData) {
        const newMission = {
            userId: userId,
            orgId: orgId,
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
            completed: false
        };

        const mission = await Mission.create(newMission);
        return this._transformMission(mission);
    }

    async getMissions(userId, filters = {}) {
        try {
            const query = { userId: userId };

            if (filters.completed !== undefined) {
                query.completed = filters.completed === 'true';
            }
            if (filters.category) {
                query.category = filters.category;
            }

            const missions = await Mission.find(query).sort({ createdAt: -1 });
            return missions.map(m => this._transformMission(m));

        } catch (error) {
            console.error('Mission DB error:', error);
            // Return empty array instead of throwing to prevent crashing UI
            return [];
        }
    }

    async getMissionById(missionId, userId) {
        const mission = await Mission.findOne({ _id: missionId, userId: userId });
        if (!mission) throw new Error('Mission not found');
        return this._transformMission(mission);
    }

    async completeStep(missionId, stepIndex, userId) {
        const mission = await Mission.findOne({ _id: missionId, userId: userId });
        if (!mission) throw new Error('Mission not found');

        if (stepIndex < 0 || stepIndex >= mission.steps.length) throw new Error('Invalid step index');

        if (mission.steps[stepIndex].completed) {
            return { mission: this._transformMission(mission), alreadyCompleted: true };
        }

        // Update step
        mission.steps[stepIndex].completed = true;
        mission.steps[stepIndex].completedAt = new Date();

        // Award XP for step
        const stepXp = mission.steps[stepIndex].xpReward || 10;
        await GamificationService.awardXP(userId, stepXp, `Completed step: ${mission.steps[stepIndex].description}`);

        // Check if all steps completed
        const allStepsCompleted = mission.steps.every(step => step.completed);
        let missionCompleted = false;

        if (allStepsCompleted && !mission.completed) {
            mission.completed = true;
            mission.completedAt = new Date();
            missionCompleted = true;

            // Award Mission XP
            await GamificationService.awardXP(userId, mission.xpReward, `Completed mission: ${mission.title}`);
            await GamificationService.onMissionComplete(userId);
        }

        await mission.save();
        return { mission: this._transformMission(mission), stepXp, missionCompleted };
    }

    async completeMission(missionId, userId) {
        const mission = await Mission.findOne({ _id: missionId, userId: userId });
        if (!mission) throw new Error('Mission not found');

        if (mission.completed) return { mission: this._transformMission(mission), alreadyCompleted: true };

        // Mark all steps as completed
        mission.steps.forEach(step => {
            if (!step.completed) {
                step.completed = true;
                step.completedAt = new Date();
            }
        });

        mission.completed = true;
        mission.completedAt = new Date();

        await GamificationService.awardXP(userId, mission.xpReward, `Completed mission: ${mission.title}`);
        await GamificationService.onMissionComplete(userId);

        await mission.save();
        return { mission: this._transformMission(mission), xpAwarded: mission.xpReward };
    }

    async getMissionStats(userId) {
        const missions = await Mission.find({ userId: userId });

        const total = missions.length;
        const completed = missions.filter(m => m.completed).length;
        const inProgress = total - completed;
        const totalXpEarned = missions.filter(m => m.completed).reduce((sum, m) => sum + (m.xpReward || 0), 0);

        return {
            total,
            completed,
            inProgress,
            completionRate: total > 0 ? (completed / total) * 100 : 0,
            totalXpEarned
        };
    }

    getTemplates() { return MISSION_TEMPLATES; }

    _transformMission(mission) {
        const m = mission.toObject ? mission.toObject() : mission;
        return {
            ...m,
            id: m._id.toString(), // Normalize ID for frontend
            // Mongoose uses proper casing, so we don't need snake_case conversion logic anymore
        };
    }
}

module.exports = new MissionService();
