import GlobalUtils from "@/lib/utils/GlobalUtils";
import GlobalICONS from "@/lib/utils/icons";
import React from "react";
import styles from "./index.module.css";
import AssetOptionCard from "../AssetsOptionCard";
import { useNavigate } from "react-router";
const AddAssetsOptions = ({ setForm, module }) => {
    const handleFormSelection = (formType) => {
        setForm(formType || "manualForm");
    };
    const assetTypeParam = GlobalUtils.capitalizeEachWord(module.name).split(" ").join("+");

    const navigate = useNavigate();
    const notShowScan = ["web application", "networking device", "licence", "licence-usage", "software", "software-list", "vlan"];
    return (
        <div className={styles.popupContainer}>
            <div className={styles.imageWrapper}>
                <img src={require("../../assets/images/png/addItem.png")} alt="Add asset" />
            </div>
            <div className={styles.popupContent}>
                <h5>Create A New {GlobalUtils.capitalizeEachWord(module.name)}</h5>
                <p>Create {module.name} in your service desk using the options below.</p>
            </div>
            <div className={styles.optionsList}>
                {/* {!notShowScan.includes(module.name) && (
                    <AssetOptionCard
                        icon={GlobalICONS.SETTING}
                        title={`Scan and Discover ${GlobalUtils.capitalizeEachWord(module.name)}`}
                        subtitle={`Automatically detect and record new ${module.name}`}
                        onClick={() => navigate(`/agent-discovery?assetTypeName=${assetTypeParam}&page=1`)}
                    />
                )} */}
                <AssetOptionCard
                    onClick={() => handleFormSelection("bulkUploadForm")}
                    icon={GlobalICONS.IMPORT}
                    title="Import Using Excel/JSON File"
                    subtitle={`Upload ${module.name} information in bulk`}
                />
                <AssetOptionCard
                    onClick={() => handleFormSelection("manualForm")}
                    icon={GlobalICONS.CREATE}
                    title={`Create ${GlobalUtils.capitalizeEachWord(module.name)} Manually`}
                    subtitle={`Use an ${module.name} form to add ${module.name}`}
                />
            </div>
        </div>
    );
};

export default AddAssetsOptions;
