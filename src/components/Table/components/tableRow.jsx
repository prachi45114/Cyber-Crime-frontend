import { useState } from "react";
import Dropdown from "../../DropDown";
import { Check, ChevronDown, ChevronRight, MoreHorizontal } from "lucide-react";

/**
 * Custom checkbox component that displays a styled checkbox
 *
 * @component
 * @param {Object} props - Component props
 * @param {boolean} props.checked - Whether the checkbox is checked
 * @param {Function} props.onChange - Handler for checkbox change events
 * @param {string} props.id - ID for the checkbox input
 * @returns {JSX.Element} - Rendered checkbox component
 */
const StyledCheckbox = ({ checked, onChange, id }) => (
    <div className="relative flex items-center justify-center" onClick={onChange}>
        <input type="checkbox" id={id} checked={checked} onChange={onChange} className="sr-only" aria-label="Select row" />
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
 * Renders a cell with appropriate formatting based on its value
 *
 * @component
 * @param {Object} props - Component props
 * @param {any} props.value - The cell value to display
 * @returns {JSX.Element} - Rendered cell content
 */
const TableCell = ({ value }) => <td className="px-3 py-1.5 text-[13px] leading-snug text-gray-700 dark:text-[#cccccc]">{value || "----"}</td>;

/**
 * ActionCell component that renders a dropdown menu with available actions
 *
 * @component
 * @param {Object} props - Component props
 * @param {Array} props.actions - List of available actions
 * @param {Object} props.row - The row data to pass to action handlers
 * @returns {JSX.Element} - Rendered action cell with dropdown
 */
const ActionCell = ({ actions, row, rowIndex }) => (
    <td className="px-3 py-2 text-sm text-gray-600 dark:text-[#858585]">
        <Dropdown
            dropDownContainerStyle={{ width: "140px" }}
            trigger={
                <span className="cursor-pointer p-1 rounded hover:bg-gray-100 dark:hover:bg-[#2a2d2e] inline-flex items-center justify-center transition-colors">
                    <MoreHorizontal size={16} />
                </span>
            }
            content={actions?.map((action, index) => (
                <p
                    key={`action-${index}`}
                    className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:text-[#cccccc] dark:hover:bg-[#2a2d2e] cursor-pointer transition-colors"
                    onClick={() => action.onClick?.(row, rowIndex)}
                >
                    {action.icon && <span className="inline-flex items-center justify-center">{action.icon}</span>}
                    <span>{action.label}</span>
                </p>
            ))}
        />
    </td>
);

/**
 * TableRow component that renders a single row in a data table
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.tableData - Configuration object for the table
 * @param {boolean} props.tableData.hasCheckbox - Whether the table includes checkboxes for row selection
 * @param {Array} props.tableData.actions - Array of action objects with onClick handlers
 * @param {Object} props.row - Object containing the row data with cell values and types
 * @param {boolean} props.selected - Whether the current row is selected
 * @param {Function} props.onSelect - Handler for row selection changes
 * @returns {JSX.Element} - Rendered table row with cells
 */
export const TableRow = ({ tableData, row, selected, onSelect, rowIndex, searchParams, totalColumns }) => {
    const [expandedRows, setExpandedRows] = useState({});
    // Get the row ID for selection purposes
    const rowId = row?.["ID"]?.value;

    /**
     * Handles row selection toggle
     */
    const handleSelect = () => {
        if (onSelect && rowId) {
            onSelect(rowId);
        }
    };

    const handleRowToggle = (rowId) => {
        setExpandedRows((prev) => ({
            ...prev,
            [rowId]: !prev[rowId],
        }));
    };
    const getSerialNumberForIndex = (index) => {
        const currentPage = parseInt(searchParams.get("page") || 1);
        const limit = parseInt(searchParams.get("limit") || 10);
        const startSno = (parseInt(currentPage) - 1) * parseInt(limit) + 1;
        return startSno + parseInt(index);
    };

    return (
        <>
            <tr className="hover:bg-gray-50 dark:hover:bg-[#2a2d2e] transition-colors duration-150 border-b border-gray-100 dark:!border-white/5">
                {/* Selection checkbox column */}
                {tableData?.hasCheckbox && (
                    <td className="px-3 py-1.5 whitespace-nowrap">
                        <StyledCheckbox id={`checkbox-${rowId}`} checked={selected} onChange={handleSelect} />
                    </td>
                )}

                {/* Data columns */}
                {Object.entries(row || {}).map(([key, cell], index) => {
                    // Skip hidden cells
                    if (cell.type === "hidden") return null;

                    return <TableCell searchParams={searchParams} key={`cell-${key}-${index}`} value={cell.key === "sno" ? getSerialNumberForIndex(cell.value) : cell.value} />;
                })}

                {/* Actions column */}
                {tableData.actions?.length > 0 && <ActionCell actions={tableData.actions} row={row} rowIndex={rowIndex} />}
                {tableData.actionsInRow?.length > 0 && (
                    <td onClick={(event) => event.stopPropagation()} data-cell="actionInRow" className="px-3 py-1.5 text-sm text-gray-700 dark:text-[#cccccc] text-center">
                        <div className="flex gap-2 flex-wrap">
                            {tableData.actionsInRow.map((action, index) => {
                                const btnClass = typeof action.dynamicButtonClass === "function" ? action.dynamicButtonClass(row, rowIndex) : "";
                                const label = typeof action.dynamicLabel === "function" ? action.dynamicLabel(row, rowIndex) : action.label;
                                const icon = typeof action.dynamicIcon === "function" ? action.dynamicIcon(row, rowIndex) : action.icon;
                                const shouldShow = typeof action.dynamicShow === "function" ? action.dynamicShow(row, rowIndex) : true;

                                if (!shouldShow) return null;

                                return (
                                    <button
                                        key={`actionInRow-${index}`}
                                        onClick={() => action.onClick?.(row, rowIndex)}
                                        className={`flex items-center justify-center gap-1.5 text-[12px] font-medium px-2.5 py-1.5 rounded-sm border border-gray-300 dark:border-[#3e3e42] bg-white dark:bg-[#1e1e1e] text-gray-700 dark:text-[#cccccc] hover:bg-gray-100 dark:hover:bg-[#2a2d2e] hover:border-gray-400 dark:hover:border-[#646464] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#569cd6]/40 transition-all duration-150 ${btnClass}`}
                                    >
                                        {icon}
                                        <span>{label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </td>
                )}

                {tableData?.collapseAction && (
                    <td
                        onClick={(event) => {
                            event.stopPropagation();
                            handleRowToggle(rowId);
                        }}
                        data-cell="CollapseAction"
                        className="px-3 py-2 text-sm text-gray-600 dark:text-[#858585] cursor-pointer"
                    >
                        <button className="p-1 rounded hover:bg-gray-100 dark:hover:bg-[#2a2d2e] transition-colors">
                            {expandedRows[rowId] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </button>
                    </td>
                )}
            </tr>

            {expandedRows[rowId] && (
                <tr className="hover:bg-gray-50 dark:hover:bg-[#2a2d2e] transition-colors duration-150">
                    <td colSpan={totalColumns} className="px-3 py-2">
                        {expandedRows[rowId] && tableData?.collapsableBody?.(rowIndex)}
                    </td>
                </tr>
            )}
        </>
    );
};
