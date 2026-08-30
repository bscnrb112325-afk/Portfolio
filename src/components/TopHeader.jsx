import React, { useState, useEffect } from 'react';

export default function TopHeader({ activeModule, onSelectModule }) {
    const [currentTime, setCurrentTime] = useState('');

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
        { id: 'about', label: 'About', icon: 'fa-user' },
        { id: 'skills', label: 'What I Do', icon: 'fa-layer-group' },
        { id: 'projects', label: 'Projects', icon: 'fa-code' },
        { id: 'mission', label: 'Mission', icon: 'fa-bullseye' },
        { id: 'aicv', label: 'AI CV', icon: 'fa-wand-magic-sparkles' },
        { id: 'post', label: 'Post', icon: 'fa-pen-to-square' }
    ];

    return (
        <header className="top-header">
            <div className="container">
                <div className="top-left-profile glass-card">
                    {/* Header Top Meta / Live Status */}
                    <div className="top-header-meta">
                        <div className="live-status-indicator">
                            <span className="live-dot"></span>
                            <span>Live • {currentTime || 'Ready'}</span>
                        </div>
                    </div>

                    {/* Tagline */}
                    <p className="explore-tagline">
                        Explore my portfolio to discover my projects, technical skills, and professional journey.
                    </p>

                    {/* Contact Chips */}
                    <div className="top-contact-list">
                        <a href="mailto:kelvinkimani513@gmail.com" className="contact-chip">
                            <i className="fa-solid fa-envelope"></i>
                            <span>kelvinkimani513@gmail.com</span>
                        </a>
                        <a href="tel:0701861965" className="contact-chip">
                            <i className="fa-solid fa-phone"></i>
                            <span>0701861965</span>
                        </a>
                        <a href="https://github.com/bscnrb112325-afk" target="_blank" rel="noopener noreferrer" className="contact-chip">
                            <i className="fa-brands fa-github"></i>
                            <span>bscnrb112325-afk</span>
                        </a>
                        <a href="https://www.linkedin.com/in/kelvin-kimani-a94552214/?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3B85kuA6LDSaukl8MUkM%2FZvA%3D%3D" target="_blank" rel="noopener noreferrer" className="contact-chip">
                            <i className="fa-brands fa-linkedin-in"></i>
                            <span>LinkedIn</span>
                        </a>
                    </div>

                    {/* Clean Typography Modules Bar */}
                    <div className="top-modules-wrapper">
                        <div className="top-modules-bar">
                            {modules.map(mod => (
                                <button
                                    key={mod.id}
                                    className={`top-module-btn ${activeModule === mod.id ? 'active' : ''}`}
                                    onClick={() => onSelectModule(mod.id)}
                                >
                                    <i className={`fa-solid ${mod.icon}`}></i>
                                    <span>{mod.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
