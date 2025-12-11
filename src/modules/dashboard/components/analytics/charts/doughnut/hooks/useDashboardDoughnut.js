import { useMemo } from "react";
import sampleDashboardDoughnutData from "../utils/seeds";

const useDashboardDoughnut = (data = sampleDashboardDoughnutData) => {
    const dashboardDoughnutConfig = useMemo(
        () => ({
            title: "Assets",
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
        dashboardDoughnutConfig,
    };
};

export default useDashboardDoughnut;
