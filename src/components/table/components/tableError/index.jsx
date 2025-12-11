import React from "react";
import styles from "./index.module.css";
const TableError = ({ error }) => {
    return (
        error && (
            <div className={styles.container}>
                <p className={styles.error_message}>{error}</p>
            </div>
        )
    );
};

export default TableError;
