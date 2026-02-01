'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line
} from 'recharts';
import {
    Zap,
    Target,
    Clock,
    CheckCircle,
    ArrowRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';
// import { supabase } from '@/lib/supabase'; // Removed
import { fetchUserStats, fetchUserMissions, GamificationStats, UserMission } from '@/lib/api';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { StatCard } from '@/components/dashboard/StatCard';
import { Card } from '@/components/ui/Card';
import { EventService } from '@/lib/services/events';
import { AIService, Recommendation } from '@/lib/services/ai-service';
import {
    MOCK_STATS,
    MOCK_CHART_DATA,
    MOCK_RECOMMENDATIONS
} from '@/lib/constants';
import { triggerSuccessConfetti } from '@/lib/utils/confetti';

import { useSession } from 'next-auth/react';

export default function Dashboard() {
    const router = useRouter();
    const { data: session, status } = useSession();

    // Using session data for user display
    const user = session?.user;

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [stats, setStats] = useState<GamificationStats | null>(null);
    const [missions, setMissions] = useState<UserMission[]>([]);
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
    const [loading, setLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (status === 'loading') return;

        if (!session?.user) {
            router.push('/login');
            return;
        }

        const initDashboard = async () => {
            try {
                // Fetch real data using MongoDB ID from session
                const [userStats, userMissions, userRecs] = await Promise.all([
                    fetchUserStats(session.user.id, session.accessToken),
                    fetchUserMissions(session.user.id, session.accessToken),
                    AIService.getRecommendations(session.user.id, session.accessToken)
                ]);

                setStats(userStats);

                if (userMissions && userMissions.length > 0) {
                    setMissions(userMissions);
                } else {
                    // Activation Rule: If no missions, force onboarding
                    console.log('No missions found. Redirecting to onboarding.');
                    router.push('/onboarding');
                    return;
                }

                setRecommendations(userRecs || []);
                EventService.trackEvent('page_view', { path: '/dashboard' });

            } catch (e) {
                console.error('Dashboard init failed:', e);
            } finally {
                setLoading(false);
            }
        };

        initDashboard();
    }, [router, session, status]);

    const handleGenerateStrategy = async () => {
        if (!session?.user) return;

        setIsGenerating(true);
        try {
            const newRecs = await AIService.generateStrategy(session.user.id, session.accessToken);
            setRecommendations(prev => [...newRecs, ...prev]);

            // Refresh missions to show the newly created AI mission
            const updatedMissions = await fetchUserMissions(session.user.id, session.accessToken);
            setMissions(updatedMissions);

            triggerSuccessConfetti();
        } catch (error: any) {
            console.error("Failed to generate strategy:", error);

            // Check for subscription limit error
            if (error.message.includes("limit")) {
                alert("🚀 You've reached your free limit! Upgrade to Pro for unlimited AI strategies.");
                // TODO: Open Upgrade Modal
            } else {
                setError("Failed to generate strategy. Please try again.");
            }
        } finally {
            setIsGenerating(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen p-8 max-w-7xl mx-auto space-y-8">
            <div className="h-20 w-1/3 bg-white/5 rounded-xl animate-pulse" />
            <div className="h-64 w-full bg-white/5 rounded-2xl animate-pulse" />
            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 h-64 bg-white/5 rounded-2xl animate-pulse" />
                <div className="space-y-6">
                    <div className="h-24 bg-white/5 rounded-xl animate-pulse" />
                    <div className="h-24 bg-white/5 rounded-xl animate-pulse" />
                </div>
            </div>
        </div>
    );

    // Merge API stats into display format
    const displayStats = MOCK_STATS.map(s => {
        if (s.label === 'Total XP' && stats) return { ...s, value: stats.xp };
        if (s.label === 'Level' && stats) return { ...s, value: stats.level };
        if (s.label === 'Active Missions' && missions) return { ...s, value: missions.filter(m => !m.is_completed).length };
        return s;
    });

    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-auto">
                {/* Header */}
                <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">
                            Welcome back, <span className="text-gradient">{user?.name}</span>
                        </h1>
                        <p className="text-white/60">Here&apos;s what&apos;s happening with your growth today</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        {error && <span className="text-red-400 text-sm">{error}</span>}
                        <button
                            onClick={handleGenerateStrategy}
                            disabled={isGenerating}
                            className="btn-primary flex items-center gap-2 whitespace-nowrap shadow-lg shadow-primary-500/20"
                        >
                            <Zap className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                            {isGenerating ? 'Generating...' : 'New AI Strategy'}
                        </button>
                    </div>
                </div>

                {/* Primary Focus Section */}
                <div className="mb-8">
                    <Card className="bg-gradient-to-br from-primary-500/10 to-accent-500/10 border-primary-500/20">
                        {missions.length > 0 ? (
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                                <div className="space-y-4 max-w-2xl">
                                    <div className="flex items-center gap-2">
                                        <span className="px-3 py-1 rounded-full bg-primary-500/20 text-primary-300 text-xs font-bold uppercase tracking-wider">
                                            High Priority
                                        </span>
                                        <h2 className="text-sm font-medium text-white/50">Your Next Best Action</h2>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-white/50 mb-4">
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            {missions[0]?.estimatedTime || '10 min'}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <CheckCircle className="w-4 h-4" />
                                            {missions[0]?.completed_steps || 0}/{missions[0]?.total_steps || 1} Steps
                                        </div>
                                        <div className="flex items-center gap-1 text-primary-300">
                                            <Zap className="w-4 h-4" />
                                            {missions[0]?.xp_reward || 100} XP
                                        </div>
                                    </div>
                                    <h3 className="text-3xl font-bold text-white leading-tight mb-2">
                                        {missions[0]?.title || "Start Your First Mission"}
                                    </h3>
                                    <p className="text-lg text-white/70">
                                        {missions[0]?.description || "Complete this mission to unlock 100 XP and improve your growth metrics."}
                                    </p>
                                </div>
                                <div className="flex-shrink-0">
                                    <button
                                        className="btn-primary text-lg px-8 py-4 shadow-xl shadow-primary-500/20 hover:scale-105 transition-transform"
                                        onClick={() => router.push(`/missions/${missions[0]?.id || 'onboarding'}`)}
                                    >
                                        Start Mission
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="text-center md:text-left">
                                    <h3 className="text-2xl font-bold mb-2">You're on a roll!</h3>
                                    <p className="text-white/60">Complete your active missions or generate a new AI strategy.</p>
                                </div>
                                <button
                                    onClick={handleGenerateStrategy}
                                    disabled={isGenerating}
                                    className="btn-primary whitespace-nowrap"
                                >
                                    {isGenerating ? 'Generating...' : '✨ New AI Strategy'}
                                </button>
                            </div>
                        )}
                    </Card>
                </div>

                {/* Secondary Metrics & Active Missions */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Activity Chart (Context) */}
                    {/* Secondary Missions (Up Next) */}
                    <div className="lg:col-span-2 space-y-6">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            <Target className="w-5 h-5 text-primary-400" />
                            Up Next
                        </h3>
                        {missions.slice(1, 4).map((mission, i) => (
                            <Card key={i} className="hover:border-primary-500/30 transition-colors group cursor-pointer" onClick={() => router.push(`/missions/${mission.id}`)}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/30 group-hover:bg-primary-500/10 group-hover:text-primary-400 transition-colors">
                                            {i + 2}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg group-hover:text-primary-300 transition-colors">{mission.title}</h4>
                                            <p className="text-white/50 text-sm line-clamp-1">{mission.description}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-sm text-white/40 flex items-center gap-1">
                                            <Zap className="w-3 h-3 text-yellow-500/50" />
                                            {mission.xp_reward} XP
                                        </div>
                                        <ArrowRight className="w-5 h-5 text-white/20 group-hover:text-white group-hover:translate-x-1 transition-all" />
                                    </div>
                                </div>
                            </Card>
                        ))}
                        {missions.length < 2 && (
                            <Card className="border-dashed border-white/10 bg-transparent flex items-center justify-center py-8">
                                <p className="text-white/30 text-sm">Complete your current mission to unlock more.</p>
                            </Card>
                        )}
                    </div>

                    {/* Quick Stats (Context) */}
                    <div className="space-y-6">
                        <StatCard
                            label="Total XP"
                            value={stats?.xp || 0}
                            icon={<Zap className="w-5 h-5 text-yellow-400" />}
                            trend="+15%"
                        />
                        <Card>
                            <h3 className="text-sm font-medium text-white/50 mb-4">Current Level</h3>
                            <div className="flex items-end gap-2 mb-2">
                                <span className="text-3xl font-bold">{stats?.level || 1}</span>
                                <span className="text-sm text-white/40 mb-1">Beginner</span>
                            </div>
                            <div className="w-full bg-white/10 rounded-full h-1.5">
                                <div className="bg-primary-500 h-1.5 rounded-full" style={{ width: '45%' }} />
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Hidden / Deprioritized Recommendations */}
                {
                    recommendations.length > 0 && (
                        <div className="mt-8 opacity-50 hover:opacity-100 transition-opacity">
                            <h4 className="text-sm font-medium text-white/30 uppercase tracking-widest mb-4">Pending Insights</h4>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {recommendations.slice(0, 3).map((rec, i) => (
                                    <div key={i} className="p-4 rounded-xl border border-white/5 bg-white/5">
                                        <div className="text-sm font-medium mb-1">{rec.type}</div>
                                        <div className="text-xs text-white/50">{rec.reason}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                }
            </main >
        </div >
    );
}
