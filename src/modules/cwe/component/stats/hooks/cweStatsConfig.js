import { useMemo } from "react";
import GlobalICONS from "@/lib/utils/icons";
import sampleCweStatsData from "../utils/seeds";

const useCweStatsConfig = (data = sampleCweStatsData) => {
    const cweStatsConfig = useMemo(
        () => [
            {
                title: "Total CWE",
                value: data?.total || 0,
                subTitle: "Total CWE",
                icon: GlobalICONS.WAREHOUSE,
                hasDecrement: false,
                hasIncrement: true,
                color: "orange",
            },
            {
                title: "Enabled CWE",
                value: data?.enabled || 0,
                subTitle: "Total Enabled CWE",
                icon: GlobalICONS.MISSING,
                hasDecrement: true,
                hasIncrement: false,
                color: "violet",
            },  
            {
                title: "Disabled CWE",
                value: data?.disabled || 0,
                subTitle: "Total Disabled CWE",
                icon: GlobalICONS.UNDER_MAINTENANCE,
                hasDecrement: true,
                hasIncrement: false,
                color: "blue",
            },
            {
                title: "Deleted CWE",
                value: data?.deleted || 0,
                subTitle: "Total Deleted CWE",
                icon: GlobalICONS.EXPIRED,
                hasDecrement: false,
                hasIncrement: false,
                color: "red",
            },
        ],
        [data]
    );
    return {
        cweStatsConfig,
    };
};

export default useCweStatsConfig;
