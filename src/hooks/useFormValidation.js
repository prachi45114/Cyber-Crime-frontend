import { useState, useCallback } from 'react';

// Validation rules
const VALIDATION_RULES = {
    required: (value) => {
        if (!value || (typeof value === 'string' && !value.trim())) {
            return 'This field is required';
        }
        return null;
    },
    email: (value) => {
        if (!value) return null; // Let required handle empty values
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            return 'Please enter a valid email address';
        }
        return null;
    },
    phone: (value) => {
        if (!value) return null; // Let required handle empty values
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
            return 'Please enter a valid phone number';
        }
        return null;
    },
    minLength: (min) => (value) => {
        if (!value) return null;
        if (value.length < min) {
            return `Must be at least ${min} characters long`;
        }
        return null;
    },
    maxLength: (max) => (value) => {
        if (!value) return null;
        if (value.length > max) {
            return `Must be no more than ${max} characters long`;
        }
        return null;
    },
    pattern: (regex, message) => (value) => {
        if (!value) return null;
        if (!regex.test(value)) {
            return message || 'Invalid format';
        }
        return null;
    }
};

export const useFormValidation = (initialValues = {}, validationSchema = {}) => {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isValidating, setIsValidating] = useState(false);

    // Validate a single field
    const validateField = useCallback((fieldName, value) => {
        const rules = validationSchema[fieldName];
        if (!rules) return null;

        for (const rule of rules) {
            let validator, errorMessage;
            
            if (typeof rule === 'function') {
                validator = rule;
            } else if (typeof rule === 'object') {
                validator = rule.validator;
                errorMessage = rule.message;
            } else if (typeof rule === 'string') {
                validator = VALIDATION_RULES[rule];
            }

            if (validator) {
                const result = validator(value);
                if (result) {
                    return errorMessage || result;
                }
            }
        }
        return null;
    }, [validationSchema]);

    // Validate all fields
    const validateForm = useCallback(() => {
        setIsValidating(true);
        const newErrors = {};
        let hasErrors = false;

        Object.keys(validationSchema).forEach(fieldName => {
            const fieldError = validateField(fieldName, values[fieldName]);
            if (fieldError) {
                newErrors[fieldName] = fieldError;
                hasErrors = true;
            }
        });

        setErrors(newErrors);
        setTouched(Object.keys(validationSchema).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
        setIsValidating(false);

        return !hasErrors;
    }, [values, validationSchema, validateField]);

    // Update field value
    const setValue = useCallback((fieldName, value) => {
        setValues(prev => ({ ...prev, [fieldName]: value }));
        
        // Clear error when user starts typing
        if (errors[fieldName]) {
            setErrors(prev => ({ ...prev, [fieldName]: null }));
        }
    }, [errors]);

    // Handle field blur
    const setFieldTouched = useCallback((fieldName) => {
        setTouched(prev => ({ ...prev, [fieldName]: true }));
        
        // Validate field on blur
        const fieldError = validateField(fieldName, values[fieldName]);
        if (fieldError) {
            setErrors(prev => ({ ...prev, [fieldName]: fieldError }));
        }
    }, [values, validateField]);

    // Reset form
    const resetForm = useCallback(() => {
        setValues(initialValues);
        setErrors({});
        setTouched({});
        setIsValidating(false);
    }, [initialValues]);

    // Check if form is valid
    const isFormValid = Object.keys(validationSchema).every(fieldName => !errors[fieldName]);

    // Get field error
    const getFieldError = useCallback((fieldName) => {
        return touched[fieldName] ? errors[fieldName] : null;
    }, [errors, touched]);

    // Check if field has error
    const hasFieldError = useCallback((fieldName) => {
        return touched[fieldName] && !!errors[fieldName];
    }, [errors, touched]);

    return {
        values,
        errors,
        touched,
        isValidating,
        isFormValid,
        setValue,
        setFieldTouched,
        validateField,
        validateForm,
        resetForm,
        getFieldError,
        hasFieldError,
        setValues,
        setErrors,
        setTouched
    };
};

// Validation schemas for common use cases
export const VALIDATION_SCHEMAS = {
    contact: {
        contactName: ['required', { validator: VALIDATION_RULES.minLength(2), message: 'Name must be at least 2 characters' }],
        contactEmail: ['required', 'email'],
        contactPhone: ['phone'],
        notes: [{ validator: VALIDATION_RULES.maxLength(500), message: 'Notes must be less than 500 characters' }]
    },
    asset: {
        name: ['required', { validator: VALIDATION_RULES.minLength(2), message: 'Asset name must be at least 2 characters' }],
        description: [{ validator: VALIDATION_RULES.maxLength(1000), message: 'Description must be less than 1000 characters' }]
    }
};

export default useFormValidation;
