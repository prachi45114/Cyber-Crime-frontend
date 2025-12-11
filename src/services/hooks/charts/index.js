import ChartsApiService from "@/services/api/charts";
import { useLoading } from "@/services/context/loading";
import { useNotification } from "@/services/context/notification";
import apiConstants from "@/services/utils/constants";
import { useCallback, useState } from "react";

export const useChartsData = () => {
    const { showErrorNotification, showSuccessNotification, successMessages, errorMessages } = useNotification();
    const [chartsData, setCharts] = useState({});
    const { isLoading, setLoading } = useLoading();

    let GET_CHARTS_KEY = apiConstants.loadingStateKeys.GET_CHARTS;

    const executeChartsData = useCallback(
        async ({ params, onSuccess, onError, options }) => {
            GET_CHARTS_KEY += params.module;
            setLoading(GET_CHARTS_KEY, true);
            const controller = new AbortController();

            try {
                const data = await ChartsApiService.getChartsData(params, controller.signal);

                if (options?.showNotification) {
                    showSuccessNotification({
                        key: GET_CHARTS_KEY,
                        value: data,
                    });
                }
                setCharts(data);
                onSuccess?.(data);
                return data;
            } catch (error) {
                showErrorNotification({
                    key: GET_CHARTS_KEY,
                    value: error || "Failed to complete creation",
                });

                onError?.(error);
                throw error;
            } finally {
                setLoading(GET_CHARTS_KEY, false);
                return () => controller.abort();
            }
        },
        [GET_CHARTS_KEY, showErrorNotification, showSuccessNotification, setLoading]
    );
    return {
        chartsData: {
            execute: executeChartsData,
            data: chartsData.data,
            isLoading: isLoading(GET_CHARTS_KEY) || false,
            successMessages: successMessages?.[GET_CHARTS_KEY],
            errorMessages: errorMessages?.[GET_CHARTS_KEY],
        },
    };
};
