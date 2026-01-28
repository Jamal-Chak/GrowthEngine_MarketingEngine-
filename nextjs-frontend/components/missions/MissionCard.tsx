import { CheckCircle2, Circle, Clock, Target, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { fadeInUp } from '@/lib/animations';

interface MissionStep {
    description: string;
    completed: boolean;
    xpReward?: number;
}

interface MissionCardProps {
    mission: {
        id: string;
        title: string;
        description: string;
        category: string;
        steps: MissionStep[];
        xpReward: number;
        estimatedTime: string;
        impactLevel: 'foundation' | 'low' | 'medium' | 'high';
        completed: boolean;
    };
    onClick?: () => void;
}

const IMPACT_COLORS = {
    foundation: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    low: 'text-gray-400 bg-gray-500/10 border-gray-500/20',
    medium: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
    high: 'text-primary-400 bg-primary-500/10 border-primary-500/20',
};

const CATEGORY_COLORS = {
    onboarding: 'bg-purple-500/20 text-purple-300',
    growth: 'bg-green-500/20 text-green-300',
    retention: 'bg-orange-500/20 text-orange-300',
    foundation: 'bg-blue-500/20 text-blue-300',
    custom: 'bg-gray-500/20 text-gray-300',
};

export function MissionCard({ mission, onClick }: MissionCardProps) {
    const completedSteps = mission.steps.filter(s => s.completed).length;
    const totalSteps = mission.steps.length;
    const progress = (completedSteps / totalSteps) * 100;

    return (
        <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            whileHover={{ scale: 1.02 }}
            onClick={onClick}
        >
            <Card className="cursor-pointer hover:border-primary-500/30 transition-all" hover={false}>
                <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <span className={`px-2 py-1 rounded-md text-xs font-medium ${CATEGORY_COLORS[mission.category as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS.custom}`}>
                                    {mission.category}
                                </span>
                                <span className={`px-2 py-1 rounded-md text-xs font-medium border ${IMPACT_COLORS[mission.impactLevel]}`}>
                                    {mission.impactLevel} impact
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-1">
                                {mission.title}
                            </h3>
                            <p className="text-white/60 text-sm">
                                {mission.description}
                            </p>
                        </div>

                        {mission.completed ? (
                            <div className="p-2 bg-success-500/20 rounded-lg">
                                <CheckCircle2 className="w-6 h-6 text-success-400" />
                            </div>
                        ) : (
                            <div className="p-2 bg-white/5 rounded-lg">
                                <Target className="w-6 h-6 text-primary-400" />
                            </div>
                        )}
                    </div>

                    {/* Progress Bar */}
                    <div>
                        <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-white/60">
                                {completedSteps} of {totalSteps} steps completed
                            </span>
                            <span className="text-primary-400 font-medium">
                                {Math.round(progress)}%
                            </span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                            <motion.div
                                className="bg-gradient-to-r from-primary-500 to-accent-500 h-full rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.5, ease: 'easeOut' }}
                            />
                        </div>
                    </div>

                    {/* Steps Preview */}
                    <div className="space-y-2">
                        {mission.steps.slice(0, 3).map((step, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-2 text-sm"
                            >
                                {step.completed ? (
                                    <CheckCircle2 className="w-4 h-4 text-success-400 flex-shrink-0" />
                                ) : (
                                    <Circle className="w-4 h-4 text-white/30 flex-shrink-0" />
                                )}
                                <span className={step.completed ? 'text-white/40 line-through' : 'text-white/80'}>
                                    {step.description}
                                </span>
                            </div>
                        ))}
                        {mission.steps.length > 3 && (
                            <div className="text-xs text-white/40 pl-6">
                                +{mission.steps.length - 3} more steps
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-2 border-t border-white/10">
                        <div className="flex items-center gap-4 text-sm text-white/60">
                            <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{mission.estimatedTime}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <TrendingUp className="w-4 h-4 text-yellow-400" />
                                <span className="text-yellow-400 font-medium">{mission.xpReward} XP</span>
                            </div>
                        </div>

                        {!mission.completed && (
                            <button className="text-sm font-medium text-primary-400 hover:text-primary-300 transition-colors">
                                Continue →
                            </button>
                        )}
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}
