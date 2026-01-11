const Event = require('../models/Event');

class EventService {
    async logEvent(userId, orgId, type, metadata = {}) {
        const event = await Event.create({
            userId,
            orgId,
            type,
            metadata,
        });
        return event;
    }

    async getEvents(orgId, limit = 100) {
        return await Event.find({ orgId }).sort({ timestamp: -1 }).limit(limit);
    }
}

module.exports = new EventService();
