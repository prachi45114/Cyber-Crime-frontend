import React, { useEffect } from "react";
import styles from "./styles/index.module.css";
import useDashboardStats from "./hooks/useDashboardStats";
import "./styles/index.css";
import StatCard from "@/components/Card/StatCard";
import { useStats } from "@/services/context/stats";

const DashboardStats = () => {
    const { statsCount } = useStats();
    const { dashboardStatsConfig } = useDashboardStats(statsCount.data);
    useEffect(() => {
        statsCount.execute({
            params: { module: "dashboard" },
        });
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
