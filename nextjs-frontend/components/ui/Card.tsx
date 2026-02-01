import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
    hover?: boolean;
    delay?: number;
    onClick?: () => void;
}

export const Card = ({ children, className = '', hover = true, delay = 0, onClick }: CardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            whileHover={hover ? { scale: 1.02 } : undefined}
            onClick={onClick}
            className={`glass rounded-xl p-6 ${hover ? 'glass-hover cursor-pointer' : ''} ${className}`}
        >
            {children}
        </motion.div>
    );
};
