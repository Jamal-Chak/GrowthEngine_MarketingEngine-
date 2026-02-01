'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { CheckCircle, ArrowLeft, Clock, Zap, Target } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Card } from '@/components/ui/Card';
import { fetchUserMissions, submitFeedback } from '@/lib/api';
import { FeedbackModal } from '@/components/FeedbackModal';

interface MissionStep {
    description: string;
    xpReward: number;
    completed: boolean;
    completedAt?: string;
}

interface Mission {
    id: string;
    title: string;
    description: string;
    whyMatters?: string;
    xpReward: number;
    estimatedTime: string;
    steps: MissionStep[];
    completed: boolean;
}

export default function MissionPage() {
    const router = useRouter();
    const params = useParams();
    const { data: session, status } = useSession();
    const [mission, setMission] = useState<Mission | null>(null);
    const [loading, setLoading] = useState(true);
    const [completingStep, setCompletingStep] = useState<number | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);

    useEffect(() => {
        const loadMission = async () => {
            if (!params.id || status === 'loading') return;

            if (!session?.user) {
                router.push('/login');
                return;
            }

            try {
                // Pass accessToken to the API call
                const missions = await fetchUserMissions(session.user.id, session.accessToken);
                const found = missions.find((m: any) => m.id === params.id);

                if (found) {
                    setMission({
                        ...found,
                        xpReward: found.xp_reward || found.xpReward,
                        estimatedTime: found.estimatedTime || found.estimated_time || '10 min',
                        whyMatters: found.whyMatters || found.why_matters,
                        steps: found.steps || [],
                        completed: found.is_completed || found.completed || false
                    } as Mission);
                } else {
                    console.error('Mission not found in user list');
                }
            } catch (error) {
                console.error('Failed to load mission', error);
            } finally {
                setLoading(false);
            }
        };

        loadMission();
    }, [params.id, router, session, status]);

    const handleStepComplete = async (index: number) => {
        if (!mission) return;
        setCompletingStep(index);

        try {
            const newSteps = [...mission.steps];
            newSteps[index].completed = true;

            setMission({ ...mission, steps: newSteps });

            const allDone = newSteps.every(s => s.completed);
            if (allDone) {
                setTimeout(() => triggerCompletion(), 300);
            }

        } catch (error) {
            console.error('Step completion failed', error);
        } finally {
            setCompletingStep(null);
        }
    };

    const triggerCompletion = () => {
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 }
        });

        // Show feedback modal after celebration
        setTimeout(() => {
            setShowFeedback(true);
        }, 1500);
    };

    const handleFeedbackSubmit = async (feedback: { rating: boolean; comment?: string }) => {
        try {
            if (session?.user && mission) {
                await submitFeedback(session.user.id, mission.id, feedback);
            }
        } catch (error) {
            console.error('Failed to submit feedback:', error);
        }

        // Redirect to dashboard after feedback
        router.push('/dashboard');
    };

    if (loading) return (
        <div className="min-h-screen p-8 flex items-center justify-center">
            <div className="animate-pulse text-white/50">Loading Mission...</div>
        </div>
    );

    if (!mission) return (
        <div className="min-h-screen p-8 flex items-center justify-center flex-col gap-4">
            <div className="text-xl">Mission not found</div>
            <button onClick={() => router.push('/dashboard')} className="btn-secondary">
                Return to Dashboard
            </button>
        </div>
    );

    const completedSteps = mission.steps.filter(s => s.completed).length;
    const totalSteps = mission.steps.length;
    const progress = (completedSteps / totalSteps) * 100;
    const allStepsCompleted = completedSteps === totalSteps;

    return (
        <div className="min-h-screen p-8 max-w-4xl mx-auto">
            <button
                onClick={() => router.push('/dashboard')}
                className="flex items-center gap-2 text-white/50 hover:text-white mb-8 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </button>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                {/* Header */}
                <div className="flex items-start justify-between mb-8">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="px-3 py-1 rounded-full bg-primary-500/20 text-primary-300 text-sm font-bold uppercase tracking-wider">
                                Mission
                            </span>
                            <div className="flex items-center gap-1 text-white/50 text-sm">
                                <Clock className="w-4 h-4" />
                                {mission.estimatedTime}
                            </div>
                        </div>
                        <h1 className="text-4xl font-bold mb-4">{mission.title}</h1>
                        <p className="text-xl text-white/70 mb-6">{mission.description}</p>

                        {/* Why This Matters Section */}
                        {mission.whyMatters && (
                            <Card className="bg-gradient-to-br from-accent-500/10 to-primary-500/10 border-accent-500/30 mb-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-accent-500/20 flex items-center justify-center flex-shrink-0">
                                        <Target className="w-6 h-6 text-accent-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-accent-300 uppercase tracking-wider mb-2">Why This Matters</h3>
                                        <p className="text-lg text-white/90 leading-relaxed">{mission.whyMatters}</p>
                                    </div>
                                </div>
                            </Card>
                        )}
                    </div>

                    {/* XP Reward Badge */}
                    <div className="ml-6 flex-shrink-0">
                        <Card className="bg-gradient-to-br from-yellow-500/10 to-primary-500/10 border-yellow-500/30 text-center">
                            <div className="flex flex-col items-center gap-2 px-6 py-4">
                                <Zap className="w-8 h-8 text-yellow-400" />
                                <div className="text-3xl font-bold text-yellow-300">{mission.xpReward}</div>
                                <div className="text-sm text-white/50">Total XP</div>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-white/50">Progress</span>
                        <span className="text-sm font-bold text-primary-300">
                            {completedSteps} / {totalSteps} Steps
                        </span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-primary-500 to-accent-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                </div>

                {/* Steps Checklist */}
                <div className="grid gap-4 mb-8">
                    {mission.steps.map((step, index) => (
                        <Card
                            key={index}
                            className={`p-5 transition-all duration-300 ${step.completed
                                ? 'bg-green-500/10 border-green-500/30 opacity-75'
                                : 'hover:border-primary-500/50 hover:bg-white/5 cursor-pointer'
                                }`}
                            onClick={() => !step.completed && handleStepComplete(index)}
                        >
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        !step.completed && handleStepComplete(index);
                                    }}
                                    disabled={step.completed || completingStep !== null}
                                    className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${step.completed
                                        ? 'bg-green-500 border-green-500'
                                        : 'border-white/30 hover:border-primary-500 hover:bg-primary-500/10'
                                        }`}
                                >
                                    {step.completed && <CheckCircle className="w-4 h-4 text-white" />}
                                </button>
                                <div className="flex-1">
                                    <div className={`text-base font-medium ${step.completed ? 'text-white/50 line-through' : 'text-white'}`}>
                                        {step.description}
                                    </div>
                                </div>
                                <div className="text-sm text-yellow-400/80 font-medium flex items-center gap-1 flex-shrink-0">
                                    <Zap className="w-3 h-3" />
                                    +{step.xpReward}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Complete Mission Button */}
                {allStepsCompleted && !mission.completed && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-8"
                    >
                        <button
                            onClick={triggerCompletion}
                            className="btn-primary px-12 py-5 text-xl font-bold shadow-2xl shadow-primary-500/30 hover:scale-105 transition-transform"
                        >
                            🎉 Complete Mission & Claim {mission.xpReward} XP
                        </button>
                    </motion.div>
                )}
            </motion.div>

            {/* Feedback Modal */}
            {showFeedback && mission && (
                <FeedbackModal
                    missionId={mission.id}
                    missionTitle={mission.title}
                    onClose={() => router.push('/dashboard')}
                    onSubmit={handleFeedbackSubmit}
                />
            )}
        </div>
    );
}
