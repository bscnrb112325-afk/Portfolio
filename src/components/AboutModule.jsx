import React, { useState, useEffect } from 'react';
import { aboutData } from '../data/portfolioData';

export default function AboutModule() {
    const [profile, setProfile] = useState({
        name: aboutData.name,
        title: 'A Software Developer'
    });
    const [avatarSrc, setAvatarSrc] = useState(() => {
        try {
            return localStorage.getItem('profilePhoto') || './profile.png';
        } catch (err) {
            return './profile.png';
        }
    });
    const [imgError, setImgError] = useState(false);

    useEffect(() => {
        fetch('/api/profile')
            .then(res => {
                if (res.ok) return res.json();
                throw new Error('API offline');
            })
            .then(data => {
                setProfile(prev => ({
                    ...prev,
                    name: data.name || prev.name,
                    title: data.title || prev.title
                }));
            })
            .catch(() => {
                // Default fallback — static data remains
            });
    }, []);

    const dynamicRoles = [
        "A Software Developer",
        "System Security",
        "AI Solutions",
        "Network Engineer"
    ];

    const [currentRoleText, setCurrentRoleText] = useState('');
    const [roleIndex, setRoleIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const fullText = dynamicRoles[roleIndex % dynamicRoles.length];
        const speed = isDeleting ? 40 : 85;

        const timer = setTimeout(() => {
            if (!isDeleting) {
                setCurrentRoleText(fullText.substring(0, currentRoleText.length + 1));
                if (currentRoleText.length + 1 === fullText.length) {
                    setTimeout(() => setIsDeleting(true), 2000);
                }
            } else {
                setCurrentRoleText(fullText.substring(0, currentRoleText.length - 1));
                if (currentRoleText.length - 1 === 0) {
                    setIsDeleting(false);
                    setRoleIndex(prev => prev + 1);
                }
            }
        }, speed);

        return () => clearTimeout(timer);
    }, [currentRoleText, isDeleting, roleIndex]);

    return (
        <header className="hero module-content-container" id="about">
            <div className="container hero-content">
                <div className="hero-text fade-in-up">
                    <span className="greeting">Hi, I'm</span>
                    <h1 id="hero-name">Kelvin</h1>

                    {/* Dynamic Rotating Typewriter Headline */}
                    <div className="dynamic-role-container">
                        <span className="dynamic-role-prefix"><i className="fa-solid fa-bolt"></i> Focus:</span>
                        <span className="dynamic-typewriter-text">{currentRoleText}</span>
                        <span className="dynamic-cursor">|</span>
                    </div>

                    <h2 className="roles" style={{ marginBottom: '1.5rem' }}>
                        {aboutData.roles.map((role, idx) => (
                            <React.Fragment key={`${role}-${idx}`}>
                                <span className="role">{role}</span>
                                {idx < aboutData.roles.length - 1 && <span className="dot">||</span>}
                            </React.Fragment>
                        ))}
                    </h2>

                    <div style={{ display: 'grid', gap: '1.1rem' }}>
                        <p className="intro" style={{ marginTop: '0.5rem', marginBottom: 0 }}>
                            I am a Computer Science graduate passionate about using technology to solve real-world problems and build reliable, secure, and efficient digital solutions.
                        </p>
                        <p className="background" style={{ margin: 0 }}>
                            My technical background covers <strong>software development, artificial intelligence, cybersecurity, computer networking, system administration, cloud technologies, and technical support</strong>. I enjoy designing and implementing solutions that improve business operations, automate tasks, protect information, and make technology easier and more accessible.
                        </p>
                        <p className="background" style={{ margin: 0 }}>
                            I combine technical knowledge with practical problem-solving to develop solutions that are <strong>secure, scalable, user-friendly, and focused on real business needs</strong>.
                        </p>
                        <p className="background" style={{ margin: 0 }}>
                            I am continuously developing my skills and exploring emerging technologies in software engineering, artificial intelligence, cybersecurity, cloud computing, and network infrastructure.
                        </p>
                    </div>

                    <div style={{ marginTop: '1.8rem', marginBottom: '1rem', padding: '1.2rem 1.1rem', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', background: 'rgba(255,255,255,0.03)' }}>
                        <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.8rem', fontSize: '1.2rem' }}>What I Bring</h3>
                        <ul style={{ color: 'var(--text-secondary)', lineHeight: '1.8', paddingLeft: '1.2rem', margin: 0 }}>
                            <li>Software development and application design</li>
                            <li>AI integration and automation</li>
                            <li>Network configuration and troubleshooting</li>
                            <li>System administration and infrastructure support</li>
                            <li>Cybersecurity and security best practices</li>
                            <li>Cloud services and data protection</li>
                            <li>Technical problem-solving and IT support</li>
                        </ul>
                    </div>

                    <div style={{ marginTop: '1.5rem', padding: '0.9rem 1rem', borderRadius: '999px', background: 'linear-gradient(135deg, rgba(17, 94, 89, 0.25), rgba(59,130,246,0.18))', border: '1px solid rgba(94, 234, 212, 0.35)', display: 'inline-block' }}>
                        <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>Currently Available:</span>{' '}
                        <span style={{ color: 'var(--text-secondary)' }}>
                            I am open to opportunities, collaborations, internships, freelance projects, and professional roles in software development, AI, cybersecurity, networking, cloud infrastructure, and IT operations.
                        </span>
                    </div>
                </div>

                <div className="hero-visual fade-in-up delay-1">
                    <div className="glass-card profile-card">
                        <div className="avatar-placeholder" id="avatar-container">
                            {!imgError ? (
                                <img
                                    src={avatarSrc}
                                    alt={profile.name}
                                    className="profile-image"
                                    onError={() => setImgError(true)}
                                />
                            ) : (
                                <i className="fa-solid fa-user-astronaut" id="avatar-icon" style={{ display: 'flex' }}></i>
                            )}
                        </div>
                        <div className="status-badge">
                            <span className="pulse"></span> {aboutData.status}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
