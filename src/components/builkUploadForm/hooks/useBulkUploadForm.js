import { useFileUpload } from "@/services/hooks/fileUpload";
import { useMemo } from "react";
import styles from "../styles/index.module.css";
const useBulkFileUpload = (module, onClose) => {
    const { fileUpload } = useFileUpload();
    const handleFormSubmit = async (formData) => {
        console.log("Form data received:", formData);

        await fileUpload.execute({
            url: module.uploadUrl || `${module.name.replace(/\s+/g, "-")}/upload`,
            payload: {
                file: formData.file,
                assetType: formData.assetType,
                checklistName: formData.checklistName,
            },
            options: {
                showNotification: true,
                onProgress: (percentage) => {
                    console.log(`Upload progress: ${percentage}%`);
                },
            },
            onSuccess: (data) => {
                console.log("Upload successful:", data);
                data && module.onSuccess?.();
                onClose && onClose();
            },
            onError: (error) => {
                console.error("Upload failed:", error);
                console.error("Server Error Detail:", error?.response?.data);
            },
        });
    };

    const formConfig = useMemo(
        () => [
            {
                type: "file",
                name: "file",
                multiple: false,
                label: (
                    <span className={styles.file_upload_label}>
                        <span>Upload Excel File</span> 
                        {/* <a href={`${process.env.REACT_APP_BACKEND_BASE_PATH}/api/v1/sample-excel/${module.name?.replace(" ", "-")}`}>Download sample file</a> */}
                    </span>
                ),
                grid: 1,
                validationRules: {
                    required: true,
                },
                accept: ["xls", "xlsx", "json"],
                validateOnChange: true,
            },
            ...(module.bulkUploadAdditionalFields ? module.bulkUploadAdditionalFields : []),
        ],
        []
    );
    return {
        formConfig,
        isLoading: fileUpload.isLoading,
        handleFormSubmit,
        formErrors: [],
        formSuccess: fileUpload.successMessage,
    };
};
export default useBulkFileUpload;
