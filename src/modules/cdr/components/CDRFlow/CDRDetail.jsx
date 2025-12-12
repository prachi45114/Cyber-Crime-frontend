// src/pages/CDRDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CDRFlowTree from "./CDRFlowTree"; // update path as necessary
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function CDRDetail() {
  const { targetNo } = useParams();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!targetNo) return;
    const fetchCDR = async () => {
      setLoading(true);
      setError(null);
      try {
        const resp = await fetch(`/api/cdr/${encodeURIComponent(targetNo)}`); // adjust API
        if (!resp.ok) throw new Error("Failed to fetch CDRs");
        const data = await resp.json();
        // assume API returns array of records
        setRows(Array.isArray(data) ? data : data.rows || []);
      } catch (err) {
        setError(err.message || "Error");
      } finally {
        setLoading(false);
      }
    };
    fetchCDR();
  }, [targetNo]);

  return (
    <div className="p-4 h-screen flex flex-col">
      <div className="mb-4 flex items-center gap-3">
        <Link to="/cdr">
          <Button variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Back</Button>
        </Link>
        <h2 className="text-xl font-semibold">CDR Graph — Target: {targetNo}</h2>
        {loading && <span className="ml-4 text-sm text-gray-500">Loading...</span>}
        {error && <span className="ml-4 text-sm text-red-500">{error}</span>}
      </div>

      <div className="flex-1 border rounded">
        <CDRFlowTree records={rows} targetNo={targetNo} />
      </div>
    </div>
  );
}
