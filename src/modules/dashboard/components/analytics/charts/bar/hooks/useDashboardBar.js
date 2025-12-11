import { useMemo } from "react";
import sampleDashboardbarData from "../utils/seeds";

const useDashboardBar = (data = sampleDashboardbarData) => {
    const dashboardBarConfig = useMemo(
        () => ({
            title: "Hardware Assets",
            toolTipText: "device",
            data: [
                {
                    value: data?.desktop,
                    name: "Desktop",
                },
                {
                    value: data?.laptop,
                    name: "Laptop",
                },
                {
                    value: data?.virtualMachine,
                    name: "Virtual Machine",
                },
                {
                    value: data?.server,
                    name: "Server",
                },
                {
                    value: data?.networkDevice,
                    name: "Network Device",
                },
            ],
        }),
        [data]
    );

    return {
        dashboardBarConfig,
    };
};

export default useDashboardBar;
