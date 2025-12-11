"use client";
import React, { useEffect } from "react";
import ButtonGroup from "./components/ButtonGroup";
import { ICON } from "./utils/icons";
import styles from "./styles/DynamicForm.module.css";
import { useFormHandler } from "./hooks/useFormHandler";
import CheckBoxField from "./components/FieldTemplates/CheckBoxField";
import RadioField from "./components/FieldTemplates/RadioField";
import TextAreaField from "./components/FieldTemplates/TextAreaField";
import FileUploadField from "./components/FieldTemplates/FileUploadField";
import InputField from "./components/FieldTemplates/InputField";
// import DatePickerField from "./components/FieldTemplates/DatePickerField";
import DateRangeField from "./components/FieldTemplates/dateRangeField";
import SelectField from "./components/FieldTemplates/SelectField";
import RowHeaderField from "./components/FieldTemplates/RowHeaderField";
import Button from "./components/FieldTemplates/ButtonField";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import "./styles/root.css";
import CustomSelectField from "./components/FieldTemplates/CustomSelectField";
import FormUtils from "./utils";
import Divider from "./components/FieldTemplates/DividerField";
import { CircleX, Plus } from "lucide-react";

const DynamicForm = ({ formData, onSubmit, formButtons, formId = "main", responseErrors }) => {
    const {
        formValues,
        maskedValues,
        fieldVisibility,
        dynamicOptions,
        customFieldState,
        dynamicGroups,
        removingGroups,
        handleInputChange,
        groupPreviewUrls,
        setGroupPreviewUrls,
        previewUrl,
        setPreviewUrl,
        handleLabelClick,
        addGroup,
        deleteGroup,
        setFormValues,
        errors,
        setErrors,
        validateFieldsOnSubmit,
    } = useFormHandler(formData);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!onSubmit || formButtons?.[0]?.loading) return;
        
        // Before validation, sync all input values from DOM to React state
        // This ensures autofilled values are captured
        const form = event.target.closest('form');
        const syncedValues = { ...formValues };
        let needsSync = false;
        
        if (form) {
            formData.forEach((field) => {
                if (field.type !== 'file' && !field.groupFields && field.name) {
                    const input = form.querySelector(`[name="${field.name}"]`);
                    if (input) {
                        const domValue = input.value || '';
                        const reactValue = formValues[field.name];
                        
                        // Sync if:
                        // 1. DOM has a value but React state is empty/undefined/null
                        // 2. DOM value differs from React state value
                        if (domValue && (!reactValue || domValue !== reactValue)) {
                            syncedValues[field.name] = domValue;
                            needsSync = true;
                            
                            // Trigger onChange to update React state immediately
                            const syncEvent = {
                                target: {
                                    name: field.name,
                                    value: domValue,
                                    type: input.type || field.type,
                                },
                                currentTarget: input,
                                preventDefault: () => {},
                                stopPropagation: () => {},
                            };
                            handleInputChange(syncEvent);
                        }
                    }
                }
            });
        }
        
        // If we synced values, wait a moment for state to update, then validate with synced values
        // Otherwise validate with current formValues
        if (needsSync) {
            // Wait for state update
            await new Promise(resolve => setTimeout(resolve, 50));
            // Validate with synced values as fallback
            if (await validateFieldsOnSubmit(syncedValues)) {
                // Submit with synced values
                onSubmit(syncedValues);
            }
        } else {
            // Normal validation flow
            if (await validateFieldsOnSubmit()) {
                onSubmit(formValues);
            }
        }
    };

    const getGridClass = (gridValue) => {
        const gridClasses = {
            1: styles.col1,
            2: styles.colMd2,
            3: styles.colMd3,
            4: styles.colMd4,
            6: styles.colMd6,
            8: styles.colMd8,
            12: styles.colMd12,
        };
        return gridClasses[gridValue] || styles.colMd12;
    };

    useEffect(() => {
        setErrors(FormUtils.transformErrors(responseErrors));
    }, [responseErrors]);

    return (
        <form className={styles.form_container} onSubmit={handleSubmit} id={`form-${formId}`}>
            <div className={`${styles.row} ${styles.container}`}>
                {formData.map((field, index) => {
                    return (
                        (!field.dependentField || fieldVisibility[field.name] || field.propertiesToBeModified) && (
                            <div
                                key={index}
                                className={`${getGridClass(12 / field.grid)} ${styles.inputWrapper} ${field?.groupWithIcon ? styles.withIcon : ""} ${field.isHidden ? styles.displayNone : ""}`}
                            >
                                {renderFormField(field)}
                                {field?.groupWithIcon && (
                                    <button onClick={field?.groupWithIcon?.handler} className={styles.iconButton} type="button">
                                        {field?.groupWithIcon?.icon ? field?.groupWithIcon.icon : ICON.SEARCH}
                                    </button>
                                )}
                            </div>
                        )
                    );
                })}
            </div>
            {formButtons && <ButtonGroup buttons={formButtons} />}
        </form>
    );

    function renderFormField(field) {
        const { type, name, label, placeholder, required, style, disabled = false, allowCustom = false, readonly = false, info_text = null, groupFields = null, grid } = field;

        const id = name + formId;

        if (groupFields) {
            const groups = dynamicGroups[name] || [{}];
            return (
                <div className={`${styles.formGroup} ${type}`}>
                    <label className={styles.groupLabel}>
                        {label} {required && <span style={{ color: "red" }}>&nbsp;*</span>}
                    </label>
                    {groups.map((group, groupIndex) => {
                        const isRemoving = removingGroups[name]?.[groupIndex];
                        return (
                            <div key={groupIndex} className={`${styles.dynamicGroup} ${isRemoving ? styles.slideOut : ""}`}>
                                {/* Render group fields */}
                                <div className={styles.row}>
                                    {groupFields.map((groupField, fieldIndex) => (
                                        <div key={fieldIndex} className={getGridClass(12 / field.grid)}>
                                            {renderOriginalField({
                                                ...groupField,
                                                groupFields,
                                                field,
                                                groupFieldName: name,
                                                groupIndex,
                                                onChangeHandler: (event) => handleInputChange(event, groupIndex, field.name, groupField.type === "file" ? groupField.uploadFunction : undefined),
                                                groupFieldDefaultValue: formValues[field.name]?.[groupIndex]?.[groupField.name] || "",
                                            })}
                                        </div>
                                    ))}
                                </div>

                                {/* Delete group button (prevent deletion if only one group) */}
                                {groups.length > 1 && (
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            deleteGroup(field.name, groupIndex);
                                        }}
                                        className="absolute top-3 right-1 !rounded-full"
                                    >
                                        <CircleX className="w-4 h-4" />
                                    </button>
                                    // <Button
                                    //     icon={<CircleX className="w-4 h-4" />}
                                    //     variant="primary"
                                    //     className="absolute top-1 -right-1 !rounded-full"
                                    //     onClick={() => deleteGroup(field.name, groupIndex)}
                                    // ></Button>
                                )}
                            </div>
                        );
                    })}
                    {/* Add group button */}
                    <Button variant="primary" icon={<Plus className="h-4 w-4" />} className={`${styles.addMoreRow}`} onClick={() => addGroup(field.name)}>
                        <span>Add {field.label} Group</span>
                    </Button>
                </div>
            );
        }

        if (allowCustom && customFieldState[name]?.isCustom) {
            return (
                <InputField
                    field={field}
                    maskedValues={maskedValues}
                    formValues={formValues}
                    labelChild={
                        <span style={{ marginLeft: "10px", cursor: "pointer", color: "blue" }} onClick={() => handleLabelClick(name)}>
                            ( Back to Select )
                        </span>
                    }
                />
            );
        }

        return renderOriginalField(field);
    }

    function renderOriginalField(field) {
        field.onChange = field?.onChangeHandler || handleInputChange;
        field.groupIndex = field.groupIndex !== undefined ? field.groupIndex : undefined;
        field.id = field.name + formId + (field.groupIndex || "");
        field.fieldName = field.groupFields ? field.groupFieldName : field.name;

        switch (field.type) {
            case "select":
                return <SelectField formField={field} formValues={formValues} dynamicOptions={dynamicOptions} errors={errors} />;
            case "customSelect":
                return <CustomSelectField formField={field} formValues={formValues} dynamicOptions={dynamicOptions} errors={errors} />;
            case "checkbox":
                return <CheckBoxField formField={field} formValues={formValues} />;
            case "radio":
                return RadioField(field, formValues);
            case "textarea":
                return <TextAreaField formField={field} formValues={formValues} errors={errors} />;
            case "file":
                return <FileUploadField formField={field} formValues={formValues} groupPreviewUrls={groupPreviewUrls} previewUrl={previewUrl} errors={errors} />;
            case "rowHeader":
                return <RowHeaderField formField={field} />;
            case "divider":
                return <Divider />;
            case "dateRange":
                return <DateRangeField errors={errors} setErrors={setErrors} formField={field} formValues={formValues} maskedValues={maskedValues} />;
            default:
                return <InputField errors={errors} setErrors={setErrors} formField={field} formValues={formValues} maskedValues={maskedValues} />;
        }
    }
};

export default DynamicForm;
