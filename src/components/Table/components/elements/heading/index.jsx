import React from "react";
import FieldUtils from "../utils";

// Define heading variants and their default styles
const headingVariants = {
    h1: {
        base: "text-4xl font-bold tracking-tight",
        light: "text-gray-900",
        dark: "dark:text-gray-100",
    },
    h2: {
        base: "text-3xl font-semibold tracking-normal",
        light: "text-gray-800",
        dark: "dark:text-gray-200",
    },
    h3: {
        base: "text-2xl font-semibold",
        light: "text-gray-700",
        dark: "dark:text-gray-300",
    },
    h4: {
        base: "text-xl font-medium",
        light: "text-gray-600",
        dark: "dark:text-gray-400",
    },
    h5: {
        base: "text-lg font-medium",
        light: "text-gray-500",
        dark: "dark:text-gray-400",
    },
    h6: {
        base: "text-base font-medium",
        light: "text-gray-400",
        dark: "dark:text-gray-500",
    },
};

const Heading = ({ as = "h1", children, className, icon, iconPosition = "left", iconClassName, contentClassName, ...rest }) => {
    // Dynamic component based on 'as' prop
    const Component = as;

    // Combine base, light, and dark mode classes
    const headingClasses = FieldUtils.cn("flex items-center gap-1", headingVariants[as].base, headingVariants[as].light, headingVariants[as].dark, className);

    return (
        <Component className={headingClasses} {...rest}>
            {icon && iconPosition === "left" && (
                <span
                    className={FieldUtils.cn(
                        "flex-shrink-0",
                        "dark:text-gray-300", // Default dark mode icon color
                        iconClassName
                    )}
                >
                    {icon}
                </span>
            )}

            <span
                className={FieldUtils.cn(
                    "flex-grow",
                    "dark:text-gray-200", // Default dark mode text color
                    contentClassName
                )}
            >
                {children}
            </span>

            {icon && iconPosition === "right" && (
                <span
                    className={FieldUtils.cn(
                        "flex-shrink-0",
                        "dark:text-gray-300", // Default dark mode icon color
                        iconClassName
                    )}
                >
                    {icon}
                </span>
            )}
        </Component>
    );
};

export default Heading;

// Example usage component to demonstrate flexibility
export const HeadingShowCase = () => {
    return (
        <div className="space-y-4 p-4">
            <Heading
                as="h1"
                icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    </svg>
                }
            >
                Main Page Title
            </Heading>

            <Heading as="h2" iconPosition="right" className="text-blue-600" icon={<span>🚀</span>}>
                Section Title with Right Icon
            </Heading>

            <Heading as="h3" contentClassName="italic">
                Subtitle without Icon
            </Heading>
        </div>
    );
};
