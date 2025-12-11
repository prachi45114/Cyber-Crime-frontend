import React, { useState, useEffect } from "react";
import styles from "./index.module.css";
import CustomSelect from "./components/ThemeSelect/index";
import "../../../styles/root.css";
import FormUtils from "@/components/form/utils";

const CustomSelectField = ({
    // Base props
    formField,
    formValues,
    dynamicOptions,
    errors,
    ...restProps
}) => {
    const {
        id,
        name,
        label,
        options,
        type = "text",
        multiple,
        placeholder = "",
        clearOption = false,

        // Form handling
        value,
        defaultValue,
        groupFieldDefaultValue,
        onChange,
        customOnChange,
        onBlur,

        // Validation
        required = false,
        requiredInfo,
        validationRules = {},
        customValidation,
        validateOnChange = false,
        validateOnBlur = true,

        // State
        disabled = false,
        readOnly = false,

        // UI Elements
        helperText,
        infoText,
        className = "",
        labelClassName = "",

        // Custom styling
        style = {},
        inputStyle = {},
        labelStyle = {},

        // Additional content
        labelChild,
        contentChild,
    } = formField;
    // Internal state
    const [inputValue, setInputValue] = useState(groupFieldDefaultValue || defaultValue || value || "");
    const [error, setError] = useState("");
    const [touched, setTouched] = useState(false);

    // Update value when prop changes
    useEffect(() => {
        setInputValue(value);
    }, [value]);

    useEffect(() => {
        if (errors?.[name]) {
            setError(errors[name]);
            setTouched(true);
        }
    }, [errors?.[name]]);

    // Validation logic
    const validateInput = (valueToValidate) => {
        let validationError = FormUtils.validateField(valueToValidate, validationRules, formField);
        // console.log("validationError", validationError);
        if (!validationError && customValidation) {
            validationError = customValidation(valueToValidate);
        }
        setError(validationError || null);
        return !validationError;
    };

    // Class names
    const formGroupClasses = `
    ${styles.formGroup}
    ${type ? styles[type] : ""}
    ${className}
    ${error ? styles.hasError : ""}
  `.trim();

    const labelClasses = `
    ${styles.label}
    ${labelClassName}
    ${error ? styles.inputError : ""}
  `.trim();

    return (
        <div className={formGroupClasses} style={style}>
            <div className={styles.inputWrapper}>
                {label && (
                    <label htmlFor={id} className={labelClasses} style={labelStyle}>
                        {label}
                        {validationRules.required && <span className={styles.required}>*</span>}
                        {labelChild}
                    </label>
                )}
                <CustomSelect
                    id={id}
                    formValues={formValues}
                    name={name}
                    value={inputValue}
                    handleSelectChange={(event) => {
                        onChange(event);
                        customOnChange && customOnChange(event);
                        validateInput(event.target.value);
                    }}
                    options={dynamicOptions?.[name] || options}
                    disabled={disabled}
                    readOnly={readOnly}
                    multiple={multiple}
                    placeholder={placeholder}
                    classNames={[`${styles.formControl}`]}
                    style={inputStyle}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${id}-error` : undefined}
                    error={error}
                    type={type}
                    clearOption={clearOption}
                    {...restProps}
                />

                {contentChild}
            </div>

            {error && (
                <div id={`${id}-error`} className={styles.errorText} role="alert">
                    {error}
                </div>
            )}

            {helperText && !error && <div className={styles.helperText}>{helperText}</div>}

            {infoText && <p className={styles.infoText}>{infoText}</p>}
        </div>
    );
};

export default React.memo(CustomSelectField);
