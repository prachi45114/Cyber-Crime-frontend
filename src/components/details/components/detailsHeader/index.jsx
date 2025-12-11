import React from "react";
import styles from "./index.module.css";
import GlobalICONS from "@/lib/utils/icons";
import RowHeaderField from "@/components/form/components/FieldTemplates/RowHeaderField";

const DetailsHeader = ({ data = {} }) => {
    return (
        <div className={styles.container}>
            <RowHeaderField
                formField={{
                    label: data.label || "VM Details",
                    icon: data.icon || GlobalICONS.DESKTOP,
                    description: data.description || "Configure the basic details of your virtual machine",
                }}
            />
        </div>
    );
};

export default DetailsHeader;
