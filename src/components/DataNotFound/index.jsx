import { FileQuestion } from "lucide-react";
import React from "react";

const DataNotFound = ({ message = "No Data Available", description = "", Icon = FileQuestion, textStyle = {} }) => {
    return (
        <div className="flex flex-col items-center justify-center text-center py-10 px-4 rounded-lg">
            <Icon className="w-10 h-10 text-orange-400 mb-3" />
            <h3 className="text-md font-semibold text-black dark:text-gray-300" style={textStyle}>
                {message}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>
        </div>
    );
};

export default DataNotFound;
