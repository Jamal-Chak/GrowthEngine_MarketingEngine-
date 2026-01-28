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
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">
                        Welcome back, <span className="text-gradient">{user?.name}</span>
                    </h1>
                    <p className="text-white/60">Here&apos;s what&apos;s happening with your growth today</p>
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
                                    <h3 className="text-3xl font-bold text-white leading-tight">
                                        {missions[0].title}
                                    </h3>
                                    <p className="text-lg text-white/70">
                                        {missions[0].description || "Complete this mission to unlock 100 XP and improve your growth metrics."}
                                    </p>
                                </div>
                                <div className="flex-shrink-0">
                                    <button
                                        className="btn-primary text-lg px-8 py-4 shadow-xl shadow-primary-500/20"
                                        onClick={() => router.push(`/missions/${missions[0].id}`)}
                                    >
                                        Start Mission
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <h3 className="text-2xl font-bold mb-2">All caught up!</h3>
                                <p className="text-white/60 mb-6">Great job. Generate a new strategy to get more missions.</p>
                                <button onClick={handleGenerateStrategy} className="btn-primary">
                                    Generate Strategy
                                </button>
                            </div>
                        )}
                    </Card>
                </div>

                {/* Secondary Metrics & Active Missions */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Activity Chart (Context) */}
                    <Card className="lg:col-span-2">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <Zap className="w-5 h-5 text-yellow-400" />
                            Growth Trend
                        </h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <AreaChart data={MOCK_CHART_DATA}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(15, 23, 42, 0.95)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
                                    }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#0ea5e9" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </Card>

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
                {recommendations.length > 0 && (
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
                )}
            </main>
        </div>
    );
}
