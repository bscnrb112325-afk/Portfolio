import React from 'react';
import { whatIDoData } from '../data/portfolioData';

export default function SkillsModule() {
    return (
        <section id="skills" className="py-10">
            <h2 className="mb-2 inline-block bg-linear-to-r from-[#4361ee] to-[#4cc9f0] bg-clip-text text-4xl font-bold text-transparent">
                {whatIDoData.title}
            </h2>
            <p className="mb-10 max-w-2xl text-[1.05rem]" style={{ color: 'var(--text-muted)' }}>
                {whatIDoData.subtitle}
            </p>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {whatIDoData.services.map((service, index) => {
                    const isSpecial = service.isSpecial;
                    const delay = index % 3 === 1 ? 'delay-[150ms]' : index % 3 === 2 ? 'delay-[300ms]' : '';

                    return (
                        <div
                            key={service.title}
                            className={`group flex flex-col items-center gap-4 rounded-2xl p-7 text-center backdrop-blur-md transition-all duration-300 animate-[fadeInUp_0.6s_cubic-bezier(0.16,1,0.3,1)_forwards] opacity-0 ${delay} hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)]`}
                            style={{
                                border: `1px solid ${isSpecial ? 'var(--border-special)' : 'var(--border)'}`,
                                backgroundColor: isSpecial ? 'var(--bg-card-featured-alt)' : 'var(--bg-card)',
                            }}
                        >
                            {/* Icon */}
                            <div
                                className="flex size-15 items-center justify-center rounded-[15px] text-3xl transition-all duration-200 group-hover:scale-110 group-hover:rotate-[5deg] group-hover:bg-[#4361ee] group-hover:text-white"
                                style={{
                                    backgroundColor: isSpecial ? 'rgba(76,201,240,0.12)' : 'rgba(67,97,238,0.10)',
                                    color: isSpecial ? '#80ffdb' : '#4cc9f0',
                                }}
                            >
                                <i className={`fa-solid ${service.icon}`}></i>
                            </div>

                            <h3 className="text-[1.05rem] font-semibold" style={{ color: 'var(--text-primary)' }}>{service.title}</h3>
                            <p className="text-[0.88rem] leading-relaxed" style={{ color: 'var(--text-muted)' }}>{service.description}</p>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
