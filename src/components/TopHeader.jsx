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
        { id: 'about',    label: 'About Me',   icon: 'fa-user' },
        { id: 'skills',   label: 'What I Do',  icon: 'fa-layer-group' },
        { id: 'projects', label: 'Projects',   icon: 'fa-code' },
        { id: 'mission',  label: 'Let\'s Connect', icon: 'fa-paper-plane' },
        { id: 'aicv',     label: 'AI Resume',  icon: 'fa-wand-magic-sparkles' },
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
                                <i className={`fa-solid ${mod.icon} text-[0.8rem] ${isActive(mod.id) ? 'text-white' : 'text-[#4361ee]'}`}></i>
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
                            <i
                                className={`theme-toggle-icon text-base ${isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon'}`}
                                key={isDark ? 'sun' : 'moon'}
                            ></i>
                        </button>
                    </div>
                </div>
            </nav>

            {/* ── Welcoming Intro Header shown on About tab ── */}
            {activeModule === 'about' && (
                <div className="mx-auto mt-6 max-w-300 px-6">
                    <div
                        className="max-w-2xl rounded-[18px] p-6 shadow-[0_10px_30px_var(--shadow-card)] backdrop-blur-xl transition-colors duration-300"
                        style={{
                            border: '1px solid var(--border)',
                            backgroundColor: 'var(--bg-card-solid)',
                        }}
                    >
                        <p
                            className="mb-4 border-l-4 border-[#4cc9f0] pl-4 text-sm font-medium leading-relaxed sm:text-base"
                            style={{ color: 'var(--text-primary)' }}
                        >
                            Welcome! I&apos;m <strong>Kelvin Kimani</strong> — a software developer &amp; systems enthusiast from Nairobi, Kenya.
                            Take a look at what I build, read the stories behind my projects, or drop me a line.
                        </p>

                        <div className="flex flex-wrap items-center gap-2.5">
                            {[
                                { href: 'mailto:kelvinkimani513@gmail.com', icon: 'fa-envelope', label: 'Email Kelvin' },
                                { href: 'https://wa.me/254701861965?text=Hi%20Kelvin%2C%20I%20saw%20your%20portfolio!', icon: 'fa-brands fa-whatsapp', label: 'WhatsApp', external: true },
                                { href: 'tel:0701861965', icon: 'fa-phone', label: '+254 701 861 965' },
                                { href: 'https://github.com/bscnrb112325-afk', icon: 'fa-brands fa-github', label: 'GitHub', external: true },
                                { href: 'https://www.linkedin.com/in/kelvin-kimani-a94552214/', icon: 'fa-brands fa-linkedin-in', label: 'LinkedIn', external: true },
                            ].map(({ href, icon, label, external }) => (
                                <a
                                    key={label}
                                    href={href}
                                    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                                    className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium no-underline transition-all duration-200 hover:-translate-y-0.5 hover:border-[#4cc9f0] hover:bg-[#4cc9f0]/10 hover:text-[#4cc9f0] hover:shadow-md hover:shadow-[#4cc9f0]/20"
                                    style={{
                                        border: '1px solid var(--border)',
                                        backgroundColor: 'var(--bg-overlay-light)',
                                        color: 'var(--text-muted)',
                                    }}
                                >
                                    <i className={`${icon.startsWith('fa-brands') ? icon : `fa-solid ${icon}`} text-[#4cc9f0] text-xs`}></i>
                                    <span>{label}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
