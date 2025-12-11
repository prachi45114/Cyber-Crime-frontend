import React from "react";
import styles from "./index.module.css";
import DetailsGridItem from "./components/detailsGridItem";
import { sampleFormatData } from "./utils/seeds";

const Details = ({ data = sampleFormatData }) => {
    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                {data.map((item, index) => (
                    <DetailsGridItem key={index} data={item} grid={item.grid} />
                ))}
            </div>
        </div>
    );
};

export default Details;
