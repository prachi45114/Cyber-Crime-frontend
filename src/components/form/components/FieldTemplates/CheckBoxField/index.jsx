import React, { useState, useCallback, useEffect } from "react";
import { ICON } from "@/components/form/utils/icons";
import styles from "./index.module.css";

const CheckBoxField = ({ formField, formValues, error }) => {
    const { id, name, label, required, onChange, disabled, readonly, style, className } = formField;
    const [isChecked, setIsChecked] = useState(formValues?.[name] || false);
    // console.log(formValues, name);

    const handleChange = useCallback(
        (e) => {
            if (readonly) return;

            const newValue = !isChecked;
            setIsChecked(newValue);

            if (onChange) {
                onChange({
                    target: {
                        name,
                        value: newValue,
                    },
                });
            }
        },
        [isChecked, onChange, readonly, name]
    );

    const containerClassName = [styles.container, disabled && styles.disabled, error && styles.error, className].filter(Boolean).join(" ");

    useEffect(() => {
        setIsChecked(formValues?.[name] || false);
    }, [formValues?.[name]]);

    return (
        <div className={containerClassName} style={style?.formGroup}>
            <div className={styles.checkboxWrapper}>
                <input type="checkbox" id={id} name={name} checked={isChecked} onChange={handleChange} disabled={disabled} readOnly={readonly} className={styles.hiddenInput} aria-label={label} />

                <label
                    className={`${styles.iconWrapper} `}
                    htmlFor={id}
                    tabIndex={disabled ? -1 : 0}
                    onKeyPress={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            handleChange(e);
                        }
                    }}
                >
                    {isChecked ? <span className={styles.active}>{ICON.FILL_CHECKBOX}</span> : <span>{ICON.EMPTY_CHECKBOX}</span>}
                </label>

                <label htmlFor={id} className={`${styles.label} dark:!text-white`}>
                    {label}
                    {required && <span className={styles.required}>*</span>}
                </label>
            </div>

            {error && <div className={styles.errorMessage}>{error}</div>}
        </div>
    );
};

export default React.memo(CheckBoxField);
