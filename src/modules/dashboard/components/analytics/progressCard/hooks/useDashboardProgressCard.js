import { useMemo } from "react";
import sampleDashboardProgressCardData from "../utils/seeds";
import GlobalICONS from "@/lib/utils/icons";

const useDashboardProgressCard = (data = sampleDashboardProgressCardData) => {
    const dashboardProgressCardConfig = useMemo(
        () => [
            {
                title: "Desktops",
                unit: "Desktop",
                total: data?.desktop?.total,
                used: data?.desktop?.inUse,
                remaining: data?.desktop?.remaining,
                percentage: Math.round((data?.desktop?.inUse / data?.desktop?.total) * 100),
                icon: GlobalICONS.GREATER_THEN,
            },
            {
                title: "Laptops",
                unit: "Laptop",
                total: data?.laptop?.total,
                used: data?.laptop?.inUse,
                remaining: data?.laptop?.remaining,
                percentage: Math.round((data?.laptop?.inUse / data?.laptop?.total) * 100),
                icon: GlobalICONS.GREATER_THEN,
            },

            {
                title: "Servers",
                unit: "Server",
                total: data?.server?.total,
                used: data?.server?.inUse,
                remaining: data?.server?.remaining,
                percentage: Math.round((data?.server?.inUse / data?.server?.total) * 100),
                icon: GlobalICONS.GREATER_THEN,
            },
            {
                title: "Network Devices",
                unit: "Network Device",
                total: data?.networkDevice?.total,
                used: data?.networkDevice?.inUse,
                remaining: data?.networkDevice?.remaining,
                percentage: Math.round((data?.networkDevice?.inUse / data?.networkDevice?.total) * 100),
                icon: GlobalICONS.GREATER_THEN,
            },
            {
                title: "Web Applications",
                unit: "Web Application",
                total: data?.webApplication?.total,
                used: data?.webApplication?.inUse,
                remaining: data?.webApplication?.remaining,
                percentage: Math.round((data?.webApplication?.inUse / data?.webApplication?.total) * 100),
                icon: GlobalICONS.GREATER_THEN,
            },
        ],
        [data]
    );
    return {
        dashboardProgressCardConfig,
    };
};

export default useDashboardProgressCard;
