import { useMemo } from "react";
import GlobalICONS from "@/lib/utils/icons";
import sampleChecklistStatsData from "../utils/seeds";

const useChecklistStatsConfig = (data = sampleChecklistStatsData) => {
    const checklistStatsConfig = useMemo(
        () => [
            {
                title: "Total",
                value: data?.total || 0,
                subTitle: "Total Checklist",
                icon: GlobalICONS.WAREHOUSE,
                hasDecrement: false,
                hasIncrement: true,
                color: "orange",
            },
            {
                title: "Web App",
                value: data?.byAssetType?.["web_application"] || 0,
                subTitle: "Total Web App Checklist",
                icon: GlobalICONS.IN_USE,
                hasDecrement: false,
                hasIncrement: true,
                color: "green",
            },
            {
                title: "Mobile App",
                value: data?.byAssetType?.["mobile_application"] || 0,
                subTitle: "Total Mobile App Checklist",
                icon: GlobalICONS.DISPOSE,
                hasDecrement: true,
                hasIncrement: false,
                color: "red",
            },
            {
                title: "Thick Client",
                value: data?.byAssetType?.["thick_client"] || 0,
                subTitle: "Total Thick Client Checklist",
                icon: GlobalICONS.UNDER_MAINTENANCE,
                hasDecrement: true,
                hasIncrement: false,
                color: "blue",
            },
            {
                title: "Enabled",
                // value: (data?.enabled || 0) + (data?.disabled || 0),
                value: data?.enabled || 0,
                // subTitle: `Enabled: ${data?.enabled || 0} | Disabled: ${data?.disabled || 0}`,
                subTitle: "Total Enabled Checklist",
                icon: GlobalICONS.MISSING,
                hasDecrement: true,
                hasIncrement: false,
                color: "violet",
            },
            {
                title: "Disabled",
                value: data?.disabled || 0,
                subTitle: "Total Disabled Checklist",
                icon: GlobalICONS.UNDER_MAINTENANCE,
                hasDecrement: true,
                hasIncrement: false,
                color: "blue",
            },
        ],
        [data]
    );
    //console.log(data);
    return {
        checklistStatsConfig,
    };
};

export default useChecklistStatsConfig;
