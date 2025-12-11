import DynamicForm from "@/components/form";
import { useCweInfoForm } from "./hooks/useForm";
import GlobalUtils from "@/lib/utils/GlobalUtils";
import styles from "./styles/index.module.css";
export const CweInfoForm = ({ data, onCancel, onSuccess }) => {
    const { formConfig, handleFormSubmit, isLoading, cweInfoFormErrors } = useCweInfoForm(data, onSuccess);

    return (
        <div className={styles.container}>
            <DynamicForm
                key="cwe-form"
                formId="cwe-form"
                formData={formConfig}
                formButtons={GlobalUtils.getFormButtons(isLoading, onCancel)}
                onSubmit={handleFormSubmit}
                responseErrors={cweInfoFormErrors}
            />
        </div>
    );
};
