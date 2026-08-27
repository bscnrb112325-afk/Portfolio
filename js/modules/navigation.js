/**
 * Navigation Module
 * Encapsulates navbar, active tab indicators, and module navigation triggers
 */

export function renderNavigation(activeModule = 'hub') {
    return `
    <nav class="navbar">
        <div class="nav-container">
            <button class="logo-btn" data-nav="hub" style="background: none; border: none; cursor: pointer; color: #fff; font-size: 1.4rem; font-weight: 800; font-family: inherit;">
                <i class="fa-solid fa-layer-group" style="color: var(--primary-color); margin-right: 6px;"></i> Dashboard
            </button>
            <ul class="nav-links">
                <li><button class="nav-link-btn ${activeModule === 'about' ? 'active' : ''}" data-nav="about">About</button></li>
                <li><button class="nav-link-btn ${activeModule === 'skills' ? 'active' : ''}" data-nav="skills">What I Do</button></li>
                <li><button class="nav-link-btn ${activeModule === 'projects' ? 'active' : ''}" data-nav="projects">Projects</button></li>
                <li><button class="nav-link-btn ${activeModule === 'mission' ? 'active' : ''}" data-nav="mission">Mission</button></li>
            </ul>
        </div>
    </nav>
    `;
}

export function initNavigation() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 40) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
}
