import { createContext, useEffect, useMemo, useState } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {

    const storage_key = "Theme";

    const [theme, setTheme] = useState(() => {
        return localStorage.getItem(storage_key) || "system";
    });

    const [currentTheme, setCurrentTheme] = useState("light");

    useEffect(() => {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");

        let activeTheme = "";

        const applyTheme = () => {
            if (theme == "system") {
                activeTheme = systemTheme.matches ? "dark" : "light";
            } else {
                activeTheme = theme;
            }

            setCurrentTheme(activeTheme);

            document.documentElement.classList.remove("dark", "light");

            document.documentElement.classList.add(activeTheme);

        };

        applyTheme();

        systemTheme.addEventListener("change", applyTheme);

        return () => {
            systemTheme.removeEventListener("change", applyTheme)
        }

    }, [theme])

    useEffect(() => {
        localStorage.setItem(storage_key, theme);
    }, [theme]);


    const toggleTheme = () => {

        setTheme((prevTheme) => {
            const activeTheme = prevTheme === "system" ? currentTheme : prevTheme;

            return activeTheme === "dark" ? "light" : "dark"
        })

    };

    const value = useMemo(() => {
        return {
            theme,
            setTheme,
            currentTheme,
            toggleTheme
        }
    }, [theme, currentTheme]);


    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};