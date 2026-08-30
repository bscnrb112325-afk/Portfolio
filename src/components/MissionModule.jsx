import React from 'react';
import { missionData } from '../data/portfolioData';

export default function MissionModule() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer module-content-container" id="mission" style={{ padding: '4rem 0' }}>
            <div className="container footer-content fade-in-up">
                <h2>{missionData.title}</h2>
                <p className="mission-statement" style={{ marginBottom: '2.5rem' }}>
                    "{missionData.statement}"
                </p>

                <div className="contact-info" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', color: 'var(--text-secondary)' }}>
                    <a href={`mailto:${missionData.contact.email}`} className="project-link" style={{ fontSize: '1.1rem' }}>
                        <i className="fa-solid fa-envelope"></i> {missionData.contact.email}
                    </a>
                    <a href={`tel:${missionData.contact.phone}`} className="project-link" style={{ fontSize: '1.1rem' }}>
                        <i className="fa-solid fa-phone"></i> {missionData.contact.phone}
                    </a>
                </div>

                <div className="social-links">
                    <a href={missionData.contact.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                        <i className="fa-brands fa-linkedin-in"></i>
                    </a>
                    <a href={`mailto:${missionData.contact.email}`} aria-label="Email">
                        <i className="fa-solid fa-envelope"></i>
                    </a>
                    <a href={`tel:${missionData.contact.phone}`} aria-label="Phone">
                        <i className="fa-solid fa-phone"></i>
                    </a>
                    <a href={missionData.contact.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                        <i className="fa-brands fa-github"></i>
                    </a>
                </div>

                <div className="copyright">
                    &copy; <span id="year">{currentYear}</span> kelvin. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
