import React from 'react';
import styles from "./styles/index.module.css";
import "./styles/index.css";
import useDashboardPie from './hooks/useDashboardPie';
import EChartsPie from '@/components/eCharts/pieChart';

const DashboardPie = () => {
    const {dashboardPieConfig} = useDashboardPie();
  return ( 

     <EChartsPie options={dashboardPieConfig}/>

  )
}

export default DashboardPie
