import { supabase } from './supabase';

export interface GamificationStats {
    xp: number;
    level: number;
    points: number;
    streak_days: number;
}

export interface Mission {
    id: string;
    title: string;
    description: string;
    xp_reward: number;
    total_steps: number;
    category: string;
}

export interface UserMission extends Mission {
    completed_steps: number;
    is_completed: boolean;
    completed?: boolean;  // Allow both naming conventions
    estimatedTime?: string;
    estimated_time?: string;  // Allow both naming conventions
    whyMatters?: string;
    why_matters?: string;  // Allow both naming conventions
    steps?: any[];
    xpReward?: number;
}

export interface Recommendation {
    type: string;
    reason: string;
    impactScore: number;
}

// Fetch user stats
export const fetchUserStats = async (userId: string, accessToken?: string): Promise<GamificationStats | null> => {
    console.log(`[API] Fetching stats for ${userId}...`);
    try {
        const res = await fetch(`http://127.0.0.1:5000/api/gamification/stats?userId=${userId}`, {
            headers: {
                'Content-Type': 'application/json',
                ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {})
            }
        });
        console.log(`[API] Stats response: ${res.status}`);

        if (!res.ok) {
            const errorText = await res.text();
            console.error(`[API] Stats Verification Failed: ${res.status} - ${errorText}`);
            throw new Error(`API Error: ${res.status}`);
        }

        const data = await res.json();

        return {
            xp: data.xp || 0,
            level: data.level || 1,
            points: data.xp || 0,
            streak_days: data.achievements?.currentStreak || 0
        };
    } catch (e: any) {
        console.warn('[API] Backend fetch failed, using fallback mock stats:', e.message);
        return {
            xp: 150,
            level: 2,
            points: 150,
            streak_days: 1
        };
    }
};

// Fetch active missions for user
export const fetchUserMissions = async (userId: string, accessToken?: string): Promise<UserMission[]> => {
    try {
        const res = await fetch(`http://127.0.0.1:5000/api/missions?userId=${userId}`, {
            headers: {
                'Content-Type': 'application/json',
                ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {})
            }
        });
        if (!res.ok) throw new Error('API Error');
        const { missions } = await res.json();

        return missions.map((m: any) => ({
            id: m.id || m._id,
            title: m.title,
            description: m.description,
            // Handle both snake_case (Supabase) and camelCase (Mongoose/Legacy)
            xp_reward: m.xp_reward || m.xpReward,
            xpReward: m.xp_reward || m.xpReward,
            total_steps: m.steps?.length || 1,
            category: m.category,
            completed_steps: m.steps?.filter((s: any) => s.completed).length || 0,
            is_completed: m.completed,
            estimatedTime: m.estimated_time || m.estimatedTime || '10 min',
            steps: m.steps || []
        }));
    } catch (e) {
        console.warn('Backend fetch failed, using fallback mock missions');
        return [
            {
                id: 'mock-1',
                title: 'Complete Profile',
                description: 'Finish setting up your profile.',
                category: 'onboarding',
                xp_reward: 100,
                total_steps: 1,
                completed_steps: 0,
                is_completed: false
            },
            {
                id: 'mock-2',
                title: 'Invite Team',
                description: 'Invite your first team member.',
                category: 'growth',
                xp_reward: 300,
                total_steps: 1,
                completed_steps: 0,
                is_completed: false
            }
        ];
    }
};

// Update mission progress (simulated for now as logic would be complex)
// Update mission progress (simulated for now as logic would be complex)
// Update mission progress
export const updateMissionProgress = async (userId: string, missionId: string, stepIndex: number, accessToken?: string) => {
    try {
        const res = await fetch(`http://127.0.0.1:5000/api/missions/${missionId}/complete-step`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {})
            },
            body: JSON.stringify({
                userId,
                stepIndex
            })
        });

        if (!res.ok) {
            throw new Error(`Failed to update mission progress: ${res.status}`);
        }

        return await res.json();
    } catch (error) {
        console.error('Failed to update mission progress:', error);
        return { data: null, error };
    }
};

// Submit mission feedback
export const submitFeedback = async (userId: string, missionId: string, feedback: { rating: boolean; comment?: string }) => {
    try {
        const res = await fetch('http://127.0.0.1:5000/api/feedback/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId,
                missionId,
                ...feedback
            })
        });

        if (!res.ok) {
            throw new Error(`Feedback submission failed: ${res.status}`);
        }

        return await res.json();
    } catch (error) {
        console.error('Failed to submit feedback:', error);
        return { success: false, error };
    }
};
