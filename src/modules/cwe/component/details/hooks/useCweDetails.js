import DataNotFound from "@/components/DataNotFound";
import GlobalICONS from "@/lib/utils/icons";
import { useEffect, useMemo } from "react";
import sampleCweDetails from "../utils/seeds";
import globalConstants from "@/lib/utils/contants";
import cweConstants from "../../form/utils/constants";
import FileDisplay from "@/components/fileView";

const useCweDetails = (data = sampleCweDetails) => {

    // Helper function to format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const cweDetailsConfig = useMemo(
        () => [
            {
                heading: {
                    label: "CWE Details",
                    icon: GlobalICONS.CHECKLIST,
                    description: "Details of the CWE",
                },
                body: {
                    id: data.id,
                    name: data.name,
                    description: data.description,
                    isEnabled: data.isEnabled ? "Enabled" : "Disabled",
                    isDeleted: data.isDeleted ? "Deleted" : "Active",
                    fileReference: data.fileReference,
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
        cweDetailsConfig,
    };
};

export default useCweDetails;
