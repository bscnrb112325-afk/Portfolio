import React from 'react';
import { whatIDoData } from '../data/portfolioData';

export default function SkillsModule() {
    return (
        <section id="skills" className="py-8">
            <div className="mb-8">
                <span className="mb-1 inline-block text-xs font-bold uppercase tracking-wider text-[#4cc9f0]">
                    Capabilities &amp; Craft
                </span>
                <h2 className="mb-2 block bg-linear-to-r from-[#4361ee] to-[#4cc9f0] bg-clip-text text-3xl font-extrabold text-transparent sm:text-4xl">
                    {whatIDoData.title}
                </h2>
                <p className="max-w-2xl text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    {whatIDoData.subtitle}
                </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {whatIDoData.services.map((service, index) => {
                    const isSpecial = service.isSpecial;
                    const delay = index % 3 === 1 ? 'delay-[100ms]' : index % 3 === 2 ? 'delay-[200ms]' : '';

                    return (
                        <div
                            key={service.title}
                            className={`card card-bordered group relative flex flex-col justify-between p-6 backdrop-blur-md transition-all duration-300 animate-[fadeInUp_0.6s_cubic-bezier(0.16,1,0.3,1)_forwards] opacity-0 ${delay} hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)] bg-base-200/40`}
                            style={{
                                borderColor: isSpecial ? 'var(--border-special)' : 'var(--border)',
                            }}
                        >
                            {service.highlight && (
                                <span className="badge badge-primary badge-outline absolute right-5 top-5 text-[0.7rem] font-semibold">
                                    {service.highlight}
                                </span>
                            )}

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
                className="card card-bordered mt-10 flex flex-col items-center justify-between gap-4 p-6 text-center sm:flex-row sm:text-left bg-base-200/50"
                style={{
                    borderColor: 'var(--border)',
                }}
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
        </section>
    );
}
