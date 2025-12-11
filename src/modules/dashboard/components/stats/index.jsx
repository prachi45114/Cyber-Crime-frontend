import React, { useEffect } from "react";
import styles from "./styles/index.module.css";
import "./styles/index.css";
import StatCard from "@/components/Card/StatCard";
import useDashboardStatsConfig from "./hooks/useDashboardStatsConfig";
import { useDashboard } from "@/services/context/dashboard";

const DashboardStats = () => {
    const { statsCount } = useDashboard();
    const { dashboardStatsConfig } = useDashboardStatsConfig(statsCount.data);
    useEffect(() => {
        statsCount.execute();
    }, []);

    return (
        <div className={styles.statsCardsContainer}>
            {dashboardStatsConfig.map((item, index) => (
                <StatCard key={index} data={item} />
            ))}
        </div>
    );
};

export default DashboardStats;
