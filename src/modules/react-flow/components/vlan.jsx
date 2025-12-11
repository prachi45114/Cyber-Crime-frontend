"use client";
import { Handle, Position } from "@xyflow/react";
import { Info, X, ChevronDown, ChevronRight, Network } from "lucide-react";

const Vlan = ({ id, data }) => {
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
            case "active":
                return "bg-green-400";
            case "inactive":
                return "bg-red-400";
            case "maintenance":
                return "bg-yellow-400";
            default:
                return "bg-purple-400";
        }
    };

    return (
        <>
            <div className={`bg-white dark:bg-[#1e1e1e] cursor-pointer min-w-[220px] transition-all duration-200 `} onClick={handleNodeClick}>
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
                            <div className="w-6 h-6 bg-purple-500 rounded-lg flex items-center justify-center shadow-sm">
                                <Network size={12} className="text-white" />
                            </div>
                            <div className={`w-2 h-2 rounded-full ${getStatusColor()} shadow-sm`}></div>
                        </div>

                        {/* VLAN ID and Name */}
                        <div className="flex-1 min-w-0 flex items-center gap-2">
                            <div className="flex-1 min-w-0">
                                <h3 title={data.vlanName || data.label || "Unknown"} className="text-xs text-left font-semibold text-gray-900 dark:text-white truncate leading-tight">
                                    {data.vlanName || data.label || "Unknown"}
                                </h3>
                            </div>

                            {data.vlanId && (
                                <div className="flex-shrink-0">
                                    <p title={`VLAN ${data.vlanId}`} className="text-[10px] text-left text-gray-600 dark:text-gray-400 truncate bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                                        VLAN {data.vlanId}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Info button */}
                        <button
                            onClick={handleShowDetails}
                            className="w-6 h-6 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 flex items-center justify-center flex-shrink-0"
                            title="View Details"
                        >
                            <Info size={14} />
                        </button>
                    </div>

                    {/* Subnet on separate line */}
                    {data.subnet && data.subnet.length > 0 && (
                        <div className="flex ml-12">
                            <p className="text-[10px] text-purple-600 dark:text-purple-400 font-mono font-semibold">{data.subnet[0]}</p>
                        </div>
                    )}
                </div>

                <Handle type="target" position={Position.Left} className="w-2 h-2 bg-gray-600 dark:bg-gray-400 border border-white dark:border-gray-900" />
                <Handle type="source" position={Position.Right} className="w-2 h-2 bg-gray-600 dark:bg-gray-400 border border-white dark:border-gray-900" />
            </div>
        </>
    );
};

export default Vlan;
