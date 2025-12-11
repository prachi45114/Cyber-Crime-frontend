export const nodes = [
    {
        id: "main-network-1",
        type: "mainNetwork",
        position: { x: 0, y: 0 },
        data: {
            label: "IITK Main Network",
            description: "this is description about this node",
            expanded: true,
        },
    },
    // Switches
    {
        id: "switch-1",
        type: "switch",
        position: { x: 400, y: -100 },
        data: {
            label: "C3ihub Switch",
            description: "this is description about this node",
            expanded: true,
        },
    },
    {
        id: "switch-2",
        type: "switch",
        position: { x: 400, y: 40 },
        data: {
            label: "C3ihub Switch 2",
            description: "this is description about this node",
            expanded: true,
        },
    },
    // VLANs
    {
        id: "vlan-1",
        type: "vlan",
        position: { x: 800, y: -100 },
        data: {
            label: "C3ihub VLan 1",
            description: "this is description about this node",
            expanded: true,
        },
    },
    {
        id: "vlan-2",
        type: "vlan",
        position: { x: 800, y: 40 },
        data: {
            label: "C3ihub VLan 2",
            description: "this is description about this node",
            expanded: true,
        },
    },
    {
        id: "vlan-3",
        type: "vlan",
        position: { x: 800, y: 180 },
        data: {
            label: "C3ihub VLan 3",
            description: "this is description about this node",
            expanded: true,
        },
    },
    // Assets
    {
        id: "asset-1",
        type: "asset",
        position: { x: 1200, y: -100 },
        data: {
            label: "C3ihub Asset 1",
            description: "this is description about this node",
            expanded: true,
        },
    },
    {
        id: "asset-2",
        type: "asset",
        position: { x: 1200, y: 40 },
        data: {
            label: "C3ihub Asset 2",
            description: "this is description about this node",
            expanded: true,
        },
    },
    {
        id: "asset-3",
        type: "asset",
        position: { x: 1200, y: 180 },
        data: {
            label: "C3ihub Asset 3",
            description: "this is description about this node",
            expanded: true,
        },
    },
    {
        id: "asset-4",
        type: "asset",
        position: { x: 1200, y: 320 },
        data: {
            label: "C3ihub Asset 4",
            description: "this is description about this node",
            expanded: true,
        },
    },
    // VMs
    {
        id: "vm-1",
        type: "vm",
        position: { x: 1600, y: -100 },
        data: {
            label: "C3ihub VM 1",
            description: "this is description about this node",
            expanded: true,
        },
    },
    // Web Applications
    {
        id: "web-application-1",
        type: "web",
        position: { x: 2000, y: -100 },
        data: {
            label: "C3ihub Web Application 1",
            description: "this is description about this node",
            expanded: true,
        },
    },
    {
        id: "web-application-2",
        type: "web",
        position: { x: 2000, y: 40 },
        data: {
            label: "C3ihub Web Application 2",
            description: "this is description about this node",
            expanded: true,
        },
    },
    {
        id: "web-application-3",
        type: "web",
        position: { x: 2000, y: 180 },
        data: {
            label: "C3ihub Web Application 3",
            description: "this is description about this node",
            expanded: true,
        },
    },
];

export const edges = [
    {
        id: "e-main-switch-1",
        source: "main-network-1",
        target: "switch-1",
        type: "smoothstep",
        label: "Main → Switch 1",
        animated: true,
        markerEnd: { type: "arrowclosed" },
    },
    {
        id: "e-main-switch-2",
        source: "main-network-1",
        target: "switch-2",
        type: "smoothstep",
        label: "Main → Switch 2",
        animated: true,
        markerEnd: { type: "arrowclosed" },
    },

    // Switch 1 → VLAN 1
    {
        id: "e-switch1-vlan1",
        source: "switch-1",
        target: "vlan-1",
        type: "smoothstep",
        label: "Switch 1 → VLAN 1",
        animated: true,
        markerEnd: { type: "arrowclosed" },
    },

    // Switch 2 → VLAN 2, VLAN 3
    {
        id: "e-switch2-vlan2",
        source: "switch-2",
        target: "vlan-2",
        type: "smoothstep",
        label: "Switch 2 → VLAN 2",
        animated: true,
        markerEnd: { type: "arrowclosed" },
    },
    {
        id: "e-switch2-vlan3",
        source: "switch-2",
        target: "vlan-3",
        type: "smoothstep",
        label: "Switch 2 → VLAN 3",
        animated: true,
        markerEnd: { type: "arrowclosed" },
    },

    // VLAN 1 → Asset 1
    {
        id: "e-vlan1-asset1",
        source: "vlan-1",
        target: "asset-1",
        type: "smoothstep",
        label: "VLAN 1 → Asset 1",
        animated: true,
        markerEnd: { type: "arrowclosed" },
    },

    // VLAN 2 → Asset 2
    {
        id: "e-vlan2-asset2",
        source: "vlan-2",
        target: "asset-2",
        type: "smoothstep",
        label: "VLAN 2 → Asset 2",
        animated: true,
        markerEnd: { type: "arrowclosed" },
    },

    // VLAN 3 → Asset 3 & Asset 4
    {
        id: "e-vlan3-asset3",
        source: "vlan-3",
        target: "asset-3",
        type: "smoothstep",
        label: "VLAN 3 → Asset 3",
        animated: true,
        markerEnd: { type: "arrowclosed" },
    },
    {
        id: "e-vlan3-asset4",
        source: "vlan-3",
        target: "asset-4",
        type: "smoothstep",
        label: "VLAN 3 → Asset 4",
        animated: true,
        markerEnd: { type: "arrowclosed" },
    },

    // Asset 1 → VM
    {
        id: "e-asset1-vm1",
        source: "asset-1",
        target: "vm-1",
        type: "smoothstep",
        label: "Asset 1 → VM",
        animated: true,
        markerEnd: { type: "arrowclosed" },
    },

    // VM → Web Applications
    {
        id: "e-vm1-web1",
        source: "vm-1",
        target: "web-application-1",
        type: "smoothstep",
        label: "VM → Web App 1",
        animated: true,
        markerEnd: { type: "arrowclosed" },
    },
    {
        id: "e-vm1-web2",
        source: "vm-1",
        target: "web-application-2",
        type: "smoothstep",
        label: "VM → Web App 2",
        animated: true,
        markerEnd: { type: "arrowclosed" },
    },
    {
        id: "e-vm1-web3",
        source: "vm-1",
        target: "web-application-3",
        type: "smoothstep",
        label: "VM → Web App 3",
        animated: true,
        markerEnd: { type: "arrowclosed" },
    },
];

// {
//   id: "e1-2",                     // unique id for the edge
//   source: "main-network-1",        // source node id
//   sourceHandle: null,              // optional: handle id on source node
//   target: "switch-1",              // target node id
//   targetHandle: null,              // optional: handle id on target node

//   // Labeling
//   label: "Main → Switch 1",        // label shown on the edge
//   labelStyle: { fill: "#333", fontWeight: 600 }, // custom style
//   labelBgStyle: { fill: "white" }, // background for readability
//   labelBgPadding: [8, 4],          // padding around label
//   labelBgBorderRadius: 4,          // rounded corners for label background

//   // Appearance
//   type: "smoothstep",              // "default" | "straight" | "step" | "smoothstep" | custom
//   style: { stroke: "#555", strokeWidth: 2 }, // line color & width
//   markerEnd: { type: "arrow" },    // arrow at end: "arrow" | "arrowclosed"

//   // Behavior
//   animated: true,                  // makes the edge animated (moving dashes)
//   hidden: false,                   // hides the edge if true
//   deletable: true,                 // if false, edge can’t be deleted
//   selectable: true,                // if false, can’t be selected
//   focusable: true,                 // can be focused with keyboard

//   // Interaction
//   data: { customData: "any extra info here" }, // custom metadata
// }
