import React, { useState, useEffect } from "react";
import { formatInTimeZone } from "date-fns-tz";
// import "rsuite/dist/rsuite.min.css";
// import { DateRangePicker } from "rsuite";
import styles from "./index.module.css";
import "../../../styles/root.css";

const DateRangeField = ({ formField, formValues, errors, ...restProps }) => {
    const {
        id,
        name = ["startDate", "endDate"],
        label,
        required = false,
        validationRules = {},
        customValidation,
        validateOnChange = false,
        validateOnBlur = true,
        disabled = false,
        readOnly = false,
        helperText,
        infoText,
        className = "",
        labelClassName = "",
        style = {},
        inputStyle = {},
        labelStyle = {},
        onChange,
        customOnChange,
        format,
        defaultValue = [],
    } = formField;

    const [dateRange, setDateRange] = useState({
        startDateTime: formValues?.[name[0]] || undefined,
        endDateTime: formValues?.[name[1]] || undefined,
    });
    const [error, setError] = useState("");
    const [touched, setTouched] = useState(false);

    useEffect(() => {
        if (errors?.[name[0]] || errors?.[name[1]]) {
            setError(errors[name[0]] || errors[name[1]]);
            setTouched(true);
        }
    }, [errors]);

    useEffect(() => {
        if (defaultValue && defaultValue.length === 2) {
            setDateRange({
                startDateTime: new Date(defaultValue[0]),
                endDateTime: new Date(defaultValue[1]),
            });
        }
    }, [defaultValue]);

    // const handleDateChange = (range) => {
    //     // console.log("first", range);
    //     // if (range) {
    //     const [startDate, endDate] = range || [null, null];
    //     console.log(startDate, endDate);
    //     setDateRange({
    //         startDateTime: startDate,
    //         endDateTime: endDate,
    //     });
    //     if (validateOnChange) {
    //         validateInput(startDate);
    //         validateInput(endDate);
    //     }
    //     if (onChange) {
    //         onChange({
    //             target: {
    //                 value: startDate,
    //                 name: name[0],
    //             },
    //         });
    //         onChange({
    //             target: {
    //                 value: endDate,
    //                 name: name[1],
    //             },
    //         });
    //     }
    //     if (customOnChange) {
    //         customOnChange({
    //             target: {
    //                 value: range ? range.join("-") : "",
    //                 name: name,
    //             },
    //         });
    //         // await customOnChange({
    //         //     target: {
    //         //         value: endDate,
    //         //         name: name[1],
    //         //     },
    //         // });
    //     }

    //     console.log("Selected Date Range:", {
    //         startDate: formatDate(startDate),
    //         endDate: formatDate(endDate),
    //     });
    //     // }
    // };

    // const formatDate = (date) => {
    //     return date ? formatInTimeZone(date, "UTC", "yyyy-MM-dd'T'HH:mm:ss.SSSX") : null;
    // };

    const handleDateChange = (range) => {
        const [startDate, endDate] = range || [null, null];
        setDateRange({
            startDateTime: startDate,
            endDateTime: endDate,
        });

        const formattedStart = formatDate(startDate);
        const formattedEnd = formatDate(endDate);

        if (validateOnChange) {
            validateInput();
        }

        if (onChange) {
            onChange({ target: { value: formattedStart, name: name[0] } });
            onChange({ target: { value: formattedEnd, name: name[1] } });
        }

        if (customOnChange) {
            const customName = Array.isArray(name) ? name.join("-") : name;

            // ✅ Check if both dates are valid before calling customOnChange
            if (startDate && endDate) {
                customOnChange({
                    target: {
                        value: `${formattedStart}-${formattedEnd}`,
                        name: customName,
                    },
                });
            } else {
                // If both dates are cleared, send empty value or null
                customOnChange({
                    target: {
                        value: "",
                        name: customName,
                    },
                });
            }
        }

        console.log("Selected Date Range:", {
            startDate: formattedStart,
            endDate: formattedEnd,
        });
    };

    const formatDate = (date) => {
        return date ? formatInTimeZone(date, "UTC", "yyyy-MM-dd'T'HH:mm:ssXXX") : null;
    };

    const validateInput = () => {
        let validationError = "";
        if (required && (!dateRange.startDateTime || !dateRange.endDateTime)) {
            validationError = "Date range is required.";
        }
        if (!validationError && customValidation) {
            validationError = customValidation(dateRange);
        }
        setError(validationError || null);
        return !validationError;
    };

    const handleBlur = () => {
        setTouched(true);
        if (validateOnBlur) {
            validateInput();
        }
    };

    return (
        <div className={`${styles.formGroup} ${className} ${touched && error ? styles.hasError : ""}`} style={style}>
            {label && (
                <label htmlFor={id} className={`${styles.label} ${labelClassName}`} style={labelStyle}>
                    {label}
                    {required && <span className={styles.required}>*</span>}
                </label>
            )}
            <div className={styles.inputWrapper}>
                <DateRangePicker
                    format={format || "dd/MM/yyyy"}
                    value={[dateRange.startDateTime || false, dateRange.endDateTime || false].filter(Boolean)}
                    onChange={handleDateChange}
                    onBlur={handleBlur}
                    disabled={disabled}
                    readOnly={readOnly}
                    className={`${styles.formControl} ${touched && error ? styles.inputError : ""}`}
                    style={inputStyle}
                    {...restProps}
                />
            </div>
            {touched && error && (
                <div className={styles.errorText} role="alert">
                    {error}
                </div>
            )}
            {helperText && !error && <div className={styles.helperText}>{helperText}</div>}
            {infoText && <p className={styles.infoText}>{infoText}</p>}
        </div>
    );
};

export default React.memo(DateRangeField);
