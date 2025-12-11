import React from "react";
import styles from "./index.module.css";

const NameAvatar = ({ name = "" }) => {
    // Split the name by space and take the first character of each word to form initials
    const initials = name
        .split(" ")
        .map((word) => word.charAt(0))
        .join("")
        .toUpperCase();

    return (
        <div title={name} className={styles.container}>
            {initials}
        </div>
    );
};

export default NameAvatar;
