import React, { useState } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import TopHeader      from './components/TopHeader';
import AboutModule    from './components/AboutModule';
import SkillsModule   from './components/SkillsModule';
import ProjectsModule from './components/ProjectsModule';
import MissionModule  from './components/MissionModule';
import AICVModule     from './components/AICVModule';
import PostsModule    from './components/PostsModule';

function AppInner() {
    const [activeModule, setActiveModule] = useState('about');
    const { isDark } = useTheme();

    const renderModule = () => {
        switch (activeModule) {
            case 'about':    return <AboutModule />;
            case 'skills':   return <SkillsModule />;
            case 'projects': return <ProjectsModule />;
            case 'mission':  return <MissionModule />;
            case 'aicv':     return <AICVModule />;
            case 'posts':
            case 'post':     return <PostsModule />;
            default:         return <AboutModule />;
        }
    };

    return (
        <div
            className="relative min-h-screen font-[Outfit,sans-serif] transition-colors duration-300"
            style={{ backgroundColor: 'var(--bg)', color: 'var(--text-primary)' }}
        >
            {/* Ambient background blobs */}
            <div className="blob blob-1 pointer-events-none"></div>
            <div className="blob blob-2 pointer-events-none"></div>

            <TopHeader activeModule={activeModule} onSelectModule={setActiveModule} />

            <main className="mx-auto max-w-300 px-6 pb-16 pt-4">
                <div
                    key={activeModule}
                    style={{ animation: 'fadeInModule 0.4s cubic-bezier(0.16,1,0.3,1) forwards' }}
                >
                    {renderModule()}
                </div>
            </main>
        </div>
    );
}

export default function App() {
    return (
        <ThemeProvider>
            <AppInner />
        </ThemeProvider>
    );
}
