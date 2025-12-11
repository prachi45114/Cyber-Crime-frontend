"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis } from "recharts";
import { Monitor, Laptop, Server, Network, Globe, HardDrive, Activity, TrendingUp } from "lucide-react";
import { useStats } from "@/services/context/stats";
import { useEffect } from "react";
import styles from "./index.module.css";

// Data from the provided JSON
const initialData = {
    laptop: {
        total: 60,
        inUse: 47,
    },
    desktop: {
        total: 246,
        inUse: 215,
    },
    server: {
        total: 30,
        inUse: 2,
    },
    networkDevice: {
        total: 50,
        inUse: 42,
    },
    webApplication: {
        total: 15,
        inUse: 15,
    },
    vitualMachine: {
        total: 1,
        inUse: 1,
    },
};

export default function AssetStats() {
    const { statsCount } = useStats();

    useEffect(() => {
        statsCount.execute({
            params: { module: "dashboard" },
        });
    }, []);

    const data = statsCount.data || initialData;

    // Theme colors
    const primaryColor = "rgb(52, 112, 228)";
    const primaryLightColor = "rgba(52, 112, 228, 0.1)";
    const secondaryColor = "rgb(82, 142, 255)";
    const tertiaryColor = "rgb(112, 172, 255)";
    const successColor = "rgb(75, 181, 67)";
    const warningColor = "rgb(255, 193, 7)";
    const darkGrayColor = "rgb(100, 116, 139)";

    // Asset type configuration
    const assetConfig = {
        laptop: { name: "Laptop", icon: Laptop, color: primaryColor },
        desktop: { name: "Desktop", icon: Monitor, color: secondaryColor },
        server: { name: "Server", icon: Server, color: tertiaryColor },
        networkDevice: { name: "Network Device", icon: Network, color: successColor },
        webApplication: { name: "Web Application", icon: Globe, color: warningColor },
        vitualMachine: { name: "Virtual Machine", icon: HardDrive, color: "rgb(168, 85, 247)" },
    };

    // Prepare data for asset distribution chart
    const assetDistributionData = Object.entries(data).map(([key, value]) => ({
        name: assetConfig[key]?.name || key,
        value: value.total,
        color: assetConfig[key]?.color || primaryColor,
    }));

    // Prepare data for utilization chart
    const utilizationData = Object.entries(data).map(([key, value]) => ({
        name: assetConfig[key]?.name || key,
        total: value.total,
        inUse: value.inUse,
        available: value.total - value.inUse,
        utilizationRate: Math.round((value.inUse / value.total) * 100),
    }));

    // Calculate overall statistics
    const totalAssets = Object.values(data).reduce((sum, asset) => sum + asset.total, 0);
    const totalInUse = Object.values(data).reduce((sum, asset) => sum + asset.inUse, 0);
    const overallUtilization = Math.round((totalInUse / totalAssets) * 100);

    // Custom tooltip for charts
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div
                    className="custom-tooltip"
                    style={{
                        backgroundColor: "white",
                        padding: "10px",
                        border: "1px solid #f0f0f0",
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    }}
                >
                    <p className="label" style={{ margin: 0, fontWeight: 500 }}>
                        {`${label || payload[0].name}: ${payload[0].value}`}
                    </p>
                </div>
            );
        }
        return null;
    };

    // Get asset icon
    const getAssetIcon = (assetKey) => {
        const IconComponent = assetConfig[assetKey]?.icon || HardDrive;
        return <IconComponent size={20} />;
    };

    return (
        <div>
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className={`p-6 rounded-xl shadow-sm ${styles.chartContainer}`}>
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-600">Total Assets</h3>
                        <Activity size={18} color={primaryColor} />
                    </div>
                    <p className="text-2xl font-bold" style={{ color: primaryColor }}>
                        {totalAssets}
                    </p>
                </div>

                <div className={`p-6 rounded-xl shadow-sm ${styles.chartContainer}`}>
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-600">Assets In Use</h3>
                        <TrendingUp size={18} color={successColor} />
                    </div>
                    <p className="text-2xl font-bold" style={{ color: successColor }}>
                        {totalInUse}
                    </p>
                </div>

                <div className={`p-6 rounded-xl shadow-sm ${styles.chartContainer}`}>
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-600">Utilization Rate</h3>
                        <div
                            className="w-4 h-4 rounded-full"
                            style={{
                                backgroundColor: overallUtilization >= 70 ? successColor : overallUtilization >= 50 ? warningColor : primaryColor,
                            }}
                        ></div>
                    </div>
                    <p
                        className="text-2xl font-bold"
                        style={{
                            color: overallUtilization >= 70 ? successColor : overallUtilization >= 50 ? warningColor : primaryColor,
                        }}
                    >
                        {overallUtilization}%
                    </p>
                </div>
            </div>

            {/* Asset Distribution and Utilization Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Asset Distribution */}
                <div className={`p-6 rounded-xl shadow-sm ${styles.chartContainer}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Asset Distribution</h3>
                        <div
                            className="p-2 bg-blue-50 rounded-lg"
                            style={{
                                backgroundColor: "var(--desktop-icon-bg-color)",
                            }}
                        >
                            <Activity size={18} color={primaryColor} />
                        </div>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={assetDistributionData} cx="50%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={5} dataKey="value" strokeWidth={2} stroke="#fff">
                                    {assetDistributionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend layout="horizontal" verticalAlign="bottom" align="center" formatter={(value) => <span style={{ color: darkGrayColor, fontWeight: 500 }}>{value}</span>} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Utilization Chart */}
                <div className={`p-6 rounded-xl shadow-sm ${styles.chartContainer}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Asset Utilization</h3>
                        <div
                            className="p-2 bg-blue-50 rounded-lg"
                            style={{
                                backgroundColor: "var(--desktop-icon-bg-color)",
                            }}
                        >
                            <TrendingUp size={18} color={primaryColor} />
                        </div>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={utilizationData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
                                <YAxis />
                                <Tooltip
                                    content={({ active, payload, label }) => {
                                        if (active && payload && payload.length) {
                                            const data = payload[0].payload;
                                            return (
                                                <div className="bg-white p-3 border border-gray-100 rounded-md shadow-sm">
                                                    <p className="font-medium">{label}</p>
                                                    <p className="text-sm">Total: {data.total}</p>
                                                    <p className="text-sm">In Use: {data.inUse}</p>
                                                    <p className="text-sm">Available: {data.available}</p>
                                                    <p className="text-sm font-medium">Utilization: {data.utilizationRate}%</p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Bar dataKey="inUse" stackId="a" fill={successColor} name="In Use" />
                                <Bar dataKey="available" stackId="a" fill="#e5e7eb" name="Available" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Individual Asset Cards */}
            <div>
                {/* <h3 className="text-lg font-semibold mb-4">Asset Details</h3> */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(data).map(([key, asset]) => {
                        const config = assetConfig[key];
                        const utilizationRate = Math.round((asset.inUse / asset.total) * 100);

                        return (
                            <div key={key} className={`shadow-sm p-4 rounded-xl transition-all duration-300 hover:shadow-md ${styles.chartContainer}`}>
                                <div className="flex items-center gap-3 mb-3">
                                    <div
                                        className="p-1.5 rounded-lg"
                                        style={{
                                            backgroundColor: "var(--desktop-icon-bg-color)",
                                            color: config?.color || primaryColor,
                                        }}
                                    >
                                        {getAssetIcon(key)}
                                    </div>
                                    <h4 className="font-medium text-[1.1rem]">{config?.name || key}</h4>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className={`text-sm ${styles.assetsColor}`}>Total</span>
                                        <span className="text-lg font-bold" style={{ color: config?.color || primaryColor }}>
                                            {asset.total}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className={`text-sm ${styles.assetsColor}`}>In Use</span>
                                        <span className="font-medium" style={{ color: successColor }}>
                                            {asset.inUse}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className={`text-sm ${styles.assetsColor}`}>Available</span>
                                        <span className="font-medium text-gray-600">{asset.total - asset.inUse}</span>
                                    </div>

                                    <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                                        <div className="flex items-center justify-between">
                                            <span className={`text-sm ${styles.assetsColor}`}>Utilization</span>
                                            <span
                                                className="font-bold"
                                                style={{
                                                    color: utilizationRate >= 80 ? successColor : utilizationRate >= 60 ? warningColor : primaryColor,
                                                }}
                                            >
                                                {utilizationRate}%
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                            <div
                                                className="h-2 rounded-full transition-all duration-300"
                                                style={{
                                                    width: `${utilizationRate}%`,
                                                    backgroundColor: utilizationRate >= 80 ? successColor : utilizationRate >= 60 ? warningColor : primaryColor,
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
