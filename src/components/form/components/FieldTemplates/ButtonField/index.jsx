"use client";

import React from "react";
import styles from "./index.module.css";
import "./root.css";
import { Loader } from "lucide-react";
import GlobalICONS from "@/lib/utils/icons";

const Button = React.forwardRef(
    (
        {
            variant = "primary",
            outlined = false,
            flat = false,
            rounded = false,
            text = false,
            plain = false,
            tonal = false,
            icon = null,
            iconPosition = "left",
            iconOnly = false,
            size = "normal",
            fullWidth = false,
            loading = false,
            href,
            target,
            download,
            disabled = false,
            children,
            className = "",
            ripple = true,
            type = "button",
            onClick,
            rel,
            form,
            name,
            value,
            ariaLabel,
            tooltip,
            buttonContainerClassName,
            ...props
        },
        ref
    ) => {
        const [rippleStyle, setRippleStyle] = React.useState({});
        const [isRippling, setIsRippling] = React.useState(false);

        // Compute className based on props
        const computeClassName = () => {
            const classes = [
                styles.button,
                styles[variant],
                outlined && styles.outlined,
                flat && styles.flat,
                rounded && styles.rounded,
                text && styles.text,
                plain && styles.plain,
                tonal && styles.tonal,
                iconOnly && styles.iconOnly,
                styles[size],
                disabled && styles.disabled,
                loading && styles.loading,
                fullWidth && styles.fullWidth,
                className,
            ].filter(Boolean);

            return classes.join(" ");
        };

        const handleClick = (e) => {
            if (loading || disabled) return;

            if (ripple) {
                const rect = e.currentTarget.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;

                setRippleStyle({
                    width: `${size}px`,
                    height: `${size}px`,
                    top: `${y}px`,
                    left: `${x}px`,
                });

                // setIsRippling(true);
                // setTimeout(() => setIsRippling(false), 500);
            }

            onClick?.(e);
        };

        const Comp = href ? "a" : "button";

        const content = (
            <>
                {loading && <span className={styles.loader}>{GlobalICONS.LOADER}</span>}
                {icon && iconPosition === "left" && !loading && <span className={styles.iconLeft}>{icon}</span>}
                {!iconOnly && <span className={styles.children}>{children}</span>}
                {icon && iconPosition === "right" && !loading && <span className={styles.iconRight}>{icon}</span>}
                {ripple && isRippling && <span className={styles.ripple} style={rippleStyle} />}
            </>
        );

        return (
            <div className={`${styles.buttonWrapper} ${fullWidth ? styles.fullWidth : ""} ${buttonContainerClassName}`} {...(tooltip && { "data-tooltip": tooltip })}>
                <Comp
                    ref={ref}
                    className={computeClassName()}
                    disabled={disabled || loading}
                    onClick={handleClick}
                    type={type}
                    href={href}
                    target={target}
                    download={download}
                    rel={rel}
                    form={form}
                    name={name}
                    value={value}
                    aria-label={ariaLabel || (typeof children === "string" ? children : undefined)}
                    title={tooltip}
                    {...props}
                >
                    {content}
                </Comp>
            </div>
        );
    }
);

Button.displayName = "Button";

export default Button;
