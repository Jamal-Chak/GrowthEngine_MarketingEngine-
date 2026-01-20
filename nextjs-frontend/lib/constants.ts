import { Sparkles, Target, TrendingUp, Award } from 'lucide-react';

export const MOCK_STATS = [
    { label: 'Total XP', value: 2450, icon: Sparkles, color: 'from-purple-500 to-pink-500', change: '+12%' },
    { label: 'Active Missions', value: 3, icon: Target, color: 'from-blue-500 to-cyan-500', change: '+3' },
    { label: 'Completion Rate', value: '87%', icon: TrendingUp, color: 'from-green-500 to-emerald-500', change: '+5%' },
    { label: 'Team Rank', value: '#1', icon: Award, color: 'from-orange-500 to-red-500', change: '↑2' },
];

export const MOCK_CHART_DATA = [
    { name: 'Mon', value: 400 },
    { name: 'Tue', value: 300 },
    { name: 'Wed', value: 600 },
    { name: 'Thu', value: 800 },
    { name: 'Fri', value: 500 },
    { name: 'Sat', value: 700 },
    { name: 'Sun', value: 900 },
];

export const MOCK_RECOMMENDATIONS = [
    {
        type: 'Growth Mission',
        reason: 'Low engagement detected',
        impactScore: 8,
    },
    {
        type: 'Optimization',
        reason: 'Improve conversion rate',
        impactScore: 9,
    },
    {
        type: 'New Feature',
        reason: 'Try out the new analytics',
        impactScore: 7,
    }
];

export const MOCK_MISSIONS = [
    {
        title: 'Complete Onboarding',
        totalSteps: 5,
        completedSteps: 3,
        completed: false,
    },
    {
        title: 'Invite Team Members',
        totalSteps: 3,
        completedSteps: 1,
        completed: false,
    },
    {
        title: 'Set up Analytics',
        totalSteps: 4,
        completedSteps: 4,
        completed: true,
    }
];
