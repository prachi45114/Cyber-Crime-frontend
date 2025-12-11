import React from "react";
import useEchartsPie from "./hooks/useEchartsPie";
import EChartBase from "../eChartBase";

const EChartsPie = ({ options }) => {
  const { eChartsPieConfig } = useEchartsPie(options); // Correct variable name

  return <EChartBase options={eChartsPieConfig} />;
};

export default EChartsPie;
