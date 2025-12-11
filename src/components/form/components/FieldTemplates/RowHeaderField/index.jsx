import React from "react";
import styles from "./index.module.css";

const RowHeaderField = ({ formField }) => {
    const { label, fontSize = "15px", className = "", icon = "", description = "" } = formField;
    return (
        <div className={`${styles.container} ${className}`}>
            <div className={styles.icon}>{icon}</div>
            <div className={styles.header_wrapper}>
                <p className={styles.rowHeader} style={{ fontSize }}>
                    {label}
                </p>
                <p className={styles.description}>{description}</p>
            </div>
        </div>
    );
};

export default RowHeaderField;
