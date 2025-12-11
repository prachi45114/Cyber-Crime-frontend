import React from "react";
import styles from "./index.module.css";
import GlobalICONS from "@/lib/utils/icons";
const Loader = ({ message, icon, iconPosition = "left", isLoading }) => {
    const LoadingIcon = icon || GlobalICONS.LOADER;
    return (
        isLoading && (
            <div className={styles.container}>
                {iconPosition === "left" && LoadingIcon}
                <p>{message}</p>
                {iconPosition === "right" && LoadingIcon}
            </div>
        )
    );
};

export default Loader;
