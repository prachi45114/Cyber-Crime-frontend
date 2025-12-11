import ConfirmationAlert from "@/components/ConfirmationAlert";
import ApiUtils from "@/services/utils";
import axios from "axios";

import { File, FileText, FileImage, FileSpreadsheet, FileArchive, FileCode, FileAudio, FileVideo, FileJson, FileType, FileIcon } from "lucide-react";

class GlobalUtils {
    static capitalizeEachWord = (name) => {
        if (name && typeof name === "string") {
            return name.replace(/\b\w/g, (match) => match.toUpperCase());
        } else {
            return "";
        }
    };

    static getSelectOptions = (data, labelField, valueField, arrayname) => {
        return (
            (Array.isArray(data) &&
                data?.map((item) => ({
                    value: item[valueField],
                    label: item[labelField],
                }))) ||
            []
        );
    };

    static getCurrentMonthName() {
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        const currentDate = new Date();
        const currentMonthIndex = currentDate.getMonth();
        return monthNames[currentMonthIndex];
    }

    static getFormattedDate = (timestamp) => {
        const dateObj = new Date(timestamp * 1000);
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        let day = dateObj.getDate();
        const month = monthNames[dateObj.getMonth()];
        const year = dateObj.getFullYear();

        if (day < 10) {
            day = "0" + day;
        }

        const formattedDate = `${day} ${month} ${year}`;
        return formattedDate;
    };

    static getFormattedDateWithTime = (timestamp) => {
        const dateObj = new Date(timestamp * 1000);
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        let day = dateObj.getDate();
        const month = monthNames[dateObj.getMonth()];
        const year = dateObj.getFullYear();

        if (day < 10) {
            day = "0" + day;
        }

        let hours = dateObj.getHours();
        let minutes = dateObj.getMinutes();

        if (hours < 10) {
            hours = "0" + hours;
        }
        if (minutes < 10) {
            minutes = "0" + minutes;
        }

        const formattedDate = `${day} ${month} ${year} ${hours}:${minutes}`;
        return formattedDate;
    };

    static handleViewFile = async (fileUrl) => {
        try {
            const response = await axios.get(fileUrl, {
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
        if (!url) return null;
        const hasQueryParams = url.includes("?");
        const queryParams = window.location.href.split("?")[1];
        const exportToken = token || ApiUtils.getAuthToken();
        let exportUrl = "";
        if (queryParams) {
            exportUrl = `${url}${hasQueryParams ? "&" : "?"}${queryParams}&token=${exportToken}`;
        } else {
            exportUrl = `${url}${hasQueryParams ? "&" : "?"}token=${exportToken}`;
        }
        return exportUrl;
    };

    static getToken() {
        return localStorage.getItem("asset");
    }

    static formatDateForDateInput = (dateString) => {
        if (!dateString) {
            return "";
        }

        return dateString.split("T")[0];
    };

    static renderJson = (json, primaryColor, secondaryColor, fontWeight) => {
        const formatJson = (obj) => {
            const entries = Array.isArray(obj) ? obj.map((value, index) => [index, value]) : Object.entries(obj);

            return entries.map(([key, value]) => {
                const isObject = value && typeof value === "object";
                const isArray = Array.isArray(value);
                const displayValue = isArray ? value : JSON.stringify(value);

                return (
                    <div key={key} style={{ marginBottom: "10px" }}>
                        <span style={{ color: primaryColor || "#ff9800", fontWeight: fontWeight || "bold" }}>{key}: </span>
                        {isObject && !isArray ? (
                            <div style={{ paddingLeft: "20px" }}>{formatJson(value)}</div>
                        ) : (
                            <span style={{ color: secondaryColor || "#4caf50", wordBreak: "break-all" }}>{isArray ? displayValue : displayValue}</span>
                        )}
                    </div>
                );
            });
        };

        return formatJson(json);
    };

    static isDateInFuture(timestamp) {
        const dueDate = new Date(timestamp * 1000);

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (dueDate < today) {
            const diffTime = today - dueDate;
            const overdueDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
            return { exceeded: true, overdueDays: overdueDays };
        }
        return { exceeded: false, overdueDays: 0 };
    }

    /**
     * Utility to detect meaningful changes between form payload and existing data
     * Includes deep comparison, type coercion handling, and performance optimizations
     *
     * @param {Object} payload - New form data
     * @param {Object} existingData - Original data to compare against
     * @param {Object} options - Configuration options
     * @returns {boolean} - Returns true if there are meaningful changes
     */

    static hasFormChanges(payload, existingData, options = {}) {
        const {
            ignoreKeys = [], // Keys to exclude from comparison
            targetKeys = [], // Specific keys to compare (if empty, compare all keys)
            trimStrings = true, // Trim strings before comparison
            ignoreEmptyValues = true, // Ignore null/undefined/empty string differences
            precisionForNumbers = 2, // Decimal precision for number comparison
            ignoreKeyOrder = true, // Ignore object key order differences
        } = options;

        // Early return for identical references
        if (payload === existingData) return false;

        // Handle null/undefined cases
        if (!payload || !existingData) return payload !== existingData;

        // Create normalized copies to avoid modifying original data
        const normalizeValue = (value) => {
            if (typeof value === "string" && trimStrings) {
                value = value.trim();
                return ignoreEmptyValues && value === "" ? null : value;
            }
            if (typeof value === "number" && isFinite(value)) {
                return Number(value.toFixed(precisionForNumbers));
            }
            return value;
        };

        const normalizeObject = (obj, keysToCompare = null) => {
            const normalized = {};
            let keys = ignoreKeyOrder ? Object.keys(obj).sort() : Object.keys(obj);

            // Filter keys based on targetKeys if provided
            if (keysToCompare) {
                keys = keys.filter((key) => keysToCompare.includes(key));
            }

            for (const key of keys) {
                if (ignoreKeys.includes(key)) continue;

                const value = obj[key];

                // Skip empty values if configured
                if (ignoreEmptyValues && (value === null || value === undefined || value === "")) {
                    continue;
                }

                if (Array.isArray(value)) {
                    normalized[key] = value.map((item) => (typeof item === "object" && item !== null ? normalizeObject(item) : normalizeValue(item)));
                } else if (typeof value === "object" && value !== null) {
                    normalized[key] = normalizeObject(value);
                } else {
                    normalized[key] = normalizeValue(value);
                }
            }

            return normalized;
        };

        // Determine which keys to compare
        const keysToCompare = targetKeys.length > 0 ? targetKeys : Object.keys(payload);

        // Normalize both objects with the same set of keys
        const normalizedPayload = normalizeObject(payload);
        const normalizedExisting = normalizeObject(existingData, keysToCompare);

        // Use fast-deep-equal for performance
        const isEqual = (obj1, obj2) => {
            if (obj1 === obj2) return true;

            const keys1 = Object.keys(obj1);
            const keys2 = Object.keys(obj2);

            if (keys1.length !== keys2.length) return false;

            for (const key of keys1) {
                const val1 = obj1[key];
                const val2 = obj2[key];

                if (typeof val1 === "object" && val1 !== null && typeof val2 === "object" && val2 !== null) {
                    if (!isEqual(val1, val2)) return false;
                } else if (val1 !== val2) {
                    return false;
                }
            }

            return true;
        };

        return !isEqual(normalizedPayload, normalizedExisting);
    }

    static doughnutChartOptions = (title, data, toolTipText = "") => {
        const pieOptionsStatus = {
            title: {
                text: title,
                left: "center",
            },
            tooltip: {
                trigger: "item",
                formatter: function (params) {
                    return `${params.name}: ${params.value} ${toolTipText}`;
                },
            },
            legend: {
                orient: "horizontal",
                left: "left", // Align the legend to the left
                // top: "center",
            },
            grid: {
                left: "20%", // Adjust the grid to ensure the pie chart isn't overlapped by the legend
            },
            series: [
                {
                    name: "Status",
                    type: "pie",
                    radius: ["40%", "70%"],
                    // center: ["50%", "40%"],
                    data: data?.map((item) => ({ value: item.value, name: item.category })),
                    avoidLabelOverlap: false,
                    label: {
                        show: false,
                    },
                    labelLine: {
                        show: false,
                    },
                },
            ],
        };
        return pieOptionsStatus;
    };

    // utils.js or utils/index.js
    static barChartOptions = (title, data, unit) => {
        const categories = data.map((item) => item.category);
        const values = data.map((item) => item.value);

        return {
            title: {
                text: title,
                subtext: `Unit: ${unit}`,
                left: "center",
            },
            tooltip: {
                trigger: "axis",
            },
            xAxis: {
                type: "category",
                data: categories,
                axisLabel: {
                    interval: 0, // Show all labels
                    rotate: 45, // Rotate labels if needed
                },
            },
            yAxis: {
                type: "value",
                name: unit,
                nameLocation: "middle",
                nameGap: 30,
            },
            series: [
                {
                    name: title,
                    type: "bar",
                    data: values,
                    itemStyle: {
                        color: "#5470C6", // Example color, adjust as needed
                    },
                    emphasis: {
                        itemStyle: {
                            color: "#91CC75", // Highlight color
                        },
                    },
                },
            ],
            // Optional: Add additional configurations for better UX
            grid: {
                left: "3%",
                right: "4%",
                bottom: "3%",
                containLabel: true,
            },
        };
    };

    static pieChartOptions = (options) => {
        const data = options.data;
        const title = options.title;
        const subtitle = options.subtitle;
        // const data = data.map((item) => item.category);
        // const values = data.map((item) => item.value);
        return {
            title: {
                text: title,
                subtext: subtitle,
                left: "center",
            },
            tooltip: {
                trigger: "item",
            },
            //   legend: {
            //     orient: 'vertical',
            //     left: 'left'
            //   },
            series: [
                {
                    //   name: unit,
                    type: "pie",
                    radius: "50%",
                    data: data,
                    // data: values,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: "rgba(0, 0, 0, 0.5)",
                        },
                    },
                },
            ],
        };
    };

    static pieNestChartOptions = (options) => {
        const innerChartdata = options.innerChartdata;
        const outerChartdata = options.outerChartdata;
        // Merging and returning name array
        const legendLabels = [...innerChartdata, ...outerChartdata].map((item) => item.name);

        const title = options.title;
        const subtitle = options.subtitle;
        // const data = data.map((item) => item.category);
        // const values = data.map((item) => item.value);
        return {
            title: {
                text: title,
                left: "center",
            },
            tooltip: {
                trigger: "item",
                formatter: "{a} <br/>{b}: {c} ({d}%)",
            },
            legend: {
                data: legendLabels,
            },
            series: [
                {
                    name: "Status",
                    type: "pie",
                    selectedMode: "single",
                    radius: [0, "30%"],
                    label: {
                        position: "inner",
                        fontSize: 14,
                    },
                    labelLine: {
                        show: false,
                    },
                    data: innerChartdata,
                },
                {
                    name: "Asset Status",
                    type: "pie",
                    radius: ["45%", "60%"],
                    labelLine: {
                        length: 30,
                    },
                    label: {
                        formatter: "{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ",
                        backgroundColor: "#F6F8FC",
                        borderColor: "#8C8D8E",
                        borderWidth: 1,
                        borderRadius: 4,
                        rich: {
                            a: {
                                color: "#6E7079",
                                lineHeight: 22,
                                align: "center",
                            },
                            hr: {
                                borderColor: "#8C8D8E",
                                width: "100%",
                                borderWidth: 1,
                                height: 0,
                            },
                            b: {
                                color: "#4C5058",
                                fontSize: 10,
                                fontWeight: "bold",
                                lineHeight: 33,
                            },
                            per: {
                                color: "#fff",
                                backgroundColor: "#4C5058",
                                padding: [3, 4],
                                borderRadius: 4,
                            },
                        },
                    },
                    data: outerChartdata,
                },
            ],
        };
    };

    static basicBarChartOptions = (options) => {
        const title = options.title;

        const names = options.data.map((item) => item.name);
        const values = options.data.map((item) => item.value);
        return {
            title: {
                text: title,
                left: "center",
            },
            tooltip: {
                trigger: "axis",
                axisPointer: {
                    type: "shadow",
                },
            },
            grid: {
                left: "3%",
                right: "4%",
                bottom: "3%",
                containLabel: true,
            },
            xAxis: [
                {
                    type: "category",
                    data: names,
                    axisTick: {
                        alignWithLabel: true,
                    },
                },
            ],
            yAxis: [
                {
                    type: "value",
                },
            ],
            series: [
                {
                    name: "Direct",
                    type: "bar",
                    barWidth: "60%",
                    data: values,
                },
            ],
        };
    };

    static getFormButtons = (isLoading = false, onCancel) => {
        return [
            {
                label: "Cancel",
                onClick: onCancel,
                variant: "danger",
                flat: true,
                outlined: true,
            },
            {
                label: "Submit",
                type: "Submit",
                variant: "warning",
                loading: isLoading,
            },
        ].filter(Boolean);
    };
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
                    value: GlobalUtils.parseValue(value),
                    label,
                }));
            },
        });
    };

    static async handleDelete({ recordId, onShowDetails, deleteAction, toggleRefreshData }) {
        ConfirmationAlert.showDeleteConfirmation({
            title: "Delete Item",
            text: "Are you sure you want to delete this item?",
            onConfirm: async () => {
                try {
                    if (recordId) {
                        await deleteAction.execute({
                            id: recordId,
                            options: { showNotification: true },
                        });

                        ConfirmationAlert.showSuccess({
                            title: "Deleted!",
                            text: "Your item has been deleted successfully.",
                        });

                        onShowDetails?.(null);
                        toggleRefreshData((prev) => !prev);
                    } else {
                        console.error("Invalid record ID for deletion");
                    }
                } catch (error) {
                    ConfirmationAlert.showError({
                        title: "Deletion Failed",
                        text: error.message || "An unexpected error occurred.",
                    });
                }
            },
            onCancel: () => {
                onShowDetails?.((prev) => ({ ...prev, delete: false }));
            },
        });
    }

    static async handleBulkDelete({ data, onShowDetails, deleteAction, toggleRefreshData }) {
        ConfirmationAlert.showDeleteConfirmation({
            title: "Delete Item",
            text: "Are you sure you want to delete this item?",
            onConfirm: async () => {
                try {
                    if (data) {
                        await deleteAction.execute({
                            idsToDelete: data,
                            options: { showNotification: true },
                        });

                        ConfirmationAlert.showSuccess({
                            title: "Deleted!",
                            text: "Your items has been deleted successfully.",
                        });

                        onShowDetails?.(null);
                        toggleRefreshData((prev) => !prev);
                    } else {
                        console.error("Invalid record ID for deletion");
                    }
                } catch (error) {
                    ConfirmationAlert.showError({
                        title: "Deletion Failed",
                        text: error.message || "An unexpected error occurred.",
                    });
                }
            },
            onCancel: () => {
                onShowDetails?.((prev) => ({ ...prev, delete: false }));
            },
        });
    }

    static formatOptionsData(data) {
        return data?.map((record) => ({ label: record.name, value: record._id }));
    }

    static formatFileSize = (bytes) => {
        if (bytes === 0) return "0 B";

        const sizes = ["B", "KB", "MB", "GB", "TB"];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        const value = bytes / Math.pow(1024, i);

        return `${value.toFixed(2)} ${sizes[i]}`;
    };

    static PdfIcon = (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="-4 0 40 40" fill="none" {...props}>
            <path
                d="M25.6686 26.0962C25.1812 26.2401 24.4656 26.2563 23.6984 26.145C22.875 26.0256 22.0351 25.7739 21.2096 25.403C22.6817 25.1888 23.8237 25.2548 24.8005 25.6009C25.0319 25.6829 25.412 25.9021 25.6686 26.0962ZM17.4552 24.7459C17.3953 24.7622 17.3363 24.7776 17.2776 24.7939C16.8815 24.9017 16.4961 25.0069 16.1247 25.1005L15.6239 25.2275C14.6165 25.4824 13.5865 25.7428 12.5692 26.0529C12.9558 25.1206 13.315 24.178 13.6667 23.2564C13.9271 22.5742 14.193 21.8773 14.468 21.1894C14.6075 21.4198 14.7531 21.6503 14.9046 21.8814C15.5948 22.9326 16.4624 23.9045 17.4552 24.7459ZM14.8927 14.2326C14.958 15.383 14.7098 16.4897 14.3457 17.5514C13.8972 16.2386 13.6882 14.7889 14.2489 13.6185C14.3927 13.3185 14.5105 13.1581 14.5869 13.0744C14.7049 13.2566 14.8601 13.6642 14.8927 14.2326ZM9.63347 28.8054C9.38148 29.2562 9.12426 29.6782 8.86063 30.0767C8.22442 31.0355 7.18393 32.0621 6.64941 32.0621C6.59681 32.0621 6.53316 32.0536 6.44015 31.9554C6.38028 31.8926 6.37069 31.8476 6.37359 31.7862C6.39161 31.4337 6.85867 30.8059 7.53527 30.2238C8.14939 29.6957 8.84352 29.2262 9.63347 28.8054ZM27.3706 26.1461C27.2889 24.9719 25.3123 24.2186 25.2928 24.2116C24.5287 23.9407 23.6986 23.8091 22.7552 23.8091C21.7453 23.8091 20.6565 23.9552 19.2582 24.2819C18.014 23.3999 16.9392 22.2957 16.1362 21.0733C15.7816 20.5332 15.4628 19.9941 15.1849 19.4675C15.8633 17.8454 16.4742 16.1013 16.3632 14.1479C16.2737 12.5816 15.5674 11.5295 14.6069 11.5295C13.948 11.5295 13.3807 12.0175 12.9194 12.9813C12.0965 14.6987 12.3128 16.8962 13.562 19.5184C13.1121 20.5751 12.6941 21.6706 12.2895 22.7311C11.7861 24.0498 11.2674 25.4103 10.6828 26.7045C9.04334 27.3532 7.69648 28.1399 6.57402 29.1057C5.8387 29.7373 4.95223 30.7028 4.90163 31.7107C4.87693 32.1854 5.03969 32.6207 5.37044 32.9695C5.72183 33.3398 6.16329 33.5348 6.6487 33.5354C8.25189 33.5354 9.79489 31.3327 10.0876 30.8909C10.6767 30.0029 11.2281 29.0124 11.7684 27.8699C13.1292 27.3781 14.5794 27.011 15.985 26.6562L16.4884 26.5283C16.8668 26.4321 17.2601 26.3257 17.6635 26.2153C18.0904 26.0999 18.5296 25.9802 18.976 25.8665C20.4193 26.7844 21.9714 27.3831 23.4851 27.6028C24.7601 27.7883 25.8924 27.6807 26.6589 27.2811C27.3486 26.9219 27.3866 26.3676 27.3706 26.1461ZM30.4755 36.2428C30.4755 38.3932 28.5802 38.5258 28.1978 38.5301H3.74486C1.60224 38.5301 1.47322 36.6218 1.46913 36.2428L1.46884 3.75642C1.46884 1.6039 3.36763 1.4734 3.74457 1.46908H20.263L20.2718 1.4778V7.92396C20.2718 9.21763 21.0539 11.6669 24.0158 11.6669H30.4203L30.4753 11.7218L30.4755 36.2428ZM28.9572 10.1976H24.0169C21.8749 10.1976 21.7453 8.29969 21.7424 7.92417V2.95307L28.9572 10.1976ZM31.9447 36.2428V11.1157L21.7424 0.871022V0.823357H21.6936L20.8742 0H3.74491C2.44954 0 0 0.785336 0 3.75711V36.2435C0 37.5427 0.782956 40 3.74491 40H28.2001C29.4952 39.9997 31.9447 39.2143 31.9447 36.2428Z"
                fill="#EB5757"
            />
        </svg>
    );

    static getFileIcon = (mimeType = "") => {
        if (!mimeType) return File;

        const mapping = {
            // PDFs
            "application/pdf": GlobalUtils.PdfIcon,

            // Images
            "image/png": FileImage,
            "image/jpeg": FileImage,
            "image/jpg": FileImage,
            "image/gif": FileImage,
            "image/webp": FileImage,
            "image/svg+xml": FileImage,

            // Spreadsheets
            "application/vnd.ms-excel": FileSpreadsheet,
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": FileSpreadsheet,

            // Word Docs
            "application/msword": FileText,
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document": FileText,

            // PowerPoint
            "application/vnd.ms-powerpoint": FileText,
            "application/vnd.openxmlformats-officedocument.presentationml.presentation": FileText,

            // Archives
            "application/zip": FileArchive,
            "application/x-7z-compressed": FileArchive,
            "application/x-rar-compressed": FileArchive,
            "application/x-tar": FileArchive,

            // Code
            "application/javascript": FileCode,
            "application/json": FileJson,
            "text/html": FileCode,
            "text/css": FileCode,
            "text/javascript": FileCode,

            // Audio / Video
            "audio/mpeg": FileAudio,
            "audio/wav": FileAudio,
            "video/mp4": FileVideo,
            "video/x-matroska": FileVideo,
        };

        return mapping[mimeType] || File; // default fallback
    };
}

export default GlobalUtils;
