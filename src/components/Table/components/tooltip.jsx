import React from "react";

export default function Tooltip({ data, styles, className, position, hidePointer }) {
    return (
        <div className={`${className} relative right-12`}>
            {/* Tooltip Container */}
            <div style={styles} className="absolute bg-white dark:bg-gray-800 p-3 shadow-lg rounded-md z-50 border border-gray-200 dark:border-gray-700 top-5 ">
                {/* Arrow pointing down (can be positioned as needed) */}
                {!hidePointer && (
                    <div
                        className={`absolute ${
                            position === "top" ? "-bottom-2 border-t-0 border-l-0" : "-top-2 border-b-0"
                        } left-6 w-4 h-4 bg-white dark:bg-gray-800 transform rotate-45  border  border-r-0 border-gray-200 dark:border-gray-700`}
                    ></div>
                )}

                {/* Content */}
                <div className="mb-2">
                    <h3 className="text-gray-800 dark:text-gray-200 text-sm font-medium">{data.title}</h3>
                </div>
                {data.content}
            </div>
        </div>
    );
}
