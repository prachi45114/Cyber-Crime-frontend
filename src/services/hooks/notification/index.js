import { notifyError, notifySuccess } from "@/components/Notification";
import { useState, useCallback } from "react";

/**
 * Custom hook for handling success notifications and messages
 * @returns {Object} Object containing success message state and notification handler
 */
export const useSuccessNotification = () => {
    const [successMessages, setSuccessMessages] = useState({});

    const showSuccessNotification = useCallback(({ key, value, message, hideNotification = false }) => {
        try {
            const notificationMessage = { message: value?.message || message, value };
            setSuccessMessages((prevMessages) => ({
                ...prevMessages,
                [key]: notificationMessage,
            }));

            if (!hideNotification) {
                notifySuccess(notificationMessage.message);
            }
        } catch (error) {
            console.error("Failed to display success notification:", error);
        }
    }, []);

    return {
        successMessages,
        setSuccessMessages,
        showSuccessNotification,
    };
};

/**
 * Custom hook for handling error notifications and messages
 * @returns {Object} Object containing error message state and notification handler
 */
export const useErrorNotification = () => {
    const [errorMessages, setErrorMessages] = useState({});

    const showErrorNotification = useCallback(({ key, value, message, hideNotification = false }) => {
        try {
            var notificationMessage = value?.response?.data?.message || value?.response?.data?.error || message || "An unexpected error occurred";

            setErrorMessages((prevMessages) => ({
                ...prevMessages,
                [key]: value?.response?.data?.errors || value?.response?.data?.message || [],
            }));

            if (!hideNotification && notificationMessage !== "Validation Failed") {
                if (Array.isArray(notificationMessage)) {
                    notificationMessage = notificationMessage?.join(", ");
                }
                if (value?.response?.status != 404) {
                    notifyError(notificationMessage);
                }
            }
        } catch (error) {
            console.error("Failed to display error notification:", error);
        }
    }, []);

    return {
        errorMessages,
        setErrorMessages,
        showErrorNotification,
    };
};
