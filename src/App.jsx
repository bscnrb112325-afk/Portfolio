import React, { useState } from 'react';
import TopHeader from './components/TopHeader';
import AboutModule from './components/AboutModule';
import SkillsModule from './components/SkillsModule';
import ProjectsModule from './components/ProjectsModule';
import MissionModule from './components/MissionModule';
import AICVModule from './components/AICVModule';
import PostsModule from './components/PostsModule';

export default function App() {
    const [activeModule, setActiveModule] = useState('about');

    const renderActiveModule = () => {
        switch (activeModule) {
            case 'about':
                return <AboutModule />;
            case 'skills':
                return <SkillsModule />;
            case 'projects':
                return <ProjectsModule />;
            case 'mission':
                return <MissionModule />;
            case 'aicv':
                return <AICVModule />;
            case 'post':
                return <PostsModule />;
            default:
                return <AboutModule />;
        }
    };

    return (
        <div className="portfolio-app">
            <TopHeader activeModule={activeModule} onSelectModule={setActiveModule} />
            <main id="module-display">
                <div key={activeModule} className="module-content-wrapper">
                    {renderActiveModule()}
                </div>
            </main>
        </div>
    );
}
