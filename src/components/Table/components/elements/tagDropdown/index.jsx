import React, { useState, useRef, useEffect, memo } from "react";
import { createPortal } from "react-dom";
import { Tag, ChevronDown, ChevronUp, Search, Check } from "lucide-react";
import apiClient from "@/services/api/config";

const TagsDropdown = ({
    onChange,
    initialSelected = [],
    multiple = false,
    label = "Tags",
    searchable = true,
    className = "",
    menuClassName = "",
    withStatusDot = false,
    optionsUrl,
    value = [],
    disabled,
    doNotPreserveState,
    name,
    options: propOptions = [],
    toggleOnly,
    usePortal = true, // New prop to enable/disable portal
    ...restProps
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedOptions, setSelectedOptions] = useState(initialSelected);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
    const dropdownRef = useRef(null);
    const triggerRef = useRef(null);
    const [options, setOptions] = useState([]);

    // Normalize options to a standard format
    useEffect(() => {
        const normalizedOptions = propOptions.map((option) => {
            // Handle string options
            if (typeof option === "string") {
                return { label: option, value: option };
            }

            // Handle React element options (spans)
            if (React.isValidElement(option)) {
                return {
                    label: option,
                    value: option.key || option.props.children,
                    key: option.key,
                };
            }

            // Handle object options (already formatted)
            if (option && typeof option === "object" && "label" in option) {
                return option;
            }

            return option;
        });

        setOptions(normalizedOptions);
    }, [propOptions]);

    // Calculate dropdown position relative to viewport
    const calculateDropdownPosition = () => {
        if (!triggerRef.current) return;

        const triggerRect = triggerRef.current.getBoundingClientRect();
        const dropdownHeight = 100; // Approximate max dropdown height
        const viewportHeight = window.innerHeight;
        const spaceBelow = viewportHeight - triggerRect.bottom;
        const spaceAbove = triggerRect.top;

        let top = triggerRect.bottom + window.scrollY;

        // If not enough space below and more space above, show dropdown above
        if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
            top = triggerRect.top + window.scrollY - Math.min(dropdownHeight, spaceAbove);
        }

        setDropdownPosition({
            top,
            left: triggerRect.left + window.scrollX,
            width: triggerRect.width,
        });
    };

    // Helper to get the option label for display
    const getOptionLabel = (option) => {
        if (typeof option === "string") return option;
        if (React.isValidElement(option?.label)) return option.label.props.children;
        return option?.label;
    };

    // Filter options based on search term
    const filteredOptions =
        searchTerm.trim() === ""
            ? options
            : options.filter((option) => {
                  const label = getOptionLabel(option);
                  return typeof label === "string" && label.toLowerCase().includes(searchTerm.toLowerCase());
              });

    // Helper to get the option value for comparison
    const getOptionValue = (option) => {
        if (typeof option === "string") return option;
        if (option && typeof option === "object") {
            if ("value" in option) return option.value;
            if ("key" in option) return option.key;
        }
        return option;
    };

    // Check if an option is selected
    const isOptionSelected = (option) => {
        const optionValue = getOptionValue(option);
        return selectedOptions.some((selected) => {
            const selectedValue = getOptionValue(selected);
            return selectedValue === optionValue;
        });
    };

    const handleOptionClick = (option) => {
        let newSelected;
        const optionValue = getOptionValue(option);

        if (isOptionSelected(option) && !toggleOnly) {
            // Remove if already selected
            newSelected = selectedOptions.filter((item) => getOptionValue(item) !== optionValue);
        } else {
            // Add if not selected or replace if not multiple
            newSelected = multiple ? [...selectedOptions, option?.value || option?.value == 0 ? option?.value : option] : [option?.value || option?.value == 0 ? option?.value : option];
        }

        if (onChange) {
            onChange({ target: { name, value: newSelected } });
        }

        if (!doNotPreserveState) {
            setSelectedOptions(newSelected);
        }

        if (!multiple) {
            setIsOpen(false);
        }
    };

    const toggleDropdown = () => {
        if (!disabled) {
            if (!isOpen) {
                calculateDropdownPosition();
                const selectedRow = filteredOptions.filter((option) => isOptionSelected(option));
                const notSelectedRow = filteredOptions.filter((option) => !isOptionSelected(option));
                setOptions([...selectedRow, ...notSelectedRow]);
                setSearchTerm("");
            }
            setIsOpen((prev) => !prev);
        }
    };

    // Get appropriate color for status dot based on text
    const getStatusDotColor = (option) => {
        const text = getOptionLabel(option)?.toLowerCase() || "";

        if (text.includes("succeeded") || text.includes("success")) {
            return "bg-green-500";
        } else if (text.includes("warning") || text.includes("warn")) {
            return "bg-yellow-500";
        } else if (text.includes("failed") || text.includes("error") || text.includes("fail")) {
            return "bg-red-500";
        } else if (text.includes("pending") || text.includes("in progress")) {
            return "bg-blue-500";
        } else {
            return "bg-gray-500";
        }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (triggerRef.current && !triggerRef.current.contains(event.target) && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        const handleScroll = () => {
            if (isOpen && usePortal) {
                calculateDropdownPosition();
            }
        };

        const handleResize = () => {
            if (isOpen && usePortal) {
                calculateDropdownPosition();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            if (usePortal) {
                window.addEventListener("scroll", handleScroll, true);
                window.addEventListener("resize", handleResize);
            }
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            if (usePortal) {
                window.removeEventListener("scroll", handleScroll, true);
                window.removeEventListener("resize", handleResize);
            }
        };
    }, [isOpen, usePortal]);

    // Render option with proper formatting
    const renderOption = (option) => {
        return (
            <div className="flex items-center">
                {withStatusDot && <div className={`w-2 h-2 rounded-full mr-2 ${getStatusDotColor(option)}`}></div>}
                {React.isValidElement(option?.label) ? option.label : getOptionLabel(option)}
            </div>
        );
    };

    // Fetch options from URL if provided
    useEffect(() => {
        const getDynamicOptions = async (optionUrl) => {
            const url = typeof optionUrl === "string" ? optionUrl : optionUrl.url;
            const labelKey = typeof optionUrl === "string" ? "label" : optionUrl.labelKey;
            const valueKey = typeof optionUrl === "string" ? "value" : optionUrl.valueKey;

            try {
                const response = await apiClient.get(url);
                if (optionUrl.transformResponse) {
                    setOptions(optionUrl.transformResponse(response.data).map((item) => ({ label: optionUrl?.dynamicLabel?.(item) || item?.[labelKey], value: item?.[valueKey] })));
                } else {
                    setOptions(response.data.map((item) => ({ label: optionUrl?.dynamicLabel?.(item) || item?.[labelKey], value: item?.[valueKey] })));
                }
            } catch (error) {
                console.error("Error fetching options:", error);
                setOptions([]);
            }
        };

        if (optionsUrl) {
            getDynamicOptions(optionsUrl);
        }
    }, [optionsUrl]);

    useEffect(() => {
        if (value?.length) {
            Array.isArray(value) ? setSelectedOptions(value) : setSelectedOptions([value]);
        } else {
            setSelectedOptions([]);
        }
    }, [value]);

    // Render dropdown content
    const renderDropdown = () => {
        if (!isOpen) return null;

        const dropdownContent = (
            <div
                ref={dropdownRef}
                className={`bg-white dark:bg-[#252526] border border-gray-300 dark:border-white/10 rounded-md shadow-lg dark:shadow-gray-900 z-[9999] ${menuClassName}`}
                style={
                    usePortal
                        ? {
                              position: "fixed",
                              top: dropdownPosition.top,
                              left: dropdownPosition.left,
                              minWidth: Math.max(dropdownPosition.width, 200),
                              maxWidth: "400px",
                          }
                        : {}
                }
            >
                {searchable && (
                    <div className="p-2 border-b border-gray-200 dark:border-white/10">
                        <div className="flex items-center px-2 py-1 bg-gray-50 dark:bg-[#1e1e1e] rounded-md">
                            <Search size={14} className="text-gray-400 dark:text-[#858585] mr-2" />
                            <input
                                type="text"
                                className="bg-transparent outline-none text-sm w-full dark:text-[#cccccc] dark:placeholder:text-[#858585]"
                                placeholder="Search tags"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                autoFocus
                            />
                        </div>
                    </div>
                )}

                <div className="max-h-60 overflow-y-auto">
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((option, index) => {
                            const isSelected = isOptionSelected(option);
                            return (
                                <div
                                    key={`option-${index}`}
                                    className={`px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-[#2a2d2e] cursor-pointer flex items-center justify-between ${
                                        isSelected 
                                            ? "bg-gray-50 dark:bg-[#2a2d2e] text-gray-700 dark:text-[#cccccc]" 
                                            : "text-gray-700 dark:text-[#cccccc]"
                                    }`}
                                    onClick={() => handleOptionClick(option)}
                                >
                                    <div className="flex items-center">{renderOption(option)}</div>
                                    {isSelected && <Check size={16} className="text-orange-500 dark:text-orange-400" />}
                                </div>
                            );
                        })
                    ) : (
                        <div className="px-4 py-2 text-sm text-gray-500 dark:text-[#858585] italic">No options found</div>
                    )}
                </div>
            </div>
        );

        // Use portal if enabled, otherwise render normally
        return usePortal ? createPortal(dropdownContent, document.body) : <div className="absolute mt-1 z-10 min-w-full">{dropdownContent}</div>;
    };

    return (
        <div className={`relative w-fit ${className?.container}`}>
            <button
                ref={triggerRef}
                className={`flex text-nowrap items-center gap-1 px-3 py-2 border border-gray-300 dark:border-white/10 rounded-md bg-white dark:bg-[#252526] text-sm dark:text-[#cccccc] ${
                    className?.body || ""
                }`}
                onClick={toggleDropdown}
                disabled={disabled}
                type="button"
            >
                <span>{label}</span>
                <span
                    className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                        selectedOptions.length ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400" : "bg-gray-100 dark:bg-[#3e3e42] text-gray-600 dark:text-[#858585]"
                    }`}
                >
                    {selectedOptions.length > 0 ? selectedOptions.length : options.length}
                </span>
                {isOpen ? <ChevronUp size={16} className="text-gray-500 dark:text-[#858585]" /> : <ChevronDown size={16} className="text-gray-500 dark:text-[#858585]" />}
            </button>

            {renderDropdown()}
        </div>
    );
};
export default memo(TagsDropdown);
