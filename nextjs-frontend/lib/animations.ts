// Centralized Framer Motion animation variants and presets

export const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
};

export const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
};

export const fadeInDown = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
};

export const slideInRight = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
};

export const slideInLeft = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
};

export const scaleIn = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
};

export const scaleInBounce = {
    initial: { opacity: 0, scale: 0.5 },
    animate: {
        opacity: 1,
        scale: 1,
        transition: {
            type: 'spring',
            bounce: 0.5,
            duration: 0.6,
        }
    },
    exit: { opacity: 0, scale: 0.5 },
};

// Transition presets
export const transitions = {
    fast: { duration: 0.15 },
    base: { duration: 0.2 },
    slow: { duration: 0.3 },
    spring: { type: 'spring', stiffness: 300, damping: 30 },
    springBouncy: { type: 'spring', stiffness: 400, damping: 20 },
};

// Stagger children animation
export const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.1,
        },
    },
};

export const staggerItem = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
};

// Card hover animations
export const cardHover = {
    rest: { scale: 1 },
    hover: {
        scale: 1.02,
        transition: { duration: 0.2 }
    },
};

// Button press animation
export const buttonTap = {
    whileTap: { scale: 0.95 },
};

// Success animation (for mission completion, etc.)
export const successPulse = {
    initial: { scale: 0 },
    animate: {
        scale: [0, 1.2, 1],
        transition: {
            duration: 0.6,
            times: [0, 0.6, 1],
            ease: 'easeOut',
        },
    },
};

// Loading spinner
export const spin = {
    animate: {
        rotate: 360,
        transition: {
            duration: 1,
            repeat: Infinity,
            ease: 'linear',
        },
    },
};

// Glow pulse animation
export const glowPulse = {
    animate: {
        opacity: [0.5, 1, 0.5],
        scale: [1, 1.05, 1],
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
        },
    },
};
