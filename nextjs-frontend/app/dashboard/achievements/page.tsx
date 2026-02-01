'use client';
import { Card } from '@/components/ui/Card';
import { Award } from 'lucide-react';

export default function AchievementsPage() {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Achievements</h1>
            <div className="grid md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <Card key={i} className="flex flex-col items-center text-center p-6">
                        <div className="p-4 bg-yellow-500/20 rounded-full mb-4">
                            <Award className="w-8 h-8 text-yellow-500" />
                        </div>
                        <h3 className="font-bold text-lg mb-1">Early Adopter</h3>
                        <p className="text-sm text-white/60">Joined the platform during beta.</p>
                    </Card>
                ))}
            </div>
        </div>
    );
}
