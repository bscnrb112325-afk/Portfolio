import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [isDark, setIsDark] = useState(() => {
        try {
            const saved = localStorage.getItem('portfolio-theme');
            if (saved !== null) return saved === 'dark';
        } catch {}
        // Default: respect OS preference
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    // Apply theme to <html> data attribute on every change
    useEffect(() => {
        const html = document.documentElement;
        if (isDark) {
            html.setAttribute('data-theme', 'dark');
        } else {
            html.setAttribute('data-theme', 'light');
        }
        try {
            localStorage.setItem('portfolio-theme', isDark ? 'dark' : 'light');
        } catch {}
    }, [isDark]);

    const toggle = () => setIsDark(prev => !prev);

    return (
        <ThemeContext.Provider value={{ isDark, toggle }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
