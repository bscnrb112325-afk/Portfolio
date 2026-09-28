import React, { useState, useEffect } from 'react';
import { aboutData } from '../data/portfolioData';
import { apiFetch } from '../utils/api';

export default function AboutModule() {
    const [profile, setProfile] = useState({ name: aboutData.name, title: aboutData.headline });
    const [avatarSrc, setAvatarSrc] = useState(() => {
        try { return localStorage.getItem('profilePhoto') || './profile.png'; }
        catch { return './profile.png'; }
    });
    const [imgError, setImgError] = useState(false);

    useEffect(() => {
        apiFetch('/api/profile')
            .then(r => { if (r.ok) return r.json(); throw new Error(); })
            .then(d => setProfile(p => ({
                ...p,
                name: (d.name && d.name.toLowerCase() === 'kelvin') ? 'Kelvin Kimani' : (d.name || p.name),
                title: d.title || p.title
            })))
            .catch(() => {});
    }, []);

    const dynamicRoles = [
        'A Software Developer',
        'System Security',
        'AI Solutions',
        'Network Engineer'
    ];
    const [currentRoleText, setCurrentRoleText] = useState('');
    const [roleIndex, setRoleIndex]   = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const fullText = dynamicRoles[roleIndex % dynamicRoles.length];
        const speed    = isDeleting ? 35 : 75;
        const timer    = setTimeout(() => {
            if (!isDeleting) {
                setCurrentRoleText(fullText.slice(0, currentRoleText.length + 1));
                if (currentRoleText.length + 1 === fullText.length)
                    setTimeout(() => setIsDeleting(true), 2200);
            } else {
                setCurrentRoleText(fullText.slice(0, currentRoleText.length - 1));
                if (currentRoleText.length - 1 === 0) {
                    setIsDeleting(false);
                    setRoleIndex(p => p + 1);
                }
            }
        }, speed);
        return () => clearTimeout(timer);
    }, [currentRoleText, isDeleting, roleIndex]);

    const cardStyle = {
        border: '1px solid var(--border)',
        backgroundColor: 'var(--bg-card-solid)',
    };

    return (
        <section id="about" className="py-8">
            <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-start lg:justify-between">

                {/* ── Left: Story & Personal Narrative ── */}
                <div className="flex-1 animate-[fadeInUp_0.6s_cubic-bezier(0.16,1,0.3,1)_forwards]">



                    {/* Bio */}
                    <div className="space-y-4 text-[0.98rem] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                        <p>
                            I am a <strong style={{ color: 'var(--text-primary)' }}>Computer Science graduate</strong> passionate about using technology to solve real-world problems
                            and build reliable, secure, and efficient digital solutions.
                        </p>
                        <p>
                            My technical background covers <strong style={{ color: 'var(--text-primary)' }}>software development, artificial intelligence, cybersecurity, computer networking,
                            system administration, cloud technologies, and technical support</strong>. I enjoy designing and implementing solutions that improve business operations,
                            automate tasks, protect information, and make technology easier and more accessible.
                        </p>
                        <p>
                            I combine technical knowledge with practical problem-solving to develop solutions that are
                            <strong style={{ color: 'var(--text-primary)' }}> secure, scalable, user-friendly, and focused on real business needs</strong>.
                        </p>
                        <p>
                            I am continuously developing my skills and exploring emerging technologies in
                            software engineering, artificial intelligence, cybersecurity, cloud computing, and network infrastructure.
                        </p>
                    </div>

                    {/* Quick Facts Grid */}
                    <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {aboutData.quickFacts.map(fact => (
                            <div
                                key={fact.label}
                                className="card card-bordered card-sm flex-row items-center gap-3 p-3.5 transition-all duration-200 hover:border-primary/40 bg-base-200/40 backdrop-blur-sm"
                                style={cardStyle}
                            >
                                <div className="min-w-0">
                                    <div className="text-[0.75rem] font-semibold uppercase tracking-wider text-base-content/60">
                                        {fact.label}
                                    </div>
                                    <div className="truncate text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                                        {fact.value}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Guiding Principles */}
                    <div className="mt-8">
                        <h3 className="mb-3 text-base font-semibold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
                            How I Think & Work
                        </h3>
                        <div className="grid gap-3 sm:grid-cols-2">
                            {aboutData.principles.map(p => (
                                <div
                                    key={p.title}
                                    className="card card-bordered card-sm p-4 transition-all duration-200 hover:border-primary/40 bg-base-200/40 backdrop-blur-sm"
                                    style={cardStyle}
                                >
                                    <div className="mb-1.5 flex items-center gap-2">
                                        <h4 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{p.title}</h4>
                                    </div>
                                    <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                                        {p.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>


                </div>

                {/* ── Right: Personal Profile Card ── */}
                <div className="w-full shrink-0 animate-[fadeInUp_0.6s_cubic-bezier(0.16,1,0.3,1)_0.15s_forwards] opacity-0 lg:w-[320px]">
                    <div
                        className="card card-bordered relative flex flex-col items-center justify-center overflow-hidden p-6 shadow-2xl backdrop-blur-md transition-colors duration-300 bg-base-200/60"
                        style={cardStyle}
                    >
                        <div className="pointer-events-none absolute inset-0 -skew-x-12 animate-[shine_6s_infinite] bg-linear-to-r from-transparent via-white/5 to-transparent"></div>

                        {/* Avatar photo */}
                        <div className="relative mb-5 size-36 overflow-hidden rounded-full border-2 border-white/20 bg-linear-to-br from-[#4361ee]/20 to-[#7209b7]/20 shadow-[0_0_30px_rgba(67,97,238,0.25)]">
                            {!imgError ? (
                                <img
                                    src={avatarSrc}
                                    alt={profile.name}
                                    className="h-full w-full object-cover"
                                    onError={() => setImgError(true)}
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-[#4cc9f0]">
                                    KK
                                </div>
                            )}
                        </div>

                        <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                            Kelvin Kimani
                        </h3>
                        <p className="mb-3 text-center text-xs font-medium text-[#4cc9f0]">
                            B.Sc. Computer Science & System Security
                        </p>

                        <div className="mb-5 flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                            <span>Nairobi, Kenya</span>
                        </div>

                        {/* Status Chip */}
                        <div className="badge badge-success badge-outline mb-5 gap-2 px-3.5 py-3 text-xs font-medium">
                            <span className="size-2 animate-[pulsing_2s_infinite] rounded-full bg-emerald-400"></span>
                            <span>{aboutData.status}</span>
                        </div>

                        {/* Direct Social Links */}
                        <div className="flex flex-wrap items-center justify-center gap-2">
                            {[
                                { href: 'https://github.com/bscnrb112325-afk', label: 'GitHub' },
                                { href: 'https://www.linkedin.com/in/kelvin-kimani-a94552214/', label: 'LinkedIn' },
                                { href: 'mailto:kelvinkimani513@gmail.com', label: 'Email' },
                                { href: 'https://wa.me/254701861965?text=Hi%20Kelvin%2C%20I%20saw%20your%20portfolio%20and%20wanted%20to%20reach%20out!', label: 'WhatsApp' }
                            ].map(item => (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    target={item.href.startsWith('http') ? '_blank' : undefined}
                                    rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                    aria-label={item.label}
                                    title={item.label}
                                    className="btn btn-outline btn-sm rounded-lg text-xs"
                                >
                                    {item.label}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
