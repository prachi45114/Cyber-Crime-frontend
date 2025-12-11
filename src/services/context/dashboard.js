import { createContext, useContext } from "react";
import { useDashboardStatsCount } from "../hooks/dashboard";

const DashboardContext = createContext(null);

export const DashboardProvider = ({ children }) => {
    const dashboardStatsCountState = useDashboardStatsCount();

    return (
        <DashboardContext.Provider
            value={{
                ...dashboardStatsCountState,
            }}
        >
            {children}
        </DashboardContext.Provider>
    );
};

export const useDashboard = () => {
    const context = useContext(DashboardContext);
    if (context === null) {
        throw new Error("useDashboard must be used within a UserProvider");
    }
    return context;
};
