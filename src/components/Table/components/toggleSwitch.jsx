export const ToggleSwitch = ({ enabled, onChange, size = "default" }) => {
    const sizeClasses = size === "small" ? "h-5 w-9" : "h-6 w-11";
    const thumbTranslateOn = size === "small" ? "translate-x-5" : "translate-x-6";
    const thumbSize = size === "small" ? "h-3 w-3" : "h-4 w-4";

    return (
        <button
            type="button"
            onClick={onChange}
            className={`relative inline-flex ${sizeClasses} items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
                enabled ? "bg-blue-600 dark:bg-blue-500" : "bg-gray-200 dark:bg-gray-600"
            }`}
        >
            <span className={`inline-block ${thumbSize} transform rounded-full bg-white transition-transform ${enabled ? thumbTranslateOn : "translate-x-1"}`} />
        </button>
    );
};

