import axios from "axios";
import apiConstants from "../utils/constants";
import { notifyError } from "@/components/Notification";
import ApiUtils from "../utils";

const apiClient = axios.create({
    baseURL: apiConstants.BACKEND_API_BASE_URL, // Base API path
    headers: {
        "Content-Type": "application/json",
        Authorization: ApiUtils.getAuthToken() ? `Bearer ${ApiUtils.getAuthToken()}` : undefined,
    },
});

apiClient.interceptors.request.use(
    (config) => {
        const token = ApiUtils.getAuthToken();
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        notifyError(error);
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => {
        response.data.modified = true;
        return response;
    },
    (error) => {
        const errorMessage = error.response?.data?.message || error.message || "An error occurred";
        console.error(`[API ERROR ${status || "Unknown"}]: ${errorMessage}`);
        notifyError(errorMessage);
        return Promise.reject(error);
    }
);

export default apiClient;
