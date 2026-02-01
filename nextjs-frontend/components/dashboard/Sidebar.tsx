'use client';

import { motion } from 'framer-motion';
import {
    Sparkles,
    X,
    Menu,
    BarChart3,
    Target,
    Users,
    Award,
    LogOut
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    const navItems = [
        { icon: BarChart3, label: 'Dashboard', href: '/dashboard' },
        { icon: Target, label: 'Missions', href: '/dashboard/missions' },
        { icon: Users, label: 'Team', href: '/dashboard/team' },
        { icon: Award, label: 'Achievements', href: '/dashboard/achievements' },
    ];

    return (
        <motion.aside
            initial={false}
            animate={{ width: isOpen ? 280 : 80 }}
            className="glass border-r border-white/10 p-6 flex flex-col h-screen sticky top-0"
        >
            <div className="flex items-center justify-between mb-8">
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-2"
                    >
                        <div className="p-2 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <span className="font-bold text-xl">GrowthEngine</span>
                    </motion.div>
                )}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                    {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            <nav className="flex-1 space-y-2">
                {navItems.map((item, i) => {
                    const isActive = pathname === item.href;
                    return (
                        <motion.button
                            key={i}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => router.push(item.href)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                ? 'bg-gradient-to-r from-primary-500/20 to-accent-500/20 text-white border border-primary-500/20'
                                : 'hover:bg-white/5 text-white/60'
                                }`}
                        >
                            <item.icon className={`w-5 h-5 ${isActive ? 'text-primary-400' : ''}`} />
                            {isOpen && <span className={isActive ? 'font-medium' : ''}>{item.label}</span>}
                        </motion.button>
                    );
                })}
            </nav>

            <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 hover:bg-red-500/10 rounded-xl transition-colors text-red-400 mt-auto"
            >
                <LogOut className="w-5 h-5" />
                {isOpen && <span>Logout</span>}
            </button>
        </motion.aside>
    );
};
