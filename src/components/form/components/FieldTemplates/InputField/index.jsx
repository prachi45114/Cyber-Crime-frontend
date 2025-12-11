import React, { useState, useEffect, useRef } from "react";
import styles from "./index.module.css";
import "../../../styles/root.css";
import FormUtils from "@/components/form/utils";

const InputField = ({ formField, formValues, maskedValues, errors, ...restProps }) => {
    const {
        id,
        name,
        label,
        type = "text",
        placeholder = "",

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

        // custom styles
        style = {},
        inputStyle = {},
        labelStyle = {},

        // Additional content
        labelChild,
        contentChild,

        // New auto-suggestion props
        autoSuggestion = {
            initialData: [],
            autoSuggestionUrl: "",
            minChars: 2,
            maxSuggestions: 10,
            debounceMs: 300,
        },
    } = formField;
    // console.log(autoSuggestion);
    // Internal state
    const [inputValue, setInputValue] = useState(groupFieldDefaultValue || maskedValues?.[name] || value || "");
    const [error, setError] = useState("");
    const [touched, setTouched] = useState(false);

    // state for auto-suggestions
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);

    // Validation logic (moved up so it can be used in detectAutofill)
    const validateInput = React.useCallback((valueToValidate) => {
        let validationError = FormUtils.validateField(valueToValidate, validationRules, formField);
        if (!validationError && customValidation) {
            validationError = customValidation(valueToValidate);
        }
        setError(validationError || null);
        return !validationError;
    }, [validationRules, customValidation, formField]);

    // Refs
    const inputRef = useRef(null);
    const suggestionsRef = useRef(null);
    const debounceTimerRef = useRef(null);
    const autofillCheckTimerRef = useRef(null);
    const lastValueRef = useRef(inputValue);
    const onChangeRef = useRef(onChange);
    const customOnChangeRef = useRef(customOnChange);
    const validateInputRef = useRef(validateInput);
    const isUserTypingRef = useRef(false);

    // Keep refs in sync with props
    useEffect(() => {
        onChangeRef.current = onChange;
        customOnChangeRef.current = customOnChange;
        validateInputRef.current = validateInput;
    }, [onChange, customOnChange, validateInput]);

    // Function to detect and handle autofill
    const detectAutofill = React.useCallback(() => {
        if (!inputRef.current || isUserTypingRef.current) {
            isUserTypingRef.current = false;
            return;
        }
        
        const currentValue = inputRef.current.value;
        const lastKnownValue = lastValueRef.current;
        const currentInputValue = inputValue;
        
        // If the DOM value differs from our React state, it's likely autofill
        if (currentValue !== currentInputValue && currentValue !== lastKnownValue && currentValue) {
            // Update React state
            setInputValue(currentValue);
            lastValueRef.current = currentValue;
            
            // Trigger onChange event to update parent form state
            const syntheticEvent = {
                target: {
                    name: name,
                    value: currentValue,
                    type: type,
                },
                currentTarget: inputRef.current,
                preventDefault: () => {},
                stopPropagation: () => {},
            };
            
            // Call onChange to update form handler
            if (onChangeRef.current) {
                onChangeRef.current(syntheticEvent);
            }
            if (customOnChangeRef.current) {
                customOnChangeRef.current(syntheticEvent);
            }
            
            // Trigger validation
            if (validateOnBlur || validateOnChange) {
                validateInputRef.current(currentValue);
            }
        } else if (currentValue !== lastKnownValue) {
            // Update ref even if not autofill
            lastValueRef.current = currentValue;
        }
    }, [name, type, inputValue, validateOnBlur, validateOnChange]);

    // Detect autofill on multiple events
    useEffect(() => {
        const input = inputRef.current;
        if (!input) return;

        // Strategy 1: Listen for CSS animation (browsers trigger animation on autofill)
        const handleAnimationStart = (e) => {
            if (e.animationName === "onAutoFillStart") {
                // Delay to ensure autofill value is set
                setTimeout(() => {
                    detectAutofill();
                }, 10);
            }
        };

        // Strategy 2: Check on blur (most reliable for autofill)
        const handleBlurCheck = () => {
            // Small delay to ensure autofill has completed
            setTimeout(() => {
                detectAutofill();
            }, 50);
        };

        // Strategy 3: Check periodically when input is focused (for slow autofills)
        const startPeriodicCheck = () => {
            if (autofillCheckTimerRef.current) {
                clearInterval(autofillCheckTimerRef.current);
            }
            let checkCount = 0;
            const maxChecks = 10; // Check for 2 seconds max (10 * 200ms)
            
            autofillCheckTimerRef.current = setInterval(() => {
                checkCount++;
                detectAutofill();
                
                // Stop checking after max attempts
                if (checkCount >= maxChecks) {
                    stopPeriodicCheck();
                }
            }, 200);
        };

        const stopPeriodicCheck = () => {
            if (autofillCheckTimerRef.current) {
                clearInterval(autofillCheckTimerRef.current);
                autofillCheckTimerRef.current = null;
            }
        };

        // Strategy 4: Check on mouseup (when user clicks autofill suggestion)
        const handleMouseUp = () => {
            setTimeout(() => {
                detectAutofill();
            }, 100);
        };

        // Strategy 5: Check when input value changes (some browsers fire input event on autofill)
        // Note: We skip this for now as it can conflict with normal typing
        // The other strategies should catch autofill reliably

        // Add event listeners
        input.addEventListener("animationstart", handleAnimationStart);
        input.addEventListener("blur", handleBlurCheck);
        input.addEventListener("focus", startPeriodicCheck);
        input.addEventListener("mouseup", handleMouseUp);
        
        // Check on window focus (user might switch tabs and come back with autofilled data)
        const handleWindowFocus = () => {
            setTimeout(() => {
                if (document.activeElement === input || document.querySelector(`#${id}`) === input) {
                    detectAutofill();
                }
            }, 100);
        };
        
        window.addEventListener("focus", handleWindowFocus);

        // Initial check after mount (for pre-filled forms)
        const initialCheck = setTimeout(() => {
            detectAutofill();
        }, 300);

        return () => {
            input.removeEventListener("animationstart", handleAnimationStart);
            input.removeEventListener("blur", handleBlurCheck);
            input.removeEventListener("focus", startPeriodicCheck);
            input.removeEventListener("mouseup", handleMouseUp);
            window.removeEventListener("focus", handleWindowFocus);
            stopPeriodicCheck();
            clearTimeout(initialCheck);
        };
    }, [id, detectAutofill]);

    // Update lastValueRef when inputValue changes through normal flow
    useEffect(() => {
        lastValueRef.current = inputValue;
    }, [inputValue]);

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target) && inputRef.current && !inputRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (autoSuggestion.initialData?.length > 0) {
            setSuggestions(autoSuggestion.initialData);
        }
    }, [autoSuggestion.initialData]);

    // Update value when prop changes
    useEffect(() => {
        if (value !== undefined) {
            setInputValue(value);
        }
    }, [value]);

    useEffect(() => {
        if (errors?.[name]) {
            setError(errors[name]);
            setTouched(true);
        }
    }, [errors?.[name]]);

    useEffect(() => {
        setInputValue(defaultValue);
    }, [defaultValue]);

    // Fetch suggestions
    const fetchSuggestions = async (searchText) => {
        if (!searchText || searchText.length < autoSuggestion.minChars) {
            setSuggestions(autoSuggestion.initialData || []);
            return;
        }

        if (!autoSuggestion.autoSuggestionUrl) {
            const filteredSuggestions = (autoSuggestion.initialData || []).filter((item) => item.toLowerCase().includes(searchText.toLowerCase())).slice(0, autoSuggestion.maxSuggestions);
            setSuggestions(filteredSuggestions);
            return;
        }

        try {
            setIsLoading(true);
            const response = await fetch(`${autoSuggestion.autoSuggestionUrl}?text=${encodeURIComponent(searchText)}`);
            if (!response.ok) throw new Error("Failed to fetch suggestions");
            const data = await response.json();
            setSuggestions(data.slice(0, autoSuggestion.maxSuggestions));
        } catch (error) {
            console.error("Error fetching suggestions:", error);
            setSuggestions([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Debounced fetch
    const debouncedFetch = (searchText) => {
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        debounceTimerRef.current = setTimeout(() => {
            fetchSuggestions(searchText);
        }, autoSuggestion.debounceMs);
    };

    // Event handlers
    const handleChange = (e) => {
        // Mark that user is typing (not autofill)
        isUserTypingRef.current = true;
        const newValue = e.target.value;
        setInputValue(newValue);
        lastValueRef.current = newValue;
        setShowSuggestions(true);
        setSelectedIndex(-1);

        if (validateOnChange) {
            validateInput(newValue);
        }

        debouncedFetch(newValue);

        if (onChange) onChange(e);
        if (customOnChange) customOnChange(e);
        
        // Reset flag after a short delay
        setTimeout(() => {
            isUserTypingRef.current = false;
        }, 100);
    };

    const handleBlur = (e) => {
        setTouched(true);

        if (validateOnBlur) {
            validateInput(e.target.value);
        }

        if (onBlur) {
            onBlur(e);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setInputValue(suggestion);
        setShowSuggestions(false);
        setSelectedIndex(-1);

        // Trigger validation
        if (validateOnChange) {
            validateInput(suggestion);
        }

        // Simulate change event
        const simulatedEvent = {
            target: { value: suggestion, name },
            currentTarget: inputRef.current,
        };
        if (onChange) onChange(simulatedEvent);
        if (customOnChange) customOnChange(simulatedEvent);
    };

    const handleKeyDown = (e) => {
        if (!showSuggestions || suggestions.length === 0) return;

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
                break;
            case "ArrowUp":
                e.preventDefault();
                setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
                break;
            case "Enter":
                e.preventDefault();
                if (selectedIndex >= 0) {
                    handleSuggestionClick(suggestions[selectedIndex]);
                }
                break;
            case "Escape":
                setShowSuggestions(false);
                setSelectedIndex(-1);
                break;
            default:
                break;
        }
    };

    // Class names
    const formGroupClasses = `
        ${styles.formGroup}
        ${type ? styles[type] : ""}
        ${className}
        ${touched && error ? styles.hasError : ""}
    `.trim();

    const labelClasses = `
        ${styles.label}
        ${labelClassName}
    `.trim();

    return (
        <div className={formGroupClasses} style={style}>
            <div className={styles.inputWrapper} style={type === "hidden" ? { minHeight: "0px" } : {}}>
                {label && type != "hidden" && (
                    <label htmlFor={id} className={`dark:text-white ${labelClasses}`} style={labelStyle}>
                        {label}
                        {validationRules.required && <span className={styles.required}>*</span>}
                        {labelChild}
                    </label>
                )}
                <div className={styles.autoSuggestContainer}>
                    <input
                        ref={inputRef}
                        id={id}
                        type={type}
                        name={name}
                        value={inputValue}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        onKeyDown={handleKeyDown}
                        onFocus={() => setShowSuggestions(true)}
                        disabled={disabled}
                        readOnly={readOnly}
                        placeholder={placeholder}
                        className={`dark:bg-[#1e1e1e] dark:text-[#cccccc] dark:border-[#3e3e42] dark:placeholder:text-[#858585] dark:focus:border-orange-500 dark:focus:ring-orange-500/20 focus:border-orange-500 focus:ring-orange-500/20 ${styles.formControl} ${touched && error ? styles.inputError : ""}`}
                        style={inputStyle}
                        aria-invalid={!!error}
                        aria-describedby={error ? `${id}-error` : undefined}
                        aria-expanded={showSuggestions}
                        aria-controls={`${id}-suggestions`}
                        aria-autocomplete="list"
                        {...restProps}
                    />

                    {showSuggestions && suggestions.length > 0 && (
                        <ul ref={suggestionsRef} className={styles.suggestionsList} id={`${id}-suggestions`} role="listbox" aria-label="Suggestions">
                            {isLoading ? (
                                <li className={styles.suggestionsLoading}>Loading...</li>
                            ) : (
                                suggestions.map((suggestion, index) => (
                                    <li
                                        key={`${suggestion}-${index}`}
                                        role="option"
                                        aria-selected={index === selectedIndex}
                                        className={`${styles.suggestionItem} ${index === selectedIndex ? styles.selected : ""}`}
                                        onClick={() => handleSuggestionClick(suggestion)}
                                        onMouseEnter={() => setSelectedIndex(index)}
                                    >
                                        {suggestion}
                                    </li>
                                ))
                            )}
                        </ul>
                    )}
                </div>
                {contentChild}
            </div>

            {touched && error && (
                <div id={`${id}-error`} className={styles.errorText} role="alert">
                    {error}
                </div>
            )}

            {helperText && !error && <div className={styles.helperText}>{helperText}</div>}
            {infoText && <p className={styles.infoText}>{infoText}</p>}
        </div>
    );
};

export default React.memo(InputField);
