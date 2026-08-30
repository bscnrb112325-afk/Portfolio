import React, { useState, useEffect } from 'react';
import { defaultCvState } from '../data/cvDefaultState';

export default function AICVModule() {
    const [cvState, setCvState] = useState(() => {
        try {
            const saved = localStorage.getItem('portfolio_ai_cv_data');
            return saved ? JSON.parse(saved) : defaultCvState;
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
            localStorage.setItem('portfolio_ai_cv_data', JSON.stringify(cvState));
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
            const res = await fetch('/api/ai/generate', {
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
            const res = await fetch('/api/ai/generate', {
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
                        <button className="ai-feat-btn" onClick={handleGenerateAiSummary} disabled={aiLoading}>
                            <i className="fa-solid fa-wand-magic-sparkles"></i> {aiLoading ? 'Drafting...' : 'AI Summary'}
                        </button>
                        <button className="ai-feat-btn" onClick={handleAiReview} disabled={aiLoading}>
                            <i className="fa-solid fa-brain"></i> AI ATS Review
                        </button>
                        <button className="btn-primary" onClick={handlePrint} style={{ padding: '0.55rem 1.2rem', fontSize: '0.88rem' }}>
                            <i className="fa-solid fa-file-pdf"></i> Export PDF
                        </button>
                    </div>
                </div>

                {/* ATS Score & Template Selector Bar */}
                <div className="glass-card" style={{ padding: '1rem 1.5rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>ATS Readiness:</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: '120px', height: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden' }}>
                                <div style={{ width: `${atsScore}%`, height: '100%', background: atsScore > 80 ? '#06d6a0' : '#ffd166', transition: 'width 0.4s ease' }}></div>
                            </div>
                            <span style={{ fontWeight: 'bold', color: atsScore > 80 ? '#06d6a0' : '#ffd166', fontSize: '0.9rem' }}>{atsScore}%</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Template:</span>
                        <button
                            className={`cv-template-btn ${selectedTemplate === 'modern' ? 'active' : ''}`}
                            onClick={() => setSelectedTemplate('modern')}
                            style={{ padding: '0.35rem 0.8rem', fontSize: '0.8rem', borderRadius: '8px', cursor: 'pointer', background: selectedTemplate === 'modern' ? 'var(--accent-color)' : 'rgba(255,255,255,0.05)', color: selectedTemplate === 'modern' ? '#0f172a' : '#fff', border: '1px solid rgba(255,255,255,0.1)' }}
                        >
                            Modern Tech
                        </button>
                        <button
                            className={`cv-template-btn ${selectedTemplate === 'executive' ? 'active' : ''}`}
                            onClick={() => setSelectedTemplate('executive')}
                            style={{ padding: '0.35rem 0.8rem', fontSize: '0.8rem', borderRadius: '8px', cursor: 'pointer', background: selectedTemplate === 'executive' ? 'var(--accent-color)' : 'rgba(255,255,255,0.05)', color: selectedTemplate === 'executive' ? '#0f172a' : '#fff', border: '1px solid rgba(255,255,255,0.1)' }}
                        >
                            Executive
                        </button>
                        <button
                            className={`cv-template-btn ${selectedTemplate === 'creative' ? 'active' : ''}`}
                            onClick={() => setSelectedTemplate('creative')}
                            style={{ padding: '0.35rem 0.8rem', fontSize: '0.8rem', borderRadius: '8px', cursor: 'pointer', background: selectedTemplate === 'creative' ? 'var(--accent-color)' : 'rgba(255,255,255,0.05)', color: selectedTemplate === 'creative' ? '#0f172a' : '#fff', border: '1px solid rgba(255,255,255,0.1)' }}
                        >
                            Creative Dark
                        </button>
                    </div>
                </div>

                {/* AI Advice Notification (if present) */}
                {aiAdvice && (
                    <div style={{ background: 'rgba(76, 201, 240, 0.08)', border: '1px solid rgba(76, 201, 240, 0.3)', borderRadius: '12px', padding: '1rem 1.4rem', marginBottom: '2rem', position: 'relative' }}>
                        <h4 style={{ color: 'var(--accent-color)', margin: '0 0 0.5rem 0', fontSize: '0.95rem' }}>
                            <i className="fa-solid fa-sparkles"></i> AI ATS Optimization Recommendations:
                        </h4>
                        <p style={{ color: '#e2e8f0', fontSize: '0.88rem', margin: 0, whiteSpace: 'pre-line', lineHeight: '1.6' }}>
                            {aiAdvice}
                        </p>
                        <button onClick={() => setAiAdvice('')} style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>✕</button>
                    </div>
                )}

                {/* Studio Grid: Left Editor & Right Live Preview */}
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 420px) 1fr', gap: '2rem', alignItems: 'start' }}>
                    
                    {/* Left: Interactive Form */}
                    <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '16px' }}>
                        <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.2rem', overflowX: 'auto', paddingBottom: '0.3rem' }}>
                            {['personal', 'skills', 'experience', 'education'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    style={{
                                        padding: '0.4rem 0.8rem',
                                        fontSize: '0.8rem',
                                        borderRadius: '6px',
                                        background: activeTab === tab ? 'rgba(76, 201, 240, 0.2)' : 'transparent',
                                        color: activeTab === tab ? 'var(--accent-color)' : 'var(--text-secondary)',
                                        border: 'none',
                                        cursor: 'pointer',
                                        textTransform: 'capitalize',
                                        fontWeight: activeTab === tab ? '600' : 'normal'
                                    }}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {activeTab === 'personal' && (
                            <div className="post-form">
                                <div className="cv-field">
                                    <label>Full Name</label>
                                    <input type="text" value={cvState.personal.name} onChange={e => setCvState({ ...cvState, personal: { ...cvState.personal, name: e.target.value } })} />
                                </div>
                                <div className="cv-field">
                                    <label>Professional Title</label>
                                    <input type="text" value={cvState.personal.title} onChange={e => setCvState({ ...cvState, personal: { ...cvState.personal, title: e.target.value } })} />
                                </div>
                                <div className="cv-field">
                                    <label>Email</label>
                                    <input type="email" value={cvState.personal.email} onChange={e => setCvState({ ...cvState, personal: { ...cvState.personal, email: e.target.value } })} />
                                </div>
                                <div className="cv-field">
                                    <label>Phone</label>
                                    <input type="text" value={cvState.personal.phone} onChange={e => setCvState({ ...cvState, personal: { ...cvState.personal, phone: e.target.value } })} />
                                </div>
                                <div className="cv-field">
                                    <label>Professional Summary</label>
                                    <textarea rows="4" value={cvState.summary} onChange={e => setCvState({ ...cvState, summary: e.target.value })}></textarea>
                                </div>
                            </div>
                        )}

                        {activeTab === 'skills' && (
                            <div className="post-form">
                                <div className="cv-field">
                                    <label>Technical Skills</label>
                                    <textarea rows="3" value={cvState.skills.technical} onChange={e => setCvState({ ...cvState, skills: { ...cvState.skills, technical: e.target.value } })}></textarea>
                                </div>
                                <div className="cv-field">
                                    <label>Security & Systems</label>
                                    <textarea rows="3" value={cvState.skills.security} onChange={e => setCvState({ ...cvState, skills: { ...cvState.skills, security: e.target.value } })}></textarea>
                                </div>
                                <div className="cv-field">
                                    <label>Soft Skills</label>
                                    <input type="text" value={cvState.skills.soft} onChange={e => setCvState({ ...cvState, skills: { ...cvState.skills, soft: e.target.value } })} />
                                </div>
                            </div>
                        )}

                        {activeTab === 'experience' && (
                            <div className="post-form">
                                {cvState.experience.map((exp, i) => (
                                    <div key={exp.id || i} style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                                        <div className="cv-field">
                                            <label>Role / Position</label>
                                            <input type="text" value={exp.title} onChange={e => {
                                                const updated = [...cvState.experience];
                                                updated[i].title = e.target.value;
                                                setCvState({ ...cvState, experience: updated });
                                            }} />
                                        </div>
                                        <div className="cv-field">
                                            <label>Company / Project</label>
                                            <input type="text" value={exp.company} onChange={e => {
                                                const updated = [...cvState.experience];
                                                updated[i].company = e.target.value;
                                                setCvState({ ...cvState, experience: updated });
                                            }} />
                                        </div>
                                        <div className="cv-field">
                                            <label>Key Accomplishments</label>
                                            <textarea rows="3" value={exp.description} onChange={e => {
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
                            <div className="post-form">
                                {cvState.education.map((edu, i) => (
                                    <div key={edu.id || i}>
                                        <div className="cv-field">
                                            <label>Degree</label>
                                            <input type="text" value={edu.degree} onChange={e => {
                                                const updated = [...cvState.education];
                                                updated[i].degree = e.target.value;
                                                setCvState({ ...cvState, education: updated });
                                            }} />
                                        </div>
                                        <div className="cv-field">
                                            <label>Institution / Year</label>
                                            <input type="text" value={edu.school} onChange={e => {
                                                const updated = [...cvState.education];
                                                updated[i].school = e.target.value;
                                                setCvState({ ...cvState, education: updated });
                                            }} />
                                        </div>
                                    </div>
                                ))}
                                <button type="button" onClick={handleReset} className="cv-template-btn" style={{ marginTop: '1rem', width: '100%' }}>
                                    <i className="fa-solid fa-rotate-left"></i> Reset to Kelvin Defaults
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Right: Live A4 Printable Preview */}
                    <div className="cv-preview-card" id="cv-print-area" style={{ background: selectedTemplate === 'executive' ? '#ffffff' : (selectedTemplate === 'modern' ? '#0f172a' : '#090d16'), color: selectedTemplate === 'executive' ? '#1e293b' : '#f8fafc', padding: '2.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', minHeight: '680px' }}>
                        
                        {/* CV Header */}
                        <div style={{ borderBottom: `2px solid ${selectedTemplate === 'executive' ? '#0284c7' : 'var(--accent-color)'}`, paddingBottom: '1.2rem', marginBottom: '1.5rem' }}>
                            <h1 style={{ fontSize: '1.8rem', margin: '0 0 0.3rem 0', color: selectedTemplate === 'executive' ? '#0f172a' : '#fff' }}>{cvState.personal.name}</h1>
                            <p style={{ fontSize: '1rem', color: selectedTemplate === 'executive' ? '#0284c7' : 'var(--accent-color)', fontWeight: '600', margin: '0 0 0.6rem 0' }}>{cvState.personal.title}</p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.82rem', color: selectedTemplate === 'executive' ? '#64748b' : 'var(--text-secondary)' }}>
                                <span><i className="fa-solid fa-envelope"></i> {cvState.personal.email}</span>
                                <span><i className="fa-solid fa-phone"></i> {cvState.personal.phone}</span>
                                <span><i className="fa-solid fa-location-dot"></i> {cvState.personal.location}</span>
                            </div>
                        </div>

                        {/* Summary */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px', color: selectedTemplate === 'executive' ? '#0f172a' : '#fff', borderBottom: '1px solid rgba(128,128,128,0.2)', paddingBottom: '0.3rem', marginBottom: '0.6rem' }}>Professional Summary</h3>
                            <p style={{ fontSize: '0.88rem', lineHeight: '1.6', margin: 0, opacity: 0.9 }}>{cvState.summary}</p>
                        </div>

                        {/* Skills */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px', color: selectedTemplate === 'executive' ? '#0f172a' : '#fff', borderBottom: '1px solid rgba(128,128,128,0.2)', paddingBottom: '0.3rem', marginBottom: '0.6rem' }}>Core Technical Competencies</h3>
                            <p style={{ fontSize: '0.88rem', margin: '0 0 0.4rem 0' }}><strong>Full-Stack & Programming:</strong> {cvState.skills.technical}</p>
                            <p style={{ fontSize: '0.88rem', margin: 0 }}><strong>Security & Networks:</strong> {cvState.skills.security}</p>
                        </div>

                        {/* Experience */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px', color: selectedTemplate === 'executive' ? '#0f172a' : '#fff', borderBottom: '1px solid rgba(128,128,128,0.2)', paddingBottom: '0.3rem', marginBottom: '0.8rem' }}>Relevant Experience & Engineering Projects</h3>
                            {cvState.experience.map(exp => (
                                <div key={exp.id} style={{ marginBottom: '1rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 'bold' }}>
                                        <span>{exp.title}</span>
                                        <span style={{ color: selectedTemplate === 'executive' ? '#0284c7' : 'var(--accent-color)', fontSize: '0.82rem' }}>{exp.period}</span>
                                    </div>
                                    <div style={{ fontSize: '0.84rem', opacity: 0.8, marginBottom: '0.3rem' }}>{exp.company}</div>
                                    <p style={{ fontSize: '0.85rem', lineHeight: '1.55', margin: 0, opacity: 0.9 }}>{exp.description}</p>
                                </div>
                            ))}
                        </div>

                        {/* Education */}
                        <div>
                            <h3 style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px', color: selectedTemplate === 'executive' ? '#0f172a' : '#fff', borderBottom: '1px solid rgba(128,128,128,0.2)', paddingBottom: '0.3rem', marginBottom: '0.6rem' }}>Education & Degree</h3>
                            {cvState.education.map(edu => (
                                <div key={edu.id}>
                                    <div style={{ fontWeight: 'bold', fontSize: '0.88rem' }}>{edu.degree}</div>
                                    <div style={{ fontSize: '0.82rem', opacity: 0.8 }}>{edu.school} • {edu.period}</div>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}
