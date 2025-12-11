import React from "react";
import styles from "./index.module.css";
import DetailsUtils from "../../utils";

const DetailsBody = ({ data }) => {
    const renderValue = (value) => {
        if (React.isValidElement(value) || Array.isArray(value)) {
            return <span className={styles.value}>{value}</span>;
        }
        if (typeof value === "object" && value !== null && "label" in value && "value" in value) {
            return (
                <span>
                    {DetailsUtils.formatText(value.label)}: {value.value || "N/A"}
                </span>
            );
        } else if (typeof value === "string" || typeof value === "number") {
            return <span className={styles.value}>{String(value)}</span>;
        } else {
            return <span className={styles.value}>{"---------"}</span>;
        }
    };

    const renderListItems = () => {
        if (Array.isArray(data)) {
            return data.map((item, index) => (
                <li key={index}>
                    <span className={styles.label}>{item.label || "Unknown Label"}</span> <span className={styles.value}>{item.value || "N/A"}</span>
                </li>
            ));
        } else if (typeof data === "object" && data !== null) {
            return Object.entries(data)
                .map(([key, value]) =>
                    key !== "_id" ? (
                        <li key={key}>
                            <span className={styles.label}>{DetailsUtils.formatText(key)}</span> {renderValue(value)}
                        </li>
                    ) : null
                )
                .filter(Boolean);
        }
        return null;
    };

    return (
        <div className={styles.container}>
            <ul>{renderListItems()}</ul>
        </div>
    );
};

export default DetailsBody;
