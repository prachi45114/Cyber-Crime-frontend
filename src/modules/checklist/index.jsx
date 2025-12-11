import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CalendarCheck, CheckCircle2, Clock, Edit, Plus, RefreshCcw, Delete, AlertCircle } from "lucide-react";
import Utils from "@/utils";
import NewTable from "@/components/Table";
import { Button } from "@/components/ui/button";
import Modal from "@/components/Popup/Popup";
import GlobalICONS from "@/lib/utils/icons";
import AddAssets from "@/components/AddAssets";
import { ChecklistInfoForm } from "./component/form";
import { useChecklist } from "@/services/context/checklist";
import GlobalUtils from "@/lib/utils/GlobalUtils";
import ChecklistStats from "./component/stats";
import ChecklistDetails from "./component/details";
import { CHECKLIST_API } from "@/lib/utils/apiEndPoints/checklist";
import { ToggleSwitch } from "@/components/Table/components/toggleSwitch";

const Checklist = () => {
    const [show, setShow] = useState({});
    const [checklistDetails, setChecklistDetails] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const closeModal = () => setShow({ add: false, edit: false, delete: false, view: false });
    const openAddModal = () => setShow({ add: true });
    const [isDeleting, setIsDeleting] = useState(false);
    const [refreshTable, setRefreshTable] = useState(false);
    const { checklistDeletion, statsCount, singleChecklist, checklistUpdating } = useChecklist();
    const [deletionTargets, setDeletionTargets] = useState(null);

    useEffect(() => {
        if (show.delete && checklistDetails?.id) {
            const deletePayload = {
                recordId: checklistDetails?.id,
                onShowDetails: setChecklistDetails,
                deleteAction: checklistDeletion,
                toggleRefreshData: setRefreshTable,
                toggleRefreshData: () => {
                    setRefreshTable((prev) => !prev);
                    statsCount.execute();
                },
            };
            GlobalUtils.handleDelete(deletePayload);
            closeModal();
        }
    }, [show.delete, checklistDetails]);

    const handleViewChecklist = (item) => {
        console.log("Is it details coming in the page", item);
        setChecklistDetails(item);
        setShow((prev) => ({ ...prev, view: true }));
    };

    const onSuccess = () => {
        statsCount.execute();
        setRefreshTable((prev) => !prev);
        closeModal();
    };

    const handleDeleteSingleChecklist = (checklistId) => {
        console.log("Give me the correct checklistId", checklistId);
        setDeletionTargets(checklistId);
        setShowDeleteModal(true);
    };

    // Confirm deletion
    const confirmDeletion = async () => {
        if (!deletionTargets) return;

        try {
            setIsDeleting(true);

            await checklistDeletion.execute({
                id: deletionTargets,
                options: { showNotification: true },
            });
            statsCount.execute();
            setRefreshTable((prev) => !prev);
        } catch (err) {
            console.error("Failed to delete checklist:", err);
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
            const newAssetType = row.assetType;
            const newChecklistItem = row.checklistItem;
            await checklistUpdating.execute({
                id: row.id,
                payload: { isEnabled: newStatus, assetType: newAssetType, checklistItem: newChecklistItem },
                options: { showNotification: true },
                onSuccess: () => {
                    setRefreshTable((prev) => !prev);
                    statsCount.execute();
                },
            });
        } catch (error) {
            console.error("Error toggling checklist status:", error);
        }
    };

    const formatTableData = (data) => {
        const url = CHECKLIST_API.LIST;
        return {
            url,
            refreshTable,
            filters: {
                row1: {
                    data: [
                        {
                            type: "search",
                            placeholder: "Search vulnerability name...",
                            className: "",
                            name: "search",
                        },
                        {
                            type: "tab",
                            name: "assetType",
                            defaultSelected: "",
                            options: [
                                { id: "", label: "All" },
                                { id: "web_application", label: "Web Application" },
                                { id: "mobile_application", label: "Mobile Application" },
                                { id: "thick_client", label: "Thick Client" },
                            ],
                        },
                    ],
                },
            },
            rows: data?.data
                ? data.data.map((item) => ({
                      ID: { key: "id", value: item.id, type: "hidden" },
                      VulnerabilityId: {
                          key: "vulnerabilityId",
                          value: (
                              <span
                                  className="font-semibold text-orange-600 hover:text-orange-700 dark:text-orange-500 dark:hover:text-orange-700 cursor-pointer transition-all duration-200 underline-offset-2 hover:underline"
                                  onClick={() => handleViewChecklist(item)}
                              >
                                  {Utils.capitalizeEachWord(item.vulnerabilityId)}
                              </span>
                          ),
                      },
                      "Asset Type": {
                          key: "assetType",
                          value: item.assetType
                              .split("_")
                              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                              .join(" "),
                          originalValue: item.assetType,
                      },
                      "Checklist Item": { key: "checklistItem", value: item.checklistItem },
                      Category: { key: "category", value: item.category },
                      Enabled: {
                          key: "isEnabled",
                          value: <ToggleSwitch enabled={!!item.isEnabled} onChange={() => handleToggleEnabled(item)} />,
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
                      Description: { key: "description", value: item.description, type: "hidden" },
                  }))
                : [],
            actions: [
                {
                    icon: <Edit className="w-4 h-4" />,
                    label: "Edit",
                    onClick: (row, index) => {
                        setChecklistDetails(row);
                        setShow((prev) => ({ ...prev, edit: true }));
                    },
                },
                {
                    icon: <Delete className="w-4 h-4" />,
                    label: "Delete",
                    onClick: (row) => handleDeleteSingleChecklist(row?.ID?.value),
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
                    <h1 className="text-3xl font-bold text-foreground dark:text-gray-200">Checklist</h1>
                    <p className="text-muted-foreground mt-1 dark:text-gray-400">Track, assess, and remediate vulnerabilities with a structured checklist.</p>
                </div>
                <Button onClick={openAddModal} className="bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary">
                    <Plus className="h-4 w-4" />
                    Add Checklist
                </Button>
                <Modal
                    show={show.add}
                    onClose={closeModal}
                    title={"Add Checklist"}
                    maxWidth={"1000px"}
                    icon={GlobalICONS.CHECKLIST}
                    description="Provide the required details to configure and register a new checklist"
                >
                    <AddAssets
                        module={{
                            name: "checklist",
                            onSuccess,
                            onCancel: closeModal,
                            form: <ChecklistInfoForm onCancel={closeModal} onSuccess={onSuccess} />,
                            bulkUploadAdditionalFields: [
                                {
                                    type: "select",
                                    name: "assetType",
                                    label: "Asset Type",
                                    placeholder: "Asset Type",
                                    grid: 2,
                                    options: [
                                        { label: "Web Application", value: "web_application" },
                                        { label: "Mobile Application", value: "mobile_application" },
                                        { label: "Thick Client", value: "thick_client" },
                                    ],
                                    validationRules: {
                                        required: true,
                                    },
                                    validateOnChange: true,
                                },
                                {
                                    type: "text",
                                    name: "checklistName",
                                    label: "Checklist Name",
                                    placeholder: "Checklist name",
                                    grid: 2,
                                },
                            ],
                        }}
                    />
                </Modal>
            </div>
            <ChecklistStats />
            <Modal show={show.edit} onClose={closeModal} title={"Edit Checklist Details"} maxWidth={"1000px"} icon={GlobalICONS.CHECKLIST} description="Edit the checklist details below.">
                <ChecklistInfoForm data={checklistDetails} onCancel={closeModal} onSuccess={onSuccess} />
            </Modal>
            <Modal
                show={show.view}
                onClose={closeModal}
                title={"Checklist Details"}
                maxWidth={"1600px"}
                icon={GlobalICONS.CHECKLIST}
                description="Detailed information for the selected checklist item."
            >
                {checklistDetails ? <ChecklistDetails data={checklistDetails} /> : <div className="p-4 text-center">Loading checklist details...</div>}
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

export default Checklist;
