import React, { useEffect } from "react";
import styles from "./styles/index.module.css";
import "./styles/index.css";
import StatCard from "@/components/Card/StatCard";
import useCweStatsConfig from "./hooks/cweStatsConfig";
import { useCwe } from "@/services/context/cwe";

const CweStats = () => {
    const { statsCount } = useCwe();
    const { cweStatsConfig } = useCweStatsConfig(statsCount.data);
    useEffect(() => {
        statsCount.execute();
    }, []);

    return (
        <div className={styles.statsCardsContainer}>
            {cweStatsConfig.map((item, index) => (
                <StatCard key={index} data={item} />
            ))}
        </div>
    );
};

export default CweStats;
