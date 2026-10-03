import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function TopHeader({ activeModule, onSelectModule }) {
    const [currentTime, setCurrentTime] = useState('');
    const { isDark, toggle } = useTheme();

    useEffect(() => {
        const updateClock = () => {
            const now = new Date();
            // Formatted in 12-hour or 24-hour readable string
            setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        };
        updateClock();
        const timer = setInterval(updateClock, 1000);
        return () => clearInterval(timer);
    }, []);

    const modules = [
        { id: 'about',    label: 'About Me' },
        { id: 'skills',   label: 'What I Do' },
        { id: 'projects', label: 'Projects' },
        { id: 'aicv',     label: 'Resume' },
        { id: 'mission',  label: "Let's Connect" },
    ];

    const isActive = (id) => activeModule === id;

    return (
        <header className="w-full">
            {/* ── Sticky top nav ── */}
            <nav
                className="navbar sticky top-0 z-50 w-full backdrop-blur-xl transition-colors duration-300"
                style={{
                    backgroundColor: 'var(--nm-bg)',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.35), 0 -1px 0 rgba(255,255,255,0.04)',
                    borderBottom: 'none',
                }}
            >
                <div className="mx-auto flex w-full max-w-300 items-center justify-between gap-3 px-4 sm:px-6">

                    {/* Nav tabs */}
                    <div
                        role="tablist"
                        aria-label="Portfolio Navigation"
                        className="flex flex-1 flex-wrap items-center gap-1.5 overflow-x-auto scrollbar-none md:justify-center"
                    >
                        {modules.map(mod => (
                            <button
                                key={mod.id}
                                role="tab"
                                aria-selected={isActive(mod.id)}
                                onClick={() => onSelectModule(mod.id)}
                                className={`nm-btn text-sm font-medium px-4 py-1.5 ${
                                    isActive(mod.id) ? 'nm-btn-active' : ''
                                }`}
                                style={{ color: isActive(mod.id) ? '#fff' : 'var(--text-muted)' }}
                            >
                                {mod.label}
                            </button>
                        ))}
                    </div>

                    {/* Right side: Location & Clock + Theme Toggle */}
                    <div className="flex shrink-0 items-center gap-2">
                        {/* Live local time in Nairobi */}
                        <div
                            title="Local time in Nairobi, Kenya (UTC+3) · Available for projects"
                            className="nm-badge hidden sm:inline-flex"
                            style={{ color: 'var(--text-muted)' }}
                        >
                            <span className="size-2 animate-[pulsing_2s_infinite] rounded-full bg-emerald-400"></span>
                            <span>Nairobi, KE • {currentTime || 'EAT'}</span>
                        </div>

                        {/* ── Theme Toggle Button ── */}
                        <button
                            onClick={toggle}
                            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                            className="nm-circle"
                            style={{ width: '2.1rem', height: '2.1rem' }}
                        >
                            <span
                                className="theme-toggle-icon text-base"
                                key={isDark ? 'sun' : 'moon'}
                            >{isDark ? '☀️' : '🌙'}</span>
                        </button>
                    </div>
                </div>
            </nav>


        </header>
    );
}
