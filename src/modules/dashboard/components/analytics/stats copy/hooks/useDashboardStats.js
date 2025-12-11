import { useMemo } from "react";
import sampleDashboardStatsData from "../utils/seeds";
import GlobalICONS from "@/lib/utils/icons";

const useDashboardStats = (data = sampleDashboardStatsData) => {
    const dashboardStatsConfig = useMemo(
        () => [
            {
                title: "Laptop",
                value: data?.laptop?.total || 0,
                subTitle: "Total Laptops",
                icon: GlobalICONS.LAPTOP,
                hasDecrement: false,
                hasIncrement: true,
                color: "orange",
            },
            {
                title: "Desktop",
                value: data?.desktop?.total || 0,
                subTitle: "Total Desktop",
                icon: GlobalICONS.DESKTOP,
                hasDecrement: false,
                hasIncrement: true,
                color: "violet",
            },
            {
                title: "Servers",
                value: data?.server?.total || 0,
                subTitle: "Total Servers",
                icon: GlobalICONS.SERVER,
                hasDecrement: false,
                hasIncrement: false,
                color: "green",
            },
            {
                title: "Virtual Machine",
                value: data?.virtualMachine?.total || 0,
                subTitle: "Total Virtual Machine",
                icon: GlobalICONS.VIRTUAL_MACHINE,
                hasDecrement: false,
                hasIncrement: false,
                color: "red",
            },
            {
                title: "Network Device",
                value: data?.networkDevice?.total || 0,
                subTitle: "Total Network Device",
                icon: GlobalICONS.NETWORKING_DEVICE,
                hasDecrement: true,
                hasIncrement: false,
                color: "orange",
            },

            {
                title: "Web Applications",
                value: data?.webApplication?.total || 0,
                subTitle: "Total Web Applications",
                icon: GlobalICONS.WEB_APPLICATION,
                hasDecrement: false,
                hasIncrement: false,
                color: "violet",
            },
        ],
        [data]
    );
    return {
        dashboardStatsConfig,
    };
};

export default useDashboardStats;
