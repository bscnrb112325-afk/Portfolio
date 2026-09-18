import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function TopHeader({ activeModule, onSelectModule }) {
    const [currentTime, setCurrentTime] = useState('');
    const { isDark, toggle } = useTheme();

    useEffect(() => {
        const updateClock = () => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        };
        updateClock();
        const timer = setInterval(updateClock, 1000);
        return () => clearInterval(timer);
    }, []);

    const modules = [
        { id: 'about',    label: 'About',    icon: 'fa-user' },
        { id: 'skills',   label: 'Skills',   icon: 'fa-layer-group' },
        { id: 'projects', label: 'Projects', icon: 'fa-code' },
        { id: 'mission',  label: 'Mission',  icon: 'fa-bullseye' },
        { id: 'aicv',     label: 'AI CV',    icon: 'fa-wand-magic-sparkles' },
        { id: 'posts',    label: 'Posts',    icon: 'fa-newspaper' },
    ];

    const isActive = (id) =>
        activeModule === id || (id === 'posts' && activeModule === 'post');

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
                <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-3 px-6 py-3">

                    {/* Nav tabs */}
                    <div
                        role="tablist"
                        aria-label="Portfolio Sections"
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
                                        ? 'border-transparent bg-gradient-to-r from-[#4361ee] to-[#7209b7] font-semibold text-white shadow-lg shadow-[#4361ee]/40'
                                        : isDark
                                            ? 'border-white/15 bg-white/5 text-[#f8f9fa] hover:-translate-y-0.5 hover:border-[#4361ee] hover:bg-[#4361ee]/20 hover:text-white hover:shadow-md hover:shadow-[#4361ee]/20'
                                            : 'border-[#4361ee]/20 bg-[#4361ee]/5 text-[#12131a] hover:-translate-y-0.5 hover:border-[#4361ee] hover:bg-[#4361ee]/15 hover:text-[#4361ee] hover:shadow-md hover:shadow-[#4361ee]/15'
                                    }
                                `}
                            >
                                <i className={`fa-solid ${mod.icon} text-[0.8rem] ${isActive(mod.id) ? 'text-white' : 'text-[#4361ee]'}`}></i>
                                <span>{mod.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Right side: clock + theme toggle */}
                    <div className="flex shrink-0 items-center gap-2">
                        {/* Live clock badge */}
                        <div
                            title="Portfolio Active Status"
                            className="hidden items-center gap-1.5 rounded-full border border-[#10b981]/40 bg-[#10b981]/10 px-3 py-1.5 text-xs font-semibold text-[#10b981] sm:flex"
                        >
                            <span className="size-2 animate-[pulsing_2s_infinite] rounded-full bg-[#10b981]"></span>
                            <span style={{ color: '#10b981' }}>Live • {currentTime || 'Ready'}</span>
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
                            <i
                                className={`theme-toggle-icon text-base ${isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon'}`}
                                key={isDark ? 'sun' : 'moon'}
                            ></i>
                        </button>
                    </div>
                </div>
            </nav>

            {/* ── Intro card shown only on About tab ── */}
            {activeModule === 'about' && (
                <div className="mx-auto mt-6 max-w-[1200px] px-6">
                    <div
                        className="max-w-xl rounded-[18px] p-7 shadow-[0_10px_30px_var(--shadow-card)] backdrop-blur-xl transition-colors duration-300"
                        style={{
                            border: '1px solid var(--border)',
                            backgroundColor: 'var(--bg-card-solid)',
                        }}
                    >
                        <p
                            className="mb-5 border-l-4 border-[#4cc9f0] pl-4 text-base font-medium leading-relaxed"
                            style={{ color: 'var(--text-primary)' }}
                        >
                            Explore my portfolio to discover my projects, technical skills, and professional journey.
                        </p>

                        <div className="flex flex-wrap items-center gap-3">
                            {[
                                { href: 'mailto:kelvinkimani513@gmail.com', icon: 'fa-envelope',         label: 'kelvinkimani513@gmail.com' },
                                { href: 'tel:0701861965',                   icon: 'fa-phone',             label: '0701861965' },
                                { href: 'https://github.com/bscnrb112325-afk', icon: 'fa-brands fa-github', label: 'bscnrb112325-afk', external: true },
                                { href: 'https://www.linkedin.com/in/kelvin-kimani-a94552214/', icon: 'fa-brands fa-linkedin-in', label: 'LinkedIn', external: true },
                            ].map(({ href, icon, label, external }) => (
                                <a
                                    key={href}
                                    href={href}
                                    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                                    className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium no-underline transition-all duration-200 hover:-translate-y-0.5 hover:border-[#4cc9f0] hover:bg-[#4cc9f0]/10 hover:text-[#4cc9f0] hover:shadow-md hover:shadow-[#4cc9f0]/20"
                                    style={{
                                        border: '1px solid var(--border)',
                                        backgroundColor: 'var(--bg-overlay-light)',
                                        color: 'var(--text-muted)',
                                    }}
                                >
                                    <i className={`${icon.startsWith('fa-brands') ? icon : `fa-solid ${icon}`} text-[#4cc9f0] text-sm`}></i>
                                    <span className="max-w-[160px] truncate">{label}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
