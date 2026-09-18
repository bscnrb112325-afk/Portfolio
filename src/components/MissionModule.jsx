import React from 'react';
import { missionData } from '../data/portfolioData';

export default function MissionModule() {
    const currentYear = new Date().getFullYear();

    return (
        <section id="mission" className="py-10">
            {/* Hero */}
            <div className="mb-12 text-center">
                <h2 className="mb-6 bg-linear-to-r from-[#4361ee] via-[#4cc9f0] to-[#7209b7] bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
                    {missionData.title}
                </h2>
                <blockquote className="mx-auto max-w-2xl text-xl leading-relaxed italic" style={{ color: 'var(--text-muted)' }}>
                    <span className="font-bold not-italic text-[#4cc9f0]">&ldquo;</span>
                    {missionData.statement}
                    <span className="font-bold not-italic text-[#4cc9f0]">&rdquo;</span>
                </blockquote>
            </div>

            {/* Contact chips */}
            <div className="mb-10 flex flex-wrap items-center justify-center gap-4">
                {[
                    { href: `mailto:${missionData.contact.email}`, icon: 'fa-envelope', label: missionData.contact.email },
                    { href: `tel:${missionData.contact.phone}`,    icon: 'fa-phone',    label: missionData.contact.phone },
                ].map(({ href, icon, label }) => (
                    <a
                        key={href}
                        href={href}
                        className="inline-flex items-center gap-2 rounded-full border border-[#4361ee]/40 bg-[#4361ee]/10 px-5 py-3 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:border-[#4361ee] hover:bg-[#4361ee]/25 hover:text-[#4361ee] hover:shadow-md"
                        style={{ color: 'var(--text-muted)' }}
                    >
                        <i className={`fa-solid ${icon} text-[#4cc9f0] text-base`}></i>
                        {label}
                    </a>
                ))}
            </div>

            {/* Social icons */}
            <div className="mb-14 flex items-center justify-center gap-4">
                {[
                    { href: missionData.contact.linkedin,              icon: 'fa-brands fa-linkedin-in', label: 'LinkedIn' },
                    { href: `mailto:${missionData.contact.email}`,     icon: 'fa-solid fa-envelope',     label: 'Email' },
                    { href: `tel:${missionData.contact.phone}`,        icon: 'fa-solid fa-phone',        label: 'Phone' },
                    { href: missionData.contact.github,                icon: 'fa-brands fa-github',      label: 'GitHub' },
                ].map(({ href, icon, label }) => (
                    <a
                        key={label}
                        href={href}
                        target={href.startsWith('http') ? '_blank' : undefined}
                        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        aria-label={label}
                        className="flex size-12 items-center justify-center rounded-full text-lg transition-all duration-200 hover:-translate-y-1 hover:border-[#4cc9f0]/60 hover:bg-[#4cc9f0]/10 hover:text-[#4cc9f0] hover:shadow-lg hover:shadow-[#4cc9f0]/20"
                        style={{
                            border: '1px solid var(--border)',
                            backgroundColor: 'var(--bg-overlay-light)',
                            color: 'var(--text-muted)',
                        }}
                    >
                        <i className={icon}></i>
                    </a>
                ))}
            </div>

            {/* Copyright */}
            <p className="text-center text-sm" style={{ color: 'var(--text-faint)' }}>
                &copy; {currentYear} kelvin. All rights reserved.
            </p>
        </section>
    );
}
