import { useCallback, useEffect, useState } from "react";
import FormUtils from "../utils";
import { Country, State, City } from "country-state-city";

export const useFormHandler = (formData, validate = null) => {
    const [formValues, setFormValues] = useState({});
    const [maskedValues, setMaskedValues] = useState({});
    const [previewUrl, setPreviewUrl] = useState(null);
    const [fieldVisibility, setFieldVisibility] = useState({});
    const [dynamicOptions, setDynamicOptions] = useState({});
    const [customFieldState, setCustomFieldState] = useState({});
    const [dynamicGroups, setDynamicGroups] = useState({});
    const [removingGroups, setRemovingGroups] = useState({});
    var [groupPreviewUrls, setGroupPreviewUrls] = useState({});
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (!formData) return;
        setFormValues({});
        setErrors({});
        // Initialize dynamic groups for fields that have group configurations
        const initialDynamicGroups = formData.reduce((acc, field) => {
            if (field.groupFields) {
                acc[field.name] = field?.defaultGroups || [{}];
            }
            return acc;
        }, {});

        // Helper function to initialize form values
        const initialValues = formData.reduce((acc, field) => {
            if (field.type === "select" && field.multiple) {
                acc[field.name] = field.defaultValue || [];
            } else if (field?.groupFields) {
                acc[field.name] = (field?.defaultGroups || [])?.map((item) =>
                    item?.reduce((innerAcc, innerField) => {
                        innerAcc[innerField.name] = innerField.defaultValue;
                        return innerAcc;
                    }, {})
                );
            } else {
                acc[field.name] = field.defaultValue;
            }
            return acc;
        }, {});

        // Helper function to initialize masked values
        const initialMaskedValues = formData.reduce((acc, field) => {
            acc[field.name] = field.maskedValue || field.defaultValue || "";
            return acc;
        }, {});

        // Helper function to initialize custom field state
        const initialCustomFieldState = formData.reduce((acc, field) => {
            if (field.allowCustom) {
                acc[field.name] = { isCustom: field?.defaultValue ? (field.options?.some((option) => option.value === field.defaultValue) ? false : true) : false };
            }
            return acc;
        }, {});

        setDynamicGroups(initialDynamicGroups);
        setFormValues((prevValues) => ({
            ...prevValues,
            ...initialValues,
        }));

        setMaskedValues((prevValues) => ({
            ...prevValues,
            ...initialMaskedValues,
        }));
        setCustomFieldState(initialCustomFieldState);
    }, [formData]);

    useEffect(() => {
        formData.forEach((field) => {
            if (field.type === "select" && field.dynamicOptions) {
                fetchDynamicOptions(field.name);
            }
            if (field.dependentField) {
                setFieldVisibility((prev) => ({
                    ...prev,
                    [field.name]: formValues[field.dependentField] === field.dependentValue,
                }));
            }
            if (field.dependentField) {
                if (field.propertiesToBeModified) {
                    field.propertiesToBeModified.forEach((property) => {
                        field[property.key] = field.dependentValue?.includes(formValues[field.dependentField]) ? property.modifiedValue : property.originalValue;
                    });
                } else {
                    setFieldVisibility((prev) => ({
                        ...prev,
                        [field.name]: field.dependentValue?.includes(formValues[field.dependentField]),
                    }));
                }
            }
        });
    }, [formValues, formData]);

    const fetchDynamicOptions = (fieldName) => {
        let options = [];

        switch (fieldName) {
            case "state":
                options = State.getStatesOfCountry(formValues?.country?.split("_")[1] || "IN").map((states) => ({ label: states.name, value: `${states.name}_${states.isoCode}` }));
                break;
            case "city":
                options = City.getCitiesOfState(formValues?.country?.split("_")[1] || "IN", formValues?.state?.split("_")[1] || "BR").map((states) => ({
                    label: states.name,
                    value: `${states.name}_${states.isoCode}`,
                }));
                break;
        }
        setDynamicOptions((prevOptions) => ({
            ...prevOptions,
            [fieldName]: options,
        }));
    };

    const handleInputChange = useCallback(
        (event, groupIndex, fieldName, uploadFunction) => {
            const { name, value, type, files } = event.target;
            // Determine the field value based on input type
            const fieldValue = type === "checkbox" ? event.target.checked : type === "file" ? files[0] : type == "number" ? parseInt(value) : value;

            const updateFieldValues = (prevValues) => {
                // Handle file uploads
                if (type === "file") {
                    return prevValues;
                }
                // Handle group inputs for non-file types
                if (fieldName && groupIndex !== undefined) {
                    const currentFieldValues = prevValues[fieldName] || [];
                    const updatedFieldValues = [...currentFieldValues];

                    updatedFieldValues[groupIndex] = {
                        ...(updatedFieldValues[groupIndex] || {}),
                        [name]: fieldValue,
                    };

                    return {
                        ...prevValues,
                        [fieldName]: updatedFieldValues,
                    };
                }
                // Handle standard input changes
                return {
                    ...prevValues,
                    [name]: fieldValue,
                };
            };

            setFormValues((prevValues) => updateFieldValues(prevValues));
            if (type !== "file") {
                setMaskedValues((prevValues) => updateFieldValues(prevValues));
            }

            // Handle file uploads asynchronously
            if (type === "file" && fieldValue && ["image/jpeg", "image/png", "application/pdf"].includes(fieldValue.type)) {
                const objectUrl = URL.createObjectURL(fieldValue);

                (async () => {
                    try {
                        const uploadedFile = uploadFunction ? await uploadFunction(fieldValue) : fieldValue;

                        if (fieldName && groupIndex !== undefined) {
                            setGroupPreviewUrls((prev) => ({
                                ...prev,
                                [name]: {
                                    ...(prev[name] || {}),
                                    [groupIndex]: {
                                        file: uploadedFile,
                                        preview: objectUrl,
                                        fileName: fieldValue.name,
                                    },
                                },
                            }));

                            setFormValues((prevValues) => {
                                const currentFieldValues = prevValues[fieldName] || [];
                                const updatedFieldValues = [...currentFieldValues];

                                updatedFieldValues[groupIndex] = {
                                    ...(updatedFieldValues[groupIndex] || {}),
                                    [name]: uploadedFile,
                                };

                                return {
                                    ...prevValues,
                                    [fieldName]: updatedFieldValues,
                                };
                            });
                        } else {
                            setPreviewUrl({
                                file: uploadedFile,
                                preview: objectUrl,
                                fileName: fieldValue.name,
                            });

                            setFormValues((prevValues) => ({
                                ...prevValues,
                                [name]: uploadedFile,
                            }));
                        }
                    } catch (error) {
                        console.error("File upload error:", error);
                    }
                })();
            }

            // Handle custom field state for "other" option
            if (!customFieldState[name]?.isCustom && value === "other") {
                setCustomFieldState((prevState) => ({
                    ...prevState,
                    [name]: { isCustom: true },
                }));
            } else if (value !== "other") {
                setCustomFieldState((prevState) => ({
                    ...prevState,
                    [name]: { isCustom: false },
                }));
            }

            // Handle dependent fields and dynamic options
            formData.forEach((field) => {
                // Check for fields dependent on the current input
                if (field.dependentField === name) {
                    if (field.propertiesToBeModified) {
                        field.propertiesToBeModified.forEach((property) => {
                            field[property.key] = field.dependentValue?.includes(fieldValue) ? property.modifiedValue : property.originalValue;
                        });
                    } else {
                        setFieldVisibility((prev) => ({
                            ...prev,
                            [field.name]: field.dependentValue?.includes(fieldValue),
                        }));
                    }
                }

                // Fetch dynamic options for dependent fields
                if (field.dynamicOptions && field.dynamicOptions.dependentOn === name) {
                    fetchDynamicOptions(field.name, field.dynamicOptions);
                }
            });

            // Clean up object URL for file uploads
            return () => {
                if (type === "file") {
                    if (fieldName && groupIndex !== undefined) {
                        groupPreviewUrls = groupPreviewUrls[name];
                        if (groupPreviewUrls && groupPreviewUrls[groupIndex]) {
                            URL.revokeObjectURL(groupPreviewUrls[groupIndex]);
                        }
                    } else {
                        previewUrl && URL.revokeObjectURL(previewUrl);
                    }
                }
            };
        },
        [formData, formValues, groupPreviewUrls, previewUrl, customFieldState]
    );

    const handleLabelClick = (name) => {
        setCustomFieldState((prevState) => ({
            ...prevState,
            [name]: { isCustom: false },
        }));
    };

    // New function to add a group of fields
    const addGroup = useCallback((fieldName) => {
        setDynamicGroups((prevGroups) => ({
            ...prevGroups,
            [fieldName]: [...(prevGroups[fieldName] || []), {}],
        }));
    }, []);

    // New function to delete a group of fields
    const deleteGroup = useCallback((fieldName, indexToRemove) => {
        // First, mark the group for removal
        setRemovingGroups((prev) => ({
            ...prev,
            [fieldName]: {
                ...prev[fieldName],
                [indexToRemove]: true,
            },
        }));

        // Wait for animation to complete before actually removing the group
        setTimeout(() => {
            setDynamicGroups((prevGroups) => {
                const updatedGroups = prevGroups[fieldName].filter((_, index) => index !== indexToRemove);
                return {
                    ...prevGroups,
                    [fieldName]: updatedGroups.length > 0 ? updatedGroups : [{}],
                };
            });

            // Remove the group from form values
            setFormValues((prevValues) => {
                const updatedValues = { ...prevValues };
                if (updatedValues[fieldName]) {
                    updatedValues[fieldName] = updatedValues[fieldName].filter((_, index) => index !== indexToRemove);
                }
                return updatedValues;
            });

            // Clear the removal tracking
            setRemovingGroups((prev) => {
                const updated = { ...prev };
                if (updated[fieldName]) {
                    delete updated[fieldName][indexToRemove];
                }
                return updated;
            });
        }, 300); // Match the CSS transition duration
    }, []);

    const validateFieldsOnSubmit = async (customFormValues = null) => {
        // Use custom values if provided (for DOM-synced values), otherwise use formValues
        const valuesToValidate = customFormValues || formValues;
        
        const fieldsValidationRules = formData
            .map((field) => {
                // Get value from custom values, formValues, or try to read from DOM as fallback
                let valueToValidate = valuesToValidate?.[field.name];
                
                // If value is still empty and field has a name, try to read from DOM
                if ((!valueToValidate || valueToValidate === '') && field.name && typeof document !== 'undefined') {
                    try {
                        const domInput = document.querySelector(`[name="${field.name}"]`);
                        if (domInput && domInput.value) {
                            valueToValidate = domInput.value;
                        }
                    } catch (e) {
                        // Ignore DOM read errors
                    }
                }
                
                return {
                    validationRules: field.validationRules || {},
                    formField: { label: field.label, type: field.type, name: field.name },
                    valueToValidate: valueToValidate,
                    customValidation: field.customValidation,
                };
            })
            .filter((field) => field.validationRules || field.customValidation);

        const errors = {};

        for (const rules of fieldsValidationRules) {
            const { valueToValidate, validationRules, formField, customValidation } = rules;

            let validationError = FormUtils.validateField(valueToValidate, validationRules, formField, true);

            if (!validationError && customValidation) {
                validationError = customValidation(valueToValidate);
            }
            if (validationError) {
                errors[formField.name] = validationError;
            }
        }

        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    return {
        formValues,
        setFormValues,
        maskedValues,
        setMaskedValues,
        fieldVisibility,
        setFieldVisibility,
        dynamicOptions,
        setDynamicOptions,
        customFieldState,
        setCustomFieldState,
        dynamicGroups,
        setDynamicGroups,
        removingGroups,
        setRemovingGroups,
        handleInputChange,
        fetchDynamicOptions,
        groupPreviewUrls,
        setGroupPreviewUrls,
        previewUrl,
        setPreviewUrl,
        handleLabelClick,
        addGroup,
        deleteGroup,
        errors,
        setErrors,
        validateFieldsOnSubmit,
    };
};
