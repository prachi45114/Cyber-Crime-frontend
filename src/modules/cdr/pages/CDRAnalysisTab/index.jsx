// modules/cdr/components/CDRAnalysisTab.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

const API_BASE = "http://192.168.22.143:5000/api/cdr";

const CDRAnalysisTab = ({ targetNo }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  // main modal (shows details / responses)
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  
  // "More" items modal (when there are >2 items)
  const [itemsListModalOpen, setItemsListModalOpen] = useState(false);
  const [itemsListModalTitle, setItemsListModalTitle] = useState("");
  const [itemsListForModal, setItemsListForModal] = useState([]);

  const safe = (value) => (Array.isArray(value) ? value : []);

  useEffect(() => {
    if (!targetNo) return;
    setLoading(true);

    axios
      .get(`${API_BASE}/${encodeURIComponent(targetNo)}/analysis`)
      .then((res) => setAnalysis(res.data))
      .catch((err) => {
        console.error("analysis fetch error:", err);
        setAnalysis({});
      })
      .finally(() => setLoading(false));
  }, [targetNo]);

  // helper: ensure unique, non-empty string array
  const uniq = (arr) => (Array.isArray(arr) ? Array.from(new Set(arr.map(String).filter(Boolean))) : []);

  // open items list modal with action type
  const openItemsListModal = (title, items, action) => {
    setItemsListModalTitle(title);
    setItemsListForModal(items.map((v) => ({ value: v, action })));
    setItemsListModalOpen(true);
  };

  // Generic helper to show main modal
  const openModal = (title, content) => {
    setModalTitle(title);
    setModalContent(content);
    setModalOpen(true);
  };

  /**
   * actionType: "Get Details" | "Send Team" | "Request Details"
   * value: string (IMSI / phone / location / rule)
   */
  const handleAction = async (actionType, value) => {
    if (!value) return;
    try {
      setModalLoading(true);

      if (actionType === "Get Details") {
        const v = String(value);
        const resp = await axios.get(`${API_BASE}/${encodeURIComponent(v)}`);
        const rows = resp.data ?? [];
        const content = (
          <div className="max-h-96 overflow-auto">
            <div className="mb-2 text-sm text-gray-600">Showing {Array.isArray(rows) ? rows.length : 0} records for <strong>{v}</strong></div>
            {(!Array.isArray(rows) || rows.length === 0) && <div className="text-sm text-gray-500">No records found.</div>}
            {Array.isArray(rows) && rows.length > 0 && (
              <table className="w-full text-sm border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-1 text-left">Date</th>
                    <th className="p-1 text-left">Time</th>
                    <th className="p-1 text-left">Dur(s)</th>
                    <th className="p-1 text-left">B Party</th>
                    <th className="p-1 text-left">First CGI</th>
                    <th className="p-1 text-left">IMEI</th>
                    <th className="p-1 text-left">IMSI</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="p-1">{r.call_date ?? r.date ?? "-"}</td>
                      <td className="p-1">{r.call_time ?? r.time ?? "-"}</td>
                      <td className="p-1">{r.duration ?? "-"}</td>
                      <td className="p-1">{r.b_party_no ?? r.b_party ?? "-"}</td>
                      <td className="p-1">{r.first_cgi ?? r.firstcgi ?? "-"}</td>
                      <td className="p-1">{r.imei ?? "-"}</td>
                      <td className="p-1">{r.imsi ?? "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        );
        openModal(`CDR Details for ${v}`, content);
      } else if (actionType === "Send Team") {
        const resp = await axios.post(`${API_BASE}/team/dispatch`, { targetNo, location: value });
        openModal("Team Dispatch", <div className="p-2">Team dispatched for <b>{value}</b>. Response: {resp.data?.message ?? JSON.stringify(resp.data)}</div>);
      } else if (actionType === "Request Details") {
        const resp = await axios.post(`${API_BASE}/request/details`, { targetNo, info: value });
        openModal("Request Sent", <div className="p-2">Request sent for <b>{value}</b>. Response: {resp.data?.message ?? JSON.stringify(resp.data)}</div>);
      } else {
        openModal("Info", <pre className="text-sm">{JSON.stringify(value, null, 2)}</pre>);
      }
    } catch (error) {
      console.error("handleAction error:", error);
      openModal("Error", <div className="text-sm text-red-600">Error: {error?.message ?? "unknown"}</div>);
    } finally {
      setModalLoading(false);
    }
  };

  if (loading) return <p className="p-4">Loading investigation summary...</p>;
  if (!analysis) return <p className="p-4">No data found for target {targetNo}</p>;

  // Build rows (dedupe where appropriate)
  const tableData = [
    {
      sno: 1,
      rule: "Find all IMSI",
      result: uniq(safe(analysis.allIMSI)).length ? uniq(safe(analysis.allIMSI)).join(", ") : "No IMSI found",
      action: "Get Details",
      actionItems: uniq(safe(analysis.allIMSI)),
    },
    {
      sno: 2,
      rule: "Find Close Associates",
      result:
        safe(analysis.closeAssociates).length > 0
          ? analysis.closeAssociates
              .map((c) => `${c.number} (${c.total_calls} calls)`)
              .join(", ")
          : "No close associates",
      action: "Get Details",
      actionItems: uniq(safe(analysis.closeAssociates).map((c) => c.number)),
    },
    {
      sno: 3,
      rule: "Night Location",
      result: uniq(safe(analysis.nightLocation)).length ? uniq(safe(analysis.nightLocation)).join(", ") : "No night calls",
      action: "Get Details",
      actionItems: uniq(safe(analysis.nightLocation)),
    },
    {
      sno: 4,
      rule: "Day Location",
      result: uniq(safe(analysis.dayLocation)).length ? uniq(safe(analysis.dayLocation)).join(", ") : "No day calls",
      action: "Send Team",
      actionItems: uniq(safe(analysis.dayLocation)),
    },
    {
      sno: 5,
      rule: "IMEI Numbers",
      result: uniq(safe(analysis.allIMEI)).length ? uniq(safe(analysis.allIMEI)).join(", ") : "No IMEI found",
      action: "Get Details",
      actionItems: uniq(safe(analysis.allIMEI)),
    },
    {
      sno: 7,
      rule: "Other Suspect Contacts",
      result: "Request CDR of other suspect contacts",
      action: "Request Details",
      actionItems: ["Other Suspects"],
    },
    {
      sno: 8,
      rule: "Bank Linked (via SMS)",
      result: uniq(safe(analysis.bankSMS)).length ? uniq(safe(analysis.bankSMS)).join(", ") : "No bank SMS",
      action: "Get Details",
      actionItems: uniq(safe(analysis.bankSMS)),
    },
    {
      sno: 9,
      rule: "Ecommerce Linked",
      result: uniq(safe(analysis.ecommerceSMS)).length ? uniq(safe(analysis.ecommerceSMS)).join(", ") : "No ecommerce SMS",
      action: "Get Details",
      actionItems: uniq(safe(analysis.ecommerceSMS)),
    },
    {
      sno: 10,
      rule: "ATM SMS",
      result: uniq(safe(analysis.atmSMS)).length ? uniq(safe(analysis.atmSMS)).join(", ") : "No ATM SMS",
      action: "Get Details",
      actionItems: uniq(safe(analysis.atmSMS)),
    },
  ];

  return (
    <Card className="p-4">
      <h2 className="text-2xl font-bold mb-4">Investigation Summary</h2>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2 text-left">Sno</th>
              <th className="border p-2 text-left">Rule</th>
              <th className="border p-2 text-left">Result</th>
              <th className="border p-2 text-left">Next Action</th>
            </tr>
          </thead>

          <tbody>
            {tableData.map((row) => (
              <tr key={row.sno} className="hover:bg-gray-50 align-top">
                <td className="border p-2 align-top">{row.sno}</td>
                <td className="border p-2 align-top">{row.rule}</td>
                <td className="border p-2 align-top break-words">{row.result}</td>
                <td className="border p-2">
                  {(() => {
                    const items = uniq(row.actionItems || []);
                    if (items.length === 0) {
                      return (
                        <Button size="sm" className="mr-2 mb-1" onClick={() => handleAction(row.action, row.rule)}>
                          {row.action}
                        </Button>
                      );
                    }

                    // show up to 2 inline buttons
                    const inline = items.slice(0, 2).map((item, idx) => (
                      <Button
                        key={idx}
                        size="sm"
                        className="mr-2 mb-1"
                        onClick={() => handleAction(row.action, item)}
                      >
                        {row.action}
                      </Button>
                    ));

                    // if there are more, show a More(N) button which opens modal list
                    if (items.length > 2) {
                      inline.push(
                        <Button
                          key="more"
                          size="sm"
                          className="mr-2 mb-1"
                          onClick={() => openItemsListModal(`${row.action} — ${row.rule}`, items, row.action)}
                        >
                          More ({items.length})
                        </Button>
                      );
                    }

                    return inline;
                  })()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Main Modal (details / action responses) */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{modalTitle}</DialogTitle>
          </DialogHeader>

          <div className="py-2">
            {modalLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin" />
                <div>Loading...</div>
              </div>
            ) : (
              modalContent ?? <div>No content</div>
            )}
          </div>

          <DialogFooter>
            <Button onClick={() => setModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Items list modal (More N) */}
      <Dialog open={itemsListModalOpen} onOpenChange={setItemsListModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{itemsListModalTitle}</DialogTitle>
          </DialogHeader>

          <div className="py-2 max-h-96 overflow-auto">
            {itemsListForModal.length === 0 && <div className="text-sm text-gray-500">No items</div>}
            {itemsListForModal.map((it, idx) => (
              <div key={idx} className="flex items-center justify-between gap-2 p-2 border-b">
                <div className="text-sm break-words">{String(it.value)}</div>
                <div className="flex items-center gap-2">
                  <Button size="sm" onClick={() => handleAction(it.action, it.value)}>
                    {it.action}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button onClick={() => setItemsListModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default CDRAnalysisTab;
