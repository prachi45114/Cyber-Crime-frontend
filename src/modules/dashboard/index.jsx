import React from "react";
import styles from "./index.module.css";
// import DashboardAnalytics from "./components/analytics";
import CanAccess from "@/components/CanAccess";
import AnalyticsDashboard from "./components/analytics-dashboard";

const Dashboard = () => {
    return (
        // <CanAccess path={["/projects/stats", "/chats/dashboard"]} className={styles.main_container}>
        <AnalyticsDashboard />
        // </CanAccess>
    );
};

export default Dashboard;
