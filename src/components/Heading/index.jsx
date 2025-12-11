import React from "react";
import styles from "./index.module.css";
import GlobalICONS from "@/lib/utils/icons";
const Heading = ({ count, title, icon }) => {
    return (
        <div className={styles.container}>
            <h2>
                {icon}
                <span>
                    {title} {count && `[${count || 0}]`}
                </span>
            </h2>
            {/* <span>{GlobalICONS.DOT_MENU}</span> */}
        </div>
    );
};

export default Heading;
