"use client";
import React, { useState, useEffect, useRef, cloneElement, isValidElement } from "react";
import styles from "./index.module.css";

const Dropdown = ({ trigger, content, dropDownContainerStyle, dropDownContainerClass }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef();

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const renderChildren = () => {
        return React.Children.map(content, (child) => {
            if (isValidElement(child)) {
                return cloneElement(child, {});
            }
            return child;
        });
    };

    return (
        <div ref={dropdownRef} className={styles.dropdown}>
            <div onClick={toggleDropdown} className={styles.dropdown_trigger}>
                {trigger}
            </div>
            {isOpen && content && (
                <div className={`${styles.dropdown_content} ${dropDownContainerClass || ""}`} style={dropDownContainerStyle}>
                    {renderChildren()}
                </div>
            )}
        </div>
    );
};

export default Dropdown;
