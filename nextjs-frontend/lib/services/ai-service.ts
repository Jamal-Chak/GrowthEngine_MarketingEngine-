
// import { supabase } from '@/lib/supabase'; // Removed
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
    async generateStrategy(userId: string, token?: string): Promise<Recommendation[]> {
        const payload = { userId };
        console.log('[AI Service] Sending payload:', payload);

        try {
            const response = await fetch('http://127.0.0.1:5000/api/recommendations/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('[AI Service] Backend Error:', errorData);
                throw new Error(errorData.error || `Strategy generation failed: ${response.status}`);
            }

            const result = await response.json();
            return result || [];
        } catch (error) {
            console.error('[AI Service] Network/API Error:', error);
            throw error;
        }
    },

    /**
     * Fetch existing recommendations
     */
    async getRecommendations(userId: string, token?: string): Promise<Recommendation[]> {
        const response = await fetch(`http://127.0.0.1:5000/api/recommendations?userId=${userId}`, {
            headers: {
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            }
        });

        if (!response.ok) {
            console.error('Failed to fetch recommendations');
            return [];
        }

        return await response.json();
    }
};
