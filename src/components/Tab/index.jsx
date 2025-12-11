import * as React from "react";
import { motion } from "framer-motion";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { useSearchParams } from "react-router-dom";
function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export default function Tabs({ tabs, defaultTab, className, variant = "pills", onTabChange, persistTabInUrl = false, tabQueryParam = "tab" }) {
    const [searchParams, setSearchParams] = useSearchParams();

    React.useEffect(() => {
        if (searchParams.get(tabQueryParam) != activeTab) {
            const tabParam = searchParams.get(tabQueryParam);
            if (tabParam) {
                const parsedTab = parseInt(tabParam);
                setActiveTab(parsedTab);
            }
        }
    }, [searchParams.get(tabQueryParam)]);

    const initialTab = React.useMemo(() => {
        if (persistTabInUrl) {
            const tabParam = searchParams.get(tabQueryParam);
            if (tabParam) {
                const parsedTab = parseInt(tabParam);
                if (!isNaN(parsedTab)) return parsedTab;
            }
        }
        return defaultTab || tabs[0]?.id;
    }, [persistTabInUrl, searchParams, defaultTab, tabs]);

    const [activeTab, setActiveTab] = React.useState(initialTab);

    const [hoveredTab, setHoveredTab] = React.useState(null);

    const handleTabClick = (tabId) => {
        setActiveTab(tabId);
        if (persistTabInUrl) {
            // const newParams = new URLSearchParams(searchParams);
            // newParams.set(tabQueryParam, tabId);
            setSearchParams({ [tabQueryParam]: tabId });
        }
        onTabChange?.({ id: tabId, label: tabs.find((t) => t.id === tabId)?.label });
    };

    const getTabStyles = (tabId) => {
        const isActive = activeTab === tabId;
        const isHovered = hoveredTab === tabId;

        switch (variant) {
            case "pills":
                return {
                    container: cn(
                        "relative  py-3 rounded-full text-sm font-medium transition-all duration-300 min-w-[120px] px-4",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2",
                        isActive ? "text-white shadow-lg" : "text-muted-foreground hover:text-primary bg-white"
                    ),
                    indicator: "absolute inset-0 rounded-full bg-gradient-to-r from-primary to-primary/80 shadow-[0_4px_14px_0_rgba(255,142,6,0.39)]",
                };
            case "cards":
                return {
                    container: cn(
                        "relative  py-4 rounded-lg text-sm font-medium transition-all duration-300 min-w-[120px] border px-4",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2",
                        isActive ? "text-primary border-primary/30 bg-primary/5" : "text-muted-foreground hover:text-primary border-transparent hover:bg-muted/50"
                    ),
                    indicator: null,
                };
            case "bubbles":
                return {
                    container: cn(
                        "relative  py-3 text-sm font-medium transition-all duration-300 min-w-[120px] overflow-hidden",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2",
                        isActive ? "text-primary" : "text-muted-foreground hover:text-primary/90"
                    ),
                    indicator: "absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_0_rgba(255,142,6,0.7)]",
                };
            case "underline":
            default:
                return {
                    container: cn(
                        "relative  py-3 text-sm font-medium transition-all duration-300 min-w-[120px]",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2",
                        isActive ? "text-primary" : "text-muted-foreground hover:text-primary/70"
                    ),
                    indicator: "absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/80 via-primary to-primary/80",
                };
        }
    };

    return (
        <div className={cn("w-full mx-auto", className)}>
            <div className="relative flex p-1">
                <div className={cn("flex overflow-x-auto scrollbar-hide w-full gap-7 dark:border-gray-800", variant === "underline" && "border-b")}>
                    {tabs.map((tab) => {
                        const styles = getTabStyles(tab.id);
                        return (
                            <button
                                key={tab.id}
                                onClick={() => handleTabClick(tab.id)}
                                onMouseEnter={() => setHoveredTab(tab.id)}
                                onMouseLeave={() => setHoveredTab(null)}
                                className={`${styles.container}`}
                                aria-selected={activeTab === tab.id}
                                role="tab"
                                // style={{ backgroundColor: activeTab === tab.id ? "white" : "" }}
                            >
                                {activeTab === tab.id && styles.indicator && (
                                    <motion.div
                                        layoutId={`tab-indicator-${variant}`}
                                        className={styles.indicator}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{
                                            type: "spring",
                                            bounce: 0.2,
                                            duration: 0.6,
                                        }}
                                    />
                                )}
                                <span className="relative text-nowrap z-2 flex items-center justify-center gap-2 whitespace-nowrap">
                                    {tab.icon && <span className="text-lg">{tab.icon}</span>}
                                    {tab.label}
                                    {tab.count && (
                                        <span
                                            className={`px-2 py-0.5 text-xs rounded-full ${
                                                activeTab === tab.id
                                                    ? "bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300"
                                                    : "bg-gray-100 dark:bg-gray-700 dark:text-white text-gray-600"
                                            }`}
                                        >
                                            {tab.count}
                                        </span>
                                    )}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
            <div className="mt-1">
                <AnimatedTabContent tabs={tabs} activeTab={activeTab} />
            </div>
        </div>
    );
}

function AnimatedTabContent({ tabs, activeTab }) {
    const activeTabContent = tabs.find((tab) => tab.id === activeTab)?.content;

    return (
        <motion.div
            key={activeTab}
            role="tabpanel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="relative  w-full"
        >
            <div className="p-2">{activeTabContent}</div>
        </motion.div>
    );
}
