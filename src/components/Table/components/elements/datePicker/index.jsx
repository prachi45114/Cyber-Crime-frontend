import SuperDatePicker from "@/components/SuperDatePicker";
import Utils from "@/utils";
import moment from "moment";
import React, { useEffect, useState, useRef } from "react";

const TableDatePicker = ({ searchParams, handleOnChange, names = ["startDate", "endDate"] }) => {
    // Format month name

    const startDate = searchParams?.get(names[0]) ? moment(searchParams.get(names[0])).subtract(5, "hours").subtract(30, "minutes").toISOString() : "";

    const endDate = searchParams?.get(names[1]) ? moment(searchParams.get(names[1])).subtract(5, "hours").subtract(30, "minutes").toISOString() : "";

    const refreshCount = parseInt(searchParams?.get("refreshCount") || 0);

    const [refreshConfig, setRefreshConfig] = useState({
        isPaused: true,
        refreshInterval: 0,
    });

    const [isLoading, setIsLoading] = useState(false);
    const timeoutRef = useRef(null);
    const refreshIntervalRef = useRef(null);

    const handleTimeChange = ({ start, end }) => {
        setIsLoading(true);

        // Clear any existing timeout to prevent race conditions
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Set a small delay to debounce rapid changes
        timeoutRef.current = setTimeout(() => {
            if (startDate === start && endDate === end) {
                // If dates haven't changed, just refresh the data
                handleOnChange({ target: { name: "refreshCount", value: refreshCount + 1 } });
            } else {
                const resolvedStart = Utils.parseRelativeDate(start).start;
                const resolvedEnd = Utils.parseRelativeDate(end).end;
                handleOnChange({ target: { name: names[0], value: resolvedStart } });
                handleOnChange({ target: { name: names[1], value: resolvedEnd } });
            }
            handleOnChange({ target: { name: "page", value: 1 } });
            setIsLoading(false);
            // console.log(`Time range changed: ${start} to ${end}`);
            timeoutRef.current = null;
        }, 500);
    };

    const handleRefreshChange = ({ isPaused, refreshInterval }) => {
        setRefreshConfig({ isPaused, refreshInterval });
        console.log(`Refresh config changed: paused=${isPaused}, interval=${refreshInterval}ms`);

        // Clear any existing refresh interval
        if (refreshIntervalRef.current) {
            clearInterval(refreshIntervalRef.current);
            refreshIntervalRef.current = null;
        }

        // Set up new refresh interval if needed
        if (!isPaused && refreshInterval > 0) {
            refreshIntervalRef.current = setInterval(() => {
                console.log("Auto-refreshing data...");
                handleTimeChange({ start: startDate, end: endDate });
            }, refreshInterval);
        }
    };

    // Clean up intervals and timeouts when component unmounts
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            if (refreshIntervalRef.current) {
                clearInterval(refreshIntervalRef.current);
            }
        };
    }, []);

    return (
        <div>
            <SuperDatePicker
                key={`${startDate}-${endDate}`}
                start={startDate}
                end={endDate}
                onTimeChange={handleTimeChange}
                isLoading={isLoading}
                isPaused={refreshConfig.isPaused}
                refreshInterval={refreshConfig.refreshInterval}
                onRefreshChange={handleRefreshChange}
                isUpdateButton={false}
                disableQuickSelect={true}
                dateFormat="iso"
            />
        </div>
    );
};

export default TableDatePicker;
