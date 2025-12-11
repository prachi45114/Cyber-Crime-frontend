import { useCallback, useState } from "react";

/**
 * Custom hook to manage multiple loading states by key
 * @returns {Object} Object containing loading state management functions and states
 */

export const useLoadingState = () => {
    const [loadingStates, setLoadingStates] = useState({});

    /**
     * Sets the loading state for a specific key
     * @param {string} key - The identifier for the loading state
     * @param {boolean} isLoading - The loading state to set
     */

    const setLoading = useCallback((key, isLoading) => {
        setLoadingStates((prevStates) => ({
            ...prevStates,
            [key]: isLoading,
        }));
    }, []);

    /**
     * Checks if a specific key is in loading state
     * @param {string} key - The identifier to check
     * @returns {boolean} The loading state for the key
     */

    const isLoading = useCallback(
        (key) => {
            return loadingStates[key] || false;
        },
        [loadingStates]
    );

    /**
     * Resets all loading states to their initial state
     */
    const resetLoading = useCallback(() => {
        setLoadingStates({});
    }, []);

    return {
        isLoading,
        setLoading,
        resetLoading,
        loadingStates,
    };
};
