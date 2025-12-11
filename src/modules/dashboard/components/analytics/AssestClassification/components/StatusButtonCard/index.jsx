import React from "react";
import Styles from "./index.module.css";

const StatusButtonCard = ({ active = false, icon, title, onClick }) => {
    return (
        <div className={Styles.countContainer} onClick={onClick} style={{ border: active ? "1px solid var(--violet-color)" : "1px dashed #e6e6e8" }}>
            <div
                className={Styles.iconCard}
                style={{
                    backgroundColor: active ? "var(--violet-light-color)" : "#ebebed",
                    color: active ? "var(--violet-color)" : "#818390",
                }}
            >
                {icon}
            </div>
            <div className={Styles.countInfo}>
                <p>{title}</p>
            </div>
        </div>
    );
};

export default StatusButtonCard;
