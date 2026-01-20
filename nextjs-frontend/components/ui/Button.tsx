import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

interface ButtonProps extends HTMLMotionProps<"button"> {
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'ghost';
    isLoading?: boolean;
    className?: string;
    icon?: ReactNode;
}

export const Button = ({
    children,
    variant = 'primary',
    isLoading = false,
    className = '',
    icon,
    ...props
}: ButtonProps) => {
    const baseStyles = "flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-gradient-to-r from-primary-500 to-accent-500 shadow-lg shadow-primary-500/50 hover:shadow-xl hover:shadow-primary-500/70 text-white",
        secondary: "glass glass-hover text-white",
        ghost: "hover:bg-white/10 text-white/60 hover:text-white"
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`${baseStyles} ${variants[variant]} ${className}`}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading ? (
                <>
                    <motion.div
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <span className="sr-only">Loading...</span>
                </>
            ) : (
                <>
                    {icon}
                    {children}
                </>
            )}
        </motion.button>
    );
};
