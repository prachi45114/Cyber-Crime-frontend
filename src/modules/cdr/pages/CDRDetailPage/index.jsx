// modules/cdr/pages/CDRDetailPage.jsx  (or whichever file you use)
import { useMemo, useState, useEffect, lazy, Suspense } from "react";
import { useParams } from "react-router-dom";
import { Home } from "lucide-react";

import Tabs from "@/components/Tab";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import CDRAnalysisTab from "../CDRAnalysisTab";

const CDRFlowTree = lazy(() => import("@/modules/cdr/components/CDRFlow/CDRFlowTree"));

export default function CDRDetailPage() {
  const { cdrId } = useParams(); // must match route param name

  const [cdrData, setCdrData] = useState(null);
  const [loadingCdr, setLoadingCdr] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!cdrId) return;
    setLoadingCdr(true);
    setError(null);

    fetch(`http://192.168.22.143:5000/api/cdr/${encodeURIComponent(cdrId)}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Network error: ${res.status}`);
        return res.json();
      })
      .then((data) => setCdrData(data))
      .catch((err) => {
        console.error("Fetch CDR failed:", err);
        setError(err.message || "Failed to load CDR");
      })
      .finally(() => setLoadingCdr(false));
  }, [cdrId]);

  const records = useMemo(() => {
    if (!cdrData) return [];
    if (Array.isArray(cdrData)) return cdrData;
    if (cdrData.rows && Array.isArray(cdrData.rows)) return cdrData.rows;
    if (typeof cdrData === "object") return [cdrData];
    return [];
  }, [cdrData]);

  const tabsConfig = [
    {
      id: 1,
      label: "CDR Flow",
      content: (
        <div style={{ height: "70vh" }}>
          {loadingCdr ? (
            <div className="flex items-center justify-center h-full">Loading CDR...</div>
          ) : error ? (
            <div className="p-4 text-red-600">Error: {error}</div>
          ) : records.length === 0 ? (
            <div className="p-4 text-gray-500">No CDR records found for {cdrId}</div>
          ) : (
            <Suspense fallback={<div className="flex items-center justify-center h-full">Rendering graph...</div>}>
              <CDRFlowTree records={records} targetNo={cdrId} />
            </Suspense>
          )}
        </div>
      ),
    },
    {
      id: 2,
      label: "Investigation Insights",
      content: <CDRAnalysisTab targetNo={cdrId} />
    },
  ];

  const breadcrumbItems = [
    { label: "Home", href: "/", icon: <Home className="h-4 w-4" /> },
    { label: "CDR", href: "/cdr-records" }
  ];

  return (
    <div className="max-w-full space-y-3">
      <Breadcrumb items={breadcrumbItems} currentPage={`CDR #${cdrId}`} />

      <h1 className="text-xl font-semibold">CDR Detail</h1>
      <p className="text-gray-500 text-sm">Detailed investigation view of Call Records</p>

      <Tabs tabs={tabsConfig} variant="underline" persistTabInUrl={true} />
    </div>
  );
}
