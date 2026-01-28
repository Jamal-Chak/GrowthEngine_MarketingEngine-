// Validation utilities for forms

export const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

export const validatePassword = (password: string): {
    isValid: boolean;
    errors: string[];
} => {
    const errors: string[] = [];

    if (password.length < 8) {
        errors.push('Password must be at least 8 characters');
    }
    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
        errors.push('Password must contain at least one number');
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
};

export const getPasswordStrength = (password: string): {
    strength: 'weak' | 'medium' | 'strong' | 'very-strong';
    score: number;
} => {
    let score = 0;

    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return { strength: 'weak', score };
    if (score <= 4) return { strength: 'medium', score };
    if (score <= 5) return { strength: 'strong', score };
    return { strength: 'very-strong', score };
};

export const validateField = (
    value: string,
    rules: {
        required?: boolean;
        minLength?: number;
        maxLength?: number;
        pattern?: RegExp;
        custom?: (value: string) => boolean;
    }
): { isValid: boolean; error?: string } => {
    if (rules.required && !value.trim()) {
        return { isValid: false, error: 'This field is required' };
    }

    if (rules.minLength && value.length < rules.minLength) {
        return { isValid: false, error: `Minimum ${rules.minLength} characters required` };
    }

    if (rules.maxLength && value.length > rules.maxLength) {
        return { isValid: false, error: `Maximum ${rules.maxLength} characters allowed` };
    }

    if (rules.pattern && !rules.pattern.test(value)) {
        return { isValid: false, error: 'Invalid format' };
    }

    if (rules.custom && !rules.custom(value)) {
        return { isValid: false, error: 'Invalid value' };
    }

    return { isValid: true };
};
