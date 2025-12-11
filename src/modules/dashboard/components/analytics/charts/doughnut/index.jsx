import React from 'react';
import styles from "./styles/index.module.css";
import "./styles/index.css";
import EChartsDoughnut from '@/components/eCharts/DoughnutChart';
import useDashboardDoughnut from './hooks/useDashboardDoughnut';

const DashboardDoughnut = () => {
    const {dashboardDoughnutConfig} = useDashboardDoughnut();
  return ( 
     <EChartsDoughnut options={dashboardDoughnutConfig}/>
  )
}

export default DashboardDoughnut
