'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Shield, Zap, Users } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function PricingPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState<string | null>(null);

    const handleUpgrade = async (plan: string) => {
        if (!user) {
            router.push('/login');
            return;
        }

        setLoading(plan);
        try {
            // Direct call to backend for simplicity in this file, or use lib/services/payment.ts
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments/initialize`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ plan })
            });

            const data = await response.json();

            if (data.success && data.data.link) {
                window.location.href = data.data.link;
            } else {
                alert('Failed to initialize payment');
            }
        } catch (error) {
            console.error('Payment error', error);
            alert('Something went wrong');
        } finally {
            setLoading(null);
        }
    };

    const plans = [
        {
            id: 'free',
            name: 'Starter',
            price: '$0',
            period: 'forever',
            description: 'Perfect for individuals just getting started.',
            features: [
                '10 Missions per month',
                '5 AI Recommendations',
                'Basic Analytics',
                'Community Support'
            ],
            notIncluded: [
                'Advanced Insights',
                'Team Management',
                'Priority Support'
            ],
            cta: 'Current Plan',
            popular: false,
            color: 'bg-slate-800'
        },
        {
            id: 'pro',
            name: 'Pro',
            price: '$19',
            period: 'per month',
            description: 'For serious marketers who want faster growth.',
            features: [
                'Unlimited Missions',
                '50 AI Recommendations',
                'Advanced Analytics',
                'Priority Support',
                'Custom Mission Templates',
                'Export Data'
            ],
            notIncluded: [
                'Team Management'
            ],
            cta: 'Upgrade to Pro',
            popular: true,
            color: 'bg-primary-600'
        },
        {
            id: 'team',
            name: 'Team',
            price: '$49',
            period: 'per month',
            description: 'Collaborate and grow with your entire team.',
            features: [
                'Everything in Pro',
                'Up to 10 Team Members',
                'Team Leaderboard',
                'Admin Dashboard',
                'Shared Workspaces',
                '200 AI Recommendations'
            ],
            notIncluded: [],
            cta: 'Upgrade to Team',
            popular: false,
            color: 'bg-purple-600'
        }
    ];

    return (
        <div className="min-h-screen bg-black text-white py-20 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        Simple, Transparent Pricing
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Choose the plan that fits your growth needs. No hidden fees. Cancel anytime.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`relative rounded-2xl p-8 border ${plan.popular ? 'border-primary-500 ring-2 ring-primary-500/20' : 'border-gray-800'
                                } bg-gray-900/50 backdrop-blur-sm flex flex-col`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-primary-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg shadow-primary-500/25">
                                    Most Popular
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold">{plan.price}</span>
                                    <span className="text-gray-400 text-sm">{plan.period}</span>
                                </div>
                                <p className="text-gray-400 mt-4 text-sm">{plan.description}</p>
                            </div>

                            <div className="flex-grow space-y-4 mb-8">
                                {plan.features.map((feature) => (
                                    <div key={feature} className="flex items-start gap-3">
                                        <div className="p-1 rounded-full bg-green-500/10 text-green-500 mt-0.5">
                                            <Check className="w-3 h-3" />
                                        </div>
                                        <span className="text-gray-300 text-sm">{feature}</span>
                                    </div>
                                ))}
                                {plan.notIncluded.map((feature) => (
                                    <div key={feature} className="flex items-start gap-3 opacity-50">
                                        <div className="p-1 rounded-full bg-gray-800 text-gray-500 mt-0.5">
                                            <X className="w-3 h-3" />
                                        </div>
                                        <span className="text-gray-500 text-sm">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => plan.id !== 'free' ? handleUpgrade(plan.id) : null}
                                disabled={plan.id === 'free' || loading === plan.id}
                                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${plan.id === 'free'
                                        ? 'bg-gray-800 text-gray-400 cursor-default'
                                        : 'bg-white text-black hover:bg-gray-100'
                                    }`}
                            >
                                {loading === plan.id ? (
                                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <>
                                        {plan.id === 'pro' && <Zap className="w-4 h-4" />}
                                        {plan.id === 'team' && <Users className="w-4 h-4" />}
                                        {plan.cta}
                                    </>
                                )}
                            </button>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-20 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900 border border-gray-800 text-sm text-gray-400">
                        <Shield className="w-4 h-4 text-green-500" />
                        <span>Secured by Flutterwave. 100% money-back guarantee for 14 days.</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
