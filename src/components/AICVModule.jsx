import React, { useState, useEffect } from 'react';
import { defaultCvState } from '../data/cvDefaultState';
import { apiFetch } from '../utils/api';

const CV_STORAGE_KEY = 'portfolio_ai_cv_data_v3';

export default function AICVModule() {
    const [cvState, setCvState] = useState(() => {
        try {
            const saved = localStorage.getItem(CV_STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed?.personal?.name === 'KELVIN KIMANI MUGURE') {
                    return parsed;
                }
            }
            return defaultCvState;
        } catch (e) {
            return defaultCvState;
        }
    });

    const [activeTab, setActiveTab] = useState('personal');
    const [selectedTemplate, setSelectedTemplate] = useState('modern'); // 'modern', 'executive', 'creative'
    const [aiLoading, setAiLoading] = useState(false);
    const [aiAdvice, setAiAdvice] = useState('');
    const [atsScore, setAtsScore] = useState(88);

    // Save CV state on update
    useEffect(() => {
        try {
            localStorage.setItem(CV_STORAGE_KEY, JSON.stringify(cvState));
        } catch (e) {}
        calculateAtsScore();
    }, [cvState]);

    const calculateAtsScore = () => {
        let score = 50;
        if (cvState.personal.name && cvState.personal.email && cvState.personal.phone) score += 10;
        if (cvState.summary && cvState.summary.length > 80) score += 15;
        if (cvState.skills.technical && cvState.skills.technical.length > 20) score += 10;
        if (cvState.experience.length >= 2) score += 10;
        if (cvState.education.length >= 1) score += 5;
        setAtsScore(Math.min(100, score));
    };

    // AI Generate Summary
    const handleGenerateAiSummary = async () => {
        setAiLoading(true);
        const prompt = `Write a professional, impactful 3-sentence resume summary for ${cvState.personal.name}, a ${cvState.personal.title}. Key skills: ${cvState.skills.technical}. Focus on reliability, engineering impact, and problem-solving.`;

        try {
            const res = await apiFetch('/api/ai/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt })
            });
            if (res.ok) {
                const data = await res.json();
                if (data.text) {
                    setCvState(prev => ({ ...prev, summary: data.text.trim() }));
                }
            } else {
                throw new Error('AI API offline');
            }
        } catch (e) {
            // Intelligent fallback
            setCvState(prev => ({
                ...prev,
                summary: `${cvState.personal.name} is a results-driven ${cvState.personal.title} with proven expertise in ${cvState.skills.technical || 'modern full-stack engineering'}. Demonstrated ability to architect secure, scalable applications and maintain high-uptime enterprise infrastructures.`
            }));
        } finally {
            setAiLoading(false);
        }
    };

    // AI Resume Review
    const handleAiReview = async () => {
        setAiLoading(true);
        const prompt = `Review this resume profile and give 3 short bullet tips to improve ATS matching for software engineering roles: Name: ${cvState.personal.name}, Summary: ${cvState.summary}, Skills: ${cvState.skills.technical}`;

        try {
            const res = await apiFetch('/api/ai/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt })
            });
            if (res.ok) {
                const data = await res.json();
                if (data.text) setAiAdvice(data.text.trim());
            } else {
                throw new Error('AI offline');
            }
        } catch (e) {
            setAiAdvice("✦ Include quantitative metrics (e.g. 'Improved uptime to 99.9%').\n✦ Highlight PostgreSQL & REST API experience prominently.\n✦ Ensure GitHub project URLs like OICS are clickable in header.");
        } finally {
            setAiLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const handleReset = () => {
        if (window.confirm('Reset CV data to Kelvin Kimani defaults?')) {
            setCvState(defaultCvState);
        }
    };

    return (
        <section className="aicv-section module-content-container" id="aicv-module">
            <div className="container">
                {/* Header */}
                <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h2 className="section-title" style={{ marginBottom: '0.3rem' }}>
                            Interactive AI CV & Resume Studio
                        </h2>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            Customize, optimize with Gemini AI, preview live, and export as a PDF.
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '0.7rem', flexWrap: 'wrap' }}>
                        <button className="btn btn-primary btn-sm rounded-lg" onClick={handleGenerateAiSummary} disabled={aiLoading}>
                            {aiLoading ? (
                                <>
                                    <span className="loading loading-spinner loading-xs"></span>
                                    <span>Drafting...</span>
                                </>
                            ) : 'AI Summary'}
                        </button>
                        <button className="btn btn-accent btn-sm rounded-lg" onClick={handleAiReview} disabled={aiLoading}>
                            AI ATS Review
                        </button>
                        <button className="btn btn-outline btn-sm rounded-lg" onClick={handlePrint}>
                            Export PDF
                        </button>
                    </div>
                </div>

                {/* ATS Score & Template Selector Bar */}
                <div className="card card-bordered bg-base-200/50 p-4 mb-8 flex-row items-center justify-between flex-wrap gap-4">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>ATS Readiness:</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <progress
                                className={`progress ${atsScore > 80 ? 'progress-success' : 'progress-warning'} w-28 sm:w-36`}
                                value={atsScore}
                                max="100"
                            ></progress>
                            <span style={{ fontWeight: 'bold', color: atsScore > 80 ? '#06d6a0' : '#ffd166', fontSize: '0.9rem' }}>{atsScore}%</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Template:</span>
                        <div className="join">
                            <button
                                className={`btn btn-xs join-item ${selectedTemplate === 'modern' ? 'btn-primary' : 'btn-ghost border border-base-content/10'}`}
                                onClick={() => setSelectedTemplate('modern')}
                            >
                                Modern Tech
                            </button>
                            <button
                                className={`btn btn-xs join-item ${selectedTemplate === 'executive' ? 'btn-primary' : 'btn-ghost border border-base-content/10'}`}
                                onClick={() => setSelectedTemplate('executive')}
                            >
                                Executive
                            </button>
                            <button
                                className={`btn btn-xs join-item ${selectedTemplate === 'creative' ? 'btn-primary' : 'btn-ghost border border-base-content/10'}`}
                                onClick={() => setSelectedTemplate('creative')}
                            >
                                Creative Dark
                            </button>
                        </div>
                    </div>
                </div>

                {/* AI Advice Notification (if present) */}
                {aiAdvice && (
                    <div className="alert alert-info mb-8 relative">
                        <div>
                            <h4 className="font-bold text-sm mb-1">
                                AI ATS Optimization Recommendations:
                            </h4>
                            <p className="text-xs leading-relaxed whitespace-pre-line">
                                {aiAdvice}
                            </p>
                        </div>
                        <button onClick={() => setAiAdvice('')} className="btn btn-ghost btn-circle btn-xs absolute top-2 right-2">✕</button>
                    </div>
                )}

                {/* Studio Grid: Left Editor & Right Live Preview */}
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 420px) 1fr', gap: '2rem', alignItems: 'start' }}>
                    
                    {/* Left: Interactive Form */}
                    <div className="card card-bordered p-6 bg-base-200/50 backdrop-blur-md">
                        <div className="tabs tabs-boxed mb-5 bg-base-300/60 p-1">
                            {['personal', 'skills', 'experience', 'education', 'certifications'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`tab tab-sm capitalize font-medium ${activeTab === tab ? 'tab-active font-bold' : ''}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {activeTab === 'personal' && (
                            <div className="post-form space-y-3">
                                <div className="cv-field">
                                    <label className="text-xs font-semibold block mb-1">Full Name</label>
                                    <input className="input input-bordered input-sm w-full" type="text" value={cvState.personal.name} onChange={e => setCvState({ ...cvState, personal: { ...cvState.personal, name: e.target.value } })} />
                                </div>
                                <div className="cv-field">
                                    <label className="text-xs font-semibold block mb-1">Professional Title</label>
                                    <textarea className="textarea textarea-bordered textarea-sm w-full" rows="2" value={cvState.personal.title} onChange={e => setCvState({ ...cvState, personal: { ...cvState.personal, title: e.target.value } })}></textarea>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    <div className="cv-field">
                                        <label className="text-xs font-semibold block mb-1">Email</label>
                                        <input className="input input-bordered input-sm w-full" type="email" value={cvState.personal.email} onChange={e => setCvState({ ...cvState, personal: { ...cvState.personal, email: e.target.value } })} />
                                    </div>
                                    <div className="cv-field">
                                        <label className="text-xs font-semibold block mb-1">Phone</label>
                                        <input className="input input-bordered input-sm w-full" type="text" value={cvState.personal.phone} onChange={e => setCvState({ ...cvState, personal: { ...cvState.personal, phone: e.target.value } })} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    <div className="cv-field">
                                        <label className="text-xs font-semibold block mb-1">Location</label>
                                        <input className="input input-bordered input-sm w-full" type="text" value={cvState.personal.location} onChange={e => setCvState({ ...cvState, personal: { ...cvState.personal, location: e.target.value } })} />
                                    </div>
                                    <div className="cv-field">
                                        <label className="text-xs font-semibold block mb-1">GitHub</label>
                                        <input className="input input-bordered input-sm w-full" type="text" value={cvState.personal.github} onChange={e => setCvState({ ...cvState, personal: { ...cvState.personal, github: e.target.value } })} />
                                    </div>
                                </div>
                                <div className="cv-field">
                                    <label className="text-xs font-semibold block mb-1">Portfolio URL</label>
                                    <input className="input input-bordered input-sm w-full" type="text" value={cvState.personal.portfolio} onChange={e => setCvState({ ...cvState, personal: { ...cvState.personal, portfolio: e.target.value } })} />
                                </div>
                                <div className="cv-field">
                                    <label className="text-xs font-semibold block mb-1">Professional Summary</label>
                                    <textarea className="textarea textarea-bordered textarea-sm w-full" rows="5" value={cvState.summary} onChange={e => setCvState({ ...cvState, summary: e.target.value })}></textarea>
                                </div>
                            </div>
                        )}

                        {activeTab === 'skills' && (
                            <div className="post-form space-y-3">
                                <div className="cv-field">
                                    <label className="text-xs font-semibold block mb-1">Programming</label>
                                    <textarea className="textarea textarea-bordered textarea-sm w-full" rows="2" value={cvState.skills.programming || ''} onChange={e => setCvState({ ...cvState, skills: { ...cvState.skills, programming: e.target.value, technical: e.target.value } })}></textarea>
                                </div>
                                <div className="cv-field">
                                    <label className="text-xs font-semibold block mb-1">Software Development</label>
                                    <textarea className="textarea textarea-bordered textarea-sm w-full" rows="2" value={cvState.skills.softwareDev || ''} onChange={e => setCvState({ ...cvState, skills: { ...cvState.skills, softwareDev: e.target.value } })}></textarea>
                                </div>
                                <div className="cv-field">
                                    <label className="text-xs font-semibold block mb-1">IT & Systems</label>
                                    <textarea className="textarea textarea-bordered textarea-sm w-full" rows="2" value={cvState.skills.itSystems || ''} onChange={e => setCvState({ ...cvState, skills: { ...cvState.skills, itSystems: e.target.value } })}></textarea>
                                </div>
                                <div className="cv-field">
                                    <label className="text-xs font-semibold block mb-1">Networking & Security</label>
                                    <textarea className="textarea textarea-bordered textarea-sm w-full" rows="2" value={cvState.skills.networkingSecurity || cvState.skills.security || ''} onChange={e => setCvState({ ...cvState, skills: { ...cvState.skills, networkingSecurity: e.target.value, security: e.target.value } })}></textarea>
                                </div>
                                <div className="cv-field">
                                    <label className="text-xs font-semibold block mb-1">Data & Cloud</label>
                                    <textarea className="textarea textarea-bordered textarea-sm w-full" rows="2" value={cvState.skills.dataCloud || ''} onChange={e => setCvState({ ...cvState, skills: { ...cvState.skills, dataCloud: e.target.value } })}></textarea>
                                </div>
                                <div className="cv-field">
                                    <label className="text-xs font-semibold block mb-1">Key Strengths</label>
                                    <textarea className="textarea textarea-bordered textarea-sm w-full" rows="2" value={cvState.skills.soft || ''} onChange={e => setCvState({ ...cvState, skills: { ...cvState.skills, soft: e.target.value } })}></textarea>
                                </div>
                            </div>
                        )}

                        {activeTab === 'experience' && (
                            <div className="post-form space-y-4">
                                {cvState.experience.map((exp, i) => (
                                    <div key={exp.id || i} className="p-3 rounded-xl border border-base-content/10 bg-base-300/30">
                                        <div className="cv-field mb-2">
                                            <label className="text-xs font-semibold block mb-1">Role / Position</label>
                                            <input className="input input-bordered input-sm w-full" type="text" value={exp.title} onChange={e => {
                                                const updated = [...cvState.experience];
                                                updated[i].title = e.target.value;
                                                setCvState({ ...cvState, experience: updated });
                                            }} />
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                                            <div className="cv-field">
                                                <label className="text-xs font-semibold block mb-1">Company / Project</label>
                                                <input className="input input-bordered input-sm w-full" type="text" value={exp.company} onChange={e => {
                                                    const updated = [...cvState.experience];
                                                    updated[i].company = e.target.value;
                                                    setCvState({ ...cvState, experience: updated });
                                                }} />
                                            </div>
                                            <div className="cv-field">
                                                <label className="text-xs font-semibold block mb-1">Period</label>
                                                <input className="input input-bordered input-sm w-full" type="text" value={exp.period} onChange={e => {
                                                    const updated = [...cvState.experience];
                                                    updated[i].period = e.target.value;
                                                    setCvState({ ...cvState, experience: updated });
                                                }} />
                                            </div>
                                        </div>
                                        <div className="cv-field">
                                            <label className="text-xs font-semibold block mb-1">Key Responsibilities & Accomplishments</label>
                                            <textarea className="textarea textarea-bordered textarea-sm w-full" rows="4" value={exp.description} onChange={e => {
                                                const updated = [...cvState.experience];
                                                updated[i].description = e.target.value;
                                                setCvState({ ...cvState, experience: updated });
                                            }}></textarea>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'education' && (
                            <div className="post-form space-y-3">
                                {cvState.education.map((edu, i) => (
                                    <div key={edu.id || i} className="p-3 rounded-xl border border-base-content/10 bg-base-300/30">
                                        <div className="cv-field mb-2">
                                            <label className="text-xs font-semibold block mb-1">Degree / Qualification</label>
                                            <input className="input input-bordered input-sm w-full" type="text" value={edu.degree} onChange={e => {
                                                const updated = [...cvState.education];
                                                updated[i].degree = e.target.value;
                                                setCvState({ ...cvState, education: updated });
                                            }} />
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            <div className="cv-field">
                                                <label className="text-xs font-semibold block mb-1">Institution</label>
                                                <input className="input input-bordered input-sm w-full" type="text" value={edu.school} onChange={e => {
                                                    const updated = [...cvState.education];
                                                    updated[i].school = e.target.value;
                                                    setCvState({ ...cvState, education: updated });
                                                }} />
                                            </div>
                                            <div className="cv-field">
                                                <label className="text-xs font-semibold block mb-1">Period</label>
                                                <input className="input input-bordered input-sm w-full" type="text" value={edu.period} onChange={e => {
                                                    const updated = [...cvState.education];
                                                    updated[i].period = e.target.value;
                                                    setCvState({ ...cvState, education: updated });
                                                }} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'certifications' && (
                            <div className="post-form space-y-3">
                                <label className="text-xs font-semibold block">Training &amp; Certifications</label>
                                {cvState.certifications?.map((cert, i) => (
                                    <div key={cert.id || i} className="flex gap-2">
                                        <input
                                            className="input input-bordered input-sm w-full"
                                            type="text"
                                            value={cert.name}
                                            onChange={e => {
                                                const updated = [...cvState.certifications];
                                                updated[i].name = e.target.value;
                                                setCvState({ ...cvState, certifications: updated });
                                            }}
                                        />
                                    </div>
                                ))}
                                <button type="button" onClick={handleReset} className="btn btn-outline btn-sm w-full mt-4">
                                    Reset to Kelvin Defaults
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Right: Live A4 Printable Preview */}
                    <div className="cv-preview-card" id="cv-print-area" style={{ background: selectedTemplate === 'executive' ? '#ffffff' : (selectedTemplate === 'modern' ? '#0f172a' : '#090d16'), color: selectedTemplate === 'executive' ? '#1e293b' : '#f8fafc', padding: '2.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', minHeight: '680px' }}>
                        
                        {/* CV Header */}
                        <div style={{ borderBottom: `2px solid ${selectedTemplate === 'executive' ? '#0284c7' : 'var(--accent-color)'}`, paddingBottom: '1.2rem', marginBottom: '1.4rem' }}>
                            <h1 style={{ fontSize: '1.75rem', fontWeight: '800', letterSpacing: '0.5px', margin: '0 0 0.3rem 0', color: selectedTemplate === 'executive' ? '#0f172a' : '#fff' }}>{cvState.personal.name}</h1>
                            <p style={{ fontSize: '0.86rem', color: selectedTemplate === 'executive' ? '#0284c7' : 'var(--accent-color)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 0.6rem 0' }}>{cvState.personal.title}</p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem 1rem', fontSize: '0.8rem', color: selectedTemplate === 'executive' ? '#64748b' : 'var(--text-secondary)' }}>
                                <span>{cvState.personal.location}</span>
                                <span>•</span>
                                <span>{cvState.personal.phone}</span>
                                <span>•</span>
                                <span>{cvState.personal.email}</span>
                                {cvState.personal.github && (
                                    <>
                                        <span>•</span>
                                        <span>GitHub: {cvState.personal.github}</span>
                                    </>
                                )}
                                {cvState.personal.portfolio && (
                                    <>
                                        <span>•</span>
                                        <span>Portfolio: {cvState.personal.portfolio}</span>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Professional Summary */}
                        <div style={{ marginBottom: '1.4rem' }}>
                            <h3 style={{ fontSize: '0.92rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: selectedTemplate === 'executive' ? '#0f172a' : '#fff', borderBottom: '1px solid rgba(128,128,128,0.2)', paddingBottom: '0.3rem', marginBottom: '0.5rem' }}>Professional Summary</h3>
                            <p style={{ fontSize: '0.84rem', lineHeight: '1.6', margin: 0, opacity: 0.9 }}>{cvState.summary}</p>
                        </div>

                        {/* Professional Experience */}
                        <div style={{ marginBottom: '1.4rem' }}>
                            <h3 style={{ fontSize: '0.92rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: selectedTemplate === 'executive' ? '#0f172a' : '#fff', borderBottom: '1px solid rgba(128,128,128,0.2)', paddingBottom: '0.3rem', marginBottom: '0.7rem' }}>Professional Experience</h3>
                            {cvState.experience.map(exp => (
                                <div key={exp.id} style={{ marginBottom: '1rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: '0.88rem', fontWeight: 'bold' }}>
                                        <span style={{ color: selectedTemplate === 'executive' ? '#0f172a' : '#fff' }}>{exp.title}</span>
                                        <span style={{ color: selectedTemplate === 'executive' ? '#0284c7' : 'var(--accent-color)', fontSize: '0.78rem' }}>{exp.period}</span>
                                    </div>
                                    <div style={{ fontSize: '0.82rem', fontWeight: '600', opacity: 0.85, marginBottom: '0.35rem', color: selectedTemplate === 'executive' ? '#0284c7' : '#4cc9f0' }}>{exp.company}</div>
                                    <div style={{ fontSize: '0.82rem', lineHeight: '1.55', opacity: 0.9, whiteSpace: 'pre-line' }}>{exp.description}</div>
                                </div>
                            ))}
                        </div>

                        {/* Technical Skills */}
                        <div style={{ marginBottom: '1.4rem' }}>
                            <h3 style={{ fontSize: '0.92rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: selectedTemplate === 'executive' ? '#0f172a' : '#fff', borderBottom: '1px solid rgba(128,128,128,0.2)', paddingBottom: '0.3rem', marginBottom: '0.5rem' }}>Technical Skills</h3>
                            <div style={{ fontSize: '0.82rem', lineHeight: '1.6' }}>
                                {cvState.skills.programming && (
                                    <p style={{ margin: '0 0 0.25rem 0' }}><strong>Programming:</strong> {cvState.skills.programming}</p>
                                )}
                                {cvState.skills.softwareDev && (
                                    <p style={{ margin: '0 0 0.25rem 0' }}><strong>Software Development:</strong> {cvState.skills.softwareDev}</p>
                                )}
                                {cvState.skills.itSystems && (
                                    <p style={{ margin: '0 0 0.25rem 0' }}><strong>IT &amp; Systems:</strong> {cvState.skills.itSystems}</p>
                                )}
                                {(cvState.skills.networkingSecurity || cvState.skills.security) && (
                                    <p style={{ margin: '0 0 0.25rem 0' }}><strong>Networking &amp; Security:</strong> {cvState.skills.networkingSecurity || cvState.skills.security}</p>
                                )}
                                {cvState.skills.dataCloud && (
                                    <p style={{ margin: '0 0 0.25rem 0' }}><strong>Data &amp; Cloud:</strong> {cvState.skills.dataCloud}</p>
                                )}
                            </div>
                        </div>

                        {/* Education */}
                        <div style={{ marginBottom: '1.4rem' }}>
                            <h3 style={{ fontSize: '0.92rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: selectedTemplate === 'executive' ? '#0f172a' : '#fff', borderBottom: '1px solid rgba(128,128,128,0.2)', paddingBottom: '0.3rem', marginBottom: '0.5rem' }}>Education</h3>
                            {cvState.education.map(edu => (
                                <div key={edu.id} style={{ marginBottom: '0.6rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: '0.84rem' }}>
                                        <span style={{ fontWeight: 'bold' }}>{edu.school}</span>
                                        <span style={{ color: selectedTemplate === 'executive' ? '#0284c7' : 'var(--accent-color)', fontSize: '0.78rem' }}>{edu.period}</span>
                                    </div>
                                    <div style={{ fontSize: '0.82rem', opacity: 0.85 }}>{edu.degree}</div>
                                </div>
                            ))}
                        </div>

                        {/* Training & Certifications */}
                        {cvState.certifications && cvState.certifications.length > 0 && (
                            <div style={{ marginBottom: '1.4rem' }}>
                                <h3 style={{ fontSize: '0.92rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: selectedTemplate === 'executive' ? '#0f172a' : '#fff', borderBottom: '1px solid rgba(128,128,128,0.2)', paddingBottom: '0.3rem', marginBottom: '0.5rem' }}>Training &amp; Certifications</h3>
                                <div style={{ fontSize: '0.82rem', lineHeight: '1.55', opacity: 0.9 }}>
                                    {cvState.certifications.map(c => (
                                        <div key={c.id}>• {c.name}</div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Key Strengths */}
                        {cvState.skills.soft && (
                            <div>
                                <h3 style={{ fontSize: '0.92rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: selectedTemplate === 'executive' ? '#0f172a' : '#fff', borderBottom: '1px solid rgba(128,128,128,0.2)', paddingBottom: '0.3rem', marginBottom: '0.5rem' }}>Key Strengths</h3>
                                <p style={{ fontSize: '0.82rem', lineHeight: '1.6', margin: 0, opacity: 0.9 }}>
                                    {cvState.skills.soft}
                                </p>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </section>
    );
}
