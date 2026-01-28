const supabase = require('../config/supabase');

class EventService {
    async track(userId, eventName, properties = {}) {
        try {
            const { error } = await supabase
                .from('events')
                .insert({
                    user_id: userId,
                    event_type: eventName,
                    event_data: properties,
                    created_at: new Date().toISOString()
                });

            if (error) {
                console.error('Event tracking failed:', error);
                // Don't throw, analytics failures shouldn't break app flow
                return false;
            }

            return true;
        } catch (err) {
            console.error('Event Service Error:', err);
            return false;
        }
    }
}

module.exports = new EventService();
