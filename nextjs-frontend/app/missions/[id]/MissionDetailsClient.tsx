'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowLeft, Award, Clock } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import confetti from 'canvas-confetti';
import { DesignSystem } from '@/lib/design-system';

export function MissionDetailsClient({ missionId }: { missionId: string }) {
    const router = useRouter();
    const [mission, setMission] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState<number[]>([]);
    const [isCompleting, setIsCompleting] = useState(false);

    useEffect(() => {
        const fetchMission = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Fetch user mission and the mission template details
            const { data, error } = await supabase
                .from('user_missions')
                .select(`
                    *,
                    missions:mission_id (*)
                `)
                .eq('mission_id', missionId)
                .eq('user_id', user.id)
                .single();

            if (data) {
                setMission({
                    ...data.missions,
                    status: data.status,
                    user_mission_id: data.id
                });
                // Initialize progress based on completed_steps (mocking individual step tracking for now as 'completed_steps' is just an int)
                // If we want detailed tracking, we should have a `steps_progress` jsonb in user_missions. 
                // For now, let's assume if completed_steps = 1, then step index 0 is done.
                const initialProgress = Array(data.completed_steps).fill(0).map((_, i) => i);
                setProgress(initialProgress);
            }
            setLoading(false);
        };

        fetchMission();
    }, [missionId]);

    const handleStepClick = async (index: number) => {
        if (progress.includes(index)) {
            // Optional: Allow unchecking? For now, append only.
            return;
        }

        const newProgress = [...progress, index];
        setProgress(newProgress);

        // Update Backend
        // In a real app we'd call an API to update step status.
        // For 'Foundation Hardening' we just simulate local state until final completion.
    };

    const handleCompleteMission = async () => {
        setIsCompleting(true);
        try {
            // Call API to complete
            // await fetch('/api/missions/complete', ...)
            // For now update via Supabase directly or assume success

            const { error } = await supabase
                .from('user_missions')
                .update({
                    status: 'completed',
                    completed_steps: mission.steps?.length || 3
                })
                .eq('id', mission.user_mission_id);

            if (error) throw error;

            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: [DesignSystem.colors.primary[500], DesignSystem.colors.accent[500], DesignSystem.colors.success[500]]
            });

            setTimeout(() => {
                router.push('/dashboard');
            }, 2000);

        } catch (error) {
            console.error('Completion error:', error);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading mission...</div>;
    if (!mission) return <div className="p-8 text-center">Mission not found.</div>;

    const allStepsDone = mission.steps?.length ? progress.length === mission.steps.length : false;

    return (
        <div className="min-h-screen p-8 max-w-4xl mx-auto">
            <Button
                variant="ghost"
                onClick={() => router.back()}
                className="mb-6 pl-0 hover:bg-transparent"
                icon={<ArrowLeft className="w-4 h-4" />}
            >
                Back to Dashboard
            </Button>

            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-4xl font-bold mb-4">{mission.title}</h1>
                        <p className="text-xl text-white/70 mb-8">{mission.description}</p>

                        <Card className="p-0 overflow-hidden">
                            <div className="p-6 border-b border-white/10 bg-white/5">
                                <h3 className="font-bold text-lg">Mission Checklist</h3>
                                <p className="text-sm text-white/50">Complete all steps to claim reward</p>
                            </div>
                            <div className="divide-y divide-white/10">
                                {mission.steps?.map((step: any, index: number) => (
                                    <div
                                        key={index}
                                        onClick={() => handleStepClick(index)}
                                        className={`p-6 flex items-start gap-4 cursor-pointer transition-colors ${progress.includes(index) ? 'bg-primary-500/5' : 'hover:bg-white/5'}`}
                                    >
                                        <div className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${progress.includes(index)
                                            ? 'bg-primary-500 border-primary-500 text-white'
                                            : 'border-white/30 text-transparent'
                                            }`}>
                                            <CheckCircle className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h4 className={`font-medium ${progress.includes(index) ? 'text-white' : 'text-white/80'}`}>
                                                {step.title}
                                            </h4>
                                            <p className="text-sm text-white/50 mt-1">{step.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </motion.div>
                </div>

                <div className="space-y-6">
                    <Card className="sticky top-8">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Award className="w-8 h-8 text-yellow-400" />
                            </div>
                            <div className="text-3xl font-bold text-white mb-1">{mission.xp_reward} XP</div>
                            <div className="text-sm text-white/50">Completion Reward</div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-white/60">Estimated Time</span>
                                <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" /> 15 mins
                                </span>
                            </div>
                            <div className="h-px bg-white/10" />
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-white/60">Difficulty</span>
                                <span className="capitalize px-2 py-0.5 rounded-full bg-white/10 text-xs">
                                    {mission.difficulty}
                                </span>
                            </div>
                        </div>

                        <Button
                            className="w-full mt-8"
                            disabled={!allStepsDone || isCompleting || mission.status === 'completed'}
                            onClick={handleCompleteMission}
                        >
                            {mission.status === 'completed' ? 'Completed' : isCompleting ? 'Claiming...' : 'Complete Mission'}
                        </Button>
                    </Card>
                </div>
            </div>
        </div>
    );
}
