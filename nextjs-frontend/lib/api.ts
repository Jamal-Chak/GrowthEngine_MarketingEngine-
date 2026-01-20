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
}

export interface Recommendation {
    type: string;
    reason: string;
    impactScore: number;
}

// Fetch user stats
export const fetchUserStats = async (userId: string): Promise<GamificationStats | null> => {
    const { data, error } = await supabase
        .from('gamification_stats')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) {
        console.error('Error fetching stats:', error);
        return null;
    }
    return data;
};

// Fetch active missions for user
export const fetchUserMissions = async (userId: string): Promise<UserMission[]> => {
    // 1. Get all available missions
    const { data: allMissions, error: missionsError } = await supabase
        .from('missions')
        .select('*');

    if (missionsError) {
        console.error('Error fetching missions:', missionsError);
        return [];
    }

    // 2. Get user progress
    const { data: userProgress, error: progressError } = await supabase
        .from('user_missions')
        .select('*')
        .eq('user_id', userId);

    if (progressError) {
        console.error('Error fetching mission progress:', progressError);
        return [];
    }

    // 3. Merge data
    return allMissions.map((mission) => {
        const progress = userProgress?.find(p => p.mission_id === mission.id);
        return {
            ...mission,
            completed_steps: progress?.completed_steps || 0,
            is_completed: progress?.is_completed || false,
        };
    });
};

// Update mission progress (simulated for now as logic would be complex)
export const updateMissionProgress = async (userId: string, missionId: string, steps: number) => {
    const { data, error } = await supabase
        .from('user_missions')
        .upsert({
            user_id: userId,
            mission_id: missionId,
            completed_steps: steps,
            updated_at: new Date().toISOString()
        })
        .select();

    return { data, error };
};
