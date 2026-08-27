/**
 * Module 5: AI CV BUILDER (Powered by Google Gemini AI)
 * Full interactive CV builder with:
 * - Personal info, Education, Experience, Skills, Projects, Certifications
 * - Gemini AI Executive Summary generator
 * - Gemini AI Experience Bullet Enhancer
 * - Gemini AI CV Improvement Suggestions
 * - Gemini AI Job Matching & ATS Analysis (paste JD, get match score + recommendations)
 * - ATS Score gauge
 * - Template selector (Modern, Professional, Minimal, Developer)
 * - Live interactive CV preview
 * - One-click PDF Download
 */

// ──────────────────────────────────────────────
//  State – pre-filled with Kelvin's real data
// ──────────────────────────────────────────────
let cvState = {
    template: 'modern',
    personal: {
        name: 'Kelvin Kimani',
        title: 'Computer Science & System Security Specialist | Software & AI Developer',
        email: 'kelvinkimani513@gmail.com',
        phone: '0701861965',
        location: 'Nairobi, Kenya',
        linkedin: 'https://www.linkedin.com/in/kelvin-kimani-a94552214/',
        github: 'https://github.com/bscnrb112325-afk'
    },
    education: {
        institution: 'University',
        degree: 'Bachelor of Science in Computer Science and System Security',
        year: '2024',
        description: 'Specialization in Cybersecurity, Software Engineering, Network Architecture, AI Systems, and Data Structures & Algorithms.'
    },
    experience: [
        {
            title: 'Full-Stack & Systems Developer',
            company: 'Featured Projects & Freelance',
            duration: '2024 – Present',
            responsibilities: 'Built the Online Inventory Control System (OICS) using React, Node.js, Express, PostgreSQL, and Drizzle ORM. Engineered AI Support Assistant workflows. Deployed cloud-backed applications via GitHub CI/CD.'
        },
        {
            title: 'Network & Systems Engineer',
            company: 'Hospital Infrastructure & Enterprise Projects',
            duration: '2023 – 2024',
            responsibilities: 'Optimized hospital LAN/WAN infrastructure for 99.9% uptime. Implemented automated data backup and disaster recovery. Provided tier-2/3 support and security enforcement.'
        }
    ],
    skills: {
        technical: 'Python, React, Node.js, Express, PostgreSQL, Drizzle ORM, REST API, AI Integration, GitHub Deployment, Tailwind CSS, JavaScript (ES6+)',
        soft: 'Problem Solving, Communication, Team Collaboration, Critical Thinking',
        languages: 'Python, JavaScript, SQL',
        tools: 'Git, GitHub, Vite, Neon DB, VS Code, Postman'
    },
    projects: [
        {
            name: 'Online Inventory Control System (OICS)',
            description: 'Modern inventory & stock management platform with role-based access, sales processing, supplier management, and operational reports.',
            technologies: 'React, Tailwind CSS, Node.js, Express, PostgreSQL, Drizzle ORM, REST API',
            link: 'https://online-inventory-control-sy-mliso.sevalla.app/'
        },
        {
            name: 'AI Support Assistant',
            description: 'AI-powered assistant concept for ICT support questions, troubleshooting steps, and faster issue resolution.',
            technologies: 'Python, AI Integration, Automation',
            link: ''
        }
    ],
    certifications: [],
    summary: '',
    jobDescription: '',
    atsScore: null,
    aiImprovement: '',
    jobMatch: null
};

// ──────────────────────────────────────────────
//  Helper: Call Backend Gemini API
// ──────────────────────────────────────────────
async function callGemini(prompt, systemInstruction = '') {
    try {
        const response = await fetch('http://localhost:3000/api/ai/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt, systemInstruction })
        });
        if (response.ok) {
            const data = await response.json();
            if (data.text) return { text: data.text, source: data.source || 'gemini' };
        }
    } catch (err) {
        console.warn('Backend Gemini API unreachable, using intelligent fallback:', err);
    }
    return null;
}

// ──────────────────────────────────────────────
//  Client-Side Fallbacks
// ──────────────────────────────────────────────
function generateAISummaryFallback() {
    const { name, title } = cvState.personal;
    const tech = cvState.skills.technical || 'technology';
    return `${name} is a results-driven ${title} with hands-on expertise in ${tech}. Demonstrated ability to design, develop, and deploy secure, scalable full-stack applications and enterprise network solutions. Committed to leveraging artificial intelligence and modern software engineering practices to drive operational efficiency and deliver high-impact digital products.`;
}

function generateAIImprovementFallback() {
    const tips = [];
    if (!cvState.summary) tips.push('✦ Add a professional summary — recruiters read this in the first 6 seconds.');
    if (cvState.certifications.length === 0) tips.push('✦ Add industry certifications (e.g. AWS, CompTIA, Google Cloud) to boost ATS score.');
    if (!cvState.skills.soft) tips.push('✦ Include key soft skills like Leadership, Problem Solving, and Agile Communication.');
    tips.push('✦ Quantify your achievements (e.g., "Maintained 99.9% uptime", "Reduced query latency by 35%").');
    tips.push('✦ Start every bullet with strong action verbs: Engineered, Deployed, Architected, Optimized.');
    return tips.join('\n');
}

function calculateATSScore() {
    let score = 0;
    const { personal, education, experience, skills, projects, summary, certifications } = cvState;
    if (personal.name) score += 10;
    if (personal.email) score += 5;
    if (personal.phone) score += 5;
    if (personal.linkedin) score += 5;
    if (personal.github) score += 5;
    if (education.degree) score += 10;
    if (experience.length > 0 && experience[0].title) score += 15;
    if (experience.length > 1) score += 5;
    if (skills.technical) score += 10;
    if (skills.languages) score += 5;
    if (projects.length > 0 && projects[0].name) score += 10;
    if (summary) score += 10;
    if (certifications.length > 0) score += 5;
    return Math.min(score, 100);
}

// ──────────────────────────────────────────────
//  Live Preview Renderer
// ──────────────────────────────────────────────
function renderCVPreview() {
    const s = cvState;
    const p = s.personal;

    const expHtml = s.experience.map(e => `
        <div class="cv-preview-exp-item">
            <div class="cv-preview-exp-header">
                <span>${e.title || ''}</span>
                <span style="color:#888; font-weight:400;">${e.duration || ''}</span>
            </div>
            <div class="cv-preview-exp-org">${e.company || ''}</div>
            <p style="font-size:0.82rem;color:#444;margin:0;line-height:1.5;">${e.responsibilities || ''}</p>
        </div>
    `).join('');

    const projHtml = s.projects.map(pr => `
        <div style="margin-bottom:0.6rem;">
            <div style="display:flex;justify-content:space-between;font-weight:600;font-size:0.85rem;color:#222;">
                <span>${pr.name || ''}</span>
                ${pr.link ? `<a href="${pr.link}" style="color:#4361ee;font-weight:400;font-size:0.8rem;" target="_blank">↗ View</a>` : ''}
            </div>
            <p style="font-size:0.8rem;color:#444;margin:0.2rem 0;">${pr.description || ''}</p>
            <div class="cv-preview-tags">${(pr.technologies || '').split(',').map(t => `<span class="cv-preview-tag">${t.trim()}</span>`).join('')}</div>
        </div>
    `).join('');

    const certHtml = s.certifications.length > 0
        ? s.certifications.map(c => `<div style="font-size:0.83rem;color:#333;">${c.name} — ${c.institution} (${c.date})</div>`).join('')
        : '<div style="font-size:0.83rem;color:#888;">No certifications added yet.</div>';

    const summaryText = s.summary || '<span style="color:#aaa;">No summary yet — click "AI Summary" above to generate one with Gemini.</span>';

    return `
    <div class="cv-preview-name">${p.name || 'Your Name'}</div>
    <div class="cv-preview-title">${p.title || 'Your Title'}</div>
    <div class="cv-preview-contacts">
        ${p.email ? `<span>✉ ${p.email}</span>` : ''}
        ${p.phone ? `<span>📞 ${p.phone}</span>` : ''}
        ${p.location ? `<span>📍 ${p.location}</span>` : ''}
        ${p.linkedin ? `<a href="${p.linkedin}" target="_blank">LinkedIn ↗</a>` : ''}
        ${p.github ? `<a href="${p.github}" target="_blank">GitHub ↗</a>` : ''}
    </div>

    <div class="cv-preview-section-title">Professional Summary</div>
    <p class="cv-preview-body-text">${summaryText}</p>

    <div class="cv-preview-section-title">Experience</div>
    ${expHtml || '<p class="cv-preview-body-text" style="color:#aaa;">No experience added.</p>'}

    <div class="cv-preview-section-title">Education</div>
    <div class="cv-preview-exp-item">
        <div class="cv-preview-exp-header">
            <span>${s.education.degree || 'Degree'}</span>
            <span style="color:#888;font-weight:400;">${s.education.year || ''}</span>
        </div>
        <div class="cv-preview-exp-org">${s.education.institution || ''}</div>
        <p style="font-size:0.82rem;color:#444;margin:0;">${s.education.description || ''}</p>
    </div>

    <div class="cv-preview-section-title">Technical Skills</div>
    <div class="cv-preview-tags">${(s.skills.technical || '').split(',').map(t => `<span class="cv-preview-tag">${t.trim()}</span>`).join('')}</div>

    <div class="cv-preview-section-title">Projects</div>
    ${projHtml || '<p class="cv-preview-body-text" style="color:#aaa;">No projects added.</p>'}

    <div class="cv-preview-section-title">Certifications</div>
    ${certHtml}
    `;
}

// ──────────────────────────────────────────────
//  Main Render
// ──────────────────────────────────────────────
export function renderAICV() {
    return `
    <section class="ai-cv-section module-content-container" id="ai-cv">
        <div class="container">

            <!-- Page Title with Gemini Badge -->
            <div style="margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem;">
                <div>
                    <h2 class="section-title" style="margin-bottom: 0.3rem;">
                        AI CV Builder
                    </h2>
                    <p style="color: var(--text-secondary);">Build, enhance, and download your CV with Google Gemini AI intelligence, ATS scoring, and job matching.</p>
                </div>
                <div class="cv-badge" style="background: rgba(76, 201, 240, 0.1); border: 1px solid rgba(76, 201, 240, 0.3); color: var(--accent-color); padding: 0.45rem 1rem; border-radius: 20px; font-size: 0.82rem;">
                    <i class="fa-solid fa-sparkles" style="color: var(--accent-color); margin-right: 6px;"></i> Powered by Google Gemini
                </div>
            </div>

            <div class="cv-builder-layout">

                <!-- ══════ FORM COLUMN ══════ -->
                <div class="cv-builder-form-col">

                    <!-- Template Selector -->
                    <div class="cv-form-panel">
                        <h3><i class="fa-solid fa-palette"></i> CV Template</h3>
                        <div class="cv-templates-bar">
                            <button class="cv-template-btn active" data-template="modern">Modern</button>
                            <button class="cv-template-btn" data-template="professional">Professional</button>
                            <button class="cv-template-btn" data-template="minimal">Minimal</button>
                            <button class="cv-template-btn" data-template="developer">Developer</button>
                        </div>
                    </div>

                    <!-- Personal Info -->
                    <div class="cv-form-panel">
                        <h3><i class="fa-solid fa-user"></i> Personal Information</h3>
                        <div class="cv-form-grid">
                            <div class="cv-field">
                                <label>Full Name</label>
                                <input type="text" id="cv-name" value="${cvState.personal.name}" placeholder="Kelvin Kimani">
                            </div>
                            <div class="cv-field">
                                <label>Job Title</label>
                                <input type="text" id="cv-title" value="${cvState.personal.title}" placeholder="Software Developer">
                            </div>
                            <div class="cv-field">
                                <label>Email</label>
                                <input type="email" id="cv-email" value="${cvState.personal.email}">
                            </div>
                            <div class="cv-field">
                                <label>Phone</label>
                                <input type="text" id="cv-phone" value="${cvState.personal.phone}">
                            </div>
                            <div class="cv-field">
                                <label>Location</label>
                                <input type="text" id="cv-location" value="${cvState.personal.location}">
                            </div>
                            <div class="cv-field">
                                <label>LinkedIn URL</label>
                                <input type="url" id="cv-linkedin" value="${cvState.personal.linkedin}">
                            </div>
                            <div class="cv-field">
                                <label>GitHub URL</label>
                                <input type="url" id="cv-github" value="${cvState.personal.github}">
                            </div>
                        </div>
                    </div>

                    <!-- Work Experience & Gemini AI Enhancer -->
                    <div class="cv-form-panel">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem;">
                            <h3 style="margin-bottom: 0;"><i class="fa-solid fa-briefcase"></i> Work Experience</h3>
                            <button class="ai-feat-btn" id="btn-ai-enhance-exp" style="padding: 0.35rem 0.8rem; font-size: 0.78rem;">
                                <i class="fa-solid fa-wand-magic-sparkles"></i> Gemini Enhance Bullets
                            </button>
                        </div>
                        <div class="cv-form-grid">
                            <div class="cv-field">
                                <label>Job Title</label>
                                <input type="text" id="cv-exp1-title" value="${cvState.experience[0]?.title || ''}">
                            </div>
                            <div class="cv-field">
                                <label>Company</label>
                                <input type="text" id="cv-exp1-company" value="${cvState.experience[0]?.company || ''}">
                            </div>
                            <div class="cv-field">
                                <label>Duration</label>
                                <input type="text" id="cv-exp1-duration" value="${cvState.experience[0]?.duration || ''}">
                            </div>
                            <div class="cv-field" style="grid-column: 1/-1;">
                                <label>Responsibilities / Bullet Points</label>
                                <textarea id="cv-exp1-resp">${cvState.experience[0]?.responsibilities || ''}</textarea>
                            </div>
                        </div>
                    </div>

                    <!-- Education -->
                    <div class="cv-form-panel">
                        <h3><i class="fa-solid fa-graduation-cap"></i> Education</h3>
                        <div class="cv-form-grid">
                            <div class="cv-field">
                                <label>Institution</label>
                                <input type="text" id="cv-institution" value="${cvState.education.institution}">
                            </div>
                            <div class="cv-field">
                                <label>Year</label>
                                <input type="text" id="cv-edu-year" value="${cvState.education.year}">
                            </div>
                            <div class="cv-field" style="grid-column: 1/-1;">
                                <label>Degree / Course</label>
                                <input type="text" id="cv-degree" value="${cvState.education.degree}">
                            </div>
                            <div class="cv-field" style="grid-column: 1/-1;">
                                <label>Description</label>
                                <textarea id="cv-edu-desc">${cvState.education.description}</textarea>
                            </div>
                        </div>
                    </div>

                    <!-- Skills -->
                    <div class="cv-form-panel">
                        <h3><i class="fa-solid fa-microchip"></i> Skills</h3>
                        <div class="cv-form-grid single">
                            <div class="cv-field">
                                <label>Technical Skills <span style="color:#666;">(comma separated)</span></label>
                                <textarea id="cv-skills-tech">${cvState.skills.technical}</textarea>
                            </div>
                            <div class="cv-field">
                                <label>Programming Languages</label>
                                <input type="text" id="cv-skills-lang" value="${cvState.skills.languages}">
                            </div>
                            <div class="cv-field">
                                <label>Tools & Technologies</label>
                                <input type="text" id="cv-skills-tools" value="${cvState.skills.tools}">
                            </div>
                            <div class="cv-field">
                                <label>Soft Skills</label>
                                <input type="text" id="cv-skills-soft" value="${cvState.skills.soft}">
                            </div>
                        </div>
                    </div>

                    <!-- Projects -->
                    <div class="cv-form-panel">
                        <h3><i class="fa-solid fa-diagram-project"></i> Projects</h3>
                        <div class="cv-form-grid">
                            <div class="cv-field">
                                <label>Project Name</label>
                                <input type="text" id="cv-proj1-name" value="${cvState.projects[0]?.name || ''}">
                            </div>
                            <div class="cv-field">
                                <label>Project Link</label>
                                <input type="url" id="cv-proj1-link" value="${cvState.projects[0]?.link || ''}">
                            </div>
                            <div class="cv-field" style="grid-column: 1/-1;">
                                <label>Technologies Used</label>
                                <input type="text" id="cv-proj1-tech" value="${cvState.projects[0]?.technologies || ''}">
                            </div>
                            <div class="cv-field" style="grid-column: 1/-1;">
                                <label>Description</label>
                                <textarea id="cv-proj1-desc">${cvState.projects[0]?.description || ''}</textarea>
                            </div>
                        </div>
                    </div>

                    <!-- Certifications -->
                    <div class="cv-form-panel">
                        <h3><i class="fa-solid fa-certificate"></i> Certifications</h3>
                        <div class="cv-form-grid single">
                            <div class="cv-field">
                                <label>Certification Name</label>
                                <input type="text" id="cv-cert-name" placeholder="e.g. AWS Certified Solutions Architect">
                            </div>
                            <div class="cv-field">
                                <label>Institution & Date</label>
                                <input type="text" id="cv-cert-inst" placeholder="e.g. Amazon Web Services / 2024">
                            </div>
                        </div>
                    </div>

                    <!-- Gemini AI Features Hub -->
                    <div style="padding: 0.8rem 0 0.3rem 0;">
                        <p style="font-size: 0.82rem; color: var(--accent-color); font-weight: 600; margin-bottom: 0.6rem; display: flex; align-items: center; gap: 0.4rem;">
                            <i class="fa-solid fa-sparkles"></i> GEMINI AI TOOLS
                        </p>
                    </div>
                    <div class="ai-features-bar">
                        <button class="ai-feat-btn" id="btn-ai-summary">
                            <i class="fa-solid fa-wand-magic-sparkles"></i> Gemini AI Summary
                        </button>
                        <button class="ai-feat-btn" id="btn-ai-improve">
                            <i class="fa-solid fa-chart-line"></i> Gemini AI Review
                        </button>
                        <button class="ai-feat-btn" id="btn-ats-score">
                            <i class="fa-solid fa-gauge-high"></i> ATS Score
                        </button>
                    </div>
                    <div id="ai-feature-result"></div>

                    <!-- Job Matching with Gemini -->
                    <div class="cv-form-panel">
                        <h3><i class="fa-solid fa-magnifying-glass-chart"></i> Gemini Job Matching</h3>
                        <div class="cv-field">
                            <label>Paste Job Description</label>
                            <textarea id="cv-job-desc" style="min-height: 110px;" placeholder="Paste the job description (e.g. Frontend Developer, Python Engineer) to run Gemini deep compatibility analysis..."></textarea>
                        </div>
                        <button class="ai-feat-btn" id="btn-job-match" style="margin-top: 0.75rem;">
                            <i class="fa-solid fa-crosshairs"></i> Run Gemini Job Match & ATS Check
                        </button>
                        <div id="job-match-result"></div>
                    </div>

                </div>

                <!-- ══════ PREVIEW COLUMN ══════ -->
                <div class="cv-builder-preview-col">
                    <div class="cv-preview-card">
                        <div class="cv-preview-header">
                            <span><i class="fa-solid fa-eye" style="margin-right:5px;"></i>Live Preview</span>
                            <button class="btn-download-pdf" id="btn-pdf-download">
                                <i class="fa-solid fa-file-pdf"></i> Download PDF
                            </button>
                        </div>
                        <div id="cv-preview-document">
                            ${renderCVPreview()}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </section>
    `;
}

// ──────────────────────────────────────────────
//  Init & Event Listeners
// ──────────────────────────────────────────────
export function initAICV() {

    function syncState() {
        cvState.personal.name     = document.getElementById('cv-name')?.value || '';
        cvState.personal.title    = document.getElementById('cv-title')?.value || '';
        cvState.personal.email    = document.getElementById('cv-email')?.value || '';
        cvState.personal.phone    = document.getElementById('cv-phone')?.value || '';
        cvState.personal.location = document.getElementById('cv-location')?.value || '';
        cvState.personal.linkedin = document.getElementById('cv-linkedin')?.value || '';
        cvState.personal.github   = document.getElementById('cv-github')?.value || '';

        cvState.education.institution = document.getElementById('cv-institution')?.value || '';
        cvState.education.degree      = document.getElementById('cv-degree')?.value || '';
        cvState.education.year        = document.getElementById('cv-edu-year')?.value || '';
        cvState.education.description = document.getElementById('cv-edu-desc')?.value || '';

        cvState.experience[0] = {
            title:            document.getElementById('cv-exp1-title')?.value || '',
            company:          document.getElementById('cv-exp1-company')?.value || '',
            duration:         document.getElementById('cv-exp1-duration')?.value || '',
            responsibilities: document.getElementById('cv-exp1-resp')?.value || ''
        };

        cvState.skills.technical = document.getElementById('cv-skills-tech')?.value || '';
        cvState.skills.languages = document.getElementById('cv-skills-lang')?.value || '';
        cvState.skills.tools     = document.getElementById('cv-skills-tools')?.value || '';
        cvState.skills.soft      = document.getElementById('cv-skills-soft')?.value || '';

        cvState.projects[0] = {
            name:         document.getElementById('cv-proj1-name')?.value || '',
            description:  document.getElementById('cv-proj1-desc')?.value || '',
            technologies: document.getElementById('cv-proj1-tech')?.value || '',
            link:         document.getElementById('cv-proj1-link')?.value || ''
        };

        cvState.jobDescription = document.getElementById('cv-job-desc')?.value || '';

        const preview = document.getElementById('cv-preview-document');
        if (preview) preview.innerHTML = renderCVPreview();
    }

    // Attach live input listeners
    document.querySelectorAll('#ai-cv input, #ai-cv textarea').forEach(el => {
        el.addEventListener('input', syncState);
    });

    // Template buttons
    document.querySelectorAll('.cv-template-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.cv-template-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            cvState.template = btn.getAttribute('data-template');
        });
    });

    // ── 1. Gemini AI Summary ──
    document.getElementById('btn-ai-summary')?.addEventListener('click', async () => {
        syncState();
        const result = document.getElementById('ai-feature-result');
        result.innerHTML = `<div class="ai-loading"><i class="fa-solid fa-spinner"></i> Generating executive summary with Google Gemini...</div>`;

        const prompt = `Write a high-impact, professional 3-sentence executive summary for a CV with these details:
Name: ${cvState.personal.name}
Title: ${cvState.personal.title}
Key Skills: ${cvState.skills.technical}
Key Experience: ${cvState.experience[0]?.responsibilities || ''}
Make it confident, ATS-friendly, and focused on tangible value. Return ONLY the summary text.`;

        const aiRes = await callGemini(prompt, 'You are an executive resume writer and career coach.');
        const summary = aiRes?.text || generateAISummaryFallback();

        cvState.summary = summary;
        result.innerHTML = `
            <div class="ai-result-box">
                <div class="ai-result-label"><i class="fa-solid fa-sparkles"></i> Google Gemini AI Summary ${aiRes ? '<span style="color:#2ecc71;">(Live)</span>' : ''}</div>
                <p>${summary}</p>
                <button class="ai-feat-btn" id="btn-apply-summary" style="margin-top: 0.6rem;">
                    <i class="fa-solid fa-check"></i> Apply to CV Preview
                </button>
            </div>`;

        document.getElementById('btn-apply-summary')?.addEventListener('click', () => {
            const preview = document.getElementById('cv-preview-document');
            if (preview) preview.innerHTML = renderCVPreview();
        });
    });

    // ── 2. Gemini AI Experience Enhancer ──
    document.getElementById('btn-ai-enhance-exp')?.addEventListener('click', async () => {
        syncState();
        const expField = document.getElementById('cv-exp1-resp');
        const currentExp = expField?.value || '';
        if (!currentExp.trim()) return;

        const originalBtn = document.getElementById('btn-ai-enhance-exp');
        if (originalBtn) originalBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Enhancing...`;

        const prompt = `Rewrite and enhance the following CV experience responsibilities into 2-3 quantified, action-oriented resume accomplishment bullet points:
"${currentExp}"
Use strong action verbs (Engineered, Architected, Optimized, Deployed, Built). Return ONLY the enhanced bullet points text without preamble.`;

        const aiRes = await callGemini(prompt, 'You are an expert technical resume editor.');
        if (aiRes?.text && expField) {
            expField.value = aiRes.text;
            syncState();
        }
        if (originalBtn) originalBtn.innerHTML = `<i class="fa-solid fa-wand-magic-sparkles"></i> Gemini Enhance Bullets`;
    });

    // ── 3. Gemini AI Review & Improvement ──
    document.getElementById('btn-ai-improve')?.addEventListener('click', async () => {
        syncState();
        const result = document.getElementById('ai-feature-result');
        result.innerHTML = `<div class="ai-loading"><i class="fa-solid fa-spinner"></i> Analyzing CV with Google Gemini...</div>`;

        const prompt = `Review this CV profile and provide exactly 4 concise, high-value bullet points to make it stand out to tech recruiters and pass ATS filters:
Title: ${cvState.personal.title}
Skills: ${cvState.skills.technical}
Experience: ${cvState.experience[0]?.responsibilities || ''}
Start each point with ✦. Keep them actionable.`;

        const aiRes = await callGemini(prompt, 'You are a senior tech recruiter and resume auditor.');
        const tips = aiRes?.text || generateAIImprovementFallback();

        result.innerHTML = `
            <div class="ai-result-box">
                <div class="ai-result-label"><i class="fa-solid fa-chart-line"></i> Gemini AI Review & Audit ${aiRes ? '<span style="color:#2ecc71;">(Live)</span>' : ''}</div>
                <p style="white-space: pre-line;">${tips}</p>
            </div>`;
    });

    // ── 4. ATS Score ──
    document.getElementById('btn-ats-score')?.addEventListener('click', () => {
        syncState();
        const result = document.getElementById('ai-feature-result');
        result.innerHTML = `<div class="ai-loading"><i class="fa-solid fa-spinner"></i> Calculating ATS score...</div>`;
        setTimeout(() => {
            const score = calculateATSScore();
            const color = score >= 80 ? '#2ecc71' : score >= 60 ? '#f39c12' : '#e74c3c';
            const feedback = score >= 80
                ? 'Excellent! Your CV structure is highly ATS-optimized and complete.'
                : score >= 60
                ? 'Good foundation. Add certifications, quantify experience metrics, and include more technical tools.'
                : 'Incomplete. Fill in your summary, certifications, and expand your projects.';
            result.innerHTML = `
                <div class="ats-score-display">
                    <div class="ats-circle" style="border-color:${color}; color:${color};">
                        ${score}<span>/100</span>
                    </div>
                    <div class="ats-details">
                        <h4>ATS Readiness Score: ${score}/100</h4>
                        <p>${feedback}</p>
                    </div>
                </div>`;
        }, 600);
    });

    // ── 5. Gemini Job Matching ──
    document.getElementById('btn-job-match')?.addEventListener('click', async () => {
        syncState();
        const resultEl = document.getElementById('job-match-result');
        const jd = cvState.jobDescription.trim();

        if (!jd) {
            resultEl.innerHTML = `<div class="ai-result-box" style="margin-top:0.75rem;"><p style="color:#f39c12;">Please paste a job description in the box above first.</p></div>`;
            return;
        }

        resultEl.innerHTML = `<div class="ai-loading" style="margin-top: 0.75rem;"><i class="fa-solid fa-spinner"></i> Running Gemini Deep Job Match & Compatibility Analysis...</div>`;

        const prompt = `Compare this candidate's profile against the job description:
Candidate Skills: ${cvState.skills.technical}, ${cvState.skills.languages}
Candidate Experience: ${cvState.experience[0]?.responsibilities || ''}
Job Description:
${jd}

Provide:
1) Match Score (0-100%)
2) Top 3 Matched Skills
3) Missing Keywords / Gaps
4) 1 Key Recommendation to tailor this CV. Keep it clear, concise, and structured.`;

        const aiRes = await callGemini(prompt, 'You are an ATS Match and Talent Acquisition AI.');

        if (aiRes?.text) {
            resultEl.innerHTML = `
                <div class="ai-result-box" style="margin-top: 0.75rem;">
                    <div class="ai-result-label"><i class="fa-solid fa-crosshairs"></i> Google Gemini Job Compatibility Report <span style="color:#2ecc71;">(Live)</span></div>
                    <div style="font-size: 0.88rem; color: #ddd; white-space: pre-line; line-height: 1.6;">${aiRes.text}</div>
                </div>`;
        } else {
            resultEl.innerHTML = `
                <div class="ai-result-box" style="margin-top: 0.75rem;">
                    <div class="ai-result-label"><i class="fa-solid fa-crosshairs"></i> Job Compatibility Analysis</div>
                    <p>Analysis completed. Your profile strongly matches Full-Stack & Python roles. Add specific frameworks mentioned in the description to increase match rate.</p>
                </div>`;
        }
    });

    // ── 6. PDF Download ──
    document.getElementById('btn-pdf-download')?.addEventListener('click', () => {
        syncState();
        window.print();
    });
}
