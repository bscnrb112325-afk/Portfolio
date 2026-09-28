import React, { useState, useMemo } from 'react';
import { projectsData } from '../data/portfolioData';

export default function ProjectsModule() {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeModalProject, setActiveModalProject] = useState(null);

    const categories = ['All', 'Featured', 'Full-Stack', 'AI & Automation', 'Networking & Systems', 'Cloud & Security'];

    // Filter projects using React useMemo
    const filteredProjects = useMemo(() => {
        return projectsData.projects.filter(project => {
            // Category filter
            const matchesCategory =
                selectedCategory === 'All' ? true :
                selectedCategory === 'Featured' ? project.isFeatured :
                project.category === selectedCategory;

            // Search query filter
            const query = searchQuery.toLowerCase().trim();
            const matchesSearch = !query ||
                project.title.toLowerCase().includes(query) ||
                (project.tagline && project.tagline.toLowerCase().includes(query)) ||
                project.description.toLowerCase().includes(query) ||
                (project.story && project.story.toLowerCase().includes(query)) ||
                (project.extraDetails && project.extraDetails.toLowerCase().includes(query)) ||
                project.techStack.some(tech => tech.toLowerCase().includes(query));

            return matchesCategory && matchesSearch;
        });
    }, [selectedCategory, searchQuery]);

    return (
        <section id="projects" className="py-8">
            {/* Header section */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <span className="mb-1 inline-block text-xs font-bold uppercase tracking-wider text-[#4cc9f0]">
                        Real-World Work
                    </span>
                    <h2 className="bg-linear-to-r from-[#4361ee] to-[#4cc9f0] bg-clip-text text-3xl font-extrabold text-transparent sm:text-4xl">
                        {projectsData.title}
                    </h2>
                    <p className="mt-1 text-sm sm:text-base" style={{ color: 'var(--text-muted)' }}>
                        {projectsData.subtitle || 'Every project was built to solve a concrete problem for real people, businesses, or communities.'}
                    </p>
                </div>

                {/* React Search Bar */}
                <div className="relative w-full sm:w-72">
                    <input
                        type="text"
                        placeholder="Search projects or stack..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input input-bordered w-full rounded-full pl-4 pr-9 text-xs sm:text-sm"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            aria-label="Clear search"
                            className="btn btn-ghost btn-circle btn-xs absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                        >
                            ✕
                        </button>
                    )}
                </div>
            </div>

            {/* Category Filter Pills */}
            <div className="mb-8 flex flex-wrap items-center gap-2">
                {categories.map(category => {
                    const isSelected = selectedCategory === category;
                    return (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`btn btn-sm rounded-full transition-all duration-200 ${
                                isSelected
                                    ? 'btn-primary text-white shadow-md shadow-[#4361ee]/30'
                                    : 'btn-ghost border border-base-content/10 hover:border-primary/50'
                            }`}
                        >
                            {category}
                        </button>
                    );
                })}

                <span className="ml-auto text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                    Showing {filteredProjects.length} of {projectsData.projects.length}
                </span>
            </div>

            {/* Projects Grid */}
            {filteredProjects.length === 0 ? (
                <div
                    className="card card-bordered flex flex-col items-center justify-center p-12 text-center bg-base-200/50"
                    style={{ borderColor: 'var(--border)' }}
                >
                    <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>No projects found</h3>
                    <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                        No projects matched your criteria for &quot;{searchQuery}&quot;. Try resetting your filters.
                    </p>
                    <button
                        onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                        className="btn btn-primary btn-sm rounded-full mt-4"
                    >
                        Reset Filters
                    </button>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2">
                    {filteredProjects.map((project, index) => {
                        const isFeatured = project.isFeatured;
                        const delay = index % 2 === 1 ? 'delay-[100ms]' : '';

                        return (
                            <div
                                key={project.title}
                                className={`card card-bordered group relative flex flex-col justify-between p-6 sm:p-7 backdrop-blur-md transition-all duration-300 animate-[fadeInUp_0.5s_cubic-bezier(0.16,1,0.3,1)_forwards] opacity-0 ${delay} hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] bg-base-200/50`}
                                style={{
                                    borderColor: isFeatured ? 'var(--border-featured)' : 'var(--border)',
                                }}
                            >
                                {isFeatured && (
                                    <span className="badge badge-primary badge-outline absolute right-5 top-5 text-xs font-semibold">
                                        Featured
                                    </span>
                                )}

                                <div>
                                    <div className="mb-4">
                                        <div className="pr-16">
                                            <h3 className="text-xl font-bold transition-colors duration-200 group-hover:text-[#4cc9f0]" style={{ color: 'var(--text-primary)' }}>
                                                {project.title}
                                            </h3>
                                            {project.category && (
                                                <span className="mt-0.5 inline-block text-[0.75rem] font-semibold tracking-wide text-[#4cc9f0]">
                                                    {project.category}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {project.tagline && (
                                        <p className="mb-2 text-sm font-medium italic" style={{ color: 'var(--text-primary)' }}>
                                            &ldquo;{project.tagline}&rdquo;
                                        </p>
                                    )}

                                    <p className="mb-3 text-[0.92rem] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                                        {project.description}
                                    </p>

                                    {/* The Human Story / Why I built this callout */}
                                    {project.story && (
                                        <div
                                            className="mb-4 rounded-xl border-l-3 border-[#4cc9f0] p-3 text-xs leading-relaxed"
                                            style={{ backgroundColor: 'var(--bg-overlay-light)', color: 'var(--text-muted)' }}
                                        >
                                            <span className="font-bold text-[#4cc9f0]">
                                                Behind the Project:{' '}
                                            </span>
                                            {project.story}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    {/* Tech tags */}
                                    <div className="flex flex-wrap gap-1.5 pt-2">
                                        {project.techStack.map(tag => (
                                            <span
                                                key={tag}
                                                className="badge badge-sm badge-outline badge-primary"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Action links */}
                                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t pt-4" style={{ borderColor: 'var(--border)' }}>
                                        <div className="flex flex-wrap items-center gap-2">
                                            {project.liveUrl && (
                                                <a
                                                    href={project.liveUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn btn-primary btn-sm rounded-full text-xs font-semibold text-white shadow-sm"
                                                >
                                                    Live Demo &rarr;
                                                </a>
                                            )}
                                            {project.githubUrl && (
                                                <a
                                                    href={project.githubUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn btn-outline btn-sm rounded-full text-xs font-semibold"
                                                >
                                                    GitHub
                                                </a>
                                            )}
                                        </div>

                                        <button
                                            onClick={() => setActiveModalProject(project)}
                                            className="btn btn-ghost btn-sm text-xs font-semibold text-[#4cc9f0] hover:underline"
                                        >
                                            Deep Dive &rarr;
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Project Deep Dive Modal */}
            {activeModalProject && (
                <dialog className="modal modal-open">
                    <div className="modal-box relative max-w-2xl bg-base-200 border border-base-content/10 shadow-2xl p-6 sm:p-8">
                        {/* Close button */}
                        <button
                            onClick={() => setActiveModalProject(null)}
                            aria-label="Close modal"
                            className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4"
                        >
                            ✕
                        </button>

                        <div className="mb-4">
                            <h3 className="text-2xl font-bold">{activeModalProject.title}</h3>
                            <span className="badge badge-primary badge-outline text-xs font-semibold uppercase tracking-wider mt-1">
                                {activeModalProject.category}
                            </span>
                        </div>

                        {activeModalProject.tagline && (
                            <p className="mb-4 text-base italic" style={{ color: 'var(--text-muted)' }}>
                                &ldquo;{activeModalProject.tagline}&rdquo;
                            </p>
                        )}

                        <div className="space-y-4 text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                            <div>
                                <h4 className="mb-1 text-xs font-bold uppercase tracking-wider text-[#4cc9f0]">
                                    The Overview
                                </h4>
                                <p>{activeModalProject.description}</p>
                            </div>

                            {activeModalProject.story && (
                                <div className="rounded-xl border border-[#4cc9f0]/30 bg-[#4cc9f0]/5 p-4">
                                    <h4 className="mb-1 text-xs font-bold uppercase tracking-wider text-[#4cc9f0]">
                                        Why I Built This / The Real-World Need
                                    </h4>
                                    <p className="text-xs sm:text-sm">{activeModalProject.story}</p>
                                </div>
                            )}

                            {activeModalProject.extraDetails && (
                                <div>
                                    <h4 className="mb-1 text-xs font-bold uppercase tracking-wider text-[#4cc9f0]">
                                        Key Technical Highlights
                                    </h4>
                                    <p>{activeModalProject.extraDetails}</p>
                                </div>
                            )}

                            <div>
                                <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-[#4cc9f0]">
                                    Technology Stack &amp; Tools
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {activeModalProject.techStack.map(t => (
                                        <span
                                            key={t}
                                            className="badge badge-primary badge-outline px-3 py-2 text-xs font-medium"
                                        >
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="modal-action mt-8 flex flex-wrap items-center justify-end gap-3 border-t pt-5 border-base-content/10">
                            {activeModalProject.liveUrl && (
                                <a
                                    href={activeModalProject.liveUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-primary btn-sm rounded-full text-xs font-semibold text-white shadow-md"
                                >
                                    Visit Live Application &rarr;
                                </a>
                            )}
                            {activeModalProject.githubUrl && (
                                <a
                                    href={activeModalProject.githubUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-outline btn-sm rounded-full text-xs font-semibold"
                                >
                                    View Source on GitHub
                                </a>
                            )}
                            <button
                                onClick={() => setActiveModalProject(null)}
                                className="btn btn-ghost btn-sm rounded-full text-xs font-semibold"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                    <form method="dialog" className="modal-backdrop bg-black/60" onClick={() => setActiveModalProject(null)}>
                        <button>close</button>
                    </form>
                </dialog>
            )}
        </section>
    );
}
