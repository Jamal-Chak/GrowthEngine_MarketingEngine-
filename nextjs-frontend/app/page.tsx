'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, TrendingUp, Zap, Target, BarChart2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function LandingPage() {
    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute inset-0 overflow-hidden -z-10">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl opacity-50" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl opacity-50" />
            </div>

            {/* Navigation */}
            <nav className="p-6 flex items-center justify-between max-w-7xl mx-auto">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold">GrowthEngine</span>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/login" className="text-sm font-medium hover:text-white/80 transition-colors">
                        Sign In
                    </Link>
                    <Link href="/register">
                        <Button className="!py-2 !px-4">Get Started</Button>
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="max-w-7xl mx-auto px-6 pt-20 pb-32">
                <div className="text-center max-w-4xl mx-auto space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                            Turn Data Into <br />
                            <span className="text-gradient">Revenue.</span>
                        </h1>
                        <p className="text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
                            GrowthEngine analyzes your metrics and tells you exactly
                            <span className="text-white font-medium"> what to do next </span>
                            to increase revenue, retention, and engagement. No more guessing.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center justify-center gap-4"
                    >
                        <Link href="/register">
                            <Button className="text-lg px-8 py-4 h-auto">
                                Start Your First Mission <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </Link>
                        <Link href="/login">
                            <button className="px-8 py-4 rounded-xl border border-white/10 hover:bg-white/5 transition-colors font-medium">
                                View Demo
                            </button>
                        </Link>
                    </motion.div>
                </div>

                {/* Value Props / First 10 Minutes */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-32 grid md:grid-cols-3 gap-8"
                >
                    <div className="md:col-span-3 text-center mb-8">
                        <h2 className="text-3xl font-bold mb-4">Your First 10 Minutes</h2>
                        <p className="text-white/60">How we turn your data into a plan.</p>
                    </div>
                    {[
                        {
                            icon: Target,
                            title: "1. Connect Data",
                            desc: "Link your analytics or just tell us your goals. We build a custom growth profile in minutes."
                        },
                        {
                            icon: Zap,
                            title: "2. Get Missions",
                            desc: "Receive 3 high-impact, actionable tasks every week tailored to your specific metrics."
                        },
                        {
                            icon: TrendingUp,
                            title: "3. Measure Impact",
                            desc: "Execute missions and watch your Growth Score rise as real revenue increases."
                        }
                    ].map((feature, i) => (
                        <div key={i} className="p-8 glass rounded-2xl space-y-4 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-accent-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center">
                                <feature.icon className="w-6 h-6 text-primary-400" />
                            </div>
                            <h3 className="text-xl font-bold">{feature.title}</h3>
                            <p className="text-white/60 leading-relaxed">
                                {feature.desc}
                            </p>
                        </div>
                    ))}
                </motion.div>
            </main>
        </div >
    );
}
