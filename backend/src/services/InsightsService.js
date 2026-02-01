const Mission = require('../models/Mission');
const Insight = require('../models/Insight');

class InsightsService {
    /**
     * Analyze user metrics and detect signals for mission generation
     */
    async analyzeUserMetrics(userId, orgId) {
        try {
            const insights = [];

            // Get user's mission history
            const missions = await Mission.find({ userId: userId }).sort({ createdAt: -1 });

            const completedMissions = missions?.filter(m => m.completed) || [];
            const incompleteMissions = missions?.filter(m => !m.completed) || [];

            // Signal 1: Stagnation Detection
            if (missions && missions.length > 0) {
                const lastMission = missions[0];
                const daysSinceLastMission = this.daysSince(lastMission.createdAt);

                if (daysSinceLastMission >= 7) {
                    insights.push({
                        type: 'stagnation',
                        severity: 'high',
                        title: 'You\'ve been inactive for a week',
                        description: 'Time to get back on track! Start with a quick win.',
                        suggestedMission: 'quickWin',
                        reason: 'No activity detected in 7+ days'
                    });
                }
            }

            // Signal 2: Low Completion Rate
            if (missions && missions.length >= 3) {
                const completionRate = (completedMissions.length / missions.length) * 100;

                if (completionRate < 30) {
                    insights.push({
                        type: 'drop',
                        severity: 'medium',
                        title: 'Missions seem too hard',
                        description: 'Your completion rate is low. Try focusing on foundation missions first.',
                        suggestedMission: 'analytics',
                        reason: `Completion rate: ${completionRate.toFixed(0)}%`
                    });
                }
            }

            // Signal 3: High Momentum (Spike)
            const recentCompleted = completedMissions.filter(m =>
                this.daysSince(m.completedAt) <= 7
            );

            if (recentCompleted.length >= 3) {
                insights.push({
                    type: 'spike',
                    severity: 'low',
                    title: 'You\'re on fire! 🔥',
                    description: 'You completed 3+ missions this week. Keep the momentum with a growth mission.',
                    suggestedMission: 'revenue_growth_1',
                    reason: `${recentCompleted.length} missions completed this week`
                });
            }

            // Signal 4: Category Focus
            if (completedMissions.length >= 2) {
                const categories = completedMissions.map(m => m.category);
                const categoryCount = {};
                categories.forEach(c => categoryCount[c] = (categoryCount[c] || 0) + 1);

                const mostFrequent = Object.entries(categoryCount)
                    .sort((a, b) => b[1] - a[1])[0];

                if (mostFrequent && mostFrequent[1] >= 2) {
                    const categoryMissions = {
                        revenue: 'revenue_growth_1',
                        traffic: 'traffic_growth_1',
                        conversion: 'conversion_opt_1',
                        retention: 'retention'
                    };

                    insights.push({
                        type: 'pattern',
                        severity: 'low',
                        title: `You're focused on ${mostFrequent[0]}`,
                        description: `Continue your ${mostFrequent[0]} focus with an advanced mission.`,
                        suggestedMission: categoryMissions[mostFrequent[0]] || 'quickWin',
                        reason: `${mostFrequent[1]} ${mostFrequent[0]} missions completed`
                    });
                }
            }

            // Save insights to DB (Optional, but good for history)
            // for (const insight of insights) {
            //     await Insight.create({ userId, ...insight });
            // }

            return insights;
        } catch (error) {
            console.error('Error analyzing metrics:', error);
            return [];
        }
    }

    /**
     * Generate mission recommendations based on insights
     */
    async generateMissionRecommendations(userId, orgId) {
        const insights = await this.analyzeUserMetrics(userId, orgId);
        const MissionService = require('./MissionService');
        const templates = MissionService.getTemplates();

        return insights.map(insight => ({
            insight,
            mission: templates[insight.suggestedMission],
            templateKey: insight.suggestedMission,
            confidence: this.calculateConfidence(insight)
        })).filter(r => r.mission);
    }

    /**
     * Calculate confidence score for recommendation
     */
    calculateConfidence(insight) {
        const severityScores = {
            high: 90,
            medium: 70,
            low: 50
        };
        return severityScores[insight.severity] || 50;
    }

    /**
     * Helper: Calculate days since a date
     */
    daysSince(dateString) {
        if (!dateString) return 999;
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;
        return Math.floor(diff / (1000 * 60 * 60 * 24));
    }

    /**
     * Get user metrics summary
     */
    async getMetricsSummary(userId) {
        try {
            const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

            const missions = await Mission.find({ userId: userId });
            const recentMissions = missions.filter(m => new Date(m.createdAt) >= weekAgo);

            const completed = missions.filter(m => m.completed).length;
            const total = missions.length;
            const thisWeek = recentMissions.filter(m => m.completed).length;

            return {
                totalMissions: total,
                completedMissions: completed,
                completionRate: total > 0 ? (completed / total) * 100 : 0,
                missionsThisWeek: thisWeek,
                lastActivity: missions[0]?.createdAt || null
            };
        } catch (error) {
            console.error('Error getting metrics summary:', error);
            return {
                totalMissions: 0,
                completedMissions: 0,
                completionRate: 0,
                missionsThisWeek: 0,
                lastActivity: null
            };
        }
    }
}

module.exports = new InsightsService();
