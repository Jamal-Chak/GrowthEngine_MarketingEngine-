const Event = require('../models/Event');

class EventService {
    async track(userId, eventName, properties = {}) {
        try {
            await Event.create({
                userId,
                eventType: eventName,
                eventData: properties
            });

            return true;
        } catch (err) {
            console.error('Event Service Error:', err.message);
            // Ensure we never throw from here to prevent 500s in main flow
            return false;
        }
    }
}

module.exports = new EventService();
