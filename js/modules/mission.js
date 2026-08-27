/**
 * Module 4: MISSION (My Mission & Contact)
 * Encapsulates mission statement, contact channels, and dynamic footer
 */

export const missionData = {
    title: "My Mission",
    statement: "To leverage technology to build secure, scalable, and impactful solutions that improve efficiency, support innovation, and create meaningful digital experiences.",
    contact: {
        email: "kelvinkimani513@gmail.com",
        phone: "0701861965",
        linkedin: "https://www.linkedin.com/in/kelvin-kimani-a94552214/?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3B85kuA6LDSaukl8MUkM%2FZvA%3D%3D",
        github: "https://github.com/bscnrb112325-afk"
    }
};

export function renderMission() {
    return `
    <footer class="footer module-content-container" id="mission" style="padding: 4rem 0;">
        <div class="container footer-content fade-in-up">
            <h2>${missionData.title}</h2>
            <p class="mission-statement" style="margin-bottom: 2.5rem;">
                "${missionData.statement}"
            </p>
            
            <div class="contact-info" style="margin-bottom: 2rem; display: flex; justify-content: center; gap: 2rem; flex-wrap: wrap; color: var(--text-secondary);">
                <a href="mailto:${missionData.contact.email}" class="project-link" style="font-size: 1.1rem;"><i class="fa-solid fa-envelope"></i> ${missionData.contact.email}</a>
                <a href="tel:${missionData.contact.phone}" class="project-link" style="font-size: 1.1rem;"><i class="fa-solid fa-phone"></i> ${missionData.contact.phone}</a>
            </div>

            <div class="social-links">
                <a href="${missionData.contact.linkedin}" target="_blank" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>
                <a href="mailto:${missionData.contact.email}" aria-label="Email"><i class="fa-solid fa-envelope"></i></a>
                <a href="tel:${missionData.contact.phone}" aria-label="Phone"><i class="fa-solid fa-phone"></i></a>
                <a href="${missionData.contact.github}" target="_blank" aria-label="GitHub"><i class="fa-brands fa-github"></i></a>
            </div>
            
            <div class="copyright">
                &copy; <span id="year"></span> kelvin. All rights reserved.
            </div>
        </div>
    </footer>
    `;
}

export function initMission() {
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
}
