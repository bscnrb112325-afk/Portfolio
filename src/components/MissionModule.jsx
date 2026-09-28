import React, { useState } from 'react';
import { missionData } from '../data/portfolioData';
import { apiFetch } from '../utils/api';

export default function MissionModule() {
    const currentYear = new Date().getFullYear();

    // Contact form state
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('New Project Collaboration');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState({ state: 'idle', msg: '' });

    const handleSubmitMessage = async (e) => {
        e.preventDefault();
        if (!name.trim() || !email.trim() || !message.trim()) {
            setStatus({ state: 'error', msg: 'Please fill in your name, email, and a short message.' });
            return;
        }

        setStatus({ state: 'loading', msg: 'Sending your message...' });

        try {
            const res = await apiFetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: name.trim(),
                    email: email.trim(),
                    message: `[Subject: ${subject}]\n\n${message.trim()}`
                })
            });

            if (res.ok) {
                setStatus({
                    state: 'success',
                    msg: `Thanks for reaching out, ${name.trim()}! Your message is safely received. I'll get back to you at ${email.trim()} shortly.`
                });
                setName('');
                setEmail('');
                setMessage('');
            } else {
                throw new Error('API unavailable');
            }
        } catch (err) {
            // Graceful fallback to mailto
            const mailtoUrl = `mailto:${missionData.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Hi Kelvin,\n\n${message}\n\nFrom: ${name} (${email})`)}`;
            window.open(mailtoUrl, '_blank');
            setStatus({
                state: 'success',
                msg: `Direct connection opened in your email app. Looking forward to speaking with you, ${name.trim()}!`
            });
        }
    };

    const cardStyle = {
        border: '1px solid var(--border)',
        backgroundColor: 'var(--bg-card-solid)',
    };

    return (
        <section id="mission" className="py-8">
            {/* Hero / Philosophy */}
            <div className="mb-10 text-center">
                <span className="mb-2 inline-block text-xs font-bold uppercase tracking-wider text-[#4cc9f0]">
                    Get In Touch
                </span>
                <h2 className="mb-4 bg-linear-to-r from-[#4361ee] via-[#4cc9f0] to-[#7209b7] bg-clip-text text-3xl font-extrabold text-transparent sm:text-4xl md:text-5xl">
                    {missionData.title}
                </h2>
                <blockquote className="mx-auto max-w-2xl text-base sm:text-lg leading-relaxed italic" style={{ color: 'var(--text-muted)' }}>
                    <span className="font-bold not-italic text-[#4cc9f0]">&ldquo;</span>
                    {missionData.statement}
                    <span className="font-bold not-italic text-[#4cc9f0]">&rdquo;</span>
                </blockquote>
                <p className="mt-3 text-xs sm:text-sm font-medium text-emerald-400">
                    {missionData.locationText}
                </p>
            </div>

            {/* Quick Ways to Connect */}
            <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                    {
                        title: 'Chat on WhatsApp',
                        desc: 'Quickest response for project chats',
                        action: 'Open WhatsApp',
                        href: missionData.contact.whatsappUrl,
                        isPrimary: true,
                        color: 'text-emerald-400',
                        bg: 'bg-emerald-500/10 border-emerald-500/30'
                    },
                    {
                        title: 'Email Kelvin',
                        desc: missionData.contact.email,
                        action: 'Send Email',
                        href: `mailto:${missionData.contact.email}`,
                        color: 'text-[#4cc9f0]',
                        bg: 'bg-[#4361ee]/10 border-[#4361ee]/30'
                    },
                    {
                        title: 'Direct Call',
                        desc: missionData.contact.phone,
                        action: 'Call Now',
                        href: `tel:${missionData.contact.phoneRaw}`,
                        color: 'text-teal-400',
                        bg: 'bg-teal-500/10 border-teal-500/30'
                    },
                    {
                        title: 'LinkedIn',
                        desc: 'Professional network & experience',
                        action: 'View Profile',
                        href: missionData.contact.linkedin,
                        color: 'text-sky-400',
                        bg: 'bg-sky-500/10 border-sky-500/30'
                    }
                ].map(item => (
                    <a
                        key={item.title}
                        href={item.href}
                        target={item.href.startsWith('http') ? '_blank' : undefined}
                        rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className={`group flex flex-col justify-between rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${item.bg}`}
                    >
                        <div>
                            <div className="mb-2">
                                <span className={`text-[0.7rem] font-bold uppercase tracking-wider ${item.color}`}>
                                    {item.title}
                                </span>
                            </div>
                            <h4 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                                {item.title}
                            </h4>
                            <p className="mt-1 text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                                {item.desc}
                            </p>
                        </div>
                        <span className="mt-4 text-xs font-semibold text-[#4cc9f0] group-hover:underline">
                            {item.action} &rarr;
                        </span>
                    </a>
                ))}
            </div>

            {/* Two Column: Collaboration Types & Interactive Message Form */}
            <div className="grid gap-8 lg:grid-cols-5">

                {/* Left (2 cols): Collaboration Opportunities */}
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                        Ways We Can Work Together
                    </h3>
                    <div className="space-y-3">
                        {missionData.collaborationTypes.map(c => (
                            <div
                                key={c.title}
                                className="rounded-xl p-4 transition-all duration-200"
                                style={cardStyle}
                            >
                                <div className="mb-1 flex items-center gap-2">
                                    <h4 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                                        {c.title}
                                    </h4>
                                </div>
                                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                                    {c.desc}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div
                        className="rounded-xl border border-emerald-500/30 p-4 text-xs"
                        style={{ backgroundColor: 'var(--bg-availability)', color: 'var(--text-muted)' }}
                    >
                        <span className="font-bold text-emerald-400">Response Time: </span>
                        I normally respond to messages within a few hours. I look forward to hearing what you&apos;re working on!
                    </div>
                </div>

                {/* Right (3 cols): Interactive Contact Form */}
                <div
                    className="lg:col-span-3 rounded-2xl p-6 sm:p-8 backdrop-blur-md transition-colors duration-300"
                    style={cardStyle}
                >
                    <h3 className="mb-1 text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                        Send Kelvin a Direct Message
                    </h3>
                    <p className="mb-6 text-xs sm:text-sm" style={{ color: 'var(--text-muted)' }}>
                        Leave your thoughts, project overview, or a friendly hello. It lands straight in my inbox.
                    </p>

                    {status.msg && (
                        <div
                            className={`mb-5 rounded-xl border p-3.5 text-xs sm:text-sm ${
                                status.state === 'success'
                                    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                                    : 'border-rose-500/40 bg-rose-500/10 text-rose-300'
                            }`}
                        >
                            {status.msg}
                        </div>
                    )}

                    <form onSubmit={handleSubmitMessage} className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-1.5 block text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
                                    Your Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Sarah Mwangi"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full rounded-xl border px-3.5 py-2.5 text-xs sm:text-sm outline-none transition-all focus:border-[#4cc9f0] focus:shadow-md"
                                    style={{
                                        borderColor: 'var(--border)',
                                        backgroundColor: 'var(--bg-overlay-light)',
                                        color: 'var(--text-primary)',
                                    }}
                                />
                            </div>

                            <div>
                                <label className="mb-1.5 block text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
                                    Your Email Address *
                                </label>
                                <input
                                    type="email"
                                    required
                                    placeholder="e.g. sarah@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full rounded-xl border px-3.5 py-2.5 text-xs sm:text-sm outline-none transition-all focus:border-[#4cc9f0] focus:shadow-md"
                                    style={{
                                        borderColor: 'var(--border)',
                                        backgroundColor: 'var(--bg-overlay-light)',
                                        color: 'var(--text-primary)',
                                    }}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-1.5 block text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
                                Topic or Purpose
                            </label>
                            <select
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                className="w-full rounded-xl border px-3.5 py-2.5 text-xs sm:text-sm outline-none transition-all focus:border-[#4cc9f0]"
                                style={{
                                    borderColor: 'var(--border)',
                                    backgroundColor: 'var(--bg-overlay-light)',
                                    color: 'var(--text-primary)',
                                }}
                            >
                                <option value="New Project Collaboration" style={{ background: '#12131a', color: '#fff' }}>New Project Collaboration / Freelance</option>
                                <option value="Full-Time Engineering Role" style={{ background: '#12131a', color: '#fff' }}>Full-Time Engineering Role</option>
                                <option value="AI & Automation Consultation" style={{ background: '#12131a', color: '#fff' }}>AI &amp; Automation Consultation</option>
                                <option value="Network & Security Support" style={{ background: '#12131a', color: '#fff' }}>Network &amp; Security Support</option>
                                <option value="Just Saying Hi & Networking" style={{ background: '#12131a', color: '#fff' }}>Just Saying Hi &amp; Networking</option>
                            </select>
                        </div>

                        <div>
                            <label className="mb-1.5 block text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
                                Your Message *
                            </label>
                            <textarea
                                required
                                rows={4}
                                placeholder="Tell me a bit about what you have in mind..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="w-full rounded-xl border p-3.5 text-xs sm:text-sm outline-none transition-all focus:border-[#4cc9f0] focus:shadow-md"
                                style={{
                                    borderColor: 'var(--border)',
                                    backgroundColor: 'var(--bg-overlay-light)',
                                    color: 'var(--text-primary)',
                                }}
                            ></textarea>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                            <span className="text-[0.75rem]" style={{ color: 'var(--text-faint)' }}>
                                No spam. Directly saved to database.
                            </span>

                            <button
                                type="submit"
                                disabled={status.state === 'loading'}
                                className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-linear-to-r from-[#4361ee] to-[#4cc9f0] px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-[#4361ee]/30 transition-all hover:opacity-90 disabled:opacity-50"
                            >
                                {status.state === 'loading' ? (
                                    <span>Sending...</span>
                                ) : (
                                    <span>Send Message</span>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Social Links row */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
                {[
                    { href: missionData.contact.whatsappUrl, label: 'WhatsApp' },
                    { href: missionData.contact.github, label: 'GitHub' },
                    { href: missionData.contact.linkedin, label: 'LinkedIn' },
                    { href: `mailto:${missionData.contact.email}`, label: 'Email' },
                    { href: `tel:${missionData.contact.phoneRaw}`, label: 'Phone' }
                ].map(({ href, label }) => (
                    <a
                        key={label}
                        href={href}
                        target={href.startsWith('http') ? '_blank' : undefined}
                        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        aria-label={label}
                        title={label}
                        className="flex h-9 items-center justify-center rounded-lg border px-3 text-xs font-medium transition-all duration-200 hover:-translate-y-0.5 hover:border-[#4cc9f0] hover:bg-[#4cc9f0]/10 hover:text-[#4cc9f0] hover:shadow-lg hover:shadow-[#4cc9f0]/20"
                        style={{
                            border: '1px solid var(--border)',
                            backgroundColor: 'var(--bg-overlay-light)',
                            color: 'var(--text-muted)',
                        }}
                    >
                        {label}
                    </a>
                ))}
            </div>

            {/* Copyright */}
            <p className="mt-6 text-center text-xs" style={{ color: 'var(--text-faint)' }}>
                &copy; {currentYear} Kelvin Kimani. Built with care, craft, and clean code in Nairobi, Kenya.
            </p>
        </section>
    );
}
