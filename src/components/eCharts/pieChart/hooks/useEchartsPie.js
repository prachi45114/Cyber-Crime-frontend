import { useMemo } from "react";
import sampleEChartConfigData from "../utils/seeds";

const useEchartsPie = (data = sampleEChartConfigData) => {
    const eChartsPieConfig = useMemo(() => {
        return {
            title: {
                text: data?.title, // Ensure you're using `data.title`
                // subtext: data?.subtitle, // Ensure you're using `data.subtitle`
                left: "center",
            },
            tooltip: {
                trigger: "item",
            },
            legend: {
                orient: "horizontal", // Ensure horizontal orientation
                top: 0, // Place legend at the bottom
                left: "center", // Center it horizontally at the bottom
            },
            series: [
                {
                    name: data?.title, // You could also pass a unit here if available
                    type: "pie",
                    radius: "50%",
                    data: data?.data, // Use `data.data` here for pie chart data
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: "rgba(0, 0, 0, 0.5)",
                        },
                    },
                },
            ],
        };
    }, [data]);

    return {
        eChartsPieConfig,
    };
};

export default useEchartsPie;
