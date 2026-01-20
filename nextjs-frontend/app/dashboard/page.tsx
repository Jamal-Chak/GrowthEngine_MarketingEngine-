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
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
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

export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [stats, setStats] = useState<GamificationStats | null>(null);
    const [missions, setMissions] = useState<UserMission[]>([]);
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
    const [loading, setLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        const initDashboard = async () => {
            // Check if we have a valid Supabase setup
            const hasSupabase = process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project-url');

            if (!hasSupabase) {
                console.warn('Supabase not configured correctly. Redirecting to login or showing error.');
                // In a real scenario we might redirect, but for now let's allow it to fail gracefully or show a message
            }

            try {
                const { data: { user } } = await supabase.auth.getUser();

                if (!user) {
                    router.push('/');
                    return;
                }

                setUser({
                    name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
                    email: user.email
                });

                // Fetch real data
                if (hasSupabase) {
                    const [userStats, userMissions, userRecs] = await Promise.all([
                        fetchUserStats(user.id),
                        fetchUserMissions(user.id),
                        AIService.getRecommendations()
                    ]);
                    setStats(userStats);
                    setMissions(userMissions || []);
                    setRecommendations(userRecs || []);

                    // Track page view
                    EventService.trackEvent('page_view', { path: '/dashboard' });
                } else {
                    setRecommendations(MOCK_RECOMMENDATIONS as any);
                }

            } catch (e) {
                console.error('Auth check failed:', e);
                router.push('/');
            } finally {
                setLoading(false);
            }
        };

        initDashboard();
    }, [router]);

    const handleGenerateStrategy = async () => {
        setIsGenerating(true);
        try {
            const newRecs = await AIService.generateStrategy();
            setRecommendations(prev => [...newRecs, ...prev]);
            triggerSuccessConfetti();
        } catch (err) {
            console.error('Failed to generate strategy:', err);
        } finally {
            setIsGenerating(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <motion.div
                className="w-16 h-16 border-4 border-primary-500/30 border-t-primary-500 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
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
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">
                        Welcome back, <span className="text-gradient">{user?.name}</span>
                    </h1>
                    <p className="text-white/60">Here&apos;s what&apos;s happening with your growth today</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {displayStats.map((stat, i) => (
                        <StatCard key={i} {...stat} delay={i * 0.1} />
                    ))}
                </div>

                {/* Charts */}
                <div className="grid lg:grid-cols-2 gap-6 mb-8">
                    <Card delay={0.2}>
                        <h3 className="text-xl font-bold mb-6">Activity Overview</h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <AreaChart data={MOCK_CHART_DATA}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                                <YAxis stroke="rgba(255,255,255,0.5)" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '12px',
                                    }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorValue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </Card>

                    <Card delay={0.3}>
                        <h3 className="text-xl font-bold mb-6">XP Progress</h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={MOCK_CHART_DATA}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                                <YAxis stroke="rgba(255,255,255,0.5)" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '12px',
                                    }}
                                />
                                <Line type="monotone" dataKey="value" stroke="#d946ef" strokeWidth={3} dot={{ fill: '#d946ef', r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>
                </div>

                {/* Recommendations & Missions */}
                <div className="grid lg:grid-cols-2 gap-6">
                    <Card delay={0.4}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <Zap className="w-6 h-6 text-yellow-400" />
                                AI Recommendations
                            </h3>
                            <button
                                onClick={handleGenerateStrategy}
                                disabled={isGenerating}
                                className="btn-primary text-xs py-2 px-4 flex items-center gap-2"
                            >
                                {isGenerating ? (
                                    <>
                                        <motion.div
                                            className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full"
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        />
                                        Analyzing...
                                    </>
                                ) : (
                                    <>
                                        <Zap className="w-3 h-3" />
                                        Generate New
                                    </>
                                )}
                            </button>
                        </div>
                        <div className="space-y-4 max-h-[400px] overflow-auto pr-2 custom-scrollbar">
                            {recommendations.length === 0 ? (
                                <div className="text-center py-8 text-white/40 italic">
                                    No recommendations yet. Click generate to start.
                                </div>
                            ) : recommendations.map((rec, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    whileHover={{ scale: 1.02 }}
                                    className="p-4 glass glass-hover rounded-xl cursor-pointer"
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <div className="font-semibold">{rec.type}</div>
                                        <div className={`text-[10px] px-2 py-0.5 rounded-full ${rec.impact_score > 7 ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                                            }`}>
                                            Impact: {rec.impact_score}/10
                                        </div>
                                    </div>
                                    <div className="text-sm text-white/60">{rec.reason}</div>
                                </motion.div>
                            ))}
                        </div>
                    </Card>

                    <Card delay={0.5}>
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Target className="w-6 h-6 text-green-400" />
                            Active Missions (Real Data)
                        </h3>
                        <div className="space-y-4">
                            {missions.length === 0 ? (
                                <div className="text-white/60 text-center py-4">No active missions found.</div>
                            ) : missions.map((mission, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ scale: 1.02 }}
                                    className="p-4 glass glass-hover rounded-xl cursor-pointer"
                                >
                                    <div className="font-semibold mb-2">{mission.title}</div>
                                    <div className="w-full bg-white/10 rounded-full h-2 mb-2">
                                        <div
                                            className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                                            style={{ width: `${(mission.completed_steps / mission.total_steps) * 100}%` }}
                                        />
                                    </div>
                                    <div className="text-xs text-white/60">
                                        {mission.completed_steps} / {mission.total_steps} steps completed
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </Card>
                </div>
            </main>
        </div>
    );
}
