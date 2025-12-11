import { useMemo } from "react";
import sampleEChartsDoughnutConfigData from "../utils/seeds";

const useEchartsDoughnut = (data = sampleEChartsDoughnutConfigData) => {
    //console.log(data);
    const title = data?.title;
    const toolTipText = data?.toolTipText;

    const eChartsDoughnutConfig = useMemo(() => {
        return {
            title: {
                text: title,
                left: "center",
            },
            tooltip: {
                trigger: "item",
                formatter: function (params) {
                    return `${params.name}: ${params.value} ${toolTipText}`;
                },
            },
            legend: {
                orient: "horizontal",
                left: "left", // Align the legend to the left
                // top: "center",
            },
            grid: {
                left: "20%", // Adjust the grid to ensure the pie chart isn't overlapped by the legend
            },
            series: [
                {
                    name: "Status",
                    type: "pie",
                    radius: ["40%", "70%"],
                    // center: ["50%", "40%"],
                    data: data?.data,
                    avoidLabelOverlap: false,
                    label: {
                        show: false,
                    },
                    labelLine: {
                        show: false,
                    },
                },
            ],
        };
    }, [data]);

    return {
        eChartsDoughnutConfig,
    };
};

export default useEchartsDoughnut;
