import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CalendarCheck, CheckCircle2, Clock, Edit, FileText, Plus, RefreshCcw, Trash } from "lucide-react";
import Utils from "@/utils";
import NewTable from "@/components/Table";
import { Button } from "@/components/ui/button";
import Modal from "@/components/Popup/Popup";
// import { UserInfoForm } from "./components/form";
import GlobalICONS from "@/lib/utils/icons";
import ModalPopup from "@/components/ui/modal";
import { PERMISSIONS_API } from "@/lib/utils/apiEndPoints/permissions";
// import UserDetails from "./components/details";
import GlobalUtils from "@/lib/utils/GlobalUtils";

const Permissions = () => {
    const [show, setShow] = useState({ add: false, edit: false, delete: false });
    const [refreshTable, setRefreshTable] = useState(false);

    const formatTableData = (data) => {
        const url = PERMISSIONS_API.LIST;
        return {
            url,
            filters: {
                row1: {
                    data: [
                        {
                            type: "search",
                            placeholder: "Search Permissions...",
                            className: "",
                            name: "searchText",
                        },
                    ],
                },
            },
            rows: Array.isArray(data)
                ? data.map((item) => ({
                      "Permission Name": { key: "name", value: Utils.capitalizeEachWord(item.name) },
                      Modules: {
                          key: "resource",
                          value: (
                              <Link
                                  className="font-semibold text-orange-600 hover:text-orange-700 dark:text-orange-500 dark:hover:text-orange-700 cursor-pointer transition-all duration-200 underline-offset-2 hover:underline"
                                  to={`/user/${item.id}`}
                              >
                                  {Utils.capitalizeEachWord(item.resource)}
                              </Link>
                          ),
                      },
                      "Permission Type": { key: "action", value: Utils.capitalizeEachWord(item.action) },
                      Status: {
                          key: "isActive",
                          value: (
                              <span className={`flex items-center gap-1 ${item.isActive ? "text-green-600" : "text-red-600"}`}>
                                  {item.isActive ? <CheckCircle2 className="w-4 h-4" /> : <RefreshCcw className="w-4 h-4" />}
                                  {item.isActive ? "Active" : "Inactive"}
                              </span>
                          ),
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
                      _raw: { key: "_raw", value: item, type: "hidden" },
                  }))
                : [],
            // actions: [
            //     {
            //         icon: <Edit className="w-4 h-4" />,
            //         label: "Edit",
            //         onClick: (row) => {
            //             const userDetails = row._raw?.value;
            //             setUserDetails(userDetails);
            //             setShow({ add: false, edit: true, delete: false });
            //         },
            //     },

            //     {
            //         icon: <Trash className="w-4 h-4" />,
            //         label: "Delete",
            //         onClick: (row) => {
            //             const userId = row?.["ID"]?.value;
            //             setUserDetails({ id: userId });
            //             setShow({ add: false, edit: false, delete: true });
            //         },
            //     },
            // ],
            totalPages: parseInt(data?.totalPages || 1),
            totalDocuments: data?.total || 0,
            formatTableData,
            hasCheckbox: false,
            refreshTable,
        };
    };
    const onSuccess = () => {
        setRefreshTable((prev) => !prev);
        closeModal();
    };
    const tableConfig = useMemo(() => formatTableData({}), [refreshTable]);
    return (
        <div className="">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground dark:text-gray-200">Permissions</h1>
                    <p className="text-muted-foreground mt-1">Check Out the List of Premissions</p>
                </div>
                {/* <Button onClick={() => setShow({ add: true, edit: false, delete: false })} className="bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Permission
                </Button> */}
            </div>
            <div>
                <NewTable tableConfig={tableConfig} />
            </div>
        </div>
    );
};

export default Permissions;
