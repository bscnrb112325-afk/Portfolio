export const defaultCvState = {
    personal: {
        name: 'Kelvin Kimani',
        title: 'Computer Science & System Security Graduate | Software Developer',
        email: 'kelvinkimani513@gmail.com',
        phone: '0701861965',
        location: 'Nairobi, Kenya',
        github: 'https://github.com/bscnrb112325-afk',
        linkedin: 'https://www.linkedin.com/in/kelvin-kimani-a94552214/'
    },
    summary: 'Results-driven Computer Science and System Security graduate (2024) with hands-on expertise in full-stack software development, AI API integration, relational database architecture (PostgreSQL, Drizzle ORM), and enterprise network engineering. Proven record building scalable production web applications like OICS and maintaining high-availability LAN/WAN infrastructures.',
    skills: {
        technical: 'React, Node.js, Express, PostgreSQL, Drizzle ORM, Python, JavaScript, REST APIs, Tailwind CSS, SQL, Git/GitHub, Linux',
        security: 'Network Hardening, 802.1Q VLANs, Firewall Configuration, LAN/WAN Security, System Administration, Disaster Recovery',
        soft: 'Problem Solving, Analytical Thinking, Team Collaboration, Technical Documentation, Agile Delivery'
    },
    experience: [
        {
            id: 1,
            title: 'Lead Full-Stack Developer (OICS Project)',
            company: 'Online Inventory Control System',
            period: '2024 - Present',
            description: 'Designed and deployed a comprehensive inventory and sales management platform with React, Node.js, and PostgreSQL. Implemented role-based access control, atomic transaction pipelines, automated anomaly detection, and cloud deployment.'
        },
        {
            id: 2,
            title: 'Network & Systems Security Intern',
            company: 'Hospital Network Infrastructure',
            period: '2023 - 2024',
            description: 'Maintained 99.9% uptime across multi-department hospital LAN/WAN. Configured 802.1Q VLAN segmentation, hardened perimeter firewalls, and executed automated cloud backup routines.'
        }
    ],
    education: [
        {
            id: 1,
            degree: 'Bachelor of Science in Computer Science and System Security',
            school: 'University (Graduated 2024)',
            period: '2020 - 2024',
            details: 'Focus: Software Engineering, Cryptography, Distributed Systems, Network Security, Relational Databases.'
        }
    ],
    certifications: [
        { id: 1, name: 'Enterprise Network Architecture & Security', issuer: 'Industry Standard' },
        { id: 2, name: 'Full-Stack JavaScript & Modern Web Development', issuer: 'Verified' }
    ]
};
