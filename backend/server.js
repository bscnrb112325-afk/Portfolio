const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const { eq, desc, asc, sql } = require('drizzle-orm');
const { db, messages, chatMessages, posts, postComments } = require('./database/db');

const app = express();

const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(cors({
    origin: [frontendUrl, 'http://localhost:5173', 'http://localhost:3000'],
    credentials: true
}));
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Serve the frontend static files automatically
app.use(express.static(path.join(__dirname, '../dist')));

// API: Get Profile
app.get('/api/profile', (req, res) => {
    res.json({
        name: 'kelvin',
        title: 'Bachelor of Science in Computer Science and System Security'
    });
});

// API: Submit Contact / Message (Saved via Drizzle ORM to PostgreSQL)
app.post('/api/messages', async (req, res) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Please provide name, email, and message.' });
    }

    try {
        const [savedMessage] = await db.insert(messages).values({
            name,
            email,
            message
        }).returning();

        res.status(201).json({ success: true, message: 'Message saved successfully!', data: savedMessage });
    } catch (err) {
        console.error('Drizzle ORM query error (messages):', err.message);
        res.status(500).json({ error: 'Failed to save message to database.' });
    }
});

// API: Fetch All Messages via Drizzle ORM
app.get('/api/messages', async (req, res) => {
    try {
        const allMessages = await db.select()
            .from(messages)
            .orderBy(desc(messages.created_at));

        res.json(allMessages);
    } catch (err) {
        console.error('Drizzle ORM query error (get messages):', err.message);
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

// API: Send chat message & get reply via Drizzle ORM
app.post('/api/chat/send', async (req, res) => {
    const { sessionId, senderName, message, enableAiAutoReply = true } = req.body;
    if (!sessionId || !message) {
        return res.status(400).json({ error: 'sessionId and message are required' });
    }

    try {
        // 1. Save user message via Drizzle ORM
        const [userMessage] = await db.insert(chatMessages).values({
            session_id: sessionId,
            sender: 'user',
            sender_name: senderName || 'Visitor',
            message,
            is_admin_reply: false,
        }).returning();

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

            // Save AI reply via Drizzle ORM
            const [savedAiReply] = await db.insert(chatMessages).values({
                session_id: sessionId,
                sender: 'gemini',
                sender_name: 'Kelvin AI (Gemini)',
                message: aiText,
                is_admin_reply: false,
            }).returning();

            aiReplyObj = savedAiReply;
        }

        res.json({
            success: true,
            userMessage,
            aiReply: aiReplyObj
        });
    } catch (err) {
        console.error('Chat send error via Drizzle:', err.message);
        res.status(500).json({ error: 'Failed to process message' });
    }
});

// API: Get messages for a specific session via Drizzle ORM
app.get('/api/chat/messages', async (req, res) => {
    const { sessionId } = req.query;
    if (!sessionId) {
        return res.status(400).json({ error: 'sessionId parameter is required' });
    }

    try {
        const rows = await db.select()
            .from(chatMessages)
            .where(eq(chatMessages.session_id, sessionId))
            .orderBy(asc(chatMessages.created_at));

        res.json(rows);
    } catch (err) {
        console.error('Fetch chat messages error via Drizzle:', err.message);
        res.status(500).json({ error: 'Failed to fetch chat history' });
    }
});

// API: Admin (Kelvin) gets all active chat sessions / conversations via Drizzle
app.get('/api/chat/admin/conversations', async (req, res) => {
    try {
        const result = await db.execute(sql`
            SELECT session_id,
                   MAX(created_at) as last_activity,
                   COUNT(*) as message_count,
                   (SELECT sender_name FROM chat_messages m2 WHERE m2.session_id = m1.session_id AND sender = 'user' ORDER BY created_at DESC LIMIT 1) as visitor_name,
                   (SELECT message FROM chat_messages m3 WHERE m3.session_id = m1.session_id ORDER BY created_at DESC LIMIT 1) as last_message,
                   (SELECT sender FROM chat_messages m4 WHERE m4.session_id = m1.session_id ORDER BY created_at DESC LIMIT 1) as last_sender
            FROM chat_messages m1
            GROUP BY session_id
            ORDER BY last_activity DESC;
        `);

        res.json(result.rows);
    } catch (err) {
        console.error('Fetch conversations error via Drizzle:', err.message);
        res.status(500).json({ error: 'Failed to fetch conversations' });
    }
});

// API: Admin (Kelvin) sends a real reply directly to a visitor via Drizzle ORM
app.post('/api/chat/admin/reply', async (req, res) => {
    const { sessionId, message } = req.body;
    if (!sessionId || !message) {
        return res.status(400).json({ error: 'sessionId and message are required' });
    }

    try {
        const [reply] = await db.insert(chatMessages).values({
            session_id: sessionId,
            sender: 'kelvin',
            sender_name: 'Kelvin Kimani (Owner)',
            message,
            is_admin_reply: true,
        }).returning();

        res.json({ success: true, reply });
    } catch (err) {
        console.error('Admin reply error via Drizzle:', err.message);
        res.status(500).json({ error: 'Failed to send admin reply' });
    }
});

// API: Fetch All Posts with comment_count & Auto-Seed via Drizzle ORM
app.get('/api/posts', async (req, res) => {
    try {
        const fetchPostsWithComments = async () => {
            return await db.select({
                id: posts.id,
                title: posts.title,
                category: posts.category,
                read_time: posts.read_time,
                image_url: posts.image_url,
                content: posts.content,
                tags: posts.tags,
                author: posts.author,
                likes: posts.likes,
                created_at: posts.created_at,
                comment_count: sql`COALESCE((SELECT COUNT(*) FROM post_comments WHERE post_comments.post_id = ${posts.id}), 0)::int`,
            })
            .from(posts)
            .orderBy(desc(posts.created_at));
        };

        let postList = await fetchPostsWithComments();

        // Auto-seed sample posts if empty using Drizzle ORM
        if (postList.length === 0) {
            const seededPosts = await db.insert(posts).values([
                {
                    title: 'Building the Online Inventory Control System (OICS) with React & PostgreSQL',
                    category: 'Software Engineering',
                    read_time: '4 min read',
                    image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
                    content: 'In this post, I break down the architectural decisions behind designing and deploying the Online Inventory Control System (OICS). We explore using React, Node.js, Express, and PostgreSQL with Drizzle ORM to build role-based access control, realtime stock management, and reliable sales pipelines.',
                    tags: 'React, Node.js, PostgreSQL, Drizzle ORM, REST API',
                    author: 'Kelvin Kimani',
                    likes: 15,
                },
                {
                    title: 'Enterprise Network Security: Lessons from Maintaining 99.9% Uptime in Hospital LAN/WANs',
                    category: 'System Security',
                    read_time: '5 min read',
                    image_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
                    content: 'Maintaining critical network infrastructure requires redundant routing, aggressive firewall rules, proactive VLAN segmentation, and automated backup strategies. Here are practical security methodologies I implemented to achieve high availability and data integrity.',
                    tags: 'Networking, Cybersecurity, LAN/WAN, System Administration',
                    author: 'Kelvin Kimani',
                    likes: 21,
                },
                {
                    title: 'Integrating Google Gemini AI into Modern Full-Stack Web Applications',
                    category: 'Artificial Intelligence',
                    read_time: '3 min read',
                    image_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80',
                    content: 'Generative AI is changing how software interacts with users. In this article, I walk through connecting Google Gemini 1.5/2.0 Flash APIs with Node.js backends to power dynamic resume builders, smart assistants, and automated context-aware chat workflows.',
                    tags: 'Python, AI, Google Gemini, API Integration, Automation',
                    author: 'Kelvin Kimani',
                    likes: 28,
                }
            ]).returning();

            // Seed initial comments using Drizzle ORM
            if (seededPosts.length > 0) {
                const firstId = seededPosts[0].id;
                await db.insert(postComments).values([
                    {
                        post_id: firstId,
                        author: 'Alex Rivera',
                        comment: 'Great breakdown of the PostgreSQL + Drizzle architecture! Really insightful and clean design.',
                    },
                    {
                        post_id: firstId,
                        author: 'David Mwangi',
                        comment: 'How are you handling connection pooling in production? Awesome work Kelvin.',
                    }
                ]);
            }

            postList = await fetchPostsWithComments();
        }

        res.json(postList);
    } catch (err) {
        console.error('Fetch posts error via Drizzle:', err.message);
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});

// API: Create a New Post via Drizzle ORM
app.post('/api/posts', async (req, res) => {
    const { title, category, read_time, image_url, content, tags, author } = req.body;
    if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
    }

    try {
        const [newPost] = await db.insert(posts).values({
            title,
            category: category || 'Software & AI',
            read_time: read_time || '3 min read',
            image_url: image_url || '',
            content,
            tags: tags || 'General',
            author: author || 'Kelvin Kimani',
            likes: 0,
        }).returning();

        res.status(201).json({ success: true, post: newPost });
    } catch (err) {
        console.error('Create post error via Drizzle:', err.message);
        res.status(500).json({ error: 'Failed to create post' });
    }
});

// API: Like a Post via Drizzle ORM
app.post('/api/posts/:id/like', async (req, res) => {
    const postId = parseInt(req.params.id, 10);
    if (isNaN(postId)) {
        return res.status(400).json({ error: 'Invalid post ID' });
    }

    try {
        const [updatedPost] = await db.update(posts)
            .set({ likes: sql`${posts.likes} + 1` })
            .where(eq(posts.id, postId))
            .returning();

        res.json({ success: true, post: updatedPost });
    } catch (err) {
        console.error('Like post error via Drizzle:', err.message);
        res.status(500).json({ error: 'Failed to like post' });
    }
});

// API: Get Comments for a Post via Drizzle ORM
app.get('/api/posts/:id/comments', async (req, res) => {
    const postId = parseInt(req.params.id, 10);
    if (isNaN(postId)) {
        return res.status(400).json({ error: 'Invalid post ID' });
    }

    try {
        const comments = await db.select()
            .from(postComments)
            .where(eq(postComments.post_id, postId))
            .orderBy(asc(postComments.created_at));

        res.json(comments);
    } catch (err) {
        console.error('Fetch comments error via Drizzle:', err.message);
        res.status(500).json({ error: 'Failed to fetch comments' });
    }
});

// API: Add a Comment to a Post via Drizzle ORM
app.post('/api/posts/:id/comments', async (req, res) => {
    const postId = parseInt(req.params.id, 10);
    if (isNaN(postId)) {
        return res.status(400).json({ error: 'Invalid post ID' });
    }

    const { author, comment } = req.body;
    if (!comment || !comment.trim()) {
        return res.status(400).json({ error: 'Comment text is required' });
    }

    try {
        const [newComment] = await db.insert(postComments).values({
            post_id: postId,
            author: author?.trim() || 'Visitor',
            comment: comment.trim(),
        }).returning();

        res.status(201).json({ success: true, comment: newComment });
    } catch (err) {
        console.error('Add comment error via Drizzle:', err.message);
        res.status(500).json({ error: 'Failed to add comment' });
    }
});

// API: Gemini AI Text Generation Endpoint
app.post('/api/ai/generate', async (req, res) => {
    const { prompt, systemInstruction } = req.body;
    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
    }

    try {
        const text = await generateGeminiReply(prompt, systemInstruction);
        if (text) {
            return res.json({ success: true, text, source: 'gemini' });
        }
        res.status(503).json({ error: 'AI service temporarily unavailable' });
    } catch (err) {
        console.error('AI Generate Error:', err.message);
        res.status(500).json({ error: 'Failed to generate AI response' });
    }
});

// Any other route should serve the frontend index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on port ${PORT} with Drizzle ORM`));
