import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, ArrowDownCircle, ArrowUpCircle, CalendarCheck, CheckCircle2, Clock, Edit, FileText, MinusCircle, Plus, RefreshCcw, XCircle } from "lucide-react";
import Utils from "@/utils";
import NewTable from "@/components/Table";
import { Button } from "@/components/ui/button";
import Modal from "@/components/Popup/Popup";
import GlobalICONS from "@/lib/utils/icons";
import ModalPopup from "@/components/ui/modal";
import { CDRLIST_API } from "@/lib/utils/apiEndPoints/cdr-record";

const CDR = () => {
    const [show, setShow] = useState(false);
    const [refreshTable, setRefreshTable] = useState(false);

    const statusColorMap = {
        in_progress: "text-blue-500",
        completed: "text-green-500",
        cancelled: "text-red-500",
    };

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
        console.log("API Data: ", data)
        
        const url = CDRLIST_API.LIST;

        return {
            url,
            filters: {
                row1: {
                    data: [
                        {
                            type: "search",
                            placeholder: "Search by Target No, B Party No...",
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

            rows: data?.records
                ? data.records.map((item) => ({
                    "Target No":      { key: "target_no", value: item.target_no },
                    "Call Type":      { key: "call_type", value: item.call_type },
                    "TOC":            { key: "toc", value: item.toc },
                    "B Party No":     { key: "b_party_no", value: item.b_party_no },
                    "LRN No":         { key: "lrn_no", value: item.lrn_no },
                    "LRN TSP-LSA":    { key: "lrn_tsp_lsa", value: item.lrn_tsp_lsa },

                    Date: {
                        key: "date",
                        value: Utils.formatDate(item.date),
                    },

                    Time: {
                        key: "time",
                        value: Utils.formatTime(item.time),
                    },

                    "Dur(s)":         { key: "duration", value: item.duration },

                    "First BTS":      { key: "first_bts", value: item.first_bts },
                    "First CGI":      { key: "first_cgi", value: item.first_cgi },
                    "Last BTS":       { key: "last_bts", value: item.last_bts },
                    "Last CGI":       { key: "last_cgi", value: item.last_cgi },

                    "SMSC No":        { key: "smsc_no", value: item.smsc_no },
                    "Service Type":   { key: "service_type", value: item.service_type },

                    IMEI:             { key: "imei", value: item.imei },
                    IMSI:             { key: "imsi", value: item.imsi },

                    "Call Fow No":    { key: "call_fwd_no", value: item.call_fwd_no },
                    "Roam Nw":        { key: "roam_nw", value: item.roam_nw },

                    "SW & MSC ID":    { key: "sw_msc_id", value: item.sw_msc_id },
                    "IN TG":          { key: "in_tg", value: item.in_tg },
                    "OUT TG":         { key: "out_tg", value: item.out_tg },

                    "Vowifi First UE IP": { key: "vowifi_ue_ip_1", value: item.vowifi_ue_ip_1 },
                    Port1:               { key: "port_1", value: item.port_1 },

                    "Vowifi Last UE IP":  { key: "vowifi_ue_ip_2", value: item.vowifi_ue_ip_2 },
                    Port2:               { key: "port_2", value: item.port_2 },
                }))
                : [],

            totalPages: data?.totalPages || 1,
            totalDocuments: data?.total || 0,
            hasCheckbox: false,
            formatTableData,
            refreshTable,
           
        };
        

    };


    const tableConfig = useMemo(() => formatTableData({}), [refreshTable]);

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
                {/* <CanAccess resource="projects" action="create|manage" hideDenied={true}>
                    <Button onClick={() => setShow(true)} className="bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Project
                    </Button>
                </CanAccess> */}
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
                {/* <ProjectInfoForm onCancel={() => setShow(false)} onSuccess={onSuccess} /> */}
            </ModalPopup>
        </div>
    );
};

export default CDR;
