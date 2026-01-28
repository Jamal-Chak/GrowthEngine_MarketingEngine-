import { motion } from 'framer-motion';
import { ArrowUp, LucideIcon } from 'lucide-react';
import { Card } from '../ui/Card';

interface StatCardProps {
    label: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: string;
    delay?: number;
}

export const StatCard = ({ label, value, icon, trend, delay = 0 }: StatCardProps) => {
    return (
        <Card className="group" delay={delay}>
            <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-white/5 rounded-xl group-hover:scale-110 transition-transform">
                    {icon}
                </div>
                {trend && (
                    <span className="text-green-400 text-sm font-semibold flex items-center gap-1">
                        <ArrowUp className="w-4 h-4" />
                        {trend}
                    </span>
                )}
            </div>
            <div className="text-3xl font-bold mb-1">{value}</div>
            <div className="text-white/60 text-sm">{label}</div>
        </Card>
    );
};
