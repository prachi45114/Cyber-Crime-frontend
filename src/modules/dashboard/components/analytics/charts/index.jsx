import React, { useState } from "react";
import styles from "./index.module.css";
import GlobalUtils from "@/lib/utils/GlobalUtils";
import EChartsComponent from "@/components/Echarts";

const Charts = () => {
    const doughnutOptions = [
        {
            value: 0,
            category: "Rating 1",
        },
        {
            value: 0,
            category: "Rating 2",
        },
        {
            value: 0,
            category: "Rating 3",
        },
        {
            value: 0,
            category: "Rating 4",
        },
        {
            value: 0,
            category: "Rating 5",
        },
    ];

    const DesktopsData = {
        title: "Desktops",
        subtitle: "Total 2000",
        unit: "",
        data: [
            { value: 1048, name: "In Use" },
            { value: 200, name: "Under Procurement" },
            { value: 100, name: "Unallocated" },
            { value: 50, name: "Discarded" },
            { value: 10, name: "Under Maintenence" },
        ],
    };

    const pieNestData = {
        title: "Desktops",
        subtitle: "Total 2000",
        unit: "",
        innerChartdata: [
            { value: 400, name: "C3i Hub" },
            { value: 10, name: "C3i Center" },
            { value: 90, name: "Tenant" },
        ],
        outerChartdata: [
            { value: 500, name: "In Use" },
            { value: 200, name: "Under Procurement" },
            { value: 100, name: "Unallocated" },
            { value: 50, name: "Discarded" },
            { value: 10, name: "Under Maintenence" },
        ],
    };

    const basicBarData = {
        title: "Assets",
        // subtitle: "Total 2000",
        // unit: "",
        data: [
            // { value: 107, name: 'Laptop' },
            // { value: 205, name: 'Desktop' },
            // { value: 55, name: 'Networking Device' },
            // { value: 150, name: 'Virtual Machine' },
            { value: 107, name: "Laptop" },
            { value: 205, name: "Desktop" },
            { value: 55, name: "Networking" },
            { value: 150, name: "Virtual" },
        ],
    };

    const doughnutData = GlobalUtils.doughnutChartOptions("Total Assets", doughnutOptions, "projects");
    const DesktopsOptions = GlobalUtils.pieChartOptions(DesktopsData);
    const pieNestOptions = GlobalUtils.pieNestChartOptions(pieNestData);
    const basicBarOptions = GlobalUtils.basicBarChartOptions(basicBarData);

    return (
        <>
            <div className={styles.stats_cards}>
                <EChartsComponent options={doughnutData} />
                <EChartsComponent options={DesktopsOptions} />
                <EChartsComponent options={DesktopsOptions} />
                <EChartsComponent options={basicBarOptions} />
            </div>
            <div className={styles.stats_big_charts}>
                <EChartsComponent options={pieNestOptions} style={{ width: "600px", height: "600px" }} />
            </div>
        </>
    );
};

export default Charts;
