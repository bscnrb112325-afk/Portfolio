/**
 * Module 7: POSTS & ARTICLES (with Images, Comments & Likes)
 * Full interactive engineering blog with:
 * - Post cover images
 * - Live likes stored in Neon DB
 * - Live comments reader & submission modal stored in Neon DB
 * - Google Gemini AI Post drafting helper
 */

let allPosts = [];
let activeCategory = 'All';
let activeReadingPost = null;

export function renderPosts() {
    return `
    <section class="posts-section module-content-container" id="posts-module">
        <div class="container">

            <!-- Section Header -->
            <div style="margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem;">
                <div>
                    <h2 class="section-title" style="margin-bottom: 0.3rem;">
                        Engineering Posts & Insights
                    </h2>
                    <p style="color: var(--text-secondary);">Technical deep dives, architectural lessons, and project updates with comments and likes.</p>
                </div>
                <button class="btn-primary" id="btn-open-create-post" style="padding: 0.55rem 1.2rem; font-size: 0.88rem; display: inline-flex; align-items: center; gap: 0.5rem;">
                    <i class="fa-solid fa-pen-to-square"></i> Write Post
                </button>
            </div>

            <!-- Categories Filter Bar -->
            <div class="posts-filter-bar">
                <button class="posts-filter-btn active" data-cat="All">All Posts</button>
                <button class="posts-filter-btn" data-cat="Software Engineering">Software Engineering</button>
                <button class="posts-filter-btn" data-cat="System Security">System Security</button>
                <button class="posts-filter-btn" data-cat="Artificial Intelligence">Artificial Intelligence</button>
            </div>

            <!-- Posts Grid -->
            <div id="posts-grid-container" class="posts-grid">
                <div style="grid-column: 1/-1; text-align: center; padding: 2.5rem; color: var(--text-secondary);">
                    <i class="fa-solid fa-spinner fa-spin" style="font-size: 1.5rem; color: var(--accent-color); margin-bottom: 0.5rem;"></i>
                    <p>Loading posts from Neon DB...</p>
                </div>
            </div>

            <!-- CREATE POST MODAL -->
            <div id="create-post-modal" class="post-modal" style="display: none;">
                <div class="post-modal-content glass-card">
                    <div class="post-modal-header">
                        <h3 style="margin: 0; font-size: 1.15rem; color: #fff;"><i class="fa-solid fa-pen-nib" style="color: var(--accent-color); margin-right: 8px;"></i>Create New Tech Post</h3>
                        <button id="btn-close-post-modal" class="post-close-btn">&times;</button>
                    </div>

                    <!-- Gemini Assistant for Posts -->
                    <div style="background: rgba(76, 201, 240, 0.07); border: 1px solid rgba(76, 201, 240, 0.2); border-radius: 12px; padding: 0.8rem 1rem; margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
                        <span style="font-size: 0.82rem; color: var(--accent-color); font-weight: 500;">
                            <i class="fa-solid fa-sparkles"></i> Want Gemini AI to draft this article for you?
                        </span>
                        <button type="button" class="ai-feat-btn" id="btn-ai-draft-post" style="padding: 0.35rem 0.8rem; font-size: 0.78rem;">
                            <i class="fa-solid fa-wand-magic-sparkles"></i> Draft with Gemini
                        </button>
                    </div>

                    <form id="create-post-form" class="post-form">
                        <div class="cv-field">
                            <label>Post Title</label>
                            <input type="text" id="post-title" placeholder="e.g. Scaling PostgreSQL with Drizzle ORM in Production" required>
                        </div>
                        <div class="cv-field">
                            <label>Cover Image URL (Optional)</label>
                            <input type="url" id="post-image-url" placeholder="https://images.unsplash.com/... or leave blank for auto cover">
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem;">
                            <div class="cv-field">
                                <label>Category</label>
                                <select id="post-category">
                                    <option value="Software Engineering">Software Engineering</option>
                                    <option value="System Security">System Security</option>
                                    <option value="Artificial Intelligence">Artificial Intelligence</option>
                                    <option value="Cloud & DevOps">Cloud & DevOps</option>
                                </select>
                            </div>
                            <div class="cv-field">
                                <label>Read Time</label>
                                <input type="text" id="post-readtime" value="4 min read" placeholder="e.g. 5 min read">
                            </div>
                        </div>
                        <div class="cv-field">
                            <label>Tags (Comma separated)</label>
                            <input type="text" id="post-tags" placeholder="e.g. Python, AI, React, PostgreSQL">
                        </div>
                        <div class="cv-field">
                            <label>Content</label>
                            <textarea id="post-content" style="min-height: 130px;" placeholder="Write your technical article or insights here..." required></textarea>
                        </div>
                        <div style="display: flex; justify-content: flex-end; gap: 0.8rem; margin-top: 1rem;">
                            <button type="button" id="btn-cancel-post" class="cv-template-btn">Cancel</button>
                            <button type="submit" class="btn-primary" style="padding: 0.6rem 1.4rem;">Publish Post</button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- POST DETAILS & COMMENTS MODAL -->
            <div id="read-post-modal" class="post-modal" style="display: none;">
                <div class="post-modal-content glass-card" style="max-width: 750px;">
                    <div class="post-modal-header">
                        <span id="read-post-category" class="post-category-badge">Category</span>
                        <button id="btn-close-read-modal" class="post-close-btn">&times;</button>
                    </div>

                    <!-- Post Detail View -->
                    <div id="read-post-body">
                        <!-- Content inserted dynamically -->
                    </div>

                    <!-- Comments Section -->
                    <div class="post-comments-wrapper" style="margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid rgba(255, 255, 255, 0.1);">
                        <h4 style="color: #fff; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                            <i class="fa-regular fa-comments" style="color: var(--accent-color);"></i> Comments (<span id="read-comments-count">0</span>)
                        </h4>

                        <!-- Add Comment Form -->
                        <form id="add-comment-form" style="display: flex; flex-direction: column; gap: 0.6rem; margin-bottom: 1.5rem;">
                            <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 0.6rem;">
                                <input type="text" id="comment-author" placeholder="Your Name" style="padding: 0.6rem 0.9rem; border-radius: 10px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); color:#fff;" required>
                                <input type="text" id="comment-text" placeholder="Add a comment or question..." style="padding: 0.6rem 0.9rem; border-radius: 10px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); color:#fff;" required>
                            </div>
                            <div style="text-align: right;">
                                <button type="submit" class="btn-primary" style="padding: 0.4rem 1rem; font-size: 0.82rem;">Post Comment</button>
                            </div>
                        </form>

                        <!-- Comments List -->
                        <div id="post-comments-list" style="display: flex; flex-direction: column; gap: 0.8rem; max-height: 250px; overflow-y: auto;">
                            <p style="color: var(--text-secondary); font-size: 0.85rem;">Loading comments...</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </section>
    `;
}

export function initPosts() {
    const grid = document.getElementById('posts-grid-container');
    const modal = document.getElementById('create-post-modal');
    const readModal = document.getElementById('read-post-modal');
    const openModalBtn = document.getElementById('btn-open-create-post');
    const closeModalBtn = document.getElementById('btn-close-post-modal');
    const cancelModalBtn = document.getElementById('btn-cancel-post');
    const closeReadModalBtn = document.getElementById('btn-close-read-modal');
    const form = document.getElementById('create-post-form');
    const commentForm = document.getElementById('add-comment-form');
    const aiDraftBtn = document.getElementById('btn-ai-draft-post');

    // ── Fetch Posts from Neon DB ──
    async function loadPosts() {
        try {
            const res = await fetch('http://localhost:3000/api/posts');
            if (res.ok) {
                allPosts = await res.json();
                renderPostsGrid();
            } else {
                renderFallbackPosts();
            }
        } catch (e) {
            console.warn('Posts API offline, rendering default sample posts');
            renderFallbackPosts();
        }
    }

    function renderFallbackPosts() {
        allPosts = [
            {
                id: 1,
                title: 'Building the Online Inventory Control System (OICS) with React & PostgreSQL',
                category: 'Software Engineering',
                read_time: '4 min read',
                image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
                content: 'In this post, I break down the architectural decisions behind designing and deploying the Online Inventory Control System (OICS). We explore using React, Node.js, Express, and PostgreSQL with Drizzle ORM to build role-based access control, realtime stock management, and reliable sales pipelines.',
                tags: 'React, Node.js, PostgreSQL, Drizzle ORM',
                author: 'Kelvin Kimani',
                likes: 15,
                comment_count: 3,
                created_at: new Date().toISOString()
            },
            {
                id: 2,
                title: 'Enterprise Network Security: Lessons from Maintaining 99.9% Uptime in Hospital LAN/WANs',
                category: 'System Security',
                read_time: '5 min read',
                image_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
                content: 'Maintaining critical network infrastructure requires redundant routing, aggressive firewall rules, proactive VLAN segmentation, and automated backup strategies. Here are practical security methodologies I implemented to achieve high availability and data integrity.',
                tags: 'Networking, Cybersecurity, System Administration',
                author: 'Kelvin Kimani',
                likes: 21,
                comment_count: 2,
                created_at: new Date().toISOString()
            }
        ];
        renderPostsGrid();
    }

    function renderPostsGrid() {
        if (!grid) return;

        const filtered = activeCategory === 'All'
            ? allPosts
            : allPosts.filter(p => (p.category || '').toLowerCase() === activeCategory.toLowerCase());

        if (filtered.length === 0) {
            grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: var(--text-secondary);">No posts in this category yet. Be the first to write one!</div>`;
            return;
        }

        grid.innerHTML = filtered.map(post => {
            const tagsList = (post.tags || '').split(',').filter(t => t.trim()).map(t => `<span class="post-tag">${t.trim()}</span>`).join('');
            const dateStr = post.created_at ? new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent';
            const imgHtml = post.image_url 
                ? `<div class="post-card-image-wrap"><img src="${post.image_url}" alt="${post.title}" class="post-card-img" onerror="this.parentElement.style.display='none';"></div>` 
                : '';

            return `
            <article class="glass-card post-card" data-id="${post.id}">
                ${imgHtml}
                <div class="post-card-body">
                    <div class="post-card-top">
                        <span class="post-category-badge">${post.category || 'Engineering'}</span>
                        <span class="post-read-time"><i class="fa-regular fa-clock" style="margin-right: 4px;"></i>${post.read_time || '3 min read'}</span>
                    </div>
                    <h3 class="post-card-title clickable-post-title" data-id="${post.id}">${post.title}</h3>
                    <p class="post-card-preview">${post.content}</p>
                    <div class="post-tags-container">
                        ${tagsList}
                    </div>
                    <div class="post-card-footer">
                        <div style="font-size: 0.78rem; color: var(--text-secondary);">
                            <i class="fa-solid fa-user-pen" style="color: var(--accent-color); margin-right: 5px;"></i>${post.author || 'Kelvin Kimani'} • ${dateStr}
                        </div>
                        <div style="display: flex; gap: 0.8rem; align-items: center;">
                            <button class="post-comment-btn" data-id="${post.id}" title="Read & Add Comments">
                                <i class="fa-regular fa-comment"></i> <span>${post.comment_count || 0}</span>
                            </button>
                            <button class="post-like-btn" data-id="${post.id}" title="Like this post">
                                <i class="fa-regular fa-heart"></i> <span>${post.likes || 0}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </article>
            `;
        }).join('');

        // Attach like listeners
        document.querySelectorAll('.post-like-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const id = btn.getAttribute('data-id');
                const span = btn.querySelector('span');
                const heart = btn.querySelector('i');
                if (span) {
                    span.textContent = parseInt(span.textContent || '0') + 1;
                    heart.className = 'fa-solid fa-heart';
                    heart.style.color = '#e74c3c';
                }
                try {
                    await fetch(`http://localhost:3000/api/posts/${id}/like`, { method: 'POST' });
                } catch (err) {
                    console.log('Like saved locally');
                }
            });
        });

        // Attach Read & Comments modal listeners
        document.querySelectorAll('.clickable-post-title, .post-comment-btn').forEach(el => {
            el.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(el.getAttribute('data-id'));
                const post = allPosts.find(p => p.id === id);
                if (post) openReadPostModal(post);
            });
        });
    }

    // ── Open Read & Comment Modal ──
    async function openReadPostModal(post) {
        activeReadingPost = post;
        const categoryBadge = document.getElementById('read-post-category');
        const body = document.getElementById('read-post-body');
        const commentsCount = document.getElementById('read-comments-count');

        if (categoryBadge) categoryBadge.textContent = post.category || 'Engineering';

        const dateStr = post.created_at ? new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Recent';
        const imgHtml = post.image_url ? `<img src="${post.image_url}" alt="${post.title}" style="width: 100%; max-height: 280px; object-fit: cover; border-radius: 12px; margin-bottom: 1.2rem;">` : '';

        if (body) {
            body.innerHTML = `
                ${imgHtml}
                <h2 style="font-size: 1.35rem; color: #fff; margin-bottom: 0.5rem; line-height: 1.4;">${post.title}</h2>
                <div style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 1.2rem;">
                    By <strong style="color: #fff;">${post.author || 'Kelvin Kimani'}</strong> • ${dateStr} • ${post.read_time || '3 min read'}
                </div>
                <div style="color: #ddd; font-size: 0.95rem; line-height: 1.7; white-space: pre-line;">${post.content}</div>
            `;
        }

        if (commentsCount) commentsCount.textContent = post.comment_count || '0';

        if (readModal) readModal.style.display = 'flex';

        // Load comments for this post
        await loadComments(post.id);
    }

    async function loadComments(postId) {
        const commentsList = document.getElementById('post-comments-list');
        const commentsCount = document.getElementById('read-comments-count');
        try {
            const res = await fetch(`http://localhost:3000/api/posts/${postId}/comments`);
            if (res.ok) {
                const comments = await res.json();
                if (commentsCount) commentsCount.textContent = comments.length;
                if (!commentsList) return;
                if (comments.length === 0) {
                    commentsList.innerHTML = `<p style="color: var(--text-secondary); font-size: 0.85rem;">No comments yet. Leave a thought above!</p>`;
                    return;
                }
                commentsList.innerHTML = comments.map(c => `
                    <div style="padding: 0.75rem 1rem; border-radius: 10px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.2rem;">
                            <strong style="color: var(--accent-color); font-size: 0.85rem;">${c.author}</strong>
                            <span style="color: var(--text-secondary); font-size: 0.75rem;">${new Date(c.created_at).toLocaleDateString()}</span>
                        </div>
                        <p style="color: #ccc; font-size: 0.88rem; margin: 0; line-height: 1.5;">${c.comment}</p>
                    </div>
                `).join('');
            }
        } catch (err) {
            console.error('Error fetching comments:', err);
        }
    }

    // ── Add Comment Form ──
    commentForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!activeReadingPost) return;
        const authorInput = document.getElementById('comment-author');
        const textInput = document.getElementById('comment-text');
        const author = authorInput?.value || 'Visitor';
        const comment = textInput?.value || '';
        if (!comment.trim()) return;

        try {
            const res = await fetch(`http://localhost:3000/api/posts/${activeReadingPost.id}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ author, comment })
            });
            if (res.ok) {
                if (textInput) textInput.value = '';
                await loadComments(activeReadingPost.id);
                await loadPosts();
            }
        } catch (err) {
            console.error('Error adding comment:', err);
        }
    });

    // ── Filter Buttons ──
    document.querySelectorAll('.posts-filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.posts-filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeCategory = btn.getAttribute('data-cat') || 'All';
            renderPostsGrid();
        });
    });

    // ── Modal Actions ──
    openModalBtn?.addEventListener('click', () => {
        if (modal) modal.style.display = 'flex';
    });

    closeModalBtn?.addEventListener('click', () => {
        if (modal) modal.style.display = 'none';
    });

    cancelModalBtn?.addEventListener('click', () => {
        if (modal) modal.style.display = 'none';
    });

    closeReadModalBtn?.addEventListener('click', () => {
        if (readModal) readModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
        if (e.target === readModal) readModal.style.display = 'none';
    });

    // ── Gemini AI Draft Helper ──
    aiDraftBtn?.addEventListener('click', async () => {
        const titleInput = document.getElementById('post-title');
        const contentInput = document.getElementById('post-content');
        const imgInput = document.getElementById('post-image-url');
        const tagsInput = document.getElementById('post-tags');

        const topic = titleInput?.value || 'Modern Full-Stack Architecture with React, PostgreSQL, and AI';

        aiDraftBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Gemini Drafting...`;

        try {
            const res = await fetch('http://localhost:3000/api/ai/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: `Write a short, high-impact 3-paragraph technical blog post on the topic: "${topic}". Focus on practical engineering insights, performance, and best practices. Return only the post body text.`
                })
            });

            if (res.ok) {
                const data = await res.json();
                if (data.text && contentInput) {
                    contentInput.value = data.text.trim();
                    if (!titleInput.value) titleInput.value = topic;
                    if (tagsInput && !tagsInput.value) tagsInput.value = 'Software, AI, Engineering';
                    if (imgInput && !imgInput.value) imgInput.value = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80';
                }
            }
        } catch (err) {
            if (contentInput) {
                contentInput.value = `When architecting robust applications, selecting the right tech stack is critical. Using React alongside Node.js and PostgreSQL provides both rapid frontend rendering and reliable relational data integrity. Coupled with AI automation, modern engineering workflows can achieve both speed and rock-solid stability.`;
            }
        }

        aiDraftBtn.innerHTML = `<i class="fa-solid fa-wand-magic-sparkles"></i> Draft with Gemini`;
    });

    // ── Form Submit (Create Post) ──
    form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('post-title')?.value || '';
        const category = document.getElementById('post-category')?.value || 'Software & AI';
        const read_time = document.getElementById('post-readtime')?.value || '3 min read';
        const image_url = document.getElementById('post-image-url')?.value || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80';
        const tags = document.getElementById('post-tags')?.value || '';
        const content = document.getElementById('post-content')?.value || '';

        try {
            const res = await fetch('http://localhost:3000/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    category,
                    read_time,
                    image_url,
                    tags,
                    content,
                    author: 'Kelvin Kimani'
                })
            });

            if (res.ok) {
                if (modal) modal.style.display = 'none';
                form.reset();
                await loadPosts();
            }
        } catch (err) {
            console.error('Error creating post:', err);
        }
    });

    loadPosts();
}
