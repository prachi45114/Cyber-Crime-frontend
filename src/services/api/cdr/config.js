import apiConstants from "@/services/utils/constants";
import apiClient from "../config";

const cdrApiClient = apiClient.create({
    baseURL: `${apiClient.defaults.baseURL}${apiConstants.cdrRecord.BASE_ROUTE}`,
    headers: {
        ...apiClient.defaults.headers,
    },
});

cdrApiClient.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => Promise.reject(error)
);

cdrApiClient.interceptors.response.use(
    (response) => {
        // console.log("Project module response:", response);
        return response;
    },
    (error) => Promise.reject(error)
);

export default cdrApiClient;
