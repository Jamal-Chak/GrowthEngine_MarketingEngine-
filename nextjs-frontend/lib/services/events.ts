
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
            const { error } = await supabase
                .from('events')
                .insert({
                    user_id: user.id,
                    event_type: type,
                    metadata
                });

            if (error) throw error;

            // Handle automatic rewards for certain events
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
