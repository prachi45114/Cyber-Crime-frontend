import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const ModalPopup = ({ show, onClose, title, icon, iconBg, description, children, maxHeight = "h-full", maxWidth = "max-w-2xl", position = "center", headerActions = [] }) => {
    if (!show) return null;

    const positionClasses = {
        center: "items-center justify-center",
        top: "items-start justify-center",
        bottom: "items-end justify-center",
        left: "items-center justify-start",
        right: "items-center justify-end",
    };

    return (
        <div
            className={cn("fixed inset-0 z-50 flex bg-black/50 backdrop-blur-sm transition-all duration-300", positionClasses[position])}
            onClick={onClose} // Close when clicking backdrop
        >
            <div
                className={cn("bg-white dark:bg-[#252526] shadow-2xl w-full flex flex-col", maxWidth, maxHeight, "relative", { "rounded-lg": position === "center" })}
                onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
            >
                {/* Header */}
                <div className="flex items-start justify-between p-4 border-b border-gray-200 dark:border-gray-700 space-x-3">
                    <div className="flex items-center gap-3">
                        {icon && <div className={`flex items-center justify-center w-10 h-10 rounded ${iconBg || "bg-orange-100 dark:bg-slate-700"}`}>{icon}</div>}
                        <div className="flex flex-col space-y-0">
                            {title && <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>}
                            {description && <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-1">{description}</p>}
                        </div>
                    </div>

                    {/* Right side actions */}
                    <div className="flex items-center space-x-4">
                        {headerActions.map((action, idx) => (
                            <span key={idx} className="cursor-pointer">
                                {action}
                            </span>
                        ))}
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="p-4 overflow-y-auto text-gray-700 dark:text-gray-300">{children}</div>
            </div>
        </div>
    );
};

export default ModalPopup;
