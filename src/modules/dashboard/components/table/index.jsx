import React, { useState } from "react";
import styles from "./index.module.css";
import UserAvatar from "@/components/UserAvatar";
import TableUtils from "@/components/table/utils";
import TableIcon from "@/components/table/utils/icon";
import GlobalUtils from "@/lib/utils/GlobalUtils";
import desktopsICONS from "../../utils/icons";
import Table from "@/components/table";
import Modal from "@/components/Popup/Popup";
import StatCard from "@/components/Card/ProgressCard";
import GlobalICONS from "@/lib/utils/icons";

const AnalyticsTable = () => {
    const [show, setShow] = useState({});
    const [userDetails, setUserDetails] = useState(null);

    const closeModel = () => setShow({ add: false, edit: false, delete: false });

    const StatData = {
        data: [
            {
                _id: "6486cae1284e1728606f902c",
                title: "Laptop",
                value: "567",
                subTitle: "Total Laptops",
                icon: GlobalICONS.LAPTOP,
                hasDecrement: false,
                hasIncrement: true,
                iconColor: "orange",
            },
            {
                _id: "6486cae1284e1728606f902c",
                title: "Desktop",
                value: "100",
                subTitle: "Total Desktop",
                icon: GlobalICONS.DESKTOP,
                hasDecrement: false,
                hasIncrement: true,
                iconColor: "blue",
            },
            {
                _id: "6486cae1284e1728606f902c",
                title: "Network Device",
                value: "50",
                subTitle: "Total Network Device",
                icon: GlobalICONS.NETWORKING_DEVICE,
                hasDecrement: true,
                hasIncrement: false,
                iconColor: "red",
            },
            {
                _id: "6486cae1284e1728606f902c",
                title: "Virtual Machine",
                value: "50",
                subTitle: "Total Virtual Machine",
                icon: GlobalICONS.DESKTOP,
                hasDecrement: false,
                hasIncrement: false,
                iconColor: "green",
            },
        ],
    };

    const initializeTableData = {
        totalPages: 16,
        totalDocuments: 156,
        data: [
            {
                _id: "6486cae1284e1728606f902c",
                name: "Beverlie Krabbe",
                email: "bkrabbe1d@home.pl",
                role: "Editor",
                plan: "Company",
                billing: "Manual-Case",
                status: "Active",
                image: "https://demos.pixinvent.com/vuexy-vuejs-laravel-admin-template/demo-1/build/assets/avatar-1-DMk2FF1-.png",
            },
            {
                _id: "6486cae1284e1728606f902c",
                name: "Paulie Durber",
                email: "pdurber1c@gov.uk",
                role: "Subscriber",
                plan: "Team",
                billing: "Manual-PayPal",
                status: "Inactive",
                image: "https://demos.pixinvent.com/vuexy-vuejs-laravel-admin-template/demo-1/build/assets/avatar-2-D5OQ4OGs.png",
            },
            {
                _id: "e45436565",
                name: "Onfre Wind",
                email: "owind1b@yandex.ru",
                role: "Admin",
                plan: "Basic",
                billing: "Manual-PayPal",
                status: "Pending",
                image: "https://demos.pixinvent.com/vuexy-vuejs-laravel-admin-template/demo-1/build/assets/avatar-3-BxDW4ia1.png",
            },
            {
                Id: "e454365",
                name: "Karena Courtliff",
                email: "kcourtliff1a@bbc.co.uk",
                role: "Admin",
                plan: "Basic",
                billing: "Manual-Credit Card",
                status: "Active",
                image: "https://demos.pixinvent.com/vuexy-vuejs-laravel-admin-template/demo-1/build/assets/avatar-6-B6-OBpiL.png",
            },
            {
                Id: "e454365",
                name: "Saunder Offner",
                email: "soffner19@mac.com",
                role: "maintainer",
                plan: "enterprise",
                billing: "Manual-Credit Card",
                status: "Pending",
                image: "https://demos.pixinvent.com/vuexy-vuejs-laravel-admin-template/demo-1/build/assets/avatar-4-CtU30128.png",
            },
            {
                Id: "e454365",
                name: "Corrie Perot",
                email: "cperot18@goo.ne.jp",
                role: "subscriber",
                plan: "team",
                billing: "Manual-Credit Card",
                status: "Pending",
                image: "https://demos.pixinvent.com/vuexy-vuejs-laravel-admin-template/demo-1/build/assets/avatar-5-CmycerLe.png",
            },
            {
                Id: "e454365",
                name: "Vladamir Koschek",
                email: "vkoschek17@abc.net.au",
                role: "author",
                plan: "team",
                billing: "Manual-Credit Card",
                status: "Active",
                image: "https://demos.pixinvent.com/vuexy-vuejs-laravel-admin-template/demo-1/build/assets/avatar-1-DMk2FF1-.png",
            },
            {
                Id: "e454365",
                name: "Micaela McNirlan",
                email: "mmcnirlan16@hc360.com",
                role: "admin",
                plan: "basic",
                billing: "Auto Debit",
                status: "Inactive",
                image: "https://demos.pixinvent.com/vuexy-vuejs-laravel-admin-template/demo-1/build/assets/avatar-2-D5OQ4OGs.png",
            },
            {
                Id: "e454365",
                name: "Benedetto Rossiter",
                email: "brossiter15@craigslist.org",
                role: "editor",
                plan: "team",
                billing: "Auto Debit",
                status: "Inactive",
                image: "https://demos.pixinvent.com/vuexy-vuejs-laravel-admin-template/demo-1/build/assets/avatar-1-DMk2FF1-.png",
            },
            {
                Id: "e454365",
                name: "Edwina Baldetti",
                email: "ebaldetti14@theguardian.com",
                role: "maintainer",
                plan: "team",
                billing: "Auto Debit",
                status: "Pending",
                image: "https://demos.pixinvent.com/vuexy-vuejs-laravel-admin-template/demo-1/build/assets/avatar-1-DMk2FF1-.png",
            },
        ],
    };
    const externalFilters = {
        title: "Users Filters",
        // filterOnSubmit: true,
        filterFields: [
            {
                type: "select",
                name: "role",
                grid: 3,
                options: [
                    { label: "Admin", value: "admin" },
                    { label: "Author", value: "author" },
                    { label: "Editor", value: "editor" },
                    { label: "Maintainer", value: "Maintainer" },
                    { label: "Subscriber", value: "subscriber" },
                ],
                placeholder: "Select Role",
            },
            {
                type: "select",
                name: "plan",
                grid: 3,
                options: [
                    { label: "Basic", value: "basic" },
                    { label: "Company", value: "company" },
                    { label: "Enterprise", value: "enterprise" },
                    { label: "Maintainer", value: "Maintainer" },
                    { label: "Subscriber", value: "subscriber" },
                ],
                placeholder: "Select Plan",
            },
            {
                type: "select",
                name: "status",
                grid: 3,
                options: [
                    { label: "Pending", value: "pending" },
                    { label: "Inactive", value: "inactive" },
                    { label: "Active", value: "active" },
                ],
                placeholder: "Select Status",
            },
        ],
        parentPayloadKey: `[search][filters]`,
    };

    const tableHeader = {
        limit: {
            defaultValue: "10",
            limitStart: "10",
            limitEnd: "50",
            multipleOf: "10",
        },
        actionButtons: [
            {
                variant: "primary",
                icon: TableIcon.PLUS,
                label: "Add  User",
                onClick: () => {
                    setShow({ add: true });
                    console.log("user clicked add user button");
                },
            },
            {
                variant: "secondary",
                flat: true,
                className: styles.export,
                icon: TableIcon.EXPORT,
                label: "Export",
                onClick: () => console.log("user clicked export button"),
            },
        ],
        filters: [
            {
                type: "text",
                name: "searchText",
                grid: 2,
                placeholder: "Search User",
                autoSuggestion: {
                    initialData: TableUtils.formatDataForAutoSuggestion(initializeTableData.data, ["name", "email", "role"]),
                    autoSuggestionUrl: "/api/suggestions",
                    minChars: 1,
                    maxSuggestions: 5,
                },
                className: styles.search_field,
            },
        ],
    };

    function getTableData(data) {
        return {
            title: "Active Employees List",
            rows: data?.data?.map((item) => {
                item.userDetails = {
                    name: item.name,
                    image: item.image,
                    email: item.email,
                    _id: item._id,
                };

                const data = {
                    Id: { key: "_id", value: item._id, type: "hidden" },
                    User: {
                        key: "name",
                        value: <UserAvatar userDetails={item.userDetails} />,
                        originalValue: GlobalUtils.capitalizeEachWord(item.userDetails?.name) || "",
                        suggestionValue: GlobalUtils.capitalizeEachWord(item.userDetails?.name) || "",
                    },
                    Role: {
                        key: "role",
                        value: (
                            <p className={styles.role}>
                                <span className={styles[item.role.toLowerCase()]}>{desktopsICONS?.[item.role.toUpperCase()]}</span>
                                <span>{item.role}</span>
                            </p>
                        ),
                    },
                    Plan: { key: "plan", value: item.plan },
                    billing: { key: "billing", value: <span className={styles.billing}>{item.billing}</span> },
                    status: { key: "status", value: <span className={`${styles.status} ${styles[item.status]}`}>{item.status}</span> },
                };
                return data;
            }),
            actionData: [
                {
                    name: "Delete",
                    functions: (row) => {
                        console.log(row);
                    },
                    label: "Delete User",
                    Id: "Id",
                },
                {
                    name: "View",
                    functions: (row) => {
                        console.log("hg", row["Id"].value);
                    },
                    label: "View  Details",
                    Id: "Id",
                },
                {
                    name: "Edit",
                    functions: (row) => {
                        setUserDetails(data?.data?.find((item) => row["Id"].value === item._id));
                        setShow({ edit: true, add: false, remove: false });
                        // console.log("hg", row["Id"].value);
                    },
                    label: "Edit Details",
                    Id: "Id",
                },
                {
                    name: "Duplicate",
                    functions: (row) => {
                        setUserDetails(data?.data?.find((item) => row["Id"].value === item._id));
                        setShow({ edit: true, add: false, remove: false });
                        // console.log("hg", row["Id"].value);
                    },
                    label: "Duplicate User",
                    Id: "Id",
                },
            ],
            url: `/getlistofuserdata`,
            pagination: {
                totalPage: data.totalPages || "0",
                totalItemCount: data.totalDocuments || "0",
            },
            sorting: {
                initialSort: "User",
                initialSortOrder: "asc",
            },
            getTableData: getTableData,
            rowClickHandler: (row) => {
                console.log(row);
            },
            externalFilters,
            tableHeader,
            //checkbox: true,
        };
    }

    const tableData = React.useMemo(() => getTableData(initializeTableData), []);

    return (
        <div className={styles.container}>
            {<Table tableData={tableData} />}

            <Modal show={show.add} onClose={closeModel} title={"Add User"} maxWidth={"800px"}>
                {/* <UserForm onCancel={closeModel} /> */}
            </Modal>
            <Modal show={show.edit} onClose={closeModel} title={"Edit User"} maxWidth={"800px"}>
                {/* <UserForm onCancel={closeModel} data={userDetails} /> */}
            </Modal>
        </div>
    );
};

export default AnalyticsTable;
