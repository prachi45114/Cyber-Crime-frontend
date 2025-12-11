import constants from "./constants";
import { notifyError, notifySuccess } from "@/components/Notification";

class FormUtils {
    static validateField = (valueToValidate, validationRules = {}, field = {}, shouldNotify = false) => {
        const { type = "text", label = "Field" } = field;

        // Convert value to string for length checks, if it exists
        const stringValue = type === "text" ? valueToValidate?.toString() ?? "" : valueToValidate ?? "";

        // Normalize all rules
        const rules = {
            required: this.normalizeRule(validationRules.required, `${label} is required`),
            pattern: this.normalizeRule(validationRules.pattern, "Invalid format"),
            minLength: this.normalizeRule(validationRules.minLength, (value) => `Minimum length is ${value} characters`),
            maxLength: this.normalizeRule(validationRules.maxLength, (value) => `Maximum length is ${value} characters`),
            numeric: this.normalizeRule(validationRules.numeric, "Please enter a valid number"),
            min: this.normalizeRule(validationRules.min, (value) => `Minimum value is ${value}`),
            max: this.normalizeRule(validationRules.max, (value) => `Maximum value is ${value}`),
        };

        // Required check with notifyError
        if (rules.required?.value && (!valueToValidate || valueToValidate?.length === 0)) {
            if (shouldNotify) notifyError(rules.required.message);
            return rules.required.message;
        }

        // If value is empty and not required, skip other validations
        if (!valueToValidate && !rules.required?.value) {
            return null;
        }

        // Numeric check
        if (rules.numeric?.value) {
            const numValue = Number(valueToValidate);
            if (isNaN(numValue)) {
                return rules.numeric.message;
            }
        }

        // Min/Max checks for numbers
        if (type === "number" || rules.numeric?.value) {
            const numValue = Number(valueToValidate);

            if (rules.min && numValue < rules.min.value) {
                return typeof rules.min.message === "function" ? rules.min.message(rules.min.value) : rules.min.message;
            }

            if (rules.max && numValue > rules.max.value) {
                return typeof rules.max.message === "function" ? rules.max.message(rules.max.value) : rules.max.message;
            }
        }

        // Length checks
        if (rules.minLength && stringValue.length < rules.minLength.value) {
            return typeof rules.minLength.message === "function" ? rules.minLength.message(rules.minLength.value) : rules.minLength.message;
        }

        if (rules.maxLength && stringValue.length > rules.maxLength.value) {
            return typeof rules.maxLength.message === "function" ? rules.maxLength.message(rules.maxLength.value) : rules.maxLength.message;
        }

        // Pattern validation
        if (rules.pattern) {
            const regex = new RegExp(rules.pattern.value);
            if (!regex.test(valueToValidate)) {
                return rules.pattern.message;
            }
        } else if (constants.VALIDATION_PATTERNS[type]) {
            // Built-in pattern validation for specific types
            if (!constants.VALIDATION_PATTERNS[type].test(valueToValidate)) {
                return `Please enter a valid ${type}`;
            }
        }

        return null;
    };
    static normalizeRule = (rule, defaultMessage) => {
        if (rule === undefined || rule === null) return null;

        if (typeof rule === "object") {
            return {
                value: rule.value,
                message: rule.message || defaultMessage,
            };
        }

        return {
            value: rule,
            message: defaultMessage,
        };
    };

    static transformErrors = (errors = []) => {
        if (!Array.isArray(errors)) {
            return {};
        }
        return errors?.reduce((acc, { message, path }) => {
            const key = path[0];
            acc[key] = message;
            return acc;
        }, {});
    };
}

export default FormUtils;
