import React from "react";
import styles from "./index.module.css";
import CircularProgressBar from "@/components/CircularProgressBar";

const ProgressCard = ({ data, cardTitle }) => {
    const colors = ["red", "violet", "orange", "green"];
    return (
        <div className={styles.main_container}>
            <div className={styles.cardTitle}>{cardTitle}</div>

            {/* Make sure to use data.map() correctly */}
            {data?.map((item, index) => {
                // Use modulus to cycle through the colors array
                const color = colors[index % colors.length];
                // {console.log(color)}
                return (
                    <div key={index} className={styles.inner_container}>
                        <CircularProgressBar progress={item.percentage} color={color} />
                        <div className={styles.item_details}>
                            <div className={styles.category}>
                                <p>{item.unit}</p>
                            </div>
                            <div className={styles.stat_info}>
                                <span>Total: {item.total}</span> |<span>Used: {item.used}</span> |<span>Remaining: {item.remaining}</span>
                            </div>
                        </div>
                        <div className={styles.actionBtn}>{item.icon}</div>
                    </div>
                );
            })}
        </div>
    );
};

export default ProgressCard;
