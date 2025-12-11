import React from "react";
import styles from "./styles/index.module.css";
import Button from "@/components/form/components/FieldTemplates/ButtonField";
import { ICON } from "../form/utils/icons";

function formatUTCDateToISTReadable(dateStr) {
    if (!dateStr) return;

    // Remove microseconds and ensure valid ISO format
    const isoMatch = dateStr.match(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})/);
    if (!isoMatch) return;

    const cleanISO = isoMatch[1] + "Z"; // force UTC
    const utcDate = new Date(cleanISO);

    return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata", // IST (UTC+05:30)
    }).format(utcDate);
}

const SyncBanner = ({ currentStatus, lastSync, clickHandler, isSyncButtonDisable }) => {
    return (
        <div className={styles.syncHeader}>
            <div className={styles.syncStatus}>
                <span className="capitalize">{currentStatus || "Not Running"}</span>
            </div>
            <div className={styles.lastSync}>
                <p className={styles.lastSyncRow}>
                    <span>{ICON.CLOCK}</span>
                    <span>Last Synced</span>
                </p>
                <p style={{ textAlign: "right" }}>{formatUTCDateToISTReadable(lastSync) || "May 22, 2025, 04:44:32 PM"}</p>
            </div>

            <Button disabled={isSyncButtonDisable} onClick={clickHandler} className={styles.syncButton}>
                <span>{ICON.SYNC}</span>
                <span> Sync</span>
            </Button>
        </div>
    );
};

export default SyncBanner;
