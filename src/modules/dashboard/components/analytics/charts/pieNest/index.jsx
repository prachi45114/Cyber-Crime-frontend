import React from 'react';
import styles from "./styles/index.module.css";
import "./styles/index.css";
import EChartsPieNest from '@/components/eCharts/pieNestChart';
import useDashboardPieNest from './hooks/useDashboardPieNest';

const DashboardPieNest = () => {
    const {dashboardPieNestConfig} = useDashboardPieNest();
  return ( 

     <EChartsPieNest options={dashboardPieNestConfig} />

  )
}

export default DashboardPieNest
