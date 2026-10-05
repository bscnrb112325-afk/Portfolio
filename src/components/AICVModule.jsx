import React, { useState, useEffect } from 'react';
import { defaultCvState } from '../data/cvDefaultState';
import { apiFetch } from '../utils/api';
// jsPDF & html2canvas are loaded lazily on first PDF download (code splitting)

const CV_STORAGE_KEY = 'portfolio_ai_cv_data_v3';

export default function AICVModule() {
    const [cvState, setCvState] = useState(() => {
        try {
            const saved = localStorage.getItem(CV_STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                // Accept any saved CV that has a valid personal section
                if (parsed?.personal && typeof parsed.personal === 'object') {
                    return parsed;
                }
            }
            return defaultCvState;
        } catch (e) {
            return defaultCvState;
        }
    });

    const [activeTab, setActiveTab] = useState('personal');
    const [selectedTemplate, setSelectedTemplate] = useState('modern');
    const [aiLoading, setAiLoading] = useState(false);
    const [aiAdvice, setAiAdvice] = useState('');
    const [atsScore, setAtsScore] = useState(88);
    const [saveStatus, setSaveStatus] = useState(null);
    const [pdfLoading, setPdfLoading] = useState(false);

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

    const handleDownloadPDF = async () => {
        const el = document.getElementById('cv-print-area');
        if (!el) return;
        setPdfLoading(true);
        try {
            // Dynamically import heavy PDF libs only when needed
            const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
                import('html2canvas'),
                import('jspdf'),
            ]);

            // Temporarily expand the element so nothing is clipped
            const originalMaxH = el.style.maxHeight;
            const originalOverflow = el.style.overflow;
            el.style.maxHeight = 'none';
            el.style.overflow = 'visible';

            const canvas = await html2canvas(el, {
                scale: 2,
                useCORS: true,
                backgroundColor: el.style.background || '#0f172a',
                logging: false,
            });

            el.style.maxHeight = originalMaxH;
            el.style.overflow = originalOverflow;

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
            });

            const pdfW = pdf.internal.pageSize.getWidth();
            const pdfH = pdf.internal.pageSize.getHeight();
            const ratio = canvas.width / canvas.height;
            const imgH = pdfW / ratio;

            // Multi-page support
            let yPos = 0;
            let remainingH = imgH;
            while (remainingH > 0) {
                const sliceH = Math.min(remainingH, pdfH);
                pdf.addImage(imgData, 'PNG', 0, -yPos, pdfW, imgH);
                remainingH -= pdfH;
                yPos += pdfH;
                if (remainingH > 0) pdf.addPage();
            }

            pdf.save(`${cvState.personal.name.replace(/\s+/g, '_')}_CV.pdf`);
        } catch (err) {
            console.error('PDF generation failed:', err);
            // Silently fall back to browser print dialog
            window.print();
        } finally {
            setPdfLoading(false);
        }
    };

    const handleSave = () => {
        setSaveStatus('saving');
        try {
            const serialized = JSON.stringify(cvState);
            localStorage.setItem(CV_STORAGE_KEY, serialized);
            // Verify the write succeeded by reading it back
            const verify = localStorage.getItem(CV_STORAGE_KEY);
            if (verify === serialized) {
                setSaveStatus('saved');
            } else {
                setSaveStatus('error');
            }
        } catch (e) {
            console.error('CV save failed:', e);
            setSaveStatus('error');
        }
        setTimeout(() => setSaveStatus(null), 2500);
    };

    const handleDownloadJson = () => {
        const blob = new Blob([JSON.stringify(cvState, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${cvState.personal.name.replace(/\s+/g, '_')}_CV.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleDownloadCV = () => {
        const isExec = selectedTemplate === 'executive';
        const bg = isExec ? '#ffffff' : '#0f172a';
        const text = isExec ? '#1e293b' : '#f1f5f9';
        const accent = isExec ? '#0284c7' : '#38bdf8';
        const subtle = isExec ? '#64748b' : '#94a3b8';
        const border = isExec ? '#e2e8f0' : '#1e3a5f';
        const expCompanyColor = isExec ? '#0284c7' : '#4cc9f0';

        const experienceHtml = cvState.experience.map(exp => `
            <div style="margin-bottom:1rem">
                <div style="display:flex;justify-content:space-between;align-items:baseline;font-size:0.9rem;font-weight:700">
                    <span style="color:${text}">${exp.title}</span>
                    <span style="color:${accent};font-size:0.8rem">${exp.period}</span>
                </div>
                <div style="font-size:0.84rem;font-weight:600;color:${expCompanyColor};margin-bottom:0.3rem">${exp.company}</div>
                <div style="font-size:0.83rem;line-height:1.6;white-space:pre-line;color:${text};opacity:0.9">${exp.description}</div>
            </div>`).join('');

        const educationHtml = cvState.education.map(edu => `
            <div style="margin-bottom:0.6rem">
                <div style="display:flex;justify-content:space-between;align-items:baseline;font-size:0.86rem">
                    <span style="font-weight:700;color:${text}">${edu.school}</span>
                    <span style="color:${accent};font-size:0.78rem">${edu.period}</span>
                </div>
                <div style="font-size:0.83rem;color:${subtle}">${edu.degree}</div>
            </div>`).join('');

        const certHtml = cvState.certifications?.map(c => `<div style="margin-bottom:0.2rem">&#8226; ${c.name}</div>`).join('') || '';

        const skillsHtml = [
            cvState.skills.programming ? `<p style="margin:0 0 0.3rem 0"><strong>Programming:</strong> ${cvState.skills.programming}</p>` : '',
            cvState.skills.softwareDev ? `<p style="margin:0 0 0.3rem 0"><strong>Software Development:</strong> ${cvState.skills.softwareDev}</p>` : '',
            cvState.skills.itSystems ? `<p style="margin:0 0 0.3rem 0"><strong>IT &amp; Systems:</strong> ${cvState.skills.itSystems}</p>` : '',
            (cvState.skills.networkingSecurity || cvState.skills.security) ? `<p style="margin:0 0 0.3rem 0"><strong>Networking &amp; Security:</strong> ${cvState.skills.networkingSecurity || cvState.skills.security}</p>` : '',
            cvState.skills.dataCloud ? `<p style="margin:0 0 0.3rem 0"><strong>Data &amp; Cloud:</strong> ${cvState.skills.dataCloud}</p>` : '',
        ].join('');

        const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${cvState.personal.name} — CV</title>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
  body {
    font-family: 'Inter', Arial, sans-serif;
    background: ${bg};
    color: ${text};
    padding: 0;
    margin: 0;
  }
  .page {
    max-width: 820px;
    margin: 0 auto;
    padding: 2.8rem 3rem;
    background: ${bg};
    min-height: 100vh;
  }
  h1 { font-size: 1.9rem; font-weight: 800; letter-spacing: 0.5px; color: ${text}; margin-bottom: 0.2rem; }
  .title { font-size: 0.88rem; color: ${accent}; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.7rem; }
  .contact { display: flex; flex-wrap: wrap; gap: 0.4rem 0.9rem; font-size: 0.8rem; color: ${subtle}; border-bottom: 2px solid ${accent}; padding-bottom: 1.1rem; margin-bottom: 1.4rem; }
  .contact span::before { content: '• '; }
  .contact span:first-child::before { content: ''; }
  h2 { font-size: 0.88rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: ${text}; border-bottom: 1px solid ${border}; padding-bottom: 0.25rem; margin-bottom: 0.6rem; }
  section { margin-bottom: 1.4rem; }
  p { font-size: 0.84rem; line-height: 1.65; }
  @media print {
    body { background: ${bg}; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .page { padding: 1.8rem 2rem; }
    .no-print { display: none !important; }
  }
  .print-btn {
    position: fixed; top: 1.2rem; right: 1.5rem;
    background: ${accent}; color: #fff;
    border: none; padding: 0.55rem 1.4rem;
    border-radius: 8px; font-size: 0.9rem;
    font-weight: 700; cursor: pointer; z-index: 999;
    box-shadow: 0 4px 18px rgba(0,0,0,0.25);
  }
  .print-btn:hover { opacity: 0.85; }
</style>
</head>
<body>
<button class="print-btn no-print" onclick="window.print()">&#x1F4E5; Save as PDF</button>
<div class="page">
  <h1>${cvState.personal.name}</h1>
  <div class="title">${cvState.personal.title}</div>
  <div class="contact">
    <span>${cvState.personal.location}</span>
    <span>${cvState.personal.phone}</span>
    <span>${cvState.personal.email}</span>
    ${cvState.personal.github ? `<span>GitHub: ${cvState.personal.github}</span>` : ''}
    ${cvState.personal.portfolio ? `<span>Portfolio: ${cvState.personal.portfolio}</span>` : ''}
  </div>

  <section>
    <h2>Professional Summary</h2>
    <p>${cvState.summary}</p>
  </section>

  <section>
    <h2>Professional Experience</h2>
    ${experienceHtml}
  </section>

  <section>
    <h2>Technical Skills</h2>
    <div style="font-size:0.83rem;line-height:1.65">${skillsHtml}</div>
  </section>

  <section>
    <h2>Education</h2>
    ${educationHtml}
  </section>

  ${cvState.certifications?.length ? `
  <section>
    <h2>Training &amp; Certifications</h2>
    <div style="font-size:0.83rem;line-height:1.65;opacity:0.9">${certHtml}</div>
  </section>` : ''}

  ${cvState.skills.soft ? `
  <section>
    <h2>Key Strengths</h2>
    <p>${cvState.skills.soft}</p>
  </section>` : ''}
</div>
</body>
</html>`;

        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${cvState.personal.name.replace(/\s+/g, '_')}_CV.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleReset = () => {
        if (window.confirm('Reset CV data to Kelvin Kimani defaults?')) {
            setCvState(defaultCvState);
        }
    };

    return (
        <section
            className="aicv-section module-content-container"
            id="aicv-module"
            style={{
                backgroundImage: 'url("./aicv-bg.png")',
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
                    background: 'linear-gradient(135deg, rgba(5,5,20,0.85) 0%, rgba(10,12,35,0.75) 50%, rgba(5,5,20,0.88) 100%)',
                    backdropFilter: 'blur(1px)',
                    zIndex: 0,
                }}
            />
            <div className="container p-4 sm:p-8" style={{ position: 'relative', zIndex: 1 }}>
                {/* Header */}
                <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.7rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        {/* Save Button */}
                        <button
                            className={`btn btn-sm rounded-lg ${
                                saveStatus === 'saved'  ? 'btn-success' :
                                saveStatus === 'error'  ? 'btn-error'   :
                                saveStatus === 'saving' ? 'btn-ghost'   :
                                'btn-outline'
                            }`}
                            onClick={handleSave}
                            id="save-cv-btn"
                            disabled={saveStatus === 'saving'}
                        >
                            {saveStatus === 'saving' ? (
                                <><span className="loading loading-spinner loading-xs" /> Saving…</>
                            ) : saveStatus === 'saved' ? (
                                <>✅ Saved!</>
                            ) : saveStatus === 'error' ? (
                                <>❌ Error</>
                            ) : (
                                <>💾 Save CV</>
                            )}
                        </button>

                        <button
                            className="btn btn-primary btn-sm rounded-lg"
                            onClick={handleDownloadCV}
                            id="download-cv-btn"
                        >
                            📥 Download CV Template
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
                <div className="aicv-studio-grid">
                    
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
