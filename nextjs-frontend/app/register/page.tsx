'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const { data, error: signUpError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        full_name: formData.name,
                    },
                },
            });

            if (signUpError) throw signUpError;

            if (data.session) {
                router.push('/onboarding');
            } else {
                // Email confirmation required
                setError('');
                setIsLoading(false);
                setSuccess(true);
            }
        } catch (err: any) {
            console.error('Registration error:', err);
            let errorMessage = err.message || 'Registration failed. Please try again.';

            // Map common Supabase errors to user-friendly messages
            if (errorMessage.toLowerCase().includes('email address') && errorMessage.toLowerCase().includes('invalid')) {
                errorMessage = 'This email address is invalid or not allowed. Please use a standard email provider (e.g. Gmail) and avoid "test" or "example" domains.';
            }

            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    className="absolute top-20 left-20 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 8, repeat: Infinity }}
                />
                <motion.div
                    className="absolute bottom-20 right-20 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl"
                    animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 10, repeat: Infinity }}
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="card p-8 space-y-8">
                    {success ? (
                        <div className="text-center space-y-6">
                            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                                <Mail className="w-8 h-8 text-green-400" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-2xl font-bold text-white">Check Your Email</h2>
                                <p className="text-white/60">
                                    We&apos;ve sent a confirmation link to <span className="text-primary-400">{formData.email}</span>.
                                    Please click the link to activate your account.
                                </p>
                            </div>
                            <div className="p-4 bg-primary-500/10 border border-primary-500/20 rounded-xl text-sm text-primary-200">
                                Tip: If you don&apos;t see it, check your spam folder.
                                <br />
                                <span className="text-xs opacity-70 mt-1 block">Dev Mode: Disable &quot;Confirm Email&quot; in Supabase to skip this.</span>
                            </div>
                            <button
                                onClick={() => router.push('/onboarding')}
                                className="btn-primary w-full"
                            >
                                Return to Login
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="text-center space-y-2">
                                <h2 className="text-3xl font-bold">Create Account</h2>
                                <p className="text-white/60">Start your growth journey today</p>
                            </div>

                            <form onSubmit={handleRegister} className="space-y-6">
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm"
                                    >
                                        {error}
                                    </motion.div>
                                )}

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-white/80">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                        <input
                                            type="text"
                                            placeholder="John Doe"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="input-field pl-12"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-white/80">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                        <input
                                            type="email"
                                            placeholder="you@example.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="input-field pl-12"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-white/80">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                        <input
                                            type="password"
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className="input-field pl-12"
                                            required
                                            minLength={6}
                                        />
                                    </div>
                                </div>

                                <motion.button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full btn-primary flex items-center justify-center gap-2"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {isLoading ? (
                                        <>
                                            <motion.div
                                                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            />
                                            Creating account...
                                        </>
                                    ) : (
                                        <>
                                            <UserPlus className="w-5 h-5" />
                                            Create Account
                                        </>
                                    )}
                                </motion.button>
                            </form>

                            <div className="text-center">
                                <p className="text-white/60">
                                    Already have an account?{' '}
                                    <Link href="/" className="text-primary-400 hover:text-primary-300 font-semibold transition-colors">
                                        Sign in
                                    </Link>
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
