import apiConstants from "@/services/utils/constants";
import apiClient from "../config";

const cweApiClient = apiClient.create({
    baseURL: `${apiClient.defaults.baseURL}${apiConstants.cwe.BASE_ROUTE}`,
    headers: {
        ...apiClient.defaults.headers,
    },
});

cweApiClient.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => Promise.reject(error)
);

cweApiClient.interceptors.response.use(
    (response) => {
        // console.log("Asset module response:", response);
        return response;
    },
    (error) => Promise.reject(error)
);

export default cweApiClient;
