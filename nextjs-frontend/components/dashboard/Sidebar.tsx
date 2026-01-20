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
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
    const router = useRouter();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    const navItems = [
        { icon: BarChart3, label: 'Dashboard', active: true },
        { icon: Target, label: 'Missions' },
        { icon: Users, label: 'Team' },
        { icon: Award, label: 'Achievements' },
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
                {navItems.map((item, i) => (
                    <motion.button
                        key={i}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${item.active
                            ? 'bg-gradient-to-r from-primary-500/20 to-accent-500/20 text-white'
                            : 'hover:bg-white/5 text-white/60'
                            }`}
                    >
                        <item.icon className="w-5 h-5" />
                        {isOpen && <span>{item.label}</span>}
                    </motion.button>
                ))}
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
