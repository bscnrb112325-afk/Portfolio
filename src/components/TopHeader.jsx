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
        { id: 'mission',  label: 'Let\'s Connect' },
        { id: 'aicv',     label: 'AI Resume' },
    ];

    const isActive = (id) => activeModule === id;

    return (
        <header className="w-full">
            {/* ── Sticky top nav ── */}
            <nav
                className="sticky top-0 z-50 w-full backdrop-blur-xl transition-colors duration-300"
                style={{
                    backgroundColor: 'var(--bg-nav)',
                    borderBottom: '1px solid var(--border-nav)',
                }}
            >
                <div className="mx-auto flex max-w-300 items-center justify-between gap-3 px-6 py-3">

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
                                className={`
                                    inline-flex shrink-0 cursor-pointer items-center gap-1.5
                                    whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium
                                    transition-all duration-200
                                    ${isActive(mod.id)
                                        ? 'border-transparent bg-linear-to-r from-[#4361ee] to-[#7209b7] font-semibold text-white shadow-lg shadow-[#4361ee]/40'
                                        : isDark
                                            ? 'border-white/15 bg-white/5 text-[#f8f9fa] hover:-translate-y-0.5 hover:border-[#4361ee] hover:bg-[#4361ee]/20 hover:text-white hover:shadow-md hover:shadow-[#4361ee]/20'
                                            : 'border-[#4361ee]/20 bg-[#4361ee]/5 text-[#12131a] hover:-translate-y-0.5 hover:border-[#4361ee] hover:bg-[#4361ee]/15 hover:text-[#4361ee] hover:shadow-md hover:shadow-[#4361ee]/15'
                                    }
                                `}
                            >
                                <span>{mod.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Right side: Location & Clock + Theme Toggle */}
                    <div className="flex shrink-0 items-center gap-2">
                        {/* Live local time in Nairobi */}
                        <div
                            title="Local time in Nairobi, Kenya (UTC+3) · Available for projects"
                            className="hidden items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400 sm:flex"
                        >
                            <span className="size-2 animate-[pulsing_2s_infinite] rounded-full bg-emerald-400"></span>
                            <span>Nairobi, KE • {currentTime || 'EAT'}</span>
                        </div>

                        {/* ── Theme Toggle Button ── */}
                        <button
                            onClick={toggle}
                            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                            className={`
                                relative flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full
                                border transition-all duration-300
                                ${isDark
                                    ? 'border-yellow-400/30 bg-yellow-400/10 text-yellow-300 hover:border-yellow-400/60 hover:bg-yellow-400/20 hover:text-yellow-200 hover:shadow-md hover:shadow-yellow-400/20'
                                    : 'border-[#4361ee]/30 bg-[#4361ee]/10 text-[#4361ee] hover:border-[#4361ee]/60 hover:bg-[#4361ee]/20 hover:shadow-md hover:shadow-[#4361ee]/20'
                                }
                            `}
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
