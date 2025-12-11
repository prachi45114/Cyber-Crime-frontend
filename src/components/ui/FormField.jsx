import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const FormField = ({ 
    label, 
    children, 
    error, 
    required = false, 
    className = "",
    helpText = null,
    icon: Icon = null 
}) => {
    return (
        <div className={cn("space-y-2", className)}>
            {label && (
                <label className="text-sm font-medium text-gray-700 dark:text-[#cccccc] flex items-center gap-2">
                    {Icon && <Icon className="w-4 h-4 text-gray-400 dark:text-[#858585]" />}
                    {label}
                    {required && <span className="text-red-500 dark:text-[#f48771]">*</span>}
                </label>
            )}
            
            <div className="relative">
                {children}
                
                {/* Error/Success Icons */}
                {error && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <AlertCircle className="w-4 h-4 text-red-500 dark:text-[#f48771]" />
                    </div>
                )}
            </div>
            
            {/* Error Message */}
            {error && (
                <div className="flex items-center gap-2 text-sm text-red-600 dark:text-[#f48771] animate-in slide-in-from-top-1 duration-200">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                </div>
            )}
            
            {/* Help Text */}
            {helpText && !error && (
                <p className="text-xs text-gray-500 dark:text-[#858585]">{helpText}</p>
            )}
        </div>
    );
};

export const Input = React.forwardRef(({ 
    className, 
    error, 
    icon: Icon, 
    ...props 
}, ref) => {
    return (
        <div className="relative">
            {Icon && (
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <Icon className="w-4 h-4 text-gray-400 dark:text-[#858585]" />
                </div>
            )}
            <input
                className={cn(
                    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#1e1e1e] dark:border-[#3e3e42] dark:text-[#cccccc] dark:placeholder:text-[#858585]",
                    error 
                        ? "border-red-500 focus-visible:ring-red-500 dark:border-[#f48771] dark:focus-visible:ring-[#f48771] pr-10" 
                        : "border-gray-300 dark:border-[#3e3e42] focus-visible:ring-blue-500 dark:focus-visible:ring-orange-500",
                    Icon && "pl-10",
                    className
                )}
                ref={ref}
                {...props}
            />
        </div>
    );
});

export const Textarea = React.forwardRef(({ 
    className, 
    error, 
    ...props 
}, ref) => {
    return (
        <textarea
            className={cn(
                "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#1e1e1e] dark:border-[#3e3e42] dark:text-[#cccccc] dark:placeholder:text-[#858585]",
                error 
                    ? "border-red-500 focus-visible:ring-red-500 dark:border-[#f48771] dark:focus-visible:ring-[#f48771]" 
                    : "border-gray-300 dark:border-[#3e3e42] focus-visible:ring-blue-500 dark:focus-visible:ring-orange-500",
                className
            )}
            ref={ref}
            {...props}
        />
    );
});

export const ValidationSummary = ({ errors, title = "Please fix the following errors:", dismissible = true }) => {
    const [visible, setVisible] = React.useState(false);

    // Determine if there are any errors present (flatten arrays)
    const errorEntries = React.useMemo(() => {
        if (!errors || typeof errors !== 'object') return [];
        return Object.entries(errors).filter(([_, err]) => {
            if (!err) return false;
            if (Array.isArray(err)) return err.some(Boolean);
            return true;
        });
    }, [errors]);

    // Show when errors change and exist
    React.useEffect(() => {
        setVisible(errorEntries.length > 0);
    }, [JSON.stringify(errors)]);

    if (!errorEntries.length || !visible) return null;

    return (
        <div className="relative rounded-lg border border-red-200 dark:border-[#3e3e42] bg-red-50 dark:bg-[#252526] p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-[#f48771]" />
                    <h4 className="font-semibold text-red-800 dark:text-[#cccccc]">{title}</h4>
                </div>
                {dismissible && (
                    <button
                        type="button"
                        onClick={() => setVisible(false)}
                        className="p-1.5 rounded-md hover:bg-red-100 dark:hover:bg-[#2a2d2e] text-red-600 dark:text-[#f48771]"
                        aria-label="Dismiss errors"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>
            <ul className="space-y-1">
                {errorEntries.map(([field, err]) => (
                    Array.isArray(err) ? (
                        err.filter(Boolean).map((e, idx) => (
                            <li key={`${field}-${idx}`} className="flex items-center gap-2 text-sm text-red-700 dark:text-[#f48771]">
                                <div className="w-1.5 h-1.5 bg-red-500 dark:bg-[#f48771] rounded-full flex-shrink-0" />
                                <span className="capitalize">{field.replace(/([A-Z])/g, ' $1').toLowerCase()}: {e}</span>
                            </li>
                        ))
                    ) : (
                        <li key={field} className="flex items-center gap-2 text-sm text-red-700 dark:text-[#f48771]">
                            <div className="w-1.5 h-1.5 bg-red-500 dark:bg-[#f48771] rounded-full flex-shrink-0" />
                            <span className="capitalize">{field.replace(/([A-Z])/g, ' $1').toLowerCase()}: {err}</span>
                        </li>
                    )
                ))}
            </ul>
        </div>
    );
};

export default FormField;
