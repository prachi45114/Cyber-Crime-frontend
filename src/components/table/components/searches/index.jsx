import React, { useState } from "react";
import styles from "./index.module.css";
import SelectField from "@/components/form/components/FieldTemplates/SelectField";
import Button from "@/components/form/components/FieldTemplates/ButtonField";
import { TableIcon } from "../../utils/icon";
import DynamicForm from "@/components/form";

const TableSearch = ({ showDataViewButton, dataView, setDataView, data, initialValues, router, searchParams, checkboxState }) => {
    const [formValues, setFormValues] = useState(initialValues);
    const setQueryParam = (key, value) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        params.set("page", "1");
        router.replace(`?${params.toString()}`);
    };
    const generateOptions = (limitConfig) => {
        const options = [];
        const start = parseInt(limitConfig?.limitStart || 10, 10);
        const end = parseInt(limitConfig?.limitEnd || 50, 10);
        const step = parseInt(limitConfig?.multipleOf || 10, 10);

        for (let i = start; i <= end; i += step) {
            options.push({ label: i.toString(), value: i.toString() });
        }

        return options;
    };

    const getFormData = (data) => {
        return data.filters?.map((item) => ({
            ...item,
            clearOption: true,
            customOnChange: (event) => {
                const { name, value } = event.target;
                setFormValues((prev) => ({ ...prev, [name]: value }));
                setQueryParam(name, value);
                item.customOnChange?.(event);
            },
            defaultValue: formValues?.[item.name],
            inputStyle: { paddingBlock: "0.65rem", marginTop: "0.1rem" },
        }));
    };

    return (
        <div className={styles.container}>
            <div className="">
                {data?.tableHeader?.limit && (
                    <SelectField
                        formField={{
                            id: "limit",
                            name: "limit",
                            options: generateOptions(data?.tableHeader?.limit),
                            defaultValue: formValues?.["limit"] || data?.tableHeader?.limit?.defaultValue || "10",
                            onChange: (event) => {
                                const { name, value } = event.target;
                                setFormValues((prev) => ({ ...prev, [name]: value }));
                                setQueryParam(name, value);
                            },
                        }}
                    />
                )}
                {data?.bulkActions && (
                    <SelectField
                        formField={{
                            id: data.bulkActions.id,
                            name: data.bulkActions.name,
                            options: data.bulkActions.options, //l options combined
                            onChange: (val) =>
                                data.bulkActions.onChange(
                                    val?.target?.value || "",
                                    Object.entries(checkboxState || [])
                                        .filter(([key, value]) => value === true && key)
                                        .map((item) => item[0])
                                ),
                            placeholder: data.bulkActions.placeholder,
                            className: "min-w-[200px]",
                        }}
                    />
                )}
            </div>

            <div>
                <DynamicForm formData={getFormData(data?.tableHeader)} formButtons={[]} />
                <div className="flex gap-2">
                    {/* {data?.bulkActions?.map((action) => (
                        <SelectField
                            key={action.name}
                            formField={{
                                id: action.id || action.name,
                                name: action.name,
                                options: action.options,
                                onChange: action.onChange,
                                placeholder: action.placeholder || "",
                                // clearOption: action.clearOption,
                                // inputStyle: action.inputStyle,
                            }}
                        />
                    ))} */}

                    {data?.tableHeader?.actionButtons?.map((button) => (
                        <Button
                            key={button.label}
                            onClick={button.onClick}
                            variant={button.variant}
                            flat={button.flat}
                            className={`${styles?.[button.label?.toLowerCase()]} ${button.className}`}
                            icon={button.icon}
                            href={button.href}
                            target={button.target}
                            tonal={button.tonal}
                            outlined={button.outlined}
                        >
                            {button.label}
                        </Button>
                    ))}

                    {showDataViewButton && (
                        <Button
                            key={"data-view"}
                            onClick={() => {
                                setDataView((prev) => {
                                    if (prev.table) {
                                        return { kanban: true };
                                    } else {
                                        return { table: true, kanban: false };
                                    }
                                });
                            }}
                            tonal={true}
                            icon={dataView.table ? TableIcon.KANBAN : TableIcon.TABLE}
                            iconOnly={true}
                            tooltip={dataView.table ? "Kanban View" : "Table View"}
                        >
                            {dataView.table ? "Kanban View" : "Table View"}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TableSearch;
