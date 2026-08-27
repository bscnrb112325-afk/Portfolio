/**
 * Module 2: WHAT I DO (Services & Skills)
 * Encapsulates the 11 modular services data and rendering
 */

export const whatIDoData = {
    title: "What I Do",
    subtitle: "I provide technology solutions focused on reliability, security, scalability, and business efficiency.",
    services: [
        {
            title: "AI Integration",
            icon: "fa-robot",
            description: "Designing practical AI-assisted workflows, chatbots, automation tools, and intelligent features that improve productivity and decision-making.",
            isSpecial: true
        },
        {
            title: "Cloud Management",
            icon: "fa-cloud",
            description: "Deploying, configuring, monitoring, and maintaining cloud environments to ensure secure and high-performing operations."
        },
        {
            title: "Custom Software Development",
            icon: "fa-code",
            description: "Designing and building modern software solutions tailored to business and operational requirements."
        },
        {
            title: "Backup & Recovery Systems",
            icon: "fa-rotate-right",
            description: "Implementing secure backup and disaster recovery strategies to protect critical business data."
        },
        {
            title: "Network Support",
            icon: "fa-network-wired",
            description: "Managing, optimizing, troubleshooting, and securing network infrastructure for stable connectivity."
        },
        {
            title: "IT Consulting",
            icon: "fa-lightbulb",
            description: "Providing technical guidance, infrastructure planning, and solution recommendations."
        },
        {
            title: "Project Management",
            icon: "fa-clipboard-list",
            description: "Coordinating technical projects from planning to deployment while ensuring quality delivery."
        },
        {
            title: "Graphic Design",
            icon: "fa-palette",
            description: "Creating clean and professional digital designs for branding and user experiences."
        },
        {
            title: "Cybersecurity",
            icon: "fa-shield-halved",
            description: "Strengthening systems through security practices, monitoring, and risk management."
        },
        {
            title: "Computer Repair",
            icon: "fa-screwdriver-wrench",
            description: "Diagnosing and resolving hardware and software issues to improve reliability."
        },
        {
            title: "Computer Networking",
            icon: "fa-server",
            description: "Designing and maintaining secure and scalable network environments."
        }
    ]
};

export function renderSkills() {
    const cardsHtml = whatIDoData.services.map((service, index) => {
        const delayClass = index % 3 === 1 ? 'delay-1' : index % 3 === 2 ? 'delay-2' : '';
        const specialClass = service.isSpecial ? 'ai-service' : '';

        return `
            <div class="skill-card glass-card ${specialClass} fade-in-up ${delayClass}">
                <div class="skill-icon"><i class="fa-solid ${service.icon}"></i></div>
                <h3>${service.title}</h3>
                <p style="font-size: 0.9rem; color: var(--text-secondary); margin-top: -0.5rem;">${service.description}</p>
            </div>
        `;
    }).join('');

    return `
    <section class="skills-section module-content-container" id="skills">
        <div class="container">
            <h2 class="section-title fade-in-up">${whatIDoData.title}</h2>
            <p class="fade-in-up" style="color: var(--text-secondary); margin-top: -2rem; margin-bottom: 3rem; font-size: 1.1rem; max-width: 800px;">
                ${whatIDoData.subtitle}
            </p>
            <div class="skills-grid" id="skills-grid">
                ${cardsHtml}
            </div>
        </div>
    </section>
    `;
}

export function initSkills() {
    // Skills initialization
}
