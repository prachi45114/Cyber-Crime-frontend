import { useMemo } from "react";
import GlobalICONS from "@/lib/utils/icons";
import sampleDashboardStatsData from "../utils/seeds";

const useDashboardStatsConfig = (data = sampleDashboardStatsData) => {
    const dashboardStatsConfig = useMemo(
        () => [
            {
                title: "Laptop",
                value: data?.totalAssets?.laptop || 0,
                subTitle: "Total Laptops",
                icon: GlobalICONS.LAPTOP,
                hasDecrement: false,
                hasIncrement: true,
                color: "orange",
            },
            {
                title: "Desktop",
                value: data?.totalAssets?.desktop || 0,
                subTitle: "Total Desktop",
                icon: GlobalICONS.DESKTOP,
                hasDecrement: false,
                hasIncrement: true,
                color: "violet",
            },
            {
                title: "Servers",
                value: data?.totalAssets?.server || 0,
                subTitle: "Total Servers",
                icon: GlobalICONS.SERVER,
                hasDecrement: false,
                hasIncrement: false,
                color: "green",
            },
            {
                title: "Virtual Machine",
                value: data?.totalAssets?.virtualMachine || 0,
                subTitle: "Total Virtual Machine",
                icon: GlobalICONS.VIRTUAL_MACHINE,
                hasDecrement: false,
                hasIncrement: false,
                color: "red",
            },
            {
                title: "Network Device",
                value: data?.totalAssets?.networkDevice || 0,
                subTitle: "Total Network Device",
                icon: GlobalICONS.NETWORKING_DEVICE,
                hasDecrement: true,
                hasIncrement: false,
                color: "orange",
            },

            {
                title: "Web Applications",
                value: data?.totalAssets?.webApplication || 0,
                subTitle: "Total Web Applications",
                icon: GlobalICONS.WEB_APPLICATION,
                hasDecrement: false,
                hasIncrement: false,
                color: "violet",
            },
        ],
        [data]
    );
    //console.log(data);
    return {
        dashboardStatsConfig,
    };
};

export default useDashboardStatsConfig;
