'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Plus, Target } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { MissionCard } from '@/components/missions/MissionCard';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { staggerContainer, staggerItem } from '@/lib/animations';

export default function MissionsPage() {
    const router = useRouter();
    const [missions, setMissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

    useEffect(() => {
        const fetchMissions = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    router.push('/login');
                    return;
                }

                // Fetch from backend API
                const response = await fetch(`http://localhost:5000/api/missions?userId=${user.id}`, {
                    headers: {
                        'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setMissions(data.missions || []);
                }
            } catch (error) {
                console.error('Failed to fetch missions:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMissions();
    }, [router]);

    const filteredMissions = missions.filter(mission => {
        if (filter === 'active') return !mission.completed;
        if (filter === 'completed') return mission.completed;
        return true;
    });

    if (loading) {
        return (
            <div className="min-h-screen p-8 max-w-7xl mx-auto">
                <div className="space-y-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-64 bg-white/5 rounded-2xl animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">
                    Your <span className="text-gradient">Growth Missions</span>
                </h1>
                <p className="text-white/60">
                    Complete missions to earn XP and level up your growth game
                </p>
            </div>

            {/* Filters */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex gap-2">
                    {(['all', 'active', 'completed'] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${filter === f
                                    ? 'bg-primary-500 text-white'
                                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                                }`}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                            {f !== 'all' && (
                                <span className="ml-2 text-xs opacity-60">
                                    ({missions.filter(m => f === 'active' ? !m.completed : m.completed).length})
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                <Button
                    onClick={() => router.push('/missions/templates')}
                    icon={<Plus className="w-4 h-4" />}
                >
                    Browse Templates
                </Button>
            </div>

            {/* Missions Grid */}
            {filteredMissions.length > 0 ? (
                <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                    className="grid md:grid-cols-2 gap-6"
                >
                    {filteredMissions.map((mission) => (
                        <motion.div key={mission.id} variants={staggerItem}>
                            <MissionCard
                                mission={mission}
                                onClick={() => router.push(`/missions/${mission.id}`)}
                            />
                        </motion.div>
                    ))}
                </motion.div>
            ) : (
                <EmptyState
                    icon={Target}
                    title={filter === 'all' ? 'No Missions Yet' : `No ${filter} Missions`}
                    description={
                        filter === 'all'
                            ? 'Start your growth journey by creating your first mission from our templates.'
                            : `You don't have any ${filter} missions right now.`
                    }
                    action={{
                        label: 'Browse Mission Templates',
                        onClick: () => router.push('/missions/templates'),
                        icon: <Plus className="w-4 h-4" />,
                    }}
                    secondaryAction={
                        filter !== 'all'
                            ? {
                                label: 'View All Missions',
                                onClick: () => setFilter('all'),
                            }
                            : undefined
                    }
                />
            )}
        </div>
    );
}
