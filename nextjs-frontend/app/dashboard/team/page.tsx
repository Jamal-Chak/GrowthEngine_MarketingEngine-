'use client';
import { Card } from '@/components/ui/Card';

export default function TeamPage() {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Team Management</h1>
            <Card>
                <div className="text-center py-12">
                    <h3 className="text-xl font-medium mb-2">Invite your team</h3>
                    <p className="text-white/60 mb-6">Collaborate with your colleagues to grow faster.</p>
                    <button className="btn-primary">Invite Member</button>
                </div>
            </Card>
        </div>
    );
}
