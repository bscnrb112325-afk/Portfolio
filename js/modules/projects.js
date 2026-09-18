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
            icon: "fa-boxes-stacked",
            liveUrl: "https://online-inventory-control-sy-mliso.sevalla.app/",
            githubUrl: "https://github.com/bscnrb112325-afk/ONLINE-INVENTORY-CONTROL-SYSTEM"
        },
        {
            title: "BIDIIONE",
            description: "A comprehensive construction operations and material management system developed for Bidii Quality Builders. Centralizes site procurement, contractor allocation, construction material tracking, equipment utilization, and operational reporting.",
            extraDetails: "Built with Django ORM, PostgreSQL, and data analytics dashboards for real-time tracking of site progress and cost estimation.",
            techStack: ["Python", "Django", "PostgreSQL", "Gunicorn", "Matplotlib", "NumPy", "REST API", "Docker"],
            isFeatured: true,
            icon: "fa-trowel-bricks",
            githubUrl: "https://github.com/bscnrb112325-afk/BIDII-ONE"
        },
        {
            title: "BrighterMonday Web Crawler",
            description: "An automated data extraction and web crawler designed to monitor, scrape, and analyze job listings and hiring demand across Kenya from the BrighterMonday platform. Features polite rate-limiting, error recovery, and data sanitation pipelines.",
            extraDetails: "Structures unstructured job postings into standardized datasets for market trend visualization, skill-gap analysis, and salary benchmarking.",
            techStack: ["Python", "Web Scraping", "BeautifulSoup4", "Requests", "Data Engineering", "Pandas", "Automation"],
            isFeatured: true,
            icon: "fa-spider"
        },
        {
            title: "AI Bot",
            description: "An intelligent, context-aware conversational AI assistant engineered for ICT troubleshooting, user query automation, and technical guidance. Integrates cutting-edge LLM reasoning with custom fallback heuristics.",
            extraDetails: "Features real-time stream responses, prompt engineering, multi-turn dialogue memory, and API-driven knowledge base querying.",
            techStack: ["Artificial Intelligence", "Gemini API", "Python", "Node.js", "Prompt Engineering", "NLP", "REST API"],
            isFeatured: true,
            icon: "fa-robot"
        },
        {
            title: "AgriNatura",
            description: "A smart organic agriculture platform combining microservices with cryptographic provenance and AI-assisted agronomy. Empowers farmers with crop health diagnosis, soil parameter monitoring, and verifiable supply-chain transparency from farm to consumer.",
            extraDetails: "Containerized multi-tier ecosystem featuring dedicated AI diagnosis services, responsive farmer-facing UI, and cryptographic audit records.",
            techStack: ["TypeScript", "React", "Node.js", "Python AI Service", "Docker", "Cryptographic Traceability", "REST API"],
            isFeatured: true,
            icon: "fa-seedling",
            githubUrl: "https://github.com/bscnrb112325-afk/agrinatura"
        },
        {
            title: "Productify",
            description: "A collaborative full-stack productivity and task management platform built to streamline team workflows, sprint backlogs, milestone deliveries, and productivity metrics through an interactive user interface.",
            extraDetails: "Architected with secure REST APIs, role-based project workspaces, drag-and-drop workflow tracking, and real-time state synchronization.",
            techStack: ["React", "JavaScript", "Node.js", "Express", "PostgreSQL", "REST API", "Tailwind CSS"],
            isFeatured: true,
            icon: "fa-list-check",
            githubUrl: "https://github.com/bscnrb112325-afk/productify"
        },
        {
            title: "Hospital Network Infrastructure Optimization",
            description: "Designed and supported network operations to improve connectivity, reliability, and system availability across departments while maintaining security and performance standards.",
            techStack: ["Networking", "System Administration", "Infrastructure", "VLANs", "Firewall"],
            icon: "fa-network-wired"
        },
        {
            title: "Cloud Backup & Recovery",
            description: "Implemented structured backup procedures and recovery processes to improve data protection and business continuity.",
            techStack: ["Cloud Services", "Backup Management", "IT Operations", "Disaster Recovery"],
            icon: "fa-cloud-arrow-up"
        },
        {
            title: "Computer Maintenance Support",
            description: "Created workflows and support procedures for diagnosing, maintaining, and resolving hardware and software issues.",
            techStack: ["Hardware Support", "Troubleshooting", "System Diagnostics", "Documentation"],
            icon: "fa-screwdriver-wrench"
        }
    ]
};

export function renderProjects() {
    const cardsHtml = projectsData.projects.map((project, index) => {
        const featuredClass = project.isFeatured ? 'featured-project' : '';
        const delayClass = index % 2 === 1 ? 'delay-1' : '';

        const tagsHtml = project.techStack.map(tag => `<span>${tag}</span>`).join('');
        const liveLinkHtml = project.liveUrl
            ? `<a href="${project.liveUrl}" target="_blank" class="project-link">
                 <i class="fa-solid fa-arrow-up-right-from-square"></i> Live Project
               </a>`
            : '';
        const githubLinkHtml = project.githubUrl
            ? `<a href="${project.githubUrl}" target="_blank" class="project-link github-link">
                 <i class="fa-brands fa-github"></i> GitHub Repo
               </a>`
            : '';
        const linksHtml = (liveLinkHtml || githubLinkHtml)
            ? `<div class="project-links">${liveLinkHtml} ${githubLinkHtml}</div>`
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
                ${linksHtml}
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
