import React from "react";
import EChartBase from "../eChartBase";
import useEchartsPieNest from "./hooks/useEchartsPieNest";

const EChartsPieNest = ({ options, style }) => {
  const { eChartsPieNestConfig } = useEchartsPieNest(options); // Correct variable name

  return (
    <EChartBase options={eChartsPieNestConfig} style={style}/>
  );
};

export default EChartsPieNest;
