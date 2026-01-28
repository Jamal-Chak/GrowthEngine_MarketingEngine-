const EventService = require('../services/EventService');

exports.trackEvent = async (req, res) => {
    try {
        const { eventName, properties, userId } = req.body;
        // userId might come from auth middleware in real app, but for now body

        if (!userId || !eventName) {
            return res.status(400).json({ success: false, error: 'Missing userId or eventName' });
        }

        await EventService.track(userId, eventName, properties);

        res.json({ success: true });
    } catch (error) {
        console.error('Track Controller Error:', error);
        res.status(500).json({ success: false });
    }
};
