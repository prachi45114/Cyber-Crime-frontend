import React from "react";

const StatCard = ({ data }) => {
    // Color configuration for borders and icons
    // In dark mode, all cards use uniform gray border (#3e3e42)
    const colorConfig = {
        orange: {
            border: "border-b-2 border-orange-400/40 dark:border-b-2 dark:border-[#3e3e42] hover:border-orange-400 dark:hover:border-[#464647]",
            iconBg: "bg-orange-400/15 dark:bg-[#ff9f43]/20",
            iconColor: "text-orange-500 dark:text-[#ff9f43]",
        },
        green: {
            border: "border-b-2 border-green-400/40 dark:border-b-2 dark:border-[#3e3e42] hover:border-green-400 dark:hover:border-[#464647]",
            iconBg: "bg-green-400/15 dark:bg-[#4ec9b0]/20",
            iconColor: "text-green-500 dark:text-[#4ec9b0]",
        },
        red: {
            border: "border-b-2 border-red-400/40 dark:border-b-2 dark:border-[#3e3e42] hover:border-red-400 dark:hover:border-[#464647]",
            iconBg: "bg-red-400/15 dark:bg-[#f48771]/20",
            iconColor: "text-red-500 dark:text-[#f48771]",
        },
        blue: {
            border: "border-b-2 border-blue-400/40 dark:border-b-2 dark:border-[#3e3e42] hover:border-blue-400 dark:hover:border-[#464647]",
            iconBg: "bg-blue-400/15 dark:bg-[#569cd6]/20",
            iconColor: "text-blue-500 dark:text-[#569cd6]",
        },
        violet: {
            border: "border-b-2 border-violet-400/40 dark:border-b-2 dark:border-[#3e3e42] hover:border-violet-400 dark:hover:border-[#464647]",
            iconBg: "bg-violet-400/15 dark:bg-[#9cdcfe]/20",
            iconColor: "text-violet-500 dark:text-[#9cdcfe]",
        },
        pink: {
            border: "border-b-2 border-pink-400/40 dark:border-b-2 dark:border-[#3e3e42] hover:border-pink-400 dark:hover:border-[#464647]",
            iconBg: "bg-pink-400/15 dark:bg-[#c586c0]/20",
            iconColor: "text-pink-500 dark:text-[#c586c0]",
        },
    };

    const colors = colorConfig[data.color] || colorConfig.orange;

    return (
        <div
            className={`
                max-w-[600px] w-full p-5 rounded-md
                bg-white dark:bg-[#252526]
                border dark:border-[#3e3e42]
                shadow-[0_3px_12px_rgba(47,43,61,0.14)] 
                dark:shadow-[0_3px_12px_rgba(0,0,0,0.3)]
                hover:shadow-[0_3px_15px_rgba(47,43,61,0.2)]
                dark:hover:shadow-[0_3px_15px_rgba(0,0,0,0.4)]
                transition-all duration-200
                ${colors.border}
            `}
        >
            <div className="flex justify-between items-center">
                <div className="flex-1 min-w-0">
                    <div className="text-base font-medium leading-[2.375rem] text-[#444050] dark:text-[#cccccc] mb-1.5 block">
                        {data.title}
                    </div>
                    <div className="text-2xl font-medium text-[#444050] dark:text-[#cccccc] mb-0.5 block">
                        {data.value}
                    </div>
                    <div className="text-[0.775rem] font-light text-[#858484] dark:text-[#858585] block">
                        {data.subTitle}
                    </div>
                </div>
                <div
                    className={`
                        flex-none inline-flex items-center justify-center
                        rounded-lg p-2
                        transition-all duration-200
                        border border-white/30 dark:border-white/10
                        ${colors.iconBg}
                        ${colors.iconColor}
                    `}
                >
                    {data.icon}
                </div>
            </div>
        </div>
    );
};

export default StatCard;
