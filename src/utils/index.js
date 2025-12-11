import { constants } from "./constants";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
const { default: apiClient } = require("../services/api/config");

class Utils {
    static capitalizeEachWord = (name) => {
        if (name && typeof name === "string") {
            return name.replace(/\b\w/g, (match) => match.toUpperCase());
        } else {
            return "";
        }
    };

    static getCurrentMonthName() {
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        const currentDate = new Date();
        const currentMonthIndex = currentDate.getMonth(); // getMonth() returns an index from 0 to 11

        return monthNames[currentMonthIndex];
    }

    static GetTableData = () => {
        return {
            title: "",
            rows: "",
            action: true,
            actionData: [],
            searchBar: true,
            searchUrl: "",
            export: true,
            exportDataUrl: ``,
            print: true,
            printUrl: ``,
            reset: true,
            pagination: true,
            paginationUrl: ``,
            totalPage: 1,
            totalItemCount: 1,
            autoSuggestionUrl: "",
            sorting: true,
            initialSort: "name",
            initialSortOrder: "asc",
            getTableData: this.GetTableData,
            allAction: "",
        };
    };

    static getFormatedDate = (dateString) => {
        if (!dateString) {
            return "";
        }
        const dateObj = new Date(dateString);
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        let day = dateObj.getDate();
        const month = monthNames[dateObj.getMonth()];
        const year = dateObj.getFullYear();

        if (day < 10) {
            day = "0" + day;
        }
        const formattedDate = `${day}-${month}-${year}`;

        return formattedDate;
    };

    static handleViewFile = async (fileUrl) => {
        try {
            const response = await apiClient.get(fileUrl, {
                responseType: "blob",
            });

            const url = window.URL.createObjectURL(new Blob([response.data], { type: response.headers["content-type"] }));
            window.open(url);

            setTimeout(() => {
                window.URL.revokeObjectURL(url);
            }, 1000);
        } catch (error) {
            console.error("View failed:", error);
        }
    };

    static appendTokenToUrl = (url, token) => {
        if (!url) return "";
        const hasQueryParams = url.includes("?");
        return `${url}${hasQueryParams ? "&" : "?"}token=${token}`;
    };

    static getToken() {
        return process.env.REACT_APP_EXPORT_TOKEN;
    }

    static formatDateForDateInput = (dateString) => {
        if (!dateString) {
            return "";
        }

        const parts = dateString.split("-");
        return `${parts[2]}-${parts[0]}-${parts[1]}`;
    };

    // static renderJson = (json) => {
    //     if (!json) {
    //         return;
    //     }
    //     const formatJson = (obj) => {
    //         return Object.entries(obj).map(([key, value]) => {
    //             const isObject = value && typeof value === "object";
    //             return (
    //                 <div key={key} style={{ marginBottom: "10px" }}>
    //                     <span style={{ color: "#ff9800", fontWeight: "bold" }}>{key}: </span>
    //                     {isObject ? <div style={{ paddingLeft: "20px" }}>{formatJson(value)}</div> : <span style={{ color: "#4caf50", wordBreak: "break-all" }}>{JSON.stringify(value)}</span>}
    //                 </div>
    //             );
    //         });
    //     };

    //     return formatJson(json);
    // };

    static renderJson = (json, formatNestedJson = false) => {
        if (!json) {
            return;
        }

        const isValidJson = (str) => {
            try {
                const parsed = JSON.parse(str);
                return typeof parsed === "object" && parsed !== null;
            } catch (error) {
                return false;
            }
        };

        const formatJson = (obj) => {
            return Object.entries(obj).map(([key, value]) => {
                // Only attempt to parse if the value is a string and appears to be JSON
                if (formatNestedJson && typeof value === "string" && isValidJson(value)) {
                    try {
                        value = JSON.parse(value); // Parse the JSON string into an object
                    } catch (error) {
                        console.warn(`Failed to parse field "${key}" as JSON:`, error);
                    }
                }

                const isObject = value && typeof value === "object";
                return (
                    <div key={key} style={{ marginBottom: "10px" }}>
                        <span style={{ color: "#ff9800", fontWeight: "bold" }}>{key}: </span>
                        {isObject ? <div style={{ paddingLeft: "20px" }}>{formatJson(value)}</div> : <span style={{ color: "#4caf50", wordBreak: "break-all" }}>{JSON.stringify(value)}</span>}
                    </div>
                );
            });
        };

        return formatJson(json);
    };

    static getTimeline = () => {
        const today = new Date();
        let startDate, endDate;

        if (today.getDate() >= 21) {
            startDate = new Date(today.getFullYear(), today.getMonth() - 1, 21);
            endDate = new Date(today.getFullYear(), today.getMonth(), 20);
        } else {
            startDate = new Date(today.getFullYear(), today.getMonth() - 2, 21);
            endDate = new Date(today.getFullYear(), today.getMonth() - 1, 20);
        }

        // Formatting dates to 'YYYY-MM-DD'
        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            return `${year}-${month}-${day}`;
        };

        return {
            startDate: formatDate(startDate),
            endDate: formatDate(endDate),
        };
    };

    static debounce = (func, delay) => {
        let debounceTimer;
        return (...args) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => func(...args), delay);
        };
    };

    static unixTimestampToDate(unixTimestamp) {
        const date = new Date(unixTimestamp * 1000);

        const options = {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour12: false,
        };

        const formattedDate = date.toLocaleString("en-GB", options);

        return formattedDate;
    }

    static formatUnixDateTimeToInput = (unixTimestamp) => {
        if (!unixTimestamp) return "";

        const date = new Date(unixTimestamp * 1000);
        const datePart = date.toISOString().split("T")[0];
        const timePart = date.toTimeString().slice(0, 5);
        console.log(`${datePart}T${timePart}`);
        return `${datePart}T${timePart}`;
    };

    static formatDateTime(isoString, isTimeExclude = false) {
        if (!isoString) {
            return "";
        }
        const date = new Date(isoString);

        // Add 5 hours and 30 minutes for Indian Standard Time (IST)
        date.setMinutes(date.getMinutes() + 330); // 330 minutes = 5 hours 30 minutes

        // Define months for conversion
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        // Extract day, month, and year
        const day = date.getUTCDate();
        const month = months[date.getUTCMonth()];
        const year = date.getUTCFullYear();

        // Extract hours and minutes, ensuring AM/PM format
        let hours = date.getUTCHours();
        const minutes = String(date.getUTCMinutes()).padStart(2, "0");
        const period = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12; // Convert hours to 12-hour format
        if (isTimeExclude) {
            return `${day}-${month}-${year}`;
        }
        return `${day}-${month}-${year} ${hours}:${minutes} ${period}`;
        // Assemble the final formatted string

        // const date = new Date(isoString);

        // // Add 5 hours and 30 minutes for Indian Standard Time (IST)
        // date.setMinutes(date.getMinutes() + 330); // 330 minutes = 5 hours 30 minutes

        // // Define months for conversion
        // const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        // // Extract day, month, and year
        // const day = date.getDate(); // Use getDate instead of getUTCDate
        // const month = months[date.getMonth()]; // Use getMonth instead of getUTCMonth
        // const year = date.getFullYear(); // Use getFullYear instead of getUTCFullYear

        // // Extract hours and minutes, ensuring AM/PM format
        // let hours = date.getHours(); // Use getHours instead of getUTCHours
        // const minutes = String(date.getMinutes()).padStart(2, "0");
        // const period = hours >= 12 ? "PM" : "AM";
        // hours = hours % 12 || 12; // Convert hours to 12-hour format

        // if (isTimeExclude) {
        //     return `${day}-${month}-${year}`;
        // }
        // return `${day}-${month}-${year} ${hours}:${minutes} ${period}`;
    }

    static getProtocolIcon = (protocol) => {
        const icons = {
            HTTP: "🌐",
            HTTPS: "🔒",
            FTP: "📂",
            TCP: "🔗",
            UDP: "📶",
            RDP: "💻",
            SSH: "🔐",
            SMTP: "📧",
            DNS: "📡",
            POP3: "📬",
            IMAP: "📧",
            SMB: "📂",
            SFTP: "🔐",
            Telnet: "🖧",
            MQTT: "📡",
            BACNET: "🏢",
            MODBUS: "⚡",
            SNMP: "🖥️",
        };
        return icons[protocol] || "❓";
    };

    static formatTimestamp(stringDate) {
        if (!stringDate) return;
        const [datePart, timePart] = stringDate.split("T");
        const [year, month, day] = datePart.split("-");

        const formattedDate = `${year}-${month}-${day}T${timePart}`;
        const date = new Date(formattedDate);
        date.setHours(date.getHours() + 5);
        date.setMinutes(date.getMinutes() + 30);

        return date.toLocaleString("en-US", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
        });
    }
    static getSerialNumberForIndex(currentPage, limit, index) {
        const startSno = (parseInt(currentPage) - 1) * parseInt(limit) + 1;
        return startSno + parseInt(index);
    }
    static formatToIndianNumberingSystem = (number) => {
        if (isNaN(number)) {
            return 0;
        }
        return new Intl.NumberFormat("en-IN").format(number);
    };

    static isFutureDate(dateString) {
        if (dateString) {
            const inputDate = new Date(dateString);
            const currentDate = new Date();

            // Convert both dates to YYYY-MM-DD string format for a reliable comparison
            const inputDateOnly = inputDate.toISOString().split("T")[0];
            const currentDateOnly = currentDate.toISOString().split("T")[0];

            // console.log("Input Date:", inputDateOnly, "Current Date:", currentDateOnly, "Result:", inputDateOnly >= currentDateOnly);

            return inputDateOnly >= currentDateOnly;
        }
    }

    static getDefaultDate = (daysAgo = 0) => {
        const date = new Date();
        date.setDate(date.getDate() - daysAgo);
        return date.toISOString().split("T")[0];
    };
    static getLast31DaysTimeline() {
        const today = new Date(); // Current date
        const pastDate = new Date(); // To calculate 31 days ago
        pastDate.setDate(today.getDate() - 31);

        // Get formatted day, month, and year for both dates
        const formatDate = (date) => {
            const day = date.getDate();
            const month = date.toLocaleString("default", { month: "long" }); // Full month name
            const year = date.getFullYear();
            return `${day} ${month} ${year}`;
        };

        // Construct the timeline string
        return `${formatDate(pastDate)} to ${formatDate(today)}`;
    }

    static conformityStatusMap = {
        1: "Major",
        2: "Minor",
        3: "Informational",
        4: "Positive",
    };
    static organizationalUnitMap = {
        1: "DFIR",
        2: "HR",
        3: "Legal",
        4: "DevSecOps",
        5: "Purchase",
        6: "Finance",
        7: "Infra",
    };
    static daysAgo(dateString) {
        const inputDate = new Date(dateString);
        const currentDate = new Date();
        const timeDifference = currentDate - inputDate;
        const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        return daysDifference === 1 ? "1 d ago" : `${daysDifference} d ago`;
    }
    static getNodeConnections(nodeId, data) {
        // Find the node details
        const nodeDetails = data.find((item) => item.id === nodeId);

        if (!nodeDetails) {
            return null;
        }

        // Find incoming nodes (nodes that have a relationship pointing TO this node)
        const incomingNodes = data
            .filter((item) => item.type === "relationship" && item.target_ref === nodeId)
            .map((rel) => {
                // Return the source node details
                return data.find((node) => node.id === rel.source_ref);
            });

        // Find outgoing nodes (nodes that this node has a relationship pointing TO)
        const outgoingNodes = data
            .filter((item) => item.type === "relationship" && item.source_ref === nodeId)
            .map((rel) => {
                // Return the target node details
                return data.find((node) => node.id === rel.target_ref);
            });

        return {
            nodeDetails,
            incomingNodes,
            outgoingNodes,
        };
    }
    static extractIPAddress(input) {
        const match = input.match(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/);
        return match ? match[0] : null;
    }
    static jsonToXml(json) {
        let xml = "<event>\n";

        for (let key in json) {
            xml += `    <${key}>${json[key]}</${key}>\n`;
        }

        xml += "</event>";
        return xml;
    }

    static parseValue = (str) => {
        return /^\d+(\s\d+)*$/.test(str) ? Number(str) : str;
    };

    static createEnum = (definitions) => {
        const enumObject = {};
        const labels = {};

        // Create enum values and labels
        definitions.forEach(({ key, value, label }) => {
            enumObject[key] = value;
            labels[value] = label;
        });
        return Object.freeze({
            ...enumObject,
            labels,
            getLabel: function (value) {
                return this.labels?.[value] || this.labels?.[enumObject?.[value]] || "";
            },
            getOptions: function () {
                return Object.entries(this.labels).map(([value, label]) => ({
                    value: Utils.parseValue(value),
                    label,
                }));
            },
        });
    };

    static parseRelativeDate = (relativeString) => {
        const now = new Date();
        now.setUTCSeconds(0, 0);
        now.setUTCHours(now.getUTCHours() + 5);
        now.setUTCMinutes(now.getUTCMinutes() + 30);

        if (relativeString === "now") {
            return { start: now.toISOString(), end: now.toISOString() };
        }

        if (relativeString.includes("/")) {
            const [base, unit] = relativeString.split("/");
            const baseDate = base === "now" ? new Date(now) : new Date(Utils.parseRelativeDate(base).start);

            const startDate = new Date(baseDate);
            const endDate = new Date(baseDate);

            switch (unit) {
                case "w": // Full current week (Sunday to Saturday)
                    startDate.setUTCDate(baseDate.getUTCDate() - baseDate.getUTCDay());
                    startDate.setUTCHours(0, 0, 0, 0);
                    endDate.setUTCDate(startDate.getUTCDate() + 6);
                    endDate.setUTCHours(23, 59, 59, 999);
                    return { start: startDate.toISOString(), end: endDate.toISOString() };
                case "M": // Full current month
                    startDate.setUTCDate(1);
                    startDate.setUTCHours(0, 0, 0, 0);
                    endDate.setUTCMonth(baseDate.getUTCMonth() + 1, 0);
                    endDate.setUTCHours(23, 59, 59, 999);
                    return { start: startDate.toISOString(), end: endDate.toISOString() };
                case "y": // Full current year
                    startDate.setUTCFullYear(baseDate.getUTCFullYear(), 0, 1);
                    startDate.setUTCHours(0, 0, 0, 0);
                    endDate.setUTCFullYear(baseDate.getUTCFullYear(), 11, 31);
                    endDate.setUTCHours(23, 59, 59, 999);
                    return { start: startDate.toISOString(), end: endDate.toISOString() };
                case "d": // Full current day
                    startDate.setUTCHours(0, 0, 0, 0);
                    endDate.setUTCHours(23, 59, 59, 999);
                    return { start: startDate.toISOString(), end: endDate.toISOString() };
                default:
                    return { start: now.toISOString(), end: now.toISOString() };
            }
        }

        const [_, base, operator, numberStr, unit] = relativeString.match(/([a-z]+)([+-])(\d+)([smhdwMy])/) || [];
        if (!base || base !== "now" || !operator || !numberStr || !unit) {
            try {
                let dateString;

                // Check if the format is like "Apr 1, 2025 @ 17:30:00.000"
                const customFormatMatch = relativeString.match(/([A-Za-z]+)\s+(\d+),\s+(\d+)\s+@\s+(\d+):(\d+):(\d+)\.(\d+)/);

                if (customFormatMatch) {
                    // Parse the custom format manually
                    const [_, month, day, year, hours, minutes, seconds, ms] = customFormatMatch;

                    // Convert month name to month number (0-11)
                    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                    const monthIndex = monthNames.findIndex((m) => month.startsWith(m));

                    if (monthIndex !== -1) {
                        dateString = new Date(Date.UTC(parseInt(year), monthIndex, parseInt(day), parseInt(hours), parseInt(minutes), parseInt(seconds), parseInt(ms)));
                    } else {
                        throw new Error("Invalid month name");
                    }
                } else {
                    // Try standard date parsing
                    dateString = new Date(relativeString);
                }

                // Check if the date is valid
                if (isNaN(dateString.getTime())) {
                    console.warn("Invalid date format:", relativeString);
                    return { start: now.toISOString(), end: now.toISOString() };
                }

                return { start: dateString.toISOString(), end: dateString.toISOString() };
            } catch (error) {
                console.error("Date parsing error:", error, relativeString);
                return { start: now.toISOString(), end: now.toISOString() };
            }
        }

        const polarity = operator === "+" ? 1 : -1;
        const amount = parseInt(numberStr) || 0;

        const newNow = new Date(now);
        newNow.setUTCSeconds(0, 0);
        const startDate = new Date(newNow);

        switch (unit) {
            case "s": // seconds
                startDate.setUTCSeconds(startDate.getUTCSeconds() + polarity * amount);
                break;
            case "m": // minutes
                startDate.setUTCMinutes(startDate.getUTCMinutes() + polarity * amount);
                break;
            case "h": // hours
                startDate.setUTCHours(startDate.getUTCHours() + polarity * amount);
                break;
            case "d": // days
                startDate.setUTCDate(startDate.getUTCDate() + polarity * amount);
                break;
            case "w": // weeks
                startDate.setUTCDate(startDate.getUTCDate() + polarity * amount * 7);
                break;
            case "M": // months
                startDate.setUTCMonth(startDate.getUTCMonth() + polarity * amount);
                break;
            case "y": // years
                startDate.setUTCFullYear(startDate.getUTCFullYear() + polarity * amount);
                break;
            default:
                return { start: now.toISOString(), end: now.toISOString() };
        }

        return {
            start: startDate.toISOString(),
            end: newNow.toISOString(),
        };
    };

    static formatLogViewerDate = (isoString, resetSeconds = true) => {
        const date = new Date(isoString);

        if (resetSeconds) {
            // Zero out seconds and milliseconds
            date.setSeconds(0, 0);
        }

        // Format pieces in local time
        const year = date.getFullYear();
        const day = date.getDate().toString().padStart(2, "0");
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const month = monthNames[date.getMonth()];
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        const seconds = date.getSeconds().toString().padStart(2, "0");
        const milliseconds = Math.floor(date.getMilliseconds() / 10)
            .toString()
            .padStart(2, "0");

        // Return human-readable string
        return `${day} ${month} ${year} @ ${hours}:${minutes}:${seconds}.${milliseconds}`;
    };

    static getSeverity = (severity) => {
        const severityMap = {
            1: "critical",
            2: "high",
            3: "medium",
            4: "low",
        };
        return severityMap[severity] || "NA";
    };

    static getCaseSeverity = (severity) => {
        const severityMap = {
            1: "high",
            2: "medium",
            3: "low",
        };
        return severityMap[severity] || "NA";
    };

    static dateToUnixTimestamp(dateString) {
        if (!dateString) return null;
        const date = new Date(dateString);
        const unixTimestamp = Math.floor(date.getTime() / 1000);
        return unixTimestamp;
    }

    static formatStatusOption = (statusList) => {
        // statusList = statusList.filter((item) => item.tid !== "2");
        return statusList.map((item) => {
            return { value: item.tid, label: item.term_name };
        });
    };

    static formatUserOption = (data) => {
        return data.map((item) => {
            return { value: item.mail, label: item.full_name };
        });
    };

    static getCurrentDateForInput(type = "date") {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-based
        const day = String(today.getDate()).padStart(2, "0");

        if (type === "datetime-local") {
            const hours = String(today.getHours()).padStart(2, "0");
            const minutes = String(today.getMinutes()).padStart(2, "0");
            return `${year}-${month}-${day}T${hours}:${minutes}`;
        } else {
            return `${year}-${month}-${day}`;
        }
    }

    static commonFormFields = (data = null, statusList, userList, notTaken = {}, conditions = null, error = {}, formValues = {}) => {
        let formItems = [
            {
                type: "text",
                name: "title",
                label: "Title",
                placeholder: "Title",
                required: true,
                grid: 1,
                defaultValue: formValues?.title || data?.title,
            },
            {
                type: "datetime-local",
                name: "start_date",
                label: "Start Date",
                grid: 2,
                required: true,
                defaultValue:
                    this.formatUnixDateTimeToInput(formValues?.start_date) || (data?.start_date && this.formatUnixDateTimeToInput(data?.start_date)) || this.getCurrentDateForInput("datetime-local"),
            },
            {
                type: "datetime-local",
                name: "due_date",
                label: "End Date",
                grid: 2,
                required: true,
                defaultValue: this.formatUnixDateTimeToInput(formValues?.due_date) || (data?.due_date && this.formatUnixDateTimeToInput(data?.due_date || "")),
            },
            {
                type: "number",
                name: "story_point",
                label: "Assigned Hours",
                grid: 2,
                // required: true,
                // options: this.storyPoints(),
                defaultValue: formValues?.story_point || data?.story_point || "0",
            },
            {
                type: "select",
                name: "assignee",
                label: "Assignee",
                grid: 2,
                required: true,
                options: this.formatUserOption(userList || []),
                defaultValue: formValues?.assignee || data?.assignee || "",
            },
            {
                type: "select",
                name: "status",
                label: "Status",
                grid: 2,
                required: true,
                options: this.formatStatusOption(statusList?.[constants.VARIABLES.STATUS]?.data || []),
                defaultValue: formValues?.status || data?.status || "1",
            },
            {
                type: "select",
                name: "mentions",
                label: "Mentions",
                multiple: true,
                grid: 2,
                options: this.formatUserOption(userList || []),
                defaultValue: formValues?.mentions || data?.mentions || "",
            },
            {
                type: "select",
                name: "priority",
                label: "Priority",
                grid: 2,
                required: true,
                options: this.formatStatusOption(statusList?.[constants.VARIABLES.PRIORITY]?.data || []),
                defaultValue: formValues?.priority || data?.priority,
            },
            // {
            //     type: "file",
            //     name: "attachment_uri",
            //     label: "Attachment Files",
            //     multiple: true,
            //     grid: 1,
            //     defaultValue: formValues?.attachment_uri || data ? data?.attachment_uri || [] : null,
            //     updateName: "attachment_uri_add",
            //     deleteName: "attachment_uri_delete",

            // },
            {
                type: "textarea",
                name: "description",
                placeholder: "Write Something Here...",
                label: "Description",
                grid: 1,
                style: { input: { height: "200px" } },
                required: true,
                defaultValue: formValues?.description || data?.description || "",
            },
            {
                type: "textarea",
                name: "assignor_remarks",
                placeholder: "Write Something Here...",
                label: "Assignor remarks",
                grid: 1,
                style: { input: { height: "70px" } },
                defaultValue: formValues?.assignor_remarks || data?.assignor_remarks || "",
            },
        ];

        if (notTaken) {
            formItems = formItems.filter((item) => !(item.name in notTaken));
        }
        if (conditions) {
            formItems = formItems.map((item) => ({ ...item, type: conditions[item.name]?.type || item.type, defaultValue: conditions[item.name]?.defaultValue || item.defaultValue }));
        }
        return formItems;
    };

    static cn(...inputs) {
        return twMerge(clsx(inputs));
    }

    static getSeverityColorMap = {
        1: "bg-red-500",
        2: "bg-yellow-500",
        3: "bg-green-500",
        4: "bg-gray-500",
    };

    static copyInterceptors = (source, target) => {
        // Copy request interceptors
        source.interceptors.request.handlers.forEach((handler) => {
            if (handler) {
                target.interceptors.request.use(handler.fulfilled, handler.rejected);
            }
        });

        // Copy response interceptors
        source.interceptors.response.handlers.forEach((handler) => {
            if (handler) {
                target.interceptors.response.use(handler.fulfilled, handler.rejected);
            }
        });
    };

    static formatDateForLogViewer = (date) => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} @ ${date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
            fractionalSecondDigits: 3,
        })}`;
    };
}

export default Utils;

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}
