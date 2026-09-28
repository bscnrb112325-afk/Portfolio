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
                    <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-xs" style={{ color: 'var(--text-muted)' }}></i>
                    <input
                        type="text"
                        placeholder="Search projects or stack..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-full border py-2 pl-9 pr-8 text-xs sm:text-sm outline-none transition-all duration-200 focus:border-[#4361ee] focus:shadow-md focus:shadow-[#4361ee]/20"
                        style={{
                            borderColor: 'var(--border)',
                            backgroundColor: 'var(--bg-card)',
                            color: 'var(--text-primary)',
                        }}
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            aria-label="Clear search"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-white"
                        >
                            <i className="fa-solid fa-xmark"></i>
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
                            className={`cursor-pointer rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 ${
                                isSelected
                                    ? 'bg-linear-to-r from-[#4361ee] to-[#4cc9f0] text-white shadow-md shadow-[#4361ee]/30'
                                    : 'border hover:border-[#4361ee]/50 hover:bg-[#4361ee]/15 hover:text-[#4361ee]'
                            }`}
                            style={isSelected ? {} : { borderColor: 'var(--border)', backgroundColor: 'var(--bg-overlay-light)', color: 'var(--text-primary)' }}
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
                    className="flex flex-col items-center justify-center rounded-2xl border p-12 text-center"
                    style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-card)' }}
                >
                    <div className="mb-3 flex size-14 items-center justify-center rounded-2xl bg-[#4361ee]/15 text-2xl text-[#4cc9f0]">
                        <i className="fa-solid fa-folder-open"></i>
                    </div>
                    <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>No projects found</h3>
                    <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                        No projects matched your criteria for &quot;{searchQuery}&quot;. Try resetting your filters.
                    </p>
                    <button
                        onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                        className="mt-4 rounded-full border border-[#4361ee]/40 bg-[#4361ee]/20 px-5 py-2 text-xs font-semibold text-[#4cc9f0] hover:bg-[#4361ee]/30"
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
                                className={`group relative flex flex-col justify-between rounded-2xl p-6 sm:p-7 backdrop-blur-md transition-all duration-300 animate-[fadeInUp_0.5s_cubic-bezier(0.16,1,0.3,1)_forwards] opacity-0 ${delay} hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)]`}
                                style={{
                                    border: isFeatured ? '1px solid var(--border-featured)' : '1px solid var(--border)',
                                    backgroundColor: isFeatured ? 'var(--bg-card-featured)' : 'var(--bg-card)',
                                }}
                            >
                                {isFeatured && (
                                    <span className="absolute right-5 top-5 rounded-full border border-[#4361ee]/40 bg-[#4361ee]/20 px-3 py-0.5 text-xs font-semibold text-[#4cc9f0]">
                                        Featured
                                    </span>
                                )}

                                <div>
                                    <div className="mb-4 flex items-start gap-3">
                                        <div className="mt-0.5 flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#4361ee]/15 text-xl text-[#4cc9f0] transition-transform duration-300 group-hover:scale-110">
                                            <i className={`fa-solid ${project.icon || 'fa-code'}`}></i>
                                        </div>
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
                                                <i className="fa-solid fa-lightbulb mr-1"></i>Behind the Project:{' '}
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
                                                className="rounded-full border border-[#4361ee]/30 bg-[#4361ee]/10 px-2.5 py-0.5 text-[0.75rem] font-medium text-[#4cc9f0]"
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
                                                    className="inline-flex items-center gap-1.5 rounded-full border border-[#4361ee]/40 bg-[#4361ee]/15 px-3.5 py-1.5 text-xs font-semibold text-[#4cc9f0] transition-all duration-200 hover:border-[#4361ee] hover:bg-[#4361ee]/30 hover:text-white"
                                                >
                                                    <i className="fa-solid fa-arrow-up-right-from-square text-xs"></i>
                                                    Live Demo
                                                </a>
                                            )}
                                            {project.githubUrl && (
                                                <a
                                                    href={project.githubUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 hover:border-[#4361ee] hover:bg-[#4361ee]/20 hover:text-[#4cc9f0]"
                                                    style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-overlay-light)', color: 'var(--text-primary)' }}
                                                >
                                                    <i className="fa-brands fa-github text-xs"></i>
                                                    GitHub
                                                </a>
                                            )}
                                        </div>

                                        <button
                                            onClick={() => setActiveModalProject(project)}
                                            className="cursor-pointer text-xs font-semibold text-[#4cc9f0] hover:underline"
                                        >
                                            Deep Dive <i className="fa-solid fa-chevron-right ml-0.5 text-[0.65rem]"></i>
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
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md"
                    style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
                    onClick={() => setActiveModalProject(null)}
                >
                    <div
                        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border p-6 sm:p-8 shadow-2xl backdrop-blur-xl"
                        style={{
                            borderColor: 'var(--border)',
                            backgroundColor: 'var(--bg-card-solid)',
                            color: 'var(--text-primary)',
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button */}
                        <button
                            onClick={() => setActiveModalProject(null)}
                            aria-label="Close modal"
                            className="absolute right-5 top-5 flex size-8 cursor-pointer items-center justify-center rounded-full border text-neutral-400 transition-all hover:bg-white/10 hover:text-white"
                            style={{ borderColor: 'var(--border)' }}
                        >
                            <i className="fa-solid fa-xmark"></i>
                        </button>

                        <div className="mb-4 flex items-center gap-3">
                            <div className="flex size-12 items-center justify-center rounded-xl bg-[#4361ee]/20 text-2xl text-[#4cc9f0]">
                                <i className={`fa-solid ${activeModalProject.icon || 'fa-code'}`}></i>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold">{activeModalProject.title}</h3>
                                <span className="text-xs font-semibold uppercase tracking-wider text-[#4cc9f0]">
                                    {activeModalProject.category}
                                </span>
                            </div>
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
                                        <i className="fa-solid fa-heart mr-1.5"></i>Why I Built This / The Real-World Need
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
                                            className="rounded-full border border-[#4361ee]/40 bg-[#4361ee]/15 px-3 py-1 text-xs font-medium text-[#4cc9f0]"
                                        >
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="mt-8 flex flex-wrap items-center justify-end gap-3 border-t pt-5" style={{ borderColor: 'var(--border)' }}>
                            {activeModalProject.liveUrl && (
                                <a
                                    href={activeModalProject.liveUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-[#4361ee] to-[#4cc9f0] px-5 py-2 text-xs font-semibold text-white shadow-md transition-all hover:opacity-90"
                                >
                                    <i className="fa-solid fa-arrow-up-right-from-square"></i>
                                    Visit Live Application
                                </a>
                            )}
                            {activeModalProject.githubUrl && (
                                <a
                                    href={activeModalProject.githubUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 rounded-full border px-5 py-2 text-xs font-semibold transition-all hover:bg-white/10"
                                    style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                                >
                                    <i className="fa-brands fa-github text-sm"></i>
                                    View Source on GitHub
                                </a>
                            )}
                            <button
                                onClick={() => setActiveModalProject(null)}
                                className="cursor-pointer rounded-full border px-4 py-2 text-xs font-semibold transition-all hover:bg-white/10"
                                style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
