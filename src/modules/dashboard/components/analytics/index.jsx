import React, { useEffect } from "react";
import styles from "./styles/index.module.css";
import "./styles/index.css";
import DashboardStats from "./stats";
import DashboardProgressCard from "./progressCard";
import DashboardPie from "./charts/pie";
import DashboardDoughnut from "./charts/doughnut";
import DashboardBar from "./charts/bar";
import AssetsStatusCountChart from "./AssestClassification";
import { useCharts } from "@/services/context/charts";
import AssetStats from "../assetStats";
import apiConstants from "@/services/utils/constants";
import { Download } from "lucide-react";
import axios from "axios";
import GlobalUtils from "@/lib/utils/GlobalUtils";

const DashboardAnalytics = () => {
    const { chartsData } = useCharts();
    // const handleDownload = async () => {
    //     try {
    //         // Make the GET request to the backend to generate the PDF
    //         const response = await axios.get(apiClient.defaults.baseURL + apiConstants.pdfReport.BASE_ROUTE, {
    //             headers: {
    //                 ...apiClient.defaults.headers, // Include any default headers
    //             },
    //             responseType: "blob", // Important: Make sure the response is a blob (binary data)
    //         });

    //         // Check if the response is successful
    //         if (response.status === 200) {
    //             // Create a Blob object from the response
    //             const blob = new Blob([response.data], { type: "application/pdf" });

    //             // Create a link element to trigger the download
    //             const link = document.createElement("a");
    //             link.href = URL.createObjectURL(blob);
    //             link.download = "report.pdf"; // Specify the name of the downloaded file
    //             link.click(); // Simulate the click to trigger the download

    //             // Optionally, revoke the object URL to clean up memory
    //             URL.revokeObjectURL(link.href);
    //         }
    //     } catch (error) {
    //         console.error("Error downloading the report:", error);
    //     }
    // };

    // useEffect(() => {
    //     chartsData.execute({
    //         params: { module: "dashboard" },
    //     });
    // }, []);

    return (
        <>
            <div className={styles.container}>{/* <DashboardStats /> */}</div>
            <div className={styles.dashboardHeader}>
                <a href={GlobalUtils.appendTokenToUrl(apiConstants.BACKEND_API_BASE_URL + apiConstants.pdfReport.BASE_ROUTE)} download={"Asset-report"} className={styles.pdfReportButton}>
                    Download Report
                </a>
            </div>

            {/* <div className={styles.dashboard_chart_row1}> */}
            <AssetStats data={chartsData.data?.hardware ? chartsData?.data : undefined} />

            {/* <DashboardProgressCard /> */}
            {/* </div> */}
            {/* <div className={styles.dashboard_chart_row1}>
                <DashboardDoughnut />

                <DashboardPie />
                <DashboardBar />
            </div> */}
            {/* <div className={styles.dashboard_chart_row2}>
                <DashboardPieNest />
            </div> */}
        </>
    );
};

export default DashboardAnalytics;
