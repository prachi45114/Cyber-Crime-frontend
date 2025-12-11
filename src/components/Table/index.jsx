import { useState, useEffect, useCallback, useRef } from "react";
import { Search, RefreshCw, X, Check } from "lucide-react";
import RulesTabs from "./components/elements/rulesTab";
import { useSearchParams } from "react-router-dom";
import { TablePagination } from "./components/tablePagination";
import { TableRow } from "./components/tableRow";
import TagsDropdown from "./components/elements/tagDropdown";
import SkeletonTable from "./components/tableSkeleton";
import TableDatePicker from "./components/elements/datePicker";
import Utils, { cn } from "@/utils";
import apiClient from "@/services/api/config";

/**
 * Custom checkbox component used for selecting all rows
 *
 * @component
 * @param {Object} props - Component props
 * @param {boolean} props.checked - Whether the checkbox is checked
 * @param {Function} props.onChange - Handler for checkbox change events
 * @returns {JSX.Element} - Rendered checkbox component
 */
const SelectAllCheckbox = ({ checked, onChange }) => (
    <div className="relative flex items-center justify-center" onClick={onChange}>
        <input type="checkbox" id="select-all-checkbox" checked={checked} onChange={onChange} className="sr-only" aria-label="Select all rows" />
        <div
            className={`h-5 w-5 rounded flex items-center justify-center cursor-pointer border transition-colors duration-200 ${
                checked ? "bg-[#E9570E] border-[#E9570E]" : "border-gray-300 dark:border-[#3e3e42] bg-white dark:bg-[#252526]"
            }`}
        >
            {checked && <Check size={14} className="text-white" strokeWidth={3} />}
        </div>
    </div>
);

/**
 * Table header component that renders the column headers
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.tableData - Table configuration data
 * @param {Array} props.selectedRow - Array of selected row IDs
 * @param {Function} props.onSelectAll - Handler for selecting all rows
 * @returns {JSX.Element} - Rendered table header
 */
const TableHeader = ({ tableData, selectedRow, onSelectAll, handleSort, getSortIcon }) => {
    // Check if all rows on the current page are selected
    const allSelected = tableData?.rows?.length > 0 && tableData?.rows.every((row) => selectedRow.includes(row?.["ID"]?.value));

    if (!tableData?.rows?.[0]) return null;

    return (
        <thead className="bg-gray-50 dark:bg-[#252526]">
            <tr>
                {Object.entries(tableData.rows[0]).map(([key, column], index) => {
                    // First column with checkbox
                    if (index === 0 && tableData?.hasCheckbox) {
                        return (
                            <th key={"header-checkbox"} scope="col" className="px-4 w-10">
                                <SelectAllCheckbox checked={allSelected} onChange={onSelectAll} />
                            </th>
                        );
                    }

                    // Skip hidden columns
                    if (column?.type === "hidden") return null;
                    // Regular columns
                    return (
                        <th
                            key={`header-${key}`}
                            onClick={column?.sortable ? () => handleSort(column.key) : undefined}
                            scope="col"
                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-[#858585] uppercase tracking-wider cursor-pointer"
                        >
                            {key}
                            {column.sortable && getSortIcon(column.key)}
                        </th>
                    );
                })}

                {/* Action column if actions exist */}
                {tableData?.actionsInRow?.length > 0 && (
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-[#858585] uppercase tracking-wider">
                        Quick Action
                    </th>
                )}

                {tableData?.actions?.length > 0 && (
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-[#858585] uppercase tracking-wider">
                        Action
                    </th>
                )}

                {tableData?.collapseAction && (
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-[#858585] uppercase tracking-wider">
                        #
                    </th>
                )}
            </tr>
        </thead>
    );
};

/**
 * Renders filter components based on filter type
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.item - Filter configuration object
 * @param {Function} props.handleOnChange - Handler for filter changes
 * @param {Object} props.searchParams - Current URL search parameters
 * @param {Array} props.selectedRow - Array of selected row IDs
 * @param {Function} props.fetchTableData - Function to refresh table data
 * @param {Function} props.setSelectedRow - Function to update selected rows
 * @returns {JSX.Element} - Rendered filter component
 */
const FilterComponent = ({ item, handleOnChange, searchParams, selectedRow, fetchTableData, setSelectedRow, handleExportClick, isLoadingExport }) => {
    /**
     * Gets filter value from search params
     *
     * @param {string} name - Parameter name
     * @param {boolean} multiple - Whether the parameter accepts multiple values
     * @returns {string|Array} - Current value(s) of the parameter
     */
    const getValue = (name, multiple) => {
        if (multiple) {
            return searchParams.get(name) ? searchParams.get(name)?.split(",") : [];
        }
        return searchParams.get(name);
    };

    // Render different filter types
    switch (item.type) {
        case "search":
            return (
                <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400 dark:text-[#858585]">
                        <Search size={18} />
                    </div>
                    <input
                        {...item}
                        type="text"
                        name={item.name}
                        className="block min-w-44 w-full outline-none pl-10 pr-3 py-2 border border-gray-300 dark:border-[#3e3e42] rounded-md bg-white dark:bg-[#1e1e1e] text-gray-900 dark:text-[#cccccc] focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-600 focus:border-none text-sm"
                        placeholder={item.placeholder || item.dynamicPlaceholder?.(searchParams) || "Search..."}
                        value={searchParams.get(item.name) || ""}
                        onChange={handleOnChange}
                        aria-label={`Search ${item.name}`}
                    />
                </div>
            );

        case "select":
            return <TagsDropdown {...item} onChange={handleOnChange} value={getValue(item.name, item.multiple)} />;

        case "tab":
            return <RulesTabs {...item} options={item.options} defaultSelected={getValue(item.name) || item.defaultSelected} onChange={handleOnChange} accentColor="rgb(255 142 6 / 1)" />;

        case "bulk":
            return (
                <TagsDropdown
                    {...item}
                    onChange={(event) => {
                        item.onChange?.({
                            action: event.target.value[0],
                            selectedRow: selectedRow,
                            refreshTable: () => {
                                fetchTableData();
                                setSelectedRow([]);
                            },
                        });
                    }}
                    value={getValue(item.name)}
                    doNotPreserveState={true}
                    disabled={selectedRow.length === 0}
                />
            );
        case "button":
            return (
                <button
                    {...item}
                    className={`flex text-nowrap items-center gap-1 px-3 py-1.5 border border-gray-300 dark:border-[#3e3e42] rounded-md bg-white dark:bg-[#252526] text-sm`}
                    onClick={item.onClick}
                    aria-label="Refresh data"
                >
                    {item.icon}
                    {item.label}
                </button>
            );
        case "export":
            return (
                <a
                    {...item}
                    download
                    href={`${Utils.appendTokenToUrl(item.exportUrl, Utils.getToken())}&${window.location.href?.split("?")?.[1]}`}
                    onClick={isLoadingExport ? (e) => e.preventDefault() : handleExportClick}
                    className={`flex items-center gap-1 px-3 py-1.5 border border-gray-300 dark:border-[#3e3e42] rounded-md bg-white dark:bg-[#252526] text-sm`}
                    aria-label="Export data"
                >
                    {isLoadingExport ? (
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M12 10V16M12 16L9 13M12 16L15 13M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L18.7071 8.70711C18.8946 8.89464 19 9.149 19 9.41421V19C19 20.1046 18.1046 21 17 21Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    )}
                    {item.label || "Export"}
                </a>
            );
        case "datePicker":
            return <TableDatePicker {...item} searchParams={searchParams} handleOnChange={handleOnChange} />;
        default:
            return <div>Filter type not found</div>;
    }
};

/**
 * Table status and pagination info component
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.tableData - Table configuration data
 * @param {Object} props.searchParams - Current URL search parameters
 * @param {Array} props.selectedRow - Array of selected row IDs
 * @returns {JSX.Element} - Rendered status information
 */
const TableStatus = ({ tableData, searchParams, selectedRow }) => {
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || tableData?.limit || 10;

    const totalDocuments = Number(tableData?.totalDocuments) || 0;
    const rowsLength = Array.isArray(tableData?.rows) ? tableData.rows.length : 0;

    const startRow = rowsLength > 0 ? (page - 1) * limit + 1 : 0;
    const endRow = rowsLength > 0 ? Math.min(page * limit, totalDocuments) : 0;

    return (
        <div className="flex text-nowrap items-center gap-4 text-sm text-gray-500 dark:text-[#858585]">
            <span>
                Showing {startRow} - {endRow} of {totalDocuments} entries
            </span>
            {selectedRow?.length > 0 && (
                <>
                    <span className="text-gray-300 dark:text-[#3e3e42]">|</span>
                    <span>Selected {selectedRow?.length} rows</span>
                </>
            )}
        </div>
    );
};

/**
 * Table action buttons component
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.tableData - Table configuration data
 * @param {Object} props.searchParams - Current URL search parameters
 * @param {boolean} props.isRefreshing - Whether the table is currently refreshing
 * @param {Function} props.handleRefresh - Handler for refresh button click
 * @param {Function} props.handleClearFilters - Handler for clearing filters
 * @param {Array} props.selectedRow - Array of selected row IDs
 * @param {Function} props.fetchTableData - Function to refresh table data
 * @param {Function} props.setSelectedRow - Function to update selected rows
 * @param {Function} props.handleOnChange - Handler for filter changes
 * @returns {JSX.Element} - Rendered action buttons
 */
const TableActions = ({
    tableData,
    searchParams,
    isRefreshing,
    handleRefresh,
    handleClearFilters,
    selectedRow,
    fetchTableData,
    setSelectedRow,
    handleOnChange,
    handleExportClick,
    isLoadingExport,
}) => {
    const hasFilters = searchParams.toString().length > 0;

    return (
        <div className="flex items-center gap-2 mt-2 sm:mt-0">
            {/* Row 2 filters */}
            {tableData?.filters?.row2?.data?.map((item, index) => (
                <FilterComponent
                    key={`filter-row2-${index}`}
                    item={item}
                    handleOnChange={handleOnChange}
                    searchParams={searchParams}
                    selectedRow={selectedRow}
                    fetchTableData={fetchTableData}
                    setSelectedRow={setSelectedRow}
                    handleExportClick={handleExportClick}
                    isLoadingExport={isLoadingExport}
                />
            ))}

            {/* Refresh button */}
            <button
                className={`flex items-center gap-1 px-3 py-1.5 border border-gray-300 dark:border-[#3e3e42] dark:text-[#cccccc] rounded-md bg-white dark:bg-[#252526] text-sm ${
                    isRefreshing ? "opacity-50" : ""
                }`}
                onClick={handleRefresh}
                disabled={isRefreshing}
                aria-label="Refresh data"
            >
                <RefreshCw size={16} className={`text-gray-500 dark:text-[#858585] ${isRefreshing ? "animate-spin" : ""}`} />
                Refresh
            </button>

            {/* Clear filters button */}
            {hasFilters && tableData?.filters?.row2?.clearFilters !== false && (
                <button
                    className="flex text-nowrap items-center gap-1 px-3 py-1.5 border dark:text-[#cccccc] border-gray-300 dark:border-[#3e3e42] rounded-md bg-white dark:bg-[#252526] text-sm"
                    onClick={handleClearFilters}
                    aria-label="Clear all filters"
                >
                    <X size={16} className="text-gray-500 dark:text-[#858585]" />
                    Clear filters
                </button>
            )}
        </div>
    );
};

/**
 * Table body component that renders rows or empty/loading states
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.tableData - Table configuration data
 * @param {boolean} props.loading - Whether data is loading
 * @param {Array} props.selectedRow - Array of selected row IDs
 * @param {Function} props.handleSelectRule - Handler for row selection
 * @returns {JSX.Element} - Rendered table body
 */
const TableBody = ({ tableData, loading, selectedRow, handleSelectRule, searchParams }) => {
    if (loading) {
        return (
            <tr>
                <td colSpan={Object.keys(tableData?.rows?.[0] || {}).length + 1}>
                    <SkeletonTable row={parseInt(tableData?.rows?.length || 10)} column={Object.keys(tableData?.rows?.[0] || {}).length} header={false} />
                </td>
            </tr>
        );
    }

    if (tableData?.rows?.length === 0) {
        return (
            <tr>
                <td colSpan={Object.keys(tableData?.rows?.[0] || {}).length + 1} className="px-4 py-4 text-center text-sm text-gray-500 dark:text-[#858585]">
                    No data found matching your criteria
                </td>
            </tr>
        );
    }

    const totalColumns = Object.entries(tableData.rows?.[0] || {}).filter((cell) => cell.type !== "hidden")?.length + 1;

    return tableData?.rows?.map((row, index) => (
        <TableRow
            searchParams={searchParams}
            key={`row-${row?.["ID"]?.value || index}`}
            tableData={tableData}
            row={row}
            selected={selectedRow.includes(row?.["ID"]?.value)}
            onSelect={handleSelectRule}
            rowIndex={index}
            totalColumns={totalColumns}
        />
    ));
};

/**
 * NewTable component that provides a complete data table with filtering, pagination, and row selection
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.tableConfig - Configuration object for the table
 * @param {string} props.tableConfig.url - API endpoint to fetch data from
 * @param {string} props.tableConfig.title - Optional table title
 * @param {boolean} props.tableConfig.hasCheckbox - Whether rows can be selected with checkboxes
 * @param {Object} props.tableConfig.filters - Filter configuration objects
 * @param {Array} props.tableConfig.actions - Row action configuration
 * @param {Function} props.tableConfig.formatTableData - Function to format API response data
 * @returns {JSX.Element} - Rendered table with all functionality
 */
export default function NewTable({ tableConfig }) {
       
    const [searchParams, setSearchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [selectedRow, setSelectedRow] = useState([]);
    const [allRows, setAllRows] = useState([]);
    const [tableData, setTableData] = useState(tableConfig);
    const [isLoadingExport, setIsLoadingExport] = useState(false);
    const [filteredRows, setFilteredRows] = useState([]);
    const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "");
    const [order, setOrder] = useState(searchParams.get("order") || "asc");
    const controllerRef = useRef(null);

    // Update tableData when config changes
    useEffect(() => {
        console.log("Updated tableConfig:", tableConfig);
        setTableData(tableConfig);
    }, [tableConfig]);

    // Fetch data when search params or refresh flag changes
    useEffect(() => {
        if (allRows?.length === 0) {
            fetchTableData(searchParams);
        }
    }, [searchParams, tableData?.refreshTable]);

    /**
     * Fetches table data from the API
     *
     * @param {URLSearchParams} params - Search parameters to include in the request
     * @returns {Promise<void>}
     */
    const fetchTableData = useCallback(
        async (params) => {
            setLoading(true);
            if (controllerRef.current) {
                controllerRef.current.abort();
            }

            // Create new controller for this request
            const controller = new AbortController();
            controllerRef.current = controller;
            let wasCancelled = false;

            try {
                if (tableConfig.data) {
                    processTableData(tableConfig.data, params);
                }
                // Handle URL configuration - can be string or object
                let requestUrl;
                let requestMethod = "GET";
                let requestConfig = {
                    signal: controller.signal,
                    headers: {
                        ...tableData?.apiAuthentication,
                    },
                };

                if (typeof tableData.url === "string") {
                    // Simple string URL - use GET with query params
                    const url = new URL(tableData?.url, window.location.origin);
                    const existingParams = new URLSearchParams(url.search);
                    // Merge with new params (override existing)
                    for (const [key, value] of new URLSearchParams(params)) {
                        existingParams.set(key, value); // Replaces existing param if any
                    }
                    // Final URL without search params
                    requestUrl = url.origin + url.pathname;
                    requestConfig.params = existingParams;
                } else if (typeof tableData.url === "object" && tableData.url !== null) {
                    // Object URL with method and path
                    const { method = "GET", path, ...urlConfig } = tableData.url;

                    if (!path) {
                        throw new Error("Path is required when URL is an object");
                    }

                    requestUrl = path;
                    requestMethod = method.toUpperCase();

                    // For GET requests, send params as query parameters
                    if (requestMethod === "GET") {
                        requestConfig.params = params;
                    } else {
                        // For POST, PATCH, PUT, etc., send params in body and query
                        if (tableData?.url?.payload) {
                            requestConfig.data = { ...tableData.url.payload, ...Object.fromEntries(params) };
                            console.log(requestConfig.data);
                        } else {
                            requestConfig.data = params;
                        }
                        requestConfig.params = { ...urlConfig.params, params }; // Also send as query params
                    }

                    // Merge any additional config from URL object
                    requestConfig = { ...requestConfig };
                } else {
                    throw new Error("Invalid URL configuration - must be string or object");
                }

                // Make the request based on method
                let response;
                switch (requestMethod) {
                    case "GET":
                        response = await apiClient.get(requestUrl, requestConfig);
                        break;
                    case "POST":
                        response = await apiClient.post(requestUrl, requestConfig.data, {
                            ...requestConfig,
                            data: undefined, // Remove data from config since it's passed as second parameter
                        });
                        break;
                    case "PATCH":
                        response = await apiClient.patch(requestUrl, requestConfig.data, {
                            ...requestConfig,
                            data: undefined,
                        });
                        break;
                    case "PUT":
                        response = await apiClient.put(requestUrl, requestConfig.data, {
                            ...requestConfig,
                            data: undefined,
                        });
                        break;
                    case "DELETE":
                        response = await apiClient.delete(requestUrl, requestConfig);
                        break;
                    default:
                        throw new Error(`Unsupported HTTP method: ${requestMethod}`);
                }

                if (response.data) {
                    const newTableData = await tableData?.formatTableData?.(response.data);
                    setTableData(newTableData);

                    if (tableData?.clientPagination) {
                        const fullData = newTableData?.rows || [];
                        setAllRows(fullData);

                        const currentPage = parseInt(params?.get?.("page") || params?.page || 1, 10);
                        const limit = parseInt(params?.get?.("limit") || params?.limit || tableData?.limit || 10, 10);
                        const filters = tableData?.filters || {};

                        // Flatten filter field names
                        const filterFields = Object.values(filters).flatMap((row) => row.data || []);

                        // Check if any filter is active in params
                        const hasFilters = filterFields.some((filter) => {
                            const val = params?.get?.(filter.name) || params?.[filter.name];
                            return val !== null && val !== "" && val !== undefined;
                        });

                        let filteredRows = [...fullData];

                        if (hasFilters) {
                            filteredRows = fullData.filter((row) => {
                                return filterFields.every((filter) => {
                                    const { name, type = "text", filterOn = [name] } = filter;
                                    const filterValue = (params?.get?.(name) || params?.[name])?.toString()?.toLowerCase();
                                    if (!filterValue) return true;

                                    const fieldsToCheck = Array.isArray(filterOn) ? filterOn : [filterOn];

                                    return fieldsToCheck.some((field) => {
                                        const cellValue = row?.[field]?.value?.toString()?.toLowerCase();
                                        if (type === "search") return cellValue?.includes(filterValue);
                                        if (type === "select") return cellValue === filterValue;
                                        return true;
                                    });
                                });
                            });

                            setFilteredRows(filteredRows);
                        }

                        const startIdx = (currentPage - 1) * limit;
                        const paginatedRows = filteredRows.slice(startIdx, startIdx + limit);

                        setTableData((prev) => ({
                            ...prev,
                            rows: paginatedRows,
                            totalPages: Math.ceil(filteredRows.length / limit),
                            totalDocuments: filteredRows.length,
                        }));
                    }
                }
            } catch (error) {
                if (error.name === "CanceledError" || error.name === "AbortError") {
                    wasCancelled = true;
                } else {
                    console.error("Error fetching data:", error);
                    // Optionally set an error state here
                    // setError(error.message);
                }
            } finally {
                // Use setTimeout to prevent flickering on fast responses
                setTimeout(() => {
                    if (!wasCancelled) {
                        setLoading(false);
                    }
                }, 300);
            }
        },
        [tableData.url, tableData.formatTableData, tableData?.clientPagination, tableData?.filters, tableData?.apiAuthentication]
    );

    const processTableData = (data, params) => {
        // Format data
        const newTableData = tableData?.formatTableData?.(data);
        setTableData(newTableData);

        if (tableData?.clientPagination) {
            const fullData = newTableData?.rows || [];
            setAllRows(fullData);

            const currentPage = parseInt(params?.get?.("page") || params?.page || 1, 10);
            const limit = parseInt(params?.get?.("limit") || params?.limit || tableData?.limit || 10, 10);
            const filters = tableData?.filters || {};

            // Flatten filter field names
            const filterFields = Object.values(filters).flatMap((row) => row.data || []);

            // Check if any filter is active in params
            const hasFilters = filterFields.some((filter) => {
                const val = params?.get?.(filter.name) || params?.[filter.name];
                return val !== null && val !== "" && val !== undefined;
            });

            let filteredRows = [...fullData];

            if (hasFilters) {
                filteredRows = fullData.filter((row) => {
                    return filterFields.every((filter) => {
                        const { name, type = "text", filterOn = [name] } = filter;
                        const filterValue = (params?.get?.(name) || params?.[name])?.toString()?.toLowerCase();
                        if (!filterValue) return true;

                        const fieldsToCheck = Array.isArray(filterOn) ? filterOn : [filterOn];

                        return fieldsToCheck.some((field) => {
                            const cellValue = row?.[field]?.value?.toString()?.toLowerCase();
                            if (type === "search") return cellValue?.includes(filterValue);
                            if (type === "select") return cellValue === filterValue;
                            return true;
                        });
                    });
                });

                setFilteredRows(filteredRows);
            }

            // Pagination
            const startIdx = (currentPage - 1) * limit;
            const paginatedRows = filteredRows.slice(startIdx, startIdx + limit);

            setTableData((prev) => ({
                ...prev,
                rows: paginatedRows,
                totalPages: Math.ceil(filteredRows.length / limit),
                totalDocuments: filteredRows.length,
            }));
        }
    };

    /**
     * Handles refresh button click
     */
    const handleRefresh = useCallback(() => {
        setIsRefreshing(true);
        setFilteredRows([]);
        fetchTableData(searchParams).finally(() => {
            setIsRefreshing(false);
        });
    }, [fetchTableData, searchParams]);

    /**
     * Handles selecting/deselecting all rows on the current page
     */
    const handleSelectAll = useCallback(() => {
        const currentPageIds = tableData?.rows.map((row) => row["ID"].value);
        const allSelected = currentPageIds.every((id) => selectedRow.includes(id));

        if (allSelected) {
            // Deselect all rows on current page
            setSelectedRow((prev) => prev.filter((id) => !currentPageIds.includes(id)));
        } else {
            // Select all rows on current page
            setSelectedRow((prev) => {
                const newSelected = [...prev];
                currentPageIds.forEach((id) => {
                    if (!newSelected.includes(id)) {
                        newSelected.push(id);
                    }
                });
                return newSelected;
            });
        }
    }, [tableData?.rows, selectedRow]);

    /**
     * Handles selecting/deselecting a single row
     *
     * @param {string|number} id - ID of the row to toggle selection
     */
    const handleSelectRow = useCallback((id) => {
        setSelectedRow((prev) => {
            if (prev.includes(id)) {
                return prev.filter((rowId) => rowId !== id);
            } else {
                return [...prev, id];
            }
        });
    }, []);

    /**
     * Clears all filters from search params
     */

    const handleClearFilters = useCallback(() => {
        const emptyParams = new URLSearchParams();
        setSearchParams(emptyParams);
        if (tableData?.clientPagination) {
            applyClientSideFilter(emptyParams, allRows, {}, setTableData);
        }
    }, [setSearchParams, tableData, allRows, setTableData]);

    /**
     * apply client side filters
     *
     * @param {Object} params - filter params
     */
    const applyClientSideFilter = (params, allRows, tableData, setTableData) => {
        let filteredRows = [...allRows];
        const filters = tableData?.filters || {};

        // Flatten the filters structure
        const filterFields = Object.values(filters).flatMap((row) => row.data || []);

        filterFields.forEach((filter) => {
            const { name, type = "text", filterOn = [name] } = filter;

            const filterValue = params.get(name)?.toLowerCase();
            if (!filterValue) return;

            // Ensure filterOn is always treated as an array
            const filterFieldsArray = Array.isArray(filterOn) ? filterOn : [filterOn];

            filteredRows = filteredRows.filter((row) => {
                return filterFieldsArray.some((field) => {
                    const cellValue = row?.[field]?.value?.toString()?.toLowerCase();
                    const filterVal = filterValue.toLowerCase();

                    if (Array.isArray(row[field]?.rawValue)) {
                        if (Array.isArray(filterVal)) {
                            return filterVal.some((val) => row[field].rawValue.includes(val));
                        } else {
                            return row[field].rawValue.some((val) => val.includes(filterVal));
                        }
                    }

                    if (type === "search") {
                        return cellValue?.includes(filterValue);
                    }
                    if (type === "select") {
                        if (Array.isArray(filterValue)) {
                            return filterValue.some((val) => cellValue.includes(val));
                        }

                        return cellValue === filterValue;
                    }
                    return true;
                });
            });
        });

        setFilteredRows(filteredRows);

        // Pagination
        const currentPage = parseInt(params.get("page") || 1, 10);
        const limit = parseInt(params.get("limit") || tableData?.limit || 10, 10);
        const startIdx = (currentPage - 1) * limit;
        const paginatedRows = filteredRows.slice(startIdx, startIdx + limit);

        setTableData((prev) => ({
            ...prev,
            rows: paginatedRows,
            totalPages: Math.ceil(filteredRows.length / limit),
            totalDocuments: filteredRows.length,
        }));
    };

    /**
     * Handles filter input changes
     *
     * @param {Object} event - Change event from input element
     */
    const handleOnChange = useCallback(
        (event) => {
            const { name, value } = event.target;

            setSearchParams(
                (prev) => {
                    if (value?.length) {
                        prev.set(name, value);
                    } else {
                        prev.delete(name);
                    }
                    prev.set("page", 1);
                    return prev;
                },
                { replace: true }
            );

            if (tableData?.clientPagination) {
                const updatedParams = new URLSearchParams(searchParams);
                if (value?.length) {
                    updatedParams.set(name, value);
                } else {
                    updatedParams.delete(name);
                }
                updatedParams.set("page", 1);

                applyClientSideFilter(updatedParams, allRows, tableData, setTableData);
            }
        },
        [setSearchParams, searchParams, tableData, allRows]
    );

    const handleSort = useCallback(
        (headerItem) => {
            const newOrder = sortBy === headerItem && order === "asc" ? "desc" : "asc";

            setSearchParams(
                (prev) => {
                    // Set sorting and pagination
                    prev.set("sortBy", headerItem);
                    prev.set("order", newOrder);

                    return prev;
                },
                { replace: true }
            );

            setSortBy(headerItem);
            setOrder(newOrder);
        },
        [sortBy, order, setSearchParams]
    );

    const getSortIcon = useCallback(
        (headerItem) => {
            if (sortBy !== headerItem) return <span className="ml-1 opacity-0 group-hover:opacity-50">↑</span>;
            return order === "asc" ? <span className="ml-1">↑</span> : <span className="ml-1">↓</span>;
        },
        [sortBy, order]
    );

    const handleExportClick = () => {
        setIsLoadingExport(true);
        setTimeout(() => {
            setIsLoadingExport(false);
        }, 4000);
    };

    return (
        <div className="space-y-2">
            {/* Table title */}
            {tableData.title && <div className="font-semibold text-gray-900 dark:text-[#cccccc]">{tableData.title}</div>}
            {tableData.subtitle && <div className="text-xs text-muted-foreground dark:text-[#858585] pb-1">{tableData.subtitle}</div>}

            <div className={cn(`w-full bg-white dark:bg-[#252526] shadow-sm rounded-lg border border-gray-200 dark:border-[#3e3e42]`, tableConfig.containerClass)}>
                {/* Filter row 1 */}
                {tableData?.filters?.row1?.data?.length > 0 && (
                    <div className="p-4 border-b border-gray-200 dark:border-[#3e3e42] flex overflow-auto  gap-2 ">
                        {tableData?.filters?.row1?.data?.map((item, index) => (
                            <FilterComponent
                                key={`filter-row1-${index}`}
                                item={item}
                                handleOnChange={handleOnChange}
                                searchParams={searchParams}
                                selectedRow={selectedRow}
                                fetchTableData={fetchTableData}
                                setSelectedRow={setSelectedRow}
                                handleExportClick={handleExportClick}
                            />
                        ))}
                    </div>
                )}

                {/* Table actions and info */}
                <div className="flex  sm:items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-[#3e3e42] gap-2 overflow-auto">
                    <TableStatus tableData={tableData} searchParams={searchParams} selectedRow={selectedRow} />

                    <TableActions
                        tableData={tableData}
                        searchParams={searchParams}
                        isRefreshing={isRefreshing}
                        handleRefresh={handleRefresh}
                        handleClearFilters={handleClearFilters}
                        selectedRow={selectedRow}
                        fetchTableData={fetchTableData}
                        setSelectedRow={setSelectedRow}
                        handleOnChange={handleOnChange}
                        handleExportClick={handleExportClick}
                        isLoadingExport={isLoadingExport}
                    />
                </div>

                {/* Table content */}
                {tableData?.rows?.length === 0 && loading ? (
                    <SkeletonTable row={parseInt(searchParams.get("limit") || 10)} />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-[#3e3e42]">
                            <TableHeader tableData={tableData} selectedRow={selectedRow} onSelectAll={handleSelectAll} handleSort={handleSort} getSortIcon={getSortIcon} />

                            <tbody className="bg-white dark:bg-[#1e1e1e] divide-y divide-gray-200 dark:divide-[#3e3e42]">
                                <TableBody searchParams={searchParams} tableData={tableData} loading={loading} selectedRow={selectedRow} handleSelectRule={handleSelectRow} />
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                <TablePagination searchParams={searchParams} filteredRows={filteredRows} setSearchParams={setSearchParams} tableData={tableData} allRows={allRows} setTableData={setTableData} />
            </div>
        </div>
    );
}
