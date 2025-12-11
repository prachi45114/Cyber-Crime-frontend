import React, { createContext, useState, useContext, useEffect } from "react";
import globalConstants from "@/lib/utils/contants";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(typeof window !== "undefined" ? localStorage.getItem("theme") || globalConstants.THEME.DARK : globalConstants.THEME.DARK);

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === globalConstants.THEME.DARK) {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === globalConstants.THEME.LIGHT ? globalConstants.THEME.DARK : globalConstants.THEME.LIGHT));
    };

    return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
