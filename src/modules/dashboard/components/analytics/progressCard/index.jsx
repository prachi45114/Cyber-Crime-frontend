import React, { useEffect } from "react";
import styles from "./styles/index.module.css";
import useDashboardProgressCard from "./hooks/useDashboardProgressCard";
import ProgressCard from "@/components/Card/ProgressCard";
import { useStats } from "@/services/context/stats";

const DashboardProgressCard = () => {
    const { statsCount } = useStats();
    const { dashboardProgressCardConfig } = useDashboardProgressCard(statsCount.data);

    return <ProgressCard data={dashboardProgressCardConfig} cardTitle={"Assets Usage"} />;
};

export default DashboardProgressCard;
