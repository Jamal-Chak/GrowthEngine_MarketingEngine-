import { motion } from 'framer-motion';

interface BadgeProps {
    badge: {
        id: string;
        name: string;
        description: string;
        icon: string;
        rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
    };
    unlocked?: boolean;
    size?: 'sm' | 'md' | 'lg';
    showTooltip?: boolean;
}

const RARITY_COLORS = {
    common: 'from-gray-500 to-gray-600',
    uncommon: 'from-green-500 to-green-600',
    rare: 'from-blue-500 to-blue-600',
    epic: 'from-purple-500 to-purple-600',
    legendary: 'from-yellow-500 to-orange-600',
};

const RARITY_GLOW = {
    common: 'shadow-gray-500/50',
    uncommon: 'shadow-green-500/50',
    rare: 'shadow-blue-500/50',
    epic: 'shadow-purple-500/50',
    legendary: 'shadow-yellow-500/50',
};

const SIZES = {
    sm: 'w-12 h-12 text-2xl',
    md: 'w-16 h-16 text-3xl',
    lg: 'w-24 h-24 text-5xl',
};

export function Badge({ badge, unlocked = false, size = 'md', showTooltip = true }: BadgeProps) {
    return (
        <div className="relative group">
            <motion.div
                whileHover={{ scale: 1.1 }}
                className={`relative ${SIZES[size]} rounded-full bg-gradient-to-br ${unlocked ? RARITY_COLORS[badge.rarity] : 'from-gray-700 to-gray-800'
                    } flex items-center justify-center ${unlocked ? `shadow-xl ${RARITY_GLOW[badge.rarity]}` : 'opacity-40'
                    } transition-all cursor-pointer`}
            >
                <span className={unlocked ? '' : 'grayscale'}>
                    {badge.icon}
                </span>

                {!unlocked && (
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-white/60" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                    </div>
                )}
            </motion.div>

            {/* Tooltip */}
            {showTooltip && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    <div className="bg-gray-900 border border-white/20 rounded-lg p-3 min-w-[200px] shadow-xl">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">{badge.icon}</span>
                            <span className="font-bold text-white">{badge.name}</span>
                        </div>
                        <p className="text-xs text-white/60 mb-2">{badge.description}</p>
                        <div className="flex items-center justify-between">
                            <span className={`text-xs px-2 py-0.5 rounded-full bg-gradient-to-r ${RARITY_COLORS[badge.rarity]} text-white font-medium`}>
                                {badge.rarity}
                            </span>
                            {!unlocked && (
                                <span className="text-xs text-white/40">Locked</span>
                            )}
                        </div>
                    </div>
                    {/* Arrow */}
                    <div className="w-2 h-2 bg-gray-900 border-r border-b border-white/20 rotate-45 absolute top-full left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
            )}
        </div>
    );
}
