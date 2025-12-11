import React from "react";
import styles from "./styles/index.module.css";
import useBulkFileUpload from "./hooks/useBulkUploadForm";
import DynamicForm from "../form";
import GlobalUtils from "@/lib/utils/GlobalUtils";

const BulkUploadForm = ({ onCancel, module = { name: "checklist", uploadUrl: "" } }) => {
    const { formConfig, isLoading, handleFormSubmit, formErrors, formSuccess } = useBulkFileUpload(module, onCancel);

    return (
        <div className={styles.container}>
            <DynamicForm
                key={"bulk-file-upload"}
                formId="bulk-file"
                formData={formConfig}
                onSubmit={handleFormSubmit}
                responseErrors={formErrors}
                formButtons={GlobalUtils.getFormButtons(isLoading, module.onCancel)}
            />
            {formSuccess?.errorResponse && <div className={styles.error_container}>{JSON.stringify(formSuccess?.errorResponse)}</div>}
        </div>
    );
};

export default BulkUploadForm;
