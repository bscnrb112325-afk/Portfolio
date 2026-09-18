import React, { useState, useMemo } from 'react';
import { projectsData } from '../data/portfolioData';

export default function ProjectsModule() {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProjectModal, setSelectedProjectModal] = useState(null);

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
                project.description.toLowerCase().includes(query) ||
                (project.extraDetails && project.extraDetails.toLowerCase().includes(query)) ||
                project.techStack.some(tech => tech.toLowerCase().includes(query));

            return matchesCategory && matchesSearch;
        });
    }, [selectedCategory, searchQuery]);

    return (
        <section id="projects" className="py-10">
            {/* Header section */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h2 className="bg-linear-to-r from-[#4361ee] to-[#4cc9f0] bg-clip-text text-4xl font-bold text-transparent">
                        {projectsData.title}
                    </h2>
                    <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                        Explore modern full-stack web applications, AI automation agents, and enterprise systems.
                    </p>
                </div>

                {/* React Search Bar */}
                <div className="relative w-full sm:w-72">
                    <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-xs" style={{ color: 'var(--text-muted)' }}></i>
                    <input
                        type="text"
                        placeholder="Search projects or tech..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-full border py-2 pl-9 pr-8 text-sm outline-none transition-all duration-200 focus:border-[#4361ee] focus:shadow-md focus:shadow-[#4361ee]/20"
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
                                className={`group relative flex flex-col rounded-2xl p-7 backdrop-blur-md transition-all duration-300 animate-[fadeInUp_0.5s_cubic-bezier(0.16,1,0.3,1)_forwards] opacity-0 ${delay} hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)]`}
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

                                <div className="mb-4 flex items-start gap-3">
                                    <div className="mt-0.5 flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#4361ee]/15 text-xl text-[#4cc9f0] transition-transform duration-300 group-hover:scale-110">
                                        <i className={`fa-solid ${project.icon || 'fa-code'}`}></i>
                                    </div>
                                    <div className="pr-16">
                                        <h3 className="text-xl font-semibold transition-colors duration-200 group-hover:text-[#4cc9f0]" style={{ color: 'var(--text-primary)' }}>
                                            {project.title}
                                        </h3>
                                        {project.category && (
                                            <span className="mt-0.5 inline-block text-[0.75rem] font-medium" style={{ color: 'var(--text-muted)' }}>
                                                {project.category}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <p className="mb-3 flex-1 text-[0.92rem] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                                    {project.description}
                                </p>

                                {project.extraDetails && (
                                    <p className="mb-4 text-[0.85rem] leading-relaxed" style={{ color: 'var(--text-faint)' }}>
                                        {project.extraDetails}
                                    </p>
                                )}

                                {/* Tech tags */}
                                <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
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
                                {(project.liveUrl || project.githubUrl) && (
                                    <div className="mt-5 flex flex-wrap items-center gap-3 border-t pt-4" style={{ borderColor: 'var(--border)' }}>
                                        {project.liveUrl && (
                                            <a
                                                href={project.liveUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 rounded-full border border-[#4361ee]/40 bg-[#4361ee]/15 px-4 py-2 text-xs font-semibold text-[#4cc9f0] transition-all duration-200 hover:border-[#4361ee] hover:bg-[#4361ee]/30 hover:text-white hover:shadow-md hover:shadow-[#4361ee]/20"
                                            >
                                                <i className="fa-solid fa-arrow-up-right-from-square text-xs"></i>
                                                Live Project
                                            </a>
                                        )}
                                        {project.githubUrl && (
                                            <a
                                                href={project.githubUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition-all duration-200 hover:border-[#4361ee] hover:bg-[#4361ee]/20 hover:text-[#4cc9f0]"
                                                style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-overlay-light)', color: 'var(--text-primary)' }}
                                            >
                                                <i className="fa-brands fa-github text-sm"></i>
                                                GitHub Repo
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
}
