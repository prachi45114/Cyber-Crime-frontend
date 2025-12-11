import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import styles from "./styles/index.module.css";
import { ICONS } from "./utils/icons";
import { ArrowRight, RefreshCcw } from "lucide-react";

const SuperDatePicker = ({
    start = "now/d",
    end = "now",
    onTimeChange,
    isLoading = false,
    onRefreshChange,
    recentlyUsedRanges = [],
    left = 0,
    commonRanges = [
        { start: "now/d", end: "now", label: "Today" },
        { start: "now-1d/d", end: "now-1d/d", label: "Yesterday" },
        { start: "now/w", end: "now", label: "This week" },
        { start: "now-7d/w", end: "now", label: "Week to date" },
        { start: "now/M", end: "now", label: "This month" },
        { start: "now-1M/M", end: "now", label: "Month to date" },
        { start: "now/y", end: "now", label: "This year" },
        { start: "now-1y/y", end: "now", label: "Year to date" },
    ],
    isPaused = true,
    refreshInterval = 0,
    isUpdateButton = true,
    disableQuickSelect = false,
    dateFormat,
}) => {
    // State for dropdown menus
    const [isQuickMenuOpen, setIsQuickMenuOpen] = useState(false);
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("absolute");
    // State for dropdown positions
    const [quickMenuPosition, setQuickMenuPosition] = useState({ top: 0, left: 0 });
    const [datePickerPosition, setDatePickerPosition] = useState({ top: 0, left: 0 });
    // State for time values
    const [isRelativeDisplayedTimeRange, setRelativeDisplayedTimeRange] = useState(true);
    const [localStart, setLocalStart] = useState(start);
    const [localEnd, setLocalEnd] = useState(end);
    const [displayedTimeRange, setDisplayedTimeRange] = useState("Today");
    const [startDate, setStartDate] = useState(parseDate(start));
    const [endDate, setEndDate] = useState(parseDate(end));
    const [inputDateValue, setInputDateValue] = useState();
    const [isInputDateChanged, setInputDateChanged] = useState(false);
    const [isUpdateEnabled, setIsUpdateEnabled] = useState(false);
    const [isInvalidDate, setIsInvalidDate] = useState(false);

    // Quick select values
    const [quickSelectValue, setQuickSelectValue] = useState("11");
    const [quickSelectUnit, setQuickSelectUnit] = useState("Hours");

    // Refresh settings
    const [localRefreshInterval, setLocalRefreshInterval] = useState(refreshInterval);
    const [localIsPaused, setLocalIsPaused] = useState(isPaused);
    const [refreshUnit, setRefreshUnit] = useState("Seconds");

    // Date picker values
    const [relativeValue, setRelativeValue] = useState(24);
    const [relativeUnit, setRelativeUnit] = useState("Hours ago");
    const [roundToMinute, setRoundToMinute] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(startDate.getMonth());
    const [currentYear, setCurrentYear] = useState(startDate.getFullYear());
    const [selectedHour, setSelectedHour] = useState(startDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }));
    const [selectingStart, setSelectingStart] = useState(true); // Track whether selecting start or end date

    // Refs for click outside handling and positioning
    const quickMenuRef = useRef(null);
    const datePickerRef = useRef(null);
    const calendarButtonRef = useRef(null);
    const todayButtonRef = useRef(null);
    const controlBarRef = useRef(null);

    const formatDate = (date) => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} @ ${date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
            fractionalSecondDigits: 3,
        })}`;
    };

    // Format time range for display
    useEffect(() => {
        formatTimeRange(localStart, localEnd);
    }, [localStart, localEnd]);

    // Update input value when dates change
    useEffect(() => {
        if (selectingStart) {
            setInputDateValue(formatDate(startDate));
        } else {
            setInputDateValue(formatDate(endDate));
        }
    }, [startDate, endDate, selectingStart]);

    // Update dropdown positions dynamically
    useEffect(() => {
        let animationFrameId;

        const updatePosition = () => {
            if (controlBarRef.current) {
                const rect = controlBarRef.current.getBoundingClientRect();
                const newPosition = {
                    top: rect.bottom + window.scrollY,
                    left: rect.left + window.scrollX - left,
                };
                setQuickMenuPosition(newPosition);
                setDatePickerPosition(newPosition);
            }
            // Schedule the next update if dropdowns are open
            if (isQuickMenuOpen || isDatePickerOpen) {
                animationFrameId = requestAnimationFrame(updatePosition);
            }
        };

        // Start updating positions when dropdowns are open
        if (isQuickMenuOpen || isDatePickerOpen) {
            updatePosition();
        }

        // Clean up on unmount or when dropdowns close
        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, [isQuickMenuOpen, isDatePickerOpen]);

    // Handle outside clicks for quick menu
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (quickMenuRef.current && !quickMenuRef.current.contains(event.target) && calendarButtonRef.current && !calendarButtonRef.current.contains(event.target)) {
                setIsQuickMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Handle outside clicks for date picker
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (datePickerRef.current && !datePickerRef.current.contains(event.target) && todayButtonRef.current && !todayButtonRef.current.contains(event.target)) {
                setIsDatePickerOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const formatTimeRange = (startTime, endTime) => {
        let formattedDisplay = "";
        setRelativeDisplayedTimeRange(true);
        setIsInvalidDate(false);
        if (startTime.includes("now") && endTime.includes("now")) {
            if (startTime === "now/d" && endTime === "now") formattedDisplay = "Today";
            else if (startTime.includes("now-")) {
                const match = startTime.match(/now-(\d+)([smhdwMy])/);
                if (match) {
                    const value = match[1];
                    const unit = { s: "seconds", m: "minutes", h: "hours", d: "days", w: "weeks", M: "months", y: "years" }[match[2]];
                    formattedDisplay = `Last ${value} ${unit}`;
                }
            } else if (startTime === "now/w" && endTime === "now") {
                formattedDisplay = "This Week";
            } else if (startTime === "now/y" && endTime === "now") {
                formattedDisplay = "This Year";
            } else if (startTime === "now/M" && endTime === "now") {
                formattedDisplay = "This Month";
            }
        }

        if (!formattedDisplay) {
            const parsedStartTime = startTime === "now" ? new Date() : new Date(startTime);
            const parsedEndTime = endTime === "now" ? new Date() : new Date(endTime);

            formattedDisplay = `${formatDate(parsedStartTime)} → ${formatDate(parsedEndTime)}`;

            if (parsedStartTime > parsedEndTime) {
                setIsInvalidDate(true);
            }

            if (onTimeChange && !isUpdateEnabled) {
                onTimeChange({
                    start: startTime === start ? startTime : formatDate(parsedStartTime),
                    end: endTime === end ? endTime : formatDate(parsedEndTime),
                });
            }
            setRelativeDisplayedTimeRange(false);
        }
        setDisplayedTimeRange(formattedDisplay);
    };

    const toggleQuickMenu = () => {
        if (disableQuickSelect) {
            setIsDatePickerOpen(!isDatePickerOpen);
        } else {
            setIsQuickMenuOpen(!isQuickMenuOpen);
            if (isDatePickerOpen) setIsDatePickerOpen(false);
        }
    };

    const toggleDatePicker = () => {
        setIsDatePickerOpen(!isDatePickerOpen);
        if (isQuickMenuOpen) setIsQuickMenuOpen(false);
    };

    const applyQuickSelect = () => {
        const unitMap = { Seconds: "s", Minutes: "m", Hours: "h", Days: "d", Weeks: "w", Months: "M", Years: "y" };
        const newStart = `now-${quickSelectValue}${unitMap[quickSelectUnit]}`;
        const newEnd = "now";
        setLocalStart(newStart);
        setLocalEnd(newEnd);
        if (onTimeChange) onTimeChange({ start: newStart, end: newEnd });
        setIsQuickMenuOpen(false);
    };

    const applyCommonRange = (range) => {
        setLocalStart(range.start);
        setLocalEnd(range.end);
        if (onTimeChange) onTimeChange({ start: range.start, end: range.end });
        setIsQuickMenuOpen(false);
    };

    const handleRefresh = () => {
        if (onTimeChange) onTimeChange({ start: localStart, end: localEnd });
    };

    const handleUpdate = () => {
        setIsUpdateEnabled(false);
        handleRefresh();
    };

    const handleRefreshToggle = () => {
        const newState = !localIsPaused;
        setLocalIsPaused(newState);
        if (onRefreshChange) onRefreshChange({ isPaused: newState, refreshInterval: localRefreshInterval });
    };

    const handleRefreshIntervalChange = (e) => {
        const value = parseInt(e.target.value || "0");
        setLocalRefreshInterval(value);
        if (onRefreshChange) onRefreshChange({ isPaused: localIsPaused, refreshInterval: value });
    };

    const generateCalendarDays = () => {
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
        const daysFromPrevMonth = Array.from({ length: firstDayOfMonth }, (_, i) => ({
            day: new Date(currentYear, currentMonth, 0).getDate() - firstDayOfMonth + i + 1,
            month: currentMonth - 1,
            year: currentMonth === 0 ? currentYear - 1 : currentYear,
            isCurrentMonth: false,
        }));
        const days = Array.from({ length: daysInMonth }, (_, i) => ({
            day: i + 1,
            month: currentMonth,
            year: currentYear,
            isCurrentMonth: true,
        }));
        const remainingCells = 42 - (daysFromPrevMonth.length + days.length);
        const daysFromNextMonth = Array.from({ length: remainingCells }, (_, i) => ({
            day: i + 1,
            month: currentMonth + 1,
            year: currentMonth === 11 ? currentYear + 1 : currentYear,
            isCurrentMonth: false,
        }));
        return [...daysFromPrevMonth, ...days, ...daysFromNextMonth];
    };

    const isSelectedDay = (day, isStart) => {
        const date = isStart ? startDate : endDate;
        return day.day === date.getDate() && day.month === date.getMonth() && day.year === date.getFullYear();
    };

    const isToday = (day) => {
        const today = new Date();
        return day.day === today.getDate() && day.month === today.getMonth() && day.year === today.getFullYear();
    };

    const goToPrevMonth = () => {
        setCurrentMonth(currentMonth === 0 ? 11 : currentMonth - 1);
        setCurrentYear(currentMonth === 0 ? currentYear - 1 : currentYear);
    };

    const goToNextMonth = () => {
        setCurrentMonth(currentMonth === 11 ? 0 : currentMonth + 1);
        setCurrentYear(currentMonth === 11 ? currentYear + 1 : currentYear);
    };

    const selectDay = (day) => {
        setIsUpdateEnabled(true);
        const newDate = new Date(currentYear, day.month, day.day);
        newDate.setHours(selectingStart ? startDate.getHours() : endDate.getHours());
        newDate.setMinutes(selectingStart ? startDate.getMinutes() : endDate.getMinutes());
        if (selectingStart) {
            setStartDate(newDate);
            setLocalStart(formatDate(newDate));
        } else {
            setEndDate(newDate);
            setLocalEnd(formatDate(newDate));
        }
    };

    const selectTime = (time) => {
        setIsUpdateEnabled(true);
        const [hours, minutes] = time.split(":").map(Number);
        const newDate = new Date(selectingStart ? startDate : endDate);
        newDate.setHours(hours);
        newDate.setMinutes(minutes);
        if (selectingStart) {
            setStartDate(newDate);
            setLocalStart(formatDate(newDate));
        } else {
            setEndDate(newDate);
            setLocalEnd(formatDate(newDate));
        }
        setSelectedHour(time);
    };

    const timeOptions = [];
    for (let hour = 0; hour < 24; hour++) {
        for (let minute of [0, 30]) {
            const formattedHour = hour.toString().padStart(2, "0");
            const formattedMinute = minute.toString().padStart(2, "0");
            timeOptions.push(`${formattedHour}:${formattedMinute}`);
        }
    }

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const selectStartDateRange = (e) => {
        e.stopPropagation();
        setIsDatePickerOpen(true);
        setSelectingStart(true);
        setInputDateChanged(false);
        setIsUpdateEnabled(true);
    };

    const selectEndDateRange = (e) => {
        e.stopPropagation();
        setIsDatePickerOpen(true);
        setSelectingStart(false);
        setInputDateChanged(false);
        setIsUpdateEnabled(true);
    };

    // Parse the input date string
    const parseInputDate = (input) => {
        try {
            const regex = /(\w+)\s+(\d+),\s+(\d+)\s+@\s+(\d+):(\d+):(\d+)\.(\d+)/;
            const match = input.match(regex);

            if (match) {
                const [_, month, day, year, hour, minute, second] = match;
                const monthIndex = new Date(`${month} 1, 2000`).getMonth();
                return new Date(parseInt(year), monthIndex, parseInt(day), parseInt(hour), parseInt(minute), parseInt(second));
            }

            const date = new Date(input);
            if (!isNaN(date.getTime())) {
                return date;
            }

            return selectingStart ? startDate : endDate;
        } catch (e) {
            return selectingStart ? startDate : endDate;
        }
    };

    function parseDate(dateStr) {
        if (dateStr && dateStr?.includes("now")) return new Date();

        try {
            let isoString;
            if (dateFormat == "iso") {
                const [datePart, timePart] = dateStr.split("T").map((s) => s.trim());
                isoString = new Date(`${datePart} ${timePart}`).toISOString();
            } else {
                const [datePart, timePart] = dateStr.split("@").map((s) => s.trim());
                isoString = new Date(`${datePart} ${timePart}`).toISOString();
            }

            return new Date(isoString);
        } catch (err) {
            return new Date();
        }
    }

    const handleInputChange = (e) => {
        setInputDateChanged(true);
        setInputDateValue(e.target.value);
    };

    // Handle form submission
    const applyInputDateTime = () => {
        const parsedDate = parseInputDate(inputDateValue);
        if (selectingStart) {
            setStartDate(parsedDate);
            setLocalStart(formatDate(parsedDate));
        } else {
            setEndDate(parsedDate);
            setLocalEnd(formatDate(parsedDate));
        }

        setIsDatePickerOpen(false);
    };

    // Quick Menu Dropdown with createPortal
    const quickMenuDropdown = isQuickMenuOpen && !disableQuickSelect && (
        <div
            ref={quickMenuRef}
            className={`${styles.quickMenu} ${isRelativeDisplayedTimeRange ? styles.rightAligned : ""} dark:bg-gray-800 dark:border-gray-700`}
            style={{ position: "absolute", top: `${quickMenuPosition.top}px`, left: `${quickMenuPosition.left}px`, zIndex: 1000 }}
        >
            <div className={styles.section}>
                <h3 className={`${styles.sectionTitle} dark:text-gray-400`}>Quick select</h3>
                <div className={styles.quickSelectInputs}>
                    <div className={styles.inputWrapper}>
                        <span className={`${styles.inputLabel} dark:text-white`}>Last</span>
                        <input
                            type="number"
                            value={quickSelectValue}
                            onChange={(e) => setQuickSelectValue(e.target.value)}
                            className={`${styles.numberInput} dark:border-gray-700 dark:bg-gray-800 dark:text-white`}
                        />
                    </div>
                    <select
                        value={quickSelectUnit}
                        onChange={(e) => setQuickSelectUnit(e.target.value)}
                        className={`${styles.selectInput} ${styles.formSelect} dark:border-gray-700 dark:bg-gray-800 dark:text-white`}
                    >
                        <option>Hours</option>
                        <option>Days</option>
                        <option>Weeks</option>
                        <option>Months</option>
                        <option>Years</option>
                    </select>
                    <button
                        className={`${styles.applyButton} bg-orange-100 hover:bg-orange-200 text-orange-600 border border-orange-400 dark:border-orange-500 dark:bg-orange-500 dark:text-white`}
                        onClick={applyQuickSelect}
                    >
                        Apply
                    </button>
                </div>
            </div>
            <div className={styles.section}>
                <h3 className={`${styles.sectionTitle} dark:text-gray-400`}>Commonly used</h3>
                <div className={styles.commonRangesGrid}>
                    {commonRanges.slice(0, 4).map((range, index) => (
                        <button key={index} className={`${styles.rangeButton} dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-900`} onClick={() => applyCommonRange(range)}>
                            {range.label}
                        </button>
                    ))}
                </div>
                <div className={styles.commonRangesGrid}>
                    {commonRanges.slice(4).map((range, index) => (
                        <button
                            key={index + 4}
                            className={`${styles.rangeButton} dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-900`}
                            onClick={() => applyCommonRange(range)}
                        >
                            {range.label}
                        </button>
                    ))}
                </div>
            </div>
            <div className={styles.refreshSection}>
                <div className={styles.refreshControls}>
                    <div className={styles.toggleContainer}>
                        <input type="checkbox" id="toggle" className={`${styles.toggleInput}`} checked={!localIsPaused} onChange={handleRefreshToggle} />
                        <label htmlFor="toggle" className={`${styles.toggleLabel} ${!localIsPaused ? styles.toggleActive : ""} dark:!bg-black dark:border dark:!border-gray-200`}></label>
                        <span className={`${styles.toggleHandle} ${!localIsPaused ? styles.toggleHandleActive : ""} dark:!bg-gray-300 dark:border-0`}></span>
                    </div>
                    <span className={`${styles.refreshLabel} dark:text-white`}>Refresh every</span>
                    <input
                        type="number"
                        className={`${styles.refreshInput} dark:border-gray-700 dark:bg-gray-800 dark:text-white`}
                        value={localIsPaused ? "" : localRefreshInterval}
                        onChange={handleRefreshIntervalChange}
                        disabled={localIsPaused}
                    />
                    <select
                        className={`${styles.refreshSelect} ${styles.formSelect} dark:!border-gray-700 dark:!bg-gray-800 dark:text-white`}
                        value={refreshUnit}
                        onChange={(e) => setRefreshUnit(e.target.value)}
                        disabled={localIsPaused}
                    >
                        <option>Seconds</option>
                        <option>Minutes</option>
                        <option>Hours</option>
                    </select>
                </div>
            </div>
        </div>
    );

    // Date Picker Dropdown with createPortal
    const datePickerDropdown = isDatePickerOpen && (
        <div
            ref={datePickerRef}
            className={`${styles.datePicker} ${isRelativeDisplayedTimeRange ? styles.rightAligned : ""} dark:border-gray-700 dark:bg-gray-800 dark:text-white`}
            style={{ position: "absolute", top: `${datePickerPosition.top}px`, left: `${datePickerPosition.left}px`, zIndex: 1000 }}
        >
            <div className={styles.tabs}>
                <button
                    className={`${styles.tab} ${activeTab === "absolute" ? styles.tabActive : ""} dark:border-[#3e3e42] dark:bg-[#252526] dark:text-[#cccccc] dark:hover:bg-[#2a2d2e]`}
                    onClick={() => setActiveTab("absolute")}
                >
                    Absolute
                </button>
            </div>
            {activeTab === "absolute" && (
                <div className={styles.tabContent}>
                    <div className={styles.calendarHeader}>
                        <button onClick={goToPrevMonth} className={`${styles.navButton} dark:bg-[#252526]`}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                        <div className={styles.monthYearSelect}>
                            <select
                                value={monthNames[currentMonth]}
                                onChange={(e) => setCurrentMonth(monthNames.indexOf(e.target.value))}
                                className={`${styles.monthSelect} ${styles.formSelect} dark:border-[#3e3e42] dark:bg-[#252526] dark:text-[#cccccc] dark:focus:outline-none focus:ring-1 dark:focus:ring-orange-500 dark:focus:border-orange-500`}
                            >
                                {monthNames.map((month, index) => (
                                    <option key={month} value={month}>
                                        {month}
                                    </option>
                                ))}
                            </select>
                            <select
                                value={currentYear}
                                onChange={(e) => setCurrentYear(parseInt(e.target.value))}
                                className={`${styles.yearSelect} ${styles.formSelect} dark:border-[#3e3e42] dark:bg-[#252526] dark:text-[#cccccc] dark:focus:outline-none focus:ring-1 dark:focus:ring-orange-500 dark:focus:border-orange-500`}
                            >
                                {Array.from({ length: 10 }, (_, i) => currentYear - 5 + i).map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button onClick={goToNextMonth} className={`${styles.navButton} dark:bg-[#252526]`}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                    <div className={styles.calendar}>
                        <div>
                            <div className={styles.dayNames}>
                                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                                    <div key={day} className={`${styles.dayName} dark:text-gray-400`}>
                                        {day}
                                    </div>
                                ))}
                            </div>
                            <div className={styles.daysGrid}>
                                {generateCalendarDays().map((day, i) => (
                                    <button
                                        key={i}
                                        className={`${styles.dayButton} ${
                                            isSelectedDay(day, selectingStart)
                                                ? styles.daySelected
                                                : day.isCurrentMonth
                                                ? isToday(day)
                                                    ? styles.dayToday
                                                    : `${styles.dayCurrent} dark:text-white`
                                                : styles.dayOther
                                        }`}
                                        onClick={() => {
                                            selectDay(day);
                                        }}
                                    >
                                        {day.day}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className={styles.timeDropdownContainer}>
                            {
                                <div className={styles.timeOptions}>
                                    {timeOptions.map((time) => (
                                        <button
                                            key={time}
                                            className={`${styles.timeOption} ${time === selectedHour ? styles.timeOptionSelected : ""} dark:bg-[#252526] dark:text-[#cccccc] dark:hover:bg-[#2a2d2e] `}
                                            onClick={() => selectTime(time)}
                                        >
                                            {time}
                                        </button>
                                    ))}
                                </div>
                            }
                        </div>
                    </div>
                    <div className={styles.timeSelector}>
                        <div className={styles.dateControls}>
                            {selectingStart ? (
                                <div className={`${styles.dateControlButton} dark:border-gray-700`}>
                                    <span className="dark:bg-gray-600 dark:text-white dark:border-gray-800">Start Date</span>
                                    <input type="text" value={inputDateValue} className="dark:bg-[#1e1e1e] dark:text-[#cccccc]" onChange={handleInputChange} />
                                </div>
                            ) : (
                                <div className={`${styles.dateControlButton} dark:border-gray-800`}>
                                    <span className="dark:bg-gray-600 dark:text-white dark:border-gray-700">End Date</span>
                                    <input className="dark:bg-[#1e1e1e] dark:text-[#cccccc]" type="text" value={inputDateValue} onChange={handleInputChange} />
                                </div>
                            )}
                            <button className={`${styles.dateControlsUpdateButton} ${isInputDateChanged ? styles.updateDateBtnActive : ""} `} onClick={applyInputDateTime}>
                                {ICONS.CHECK_MARK}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {
                <div className={`${styles.actionFooter} dark:bg-gray-700 dark:border-gray-600`}>
                    <button
                        onClick={() => {
                            setIsDatePickerOpen(false);
                            handleRefresh();
                        }}
                        className="p-2 flex align-middle justify-center gap-1 bg-orange-600 text-white text-[0.85rem] px-4 rounded-lg hover:bg-orange-700"
                    >
                        <RefreshCcw className="w-4 h-4" />
                        Update
                    </button>
                </div>
            }
        </div>
    );

    return (
        <div className={styles.container}>
            <div className={styles.controlBar} ref={controlBarRef}>
                <div className={`${styles.dateButtonContainer}`}>
                    <button ref={calendarButtonRef} className={`${styles.calendarButton} bg-orange-50 dark:!bg-gray-800 dark:!text-white dark:border-gray-700`} onClick={toggleQuickMenu}>
                        {ICONS.CALENDAR}
                        {ICONS.CHEVRON_BOTTOM}
                    </button>
                    {isRelativeDisplayedTimeRange ? (
                        <button ref={todayButtonRef} className={`${styles.dateDisplayButton} dark:!bg-gray-900 dark:!text-white dark:border-gray-700`} onClick={toggleDatePicker}>
                            {displayedTimeRange}
                        </button>
                    ) : (
                        <div
                            className={`${styles.dateRangeButtonsContainer} ${
                                isUpdateEnabled && !isInvalidDate ? styles.isDateRangeActive : isInvalidDate ? styles.invalidDateRange : ""
                            } dark:bg-[#252526] dark:border-[#3e3e42] dark:text-[#cccccc]`}
                            ref={todayButtonRef}
                            onClick={toggleDatePicker}
                        >
                            <button className={selectingStart ? styles.active : ""} onClick={selectStartDateRange}>
                                <span>{formatDate(new Date(startDate))}</span>
                            </button>
                            <span className={`${styles.rightArrow}`}>
                                <ArrowRight />
                            </span>
                            <button className={!selectingStart ? styles.active : ""} onClick={selectEndDateRange}>
                                <span>{formatDate(new Date(endDate))}</span>
                            </button>
                            {isInvalidDate && <span className={styles.alertIcon}>{ICONS.ALERT}</span>}
                        </div>
                    )}
                </div>
                {isUpdateButton !== false && (
                    <>
                        {isUpdateEnabled ? (
                            <button
                                className={`${styles.updateButton} ${isLoading || isInvalidDate ? styles.refreshButtonDisabled : ""} bg-orange-500 hover:bg-orange-600`}
                                onClick={handleUpdate}
                                disabled={isInvalidDate || isLoading}
                            >
                                <span>{isLoading ? ICONS.LOADER : ICONS.UPDATE}</span> {isLoading ? "Updating..." : "Update"}
                            </button>
                        ) : (
                            <button
                                className={`${styles.refreshButton} ${isLoading ? styles.refreshButtonDisabled : ""} bg-orange-500 hover:bg-orange-600`}
                                onClick={handleRefresh}
                                disabled={isLoading}
                            >
                                <span>{isLoading ? ICONS.LOADER : ICONS.REFRESH}</span> {isLoading ? "Updating..." : "Refresh"}
                            </button>
                        )}
                    </>
                )}
            </div>
            {isQuickMenuOpen && !disableQuickSelect && createPortal(quickMenuDropdown, document.body)}
            {isDatePickerOpen && createPortal(datePickerDropdown, document.body)}
        </div>
    );
};

export default SuperDatePicker;
