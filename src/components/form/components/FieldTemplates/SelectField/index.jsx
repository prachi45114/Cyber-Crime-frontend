import React, { useState, useEffect } from "react";
import styles from "./index.module.css";
import CustomSelect from "../../SelectFieldType/Select";
import "../../../styles/root.css";
import FormUtils from "@/components/form/utils";
import apiClient from "@/services/api/config";

const SelectField = ({
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
        optionsUrl,
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
    const [options, setOptions] = useState(formField.options || []);

    // Update value when prop changes
    useEffect(() => {
        setInputValue(value);
    }, [value]);

    useEffect(() => {
        if (formField.options) {
            setOptions(formField.options);
        }
    }, [formField.options]);

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

    const fetchOptionData = () => {
        apiClient
            .get(optionsUrl.url)
            .then((response) => {
                // console.log(response);
                setOptions(response.data?.data?.map((data) => ({ value: data?.[optionsUrl.valueKey || "_id"], label: optionsUrl.getDynamicLabel?.(data) || data?.[optionsUrl.labelKey || "name"] })));
            })
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        if (optionsUrl) {
            fetchOptionData();
        }
    }, [optionsUrl]);

    return (
        <div className={formGroupClasses} style={style}>
            <div className={styles.inputWrapper}>
                {label && (
                    <label htmlFor={id} className={`dark:text-white ${labelClasses}`} style={labelStyle}>
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

export default React.memo(SelectField);
