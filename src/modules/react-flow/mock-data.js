import apiClient from "@/services/api/config";
import { sampleData } from "./sample-data";

export const fetchNetworkData = async () => {
    const response = await apiClient.get(`/asset-map`);
    return { ...response.data, assets: response.data.assets.map((item) => ({ ...item, id: item._id })) || [] };
};

const apiNetworkData = sampleData;

function isValidObjectId(id) {
    return typeof id === "string" && /^[a-f\d]{24}$/i.test(id);
}

export function transformSampleDataToNodeEdge(apiNetworkData) {
    const { assets, connections } = apiNetworkData;

    // Define positions based on network hierarchy
    const typePositions = {
        mainNetwork: { x: 0, y: 0 },
        switch: { baseX: 400, baseY: -100, spacing: 140 },
        vlan: { baseX: 800, baseY: -100, spacing: 140 },
        asset: { baseX: 1200, baseY: -200, spacing: 80 }, // Combined position for desktop/laptop/server
        vm: { baseX: 1600, baseY: -100, spacing: 140 },
        web: { baseX: 2000, baseY: -100, spacing: 140 },
    };

    const typeCounts = {};

    // Transform assets -> nodes
    const nodes = assets.map((asset) => {
        let nodeType = asset.type;
        if (nodeType === "desktop" || nodeType === "laptop" || nodeType === "server") {
            nodeType = "asset";
        }

        if (!typeCounts[nodeType]) typeCounts[nodeType] = 0;

        let position = { x: 0, y: 0 };
        if (nodeType === "mainNetwork") {
            position = typePositions.mainNetwork;
        } else if (typePositions[nodeType]) {
            const typeConfig = typePositions[nodeType];
            position = {
                x: typeConfig.baseX,
                y: typeConfig.baseY + typeCounts[nodeType] * typeConfig.spacing,
            };
        }

        typeCounts[nodeType]++;

        const nodeData = {
            label: asset.label || `${asset.assetName || asset.type} : ${asset.assetId || "Unknown"}`,
            description: `${asset.assetName || asset.type} - ${asset.statusName || asset.status}`,
            expanded: true,
            ...asset,
            isNodeHaveChild: connections.some((item) => item.source === asset._id),
        };

        return {
            id: asset._id,
            type: nodeType,
            position,
            data: nodeData,
            isIsolated: false, // default
        };
    });

    // Transform connections -> edges
    const edges = connections
        .filter((connection) => isValidObjectId(connection.source) || connection.source === "main_network")
        .map((connection) => {
            const edgeId = `e-${connection.source}-${connection.destination}`;

            const sourceNode = assets.find((a) => a._id === connection.source);
            const destNode = assets.find((a) => a._id === connection.destination);

            const sourceLabel = sourceNode ? sourceNode.assetName || sourceNode.type : connection.parentAssetName;
            const destLabel = destNode ? destNode.assetName || destNode.type : connection.assetName;

            return {
                id: edgeId,
                source: connection.source,
                target: connection.destination,
                type: "smoothstep",
                label: `${sourceLabel} → ${destLabel}`,
                animated: true,
                markerEnd: { type: "arrowclosed" },
                data: { ...connection },
            };
        });

    // Mark isolated nodes
    const connectedIds = new Set(edges.flatMap((e) => [e.source, e.target]));
    nodes.forEach((node) => {
        if (!connectedIds.has(node.id)) {
            console.log(node.id, "node.id");
            node.isIsolated = true;
        }
    });

    return { nodes, edges };
}

// Helper function to get node positions in a more structured layout
export function calculateOptimizedPositions(nodes) {
    const nodesByType = {};

    // Group nodes by type
    nodes.forEach((node) => {
        if (!nodesByType[node.type]) {
            nodesByType[node.type] = [];
        }
        nodesByType[node.type].push(node);
    });

    // Define hierarchical positioning
    const hierarchyLevels = {
        mainNetwork: 0,
        switch: 1,
        vlan: 2,
        asset: 3, // Combined level for desktop/laptop/server
        vm: 4,
        web: 5,
    };

    const levelSpacing = 400; // Horizontal spacing between levels
    const nodeSpacing = 120; // Vertical spacing between nodes

    // Position nodes
    Object.keys(nodesByType).forEach((type) => {
        const typeNodes = nodesByType[type];
        const level = hierarchyLevels[type] || 0;
        const baseX = level * levelSpacing;

        // Center the nodes vertically for this type
        const totalHeight = (typeNodes.length - 1) * nodeSpacing;
        const startY = -totalHeight / 2;

        typeNodes.forEach((node, index) => {
            node.position = {
                x: baseX,
                y: startY + index * nodeSpacing,
            };
        });
    });

    return nodes;
}

// Example usage:
const transformedData = transformSampleDataToNodeEdge(apiNetworkData);
console.log("Nodes:", transformedData.nodes);
console.log("Edges:", transformedData.edges);

// If you want optimized positioning:
export const optimizedData = {
    ...transformedData,
    nodes: calculateOptimizedPositions(transformedData.nodes.filter((item) => item.isIsolated === false)),
};
