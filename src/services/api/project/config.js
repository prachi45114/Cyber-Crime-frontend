import apiConstants from "@/services/utils/constants";
import apiClient from "../config";

const projectApiClient = apiClient.create({
    baseURL: `${apiClient.defaults.baseURL}${apiConstants.project.BASE_ROUTE}`,
    headers: {
        ...apiClient.defaults.headers,
    },
});

projectApiClient.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => Promise.reject(error)
);

projectApiClient.interceptors.response.use(
    (response) => {
        // console.log("Project module response:", response);
        return response;
    },
    (error) => Promise.reject(error)
);

export default projectApiClient;
