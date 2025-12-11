import React from "react";
import styles from "./styles/index.module.css";
import "./styles/index.css";
import useChecklistDetails from "./hooks/useChecklistDetails";
import Details from "@/components/details";

const ChecklistDetails = ({ data }) => {
    const { checklistDetailsConfig } = useChecklistDetails(data);

    return (
        <div className={styles.container}>
            <Details data={checklistDetailsConfig} />
        </div>
    );
};

export default ChecklistDetails;
