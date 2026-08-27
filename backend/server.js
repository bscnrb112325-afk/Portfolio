const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');

const app = express();

const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(cors({
    origin: [frontendUrl, 'http://localhost:5173', 'http://localhost:3000'],
    credentials: true
}));
app.use(express.json());

// Serve the frontend static files automatically
app.use(express.static(path.join(__dirname, '../')));

const db = require('./database/db');

// API: Get Profile
app.get('/api/profile', (req, res) => {
    res.json({
        name: 'kelvin',
        title: 'Bachelor of Science in Computer Science and System Security'
    });
});

// API: Submit Contact / Message (Saved to Neon PostgreSQL DB)
app.post('/api/messages', async (req, res) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Please provide name, email, and message.' });
    }

    try {
        const query = `
            INSERT INTO messages (name, email, message)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;
        const result = await db.query(query, [name, email, message]);
        res.status(201).json({ success: true, message: 'Message saved successfully!', data: result.rows[0] });
    } catch (err) {
        console.error('Database query error:', err.message);
        res.status(500).json({ error: 'Failed to save message to database.' });
    }
});

// API: Fetch All Messages
app.get('/api/messages', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM messages ORDER BY created_at DESC;');
        res.json(result.rows);
    } catch (err) {
        console.error('Database query error:', err.message);
        res.status(500).json({ error: 'Failed to fetch messages.' });
    }
});

// Helper: Generate AI Response using Gemini with fallbacks
async function generateGeminiReply(prompt, systemInstruction) {
    const apiKey = process.env.AI_API_KEY;
    if (apiKey && apiKey.trim() !== '') {
        const models = ['gemini-1.5-flash', 'gemini-2.0-flash'];
        for (const model of models) {
            try {
                const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey.trim()}`;
                const response = await fetch(geminiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: systemInstruction ? `${systemInstruction}\n\nUser Question: ${prompt}` : prompt
                            }]
                        }]
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
                    if (aiText) return aiText.trim();
                }
            } catch (err) {
                console.warn(`Gemini error (${model}):`, err.message);
            }
        }
    }
    return null;
}

const KELVIN_CHAT_CONTEXT = `
You are the AI Assistant for Kelvin Kimani on his official portfolio website.
Kelvin is a Computer Science & System Security graduate (2024), Software Developer, and AI Solutions Engineer.
Key Details:
- Email: kelvinkimani513@gmail.com | Phone: 0701861965 | GitHub: https://github.com/bscnrb112325-afk | LinkedIn: Kelvin Kimani
- Tech Stack: Python, React, Node.js, Express, PostgreSQL, Drizzle ORM, REST API, AI Integration, GitHub Deployment, Tailwind CSS, SQL, Git
- Projects: Online Inventory Control System (OICS), AI Support Assistant, Enterprise LAN/WAN Security.
- Availability: Available for hire, contract, freelance, and full-time software engineering roles.

Instructions:
Reply politely, concisely, and helpfully as Kelvin's AI representative when Kelvin is offline or unavailable.
`;

// API: Send chat message & get reply (Gemini AI auto-reply or real message)
app.post('/api/chat/send', async (req, res) => {
    const { sessionId, senderName, message, enableAiAutoReply = true } = req.body;
    if (!sessionId || !message) {
        return res.status(400).json({ error: 'sessionId and message are required' });
    }

    try {
        // 1. Save user message to Neon DB
        const userInsert = `
            INSERT INTO chat_messages (session_id, sender, sender_name, message, is_admin_reply)
            VALUES ($1, 'user', $2, $3, FALSE)
            RETURNING *;
        `;
        const userResult = await db.query(userInsert, [sessionId, senderName || 'Visitor', message]);

        let aiReplyObj = null;

        // 2. If AI Auto-Reply is enabled, generate Gemini response
        if (enableAiAutoReply) {
            let aiText = await generateGeminiReply(message, KELVIN_CHAT_CONTEXT);

            if (!aiText) {
                const lower = message.toLowerCase();
                if (lower.includes('project') || lower.includes('oics')) {
                    aiText = "Kelvin developed the Online Inventory Control System (OICS) with React, Node.js, Express, PostgreSQL, and Drizzle ORM, along with AI support workflows.";
                } else if (lower.includes('contact') || lower.includes('hire') || lower.includes('email') || lower.includes('phone')) {
                    aiText = "You can contact Kelvin directly at kelvinkimani513@gmail.com or 0701861965. He is available for work!";
                } else if (lower.includes('skill') || lower.includes('stack')) {
                    aiText = "Kelvin's core stack includes Python, React, Node.js, Express, PostgreSQL, Drizzle ORM, REST APIs, AI Integration, and GitHub Deployment.";
                } else {
                    aiText = "Thanks for reaching out! Kelvin received your message and will reply soon. In the meantime, I'm his AI assistant — let me know if you have questions about his projects, background, or availability!";
                }
            }

            // Save AI reply to DB
            const aiInsert = `
                INSERT INTO chat_messages (session_id, sender, sender_name, message, is_admin_reply)
                VALUES ($1, 'gemini', 'Kelvin AI (Gemini)', $2, FALSE)
                RETURNING *;
            `;
            const aiResult = await db.query(aiInsert, [sessionId, aiText]);
            aiReplyObj = aiResult.rows[0];
        }

        res.json({
            success: true,
            userMessage: userResult.rows[0],
            aiReply: aiReplyObj
        });
    } catch (err) {
        console.error('Chat send error:', err.message);
        res.status(500).json({ error: 'Failed to process message' });
    }
});

// API: Get messages for a specific session
app.get('/api/chat/messages', async (req, res) => {
    const { sessionId } = req.query;
    if (!sessionId) {
        return res.status(400).json({ error: 'sessionId parameter is required' });
    }

    try {
        const result = await db.query(
            'SELECT * FROM chat_messages WHERE session_id = $1 ORDER BY created_at ASC;',
            [sessionId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Fetch chat messages error:', err.message);
        res.status(500).json({ error: 'Failed to fetch chat history' });
    }
});

// API: Admin (Kelvin) gets all active chat sessions / conversations
app.get('/api/chat/admin/conversations', async (req, res) => {
    try {
        const query = `
            SELECT session_id,
                   MAX(created_at) as last_activity,
                   COUNT(*) as message_count,
                   (SELECT sender_name FROM chat_messages m2 WHERE m2.session_id = m1.session_id AND sender = 'user' ORDER BY created_at DESC LIMIT 1) as visitor_name,
                   (SELECT message FROM chat_messages m3 WHERE m3.session_id = m1.session_id ORDER BY created_at DESC LIMIT 1) as last_message,
                   (SELECT sender FROM chat_messages m4 WHERE m4.session_id = m1.session_id ORDER BY created_at DESC LIMIT 1) as last_sender
            FROM chat_messages m1
            GROUP BY session_id
            ORDER BY last_activity DESC;
        `;
        const result = await db.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error('Fetch conversations error:', err.message);
        res.status(500).json({ error: 'Failed to fetch conversations' });
    }
});

// API: Admin (Kelvin) sends a real reply directly to a visitor
app.post('/api/chat/admin/reply', async (req, res) => {
    const { sessionId, message } = req.body;
    if (!sessionId || !message) {
        return res.status(400).json({ error: 'sessionId and message are required' });
    }

    try {
        const query = `
            INSERT INTO chat_messages (session_id, sender, sender_name, message, is_admin_reply)
            VALUES ($1, 'kelvin', 'Kelvin Kimani (Owner)', $2, TRUE)
            RETURNING *;
        `;
        const result = await db.query(query, [sessionId, message]);
        res.json({ success: true, reply: result.rows[0] });
    } catch (err) {
        console.error('Admin reply error:', err.message);
        res.status(500).json({ error: 'Failed to send admin reply' });
    }
});

// API: Fetch All Posts (With Auto-Seed If Empty & Comment Count)
app.get('/api/posts', async (req, res) => {
    try {
        const query = `
            SELECT posts.*, 
                   COALESCE((SELECT COUNT(*) FROM post_comments WHERE post_comments.post_id = posts.id), 0) as comment_count
            FROM posts 
            ORDER BY created_at DESC;
        `;
        let result = await db.query(query);
        
        // Auto-seed sample posts if empty
        if (result.rows.length === 0) {
            const seedQuery = `
                INSERT INTO posts (title, category, read_time, image_url, content, tags, author, likes)
                VALUES 
                ('Building the Online Inventory Control System (OICS) with React & PostgreSQL', 
                 'Software Engineering', 
                 '4 min read', 
                 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
                 'In this post, I break down the architectural decisions behind designing and deploying the Online Inventory Control System (OICS). We explore using React, Node.js, Express, and PostgreSQL with Drizzle ORM to build role-based access control, realtime stock management, and reliable sales pipelines.', 
                 'React, Node.js, PostgreSQL, Drizzle ORM, REST API', 
                 'Kelvin Kimani', 
                 15),
                ('Enterprise Network Security: Lessons from Maintaining 99.9% Uptime in Hospital LAN/WANs', 
                 'System Security', 
                 '5 min read', 
                 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
                 'Maintaining critical network infrastructure requires redundant routing, aggressive firewall rules, proactive VLAN segmentation, and automated backup strategies. Here are practical security methodologies I implemented to achieve high availability and data integrity.', 
                 'Networking, Cybersecurity, LAN/WAN, System Administration', 
                 'Kelvin Kimani', 
                 21),
                ('Integrating Google Gemini AI into Modern Full-Stack Web Applications', 
                 'Artificial Intelligence', 
                 '3 min read', 
                 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80',
                 'Generative AI is changing how software interacts with users. In this article, I walk through connecting Google Gemini 1.5/2.0 Flash APIs with Node.js backends to power dynamic resume builders, smart assistants, and automated context-aware chat workflows.', 
                 'Python, AI, Google Gemini, API Integration, Automation', 
                 'Kelvin Kimani', 
                 28)
                RETURNING *;
            `;
            await db.query(seedQuery);
            result = await db.query(query);
        }

        res.json(result.rows);
    } catch (err) {
        console.error('Fetch posts error:', err.message);
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});

// API: Create a New Post (with Image URL)
app.post('/api/posts', async (req, res) => {
    const { title, category, read_time, image_url, content, tags, author } = req.body;
    if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
    }

    try {
        const query = `
            INSERT INTO posts (title, category, read_time, image_url, content, tags, author, likes)
            VALUES ($1, $2, $3, $4, $5, $6, $7, 0)
            RETURNING *;
        `;
        const result = await db.query(query, [
            title, 
            category || 'Software & AI', 
            read_time || '3 min read', 
            image_url || '',
            content, 
            tags || 'General', 
            author || 'Kelvin Kimani'
        ]);
        res.status(201).json({ success: true, post: result.rows[0] });
    } catch (err) {
        console.error('Create post error:', err.message);
        res.status(500).json({ error: 'Failed to create post' });
    }
});

// API: Like a Post
app.post('/api/posts/:id/like', async (req, res) => {
    const postId = req.params.id;
    try {
        const result = await db.query(
            'UPDATE posts SET likes = likes + 1 WHERE id = $1 RETURNING *;',
            [postId]
        );
        res.json({ success: true, post: result.rows[0] });
    } catch (err) {
        console.error('Like post error:', err.message);
        res.status(500).json({ error: 'Failed to like post' });
    }
});

// API: Get Comments for a Post
app.get('/api/posts/:id/comments', async (req, res) => {
    const postId = req.params.id;
    try {
        const result = await db.query(
            'SELECT * FROM post_comments WHERE post_id = $1 ORDER BY created_at ASC;',
            [postId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Fetch comments error:', err.message);
        res.status(500).json({ error: 'Failed to fetch comments' });
    }
});

// API: Add a Comment to a Post
app.post('/api/posts/:id/comments', async (req, res) => {
    const postId = req.params.id;
    const { author, comment } = req.body;
    if (!comment || !comment.trim()) {
        return res.status(400).json({ error: 'Comment text is required' });
    }

    try {
        const query = `
            INSERT INTO post_comments (post_id, author, comment)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;
        const result = await db.query(query, [postId, author || 'Visitor', comment.trim()]);
        res.status(201).json({ success: true, comment: result.rows[0] });
    } catch (err) {
        console.error('Add comment error:', err.message);
        res.status(500).json({ error: 'Failed to add comment' });
    }
});

// Any other route should serve the frontend index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));
