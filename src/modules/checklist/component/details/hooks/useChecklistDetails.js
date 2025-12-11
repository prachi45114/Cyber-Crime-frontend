import DataNotFound from "@/components/DataNotFound";
import GlobalICONS from "@/lib/utils/icons";
import { useEffect, useMemo } from "react";
import sampleChecklistDetails from "../utils/seeds";
import globalConstants from "@/lib/utils/contants";
import checklistConstants from "../../form/utils/constants";
import FileDisplay from "@/components/fileView";

const useChecklistDetails = (data = sampleChecklistDetails) => {

    // Helper function to format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };


    const checklistDetailsConfig = useMemo(
        () => [
            {
                heading: {
                    label: "Checklist Details",
                    icon: GlobalICONS.CHECKLIST,
                    description: "Details of the checklist",
                },
                body: {
                    vulnerabilityId: data.vulnerabilityId,
                    assetType: data.assetType,
                    checklistItem: data.checklistItem,
                    checklistName: data.checklistName,
                    isEnabled: data.isEnabled ? "Enabled" : "Disabled",
                    isDeleted: data.isDeleted ? "Deleted" : "Active",
                    fileReference: data.fileReference,
                    category: data.category,
                    description: data.description,
                    createdAt: formatDate(data.createdAt),
                    updatedAt: formatDate(data.updatedAt),
                },
                grid: 3,
            },
        ],
        [data]
    );
    //console.log(data);
    return {
        checklistDetailsConfig,
    };
};

export default useChecklistDetails;
