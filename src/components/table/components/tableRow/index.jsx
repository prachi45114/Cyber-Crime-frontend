import React, { useCallback } from "react";
import PropTypes from "prop-types";
import styles from "./index.module.css";
import ICON from "../../utils/icon";
import Dropdown from "@/components/DropDown";
import CheckBoxField from "@/components/form/components/FieldTemplates/CheckBoxField";
import Utils from "../../utils";

const TableRow = ({ data, setCheckboxState, checkboxState, onRowClick, onActionClick, customCellRenderer, loadingState = false, initialValues }) => {
    // Memoize action filtering
    const getVisibleActions = useCallback(
        (actions, row) => {
            return actions?.filter((action) => !Utils.shouldHideAction?.(action, row)) || [];
        },
        [Utils.shouldHideAction]
    );

    // Handle row click with error boundary
    const handleRowClick = useCallback(
        (row) => {
            try {
                if (data.rowClickHandler) {
                    data.rowClickHandler(row);
                }
                onRowClick?.(row);
            } catch (error) {
                console.error("Error handling row click:", error);
            }
        },
        [data.rowClickHandler, onRowClick]
    );

    // Handle action click with error boundary
    const handleActionClick = useCallback(
        (action, row, event) => {
            try {
                event.stopPropagation();
                action.functions?.(row);
                onActionClick?.(action, row);
            } catch (error) {
                console.error("Error handling action click:", error);
            }
        },
        [onActionClick]
    );

    // Render cell content based on type
    const renderCell = useCallback(
        (cell, key) => {
            if (customCellRenderer?.[key]) {
                return customCellRenderer[key](cell);
            }

            if (cell.type === "hidden") return null;
            if (!cell.value && !cell.viewAs) return "---";

            if (cell.viewAs) {
                if (!cell.value) return "-----";

                switch (cell.type) {
                    case "file":
                        return (
                            <span style={{ cursor: "pointer", color: "blue" }} onClick={() => Utils.handleViewFile(cell.value)}>
                                {cell.viewAs}
                            </span>
                        );
                    case "checkbox":
                        return <input type="checkbox" checked={cell.checked} name={cell.name} value={cell.value} onChange={cell.onchange} />;
                    default:
                        return (
                            <a style={{ cursor: "pointer", color: "blue" }} href={cell.value?.startsWith("http") ? cell.value : `http://${cell.value}`} target="_blank" rel="noreferrer">
                                {cell.viewAs}
                            </a>
                        );
                }
            }

            return cell.value;
        },
        [customCellRenderer]
    );

    const ActionButtons = useCallback(
        ({ actions, row }) => {
            const visibleActions = getVisibleActions(actions, row);

            if (!visibleActions.length) return null;

            // Split the array into two parts
            const primaryActions = visibleActions.slice(0, 2); // First two items
            const dropdownActions = visibleActions.slice(2); // Remaining items

            return (
                <div>
                    {/* Render the first two actions directly */}
                    {primaryActions.map((action, index) => (
                        <p key={`${action.name}-${index}`} className={styles.action_icon} onClick={(e) => handleActionClick(action, row, e)} title={action.label}>
                            {ICON[action.name.toUpperCase()]}
                        </p>
                    ))}

                    {/* Render the rest in the Dropdown */}
                    {dropdownActions.length > 0 && (
                        <Dropdown
                            trigger={
                                <p className={styles.action_icon}>
                                    <span>{ICON.FILL_VERTICAL_MENU}</span>
                                </p>
                            }
                            content={dropdownActions.map((action, index) => (
                                <p key={`dropdown-${action.name}-${index}`} onClick={(e) => handleActionClick(action, row, e)} className={styles.action_icon} title={action.label}>
                                    {ICON[action.name.toUpperCase()]} {action.label}
                                </p>
                            ))}
                        />
                    )}
                </div>
            );
        },
        [getVisibleActions, handleActionClick]
    );

    if (loadingState) {
        return (
            <tbody className={styles.container}>
                <tr>
                    <td colSpan={100}>Loading...</td>
                </tr>
            </tbody>
        );
    }

    if (!data?.rows?.length) {
        return (
            <tbody className={styles.container}>
                <tr>
                    <td colSpan={100}>No data available</td>
                </tr>
            </tbody>
        );
    }

    return (
        <tbody className={styles.container}>
            {data.rows.map((row, rowIndex) => (
                <tr key={row.Id?.value || rowIndex} onClick={() => handleRowClick(row)} style={{ cursor: data.rowClickHandler ? "pointer" : "" }}>
                    {data.checkbox && (
                        <td className={styles.checkbox_cell} onClick={(e) => e.stopPropagation()}>
                            <CheckBoxField
                                formField={{
                                    // id: `row${initialValues.page || "1"}${rowIndex + 1}`,
                                    // name: `row${initialValues.page || "1"}${rowIndex + 1}`,
                                    id: `${row.Id?.value}`,
                                    name: `${row.Id?.value}`,
                                    onChange: (event) => {
                                        const { name, value } = event.target;
                                        setCheckboxState((prev) => ({
                                            ...prev,
                                            [name]: value,
                                        }));
                                    },
                                    className: styles.checkbox,
                                }}
                                formValues={checkboxState}
                            />
                        </td>
                    )}

                    {Object.entries(row).map(([key, cell], cellIndex) =>
                        cell.type !== "hidden" ? (
                            <td key={`${key}-${cellIndex}`} data-cell={key}>
                                {renderCell(cell, key)}
                            </td>
                        ) : null
                    )}

                    {data.actionData && (
                        <td onClick={(e) => e.stopPropagation()} className={styles.action_cell} data-cell="Action">
                            <ActionButtons actions={data.actionData} row={row} />
                        </td>
                    )}
                </tr>
            ))}
        </tbody>
    );
};

TableRow.propTypes = {
    data: PropTypes.shape({
        rows: PropTypes.array.isRequired,
        checkbox: PropTypes.bool,
        action: PropTypes.bool,
        actionData: PropTypes.arrayOf(
            PropTypes.shape({
                name: PropTypes.string.required,
                functions: PropTypes.func,
                label: PropTypes.string,
                Id: PropTypes.string,
            })
        ),
        rowClickHandler: PropTypes.func,
    }).isRequired,
    onRowClick: PropTypes.func,
    onActionClick: PropTypes.func,
    customCellRenderer: PropTypes.objectOf(PropTypes.func),
    loadingState: PropTypes.bool,
};

export default React.memo(TableRow);
