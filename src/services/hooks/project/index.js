import ProjectApiService from "@/services/api/project";
import { useLoading } from "@/services/context/loading";
import { useNotification } from "@/services/context/notification";
import apiConstants from "@/services/utils/constants";
import { useCallback, useState } from "react";

export const useProjectCreate = () => {
    const { showErrorNotification, showSuccessNotification, successMessages, errorMessages } = useNotification();

    const { isLoading, setLoading } = useLoading();

    const CREATE_PROJECT_KEY = apiConstants.loadingStateKeys.CREATE_PROJECT;

    const executeProjectCreation = useCallback(
        async ({ payload, onSuccess, onError, options }) => {
            setLoading(CREATE_PROJECT_KEY, true);
            const controller = new AbortController();

            try {
                const data = await ProjectApiService.create(payload, controller.signal);

                if (options?.showNotification) {
                    showSuccessNotification({
                        key: CREATE_PROJECT_KEY,
                        value: data,
                    });
                }

                onSuccess?.();
                return data;
            } catch (error) {
                showErrorNotification({
                    key: CREATE_PROJECT_KEY,
                    value: error || "Failed to complete creation",
                });

                onError?.();
                throw error;
            } finally {
                setLoading(CREATE_PROJECT_KEY, false);
                return () => controller.abort();
            }
        },
        [CREATE_PROJECT_KEY, showErrorNotification, showSuccessNotification, setLoading]
    );
    return {
        projectCreation: {
            execute: executeProjectCreation,
            isLoading: isLoading(CREATE_PROJECT_KEY) || false,
            successMessages: successMessages?.[CREATE_PROJECT_KEY],
            errorMessages: errorMessages?.[CREATE_PROJECT_KEY],
        },
    };
};

export const useProjectList = () => {
    const [projectList, setProjectList] = useState([]);
    const { showErrorNotification, showSuccessNotification, successMessages, errorMessages } = useNotification();

    const { isLoading, setLoading } = useLoading();

    const GET_LIST_PROJECT_KEY = apiConstants.loadingStateKeys.GET_LIST_PROJECT;

    const fetchProjectList = useCallback(
        async ({ onSuccess, onError, params, options }) => {
            if (options?.isLoading !== false) {
                setLoading(GET_LIST_PROJECT_KEY, true);
            }

            const controller = new AbortController();

            try {
                const data = await ProjectApiService.getList(params, controller.signal);

                if (options?.showNotification) {
                    showSuccessNotification({
                        key: GET_LIST_PROJECT_KEY,
                        value: data,
                    });
                }
                setProjectList(data.data);
                onSuccess?.(data);
                return data;
            } catch (error) {
                // showErrorNotification({
                //     key: GET_LIST_PROJECT_KEY,
                //     value: error || "Failed to complete fetch list",
                // });
                setProjectList([]);
                onError?.(error);
                throw error;
            } finally {
                setLoading(GET_LIST_PROJECT_KEY, false);
                return () => controller.abort();
            }
        },
        [GET_LIST_PROJECT_KEY, showSuccessNotification, setLoading]
    );
    return {
        projectList: {
            fetch: fetchProjectList,
            data: projectList,
            isLoading: isLoading(GET_LIST_PROJECT_KEY) || false,
            successMessages: successMessages?.[GET_LIST_PROJECT_KEY],
            errorMessages: errorMessages?.[GET_LIST_PROJECT_KEY],
        },
    };
};

export const useProjectGetDropDownList = () => {
    const [dropdownList, setDropDownList] = useState([]);
    const { showErrorNotification, showSuccessNotification, successMessages, errorMessages } = useNotification();

    const { isLoading, setLoading } = useLoading();

    const GET_DROPDOWN_LIST_PROJECT_KEY = apiConstants.loadingStateKeys.GET_DROPDOWN_LIST_PROJECT;

    const fetchDropdownList = useCallback(
        async ({ onSuccess, onError, params, options }) => {
            if (options?.isLoading !== false) {
                setLoading(GET_DROPDOWN_LIST_PROJECT_KEY, true);
            }

            const controller = new AbortController();

            try {
                const data = await ProjectApiService.getDropDownList(params, controller.signal);

                if (options?.showNotification) {
                    showSuccessNotification({
                        key: GET_DROPDOWN_LIST_PROJECT_KEY,
                        value: data,
                    });
                }
                setDropDownList(data.data);
                onSuccess?.(data);
                return data;
            } catch (error) {
                // showErrorNotification({
                //     key: GET_DROPDOWN_LIST_PROJECT_KEY,
                //     value: error || "Failed to complete fetch list",
                // });
                setDropDownList([]);
                onError?.(error);
                throw error;
            } finally {
                setLoading(GET_DROPDOWN_LIST_PROJECT_KEY, false);
                return () => controller.abort();
            }
        },
        [GET_DROPDOWN_LIST_PROJECT_KEY, showSuccessNotification, setLoading]
    );
    return {
        projectDropdownList: {
            fetch: fetchDropdownList,
            data: dropdownList,
            isLoading: isLoading(GET_DROPDOWN_LIST_PROJECT_KEY) || false,
            successMessages: successMessages?.[GET_DROPDOWN_LIST_PROJECT_KEY],
            errorMessages: errorMessages?.[GET_DROPDOWN_LIST_PROJECT_KEY],
        },
    };
};

export const useProjectDetails = () => {
    const [projectDetails, setProjectDetails] = useState({});
    const { showErrorNotification, showSuccessNotification, successMessages, errorMessages } = useNotification();

    const { isLoading, setLoading } = useLoading();

    const DETAILS_PROJECT_KEY = apiConstants.loadingStateKeys.DETAILS_PROJECT;

    const fetchProjectDetails = useCallback(
        async ({ id, onSuccess, onError, options }) => {
            setLoading(DETAILS_PROJECT_KEY, true);
            const controller = new AbortController();

            try {
                const data = await ProjectApiService.details(id, controller.signal);

                if (options?.showNotification) {
                    showSuccessNotification({
                        key: DETAILS_PROJECT_KEY,
                        value: data,
                    });
                }

                setProjectDetails(data);
                onSuccess?.(data);
                return data;
            } catch (error) {
                showErrorNotification({
                    key: DETAILS_PROJECT_KEY,
                    value: error || "Failed to complete details request",
                });

                onError?.(error);
                throw error;
            } finally {
                setLoading(DETAILS_PROJECT_KEY, false);
                return () => controller.abort();
            }
        },
        [DETAILS_PROJECT_KEY, showErrorNotification, showSuccessNotification, setLoading]
    );
    return {
        projectDetails: {
            fetch: fetchProjectDetails,
            data: projectDetails,
            isLoading: isLoading(DETAILS_PROJECT_KEY) || false,
            successMessages: successMessages?.[DETAILS_PROJECT_KEY],
            errorMessages: errorMessages?.[DETAILS_PROJECT_KEY],
        },
    };
};

export const useProjectUpdate = () => {
    const { showErrorNotification, showSuccessNotification, successMessages, errorMessages } = useNotification();

    const { isLoading, setLoading } = useLoading();

    const UPDATE_PROJECT_KEY = apiConstants.loadingStateKeys.UPDATE_PROJECT;

    const executeProjectUpdate = useCallback(
        async ({ id, payload, onSuccess, onError, options }) => {
            setLoading(UPDATE_PROJECT_KEY, true);
            const controller = new AbortController();

            try {
                const data = await ProjectApiService.update(id, payload, controller.signal);

                if (options?.showNotification) {
                    showSuccessNotification({
                        key: UPDATE_PROJECT_KEY,
                        value: data,
                    });
                }

                onSuccess?.();
                return data;
            } catch (error) {
                showErrorNotification({
                    key: UPDATE_PROJECT_KEY,
                    value: error || "Failed to complete updating",
                });

                onError?.();
                throw error;
            } finally {
                setLoading(UPDATE_PROJECT_KEY, false);
                return () => controller.abort();
            }
        },
        [UPDATE_PROJECT_KEY, showErrorNotification, showSuccessNotification, setLoading]
    );
    return {
        projectUpdation: {
            execute: executeProjectUpdate,
            isLoading: isLoading(UPDATE_PROJECT_KEY) || false,
            successMessages: successMessages?.[UPDATE_PROJECT_KEY],
            errorMessages: errorMessages?.[UPDATE_PROJECT_KEY],
        },
    };
};

export const useProjectFileUpload = () => {
    const { showErrorNotification, showSuccessNotification, successMessages, errorMessages } = useNotification();

    const { isLoading, setLoading } = useLoading();

    const UPLOAD_FILE_IN_PROJECT_KEY = apiConstants.loadingStateKeys.UPLOAD_FILE_IN_PROJECT;

    const executeProjectUploadFile = useCallback(
        async ({ id, payload, onSuccess, onError, options }) => {
            setLoading(UPLOAD_FILE_IN_PROJECT_KEY, true);
            const controller = new AbortController();

            try {
                const data = await ProjectApiService.uploadFile(id, payload, controller.signal);

                if (options?.showNotification) {
                    showSuccessNotification({
                        key: UPLOAD_FILE_IN_PROJECT_KEY,
                        value: data,
                    });
                }

                onSuccess?.(data);
                return data;
            } catch (error) {
                showErrorNotification({
                    key: UPLOAD_FILE_IN_PROJECT_KEY,
                    value: error || "Failed to complete uploading",
                });

                onError?.();
                throw error;
            } finally {
                setLoading(UPLOAD_FILE_IN_PROJECT_KEY, false);
                return () => controller.abort();
            }
        },
        [UPLOAD_FILE_IN_PROJECT_KEY, showErrorNotification, showSuccessNotification, setLoading]
    );
    return {
        projectFileUpload: {
            execute: executeProjectUploadFile,
            isLoading: isLoading(UPLOAD_FILE_IN_PROJECT_KEY) || false,
            successMessages: successMessages?.[UPLOAD_FILE_IN_PROJECT_KEY],
            errorMessages: errorMessages?.[UPLOAD_FILE_IN_PROJECT_KEY],
        },
    };
};

export const useProjectDelete = () => {
    const { showErrorNotification, showSuccessNotification, successMessages, errorMessages } = useNotification();

    const { isLoading, setLoading } = useLoading();

    const DELETE_PROJECT_KEY = apiConstants.loadingStateKeys.DELETE_PROJECT;

    const executeProjectDelete = useCallback(
        async ({ id, onSuccess, onError, options }) => {
            setLoading(DELETE_PROJECT_KEY, true);
            const controller = new AbortController();

            try {
                const data = await ProjectApiService.delete(id, controller.signal);

                if (options?.showNotification) {
                    showSuccessNotification({
                        key: DELETE_PROJECT_KEY,
                        value: data,
                    });
                }

                onSuccess?.();
                return data;
            } catch (error) {
                showErrorNotification({
                    key: DELETE_PROJECT_KEY,
                    value: error || "Failed to complete deletion",
                });

                onError?.();
                throw error;
            } finally {
                setLoading(DELETE_PROJECT_KEY, false);
                return () => controller.abort();
            }
        },
        [DELETE_PROJECT_KEY, showErrorNotification, showSuccessNotification, setLoading]
    );
    return {
        projectDeletion: {
            execute: executeProjectDelete,
            isLoading: isLoading(DELETE_PROJECT_KEY) || false,
            successMessages: successMessages?.[DELETE_PROJECT_KEY],
            errorMessages: errorMessages?.[DELETE_PROJECT_KEY],
        },
    };
};

export const useProjectFileDelete = () => {
    const { showErrorNotification, showSuccessNotification, successMessages, errorMessages } = useNotification();

    const { isLoading, setLoading } = useLoading();

    const DELETE_PROJECT_FILE_KEY = apiConstants.loadingStateKeys.DELETE_PROJECT_FILE;

    const executeProjectFileDelete = useCallback(
        async ({ id, fileId, onSuccess, onError, options }) => {
            setLoading(DELETE_PROJECT_FILE_KEY, true);
            const controller = new AbortController();

            try {
                const data = await ProjectApiService.deleteFile(id, fileId, controller.signal);

                if (options?.showNotification) {
                    showSuccessNotification({
                        key: DELETE_PROJECT_FILE_KEY,
                        value: data,
                    });
                }

                onSuccess?.();
                return data;
            } catch (error) {
                showErrorNotification({
                    key: DELETE_PROJECT_FILE_KEY,
                    value: error || "Failed to complete deletion",
                });

                onError?.();
                throw error;
            } finally {
                setLoading(DELETE_PROJECT_FILE_KEY, false);
                return () => controller.abort();
            }
        },
        [DELETE_PROJECT_FILE_KEY, showErrorNotification, showSuccessNotification, setLoading]
    );
    return {
        projectFileDeletion: {
            execute: executeProjectFileDelete,
            isLoading: isLoading(DELETE_PROJECT_FILE_KEY) || false,
            successMessages: successMessages?.[DELETE_PROJECT_FILE_KEY],
            errorMessages: errorMessages?.[DELETE_PROJECT_FILE_KEY],
        },
    };
};

export const useGetProjectMembers = () => {
    const [dropdownList, setDropDownList] = useState([]);
    const { showErrorNotification, showSuccessNotification, successMessages, errorMessages } = useNotification();

    const { isLoading, setLoading } = useLoading();

    const GET_PROJECT_MEMBERS_KEY = apiConstants.loadingStateKeys.GET_PROJECT_MEMBERS;

    const fetchProjectMemberList = useCallback(
        async ({ id, onSuccess, onError, options }) => {
            if (options?.isLoading !== false) {
                setLoading(GET_PROJECT_MEMBERS_KEY, true);
            }

            const controller = new AbortController();

            try {
                const data = await ProjectApiService.getProjectMembers(id, controller.signal);

                if (options?.showNotification) {
                    showSuccessNotification({
                        key: GET_PROJECT_MEMBERS_KEY,
                        value: data,
                    });
                }
                setDropDownList(data);
                onSuccess?.(data);
                return data;
            } catch (error) {
                showErrorNotification({
                    key: GET_PROJECT_MEMBERS_KEY,
                    value: error || "Failed to complete fetch list",
                });
                setDropDownList([]);
                onError?.(error);
                throw error;
            } finally {
                setLoading(GET_PROJECT_MEMBERS_KEY, false);
                return () => controller.abort();
            }
        },
        [GET_PROJECT_MEMBERS_KEY, showSuccessNotification, setLoading]
    );
    return {
        projectMemberList: {
            fetch: fetchProjectMemberList,
            data: dropdownList,
            isLoading: isLoading(GET_PROJECT_MEMBERS_KEY) || false,
            successMessages: successMessages?.[GET_PROJECT_MEMBERS_KEY],
            errorMessages: errorMessages?.[GET_PROJECT_MEMBERS_KEY],
        },
    };
};
