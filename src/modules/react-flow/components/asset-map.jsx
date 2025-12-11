"use client";

import { useCallback, useState, useEffect } from "react";
import { ReactFlow, addEdge, MiniMap, Controls, Background, useNodesState, useEdgesState, useReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import "../styles/index.css";
import ButtonEdge from "./ButtonEdge";
import MainNetwork from "./mainNetwork";
import Switch from "./switch";
import Vlan from "./vlan";
import Asset from "./asset";
import Web from "./web";
import Vm from "./vm";
import { useNetworkData, calculateOptimizedPositions } from "../services/api-data";
import AssetDetails from "./asset-details";
import { useTheme } from "@/services/context/ThemeContext";
import ICONS from "@/lib/utils/icons";
import { Fullscreen, Moon, Shrink, Sun } from "lucide-react";
import DownloadFlow from "./exportButton";

const nodeTypes = {
    mainNetwork: MainNetwork,
    switch: Switch,
    vlan: Vlan,
    asset: Asset,
    web: Web,
    vm: Vm,
};

const edgeTypes = {
    button: ButtonEdge,
};

const nodeClassName = (node) => node.type;

const AssetMap = () => {
    const optimizedData = useNetworkData();
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const { fitView } = useReactFlow();
    const [focusedNodeId, setFocusedNodeId] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [searchResultIds, setSearchResultIds] = useState(new Set());
    const [selectedNode, setSelectedNode] = useState(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const { theme, toggleTheme } = useTheme();

    const toggleFullscreen = () => {
        const appContainer = document.getElementById("app");

        if (!document.fullscreenElement) {
            appContainer.requestFullscreen().then(() => {
                setIsFullscreen(true);
            });
        } else {
            document.exitFullscreen().then(() => {
                setIsFullscreen(false);
            });
        }
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
    }, []);

    useEffect(() => {
        if (optimizedData.nodes && optimizedData.nodes.length > 0) {
            setNodes(optimizedData.nodes);
        }
    }, [optimizedData.nodes, setNodes]);

    useEffect(() => {
        if (optimizedData.edges && optimizedData.edges.length > 0) {
            setEdges(optimizedData.edges);
        }
    }, [optimizedData.edges, setEdges]);

    const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);

    const toggleNode = (nodeId) => {
        const nodeToToggle = nodes.find((n) => n.id === nodeId);
        if (!nodeToToggle) return;

        const newExpanded = !nodeToToggle.data.expanded;

        const getDescendants = (id, edges) => {
            const childIds = edges.filter((e) => e.source === id).map((e) => e.target);
            let descendants = [...childIds];
            childIds.forEach((cid) => {
                descendants = [...descendants, ...getDescendants(cid, edges)];
            });
            return descendants;
        };

        const descendants = getDescendants(nodeId, edges);

        setNodes((nds) => {
            const flagged = nds.map((node) =>
                node.id === nodeId
                    ? {
                          ...node,
                          data: { ...node.data, expanded: newExpanded },
                      }
                    : descendants.includes(node.id)
                    ? { ...node, hidden: !newExpanded }
                    : node
            );

            const visible = flagged.filter((n) => !n.hidden);
            const hidden = flagged.filter((n) => n.hidden);

            const recalculated = calculateOptimizedPositions(visible);

            const merged = flagged.map((node) => {
                const recalculatedNode = recalculated.find((n) => n.id === node.id);
                return recalculatedNode || node;
            });

            return merged;
        });

        setEdges((eds) =>
            eds.map((edge) => {
                if (descendants.includes(edge.source) || descendants.includes(edge.target) || edge.source === nodeId) {
                    return { ...edge, hidden: !newExpanded };
                }
                return edge;
            })
        );
        requestAnimationFrame(() => fitView({ padding: 0.2, duration: 800 }));
    };

    const focusNode = (nodeId) => {
        if (!nodeId) return;
        setFocusedNodeId(nodeId);

        const getDescendants = (id, edges) => {
            const childIds = edges.filter((e) => e.source === id).map((e) => e.target);
            let descendants = [...childIds];
            childIds.forEach((cid) => {
                descendants = [...descendants, ...getDescendants(cid, edges)];
            });
            return descendants;
        };

        const getAncestors = (id, edges) => {
            const parentIds = edges.filter((e) => e.target === id).map((e) => e.source);
            let ancestors = [...parentIds];
            parentIds.forEach((pid) => {
                ancestors = [...ancestors, ...getAncestors(pid, edges)];
            });
            return ancestors;
        };

        const descendants = getDescendants(nodeId, edges);
        const ancestors = getAncestors(nodeId, edges);
        const visibleNodeIds = new Set([nodeId, ...descendants, ...ancestors]);

        setNodes((nds) => {
            const flagged = nds.map((node) => (visibleNodeIds.has(node.id) ? { ...node, hidden: false } : { ...node, hidden: true }));

            const visible = flagged.filter((n) => !n.hidden);
            const hidden = flagged.filter((n) => n.hidden);

            const recalculated = calculateOptimizedPositions(visible);

            return flagged.map((node) => {
                const recalculatedNode = recalculated.find((n) => n.id === node.id);
                return recalculatedNode || node;
            });
        });

        setEdges((eds) =>
            eds.map((edge) =>
                visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target)
                    ? {
                          ...edge,
                          hidden: false,
                          style: { ...edge.style, stroke: "#0ea5e9", strokeWidth: 2 },
                      }
                    : {
                          ...edge,
                          hidden: true,
                          style: { ...edge.style, stroke: "#cbd5e1", strokeWidth: 1 },
                      }
            )
        );
        requestAnimationFrame(() => fitView({ padding: 0.2, duration: 800 }));
    };

    const clearFocus = () => {
        setFocusedNodeId(null);

        setNodes((nds) => calculateOptimizedPositions(nds.map((node) => ({ ...node, hidden: false }))));
        setEdges((eds) => eds.map((edge) => ({ ...edge, hidden: false })));
        requestAnimationFrame(() => fitView({ padding: 0.2, duration: 800 }));
    };

    const searchNodes = (text) => {
        if (!text) {
            setSearchResultIds(new Set());
            setNodes((nds) => {
                const unhidden = nds.map((node) => ({ ...node, hidden: false }));
                return calculateOptimizedPositions(unhidden);
            });
            setEdges((eds) => eds.map((edge) => ({ ...edge, hidden: false })));
            requestAnimationFrame(() => fitView({ padding: 0.2, duration: 800 }));
            return;
        }

        const lowerText = text.toLowerCase();

        const matchedNodes = nodes.filter((n) => {
            const fieldsToSearch = [
                n.data.label,
                n.data.assetTypeName,
                n.data.statusName,
                n.data.itemName,
                n.data.assetId,
                n.data.custodianName,
                n.data.ipAddress,
                n.data.status,
                n.data?.deviceState?.name,
            ];

            return fieldsToSearch.some((field) => typeof field === "string" && field.toLowerCase().includes(lowerText));
        });

        const matchedIds = matchedNodes.map((n) => n.id);

        const getDescendants = (id, edges) => {
            const childIds = edges.filter((e) => e.source === id).map((e) => e.target);
            let descendants = [...childIds];
            childIds.forEach((cid) => {
                descendants = [...descendants, ...getDescendants(cid, edges)];
            });
            return descendants;
        };

        const getAncestors = (id, edges) => {
            const parentIds = edges.filter((e) => e.target === id).map((e) => e.source);
            let ancestors = [...parentIds];
            parentIds.forEach((pid) => {
                ancestors = [...ancestors, ...getAncestors(pid, edges)];
            });
            return ancestors;
        };

        let visibleIds = new Set();
        matchedIds.forEach((id) => {
            const descendants = getDescendants(id, edges);
            const ancestors = getAncestors(id, edges);
            visibleIds = new Set([...visibleIds, id, ...descendants, ...ancestors]);
        });

        setSearchResultIds(visibleIds);

        setNodes((nds) => {
            const flagged = nds.map((node) => (visibleIds.has(node.id) ? { ...node, hidden: false } : { ...node, hidden: true }));

            const visible = flagged.filter((n) => !n.hidden);
            const recalculated = calculateOptimizedPositions(visible);

            return flagged.map((node) => {
                const recalculatedNode = recalculated.find((n) => n.id === node.id);
                return recalculatedNode || node;
            });
        });

        setEdges((eds) => eds.map((edge) => (visibleIds.has(edge.source) && visibleIds.has(edge.target) ? { ...edge, hidden: false } : { ...edge, hidden: true })));

        requestAnimationFrame(() => fitView({ padding: 0.2, duration: 800 }));
    };

    const nodesWithToggle = nodes.map((node) => ({
        ...node,
        data: {
            ...node.data,
            onToggle: toggleNode,
            onFocus: focusNode,
            onClearFocus: clearFocus,
            focused: node.id === focusedNodeId,
            setSelectedNode,
        },
    }));

    return (
        <div id="app" className="h-full relative w-full bg-white dark:bg-[#1e1e1e] text-gray-900 dark:text-[#cccccc]">
            {nodes?.length > 0 && (
                <ReactFlow
                    nodes={nodesWithToggle}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    fitView
                    attributionPosition="top-right"
                    nodeTypes={nodeTypes}
                    edgeTypes={edgeTypes}
                    className="bg-white dark:bg-[#0f0f0f]"
                    colorMode={theme === "dark" ? "dark" : "light"}
                >
                    <MiniMap zoomable pannable nodeClassName={nodeClassName} className="bg-white dark:bg-[#252526] border border-gray-200 dark:border-[#3e3e42] rounded-lg" />
                    <Controls className="bg-white dark:bg-[#252526] border border-gray-200 dark:border-[#3e3e42] rounded-lg" />
                    <Background className="bg-gray-50 dark:bg-[#0a0a0a]" />

                    <div className=" z-10 flex items-center gap-3 p-4 relative z-10">
                        <input
                            type="text"
                            placeholder="Search nodes..."
                            value={searchText}
                            onChange={(e) => {
                                const text = e.target.value;
                                setSearchText(text);
                                searchNodes(text);
                            }}
                            className="px-4 py-2 bg-white dark:bg-[#252526] border border-gray-200 dark:border-[#3e3e42] rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 min-w-[250px] text-gray-900 dark:text-[#cccccc]"
                        />
                        <button
                            onClick={toggleTheme}
                            className="p-2 bg-white dark:bg-[#252526] border border-gray-200 dark:border-[#3e3e42] rounded-lg shadow-sm hover:bg-gray-100 dark:hover:bg-[#2a2d2e] transition-colors"
                            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
                        >
                            {theme === "light" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                        <button
                            onClick={toggleFullscreen}
                            className="p-2 bg-white dark:bg-[#252526] border border-gray-200 dark:border-[#3e3e42] rounded-lg shadow-sm hover:bg-gray-100 dark:hover:bg-[#2a2d2e] transition-colors"
                            title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                        >
                            {isFullscreen ? <Shrink className="w-5 h-5" /> : <Fullscreen className="w-5 h-5" />}
                        </button>
                        <DownloadFlow name="asset-map" />
                    </div>
                </ReactFlow>
            )}
            <AssetDetails selectedNode={selectedNode} setSelectedNode={setSelectedNode} />
        </div>
    );
};

export default AssetMap;
