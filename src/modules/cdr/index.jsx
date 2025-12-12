import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, ArrowDownCircle, ArrowUpCircle, CalendarCheck, CheckCircle2, PhoneCall, Clock, Edit, FileText, MinusCircle, Plus, RefreshCcw, XCircle, Upload } from "lucide-react";
import Utils from "@/utils";
import NewTable from "@/components/Table";
import { Button } from "@/components/ui/button";
import Modal from "@/components/Popup/Popup";
import GlobalICONS from "@/lib/utils/icons";
import ModalPopup from "@/components/ui/modal";
import { CDRLIST_API } from "@/lib/utils/apiEndPoints/cdr-record";
import {useCdr}  from "@/services/context/cdr";
import UploadCdrForm from "./pages/UploadCdrForm";

const CDR = () => {
    const [show, setShow] = useState(false);
    const [refreshTable, setRefreshTable] = useState(false);
    const { cdrList } = useCdr();
    const statusColorMap = {
        in_progress: "text-blue-500",
        completed: "text-green-500",
        cancelled: "text-red-500",
    };
    useEffect(() => {
  cdrList.fetch({
    params: {},
    options: { isLoading: true },
  });
}, []);

    const priorityStyles = {
        critical: {
            className: "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300",
            icon: <AlertTriangle className="w-3 h-3" />,
        },
        high: {
            className: "bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300",
            icon: <ArrowUpCircle className="w-3 h-3" />,
        },
        medium: {
            className: "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300",
            icon: <MinusCircle className="w-3 h-3" />,
        },
        low: {
            className: "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-300",
            icon: <ArrowDownCircle className="w-3 h-3" />,
        },
    };

    const formatTableData = (data) => {
        const url = CDRLIST_API.LIST;

        return {
            url,
            filters: {
                row1: {
                    data: [
                        {
                            type: "search",
                            placeholder: "Search Target No, B Party No...",
                            name: "search",
                        },
                        {
                            type: "select",
                            name: "callType",
                            label: "Call Type",
                            options: [
                                { label: "Incoming", value: "incoming" },
                                { label: "Outgoing", value: "outgoing" },
                                { label: "Missed", value: "missed" },
                            ],
                        },
                    ],
                },
            },

            rows: Array.isArray(data)
                ? data.map((item) => ({
                    "Target No": {
                        key: "target_no",
                        value: (
                            <Link
                                to={`/cdr/${encodeURIComponent(item.target_no)}`}  
                                className="font-semibold text-orange-600 hover:text-orange-700 underline cursor-pointer"
                            >
                                {item.target_no}
                            </Link>
                        ),
                    },

                    "Call Type": {
                        key: "call_type",
                        value: (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
                                <PhoneCall className="w-3 h-3" />
                                {Utils.capitalizeEachWord(item.call_type)}
                            </span>
                        ),
                    },

                    "B Party": { key: "b_party_no", value: item.b_party_no },

                    Date: {
                        key: "call_date",
                        value: (
                            <span className="flex items-center gap-1 min-w-32">
                                <CalendarCheck className="w-4 h-4 text-green-600" />
                                {Utils.formatDateTime(item.call_date)}
                            </span>
                        ),
                    },

                    Duration: {
                        key: "duration",
                        value: (
                            <span className="flex items-center gap-1 text-gray-700 dark:text-white">
                                <Clock className="w-4 h-4 text-violet-500" />
                                {item.duration + " sec"}
                            </span>
                        ),
                    },
                }))
                : [],

            totalPages: data?.totalPages || 1,
            totalDocuments: data?.total || 0,
            hasCheckbox: false,
            formatTableData,
        };
    };

   const tableConfig = useMemo(() => formatTableData(cdrList.data), [cdrList.data, refreshTable]);


    const onSuccess = () => {
        setRefreshTable((prev) => !prev);
        setShow(false);
    };

    return (
        <div className="">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground dark:text-gray-200">CDR Records</h1>
                    <p className="text-muted-foreground mt-1 dark:text-gray-400">View and analyze detailed call data records for Investigation</p>
                </div>
                <Button
                    onClick={() => setShow(true)}
                    className="bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary"
                >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload CSV
                </Button>
            </div>
            <div>
                <NewTable tableConfig={tableConfig} />
            </div>
            <ModalPopup
                show={show}
                onClose={() => setShow(false)}
                maxWidth="max-w-xl"
                description="Provide the required details to configure and register a new project"
                position="right"
                title="Add New Project"
                icon={<FileText className="w-4 h-4 text-gray-600 dark:text-white" />}
            >
              <UploadCdrForm onSuccess={onSuccess} onCancel={() => setShow(false)} />
            </ModalPopup>
        </div>
    );
};

export default CDR;
