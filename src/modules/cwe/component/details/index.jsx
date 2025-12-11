import React from "react";
import styles from "./styles/index.module.css";
import "./styles/index.css";
import useCweDetails from "./hooks/useCweDetails";
import Details from "@/components/details";

const CweDetails = ({ data }) => {
    const { cweDetailsConfig } = useCweDetails(data);

    return (
        <div className={styles.container}>
            <Details data={cweDetailsConfig} />
        </div>
    );
};

export default CweDetails;
