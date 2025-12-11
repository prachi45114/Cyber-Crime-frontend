"use client";

import { createContext, useContext } from "react";
import { useErrorNotification, useSuccessNotification } from "../hooks/notification";

const NotificationContext = createContext(null); // Set a default value if required

export const NotificationProvider = ({ children }) => {
    const successNotificationState = useSuccessNotification();
    const errorNotificationState = useErrorNotification();

    return <NotificationContext.Provider value={{ ...successNotificationState, ...errorNotificationState }}>{children}</NotificationContext.Provider>;
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (context === null) {
        throw new Error("useNotification must be used within a NotificationProvider");
    }
    return context;
};
