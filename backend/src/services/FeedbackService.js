const MissionFeedback = require('../models/MissionFeedback');

class FeedbackService {
    async submitFeedback(userId, missionId, feedbackData) {
        try {
            const feedback = await MissionFeedback.create({
                userId,
                missionId,
                rating: feedbackData.rating, // boolean: true = helpful, false = not helpful
                comment: feedbackData.comment || null
            });

            return { success: true, feedback };
        } catch (error) {
            console.error('Feedback submission error:', error);
            return { success: false, error: error.message };
        }
    }

    async getFeedbackByMission(missionId) {
        try {
            const feedback = await MissionFeedback.find({ missionId: missionId }).sort({ createdAt: -1 });
            return feedback;
        } catch (error) {
            console.error('Get feedback error:', error);
            return [];
        }
    }

    async getMissionStats(missionId) {
        try {
            const feedback = await MissionFeedback.find({ missionId: missionId });

            const total = feedback.length;
            const helpful = feedback.filter(f => f.rating === true).length;
            const notHelpful = total - helpful;

            return {
                total,
                helpful,
                notHelpful,
                helpfulPercentage: total > 0 ? (helpful / total) * 100 : 0
            };
        } catch (error) {
            console.error('Get mission stats error:', error);
            return { total: 0, helpful: 0, notHelpful: 0, helpfulPercentage: 0 };
        }
    }
}

module.exports = new FeedbackService();
