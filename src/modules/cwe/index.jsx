import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CalendarCheck, CheckCircle2, Clock, Edit, Plus, RefreshCcw, Delete, AlertCircle } from "lucide-react";
import Utils from "@/utils";
import NewTable from "@/components/Table";
import { Button } from "@/components/ui/button";
import Modal from "@/components/Popup/Popup";
import GlobalICONS from "@/lib/utils/icons";
import AddAssets from "@/components/AddAssets";
import { CweInfoForm } from "./component/form";
import { useCwe } from "@/services/context/cwe";
import GlobalUtils from "@/lib/utils/GlobalUtils";
import CweStats from "./component/stats";
import CweDetails from "./component/details";
import { CWE_API } from "@/lib/utils/apiEndPoints/cwe";
import { ToggleSwitch } from "@/components/Table/components/toggleSwitch";

const CWE = () => {
    const [show, setShow] = useState({});
    const [cweDataDetails, setCweDataDetails] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const closeModal = () => setShow({ add: false, edit: false, delete: false, view: false });
    const openAddModal = () => setShow({ add: true });
    const [isDeleting, setIsDeleting] = useState(false);
    const [refreshTable, setRefreshTable] = useState(false);
    const { cweDeletion, statsCount, cweDetails, cweUpdating } = useCwe();
    const [deletionTargets, setDeletionTargets] = useState(null);

    useEffect(() => {
        if (show.delete && cweDataDetails?._id) {
            const deletePayload = {
                recordId: cweDataDetails?._id,
                onShowDetails: setCweDataDetails,
                deleteAction: cweDeletion,
                toggleRefreshData: setRefreshTable,
                toggleRefreshData: () => {
                    setRefreshTable((prev) => !prev);
                    statsCount.execute();
                },
            };
            GlobalUtils.handleDelete(deletePayload);
            closeModal();
        }
    }, [show.delete, cweDataDetails]);

    const handleViewCwe = (item) => {
        console.log("Is it details coming in the page", item);
        setCweDataDetails(item);
        setShow((prev) => ({ ...prev, view: true }));
    };

    const onSuccess = () => {
        statsCount.execute();
        setRefreshTable((prev) => !prev);
        closeModal();
    };

    const handleDeleteSingleCwe = (id) => {
        console.log("Give me the correct id", id);
        setDeletionTargets(id);
        setShowDeleteModal(true);
    };

    // Confirm deletion
    const confirmDeletion = async () => {
        if (!deletionTargets) return;

        try {
            setIsDeleting(true);

            await cweDeletion.execute({
                id: deletionTargets,
                options: { showNotification: true },
            });
            statsCount.execute();
            setRefreshTable((prev) => !prev);
        } catch (err) {
            console.error("Failed to delete cwe:", err);
        } finally {
            setIsDeleting(false);
            setShowDeleteModal(false);
            setDeletionTargets(null);
        }
    };

    // Toggle rule enabled/disabled status via API
    const handleToggleEnabled = async (row) => {
        try {
            const newStatus = !row.isEnabled;
            const newName = row.name;
            await cweUpdating.execute({
            id: row.id,
            payload: { isEnabled: newStatus, name: newName },
            options: { showNotification: true },
            onSuccess: () => {
                setRefreshTable((prev) => !prev);
                statsCount.execute();
            },
            });
        } catch (error) {
            console.error("Error toggling CWE status:", error);
        }
    };

    const formatTableData = (data) => {
        const url = CWE_API.LIST;
        return {
            url,
            refreshTable,
            filters: {
                row1: {
                    data: [
                        {
                            type: "search",
                            placeholder: "Search CWE...",
                            className: "",
                            name: "search",
                        },
                    ],
                },
            },
            rows: data?.data
                ? data.data.map((item) => ({
                        ID: { key: "_id", value: item._id, type: "hidden" },
                        CWEId: {
                            key: "id",
                            value: (
                                <span
                                    className="font-semibold text-orange-600 hover:text-orange-700 dark:text-orange-500 dark:hover:text-orange-700 cursor-pointer transition-all duration-200 underline-offset-2 hover:underline"
                                    onClick={() => handleViewCwe(item)}
                                >
                                    {Utils.capitalizeEachWord(item.id)}
                                </span>
                            ),
                            originalValue: item.id,
                        },
                        "CWE Name": { key: "name", value: item.name },
                        Enabled: {
                            key: "isEnabled",
                            value: (
                                <ToggleSwitch
                                enabled={!!item.isEnabled}
                                onChange={() => handleToggleEnabled(item)}
                                />
                            ),
                            originalValue: item.isEnabled,
                        },
                        "Created At": {
                            key: "createdAt",
                            value: (
                                <span className="flex items-center gap-1 text-gray-700 dark:text-white min-w-36">
                                    <CalendarCheck className="w-4 h-4 text-orange-500" />
                                    {Utils.formatDateTime(item.createdAt)}
                                </span>
                            ),
                        },
                        "Updated At": {
                            key: "updatedAt",
                            value: (
                                <span className="flex items-center gap-1 text-gray-700 dark:text-white min-w-36">
                                    <Clock className="w-4 h-4 text-violet-500" />
                                    {Utils.formatDateTime(item.updatedAt)}
                                </span>
                            ),
                        },
                        "Description": { key: "description", value: item.description, type: "hidden" },
                    }))
                : [],
            actions: [
                {
                    icon: <Edit className="w-4 h-4" />,
                    label: "Edit",
                    onClick: (row, index) => {
                        setCweDataDetails(row);
                        setShow((prev) => ({ ...prev, edit: true }));
                    },
                },
                {
                    icon: <Delete className="w-4 h-4" />,
                    label: "Delete",
                    onClick: (row) => handleDeleteSingleCwe(row?.CWEId?.originalValue),
                },
            ],
            totalPages: parseInt(data?.totalPages || 1),
            totalDocuments: data?.total || 0,
            formatTableData,
            hasCheckbox: false,
        };
    };

    const tableConfig = useMemo(() => formatTableData({}), [refreshTable]);

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground dark:text-gray-200">CWE(Common Weakness Enumeration)</h1>
                    <p className="text-muted-foreground mt-1 dark:text-gray-400">Track, classify, and mitigate known **coding and design flaws** to reduce overall security risk.</p>
                </div>
                <Button onClick={openAddModal} className="bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary">
                    <Plus className="h-4 w-4" />
                    Add CWE
                </Button>
                <Modal
                    show={show.add}
                    onClose={closeModal}
                    title={"Add CWE"}
                    maxWidth={"1000px"}
                    icon={GlobalICONS.CHECKLIST}
                    description="Provide the required details to configure and register a new CWE"
                >
                    <AddAssets
                        module={{
                            name: "cwe",
                            onSuccess,
                            onCancel: closeModal,
                            form: <CweInfoForm onCancel={closeModal} onSuccess={onSuccess} />,
                        }}
                    />
                </Modal>
            </div>
            <CweStats />
            <Modal show={show.edit} onClose={closeModal} title={"Edit CWE Details"} maxWidth={"1000px"} icon={GlobalICONS.CHECKLIST} description="Edit the cwe details below.">
                <CweInfoForm data={cweDataDetails} onCancel={closeModal} onSuccess={onSuccess} />
            </Modal>
            <Modal
                show={show.view}
                onClose={closeModal}
                title={"CWE Details"}
                maxWidth={"1600px"}
                icon={GlobalICONS.CHECKLIST}
                description="Detailed information for the selected cwe item."
            >
                {cweDataDetails ? <CweDetails data={cweDataDetails} /> : <div className="p-4 text-center">Loading checklist details...</div>}
            </Modal>
            {showDeleteModal && (
                <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Confirm Delete" maxWidth="500px" icon={GlobalICONS.WARNING}>
                    <div className="dark:bg-transparent p-3 w-full max-w-md text-center space-y-6">
                        <div className="flex items-center justify-center text-red-500">
                            <AlertCircle className="w-10 h-10 text-red-500" />
                        </div>

                        <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
                            Are you sure you want to delete <span className="font-semibold text-red-600">{"this checklist"}</span>?
                        </p>

                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-5 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-800 transition-all duration-200"
                            >
                                No, Cancel
                            </button>

                            <button
                                onClick={confirmDeletion}
                                disabled={isDeleting}
                                className="px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-60 transition-all duration-200"
                            >
                                {isDeleting ? "Deleting..." : "Yes, Delete"}
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
            <div>
                <NewTable tableConfig={tableConfig} />
            </div>
        </div>
    );
};

export default CWE;
