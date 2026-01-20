'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Target, TrendingUp, Users, Database, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function OnboardingPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // State for choices
    const [businessType, setBusinessType] = useState('');
    const [growthGoal, setGrowthGoal] = useState('');

    // Step 1: Business Type Options
    const businessTypes = [
        { id: 'saas', label: 'SaaS', icon: Database, desc: 'Subscription software' },
        { id: 'ecommerce', label: 'E-Commerce', icon: TrendingUp, desc: 'Online store' },
        { id: 'service', label: 'Agency/Service', icon: Users, desc: 'Client services' },
    ];

    // Step 2: Goals
    const goals = [
        { id: 'revenue', label: 'Increase Revenue', desc: 'Prioritize direct sales' },
        { id: 'leads', label: 'Generate Leads', desc: 'Fill the top of funnel' },
        { id: 'retention', label: 'Improve Retention', desc: 'Keep existing customers' },
    ];

    const nextStep = () => setStep(s => s + 1);

    const handleComplete = async () => {
        setLoading(true);
        // Simulate API call to generate first mission
        await new Promise(resolve => setTimeout(resolve, 2000));
        router.push('/dashboard');
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                {/* Progress Bar */}
                <div className="mb-8 relative h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                        className="absolute top-0 left-0 h-full bg-primary-500"
                        initial={{ width: '0%' }}
                        animate={{ width: `${(step / 4) * 100}%` }}
                    />
                </div>

                <AnimatePresence mode="wait">
                    {/* STEP 1: BUSINESS TYPE */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div className="text-center space-y-2">
                                <h1 className="text-3xl font-bold">What type of business are you?</h1>
                                <p className="text-white/60">This helps us tailor the AI missions.</p>
                            </div>

                            <div className="grid md:grid-cols-3 gap-4">
                                {businessTypes.map((type) => (
                                    <button
                                        key={type.id}
                                        onClick={() => setBusinessType(type.id)}
                                        className={`p-6 rounded-2xl border-2 transition-all text-left space-y-3
                                            ${businessType === type.id
                                                ? 'bg-primary-500/20 border-primary-500 ring-2 ring-primary-500/20'
                                                : 'bg-white/5 border-transparent hover:bg-white/10'}`}
                                    >
                                        <type.icon className={`w-8 h-8 ${businessType === type.id ? 'text-primary-400' : 'text-white/60'}`} />
                                        <div>
                                            <div className="font-bold">{type.label}</div>
                                            <div className="text-xs text-white/50">{type.desc}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <div className="flex justify-end">
                                <Button disabled={!businessType} onClick={nextStep} icon={<ArrowRight className="w-4 h-4" />}>
                                    Next Step
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 2: GROWTH GOAL */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div className="text-center space-y-2">
                                <h1 className="text-3xl font-bold">What is your main focus?</h1>
                                <p className="text-white/60">We&apos;ll prioritize missions for this goal.</p>
                            </div>

                            <div className="space-y-3">
                                {goals.map((goal) => (
                                    <button
                                        key={goal.id}
                                        onClick={() => setGrowthGoal(goal.id)}
                                        className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center gap-4
                                            ${growthGoal === goal.id
                                                ? 'bg-primary-500/20 border-primary-500'
                                                : 'bg-white/5 border-transparent hover:bg-white/10'}`}
                                    >
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center
                                            ${growthGoal === goal.id ? 'border-primary-500' : 'border-white/20'}`}>
                                            {growthGoal === goal.id && <div className="w-3 h-3 bg-primary-500 rounded-full" />}
                                        </div>
                                        <div>
                                            <div className="font-bold">{goal.label}</div>
                                            <div className="text-sm text-white/50">{goal.desc}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <div className="flex justify-between">
                                <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
                                <Button disabled={!growthGoal} onClick={nextStep} icon={<ArrowRight className="w-4 h-4" />}>
                                    Next Step
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 3: CONNECT DATA */}
                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div className="text-center space-y-2">
                                <h1 className="text-3xl font-bold">Connect your sources</h1>
                                <p className="text-white/60">For now, we&apos;ll start with manual input.</p>
                            </div>

                            <div className="grid gap-4">
                                <div className="p-4 rounded-xl border border-white/10 bg-white/5 opacity-50 flex items-center justify-between">
                                    <span className="font-medium">Google Analytics</span>
                                    <span className="text-xs px-2 py-1 bg-white/10 rounded">Coming Soon</span>
                                </div>
                                <div className="p-4 rounded-xl border border-white/10 bg-white/5 opacity-50 flex items-center justify-between">
                                    <span className="font-medium">Stripe</span>
                                    <span className="text-xs px-2 py-1 bg-white/10 rounded">Coming Soon</span>
                                </div>
                                <div className="p-4 rounded-xl border border-primary-500/50 bg-primary-500/10 flex items-center justify-between">
                                    <span className="font-medium">Manual Entry</span>
                                    <Check className="w-5 h-5 text-primary-400" />
                                </div>
                            </div>

                            <div className="flex justify-between">
                                <Button variant="ghost" onClick={() => setStep(2)}>Back</Button>
                                <Button onClick={nextStep} icon={<ArrowRight className="w-4 h-4" />}>
                                    Generate Plan
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 4: GENERATING */}
                    {step === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center space-y-8 py-12"
                        >
                            {!loading ? (
                                <>
                                    <div className="relative w-32 h-32 mx-auto">
                                        <motion.div
                                            className="absolute inset-0 bg-primary-500/30 rounded-full blur-xl"
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        />
                                        <div className="bg-gradient-to-br from-primary-500 to-accent-500 rounded-full w-full h-full flex items-center justify-center relative z-10">
                                            <Target className="w-12 h-12 text-white" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h1 className="text-3xl font-bold">Ready to Launch</h1>
                                        <p className="text-white/60">We&apos;ve customized your first 3 missions.</p>
                                    </div>

                                    <Button onClick={handleComplete} className="w-full max-w-sm mx-auto text-lg py-6">
                                        Enter Dashboard
                                    </Button>
                                </>
                            ) : (
                                <div className="space-y-4">
                                    <div className="w-16 h-16 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mx-auto" />
                                    <p className="text-xl font-medium animate-pulse">Generating AI Missions...</p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
