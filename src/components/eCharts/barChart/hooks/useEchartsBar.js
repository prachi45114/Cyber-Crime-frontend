import { useMemo } from "react";
import sampleEChartsBarChartConfigData from "../utils/seeds";

const useEchartsBar = (data = sampleEChartsBarChartConfigData) => {
  const title = data?.title;
  const unit = data?.unit;
  const categories = data?.data.map((item) => item.name);
  const values = data?.data.map((item) => item.value);
 
  const eChartsBarConfig = useMemo(() => {
    return {
        title: {
            text: title,
            // subtext: `Unit: ${data?.unit}`,
            left: "center",
        },
        tooltip: {
            trigger: "axis",
        },
        xAxis: {
            type: "category",
            data: categories,
            axisLabel: {
                interval: 0, // Show all labels
                rotate: 45, // Rotate labels if needed
            },
        },
        yAxis: {
            type: "value",
            name: unit,
            nameLocation: "middle",
            nameGap: 30,
        },
        series: [
            {
                // name: title,
                type: "bar",
                data: values,
                itemStyle: {
                    color: "#5470C6", // Example color, adjust as needed
                },
                emphasis: {
                    itemStyle: {
                        color: "#91CC75", // Highlight color
                    },
                },
            },
        ],
        // Optional: Add additional configurations for better UX
        grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true,
        },
    };
  }, [data]);

  return {
    eChartsBarConfig,
  };
};

export default useEchartsBar;
