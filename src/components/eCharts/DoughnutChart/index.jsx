import React from "react";
import EChartBase from "../eChartBase";
import useEchartsDoughnut from "./hooks/useEchartsDoughnut";

const EChartsDoughnut = ({ options }) => {
  const { eChartsDoughnutConfig } = useEchartsDoughnut(options); // Correct variable name

  return <EChartBase options={eChartsDoughnutConfig} />;
};

export default EChartsDoughnut;
