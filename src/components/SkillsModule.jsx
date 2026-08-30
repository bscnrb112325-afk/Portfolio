import React from 'react';
import { whatIDoData } from '../data/portfolioData';

export default function SkillsModule() {
    return (
        <section className="skills-section module-content-container" id="skills">
            <div className="container">
                <h2 className="section-title fade-in-up">{whatIDoData.title}</h2>
                <p className="fade-in-up" style={{ color: 'var(--text-secondary)', marginTop: '-2rem', marginBottom: '3rem', fontSize: '1.1rem', maxWidth: '800px' }}>
                    {whatIDoData.subtitle}
                </p>
                <div className="skills-grid" id="skills-grid">
                    {whatIDoData.services.map((service, index) => {
                        const delayClass = index % 3 === 1 ? 'delay-1' : index % 3 === 2 ? 'delay-2' : '';
                        const specialClass = service.isSpecial ? 'ai-service' : '';

                        return (
                            <div key={service.title} className={`skill-card glass-card ${specialClass} fade-in-up ${delayClass}`}>
                                <div className="skill-icon">
                                    <i className={`fa-solid ${service.icon}`}></i>
                                </div>
                                <h3>{service.title}</h3>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '-0.5rem' }}>
                                    {service.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
