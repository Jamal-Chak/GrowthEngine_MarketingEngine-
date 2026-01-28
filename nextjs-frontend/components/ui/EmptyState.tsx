import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
    icon?: LucideIcon;
    title: string;
    description: string;
    action?: {
        label: string;
        onClick: () => void;
        icon?: ReactNode;
    };
    secondaryAction?: {
        label: string;
        onClick: () => void;
    };
}

export function EmptyState({
    icon: Icon,
    title,
    description,
    action,
    secondaryAction
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            {Icon && (
                <div className="mb-4 p-6 bg-white/5 rounded-full">
                    <Icon className="w-12 h-12 text-white/40" />
                </div>
            )}

            <h3 className="text-2xl font-bold mb-2 text-white">
                {title}
            </h3>

            <p className="text-white/60 mb-6 max-w-md">
                {description}
            </p>

            {action && (
                <div className="flex gap-3">
                    <Button
                        onClick={action.onClick}
                        icon={action.icon}
                    >
                        {action.label}
                    </Button>

                    {secondaryAction && (
                        <Button
                            onClick={secondaryAction.onClick}
                            variant="ghost"
                        >
                            {secondaryAction.label}
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}
