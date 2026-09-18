import React, { useState, useEffect } from 'react';
import { aboutData } from '../data/portfolioData';

export default function AboutModule() {
    const [profile, setProfile] = useState({ name: aboutData.name, title: 'A Software Developer' });
    const [avatarSrc, setAvatarSrc] = useState(() => {
        try { return localStorage.getItem('profilePhoto') || './profile.png'; }
        catch { return './profile.png'; }
    });
    const [imgError, setImgError] = useState(false);

    useEffect(() => {
        fetch('/api/profile')
            .then(r => { if (r.ok) return r.json(); throw new Error(); })
            .then(d => setProfile(p => ({ ...p, name: d.name || p.name, title: d.title || p.title })))
            .catch(() => {});
    }, []);

    const dynamicRoles = ['A Software Developer', 'System Security', 'AI Solutions', 'Network Engineer'];
    const [currentRoleText, setCurrentRoleText] = useState('');
    const [roleIndex, setRoleIndex]   = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const fullText = dynamicRoles[roleIndex % dynamicRoles.length];
        const speed    = isDeleting ? 40 : 85;
        const timer    = setTimeout(() => {
            if (!isDeleting) {
                setCurrentRoleText(fullText.slice(0, currentRoleText.length + 1));
                if (currentRoleText.length + 1 === fullText.length)
                    setTimeout(() => setIsDeleting(true), 2000);
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
        <section id="about" className="py-10">
            <div className="flex flex-col items-center gap-10 md:flex-row md:items-start md:justify-between">

                {/* ── Left: Text content ── */}
                <div className="flex-1 animate-[fadeInUp_0.6s_cubic-bezier(0.16,1,0.3,1)_forwards]">
                    <span className="mb-1 block text-lg font-medium text-[#4cc9f0]">Hi, I'm</span>
                    <h1
                        className="mb-3 text-5xl font-extrabold tracking-tight md:text-6xl"
                        style={{ color: 'var(--text-primary)' }}
                    >
                        Kelvin
                    </h1>

                    {/* Typewriter badge */}
                    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#4cc9f0]/40 bg-linear-to-r from-[#4361ee]/15 to-[#4cc9f0]/10 px-4 py-2 shadow-lg shadow-[#4361ee]/10">
                        <span className="text-xs font-bold uppercase tracking-widest text-[#4cc9f0]">
                            <i className="fa-solid fa-bolt mr-1"></i>Focus:
                        </span>
                        <span className="min-h-[1.6rem] bg-linear-to-r from-[#4361ee] to-[#4cc9f0] bg-clip-text text-base font-bold text-transparent">
                            {currentRoleText}
                        </span>
                        <span className="animate-[blinkCursor_0.8s_infinite] text-lg font-extrabold text-[#4cc9f0]">|</span>
                    </div>

                    {/* Role pills */}
                    <div className="mb-6 flex flex-wrap items-center gap-3 text-lg font-normal" style={{ color: 'var(--text-muted)' }}>
                        {aboutData.roles.map((role, i) => (
                            <React.Fragment key={`${role}-${i}`}>
                                <span>{role}</span>
                                {i < aboutData.roles.length - 1 && <span className="text-[#4361ee]">||</span>}
                            </React.Fragment>
                        ))}
                    </div>

                    {/* Bio paragraphs */}
                    <div className="grid gap-4">
                        <p className="text-[1.05rem] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                            I am a Computer Science graduate passionate about using technology to solve real-world
                            problems and build reliable, secure, and efficient digital solutions.
                        </p>
                        <p className="text-[0.95rem] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                            My technical background covers{' '}
                            <strong style={{ color: 'var(--text-primary)' }}>
                                software development, artificial intelligence, cybersecurity, computer networking,
                                system administration, cloud technologies, and technical support
                            </strong>. I enjoy designing and implementing solutions that improve business operations,
                            automate tasks, protect information, and make technology easier and more accessible.
                        </p>
                        <p className="text-[0.95rem] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                            I combine technical knowledge with practical problem-solving to develop solutions that
                            are <strong style={{ color: 'var(--text-primary)' }}>secure, scalable, user-friendly, and focused on real business needs</strong>.
                        </p>
                    </div>

                    {/* What I Bring card */}
                    <div className="mt-7 rounded-2xl p-5 transition-colors duration-300" style={cardStyle}>
                        <h3 className="mb-3 text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>What I Bring</h3>
                        <ul className="list-disc space-y-1 pl-5 text-[0.9rem] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                            {[
                                'Software development and application design',
                                'AI integration and automation',
                                'Network configuration and troubleshooting',
                                'System administration and infrastructure support',
                                'Cybersecurity and security best practices',
                                'Cloud services and data protection',
                                'Technical problem-solving and IT support',
                            ].map(item => <li key={item}>{item}</li>)}
                        </ul>
                    </div>

                    {/* Availability banner */}
                    <div className="mt-6 inline-block rounded-full border border-teal-400/35 px-4 py-3 text-sm leading-relaxed" style={{ backgroundColor: 'var(--bg-availability)' }}>
                        <span className="font-bold" style={{ color: 'var(--text-primary)' }}>Currently Available: </span>
                        <span style={{ color: 'var(--text-muted)' }}>
                            Open to opportunities, collaborations, internships, freelance projects, and professional
                            roles in software development, AI, cybersecurity, networking, cloud infrastructure, and IT operations.
                        </span>
                    </div>
                </div>

                {/* ── Right: Profile card ── */}
                <div className="animate-[fadeInUp_0.6s_cubic-bezier(0.16,1,0.3,1)_0.15s_forwards] opacity-0 md:w-[320px]">
                    <div
                        className="relative flex aspect-4/5 w-full max-w-[320px] flex-col items-center justify-center overflow-hidden rounded-2xl p-8 shadow-2xl backdrop-blur-md transition-colors duration-300"
                        style={cardStyle}
                    >
                        <div className="pointer-events-none absolute inset-0 -skew-x-12 animate-[shine_6s_infinite] bg-linear-to-r from-transparent via-white/5 to-transparent"></div>

                        <div className="relative mb-6 size-36 overflow-hidden rounded-full border-2 border-white/15 bg-linear-to-br from-[#4361ee]/20 to-[#7209b7]/20 shadow-[0_0_30px_rgba(67,97,238,0.2)]">
                            {!imgError ? (
                                <img src={avatarSrc} alt={profile.name} className="h-full w-full object-cover" onError={() => setImgError(true)} />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-5xl text-[#4cc9f0]">
                                    <i className="fa-solid fa-user-astronaut"></i>
                                </div>
                            )}
                        </div>

                        <div
                            className="flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors duration-300"
                            style={{ border: '1px solid var(--border)', backgroundColor: 'var(--bg-overlay)', color: 'var(--text-primary)' }}
                        >
                            <span className="size-2 animate-[pulsing_2s_infinite] rounded-full bg-[#00f5d4]"></span>
                            <span>{aboutData.status}</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
