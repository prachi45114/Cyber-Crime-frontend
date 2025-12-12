// src/modules/cdr/components/CDRFlow/CDRFlowTree.jsx
import React, { useMemo, useState, useCallback, useEffect } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from "reactflow";
import "reactflow/dist/style.css";

/**
 * Interactive aggregated CDR flow:
 * - Aggregates by call_type -> b_party_no (count)
 * - Shows topN per call type and one "Others" node aggregating the rest
 * - Clicking a B-party opens a details side panel listing all calls for that B-party
 */

const nodeStyle = (color) => ({
  padding: 8,
  borderRadius: 8,
  border: "1px solid #d0d0d0",
  background: color,
  fontSize: 12,
  fontWeight: 600,
  cursor: "pointer"
});

function smallLabel(txt, small = false) {
  return small ? <div style={{ fontSize: 11 }}>{txt}</div> : txt;
}

// Create aggregated structure: { callType -> { bParty -> [rows] } }
const aggregate = (records = []) => {
  const byCallType = {};
  records.forEach((r) => {
    const ct = (r.call_type || "UNKNOWN").toString().toUpperCase();
    const b = (r.b_party_no || r.b_party || r.called_number || "UNKNOWN").toString();
    if (!byCallType[ct]) byCallType[ct] = {};
    if (!byCallType[ct][b]) byCallType[ct][b] = [];
    byCallType[ct][b].push(r);
  });
  return byCallType;
};

const DEFAULT_TOP_N = 6;

export default function CDRFlowTree({ records = [], targetNo = "unknown" }) {
  const [topN, setTopN] = useState(DEFAULT_TOP_N);
  const [showDetailsPanel, setShowDetailsPanel] = useState(true);
  const [selectedParty, setSelectedParty] = useState(null); // { callType, bParty, rows }
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // aggregate once per records change
  const aggregated = useMemo(() => aggregate(records), [records]);

  // build nodes & edges from aggregated data but only show topN and an "Others" node
  const buildGraph = useCallback(() => {
    const nodes = [];
    const edges = [];

    const columnX = { root: 520, callType: 200, bparty: 20, details: 860 };
    const rowGap = 100;

    // root target node
    nodes.push({
      id: "target",
      position: { x: columnX.root, y: 10 },
      data: { label: `🎯 ${targetNo}` },
      style: nodeStyle("#dfe8ff"),
    });

    const callTypes = Object.keys(aggregated);
    callTypes.forEach((ct, ctIdx) => {
      const ctId = `ct-${ctIdx}`;
      const ctY = 120 + ctIdx * rowGap;
      nodes.push({
        id: ctId,
        position: { x: columnX.callType, y: ctY },
        data: { label: `📘 ${ct}` },
        style: nodeStyle("#e3f2fd"),
      });
      edges.push({ id: `e-root-${ctId}`, source: "target", target: ctId, animated: true });

      // sort b-parties by count desc
      const parties = Object.entries(aggregated[ct]).map(([b, rows]) => ({ b, rows, count: rows.length }));
      parties.sort((a, b) => b.count - a.count);

      const top = parties.slice(0, topN);
      const rest = parties.slice(topN);

      // create nodes for top parties with counts
      top.forEach((p, pIdx) => {
        const by = ctY + 60 + pIdx * 70;
        const pid = `bp-${ctIdx}-${pIdx}`;
        nodes.push({
          id: pid,
          position: { x: columnX.bparty, y: by },
          data: { label: smallLabel(`${p.b} (${p.count})`, false), meta: { callType: ct, bParty: p.b, rows: p.rows } },
          style: nodeStyle("#f3e5f5"),
        });
        edges.push({ id: `e-${ctId}-${pid}`, source: ctId, target: pid });
      });

      // If there are leftover parties, add an "Others" node that aggregates them
      if (rest.length > 0) {
        const othersCount = rest.reduce((s, r) => s + r.count, 0);
        const oY = ctY + 60 + top.length * 70;
        const oid = `bp-${ctIdx}-others`;
        nodes.push({
          id: oid,
          position: { x: columnX.bparty, y: oY },
          data: { label: smallLabel(`Others (${rest.length}) • ${othersCount} calls`, false), meta: { callType: ct, bParty: "__OTHERS__", rows: rest.flatMap(r => r.rows), collapsedCount: rest.length } },
          style: nodeStyle("#ffe0b2"),
        });
        edges.push({ id: `e-${ctId}-${oid}`, source: ctId, target: oid });
      }
    });

    return { nodes, edges };
  }, [aggregated, topN, targetNo]);

  // (re)build nodes/edges whenever records/topN change
  useEffect(() => {
    const { nodes: builtNodes, edges: builtEdges } = buildGraph();
    setNodes(builtNodes);
    setEdges(builtEdges);
    // reset selection
    setSelectedParty(null);
  }, [buildGraph, setNodes, setEdges]);

  // handle node clicks — open detail panel for B-party nodes
  const onNodeClick = useCallback((e, node) => {
    // node.data.meta contains callType,bParty,rows for b-party nodes
    if (node?.data?.meta) {
      setSelectedParty({
        callType: node.data.meta.callType,
        bParty: node.data.meta.bParty,
        rows: node.data.meta.rows,
        collapsedCount: node.data.meta.collapsedCount || 0
      });
      // optionally scroll panel into view
      setShowDetailsPanel(true);
    } else {
      // click on other nodes: collapse selection
      setSelectedParty(null);
    }
  }, []);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)), [setEdges]);

  // small UI controls for Top N and toggle
  const ControlsPanel = () => (
    <div style={{
      position: "absolute", top: 10, left: 12, zIndex: 10, background: "#fff", padding: 8, borderRadius: 8, border: "1px solid #ddd",
      boxShadow: "0 4px 12px rgba(0,0,0,0.06)"
    }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <label style={{ fontSize: 13 }}>Top</label>
        <input type="range" min={1} max={20} value={topN} onChange={(e) => setTopN(Number(e.target.value))} />
        <strong style={{ minWidth: 36 }}>{topN}</strong>
        <button onClick={() => { setTopN(DEFAULT_TOP_N); setSelectedParty(null); }} style={{ padding: "4px 8px" }}>Reset</button>
        <label style={{ marginLeft: 8 }}>
          <input type="checkbox" checked={showDetailsPanel} onChange={(e) => setShowDetailsPanel(e.target.checked)} /> Details
        </label>
      </div>
    </div>
  );

  // details panel content
  const DetailsPanel = () => {
    if (!selectedParty) return (
      <div style={{ padding: 12, color: "#666" }}>
        Click a B-party node to view calls (date / time / duration / tower / imei / imsi)
      </div>
    );

    const { bParty, rows, collapsedCount } = selectedParty;

    return (
      <div style={{ padding: 12, height: "100%", overflowY: "auto" }}>
        <h3 style={{ margin: "4px 0 8px 0" }}>👤 {bParty}</h3>
        {collapsedCount > 0 && <div style={{ marginBottom: 8, fontSize: 13, color: "#444" }}>Note: this entry represents {collapsedCount} collapsed B-parties combined. Click to inspect combined list below.</div>}
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "1px solid #eee" }}>
              <th style={{ padding: "6px 8px" }}>Date</th>
              <th style={{ padding: "6px 8px" }}>Time</th>
              <th style={{ padding: "6px 8px" }}>Dur(s)</th>
              <th style={{ padding: "6px 8px" }}>First CGI</th>
              <th style={{ padding: "6px 8px" }}>IMEI</th>
              <th style={{ padding: "6px 8px" }}>IMSI</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => (
              <tr key={idx} style={{ borderBottom: "1px solid #fafafa" }}>
                <td style={{ padding: "6px 8px" }}>{r.call_date || r.date || "-"}</td>
                <td style={{ padding: "6px 8px" }}>{r.call_time || r.time || "-"}</td>
                <td style={{ padding: "6px 8px" }}>{r.duration ?? "-"}</td>
                <td style={{ padding: "6px 8px" }}>{r.first_cgi || r.firstcgi || "-"}</td>
                <td style={{ padding: "6px 8px" }}>{r.imei ?? "-"}</td>
                <td style={{ padding: "6px 8px" }}>{r.imsi ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // layout: graph area + optional right-side panel
  return (
    <div style={{ width: "100%", height: "100%", position: "relative", display: "flex", gap: 8 }}>
      <div style={{ flex: 1, minHeight: 400 }}>
        <ControlsPanel />
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          fitView
        >
          <MiniMap nodeColor={(n) => n.style?.background || "#eee"} nodeStrokeWidth={2} />
          <Controls />
          <Background gap={20} color="#eee" />
        </ReactFlow>
      </div>

      {showDetailsPanel && (
        <div style={{ width: 420, borderLeft: "1px solid #eee", background: "#fff", overflow: "hidden" }}>
          <div style={{ padding: 12, borderBottom: "1px solid #f3f3f3", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <strong>Details</strong>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => { setSelectedParty(null); }} title="Clear">Clear</button>
              <button onClick={() => { /* implement export if needed */ }} title="Export">Export</button>
            </div>
          </div>

          <div style={{ padding: 8 }}>
            <DetailsPanel />
          </div>
        </div>
      )}
    </div>
  );
}
