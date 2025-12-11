import React from "react";
import styles from "./index.module.css";

const CustomSelect = ({ name, formValues, handleSelectChange, options = [], multiple = false, disabled = false, error = null, value }) => {
    // Use controlled value from props or form values
    const selectedValues = value || formValues[name] || (multiple ? [] : "");

    const handleOptionClick = (optionValue) => {
        if (disabled) return;

        let newValue;
        if (multiple) {
            // For multiple selection, toggle values in array
            newValue = Array.isArray(selectedValues) ? (selectedValues.includes(optionValue) ? selectedValues.filter((val) => val !== optionValue) : [...selectedValues, optionValue]) : [optionValue];
        } else {
            // For single selection, just use the value
            newValue = optionValue;
        }

        handleSelectChange({
            target: {
                name,
                value: newValue,
            },
        });
    };

    const isSelected = (optionValue) => {
        if (multiple) {
            return Array.isArray(selectedValues) && selectedValues.includes(optionValue);
        }
        return selectedValues === optionValue;
    };

    return (
        <div className={styles.container}>
            {options.map((option, index) => (
                <div key={option.value || index} onClick={() => handleOptionClick(option.value)} className={`${styles.option} ${disabled ? styles.disabled : ""}`}>
                    <div style={{ border: error ? "2px solid var(--error-color)" : "" }} className={`${styles.icon_container} ${isSelected(option.value) ? styles.active : ""}`} id={option.value}>
                        {option.icon || option.label}
                    </div>
                    <label className={styles.label} htmlFor={option.value}>
                        {option.label}
                    </label>
                </div>
            ))}
        </div>
    );
};

export default CustomSelect;
