'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';
// import { supabase } from '@/lib/supabase'; // Removed
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';

export default function LeaderboardPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [leaderboard, setLeaderboard] = useState<any[]>([]);
    const [userRank, setUserRank] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [timeframe, setTimeframe] = useState<'week' | 'month' | 'all'>('all');

    useEffect(() => {
        if (status === 'loading') return;
        if (!session?.user) {
            router.push('/login');
            return;
        }

        const fetchLeaderboard = async () => {
            try {
                // Fetch from backend API
                const response = await fetch(`http://127.0.0.1:5000/api/gamification/leaderboard`, {
                    headers: {
                        'Authorization': `Bearer ${session.accessToken}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setLeaderboard(data.leaderboard || []);

                    // Find user's rank
                    const rank = data.leaderboard?.findIndex((entry: any) => entry.userId === session.user.id);
                    setUserRank(rank >= 0 ? rank + 1 : null);
                }
            } catch (error) {
                console.error('Failed to fetch leaderboard:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, [router, timeframe, session, status]); // Added dependencies

    if (loading) {
        return (
            <div className="min-h-screen p-8 max-w-6xl mx-auto">
                <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="h-20 bg-white/5 rounded-xl animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    const getMedalIcon = (rank: number) => {
        if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-400" />;
        if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
        if (rank === 3) return <Award className="w-6 h-6 text-orange-400" />;
        return null;
    };

    return (
        <div className="min-h-screen p-8 max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">
                    <span className="text-gradient">Leaderboard</span>
                </h1>
                <p className="text-white/60">
                    See how you rank against other growth champions
                </p>
            </div>

            {/* Timeframe Filter */}
            <div className="flex gap-2 mb-6">
                {(['week', 'month', 'all'] as const).map((tf) => (
                    <button
                        key={tf}
                        onClick={() => setTimeframe(tf)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${timeframe === tf
                            ? 'bg-primary-500 text-white'
                            : 'bg-white/5 text-white/60 hover:bg-white/10'
                            }`}
                    >
                        {tf === 'all' ? 'All Time' : `This ${tf}`}
                    </button>
                ))}
            </div>

            {leaderboard.length > 0 ? (
                <div className="space-y-4">
                    {/* Top 3 Podium */}
                    {leaderboard.length >= 3 && (
                        <div className="grid grid-cols-3 gap-4 mb-8">
                            {/* 2nd Place */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <Card className="text-center bg-gradient-to-br from-gray-500/20 to-gray-600/20 border-gray-500/30">
                                    <div className="mb-4">
                                        <Medal className="w-12 h-12 mx-auto text-gray-400" />
                                    </div>
                                    <div className="text-2xl font-bold mb-1">#{2}</div>
                                    <div className="text-lg font-semibold mb-2">{leaderboard[1]?.userId || 'User'}</div>
                                    <div className="flex items-center justify-center gap-2 text-white/60">
                                        <TrendingUp className="w-4 h-4 text-yellow-400" />
                                        <span className="font-bold text-yellow-400">{leaderboard[1]?.xp || 0} XP</span>
                                    </div>
                                    <div className="text-sm text-white/40 mt-1">Level {leaderboard[1]?.level || 1}</div>
                                </Card>
                            </motion.div>

                            {/* 1st Place */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="-mt-4"
                            >
                                <Card className="text-center bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/30">
                                    <div className="mb-4">
                                        <Trophy className="w-16 h-16 mx-auto text-yellow-400" />
                                    </div>
                                    <div className="text-3xl font-bold mb-1">#{1}</div>
                                    <div className="text-xl font-semibold mb-2">{leaderboard[0]?.userId || 'User'}</div>
                                    <div className="flex items-center justify-center gap-2 text-white/60">
                                        <TrendingUp className="w-5 h-5 text-yellow-400" />
                                        <span className="text-lg font-bold text-yellow-400">{leaderboard[0]?.xp || 0} XP</span>
                                    </div>
                                    <div className="text-sm text-white/40 mt-1">Level {leaderboard[0]?.level || 1}</div>
                                </Card>
                            </motion.div>

                            {/* 3rd Place */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <Card className="text-center bg-gradient-to-br from-orange-500/20 to-orange-600/20 border-orange-500/30">
                                    <div className="mb-4">
                                        <Award className="w-12 h-12 mx-auto text-orange-400" />
                                    </div>
                                    <div className="text-2xl font-bold mb-1">#{3}</div>
                                    <div className="text-lg font-semibold mb-2">{leaderboard[2]?.userId || 'User'}</div>
                                    <div className="flex items-center justify-center gap-2 text-white/60">
                                        <TrendingUp className="w-4 h-4 text-yellow-400" />
                                        <span className="font-bold text-yellow-400">{leaderboard[2]?.xp || 0} XP</span>
                                    </div>
                                    <div className="text-sm text-white/40 mt-1">Level {leaderboard[2]?.level || 1}</div>
                                </Card>
                            </motion.div>
                        </div>
                    )}

                    {/* Full Leaderboard */}
                    <Card className="p-0 overflow-hidden">
                        <div className="divide-y divide-white/10">
                            {leaderboard.map((entry, index) => (
                                <motion.div
                                    key={entry.userId || index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={`p-4 flex items-center gap-4 hover:bg-white/5 transition-colors ${userRank === index + 1 ? 'bg-primary-500/10 border-l-4 border-primary-500' : ''
                                        }`}
                                >
                                    {/* Rank */}
                                    <div className="w-12 text-center">
                                        {getMedalIcon(index + 1) || (
                                            <span className="text-lg font-bold text-white/60">#{index + 1}</span>
                                        )}
                                    </div>

                                    {/* User Info */}
                                    <div className="flex-1">
                                        <div className="font-semibold text-white flex items-center gap-2">
                                            {entry.userId || 'User'}
                                            {userRank === index + 1 && (
                                                <span className="text-xs px-2 py-0.5 bg-primary-500/20 text-primary-300 rounded-full">
                                                    You
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-sm text-white/40">Level {entry.level || 1}</div>
                                    </div>

                                    {/* XP */}
                                    <div className="text-right">
                                        <div className="flex items-center gap-1 text-yellow-400 font-bold">
                                            <TrendingUp className="w-4 h-4" />
                                            {entry.xp?.toLocaleString() || 0} XP
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </Card>

                    {/* User's Rank Card (if not in top 10) */}
                    {userRank && userRank > 10 && (
                        <Card className="bg-primary-500/10 border-primary-500/30">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm text-white/60 mb-1">Your Rank</div>
                                    <div className="text-2xl font-bold">#{userRank}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-white/60 mb-1">Total XP</div>
                                    <div className="text-xl font-bold text-yellow-400">
                                        {leaderboard.find((_, i) => i + 1 === userRank)?.xp?.toLocaleString() || 0} XP
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )}
                </div>
            ) : (
                <EmptyState
                    icon={Trophy}
                    title="No Leaderboard Data Yet"
                    description="Complete missions to earn XP and climb the leaderboard!"
                    action={{
                        label: 'View Missions',
                        onClick: () => router.push('/missions'),
                    }}
                />
            )}
        </div>
    );
}
