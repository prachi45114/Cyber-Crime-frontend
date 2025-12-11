import CdrApiService from "@/services/api/cdr";
import { useLoading } from "@/services/context/loading";
import { useNotification } from "@/services/context/notification";
import apiConstants from "@/services/utils/constants";
import { useCallback, useState } from "react";

export const useCdrList = () => {
    const [cdrList, setCdrList] = useState([]);
    const { showErrorNotification, showSuccessNotification, successMessages, errorMessages } = useNotification();

    const { isLoading, setLoading } = useLoading();

    const GET_LIST_CDR_KEY = apiConstants.loadingStateKeys.GET_LIST_CDR;

    const fetchcdrList = useCallback(
        async ({ onSuccess, onError, params, options }) => {
            if (options?.isLoading !== false) {
                setLoading(GET_LIST_CDR_KEY, true);
            }

            const controller = new AbortController();

            try {
                const data = await CdrApiService.getList(params, controller.signal);
console.log("Fetched data:", data);
                if (options?.showNotification) {
                    showSuccessNotification({
                        key: GET_LIST_CDR_KEY,
                        value: data,
                    });
                }
                setCdrList(data.records);
                onSuccess?.(data);
                return data;
            } catch (error) {
                // showErrorNotification({
                //     key: GET_LIST_PROJECT_KEY,
                //     value: error || "Failed to complete fetch list",
                // });
                setCdrList([]);
                onError?.(error);
                throw error;
            } finally {
                setLoading(GET_LIST_CDR_KEY, false);
                return () => controller.abort();
            }
        },
        [GET_LIST_CDR_KEY, showSuccessNotification, setLoading]
    );
    return {
        projectList: {
            fetch: fetchcdrList,
            data: cdrList,
            isLoading: isLoading(GET_LIST_CDR_KEY) || false,
            successMessages: successMessages?.[GET_LIST_CDR_KEY],
            errorMessages: errorMessages?.[GET_LIST_CDR_KEY],
        },
    };
};