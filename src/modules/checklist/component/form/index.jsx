import DynamicForm from "@/components/form";
import { useChecklistInfoForm } from "./hooks/useForm";
import GlobalUtils from "@/lib/utils/GlobalUtils";
import styles from "./styles/index.module.css";
export const ChecklistInfoForm = ({ data, onCancel, onSuccess }) => {
    const { formConfig, handleFormSubmit, isLoading, checklistInfoFormErrors } = useChecklistInfoForm(data, onSuccess);

    return (
        <div className={styles.container}>
            <DynamicForm
                key="checklist-form"
                formId="checklist-form"
                formData={formConfig}
                formButtons={GlobalUtils.getFormButtons(isLoading, onCancel)}
                onSubmit={handleFormSubmit}
                responseErrors={checklistInfoFormErrors}
            />
        </div>
    );
};
