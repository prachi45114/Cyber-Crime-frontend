import React from "react";
import styles from "./index.module.css";
import DetailsHeader from "../detailsHeader";
import DetailsBody from "../detailsBody";
const DetailsGridItem = ({ data = {}, grid }) => {
    const gridClass = `grid-${grid}`;
    return (
        <div className={`${styles[gridClass]} ${styles.container}`}>
            {data.heading && <DetailsHeader data={data.heading} />}
            {data.customBody ? data.customBody : <DetailsBody data={data.body} />}
        </div>
    );
};

export default DetailsGridItem;
