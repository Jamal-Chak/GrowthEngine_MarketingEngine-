import { InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    icon?: ReactNode;
    error?: string;
}

export const Input = ({ label, icon, error, className = '', ...props }: InputProps) => {
    return (
        <div className="space-y-2">
            {label && (
                <label className="block text-sm font-medium text-white/80">
                    {label}
                </label>
            )}
            <div className="relative">
                {icon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
                        {icon}
                    </div>
                )}
                <input
                    className={`w-full px-4 py-3 glass rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all duration-300 placeholder-white/40 ${icon ? 'pl-12' : ''} ${className}`}
                    {...props}
                />
            </div>
            {error && (
                <p className="text-sm text-red-400 mt-1">{error}</p>
            )}
        </div>
    );
};
