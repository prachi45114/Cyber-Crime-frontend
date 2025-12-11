import React, { useState, useEffect } from "react";
import styles from "./index.module.css";
import DynamicForm from "@/components/form";
import ICON from "../../utils/icon";

const TableFilter = ({ data, initialValues, router, searchParams }) => {
    const [formValues, setFormValues] = useState(initialValues);
    const [isBodyVisible, setIsBodyVisible] = useState(false);

    const setQueryParam = async (key, value) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value !== "" && value != undefined && value != null && value != "undefined" && value != "null") {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        params.set("page", "1");
        router.replace(`?${params.toString()}`);
    };

    const getFormData = (data) => {
        return data.filterFields?.map((item) =>
            data.filterOnSubmit
                ? { ...item, clearOption: true, defaultValue: formValues?.[item.name] }
                : {
                      ...item,
                      clearOption: true,
                      customOnChange:async (event) => {
                          const { name, value } = event.target;
                          console.log("event.target",event.target)
                          setFormValues((prev) => ({ ...prev, [name]: value }));
                          console.log(name, value);
                          await setQueryParam(name, value);
                      },
                    //   defaultValue: item.name === "dateRange" ? formValues?.[item.name]?.split("-") || item.defaultValue : formValues?.[item.name],
                    defaultValue:
                        item.name === "dateRange" && formValues?.[item.name]
                            ? formValues[item.name].split("-").map((d) => new Date(d))
                            : item.defaultValue,

                  }
        );
    };

    useEffect(() => {
        data.filterFields?.forEach((item) => {
            if (item.defaultValue) {
                setQueryParam(item.name, Array.isArray(item.defaultValue) ? item.defaultValue.join("-") : item.defaultValue);
            }
        });
    }, []);

    const getFormButtons = (data) => {
        if (!data.filterOnSubmit) {
            return [];
        }

        const initialButtons = [
            {
                label: "Apply Filters",
                type: "Submit",
            },
            {
                label: "Clear Filter",
                type: "button",
                variant: "secondary",
                onClick: () => {
                    setFormValues({});
                    router.replace(window.location.pathname);
                },
            },
        ];

        const updatedInitialButtons = initialButtons.map((button) => {
            const matchingButton = data.filterActionButtons?.find((actionButton) => actionButton.type === button.type);
            return matchingButton ? { type: button.type === "clear" ? "button" : button.type, label: matchingButton.label, ...matchingButton } : button;
        });

        const additionalButtons = data.filterActionButtons?.filter((actionButton) => actionButton.type !== "Submit" && actionButton.type !== "clear") || [];

        return [...updatedInitialButtons, ...additionalButtons];
    };

    return (
        <div className={styles.container}>
            <div className={styles.heading}>
                <h2>{data.title || "Filters"}</h2>
                <div className={styles.filters_icon} onClick={() => setIsBodyVisible((prev) => !prev)}>
                    {ICON.FILTERS}
                </div>
            </div>
            <div className={`${styles.body} ${isBodyVisible ? styles.show : ""}`}>
                <DynamicForm
                    onSubmit={(formData) => {
                        console.log(formData);
                        const params = new URLSearchParams();
                        Object.entries(formData).forEach(([key, value]) => {
                            if (value) params.set(key, value);
                        });
                        params.set("page", "1");
                        router.replace(`?${params.toString()}`);
                        setFormValues(formData);
                    }}
                    formData={getFormData(data)}
                    formButtons={getFormButtons(data)}
                />
            </div>
        </div>
    );
};

export default TableFilter;
