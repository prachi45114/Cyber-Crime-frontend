import DynamicForm from "@/components/form";
import { useProjectInfoForm } from "./hooks/useForm";
import GlobalUtils from "@/lib/utils/GlobalUtils";
import styles from "./styles/index.module.css";
export const ProjectInfoForm = ({ data, onCancel, onSuccess }) => {
    const { formConfig, handleFormSubmit, isLoading, ProjectInfoFormErrors } = useProjectInfoForm(data, onSuccess);

    return (
        <div>
            <DynamicForm
                key="project-form"
                formId="project"
                formData={formConfig}
                formButtons={GlobalUtils.getFormButtons(isLoading, onCancel)}
                onSubmit={handleFormSubmit}
                responseErrors={ProjectInfoFormErrors}
            />
        </div>
    );
};
