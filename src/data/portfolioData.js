export const aboutData = {
    greeting: "Hi, I'm",
    name: "Kelvin Kimani",
    shortName: "Kelvin",
    location: "Nairobi, Kenya",
    roles: [
        "Full-Stack Developer",
        "Systems & Network Security",
        "Practical AI Solutions",
        "Cloud Infrastructure"
    ],
    headline: "Software Developer & Systems Builder",
    intro: "Hey there! I'm Kelvin Kimani, a software developer and systems builder based in Nairobi, Kenya. I love turning complex, messy problems into clean, intuitive web applications, helpful AI tools, and rock-solid network infrastructure.",
    story: "My journey started with a deep curiosity about how digital systems work beneath the surface — leading me to graduate with a Bachelor of Science in Computer Science and System Security. Along the way, I discovered that my real passion lies in building tools that make an immediate, tangible difference in people's daily work: from centralizing inventory for bustling local businesses to streamlining job search intelligence and safeguarding hospital networks.",
    background: "I bridge the gap between creative frontend interfaces and the robust server/network architecture behind them. Whether crafting responsive user interfaces with React, engineering microservices with Python and Node.js, designing PostgreSQL databases, or hardening networks with VLANs and firewall rules, I focus on what truly counts: reliability, security, and human-friendly design.",
    status: "Available for Work & Collaborations",
    principles: [
        {
            title: "People First",
            description: "Code only matters if it solves a real frustration for the human being using it. I design with empathy and clarity."
        },
        {
            title: "Security by Default",
            description: "Privacy, segmented access, and reliable backups aren't optional extras — they are foundational to every project I build."
        },
        {
            title: "Pragmatic AI",
            description: "I integrate LLMs and automation where they genuinely eliminate tedious work and add real productivity, not for empty buzzwords."
        },
        {
            title: "Craft & Curiosity",
            description: "From pixel-level UI details to low-level packet routing, I stay curious, test thoroughly, and constantly refine my craft."
        }
    ],
    quickFacts: [
        { label: "Location", value: "Nairobi, Kenya (UTC+3)" },
        { label: "Degree", value: "B.Sc. in Computer Science & System Security" },
        { label: "Primary Tools", value: "React, Node.js, Python, PostgreSQL, Linux" },
        { label: "Fuel", value: "Curiosity, tough bugs & Kenyan coffee" }
    ]
};

export const whatIDoData = {
    title: "What I Do",
    subtitle: "I build dependable digital products and secure systems designed to solve real operational challenges.",
    services: [
        {
            title: "Full-Stack Web Development",
            description: "Designing and building modern, responsive web applications from snappy React frontends to scalable Node.js and Python APIs backed by PostgreSQL.",
            isSpecial: true,
            highlight: "Modern & Responsive"
        },
        {
            title: "Pragmatic AI & Automation",
            description: "Integrating practical AI assistants, LLM workflows, and intelligent data extraction pipelines that eliminate hours of repetitive manual tasks.",
            isSpecial: true,
            highlight: "Intelligent Workflows"
        },
        {
            title: "Network & Systems Security",
            description: "Configuring 802.1Q VLANs, hardening firewalls, and managing server environments to ensure high uptime and ironclad data protection.",
            highlight: "Enterprise Resilient"
        },
        {
            title: "Cloud Infrastructure & Backups",
            description: "Deploying and managing containerized services, automated database snapshots, and tested disaster recovery routines so you never lose sleep over data loss.",
            highlight: "Zero Data Loss"
        },
        {
            title: "Database Architecture & APIs",
            description: "Architecting relational schemas, optimizing complex queries, and building RESTful APIs with PostgreSQL and Drizzle ORM for speed and data integrity.",
            highlight: "High Throughput"
        },
        {
            title: "Technical Consulting & Support",
            description: "Translating messy technical roadblocks into straightforward, cost-effective solutions and clear documentation for teams and founders.",
            highlight: "Clear & Practical"
        }
    ]
};

export const projectsData = {
    title: "Featured Projects",
    subtitle: "Real-world applications engineered to solve specific operational, data, and community challenges.",
    projects: [
        {
            title: "Online Inventory Control System (OICS)",
            tagline: "Centralized stock, sales, and supplier management for growing businesses.",
            description: "A production-ready inventory and sales platform designed to help store managers and warehouse teams eliminate spreadsheet chaos. It unifies stock movement tracking, sales recording, purchase order workflows, and operational reporting into an intuitive dashboard.",
            story: "Why I built this: Small businesses frequently lose revenue and hours of work to stock discrepancies and manual record-keeping errors. I built OICS to give teams a real-time, tamper-resistant command center for inventory movements, automated low-stock warnings, and instant sales analytics.",
            extraDetails: "Includes role-based permissions, automated stock alerts, atomic database transactions with PostgreSQL/Drizzle, and cloud deployment.",
            techStack: ["React", "Node.js", "Express", "PostgreSQL", "Drizzle ORM", "Tailwind CSS", "REST API"],
            category: "Full-Stack",
            isFeatured: true,
            liveUrl: "https://online-inventory-control-sy-mliso.sevalla.app/",
            githubUrl: "https://github.com/bscnrb112325-afk/ONLINE-INVENTORY-CONTROL-SYSTEM"
        },
        {
            title: "BIDIIONE",
            tagline: "Operations & materials management hub for construction teams.",
            description: "A comprehensive construction operations management system custom-built for Bidii Quality Builders. Centralizes procurement, contractor allocations, equipment tracking, and site progress reporting.",
            story: "Why I built this: Construction sites are notoriously fast-moving. Paper logs and disconnected messaging apps led to misallocated building supplies. BIDIIONE gives project leads live visibility into every bag of cement, contractor dispatch, and budget estimate.",
            extraDetails: "Built with Django ORM, PostgreSQL, and data analytics dashboards for real-time tracking of site progress and cost estimation.",
            techStack: ["Python", "Django", "PostgreSQL", "Docker", "Gunicorn", "Matplotlib", "REST API"],
            category: "Full-Stack",
            isFeatured: true,
            githubUrl: "https://github.com/bscnrb112325-afk/BIDII-ONE"
        },
        {
            title: "AgriNatura",
            tagline: "Smart agriculture platform with crop diagnostics and provenance.",
            description: "An organic agriculture ecosystem combining microservices, AI-assisted agronomy, and verifiable crop provenance from farm to consumer.",
            story: "Why I built this: Smallholder farmers often struggle with crop disease identification and fair market access. AgriNatura puts AI diagnosis directly into farmers' hands while providing consumers with transparent proof of organic cultivation.",
            extraDetails: "Features containerized microservices, AI crop disease classification, and verifiable harvest traceability records.",
            techStack: ["TypeScript", "React", "Node.js", "Python AI", "Docker", "REST API"],
            category: "Full-Stack",
            isFeatured: true,
            githubUrl: "https://github.com/bscnrb112325-afk/agrinatura"
        },
        {
            title: "BrighterMonday Web Crawler",
            tagline: "Real-time hiring intelligence and tech skill-gap analysis across Kenya.",
            description: "An automated data extraction engine and ETL pipeline that monitors, scrapes, and analyzes job postings from Kenya's leading career portal.",
            story: "Why I built this: Navigating the regional job market shouldn't require guessing what skills employers are prioritizing. I engineered this crawler to turn raw job postings into clear data on salary trends, high-demand programming frameworks, and hiring surges.",
            extraDetails: "Engineered with polite rate-limiting, proxy rotation, automatic deduplication, and Pandas analytics.",
            techStack: ["Python", "BeautifulSoup4", "Pandas", "ETL Pipeline", "Data Engineering"],
            category: "AI & Automation",
            isFeatured: true
        },
        {
            title: "AI ICT Troubleshooting Assistant",
            tagline: "24/7 conversational support agent for common tech bottlenecks.",
            description: "A context-aware AI assistant designed to help team members troubleshoot network, hardware, and operating system issues in clear, human language.",
            story: "Why I built this: Non-technical staff often get overwhelmed when their internet drops or printer configurations break. I built this assistant to provide step-by-step guidance and diagnose issues before escalating to busy IT staff.",
            extraDetails: "Integrates Google Gemini API, streaming responses, multi-turn memory, and tailored diagnostic prompts.",
            techStack: ["Gemini API", "Python", "Node.js", "Prompt Engineering", "NLP"],
            category: "AI & Automation",
            isFeatured: true
        },
        {
            title: "Productify",
            tagline: "Collaborative agile workspace for sprint backlogs and team metrics.",
            description: "A full-stack productivity and task coordination platform designed for developer and student teams to manage milestones with zero clutter.",
            story: "Why I built this: Many project management tools are either overly bloated or too bare-bones. Productify provides just the right balance of sprint tracking, task assignments, and progress analytics.",
            extraDetails: "Built with secure JWT authentication, interactive drag-and-drop boards, and PostgreSQL state management.",
            techStack: ["React", "Node.js", "Express", "PostgreSQL", "Tailwind CSS"],
            category: "Full-Stack",
            isFeatured: true,
            githubUrl: "https://github.com/bscnrb112325-afk/productify"
        },
        {
            title: "Hospital Network Infrastructure Optimization",
            tagline: "Mission-critical network reliability and VLAN segmentation for healthcare.",
            description: "Supported and optimized multi-department network operations in a busy hospital environment to ensure 99.9% uptime for medical and administrative workflows.",
            story: "Why this matters: In healthcare, network downtime isn't just an inconvenience — it delays patient triage and diagnostic reporting. I helped configure VLANs to isolate sensitive health data from general traffic and hardened edge routers.",
            techStack: ["802.1Q VLANs", "Firewall Hardening", "Cisco Routing", "System Administration"],
            category: "Networking & Systems"
        },
        {
            title: "Enterprise Cloud Backup & Disaster Recovery",
            tagline: "Automated, verified data preservation for business continuity.",
            description: "Implemented structured offsite backup pipelines and failover recovery testing to safeguard mission-critical organizational databases.",
            story: "Why this matters: A backup system is only as good as its last successful restore test. I built automated snapshot routines and recovery playbooks to protect against hardware failures and ransomware threats.",
            techStack: ["Cloud Storage", "Automated Snapshots", "Disaster Recovery", "Linux Bash"],
            category: "Cloud & Security"
        }
    ]
};

export const missionData = {
    title: "Let's Connect & Build",
    subtitle: "Have an exciting project, a role to fill, or just want to talk tech? I'd love to hear from you.",
    statement: "I believe technology only fulfills its purpose when it genuinely improves people's lives. Whether it's streamlining daily work for a small business, safeguarding critical data, or connecting communities through thoughtful software, my goal is to build digital solutions with craft, empathy, and rock-solid reliability.",
    availability: "Available for full-time engineering roles, high-impact freelance projects, and technical collaborations.",
    locationText: "Based in Nairobi, Kenya (UTC+3) · Open to remote opportunities worldwide.",
    contact: {
        name: "Kelvin Kimani",
        email: "kelvinkimani513@gmail.com",
        phone: "+254 701 861 965",
        phoneRaw: "0701861965",
        whatsappUrl: "https://wa.me/254701861965?text=Hi%20Kelvin%2C%20I%20saw%20your%20portfolio%20and%20would%20love%20to%20connect!",
        linkedin: "https://www.linkedin.com/in/kelvin-kimani-a94552214/",
        github: "https://github.com/bscnrb112325-afk"
    },
    collaborationTypes: [
        {
            title: "Full-Time Opportunities",
            desc: "Full-stack developer, software engineer, or systems/network security roles."
        },
        {
            title: "Freelance & MVPs",
            desc: "End-to-end web apps, custom inventory systems, and automated pipelines."
        },
        {
            title: "AI Integration & Workflows",
            desc: "Custom LLM assistants, scrapers, and intelligent business process automation."
        },
        {
            title: "Systems & Security Audits",
            desc: "VLAN segmentation, backup verification, and infrastructure hardening."
        }
    ]
};
