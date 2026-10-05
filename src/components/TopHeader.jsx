import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function TopHeader({ activeModule, onSelectModule }) {
    const [currentTime, setCurrentTime] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);
    const { isDark, toggle } = useTheme();
    const menuRef = useRef(null);

    useEffect(() => {
        const updateClock = () => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        };
        updateClock();
        const timer = setInterval(updateClock, 1000);
        return () => clearInterval(timer);
    }, []);

    // Close drawer when clicking outside
    useEffect(() => {
        if (!menuOpen) return;
        const handleClick = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        document.addEventListener('touchstart', handleClick);
        return () => {
            document.removeEventListener('mousedown', handleClick);
            document.removeEventListener('touchstart', handleClick);
        };
    }, [menuOpen]);

    const modules = [
        { id: 'about',    label: 'About Me' },
        { id: 'skills',   label: 'What I Do' },
        { id: 'projects', label: 'Projects' },
        { id: 'aicv',     label: 'Resume' },
        { id: 'mission',  label: "Let's Connect" },
    ];

    const isActive = (id) => activeModule === id;

    const handleSelect = (id) => {
        onSelectModule(id);
        setMenuOpen(false);
    };

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
                <div className="mx-auto flex w-full max-w-300 items-center justify-between gap-3 px-3 sm:px-6">

                    {/* ── Desktop Nav tabs (hidden on mobile) ── */}
                    <div
                        role="tablist"
                        aria-label="Portfolio Navigation"
                        className="hidden sm:flex flex-1 flex-wrap items-center gap-1.5 md:justify-center"
                    >
                        {modules.map(mod => (
                            <button
                                key={mod.id}
                                role="tab"
                                aria-selected={isActive(mod.id)}
                                onClick={() => handleSelect(mod.id)}
                                className={`nm-btn text-sm font-medium px-4 py-1.5 ${
                                    isActive(mod.id) ? 'nm-btn-active' : ''
                                }`}
                                style={{ color: isActive(mod.id) ? '#fff' : 'var(--text-muted)' }}
                            >
                                {mod.label}
                            </button>
                        ))}
                    </div>

                    {/* ── Mobile: active page label (shown only on mobile) ── */}
                    <span
                        className="sm:hidden flex-1 text-sm font-semibold truncate"
                        style={{ color: 'var(--text-primary)' }}
                    >
                        {modules.find(m => m.id === activeModule)?.label ?? 'Portfolio'}
                    </span>

                    {/* Right side: Location & Clock + Theme Toggle + Hamburger */}
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

                        {/* ── Hamburger (mobile only) ── */}
                        <button
                            className="sm:hidden nm-circle"
                            style={{ width: '2.1rem', height: '2.1rem' }}
                            aria-label="Open navigation menu"
                            onClick={() => setMenuOpen(o => !o)}
                        >
                            <span className="text-base" style={{ color: 'var(--text-primary)', lineHeight: 1 }}>
                                {menuOpen ? '✕' : '☰'}
                            </span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* ── Mobile slide-down drawer ── */}
            {menuOpen && (
                <div
                    ref={menuRef}
                    className="sm:hidden fixed top-[3.2rem] left-0 right-0 z-40 flex flex-col gap-1 p-4"
                    style={{
                        backgroundColor: 'var(--nm-bg)',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.45)',
                        borderBottom: '1px solid var(--border)',
                        animation: 'fadeInModule 0.25s ease forwards',
                    }}
                >
                    {/* Time badge on mobile */}
                    <div
                        className="nm-badge mb-2 self-start"
                        style={{ color: 'var(--text-muted)' }}
                    >
                        <span className="size-2 animate-[pulsing_2s_infinite] rounded-full bg-emerald-400"></span>
                        <span>Nairobi, KE • {currentTime || 'EAT'}</span>
                    </div>

                    {modules.map(mod => (
                        <button
                            key={mod.id}
                            role="tab"
                            aria-selected={isActive(mod.id)}
                            onClick={() => handleSelect(mod.id)}
                            className={`nm-btn text-sm font-medium px-4 py-2.5 text-left w-full ${
                                isActive(mod.id) ? 'nm-btn-active' : ''
                            }`}
                            style={{
                                color: isActive(mod.id) ? '#fff' : 'var(--text-muted)',
                                borderRadius: '0.75rem',
                                textAlign: 'left',
                            }}
                        >
                            {mod.label}
                        </button>
                    ))}
                </div>
            )}
        </header>
    );
}
