import React from "react";
import EChartBase from "../eChartBase";
import useEchartsBar from "./hooks/useEchartsBar";

const EChartsBar = ({ options }) => {
  const { eChartsBarConfig } = useEchartsBar(options); // Correct variable name

  return <EChartBase options={eChartsBarConfig} />;
};

export default EChartsBar;
