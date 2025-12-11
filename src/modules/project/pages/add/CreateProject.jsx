import { ProjectInfoForm } from "../../components/form";

export default function CreateProject() {
    return <ProjectInfoForm onCancel={closeModal} onSuccess={onSuccess} />;
}
