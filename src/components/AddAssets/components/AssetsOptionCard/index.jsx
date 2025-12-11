import React from "react";
import styles from "./index.module.css";
import GlobalICONS from "@/lib/utils/icons";
const AssetOptionCard = ({ icon, title, subtitle, onClick }) => {
    return (
        <div onClick={onClick} className={styles.cardWrapper}>
            <div className={styles.cardContentWrapper}>
                <div className={styles.cardIcon}>{icon}</div>
                <div className={styles.cardTextContent}>
                    <h5>
                        {title} {GlobalICONS.LONG_RIGHT_ARROW}
                    </h5>
                    <p>{subtitle}</p>
                </div>
            </div>
        </div>
    );
};
export default AssetOptionCard;
