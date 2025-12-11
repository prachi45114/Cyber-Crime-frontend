"use client";

import { createContext, useContext } from "react";
import { useLoadingState } from "../hooks/loading";

const LoadingContext = createContext(null); // Set a default value if required

export const LoadingProvider = ({ children }) => {
    const loadingState = useLoadingState();

    return <LoadingContext.Provider value={{ ...loadingState }}>{children}</LoadingContext.Provider>;
};

export const useLoading = () => {
    const context = useContext(LoadingContext);
    if (context === null) {
        throw new Error("useLoading must be used within a LoadingProvider");
    }
    return context;
};
