const Event = require('../models/Event');

class AnalyticsService {
    /**
     * Get analytics for a specific time period
     */
    async getAnalytics(userId, timeRange = '7d') {
        const now = new Date();
        const startDate = this.getStartDate(timeRange, now);

        const events = await Event.find({
            userId,
            createdAt: { $gte: startDate, $lte: now },
        }).lean();

        return {
            totalEvents: events.length,
            eventsByType: this.groupByType(events),
            timeline: this.createTimeline(events, startDate, now),
            topActions: this.getTopActions(events),
        };
    }

    /**
     * Get key metrics
     */
    async getKeyMetrics(userId, orgId) {
        const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        const [
            totalEvents30d,
            totalEvents7d,
            pageViews30d,
            pageViews7d,
        ] = await Promise.all([
            Event.countDocuments({ userId, createdAt: { $gte: last30Days } }),
            Event.countDocuments({ userId, createdAt: { $gte: last7Days } }),
            Event.countDocuments({ userId, type: 'PAGE_VIEW', createdAt: { $gte: last30Days } }),
            Event.countDocuments({ userId, type: 'PAGE_VIEW', createdAt: { $gte: last7Days } }),
        ]);

        return {
            totalEvents: {
                value: totalEvents30d,
                change: this.calculateChange(totalEvents7d, totalEvents30d),
            },
            pageViews: {
                value: pageViews30d,
                change: this.calculateChange(pageViews7d, pageViews30d),
            },
            engagement: {
                value: totalEvents30d > 0 ? Math.round((pageViews30d / totalEvents30d) * 100) : 0,
                change: 0, // Calculate properly with previous period
            },
        };
    }

    /**
     * Generate insights from analytics
     */
    async generateInsights(userId) {
        const analytics = await this.getAnalytics(userId, '30d');
        const insights = [];

        // Low activity insight
        if (analytics.totalEvents < 10) {
            insights.push({
                type: 'warning',
                title: 'Low Activity Detected',
                message: 'You haven\'t been very active lately. Complete more missions to boost your growth!',
                actionLabel: 'View Missions',
                actionUrl: '/missions',
            });
        }

        // Feature usage insight
        const missionEvents = analytics.eventsByType['MISSION_COMPLETE'] || 0;
        if (missionEvents > 5) {
            insights.push({
                type: 'success',
                title: 'Mission Master',
                message: `You've completed ${missionEvents} missions this month! Keep up the great work!`,
                actionLabel: 'Continue',
                actionUrl: '/missions',
            });
        }

        // Engagement insight
        const pageViews = analytics.eventsByType['PAGE_VIEW'] || 0;
        if (pageViews > 50) {
            insights.push({
                type: 'info',
                title: 'Highly Engaged',
                message: 'You\'re very engaged with the platform. Consider inviting team members!',
                actionLabel: 'Invite Team',
                actionUrl: '/settings/team',
            });
        }

        return insights;
    }

    /**
     * Helper: Get start date based on time range
     */
    getStartDate(timeRange, now) {
        const units = {
            '7d': 7,
            '30d': 30,
            '90d': 90,
            '1y': 365,
        };

        const days = units[timeRange] || 7;
        return new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    }

    /**
     * Helper: Group events by type
     */
    groupByType(events) {
        return events.reduce((acc, event) => {
            acc[event.type] = (acc[event.type] || 0) + 1;
            return acc;
        }, {});
    }

    /**
     * Helper: Create timeline data
     */
    createTimeline(events, startDate, endDate) {
        const days = Math.ceil((endDate - startDate) / (24 * 60 * 60 * 1000));
        const timeline = Array(days).fill(0).map((_, i) => {
            const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
            return {
                date: date.toISOString().split('T')[0],
                count: 0,
            };
        });

        events.forEach(event => {
            const dayIndex = Math.floor((new Date(event.createdAt) - startDate) / (24 * 60 * 60 * 1000));
            if (dayIndex >= 0 && dayIndex < timeline.length) {
                timeline[dayIndex].count++;
            }
        });

        return timeline;
    }

    /**
     * Helper: Get top actions
     */
    getTopActions(events, limit = 5) {
        const byType = this.groupByType(events);
        return Object.entries(byType)
            .sort(([, a], [, b]) => b - a)
            .slice(0, limit)
            .map(([type, count]) => ({ type, count }));
    }

    /**
     * Helper: Calculate percentage change
     */
    calculateChange(current, previous) {
        if (previous === 0) return current > 0 ? 100 : 0;
        return Math.round(((current - previous) / previous) * 100);
    }
}

module.exports = new AnalyticsService();
