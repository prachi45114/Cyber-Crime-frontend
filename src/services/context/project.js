import { createContext, useContext } from "react";
import {
    useGetProjectMembers,
    useProjectCreate,
    useProjectDelete,
    useProjectDetails,
    useProjectFileDelete,
    useProjectFileDownload,
    useProjectFileUpload,
    useProjectGetDropDownList,
    useProjectList,
    useProjectUpdate,
} from "../hooks/project";

const ProjectContext = createContext(null);

export const ProjectProvider = ({ children }) => {
    const projectCreationState = useProjectCreate();
    const projectGetDropdownListState = useProjectGetDropDownList();
    const projectDetailsState = useProjectDetails();
    const projectUpdatingState = useProjectUpdate();
    const projectDeletionState = useProjectDelete();
    const projectFileUploadState = useProjectFileUpload();
    const projectListState = useProjectList();
    const projectFileDeleteState = useProjectFileDelete();
    const fetchProjectMemberListState = useGetProjectMembers();

    return (
        <ProjectContext.Provider
            value={{
                ...projectCreationState,
                ...projectGetDropdownListState,
                ...projectDetailsState,
                ...projectUpdatingState,
                ...projectDeletionState,
                ...projectFileUploadState,
                ...projectListState,
                ...projectFileDeleteState,
                ...fetchProjectMemberListState,
            }}
        >
            {children}
        </ProjectContext.Provider>
    );
};

export const useProject = () => {
    const context = useContext(ProjectContext);
    if (context === null) {
        throw new Error("useProject must be used within a ProjectProvider");
    }
    return context;
};
