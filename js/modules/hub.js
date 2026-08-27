/**
 * Dashboard Hub Module
 * Presents the 4 interactive module tiles on the dashboard
 */

export const hubModules = [
    {
        id: "about",
        title: "About",
        badge: "Profile",
        icon: "fa-user-astronaut",
        description: "Background, professional roles, system security expertise, and career summary.",
        accentColor: "rgba(76, 201, 240, 0.15)"
    },
    {
        id: "skills",
        title: "What I Do",
        badge: "11 Services",
        icon: "fa-cubes",
        description: "AI Integration, Cloud Management, Custom Software, Cybersecurity, Networking, and more.",
        accentColor: "rgba(114, 9, 183, 0.15)"
    },
    {
        id: "projects",
        title: "Projects",
        badge: "6 Featured",
        icon: "fa-diagram-project",
        description: "Online Inventory Control System, Hospital Infrastructure, AI Assistant, and Dashboards.",
        accentColor: "rgba(72, 149, 239, 0.15)"
    },
    {
        id: "mission",
        title: "Mission",
        badge: "Vision & Contact",
        icon: "fa-compass",
        description: "Mission statement, values, contact channels, and direct connectivity.",
        accentColor: "rgba(247, 37, 133, 0.15)"
    }
];

export function renderHub() {
    const cardsHtml = hubModules.map(mod => `
        <div class="module-card glass-card fade-in-up" data-module="${mod.id}">
            <div>
                <div class="card-top">
                    <div class="module-icon" style="background: ${mod.accentColor};">
                        <i class="fa-solid ${mod.icon}"></i>
                    </div>
                    <span class="module-badge">${mod.badge}</span>
                </div>
                <h3>${mod.title}</h3>
                <p>${mod.description}</p>
            </div>
            <div class="card-footer">
                <span>Open Module</span>
                <i class="fa-solid fa-arrow-right"></i>
            </div>
        </div>
    `).join('');

    return `
    <div class="container dashboard-hub">
        <div class="hub-header fade-in-up">
            <h1>Portfolio Dashboard</h1>
            <p>Select any module below to view detailed information</p>
        </div>
        <div class="modules-grid">
            ${cardsHtml}
        </div>
    </div>
    `;
}
