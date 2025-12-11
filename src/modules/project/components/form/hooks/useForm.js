import { useEffect, useMemo } from "react";
import { useProject } from "@/services/context/project";

export const useProjectInfoForm = (data = {}, onSuccess) => {
    const { projectCreation, projectUpdation } = useProject();
    const { getCurrentUser } = useAuth();
    const { usersDropdownList } = useUsers();

    const isAdmin = getCurrentUser?.data?.user?.roles?.some((role) => role.type === "admin") ?? false;

    useEffect(() => {
        if (isAdmin) {
            usersDropdownList?.fetch({ params: { types: "management" } });
        }
    }, [isAdmin]);

    const projectManagerOptions = usersDropdownList?.data?.map((user) => ({
        label: user.name,
        value: user.id,
    }));

    const projectStatus = [{ label: "In Progress", value: "in_progress" }];

    if (data?.id) {
        projectStatus.push(
            { label: "In Progress", value: "in_progress" },
            { label: "Completed", value: "completed" },
            { label: "On Hold", value: "on_hold" },
            { label: "Cancelled", value: "cancelled" }
        );
    }

    const formConfig = useMemo(
        () => [
            {
                type: "text",
                name: "name",
                label: "Project Name",
                placeholder: "Project name",
                grid: 2,
                defaultValue: data?.name,
                validationRules: { required: true },
                validateOnChange: true,
            },
            {
                type: "text",
                name: "clientName",
                label: "Client Name",
                placeholder: "Client Name",
                grid: 2,
                defaultValue: data?.clientName,
                validationRules: { required: true },
                validateOnChange: true,
            },
            ...(isAdmin
                ? [
                      {
                          type: "select",
                          name: "projectManagerId",
                          label: "Project Manager",
                          placeholder: "Select project manager",
                          grid: 1,
                          defaultValue: data?.projectManagerId ?? "",
                          options: projectManagerOptions,
                          validationRules: { required: true },
                          validateOnChange: true,
                      },
                  ]
                : []),
            {
                type: "textarea",
                name: "description",
                label: "Project Description",
                placeholder: "Project description",
                grid: 1,
                defaultValue: data?.description,
                validationRules: { required: true },
                validateOnChange: true,
            },
            {
                type: "select",
                name: "status",
                label: "Project Status",
                placeholder: "Select status",
                grid: 2,
                defaultValue: data?.status ?? "in_progress",
                options: projectStatus,
                validationRules: { required: true },
                validateOnChange: true,
            },
            {
                type: "select",
                name: "priority",
                label: "Priority",
                placeholder: "Select priority",
                grid: 2,
                defaultValue: data?.priority,
                options: [
                    { label: "High", value: "high" },
                    { label: "Medium", value: "medium" },
                    { label: "Low", value: "low" },
                ],
                validationRules: { required: true },
                validateOnChange: true,
            },
            {
                type: "date",
                name: "startDate",
                label: "Start Date",
                grid: 2,
                defaultValue: data?.startDate,
                validationRules: { required: true },
                validateOnChange: true,
            },
            {
                type: "date",
                name: "endDate",
                label: "End Date",
                grid: 2,
                defaultValue: data?.endDate,
                validationRules: { required: false },
                validateOnChange: true,
            },
            {
                type: "textarea",
                name: "notes",
                label: "Notes",
                placeholder: "Additional notes",
                grid: 1,
                defaultValue: data?.notes,
                validationRules: {},
                validateOnChange: true,
            },
            {
                type: "checkbox",
                name: "isActive",
                label: "Active Project",
                grid: 1,
                defaultValue: data?.isActive ?? true,
            },
        ],
        [data, projectStatus, isAdmin, projectManagerOptions]
    );

    const operation = data?.id ? projectUpdation : projectCreation;

    const handleFormSubmit = (formData) => {
        const userId = getCurrentUser?.data?.user?.id;

        const isActiveValue = formData?.isActive === true || formData?.isActive === "on" || formData?.isActive === "true";

        const payload = {
            ...formData,
            isActive: isActiveValue,
            projectManagerId: isAdmin ? formData?.projectManagerId : userId,
        };

        operation.execute({
            id: data?.id, // simpler and clear
            payload,
            onSuccess,
            options: { showNotification: true },
        });
    };

    return {
        formConfig,
        handleFormSubmit,
        isLoading: operation?.isLoading,
        ProjectInfoFormErrors: operation?.errorMessages,
    };
};
