/**
 * Module 1: ABOUT
 * Encapsulates the "About" section data, photo management, and dynamic degree API integration
 */

export const aboutData = {
    greeting: "Hi, I'm",
    name: "kelvin",
    roles: [
        "A Software Developer",
        "System Security",
        "AI Solutions",
        "Network Engineer"
    ],
    intro: "Passionate about building reliable, secure, and efficient technology solutions. I specialize in maintaining and securing network infrastructure, supporting enterprise systems, integrating AI-powered tools, managing hardware and software environments, and delivering dependable ICT operations that improve performance, accessibility, and service delivery.",
    background: "My background combines software development, artificial intelligence, networking, system administration, cybersecurity, cloud technologies, and technical support, enabling me to design, implement, and maintain scalable technology solutions while solving complex technical challenges through innovation and practical problem-solving.",
    status: "Available for Work"
};

export function renderAbout() {
    const rolesHtml = aboutData.roles
        .map(role => `<span class="role">${role}</span>`)
        .join('<span class="dot">||</span>');

    return `
    <header class="hero module-content-container" id="about">
        <div class="container hero-content">
            <div class="hero-text fade-in-up">
                <span class="greeting">${aboutData.greeting}</span>
                <h1 id="hero-name">${aboutData.name}</h1>
                <h2 class="roles">
                    ${rolesHtml}
                </h2>
                <p class="intro" style="margin-top: 1.5rem;">
                    ${aboutData.intro}
                </p>
                <p class="background">
                    ${aboutData.background}
                </p>
            </div>
            <div class="hero-visual fade-in-up delay-1">
                <div class="glass-card profile-card">
                    <div class="avatar-placeholder" id="avatar-container">
                        <img src="./profile.png" alt="${aboutData.name}" id="profile-image" class="profile-image" onerror="this.style.display='none'; document.getElementById('avatar-icon').style.display='flex';">
                        <i class="fa-solid fa-user-astronaut" id="avatar-icon"></i>
                    </div>
                    <div class="status-badge">
                        <span class="pulse"></span> ${aboutData.status}
                    </div>
                </div>
            </div>
        </div>
    </header>
    `;
}

export function initAbout() {
    // Fetch dynamic profile information from backend API
    fetchProfileData();
}

async function fetchProfileData() {
    const apiUrl = (window.location.hostname === 'localhost' && window.location.port === '5173')
        ? 'http://localhost:3000/api/profile'
        : '/api/profile';

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('API response not ok');

        const data = await response.json();
        const nameElement = document.getElementById('hero-name');
        const titleElement = document.getElementById('hero-api-title');

        if (nameElement && data.name) {
            nameElement.textContent = data.name;
        }

        if (titleElement && data.title) {
            titleElement.textContent = "Degree: " + data.title;
            titleElement.style.opacity = '1';
        }
    } catch (error) {
        console.warn("Using default static profile info (backend API offline or unreachable).");
    }
}
