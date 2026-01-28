
import { supabase } from '@/lib/supabase';
import { EventService } from './events';

export interface Recommendation {
    id?: string;
    type: string;
    reason: string;
    impact_score: number;
    status: 'pending' | 'applied' | 'dismissed';
}

export const AIService = {
    /**
     * Generates a new marketing strategy/recommendation for the user.
     */
    async generateStrategy(): Promise<Recommendation[]> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const response = await fetch('http://localhost:5000/api/recommendations/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: user.id }),
        });

        if (!response.ok) {
            throw new Error('Failed to generate strategy');
        }

        const result = await response.json();
        return result || [];
    },

    /**
     * Fetch existing recommendations
     */
    async getRecommendations(): Promise<Recommendation[]> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        const response = await fetch(`http://localhost:5000/api/recommendations?userId=${user.id}`);

        if (!response.ok) {
            console.error('Failed to fetch recommendations');
            return [];
        }

        return await response.json();
    }
};
