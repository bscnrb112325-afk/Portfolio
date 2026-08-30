/**
 * Main Application Router & Orchestrator
 * Top-left header with contact info & interactive module switcher (About, What I Do, Projects, Mission, AI CV)
 */

import { renderAbout, initAbout } from './modules/about.js';
import { renderSkills, initSkills } from './modules/skills.js';
import { renderProjects, initProjects } from './modules/projects.js';
import { renderMission, initMission } from './modules/mission.js';
import { renderAICV, initAICV } from './modules/ai-cv.js';
import { renderPosts, initPosts } from './modules/posts.js';

let activeModule = 'about'; // default active module

function getModuleHTML(mod) {
    switch (mod) {
        case 'about':
            return renderAbout();
        case 'skills':
            return renderSkills();
        case 'projects':
            return renderProjects();
        case 'mission':
            return renderMission();
        case 'aicv':
            return renderAICV();
        case 'post':
            return renderPosts();
        default:
            return renderAbout();
    }
}

function initCurrentModule(mod) {
    switch (mod) {
        case 'about':
            initAbout();
            break;
        case 'skills':
            initSkills();
            break;
        case 'projects':
            initProjects();
            break;
        case 'mission':
            initMission();
            break;
        case 'aicv':
            initAICV();
            break;
        case 'post':
            initPosts();
            break;
        default:
            initAbout();
            break;
    }
}

export function renderTopHeader(selected = 'about') {
    return `
    <header class="top-header">
        <div class="container">
            <div class="top-left-profile glass-card">
                <!-- Tagline -->
                <p class="explore-tagline">
                    Explore my portfolio to discover my projects, technical skills, and professional journey.
                </p>

                <!-- Contact Chips -->
                <div class="top-contact-list">
                    <a href="mailto:kelvinkimani513@gmail.com" class="contact-chip">
                        <i class="fa-solid fa-envelope"></i>
                        <span>kelvinkimani513@gmail.com</span>
                    </a>
                    <a href="tel:0701861965" class="contact-chip">
                        <i class="fa-solid fa-phone"></i>
                        <span>0701861965</span>
                    </a>
                    <a href="https://github.com/bscnrb112325-afk" target="_blank" rel="noopener noreferrer" class="contact-chip">
                        <i class="fa-brands fa-github"></i>
                        <span>bscnrb112325-afk</span>
                    </a>
                    <a href="https://www.linkedin.com/in/kelvin-kimani-a94552214/?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3B85kuA6LDSaukl8MUkM%2FZvA%3D%3D" target="_blank" rel="noopener noreferrer" class="contact-chip">
                        <i class="fa-brands fa-linkedin-in"></i>
                        <span>LinkedIn</span>
                    </a>
                </div>

                <!-- Modules directly below contact chips -->
                <div class="top-modules-wrapper">
                    <div class="top-modules-bar">
                        <button class="top-module-btn ${selected === 'about' ? 'active' : ''}" data-mod="about">
                            <span>About</span>
                        </button>
                        <button class="top-module-btn ${selected === 'skills' ? 'active' : ''}" data-mod="skills">
                            <span>What I Do</span>
                        </button>
                        <button class="top-module-btn ${selected === 'projects' ? 'active' : ''}" data-mod="projects">
                            <span>Projects</span>
                        </button>
                        <button class="top-module-btn ${selected === 'mission' ? 'active' : ''}" data-mod="mission">
                            <span>Mission</span>
                        </button>
                        <button class="top-module-btn ${selected === 'aicv' ? 'active' : ''}" data-mod="aicv">
                            <span>AI CV</span>
                        </button>
                        <button class="top-module-btn ${selected === 'post' ? 'active' : ''}" data-mod="post">
                            <span>Post</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </header>
    `;
}

function renderApp(mod = 'about') {
    activeModule = mod;
    const app = document.getElementById('app');
    if (!app) return;

    app.innerHTML = `
        ${renderTopHeader(activeModule)}
        <main id="module-display">
            ${getModuleHTML(activeModule)}
        </main>
    `;

    // Initialize current module logic & listeners
    initCurrentModule(activeModule);
    attachModuleListeners();

    // Fade-in animation trigger
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in-up').forEach(el => observer.observe(el));
}

function attachModuleListeners() {
    document.querySelectorAll('[data-mod]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const targetMod = btn.getAttribute('data-mod');
            if (targetMod && targetMod !== activeModule) {
                renderApp(targetMod);
            }
        });
    });

    document.querySelectorAll('[data-nav]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const targetMod = btn.getAttribute('data-nav');
            if (targetMod) {
                renderApp(targetMod);
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderApp('about');
    console.log('✅ Top-left portfolio with module switcher initialized.');
});
