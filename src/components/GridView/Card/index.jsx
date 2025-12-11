import React, { useCallback, useState } from "react";
import styles from "./index.module.css";
import { GridviewIcons } from "../utils/icons";
import GlobalUtils from "@/lib/utils/GlobalUtils";
import Dropdown from "@/components/DropDown";
import TableIcon from "@/components/table/utils/icon";

const Card = ({ data, actionData, color }) => {
    // Handle action click with error boundary
    const handleActionClick = useCallback((action, row, event) => {
        try {
            event.stopPropagation();
            action.functions?.(row);
        } catch (error) {
            console.error("Error handling action click:", error);
        }
    }, []);
    return (
        <div className={`${styles.container}`}>
            <div className={styles.heading}>
                <div className={styles.body}>
                    <p title={data.description}>{data.description}</p>
                    <div>
                        {Object.entries(data || {}).map(
                            ([key, data]) =>
                                data.type !== "hidden" && (
                                    <p className={styles.dates}>
                                        <span className={styles.card_labels}>{key} : </span>
                                        <span className={styles.card_values}>{GlobalUtils.capitalizeEachWord(data.value)}</span>
                                    </p>
                                )
                        )}
                    </div>
                </div>
                <div className={styles.action_icon_container}>
                    {actionData.length > 0 && (
                        <Dropdown
                            trigger={
                                <p>
                                    <span style={{ color: color }}>{TableIcon.FILL_VERTICAL_MENU}</span>
                                </p>
                            }
                            content={actionData.map((action, index) => (
                                <p key={`dropdown-${action.name}-${index}`} onClick={(e) => handleActionClick(action, data, e)} className={styles.action_icon} title={action.label}>
                                    {GridviewIcons[action.name.toUpperCase()]} {action.label}
                                </p>
                            ))}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Card;
