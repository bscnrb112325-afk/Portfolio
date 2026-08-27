/**
 * Module 3: PROJECTS (Featured Projects)
 * Encapsulates the 6 projects, tech stacks, live links, and rendering
 */

export const projectsData = {
    title: "Featured Projects",
    projects: [
        {
            title: "Online Inventory Control System (OICS)",
            description: "Designed and developed a modern inventory and stock management platform that centralizes inventory operations and improves business efficiency. The system enables organizations to manage products, monitor stock movement, process sales, track orders, manage suppliers, and generate operational reports through a unified dashboard.",
            extraDetails: "Features role-based access control, inventory automation workflows, reporting capabilities, and administrative controls.",
            techStack: ["React", "Tailwind CSS", "Node.js", "Express", "PostgreSQL", "Drizzle ORM", "REST API", "Python", "AI", "GitHub Deployment"],
            isFeatured: true,
            liveUrl: "https://online-inventory-control-sy-mliso.sevalla.app/"
        },
        {
            title: "Hospital Network Infrastructure Optimization",
            description: "Designed and supported network operations to improve connectivity, reliability, and system availability across departments while maintaining security and performance standards.",
            techStack: ["Networking", "System Administration", "Infrastructure"]
        },
        {
            title: "Cloud Backup & Recovery",
            description: "Implemented structured backup procedures and recovery processes to improve data protection and business continuity.",
            techStack: ["Cloud Services", "Backup Management", "IT Operations"]
        },
        {
            title: "Computer Maintenance Support",
            description: "Created workflows and support procedures for diagnosing, maintaining, and resolving hardware and software issues.",
            techStack: ["Hardware Support", "Troubleshooting", "Documentation"]
        },
        {
            title: "AI Support Assistant",
            description: "Designed an AI-powered assistant concept for handling common ICT support questions, organizing troubleshooting steps, and helping users resolve technical issues faster.",
            techStack: ["Artificial Intelligence", "Automation", "Technical Support"]
        },
        {
            title: "Data Analysis Dashboard",
            description: "Built a reporting dashboard to visualize operational data and support decision-making using analytical insights.",
            techStack: ["Data Analysis", "Reporting Tools", "Visualization"]
        }
    ]
};

export function renderProjects() {
    const cardsHtml = projectsData.projects.map((project, index) => {
        const featuredClass = project.isFeatured ? 'featured-project' : '';
        const delayClass = index % 2 === 1 ? 'delay-1' : '';

        const tagsHtml = project.techStack.map(tag => `<span>${tag}</span>`).join('');
        const liveLinkHtml = project.liveUrl
            ? `<div class="project-links">
                 <a href="${project.liveUrl}" target="_blank" class="project-link">
                   <i class="fa-solid fa-arrow-up-right-from-square"></i> Live Project
                 </a>
               </div>`
            : '';

        const extraHtml = project.extraDetails ? `<p>${project.extraDetails}</p>` : '';

        return `
            <div class="project-card glass-card ${featuredClass} fade-in-up ${delayClass}">
                <div class="project-content">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    ${extraHtml}
                    <div class="tech-stack">
                        ${tagsHtml}
                    </div>
                </div>
                ${liveLinkHtml}
            </div>
        `;
    }).join('');

    return `
    <section class="projects-section module-content-container" id="projects">
        <div class="container">
            <h2 class="section-title fade-in-up">${projectsData.title}</h2>
            <div class="projects-grid" id="projects-grid">
                ${cardsHtml}
            </div>
        </div>
    </section>
    `;
}

export function initProjects() {
    // Projects initialization
}
