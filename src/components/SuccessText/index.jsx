import React from "react";
import styles from "./index.module.css";
const SuccessText = ({ message }) => {
    return (
        message && (
            <div className={styles.container}>
                <p>{message}</p>
            </div>
        )
    );
};

export default SuccessText;
