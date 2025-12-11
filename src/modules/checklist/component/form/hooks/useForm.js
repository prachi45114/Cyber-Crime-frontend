import { useMemo } from "react";
import { useChecklist } from "@/services/context/checklist";

export const useChecklistInfoForm = (data = {}, onSuccess) => {
    const { checklistCreation, checklistUpdating } = useChecklist();
    const formConfig = useMemo(
        () => [
            {
                type: "text",
                name: "checklistName",
                label: "Checklist Name",
                placeholder: "Checklist name",
                grid: 2,
                defaultValue: data?.["Checklist Name"]?.value,
            },
            {
                type: "text",
                name: "checklistItem",
                label: "Checklist Item",
                placeholder: "Checklist Item",
                grid: 2,
                defaultValue: data?.["Checklist Item"]?.value,
                validationRules: {
                    required: true,
                },
            },
            {
                type: "text",
                name: "category",
                label: "Checklist Category",
                placeholder: "Checklist Category",
                grid: 2,
                defaultValue: data?.["Category"]?.value,
            },         
            {
                type: "select",
                name: "assetType",
                label: "Asset Type",
                placeholder: "Asset Type",
                grid: 2,
                defaultValue: data?.["Asset Type"]?.originalValue,                 
                options: [
                    { label: "Web Application", value: "web_application" },
                    { label: "Mobile Application", value: "mobile_application" },
                    { label: "Thick Client", value: "thick_client" },
                ],
                validationRules: {
                    required: true,
                },
            },
            {
                type: "textarea",
                name: "description",
                label: "Description",
                placeholder: "Description",
                grid: 2,
                defaultValue: data?.["Description"]?.value,               
            },
            {
                type: "checkbox", 
                name: "isEnabled", 
                label: "IsEnabled",  
                grid: 2, 
                defaultValue: data?.Enabled?.originalValue,
            },
        ],
        [data]
    );

    const operation = data?.ID?.value ? checklistUpdating : checklistCreation;
    console.log("Show me the operation details", data);
    const handleFormSubmit = (formData) => {
        console.log("Handle the data and see is this calling or not", formData); 
        operation?.execute({
            ...(data?.ID?.value && { id: data.ID.value }),
            payload: formData,
            onSuccess: onSuccess,
            options: { showNotification: true },
        });
    };

    return { formConfig, handleFormSubmit, isLoading: operation?.isLoading, checklistInfoFormErrors: operation?.errorMessages };
};
