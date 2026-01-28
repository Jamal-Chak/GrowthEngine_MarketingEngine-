
import { supabase } from '@/lib/supabase';

export type EventType =
    | 'page_view'
    | 'button_click'
    | 'mission_start'
    | 'mission_complete'
    | 'auth_login'
    | 'ai_generate_strategy';

export const EventService = {
    /**
     * Track a user event in Supabase
     */
    async trackEvent(type: EventType, metadata: any = {}) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        try {
            // Queue this if offline, but for now fire and forget
            fetch('http://localhost:5000/api/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    eventName: type,
                    properties: metadata
                })
            }).catch(e => console.error('Analytics delivery failed', e));

            // Legacy/Duplicate Supabase for fallback? No, let's rely on backend.

            // Handle automatic rewards via backend or let backend trigger it?
            // For now, keep client-side reward trigger for immediate feedback, 
            // BUT ideally backend should handle this asynchronously.
            if (type === 'auth_login') {
                await this.rewardXP(user.id, 50, 'Daily Login Reward');
            }
        } catch (err) {
            console.error('Failed to track event:', err);
        }
    },

    /**
     * Award XP to a user via the award_xp RPC function
     */
    async rewardXP(userId: string, amount: number, reason: string) {
        try {
            const { error } = await supabase.rpc('award_xp', {
                target_user_id: userId,
                xp_amount: amount,
                reward_reason: reason
            });

            if (error) throw error;
        } catch (err) {
            console.error('Failed to award XP:', err);
        }
    }
};
