import { ChevronLeft, ChevronRight } from "lucide-react";
import tableConstants from "../utils/constants";

/**
 * Calculates which page numbers should be displayed in the pagination control
 *
 * @param {number} currentPage - The current active page
 * @param {number} totalPages - The total number of pages
 * @param {number} [maxVisiblePages=5] - Maximum number of page buttons to display
 * @returns {Array<number|string>} Array of page numbers and ellipsis indicators ('...')
 */
const getVisiblePageNumbers = (currentPage, totalPages, maxVisiblePages = 5) => {
    // For small number of pages, show all pages
    if (totalPages <= maxVisiblePages) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Calculate visible page range with current page in middle when possible
    const halfVisible = Math.floor(maxVisiblePages / 2);
    let startPage = Math.max(currentPage - halfVisible, 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    // Adjust if we're near the end
    if (endPage === totalPages) {
        startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    const pages = [];

    // Always include first page
    pages.push(1);

    // Add ellipsis after first page if needed
    if (startPage > 2) {
        pages.push("...");
    }

    // Add middle pages
    for (let i = Math.max(startPage, 2); i <= Math.min(endPage, totalPages - 1); i++) {
        pages.push(i);
    }

    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1) {
        pages.push("...");
    }

    // Always include last page if we have more than one page
    if (totalPages > 1) {
        pages.push(totalPages);
    }

    return pages;
};

/**
 * TablePagination component that provides navigation controls for paginated data
 *
 * @component
 * @param {Object} props - Component props
 * @param {URLSearchParams} props.searchParams - URL search parameters containing pagination state
 * @param {Function} props.setSearchParams - Function to update URL search parameters
 * @param {Object} props.tableData - Data about the table pagination state
 * @param {number} props.tableData.totalPages - Total number of pages available
 * @param {number} [props.maxVisiblePages=5] - Maximum number of page buttons to display at once
 * @returns {JSX.Element} Rendered pagination controls
 */
export const TablePagination = ({ searchParams, setSearchParams, tableData, filteredRows, maxVisiblePages = 5, allRows = [], setTableData }) => {
    const isClientPagination = tableData?.clientPagination;
    const currentPage = Number(searchParams.get("page")) || 1;
    const currentLimit = Number(searchParams.get("limit")) || tableData?.limit || 10;

    const totalPages = tableData?.totalPages || 1;
    const pageNumbers = getVisiblePageNumbers(currentPage, totalPages, maxVisiblePages);

    /**
     * Handles updating rows for client-side pagination
     */
    const paginateClientRows = (page, rowsPerPage) => {
        const startIdx = (page - 1) * rowsPerPage;
        const source = filteredRows.length > 0 ? filteredRows : allRows;
        const paginatedRows = source.slice(startIdx, startIdx + rowsPerPage);
        setTableData?.((prev) => ({
            ...prev,
            rows: paginatedRows,
            totalPages: Math.ceil(source.length / rowsPerPage),
            totalDocuments: source.length,
        }));
    };

    /**
     * Navigates to a specific page
     */
    const goToPage = (pageNum) => {
        if (isClientPagination) {
            paginateClientRows(pageNum, currentLimit);
        }
        setSearchParams?.((prev) => {
            prev.set("page", pageNum);
            return prev;
        });
    };

    /**
     * Changes the number of rows per page
     */
    const changeRowsPerPage = (newLimit) => {
        if (isClientPagination) {
            paginateClientRows(1, newLimit);
        }
        setSearchParams?.((prev) => {
            prev.set("limit", newLimit);
            prev.set("page", 1);
            return prev;
        });
    };

    return (
        <div className="px-3 py-2 flex flex-col sm:flex-row sm:items-center justify-between border-t border-gray-200 dark:border-[#3e3e42] bg-gray-50 dark:bg-[#252526] min-h-[44px]">
            {/* Rows per page selector - Compact */}
            <div className="flex items-center gap-2 mb-2 sm:mb-0">
                <span className="text-xs text-gray-600 dark:text-[#858585]">Rows:</span>
                <select
                    className="px-2 py-1 text-xs border border-gray-300 dark:border-[#3e3e42] rounded bg-white dark:bg-[#1e1e1e] text-gray-900 dark:text-[#cccccc] focus:outline-none focus:ring-1 focus:ring-primary dark:focus:ring-primary focus:border-primary dark:focus:border-primary transition-colors"
                    value={currentLimit}
                    onChange={(e) => changeRowsPerPage(Number(e.target.value))}
                    aria-label="Select rows per page"
                >
                    {tableConstants.ROWS_PER_PAGE_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            </div>

            {/* Page navigation - Compact */}
            <div className="flex items-center gap-1">
                {/* Previous page button */}
                <button
                    onClick={() => goToPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="inline-flex items-center justify-center w-7 h-7 rounded border border-gray-300 dark:border-[#3e3e42] bg-white dark:bg-[#252526] text-gray-600 dark:text-[#cccccc] hover:bg-gray-50 dark:hover:bg-[#2a2d2e] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Previous page"
                >
                    <ChevronLeft size={14} />
                </button>

                {/* Page number buttons */}
                <div className="flex items-center gap-0.5">
                    {pageNumbers.map((pageNum, index) => {
                        // For ellipsis, render static element
                        if (pageNum === "...") {
                            return (
                                <span key={`ellipsis-${index}`} className="px-1 text-xs text-gray-500 dark:text-[#858585]">
                                    ...
                                </span>
                            );
                        }

                        // For page numbers, render clickable buttons
                        return (
                            <button
                                key={`page-${pageNum}`}
                                onClick={() => goToPage(pageNum)}
                                className={`inline-flex items-center justify-center min-w-[28px] h-7 px-2 text-xs font-medium rounded border transition-colors ${
                                    currentPage === pageNum
                                        ? "bg-primary text-white border-primary shadow-sm"
                                        : "text-gray-700 dark:text-[#cccccc] border-gray-300 dark:border-[#3e3e42] bg-white dark:bg-[#252526] hover:bg-gray-50 dark:hover:bg-[#2a2d2e]"
                                }`}
                                aria-label={`Go to page ${pageNum}`}
                                aria-current={currentPage === pageNum ? "page" : undefined}
                            >
                                {pageNum}
                            </button>
                        );
                    })}
                </div>

                {/* Next page button */}
                <button
                    onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="inline-flex items-center justify-center w-7 h-7 rounded border border-gray-300 dark:border-[#3e3e42] bg-white dark:bg-[#252526] text-gray-600 dark:text-[#cccccc] hover:bg-gray-50 dark:hover:bg-[#2a2d2e] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Next page"
                >
                    <ChevronRight size={14} />
                </button>
            </div>
        </div>
    );
};
