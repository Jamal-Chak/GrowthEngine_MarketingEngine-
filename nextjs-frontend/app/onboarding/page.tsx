'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Target, TrendingUp, Users, Database, Globe, ArrowRight, Check } from 'lucide-react'; // Added Globe for channel
import { Button } from '@/components/ui/Button';
import confetti from 'canvas-confetti';
import { useSession } from 'next-auth/react';
// ... (imports)

export default function OnboardingPage() {
    const router = useRouter();
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        businessType: '',
        growthGoal: '',
        channel: ''
    });

    // Options
    const businessTypes = [
        { id: 'saas', label: 'SaaS Software' },
        { id: 'ecommerce', label: 'E-Commerce' },
        { id: 'service', label: 'Agency / Services' },
        { id: 'content', label: 'Content / Creator' }
    ];

    const goals = [
        { id: 'revenue', label: 'Get More Revenue' },
        { id: 'traffic', label: 'Get More Traffic' },
        { id: 'leads', label: 'Get More Leads' }
    ];

    const channels = [
        { id: 'seo', label: 'SEO / Organic Search' },
        { id: 'social', label: 'Social Media' },
        { id: 'ads', label: 'Paid Ads' },
        { id: 'email', label: 'Email Marketing' }
    ];

    const canSubmit = formData.businessType && formData.growthGoal && formData.channel;

    const handleComplete = async () => {
        if (!canSubmit) return;
        setLoading(true);
        setIsGenerating(true); // Show generating UI

        try {
            if (!session?.user?.id) {
                router.push('/login');
                throw new Error('No user session found');
            }

            const response = await fetch('http://127.0.0.1:5000/api/onboarding/complete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.accessToken}`
                },
                body: JSON.stringify({
                    userId: session.user.id, // Use NextAuth ID (MongoDB ObjectId)
                    businessType: formData.businessType,
                    goal: formData.growthGoal,
                    channel: formData.channel,
                    teamSize: '1-10' // Default assumption for minimal onboarding
                }),
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || 'Failed to complete onboarding');
            }

            const result = await response.json();

            // Trigger confetti
            confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });

            // Short delay to show the "Generating" state
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Redirect to first mission if created, otherwise dashboard
            if (result.mission && result.mission.id) {
                router.push(`/missions/${result.mission.id}`);
            } else {
                router.push('/dashboard');
            }

        } catch (error) {
            console.error('Onboarding error:', error);
            setIsGenerating(false);
            setLoading(false);
            alert('Something went wrong. Please try again.'); // Basic error feedback
        }
    };

    if (isGenerating) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center space-y-8"
                >
                    <div className="relative w-32 h-32 mx-auto">
                        <motion.div
                            className="absolute inset-0 bg-primary-500/30 rounded-full blur-xl"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                        <div className="bg-gradient-to-br from-primary-500 to-accent-500 rounded-full w-full h-full flex items-center justify-center relative z-10">
                            <Target className="w-12 h-12 text-white animate-pulse" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold">Building Your Growth Plan...</h1>
                        <p className="text-white/60">AI is analyzing your {formData.channel} strategy.</p>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-xl space-y-8"
            >
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                        Let's Get You Growing
                    </h1>
                    <p className="text-white/60 text-lg">
                        Tell us 3 things, and we'll give you a <span className="text-primary-400 font-bold">Quick Win</span> mission right now.
                    </p>
                </div>

                <div className="space-y-6 bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-sm">
                    {/* Q1: Business Type */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-white/50 uppercase tracking-wider">1. Business Type</label>
                        <div className="grid grid-cols-2 gap-3">
                            {businessTypes.map(t => (
                                <button
                                    key={t.id}
                                    onClick={() => setFormData({ ...formData, businessType: t.id })}
                                    className={`p-3 rounded-xl border text-sm font-medium transition-all
                                        ${formData.businessType === t.id
                                            ? 'bg-primary-500/20 border-primary-500 text-white'
                                            : 'bg-white/5 border-transparent text-white/60 hover:bg-white/10'}`}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Q2: Goal */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-white/50 uppercase tracking-wider">2. Primary Goal</label>
                        <div className="grid grid-cols-3 gap-3">
                            {goals.map(g => (
                                <button
                                    key={g.id}
                                    onClick={() => setFormData({ ...formData, growthGoal: g.id })}
                                    className={`p-3 rounded-xl border text-sm font-medium transition-all
                                        ${formData.growthGoal === g.id
                                            ? 'bg-primary-500/20 border-primary-500 text-white'
                                            : 'bg-white/5 border-transparent text-white/60 hover:bg-white/10'}`}
                                >
                                    {g.label.split(' ').slice(2).join(' ')} {/* Show only 'Revenue', 'Traffic' etc */}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Q3: Channel */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-white/50 uppercase tracking-wider">3. Main Channel</label>
                        <select
                            value={formData.channel}
                            onChange={(e) => setFormData({ ...formData, channel: e.target.value })}
                            className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-primary-500 transition-colors"
                        >
                            <option value="" disabled>Select your primary channel...</option>
                            {channels.map(c => (
                                <option key={c.id} value={c.id} className="bg-slate-900">{c.label}</option>
                            ))}
                        </select>
                    </div>

                    <Button
                        onClick={handleComplete}
                        disabled={!canSubmit || loading}
                        className="w-full py-6 text-lg font-bold shadow-xl shadow-primary-500/20"
                        icon={<ArrowRight className="w-5 h-5" />}
                    >
                        Start My First Mission
                    </Button>
                </div>
            </motion.div>
        </div>
    );
}
