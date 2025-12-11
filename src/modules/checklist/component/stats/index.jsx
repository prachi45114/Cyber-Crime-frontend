import React, { useEffect } from "react";
import styles from "./styles/index.module.css";
import "./styles/index.css";
import StatCard from "@/components/Card/StatCard";
import useChecklistStatsConfig from "./hooks/useChecklistStatsConfig";
import { useChecklist } from "@/services/context/checklist";

const ChecklistStats = () => {
    const { statsCount } = useChecklist();
    const { checklistStatsConfig } = useChecklistStatsConfig(statsCount.data);
    useEffect(() => {
        statsCount.execute();
    }, []);

    return (
        <div className="grid lg:grid-cols-6 md:grid-cols-3 grid-cols-1 gap-3">
            {checklistStatsConfig.map((item, index) => (
                <StatCard key={index} data={item} />
            ))}
        </div>
    );
};

export default ChecklistStats;
