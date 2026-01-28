import { motion } from 'framer-motion';

interface ProgressBarProps {
    current: number;
    max: number;
    label?: string;
    showPercentage?: boolean;
    color?: 'primary' | 'success' | 'warning' | 'accent';
    size?: 'sm' | 'md' | 'lg';
    animated?: boolean;
}

const COLORS = {
    primary: 'from-primary-500 to-primary-600',
    success: 'from-success-500 to-success-600',
    warning: 'from-warning-500 to-warning-600',
    accent: 'from-accent-500 to-accent-600',
};

const SIZES = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
};

export function ProgressBar({
    current,
    max,
    label,
    showPercentage = true,
    color = 'primary',
    size = 'md',
    animated = true,
}: ProgressBarProps) {
    const percentage = Math.min((current / max) * 100, 100);

    return (
        <div className="w-full">
            {/* Label */}
            {(label || showPercentage) && (
                <div className="flex items-center justify-between mb-2 text-sm">
                    {label && <span className="text-white/80">{label}</span>}
                    {showPercentage && (
                        <span className="text-white/60 font-medium">
                            {Math.round(percentage)}%
                        </span>
                    )}
                </div>
            )}

            {/* Progress Bar */}
            <div className={`w-full bg-white/10 rounded-full overflow-hidden ${SIZES[size]}`}>
                <motion.div
                    className={`${SIZES[size]} bg-gradient-to-r ${COLORS[color]} rounded-full relative overflow-hidden`}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{
                        duration: animated ? 0.8 : 0,
                        ease: 'easeOut',
                    }}
                >
                    {/* Shimmer effect */}
                    {animated && percentage > 0 && percentage < 100 && (
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                            animate={{
                                x: ['-100%', '200%'],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: 'linear',
                            }}
                        />
                    )}
                </motion.div>
            </div>

            {/* Values */}
            {!showPercentage && (
                <div className="flex items-center justify-between mt-1 text-xs text-white/50">
                    <span>{current.toLocaleString()}</span>
                    <span>{max.toLocaleString()}</span>
                </div>
            )}
        </div>
    );
}
