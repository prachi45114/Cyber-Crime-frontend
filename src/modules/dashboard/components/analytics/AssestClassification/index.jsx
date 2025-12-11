import React, { useEffect, useState } from "react";
import styles from "./styles/index.module.css";
import dashboardICONS from "@/modules/dashboard/utils/icons";
import Heading from "@/components/Heading";
import EChartBase from "@/components/eCharts/eChartBase";
import assetsClassficationConstants from "./utils/constants";
import StatusButtonCard from "./components/StatusButtonCard";
import sampleAssetsClassificationData from "./utils/seeds";
import "./styles/index.css";
const AssetsStatusCountChart = ({ initialData = sampleAssetsClassificationData, title = "Assets" }) => {
    console.log(initialData);
    const [activeChart, setActiveChart] = useState("itAssets");
    const [pieDataStatus, setPieDataStatus] = useState({});
    const [tab, setTab] = useState(1);
    const [showPackageList, setShowPackageList] = useState(false);
    const [loading, setLoading] = useState(true); // Default to loading state
    const formatText = (input) => {
        return input
            .replace(/([A-Z])/g, " $1")
            .replace(/_/g, " ")
            .replace(/^\s*/, "")
            .replace(/\b\w/g, (char) => char.toUpperCase());
    };
    const handleTabChange = (value) => {
        setLoading(true);
        setTab(value);
        setTimeout(() => {
            setLoading(false); // Simulate data fetching
        }, 1000);
        setActiveChart(value === 1 ? "itAssets" : value === 2 ? "license" : "vmAssets");
    };
    useEffect(() => {
        // Simulate initial data transformation
        setTimeout(() => setLoading(false), 1000);
    }, []);
    const labelOption = {
        show: true,
        position: assetsClassficationConstants.app.config.position,
        distance: assetsClassficationConstants.app.config.distance,
        align: assetsClassficationConstants.app.config.align,
        verticalAlign: assetsClassficationConstants.app.config.verticalAlign,
        rotate: assetsClassficationConstants.app.config.rotate,
        formatter: "{c}",
        fontSize: 12,
    };
    const getFormattedKey = (key) => {
        switch (key) {
            default:
                return key;
        }
    };
    const getOptions = () => {
        if (activeChart === "license") {
            const seriesData = [
                {
                    groupName: "Group 1",
                    data: [
                        { name: `Expired Licenses [${pieDataStatus?.expiredLicenecs}]`, value: pieDataStatus?.expiredLicenecs },
                        { name: `Expiry in Less Than 15 Days [${pieDataStatus?.expiryInLessThan15Days}]`, value: pieDataStatus?.expiryInLessThan15Days },
                    ],
                },
                {
                    groupName: "Group 2",
                    data: [
                        { name: `Used Licenses [${pieDataStatus?.usedLicences}]`, value: pieDataStatus?.usedLicences },
                        { name: `In-Store Licenses [${pieDataStatus?.totalCount - pieDataStatus?.usedLicences}]`, value: pieDataStatus?.totalCount - pieDataStatus?.usedLicences },
                    ],
                },
            ];

            const colorMapping = {
                [`Expired Licenses [${pieDataStatus?.expiredLicenecs}]`]: "#FF6666",
                [`Expiry in Less Than 15 Days [${pieDataStatus?.expiryInLessThan15Days}]`]: "#FFB74D",
                [`Used Licenses [${pieDataStatus?.usedLicences}]`]: "#81C784",
                [`In-Store Licenses [${pieDataStatus?.totalCount - pieDataStatus?.usedLicences}]`]: "#64B5F6",
            };

            const series = seriesData.flatMap((group, groupIndex) =>
                group.data.map((item) => ({
                    type: "bar",
                    data: groupIndex === 0 ? [item.value, 0] : [0, item.value],
                    coordinateSystem: "polar",
                    name: item.name,
                    stack: `Group 1`,
                    emphasis: {
                        focus: "series",
                    },
                    itemStyle: {
                        color: colorMapping[item.name],
                    },
                    radius: ["40%", "70%"],
                    center: ["50%", "50%"],
                    avoidLabelOverlap: false,
                    labelLine: {
                        show: false,
                    },
                }))
            );

            return {
                angleAxis: {
                    show: false,
                    axisLine: {
                        show: false,
                    },
                    splitLine: {
                        show: false,
                    },
                },
                radiusAxis: {
                    type: "category",
                    data: ["Used/In-Store", "Expired/Expiring Soon"],
                    z: 10,
                    axisLine: {
                        show: false,
                    },
                    splitLine: {
                        show: false,
                    },
                },
                polar: {
                    show: true,
                },
                tooltip: {
                    trigger: "item",
                    formatter: "{a}: {c}",
                },
                legend: {
                    show: true,
                    data: seriesData.flatMap((group) => group.data.map((item) => item.name)),
                    top: "5.5%",
                    left: "center",
                    textStyle: {
                        fontSize: 10,
                    },
                },
                series: series,
                responsive: true,
            };
        }
        if (tab === 2 || tab === 3) {
            return {
                tooltip: {
                    trigger: "item",
                },
                legend: {
                    top: "5.5%",
                    left: "center",
                    fontSize: "10",
                },
                series: [
                    {
                        name: "Assets",
                        type: "pie",
                        radius: ["40%", "70%"],
                        center: ["50%", "50%"],
                        avoidLabelOverlap: false,
                        itemStyle: {
                            borderRadius: 10,
                            borderWidth: 2,
                        },
                        label: {
                            show: false,
                            position: "center",
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: 16,
                                fontWeight: "bold",
                            },
                        },
                        labelLine: {
                            show: false,
                        },
                        data: Object.entries(pieDataStatus || {}).map(([key, value]) => {
                            if (key !== "totalCount") {
                                return {
                                    name: `${formatText(key)} [${value}]`,
                                    value: value,
                                };
                            }
                        }),
                    },
                ],
            };
        }

        const seriesKeys = ["count", "adIntegrationPending", "agentInstallationPending", "complianceFail"];
        const seriesNames = seriesKeys.map((key) => formatText(key.replace(/([A-Z])/g, " $1").trim()));

        return {
            tooltip: {
                trigger: "axis",
                axisPointer: {
                    type: "shadow",
                },
            },
            legend: {
                top: "8%",
                data: seriesNames,
                textStyle: {
                    fontSize: 11,
                },
            },
            xAxis: {
                type: "category",
                data: Array.isArray(pieDataStatus) && pieDataStatus.map((item) => formatText(item.name)),
                axisTick: { show: false },
                axisLabel: {
                    fontSize: 10,
                    interval: 0,
                    rotate: 45,
                    overflow: "truncate",
                },
            },
            yAxis: {
                type: "value",
            },
            series: seriesKeys
                .map((key, index) => {
                    const data = Array.isArray(pieDataStatus) ? pieDataStatus.map((item) => item[getFormattedKey(key)]) : [];
                    if (data.some((value) => value != null)) {
                        return {
                            name: seriesNames[index],
                            type: "bar",
                            data: data.filter((item) => item !== undefined),
                            label: labelOption,
                            emphasis: {
                                focus: "series",
                            },
                        };
                    }
                    return null;
                })
                .filter(Boolean),
        };
    };

    const handleChartSwitch = (chartType) => setActiveChart(chartType);

    const transformData = () => {
        const dataKey = tab === 1 ? "hardware" : tab === 2 ? "softwareAssets" : "vmAssets";
        if (activeChart === "webApplications") {
            setPieDataStatus(initialData["softwareAssets"][activeChart]);
        } else {
            setPieDataStatus(tab === 3 ? initialData[dataKey] : tab === 2 ? initialData[dataKey]?.[activeChart] : initialData?.[dataKey]?.[activeChart]?.data || []);
        }
    };

    useEffect(() => {
        transformData();
    }, [tab, activeChart, initialData]);

    const statusButtonConfigs = [
        tab === 1 && [
            { key: "itAssets", title: `IT ${title}`, count: initialData?.hardware?.itAssets?.totalCount, icon: dashboardICONS.IT },
            { key: "otAssets", title: `OT ${title}`, count: initialData?.hardware?.otAssets?.totalCount, icon: dashboardICONS.OT },
        ],
        tab === 2 && [{ key: "license", title: `Licenses ${title}`, count: initialData?.softwareAssets?.license?.totalCount, icon: dashboardICONS.ONGOING }],
        tab === 3 && [
            { key: "vmAssets", title: `VM ${title}`, count: initialData?.vmAssets?.totalCount, icon: dashboardICONS.ONGOING },
            { key: "webApplications", title: `Web Applications ${title}`, count: initialData?.softwareAssets?.webApplications?.totalCount, icon: dashboardICONS.COMPLETE },
        ],
    ]
        .flat()
        .filter(Boolean);

    return (
        <div className={styles.container}>
            {loading && (
                <div style={{ background: "white" }} className={styles.loader_container}>
                    {dashboardICONS.LOADER}
                </div>
            )}
            {!loading && (
                <>
                    <Heading title={"Assets Classification"} icon={dashboardICONS.CATEGORY} count={initialData.totalAssets || 0} />
                    <Tab
                        tab={tab}
                        onTabChange={handleTabChange}
                        tabItem={[
                            { label: "Hardware Assets", totalCount: initialData?.hardware?.count || 0, value: 1 },
                            {
                                label: "Software Assets",
                                totalCount: parseInt(initialData?.softwareAssets?.license?.totalCount || "0"),
                                value: 2,
                            },
                            {
                                label: "Virtual Assets",
                                totalCount: parseInt(initialData?.vmAssets?.totalCount || "0") + parseInt(initialData.softwareAssets?.webApplications?.totalCount || "0"),
                                value: 3,
                            },
                        ]}
                    />

                    <div className={styles.body}>
                        <div className={styles.footer}>
                            <div>
                                {statusButtonConfigs.map(({ key, title, count, icon }) => (
                                    <StatusButtonCard key={key} active={activeChart === key} title={`${title} [${count || 0}]`} icon={icon} onClick={() => handleChartSwitch(key)} />
                                ))}
                            </div>
                            <span className={styles.divider}></span>
                            <div className={`assets_classification_chart ${styles.chart}`}>
                                <EChartBase options={getOptions()} />
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default AssetsStatusCountChart;
