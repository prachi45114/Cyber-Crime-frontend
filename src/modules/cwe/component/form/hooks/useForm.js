import { useMemo } from "react";
import { useCwe } from "@/services/context/cwe";

export const useCweInfoForm = (data = {}, onSuccess) => {
    const { cweCreation, cweUpdating } = useCwe();
    const formConfig = useMemo(
        () => [
            {
                type: "text",
                name: "id",
                label: "CWE ID",
                placeholder: "CWE ID",
                grid: 2,
                defaultValue: data?.CWEId?.originalValue, 
            },
            {
                type: "text",
                name: "name",
                label: "CWE Name",
                placeholder: "CWE Name",
                grid: 2,
                defaultValue: data?.["CWE Name"]?.value,
            },
            {
                type: "checkbox", 
                name: "isEnabled", 
                label: "IsEnabled",  
                grid: 2, 
                defaultValue: data?.Enabled?.originalValue,
            },
            {
                type: "textarea",
                name: "description",
                label: "Description",
                placeholder: "Description",
                grid: 1,
                defaultValue: data?.["Description"]?.value,               
            },
           
        ],
        [data]
    );

    // console.log("show me the form ID that why it is coming", data); 

    const operation = data?.CWEId?.originalValue ? cweUpdating : cweCreation;
    // console.log("Show me the operation details", data.ID.value);
    const handleFormSubmit = (formData) => {
        console.log("Handle the data and see is this calling or not", formData); 
        operation?.execute({
            ...(data?.CWEId?.originalValue && { id: data?.CWEId?.originalValue }),
            payload: formData,
            onSuccess: onSuccess,
            options: { showNotification: true },
        });
    };

    return { formConfig, handleFormSubmit, isLoading: operation?.isLoading, cweInfoFormErrors: [] };
};
