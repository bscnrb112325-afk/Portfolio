import React from 'react';
import { whatIDoData } from '../data/portfolioData';

export default function SkillsModule() {
    const cardStyle = {
        border: '1px solid var(--border)',
        backgroundColor: 'var(--bg-card-solid)',
    };

    return (
        <section
            id="skills"
            className="py-8"
            style={{
                backgroundImage: 'url("./skills-bg.jpg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'local',
                position: 'relative',
                borderRadius: '1rem',
                overflow: 'hidden',
            }}
        >
            {/* dark overlay */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(135deg, rgba(5,5,20,0.82) 0%, rgba(10,10,35,0.72) 100%)',
                    backdropFilter: 'blur(1px)',
                    zIndex: 0,
                }}
            />

            <div style={{ position: 'relative', zIndex: 1 }} className="p-4 sm:p-8">
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {whatIDoData.services.map((service, index) => {
                        const delay = index % 3 === 1 ? 'delay-[100ms]' : index % 3 === 2 ? 'delay-[200ms]' : '';

                        return (
                            <div
                                key={service.title}
                                className={`nm-card group relative flex flex-col justify-between p-6 animate-[fadeInUp_0.6s_cubic-bezier(0.16,1,0.3,1)_forwards] opacity-0 ${delay}`}
                            >
                                <div>
                                    <h3 className="mb-2 text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                                        {service.title}
                                    </h3>

                                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                                        {service.description}
                                    </p>
                                </div>

                                <div className="mt-5 border-t pt-3" style={{ borderColor: 'var(--border)' }}>
                                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4cc9f0] transition-transform duration-200 group-hover:translate-x-1">
                                        <span>Learn more in Projects &rarr;</span>
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Bottom collaboration callout */}
                <div
                    className="nm-card mt-10 flex flex-col items-center justify-between gap-4 p-6 text-center sm:flex-row sm:text-left"
                >
                    <div>
                        <h4 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                            Have a specific project or infrastructure requirement?
                        </h4>
                        <p className="text-xs sm:text-sm" style={{ color: 'var(--text-muted)' }}>
                            I&apos;m always excited to explore technical challenges and figure out the most pragmatic way forward.
                        </p>
                    </div>
                    <a
                        href="mailto:kelvinkimani513@gmail.com?subject=Project%20Inquiry%20from%20Portfolio"
                        className="btn btn-primary rounded-full px-6 text-xs font-semibold text-white shadow-md shadow-[#4361ee]/25"
                    >
                        Let&apos;s Discuss Your Idea &rarr;
                    </a>
                </div>
            </div>
        </section>
    );
}

