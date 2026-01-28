'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User, LogIn } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

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

    const { login } = useAuth();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // Use Supabase authentication
            const { supabase } = await import('@/lib/supabase');

            const { data, error } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        name: formData.name,
                        role: 'user'
                    }
                }
            });

            if (error) {
                throw new Error(error.message);
            }

            if (!data.user) {
                throw new Error('Registration failed - no user data returned');
            }

            // Check if email confirmation is required
            if (data.session) {
                // User is logged in immediately (email confirmation disabled)
                const userData = {
                    _id: data.user.id,
                    name: formData.name,
                    email: data.user.email!,
                    role: 'user'
                };

                login(data.session.access_token, userData);
                router.push('/onboarding');
            } else {
                // Email confirmation required
                setSuccess(true);
            }

        } catch (err: any) {
            console.error('Registration error:', err);
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const validateEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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
                                        className="p-4 bg-danger-500/10 border border-danger-500/50 rounded-xl text-danger-500 text-sm"
                                    >
                                        {error}
                                    </motion.div>
                                )}

                                <div className="space-y-4">
                                    <Input
                                        label="Full Name"
                                        icon={<User className="w-5 h-5" />}
                                        type="text"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />

                                    <Input
                                        label="Email Address"
                                        icon={<Mail className="w-5 h-5" />}
                                        type="email"
                                        placeholder="you@example.com"
                                        value={formData.email}
                                        onChange={(e) => {
                                            setFormData({ ...formData, email: e.target.value });
                                            if (e.target.value && !validateEmail(e.target.value)) {
                                                // We could set a local field error here if we wanted strictly inline, 
                                                // for now we rely on browser 'type=email' and submit validation,
                                                // but using Input component gives us the structure.
                                            }
                                        }}
                                        required
                                    />

                                    <Input
                                        label="Password"
                                        icon={<Lock className="w-5 h-5" />}
                                        type="password"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                        minLength={6}
                                        error={
                                            formData.password && formData.password.length < 6
                                                ? 'Password must be at least 6 characters'
                                                : undefined
                                        }
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    isLoading={isLoading}
                                    className="w-full"
                                    icon={<UserPlus className="w-5 h-5" />}
                                >
                                    Create Account
                                </Button>
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
