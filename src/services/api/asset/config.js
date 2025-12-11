import apiConstants from "@/services/utils/constants";
import apiClient from "../config";

const assetApiClient = apiClient.create({
    baseURL: `${apiClient.defaults.baseURL}${apiConstants.asset.BASE_ROUTE}`,
    headers: {
        ...apiClient.defaults.headers,
    },
});

assetApiClient.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => Promise.reject(error)
);

assetApiClient.interceptors.response.use(
    (response) => {
        // console.log("Asset module response:", response);
        return response;
    },
    (error) => Promise.reject(error)
);

export default assetApiClient;
