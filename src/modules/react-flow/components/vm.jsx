"use client";
import { Handle, Position } from "@xyflow/react";
import { Info, X, ChevronDown, ChevronRight, MonitorSpeaker } from "lucide-react";

const Vm = ({ id, data }) => {
    const handleNodeClick = () => {
        if (!data.focused) {
            data?.onFocus(id);
        }
    };

    const handleToggleExpand = (e) => {
        e.stopPropagation();
        data?.onToggle(id);
    };

    const handleShowDetails = (e) => {
        e.stopPropagation();
        data.setSelectedNode(data);
    };

    const getStatusColor = () => {
        switch (data.status?.toLowerCase()) {
            case "running":
            case "online":
                return "bg-green-400";
            case "stopped":
            case "offline":
                return "bg-red-400";
            case "paused":
            case "maintenance":
                return "bg-yellow-400";
            default:
                return "bg-gray-400";
        }
    };

    return (
        <>
            <div className={`bg-white dark:bg-[#1e1e1e] cursor-pointer min-w-[220px] transition-all duration-200`} onClick={handleNodeClick}>
                {/* Expand/Collapse Button */}
                {data.isNodeHaveChild && (
                    <button
                        onClick={handleToggleExpand}
                        className="absolute top-[18px] -mr-3  w-5 h-5 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center transition-colors z-10 shadow-md"
                        title={data.expanded ? "Collapse" : "Expand"}
                    >
                        {!data.expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                    </button>
                )}

                {/* Focus Close Button */}
                {data.focused && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            data?.onClearFocus();
                        }}
                        className="absolute -top-2 -mr-2 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors z-10 shadow-md"
                        title="Clear Focus"
                    >
                        <X size={12} />
                    </button>
                )}

                <div className="p-0">
                    {/* Main row */}
                    <div className="flex items-center gap-2">
                        {/* Icon and status */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <div className="w-6 h-6 bg-indigo-500 rounded-lg flex items-center justify-center shadow-sm">
                                <MonitorSpeaker size={12} className="text-white" />
                            </div>
                            <div className={`w-2 h-2 rounded-full ${getStatusColor()} shadow-sm`}></div>
                        </div>

                        {/* VM ID and Custodian */}
                        <div className="flex-1 min-w-0 flex items-center gap-2">
                            <div className="flex-1 min-w-0">
                                <h3 title={data.assetId || data.label || "Unknown"} className="text-xs text-left font-semibold text-gray-900 dark:text-gray-100 truncate leading-tight">
                                    {data.assetId || data.label || "Unknown"}
                                </h3>
                            </div>

                            {data.custodianName && (
                                <div className="flex-shrink-0">
                                    <p title={data.custodianName} className="text-[10px] text-left text-gray-500 dark:text-gray-400 truncate bg-gray-50 dark:bg-gray-700 px-1.5 py-0.5 rounded">
                                        {data.custodianName}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Info button */}
                        <button
                            onClick={handleShowDetails}
                            className="w-6 h-6 text-gray-400 dark:text-gray-500 hover:text-indigo-500 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-all duration-200 flex items-center justify-center flex-shrink-0"
                            title="View Details"
                        >
                            <Info size={14} />
                        </button>
                    </div>

                    {/* IP Address on separate line */}
                    <div className="flex ml-12">
                        <p className="text-[10px] text-green-600 dark:text-green-400 font-mono font-semibold">{data.ipAddress || "IP address not found"}</p>
                    </div>
                </div>

                <Handle type="target" position={Position.Left} className="w-2 h-2 bg-gray-400 dark:bg-gray-500 border border-white dark:border-gray-800" />
                <Handle type="source" position={Position.Right} className="w-2 h-2 bg-gray-400 dark:bg-gray-500 border border-white dark:border-gray-800" />
            </div>
        </>
    );
};

export default Vm;
