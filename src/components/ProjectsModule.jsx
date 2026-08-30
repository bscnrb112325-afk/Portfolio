import React from 'react';
import { projectsData } from '../data/portfolioData';

export default function ProjectsModule() {
    return (
        <section className="projects-section module-content-container" id="projects">
            <div className="container">
                <h2 className="section-title fade-in-up">{projectsData.title}</h2>
                <div className="projects-grid" id="projects-grid">
                    {projectsData.projects.map((project, index) => {
                        const featuredClass = project.isFeatured ? 'featured-project' : '';
                        const delayClass = index % 2 === 1 ? 'delay-1' : '';

                        return (
                            <div key={project.title} className={`project-card glass-card ${featuredClass} fade-in-up ${delayClass}`}>
                                <div className="project-content">
                                    <h3>{project.title}</h3>
                                    <p>{project.description}</p>
                                    {project.extraDetails && <p>{project.extraDetails}</p>}
                                    <div className="tech-stack">
                                        {project.techStack.map(tag => (
                                            <span key={tag}>{tag}</span>
                                        ))}
                                    </div>
                                </div>
                                {project.liveUrl && (
                                    <div className="project-links">
                                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="project-link">
                                            <i className="fa-solid fa-arrow-up-right-from-square"></i> Live Project
                                        </a>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
