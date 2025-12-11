import React from "react";
import { Activity, Globe, HardDrive, Laptop, Monitor, Package, Server, Tag, User, Wifi, X } from "lucide-react";
const AssetDetails = ({ selectedNode, setSelectedNode }) => {
    if (!selectedNode) {
        return;
    }

    const getAssetColor = () => {
        switch (selectedNode?.type?.toLowerCase()) {
            case "desktop":
                return "bg-blue-500";
            case "laptop":
                return "bg-purple-500";
            case "server":
                return "bg-green-500";
            case "networking":
            case "network":
            case "switch":
                return "bg-orange-500";
            default:
                return "bg-gray-500";
        }
    };

    const getAssetIcon = () => {
        const iconProps = { size: 12, className: "text-white" };

        switch (selectedNode.type?.toLowerCase()) {
            case "desktop":
                return <Monitor {...iconProps} />;
            case "laptop":
                return <Laptop {...iconProps} />;
            case "server":
                return <Server {...iconProps} />;
            case "networking":
            case "network":
            case "switch":
                return <Wifi {...iconProps} />;
            default:
                return <HardDrive {...iconProps} />;
        }
    };

    const getStatusColor = () => {
        switch (selectedNode.status?.toLowerCase()) {
            case "online":
                return "bg-green-400";
            case "offline":
                return "bg-red-400";
            case "maintenance":
                return "bg-yellow-400";
            default:
                return "bg-gray-400";
        }
    };
    return (
        <div className="fixed inset-0 z-[9999] flex" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}>
            {/* Backdrop */}
            <div className="flex-1 bg-black bg-opacity-30" onClick={() => setSelectedNode(null)} />

            {/* Sidebar */}
            <div className="w-96 bg-white shadow-2xl overflow-y-auto transform translate-x-0">
                {/* Header */}
                <div className={`${getAssetColor()} px-6 py-4 text-white`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">{getAssetIcon()}</div>
                            <div>
                                <h2 className="text-lg font-semibold">Asset Details</h2>
                                <p className="text-sm opacity-90">{selectedNode.assetTypeName || selectedNode.type}</p>
                            </div>
                        </div>
                        <button onClick={() => setSelectedNode(null)} className="w-8 h-8 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg flex items-center justify-center transition-all">
                            <X size={16} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Basic Information */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Package size={14} className="text-gray-500" />
                            Basic Information
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-start">
                                <span className="text-xs text-gray-500 font-medium">Asset ID</span>
                                <span className="text-xs text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded">{selectedNode.assetId || "N/A"}</span>
                            </div>
                            <div className="flex justify-between items-start">
                                <span className="text-xs text-gray-500 font-medium">Inventory ID</span>
                                <span className="text-xs text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded">{selectedNode.inventoryId || "N/A"}</span>
                            </div>
                            <div className="flex justify-between items-start">
                                <span className="text-xs text-gray-500 font-medium">Asset Type</span>
                                <span className="text-xs text-gray-900 font-medium">{selectedNode.assetTypeName || selectedNode.type || "N/A"}</span>
                            </div>
                            {selectedNode.itemName && (
                                <div>
                                    <span className="text-xs text-gray-500 font-medium block mb-1">Description</span>
                                    <p className="text-xs text-gray-700 leading-relaxed bg-gray-50 p-2 rounded">{selectedNode.itemName}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Status & State */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Activity size={14} className="text-gray-500" />
                            Status & State
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500 font-medium">Status</span>
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${getStatusColor()}`}></div>
                                    <span className="text-xs text-gray-900 font-medium capitalize">{selectedNode.status || selectedNode.statusName || "Unknown"}</span>
                                </div>
                            </div>
                            {selectedNode.deviceState?.name && (
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-500 font-medium">Device State</span>
                                    <span className="text-xs text-gray-900 font-medium">{selectedNode.deviceState.name}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Network Information */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Globe size={14} className="text-gray-500" />
                            Network Information
                        </h3>
                        <div className="space-y-3">
                            {selectedNode.ipAddress && (
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-500 font-medium">IP Address</span>
                                    <span className="text-xs text-gray-900 font-mono bg-blue-50 px-2 py-1 rounded text-blue-700">{selectedNode.ipAddress}</span>
                                </div>
                            )}
                            {selectedNode.vlans && selectedNode.vlans.length > 0 && (
                                <div>
                                    <span className="text-xs text-gray-500 font-medium block mb-2">VLANs</span>
                                    <div className="flex flex-wrap gap-1">
                                        {selectedNode.vlans.map((vlan, index) => (
                                            <span key={index} className="text-[10px] bg-orange-100 text-orange-700 px-2 py-1 rounded font-mono">
                                                {vlan}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Custodian Information */}
                    {selectedNode.custodianName && (
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <User size={14} className="text-gray-500" />
                                Custodian
                            </h3>
                            <div className="bg-purple-50 p-3 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                        <User size={14} className="text-purple-600" />
                                    </div>
                                    <span className="text-sm font-medium text-purple-900">{selectedNode.custodianName}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Additional Information */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Tag size={14} className="text-gray-500" />
                            Additional Details
                        </h3>
                        <div className="space-y-2 text-xs">
                            {selectedNode.vulnerabilityCount && (
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Vulnerability</span>
                                    <span className="text-gray-900 font-mono">{selectedNode.vulnerabilityCount}</span>
                                </div>
                            )}
                            {selectedNode.packageCount && (
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Package Count</span>
                                    <span className="text-gray-900 font-mono">{selectedNode.packageCount}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssetDetails;
