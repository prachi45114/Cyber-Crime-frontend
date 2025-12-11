import React, { useEffect, useState } from "react";

const RulesTabs = ({
    options = [
        { id: "elastic", label: "Elastic rules", count: 970 },
        { id: "custom", label: "Custom rules", count: 0 },
    ],
    defaultSelected = "elastic",
    onChange = () => {},
    accentColor = "rgb(255 142 6 / 1)",
    name,
}) => {
    const [selected, setSelected] = useState(defaultSelected);

    const handleTabClick = (optionId) => {
        setSelected(optionId);

        onChange({ target: { name, value: optionId } });
    };

    useEffect(() => {
        setSelected(defaultSelected);
    }, [defaultSelected]);

    return (
        <div className="inline-flex rounded-md shadow-sm bg-white dark:bg-[#252526] border border-gray-200 dark:border-[#3e3e42] text-sm">
            {options.map((option) => {
                const isActive = selected === option.id;
                return (
                    <button
                        key={option.id}
                        type="button"
                        className={`flex items-center px-3 py-[0.4rem] transition-colors duration-200 ${
                            isActive 
                                ? "text-orange-500 dark:text-[#ff9f43] dark:bg-[#1e1e1e] font-medium" 
                                : "text-gray-600 dark:text-[#cccccc] hover:bg-gray-50 dark:hover:bg-[#2a2d2e]"
                        } ${option.id === options[0].id ? "rounded-l-md" : option.id === options[options.length - 1].id ? "rounded-r-md" : ""}`}
                        style={{
                            color: isActive ? accentColor : undefined,
                            borderBottom: isActive ? `2px solid ${accentColor}` : "none",
                        }}
                        onClick={() => handleTabClick(option.id)}
                    >
                        <span>{option.label}</span>
                        {option?.count?.toString() && (
                            <span
                                className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                                    isActive 
                                        ? "bg-orange-100 dark:bg-[#ff9f43]/20 text-orange-600 dark:text-[#ff9f43]" 
                                        : "bg-gray-100 dark:bg-[#3e3e42] text-gray-600 dark:text-[#858585]"
                                }`}
                                style={{
                                    backgroundColor: isActive ? `${accentColor}15` : undefined,
                                    color: isActive ? accentColor : undefined,
                                }}
                            >
                                {option.count}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
};

export default RulesTabs;
