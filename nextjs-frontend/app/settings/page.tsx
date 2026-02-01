'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Users, Bell, CreditCard, Shield, Save } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { fadeInUp } from '@/lib/animations';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { triggerSuccessConfetti } from '@/lib/utils/confetti';

export default function SettingsPage() {
    const { data: session } = useSession();
    const user = session?.user;
    const router = useRouter();
    const searchParams = useSearchParams();

    const [activeTab, setActiveTab] = useState('profile');
    const [saving, setSaving] = useState(false);
    const [subscription, setSubscription] = useState<any>(null);

    useEffect(() => {
        const fetchSubscription = async () => {
            try {
                if (!session?.accessToken) return;

                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments/subscription`, {
                    headers: { 'Authorization': `Bearer ${session.accessToken}` }
                });
                const data = await res.json();
                if (data.success) {
                    setSubscription(data.data);
                }
            } catch (err) {
                console.error(err);
            }
        };

        if (session?.user) fetchSubscription();
    }, [session]);

    // Handle Payment Success
    useEffect(() => {
        if (searchParams.get('payment') === 'success') {
            triggerSuccessConfetti();
            setActiveTab('billing');
            // Clean up URL
            window.history.replaceState(null, '', '/settings');
        }
    }, [searchParams]);

    const handleSave = async () => {
        setSaving(true);
        // TODO: Implement save logic
        setTimeout(() => setSaving(false), 1000);
    };

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'team', label: 'Team', icon: Users },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'billing', label: 'Billing', icon: CreditCard },
        { id: 'security', label: 'Security', icon: Shield },
    ];

    if (!user) return null; // Or loading spinner

    return (
        <div className="min-h-screen p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">
                    <span className="text-gradient">Settings</span>
                </h1>
                <p className="text-white/60">
                    Manage your account and preferences
                </p>
            </div>

            <div className="grid lg:grid-cols-4 gap-6">
                {/* Sidebar */}
                <nav className="space-y-2">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${activeTab === tab.id
                                    ? 'bg-primary-500 text-white'
                                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                {tab.label}
                            </button>
                        );
                    })}
                </nav>

                {/* Content */}
                <div className="lg:col-span-3">
                    <motion.div
                        key={activeTab}
                        variants={fadeInUp}
                        initial="initial"
                        animate="animate"
                    >
                        {activeTab === 'profile' && (
                            <Card>
                                <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>
                                <div className="space-y-4">
                                    <Input
                                        label="Full Name"
                                        placeholder="John Doe"
                                        defaultValue={user?.name || ''}
                                    />
                                    <Input
                                        label="Email Address"
                                        type="email"
                                        placeholder="john@example.com"
                                        defaultValue={user?.email || ''}
                                        disabled
                                    />
                                    <Input
                                        label="Company Name"
                                        placeholder="Acme Inc."
                                        defaultValue={user?.orgId || ''}
                                    />
                                    <div>
                                        <label className="block text-sm font-medium text-white/80 mb-2">
                                            Bio
                                        </label>
                                        <textarea
                                            className="w-full px-4 py-3 glass rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all duration-300 placeholder-white/40 min-h-[100px]"
                                            placeholder="Tell us about yourself..."
                                        />
                                    </div>

                                    <Button
                                        onClick={handleSave}
                                        isLoading={saving}
                                        icon={<Save className="w-4 h-4" />}
                                        className="mt-6"
                                    >
                                        Save Changes
                                    </Button>
                                </div>
                            </Card>
                        )}

                        {activeTab === 'team' && (
                            <Card>
                                <h2 className="text-2xl font-bold mb-6">Team Management</h2>
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="font-semibold mb-3">Invite Team Members</h3>
                                        <div className="flex gap-2">
                                            <Input
                                                placeholder="colleague@example.com"
                                                className="flex-1"
                                            />
                                            <Button>Invite</Button>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold mb-3">Team Members</h3>
                                        <div className="text-white/60 text-sm">
                                            No team members yet. Invite your first team member above!
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        )}

                        {activeTab === 'notifications' && (
                            <Card>
                                <h2 className="text-2xl font-bold mb-6">Notification Preferences</h2>
                                <div className="space-y-4">
                                    {[
                                        { id: 'email', label: 'Email Notifications', desc: 'Receive email updates about your account' },
                                        { id: 'missions', label: 'Mission Reminders', desc: 'Get reminded about incomplete missions' },
                                        { id: 'achievements', label: 'Achievement Alerts', desc: 'Celebrate when you unlock badges' },
                                        { id: 'weekly', label: 'Weekly Summary', desc: 'Receive a weekly progress report' },
                                    ].map((setting) => (
                                        <div key={setting.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                                            <div>
                                                <div className="font-medium">{setting.label}</div>
                                                <div className="text-sm text-white/50">{setting.desc}</div>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                                <div className="w-11 h-6 bg-white/20 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                                            </label>
                                        </div>
                                    ))}

                                    <Button
                                        onClick={handleSave}
                                        isLoading={saving}
                                        icon={<Save className="w-4 h-4" />}
                                        className="mt-6"
                                    >
                                        Save Preferences
                                    </Button>
                                </div>
                            </Card>
                        )}

                        {activeTab === 'billing' && (
                            <Card>
                                <h2 className="text-2xl font-bold mb-6">Billing & Subscription</h2>
                                <div className="space-y-6">
                                    <div className={`p-4 border rounded-lg ${subscription?.plan === 'pro' || subscription?.plan === 'team' ? 'bg-primary-500/10 border-primary-500/30' : 'bg-gray-800/50 border-gray-700'}`}>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-semibold">Current Plan</span>
                                            <span className={`px-3 py-1 text-sm rounded-full ${subscription?.plan === 'pro' || subscription?.plan === 'team' ? 'bg-primary-500 text-white' : 'bg-gray-700 text-gray-300'}`}>
                                                {subscription?.plan ? subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1) : 'Free'}
                                            </span>
                                        </div>
                                        <p className="text-sm text-white/60 mb-4">
                                            {subscription?.plan === 'free'
                                                ? "You're on the free plan. Upgrade to unlock more features and higher limits."
                                                : `Your ${subscription.plan} plan is active. Next billing date: ${new Date(subscription.nextBillingDate).toLocaleDateString()}`
                                            }
                                        </p>
                                        {subscription?.plan === 'free' ? (
                                            <Button onClick={() => router.push('/pricing')}>
                                                Upgrade to Pro
                                            </Button>
                                        ) : (
                                            <Button variant="secondary">
                                                Manage Subscription
                                            </Button>
                                        )}
                                    </div>

                                    <div>
                                        <h3 className="font-semibold mb-3">Usage This Month</h3>
                                        <div className="space-y-3">
                                            <div>
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="text-white/60">Missions Created</span>
                                                    <span>
                                                        {subscription?.features?.missionsLimit === -1
                                                            ? 'Unlimited'
                                                            : `0 / ${subscription?.features?.missionsLimit || 10}`
                                                        }
                                                    </span>
                                                </div>
                                                <div className="w-full bg-white/10 rounded-full h-2">
                                                    <div className="bg-primary-500 h-2 rounded-full" style={{ width: subscription?.features?.missionsLimit === -1 ? '100%' : '10%' }} />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="text-white/60">AI Recommendations</span>
                                                    <span>
                                                        {subscription?.features?.aiRecommendationsLimit === -1
                                                            ? 'Unlimited'
                                                            : `0 / ${subscription?.features?.aiRecommendationsLimit || 5}`
                                                        }
                                                    </span>
                                                </div>
                                                <div className="w-full bg-white/10 rounded-full h-2">
                                                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: subscription?.features?.aiRecommendationsLimit === -1 ? '100%' : '20%' }} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        )}

                        {activeTab === 'security' && (
                            <Card>
                                <h2 className="text-2xl font-bold mb-6">Security Settings</h2>
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="font-semibold mb-3">Change Password</h3>
                                        <div className="space-y-4">
                                            <Input
                                                label="Current Password"
                                                type="password"
                                            />
                                            <Input
                                                label="New Password"
                                                type="password"
                                            />
                                            <Input
                                                label="Confirm New Password"
                                                type="password"
                                            />
                                            <Button variant="secondary">
                                                Update Password
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="border-t border-white/10 pt-6">
                                        <h3 className="font-semibold mb-3 text-danger-400">Danger Zone</h3>
                                        <div className="p-4 bg-danger-500/10 border border-danger-500/30 rounded-lg">
                                            <p className="text-sm mb-3">
                                                Deleting your account will permanently remove all your data. This action cannot be undone.
                                            </p>
                                            <Button variant="ghost" className="text-danger-400 hover:bg-danger-500/20">
                                                Delete Account
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
