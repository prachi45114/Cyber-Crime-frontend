import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, ArrowDownCircle, ArrowUpCircle, CalendarCheck, CheckCircle2, Clock, Edit, FileText, MinusCircle, Plus, RefreshCcw, XCircle } from "lucide-react";
import Utils from "@/utils";
import NewTable from "@/components/Table";
import { Button } from "@/components/ui/button";
import Modal from "@/components/Popup/Popup";
import { ProjectInfoForm } from "./components/form";
import GlobalICONS from "@/lib/utils/icons";
import ModalPopup from "@/components/ui/modal";
import { PROJECT_API } from "@/lib/utils/apiEndPoints/project";
import CanAccess from "@/components/CanAccess";

const Projects = () => {
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
        const url = PROJECT_API.LIST;
        return {
            url,
            filters: {
                row1: {
                    data: [
                        {
                            type: "search",
                            placeholder: "Search project name...",
                            className: "",
                            name: "search",
                        },
                        {
                            type: "select",
                            name: "status",
                            label: "Status",
                            options: [
                                { label: "In Progress", value: "in_progress" },
                                { label: "Completed", value: "completed" },
                                { label: "Cancelled", value: "cancelled" },
                            ],
                        },
                        {
                            type: "select",
                            name: "priority",
                            label: "Priority",
                            options: [
                                { label: "High", value: "high" },
                                { label: "Medium", value: "medium" },
                                { label: "Low", value: "low" },
                            ],
                        },
                    ],
                },
            },
            rows: data?.projects
                ? data.projects.map((item) => ({
                      ID: { key: "id", value: item.id, type: "hidden" },
                      Name: {
                          key: "name",
                          value: (
                              <Link
                                  className="font-semibold text-orange-600 hover:text-orange-700 dark:text-orange-500 dark:hover:text-orange-700 cursor-pointer transition-all duration-200 underline-offset-2 hover:underline"
                                  to={`/project/${item.id}`}
                              >
                                  {Utils.capitalizeEachWord(item.name)}
                              </Link>
                          ),
                      },
                      Client: { key: "clientName", value: item.clientName },
                      Priority: {
                          key: "priority",
                          value: (() => {
                              const { className, icon } = priorityStyles[item.priority] || {
                                  className: "bg-gray-100 text-gray-700",
                                  icon: null,
                              };

                              return (
                                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${className}`}>
                                      {icon}
                                      {Utils.capitalizeEachWord(item.priority)}
                                  </span>
                              );
                          })(),
                      },
                      Status: {
                          key: "status",
                          value: (() => {
                              const getStatusIcon = (status) => {
                                  switch (status) {
                                      case "in_progress":
                                          return <RefreshCcw className="w-4 h-4" />;
                                      case "completed":
                                          return <CheckCircle2 className="w-4 h-4" />;
                                      case "cancelled":
                                          return <XCircle className="w-4 h-4" />;
                                      default:
                                          return <Clock className="w-4 h-4" />;
                                  }
                              };

                              return (
                                  <span className={`flex items-center gap-1 ${statusColorMap[item.status] || "text-gray-500"}`}>
                                      {getStatusIcon(item.status)}
                                      {Utils.capitalizeEachWord(item.status.replace(/_/g, " "))}
                                  </span>
                              );
                          })(),
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
                  }))
                : [],
            totalPages: parseInt(data?.totalPages || 1),
            totalDocuments: data?.total || 0,
            formatTableData,
            hasCheckbox: false,
            refreshTable: refreshTable,
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
                    <h1 className="text-3xl font-bold text-foreground dark:text-gray-200">Projects</h1>
                    <p className="text-muted-foreground mt-1 dark:text-gray-400">Manage and test security projects across your organization</p>
                </div>
                <CanAccess resource="projects" action="create|manage" hideDenied={true}>
                    <Button onClick={() => setShow(true)} className="bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Project
                    </Button>
                </CanAccess>
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
                <ProjectInfoForm onCancel={() => setShow(false)} onSuccess={onSuccess} />
            </ModalPopup>
        </div>
    );
};

export default Projects;
