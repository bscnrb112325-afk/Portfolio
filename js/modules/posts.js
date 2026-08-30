/**
 * Module 7: POSTS & ARTICLES (with Images, Comments & Likes)
 * Full interactive engineering blog with:
 * - Post cover images (Device upload, URL input, and 1-click curated tech presets)
 * - Live likes stored in Neon DB
 * - Live comments reader & submission modal stored in Neon DB
 * - Google Gemini AI Post drafting helper with auto-image selection
 */

let allPosts = [];
let activeCategory = 'All';
let activeReadingPost = null;
let currentSelectedImage = '';

// Curated Tech Cover Presets
const IMAGE_PRESETS = [
    { label: '💻 React & Code', url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80' },
    { label: '🛡️ Cyber Security', url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80' },
    { label: '🤖 AI & Neural', url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80' },
    { label: '☁️ Cloud & DevOps', url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80' },
    { label: '🗄️ PostgreSQL DB', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80' }
];

// Initial Fallback Sample Posts (with pre-packaged sample comments)
const FALLBACK_POSTS = [
    {
        id: 1,
        title: 'Building the Online Inventory Control System (OICS) with React & PostgreSQL',
        category: 'Software Engineering',
        read_time: '4 min read',
        image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
        content: 'In this post, I break down the architectural decisions behind designing and deploying the Online Inventory Control System (OICS). We explore using React, Node.js, Express, and PostgreSQL with Drizzle ORM to build role-based access control, realtime stock management, and reliable sales pipelines.\n\nKey takeaways include:\n• Designing normalized relational schemas for high write throughput.\n• Implementing atomic transactions to prevent double-spending in inventory movements.\n• Setting up AI-assisted inventory anomaly detection with Google Gemini APIs.',
        tags: 'React, Node.js, PostgreSQL, Drizzle ORM, REST API',
        author: 'Kelvin Kimani',
        likes: 18,
        comment_count: 2,
        created_at: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
        id: 2,
        title: 'Enterprise Network Security: Lessons from Maintaining 99.9% Uptime in Hospital LAN/WANs',
        category: 'System Security',
        read_time: '5 min read',
        image_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
        content: 'Maintaining critical network infrastructure requires redundant routing, aggressive firewall rules, proactive VLAN segmentation, and automated backup strategies. Here are practical security methodologies I implemented to achieve high availability and data integrity.\n\n• Segmenting clinical diagnostic gear from guest WiFi via 802.1Q VLANs.\n• Implementing automated failover between dual ISP uplinks with BGP.\n• Hardening switch ports with 802.1X Network Access Control (NAC).',
        tags: 'Networking, Cybersecurity, LAN/WAN, System Administration',
        author: 'Kelvin Kimani',
        likes: 24,
        comment_count: 1,
        created_at: new Date(Date.now() - 86400000 * 4).toISOString()
    },
    {
        id: 3,
        title: 'Integrating Google Gemini AI into Modern Full-Stack Web Applications',
        category: 'Artificial Intelligence',
        read_time: '3 min read',
        image_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80',
        content: 'Generative AI is changing how software interacts with users. In this article, I walk through connecting Google Gemini 1.5/2.0 Flash APIs with Node.js backends to power dynamic resume builders, smart assistants, and automated context-aware chat workflows.\n\nBy leveraging structured prompt engineering and streaming responses, we deliver sub-second latency while keeping API tokens low and costs minimal.',
        tags: 'Python, AI, Google Gemini, API Integration, Automation',
        author: 'Kelvin Kimani',
        likes: 31,
        comment_count: 0,
        created_at: new Date(Date.now() - 86400000 * 6).toISOString()
    }
];

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
                    <p style="color: var(--text-secondary);">Technical deep dives, architectural lessons, and project updates with live interactive comments.</p>
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
                    <p>Loading posts from database...</p>
                </div>
            </div>

            <!-- CREATE POST MODAL -->
            <div id="create-post-modal" class="post-modal" style="display: none;">
                <div class="post-modal-content glass-card" style="max-width: 700px; max-height: 90vh; overflow-y: auto;">
                    <div class="post-modal-header">
                        <h3 style="margin: 0; font-size: 1.15rem; color: #fff;"><i class="fa-solid fa-pen-nib" style="color: var(--accent-color); margin-right: 8px;"></i>Create New Tech Post</h3>
                        <button id="btn-close-post-modal" class="post-close-btn">&times;</button>
                    </div>

                    <!-- Gemini Assistant for Posts -->
                    <div style="background: rgba(76, 201, 240, 0.07); border: 1px solid rgba(76, 201, 240, 0.2); border-radius: 12px; padding: 0.8rem 1rem; margin-bottom: 1.2rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
                        <span style="font-size: 0.82rem; color: var(--accent-color); font-weight: 500;">
                            <i class="fa-solid fa-sparkles"></i> Want Gemini AI to draft this article & pick a cover image for you?
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

                        <!-- Enhanced Image Upload & Selector Section -->
                        <div class="cv-field" style="background: rgba(255, 255, 255, 0.025); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 1rem;">
                            <label style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.6rem;">
                                <span style="font-weight: 600; color: #fff; display: flex; align-items: center; gap: 6px;">
                                    <i class="fa-solid fa-image" style="color: var(--accent-color);"></i> Cover Image
                                </span>
                                <span style="font-size: 0.75rem; color: var(--text-secondary);">Upload file, enter URL, or select a preset</span>
                            </label>

                            <!-- Image Action Row: Upload file button or URL input -->
                            <div style="display: flex; gap: 0.6rem; margin-bottom: 0.8rem; flex-wrap: wrap;">
                                <label for="post-file-input" class="ai-feat-btn" style="cursor: pointer; padding: 0.5rem 0.9rem; font-size: 0.82rem; display: inline-flex; align-items: center; gap: 0.4rem; background: rgba(76, 201, 240, 0.15); border: 1px solid rgba(76, 201, 240, 0.3); color: var(--accent-color);">
                                    <i class="fa-solid fa-cloud-arrow-up"></i> Upload From Device
                                    <input type="file" id="post-file-input" accept="image/*" style="display: none;">
                                </label>
                                <div style="flex: 1; min-width: 220px;">
                                    <input type="url" id="post-image-url" placeholder="Or paste image URL (https://...)" style="width: 100%; padding: 0.5rem 0.8rem; border-radius: 8px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.12); color:#fff; font-size: 0.82rem;">
                                </div>
                            </div>

                            <!-- Curated Presets Bar -->
                            <div style="margin-bottom: 0.8rem;">
                                <div style="font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 0.4rem;">Quick Presets:</div>
                                <div style="display: flex; gap: 0.4rem; flex-wrap: wrap;">
                                    ${IMAGE_PRESETS.map((p, idx) => `
                                        <button type="button" class="post-img-preset-btn" data-url="${p.url}" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; padding: 0.25rem 0.6rem; font-size: 0.75rem; color: #cbd5e1; cursor: pointer; transition: all 0.2s ease;">
                                            ${p.label}
                                        </button>
                                    `).join('')}
                                </div>
                            </div>

                            <!-- Live Image Preview Box -->
                            <div id="post-image-preview-container" style="display: none; position: relative; margin-top: 0.6rem; border-radius: 10px; overflow: hidden; border: 1px solid rgba(255,255,255,0.15); max-height: 200px;">
                                <img id="post-image-preview" src="" alt="Cover Preview" style="width: 100%; height: 180px; object-fit: cover; display: block;">
                                <button type="button" id="btn-remove-post-image" style="position: absolute; top: 8px; right: 8px; background: rgba(0,0,0,0.7); border: 1px solid rgba(255,255,255,0.2); color: #ff6b6b; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 0.85rem;" title="Remove image">
                                    <i class="fa-solid fa-xmark"></i>
                                </button>
                            </div>
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
                            <button type="submit" class="btn-primary" id="btn-submit-post" style="padding: 0.6rem 1.4rem;">Publish Post</button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- POST DETAILS & COMMENTS MODAL -->
            <div id="read-post-modal" class="post-modal" style="display: none;">
                <div class="post-modal-content glass-card" style="max-width: 780px;">
                    <div class="post-modal-header">
                        <span id="read-post-category" class="post-category-badge">Category</span>
                        <button id="btn-close-read-modal" class="post-close-btn">&times;</button>
                    </div>

                    <!-- Post Detail View -->
                    <div id="read-post-body">
                        <!-- Content inserted dynamically -->
                    </div>

                    <!-- Comments Section -->
                    <div class="post-comments-wrapper" style="margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid rgba(255, 255, 255, 0.12);">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.2rem;">
                            <h4 style="color: #fff; margin: 0; font-size: 1.1rem; display: flex; align-items: center; gap: 0.6rem;">
                                <i class="fa-solid fa-comments" style="color: var(--accent-color);"></i>
                                Discussion (<span id="read-comments-count">0</span>)
                            </h4>
                            <span style="font-size: 0.78rem; color: var(--text-secondary);">Join the conversation</span>
                        </div>

                        <!-- Add Comment Form -->
                        <form id="add-comment-form" style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 14px; padding: 1.1rem; margin-bottom: 1.8rem;">
                            <div style="display: grid; grid-template-columns: 1fr; gap: 0.8rem; margin-bottom: 0.8rem;">
                                <div style="display: flex; gap: 0.8rem; flex-wrap: wrap;">
                                    <div style="flex: 1; min-width: 200px;">
                                        <label style="display: block; font-size: 0.78rem; color: var(--text-secondary); margin-bottom: 0.3rem;">Your Name / Handle</label>
                                        <input type="text" id="comment-author" placeholder="e.g. Alex Rivera" style="width: 100%; padding: 0.6rem 0.9rem; border-radius: 8px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.15); color:#fff; font-size: 0.88rem;" required>
                                    </div>
                                </div>
                                <div>
                                    <label style="display: block; font-size: 0.78rem; color: var(--text-secondary); margin-bottom: 0.3rem;">Comment or Question</label>
                                    <textarea id="comment-text" placeholder="Share your feedback, question, or architectural thoughts on this post..." rows="3" style="width: 100%; padding: 0.7rem 0.9rem; border-radius: 8px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.15); color:#fff; font-size: 0.88rem; resize: vertical; line-height: 1.5;" required></textarea>
                                </div>
                            </div>
                            
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <div id="comment-status-msg" style="font-size: 0.8rem; color: var(--accent-color); transition: opacity 0.3s ease;"></div>
                                <button type="submit" id="btn-post-comment" class="btn-primary" style="padding: 0.5rem 1.3rem; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 0.5rem;">
                                    <i class="fa-solid fa-paper-plane"></i> Post Comment
                                </button>
                            </div>
                        </form>

                        <!-- Comments List -->
                        <div id="post-comments-list" style="display: flex; flex-direction: column; gap: 0.9rem; max-height: 340px; overflow-y: auto; padding-right: 4px;">
                            <p style="color: var(--text-secondary); font-size: 0.85rem; text-align: center; padding: 1rem;">Loading comments...</p>
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
    const commentAuthorInput = document.getElementById('comment-author');

    // Image upload and preview elements
    const fileInput = document.getElementById('post-file-input');
    const urlInput = document.getElementById('post-image-url');
    const previewContainer = document.getElementById('post-image-preview-container');
    const previewImg = document.getElementById('post-image-preview');
    const removeImgBtn = document.getElementById('btn-remove-post-image');

    // Set & update image preview
    function setImagePreview(url) {
        currentSelectedImage = url || '';
        if (urlInput) urlInput.value = url.startsWith('data:') ? '(Image file uploaded)' : url;
        if (previewImg && previewContainer) {
            if (url) {
                previewImg.src = url;
                previewContainer.style.display = 'block';
            } else {
                previewImg.src = '';
                previewContainer.style.display = 'none';
            }
        }
    }

    // Handle local file upload
    fileInput?.addEventListener('change', (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 8 * 1024 * 1024) {
            alert('File is too large. Please select an image under 8MB.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (loadEvent) => {
            const dataUrl = loadEvent.target?.result;
            if (dataUrl) setImagePreview(dataUrl);
        };
        reader.readAsDataURL(file);
    });

    // Handle manual URL input
    urlInput?.addEventListener('input', () => {
        const val = urlInput.value.trim();
        if (val && !val.startsWith('(Image file')) {
            setImagePreview(val);
        }
    });

    // Handle curated preset buttons
    document.querySelectorAll('.post-img-preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const url = btn.getAttribute('data-url');
            if (url) {
                setImagePreview(url);
                document.querySelectorAll('.post-img-preset-btn').forEach(b => b.style.borderColor = 'rgba(255,255,255,0.1)');
                btn.style.borderColor = 'var(--accent-color)';
                btn.style.background = 'rgba(76, 201, 240, 0.15)';
            }
        });
    });

    // Handle remove image
    removeImgBtn?.addEventListener('click', () => {
        setImagePreview('');
        if (fileInput) fileInput.value = '';
        if (urlInput) urlInput.value = '';
    });

    // Restore saved visitor name from previous sessions
    const savedAuthor = localStorage.getItem('portfolio_comment_author');
    if (savedAuthor && commentAuthorInput) {
        commentAuthorInput.value = savedAuthor;
    }

    // ── Local Fallback Comment Storage Helper ──
    function getLocalComments(postId) {
        try {
            const raw = localStorage.getItem(`post_comments_${postId}`);
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            return null;
        }
    }

    function saveLocalComment(postId, commentObj) {
        try {
            const existing = getLocalComments(postId) || [];
            existing.push(commentObj);
            localStorage.setItem(`post_comments_${postId}`, JSON.stringify(existing));
            return existing;
        } catch (e) {
            return [];
        }
    }

    // Default sample comments for fallback posts
    const DEFAULT_COMMENTS_MAP = {
        1: [
            {
                id: 101,
                author: 'Alex Rivera',
                comment: 'Great breakdown of the PostgreSQL + Drizzle architecture! How do you handle migrations during active zero-downtime deployments?',
                created_at: new Date(Date.now() - 86400000).toISOString()
            },
            {
                id: 102,
                author: 'David Mwangi',
                comment: 'Really like the focus on atomic inventory transactions. Very clean and scalable approach, Kelvin!',
                created_at: new Date(Date.now() - 43200000).toISOString()
            }
        ],
        2: [
            {
                id: 201,
                author: 'Sarah Chen',
                comment: 'Hospital networks are tough with all the legacy diagnostic hardware. 802.1Q VLAN segmentation is definitely the way to go.',
                created_at: new Date(Date.now() - 86400000 * 2).toISOString()
            }
        ]
    };

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
            console.warn('Posts API offline, rendering default posts with local sync');
            renderFallbackPosts();
        }
    }

    function renderFallbackPosts() {
        // Merge with local changes if any
        allPosts = FALLBACK_POSTS.map(p => {
            const localComments = getLocalComments(p.id) || [];
            const defaultComments = DEFAULT_COMMENTS_MAP[p.id] || [];
            const totalCount = defaultComments.length + localComments.length;
            return {
                ...p,
                comment_count: Math.max(p.comment_count || 0, totalCount)
            };
        });
        renderPostsGrid();
    }

    function renderPostsGrid() {
        if (!grid) return;

        const filtered = activeCategory === 'All'
            ? allPosts
            : allPosts.filter(p => (p.category || '').toLowerCase() === activeCategory.toLowerCase());

        if (filtered.length === 0) {
            grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 3rem 1rem; color: var(--text-secondary); background: rgba(255,255,255,0.02); border-radius: 16px; border: 1px dashed rgba(255,255,255,0.1);">
                <i class="fa-regular fa-folder-open" style="font-size: 2rem; color: var(--accent-color); margin-bottom: 0.8rem; display: block;"></i>
                <p>No posts in the <strong>${activeCategory}</strong> category yet.</p>
                <button class="btn-primary" style="margin-top: 1rem; font-size: 0.85rem; padding: 0.45rem 1.1rem;" onclick="document.getElementById('btn-open-create-post').click()">Create First Post</button>
            </div>`;
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
                            <button class="post-comment-btn" data-id="${post.id}" title="Read & Add Comments" style="cursor: pointer;">
                                <i class="fa-regular fa-comment"></i> <span class="comment-count-badge">${post.comment_count || 0}</span>
                            </button>
                            <button class="post-like-btn" data-id="${post.id}" title="Like this post" style="cursor: pointer;">
                                <i class="fa-regular fa-heart"></i> <span>${post.likes || 0}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </article>
            `;
        }).join('');
    }

    // ── Grid Event Delegation (Likes, Comments & Open Article) ──
    grid?.addEventListener('click', async (e) => {
        const likeBtn = e.target.closest('.post-like-btn');
        const commentBtn = e.target.closest('.post-comment-btn');
        const titleEl = e.target.closest('.clickable-post-title');
        const cardImg = e.target.closest('.post-card-img');

        if (likeBtn) {
            e.stopPropagation();
            const id = likeBtn.getAttribute('data-id');
            const span = likeBtn.querySelector('span');
            const heart = likeBtn.querySelector('i');
            if (span) {
                span.textContent = parseInt(span.textContent || '0') + 1;
                heart.className = 'fa-solid fa-heart';
                heart.style.color = '#e74c3c';
            }
            try {
                await fetch(`http://localhost:3000/api/posts/${id}/like`, { method: 'POST' });
            } catch (err) {
                console.log('Like registered');
            }
            return;
        }

        if (commentBtn || titleEl || cardImg) {
            e.stopPropagation();
            const target = commentBtn || titleEl || cardImg.closest('.post-card');
            const id = target.getAttribute('data-id');
            const post = allPosts.find(p => String(p.id) === String(id));
            if (post) openReadPostModal(post);
            return;
        }
    });

    // ── Helper: Author Avatar Color & Initial ──
    function getAuthorBadge(name) {
        const initial = (name || 'V').charAt(0).toUpperCase();
        const colors = [
            'linear-gradient(135deg, #4cc9f0, #4361ee)',
            'linear-gradient(135deg, #7209b7, #3a0ca3)',
            'linear-gradient(135deg, #f72585, #b5179e)',
            'linear-gradient(135deg, #06d6a0, #118ab2)',
            'linear-gradient(135deg, #f8961e, #f3722c)'
        ];
        let hash = 0;
        for (let i = 0; i < (name || '').length; i++) hash += name.charCodeAt(i);
        const bg = colors[Math.abs(hash) % colors.length];

        return `<div style="width: 32px; height: 32px; border-radius: 50%; background: ${bg}; color: #fff; font-weight: 700; font-size: 0.85rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 2px 6px rgba(0,0,0,0.3);">${initial}</div>`;
    }

    // ── Helper: Format Time Relative ──
    function formatCommentDate(dateStr) {
        if (!dateStr) return 'Just now';
        try {
            const date = new Date(dateStr);
            const now = new Date();
            const diffSeconds = Math.floor((now - date) / 1000);
            if (diffSeconds < 60) return 'Just now';
            if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
            if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h ago`;
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        } catch (e) {
            return 'Recently';
        }
    }

    // ── Open Read & Comment Modal ──
    async function openReadPostModal(post) {
        activeReadingPost = post;
        const categoryBadge = document.getElementById('read-post-category');
        const body = document.getElementById('read-post-body');
        const commentsCount = document.getElementById('read-comments-count');
        const commentStatus = document.getElementById('comment-status-msg');

        if (commentStatus) commentStatus.textContent = '';
        if (categoryBadge) categoryBadge.textContent = post.category || 'Engineering';

        const dateStr = post.created_at ? new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Recent';
        const imgHtml = post.image_url ? `<img src="${post.image_url}" alt="${post.title}" style="width: 100%; max-height: 300px; object-fit: cover; border-radius: 12px; margin-bottom: 1.2rem; box-shadow: 0 8px 24px rgba(0,0,0,0.4);">` : '';

        if (body) {
            body.innerHTML = `
                ${imgHtml}
                <h2 style="font-size: 1.4rem; color: #fff; margin-bottom: 0.6rem; line-height: 1.4;">${post.title}</h2>
                <div style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 1.4rem; display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap;">
                    <span><i class="fa-solid fa-user-check" style="color: var(--accent-color); margin-right: 4px;"></i> By <strong style="color: #fff;">${post.author || 'Kelvin Kimani'}</strong></span>
                    <span>•</span>
                    <span><i class="fa-regular fa-calendar" style="margin-right: 4px;"></i> ${dateStr}</span>
                    <span>•</span>
                    <span><i class="fa-regular fa-clock" style="margin-right: 4px;"></i> ${post.read_time || '3 min read'}</span>
                </div>
                <div style="color: #e2e8f0; font-size: 0.95rem; line-height: 1.75; white-space: pre-line; background: rgba(255,255,255,0.02); padding: 1.2rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.06);">${post.content}</div>
            `;
        }

        if (commentsCount) commentsCount.textContent = post.comment_count || '0';

        if (readModal) {
            readModal.style.display = 'flex';
            const modalContent = readModal.querySelector('.post-modal-content');
            if (modalContent) modalContent.scrollTop = 0;
        }

        // Load comments for this post
        await loadComments(post.id);
    }

    async function loadComments(postId) {
        const commentsList = document.getElementById('post-comments-list');
        const commentsCount = document.getElementById('read-comments-count');
        if (!commentsList) return;

        commentsList.innerHTML = `<div style="text-align: center; padding: 1rem; color: var(--text-secondary); font-size: 0.85rem;"><i class="fa-solid fa-spinner fa-spin" style="margin-right: 6px; color: var(--accent-color);"></i> Loading comments...</div>`;

        let comments = [];

        try {
            const res = await fetch(`http://localhost:3000/api/posts/${postId}/comments`);
            if (res.ok) {
                comments = await res.json();
            } else {
                throw new Error('API offline');
            }
        } catch (err) {
            const defaults = DEFAULT_COMMENTS_MAP[postId] || [];
            const locals = getLocalComments(postId) || [];
            comments = [...defaults, ...locals];
        }

        if (commentsCount) commentsCount.textContent = comments.length;

        if (activeReadingPost && String(activeReadingPost.id) === String(postId)) {
            activeReadingPost.comment_count = comments.length;
            const cardBadge = document.querySelector(`.post-comment-btn[data-id="${postId}"] .comment-count-badge`);
            if (cardBadge) cardBadge.textContent = comments.length;
        }

        if (comments.length === 0) {
            commentsList.innerHTML = `
                <div style="text-align: center; padding: 1.5rem 1rem; background: rgba(255,255,255,0.02); border-radius: 10px; border: 1px dashed rgba(255,255,255,0.08);">
                    <i class="fa-regular fa-comment-dots" style="font-size: 1.6rem; color: var(--accent-color); margin-bottom: 0.5rem; display: block;"></i>
                    <p style="color: #cbd5e1; font-size: 0.88rem; margin: 0;">No comments yet on this article.</p>
                    <span style="color: var(--text-secondary); font-size: 0.78rem;">Be the first to share your thoughts or questions above!</span>
                </div>
            `;
            return;
        }

        commentsList.innerHTML = comments.map(c => {
            const isKelvin = (c.author || '').toLowerCase().includes('kelvin');
            return `
            <div style="padding: 0.85rem 1rem; border-radius: 12px; background: rgba(255,255,255,0.035); border: 1px solid rgba(255,255,255,0.08); display: flex; gap: 0.8rem; align-items: flex-start; transition: transform 0.2s ease;">
                ${getAuthorBadge(c.author)}
                <div style="flex: 1; min-width: 0;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.3rem; flex-wrap: wrap; gap: 0.4rem;">
                        <div style="display: flex; align-items: center; gap: 0.4rem;">
                            <strong style="color: #fff; font-size: 0.88rem;">${c.author || 'Visitor'}</strong>
                            ${isKelvin ? `<span style="font-size: 0.68rem; background: rgba(76, 201, 240, 0.15); color: var(--accent-color); padding: 0.1rem 0.4rem; border-radius: 4px; border: 1px solid rgba(76, 201, 240, 0.3);"><i class="fa-solid fa-badge-check"></i> Author</span>` : ''}
                        </div>
                        <span style="color: var(--text-secondary); font-size: 0.75rem;"><i class="fa-regular fa-clock" style="font-size: 0.7rem; margin-right: 3px;"></i>${formatCommentDate(c.created_at)}</span>
                    </div>
                    <p style="color: #cbd5e1; font-size: 0.88rem; margin: 0; line-height: 1.55; word-break: break-word; white-space: pre-line;">${c.comment}</p>
                </div>
            </div>
            `;
        }).join('');
    }

    // ── Add Comment Form Submission ──
    commentForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!activeReadingPost) return;

        const authorInput = document.getElementById('comment-author');
        const textInput = document.getElementById('comment-text');
        const submitBtn = document.getElementById('btn-post-comment');
        const statusMsg = document.getElementById('comment-status-msg');

        const author = (authorInput?.value || 'Visitor').trim();
        const comment = (textInput?.value || '').trim();

        if (!comment) return;

        localStorage.setItem('portfolio_comment_author', author);

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Posting...`;
        }
        if (statusMsg) statusMsg.textContent = '';

        let commentSaved = false;

        try {
            const res = await fetch(`http://localhost:3000/api/posts/${activeReadingPost.id}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ author, comment })
            });
            if (res.ok) {
                commentSaved = true;
            }
        } catch (err) {
            console.warn('Backend comment POST failed, caching to local database:', err);
        }

        if (!commentSaved) {
            saveLocalComment(activeReadingPost.id, {
                id: Date.now(),
                post_id: activeReadingPost.id,
                author,
                comment,
                created_at: new Date().toISOString()
            });
        }

        if (textInput) textInput.value = '';

        if (statusMsg) {
            statusMsg.innerHTML = `<i class="fa-solid fa-circle-check" style="color: #06d6a0;"></i> Comment published!`;
            setTimeout(() => { if (statusMsg) statusMsg.textContent = ''; }, 4000);
        }

        await loadComments(activeReadingPost.id);
        await loadPosts();

        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = `<i class="fa-solid fa-paper-plane"></i> Post Comment`;
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
        setImagePreview('');
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
                    
                    // Automatically assign an appropriate curated image preset if none chosen
                    if (!currentSelectedImage) {
                        const defaultImg = IMAGE_PRESETS[0].url;
                        setImagePreview(defaultImg);
                    }
                }
            }
        } catch (err) {
            if (contentInput) {
                contentInput.value = `When architecting robust applications, selecting the right tech stack is critical. Using React alongside Node.js and PostgreSQL provides both rapid frontend rendering and reliable relational data integrity. Coupled with AI automation, modern engineering workflows can achieve both speed and rock-solid stability.`;
            }
            if (!currentSelectedImage) {
                setImagePreview(IMAGE_PRESETS[0].url);
            }
        }

        aiDraftBtn.innerHTML = `<i class="fa-solid fa-wand-magic-sparkles"></i> Draft with Gemini`;
    });

    // ── Form Submit (Create Post) ──
    form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = document.getElementById('btn-submit-post');
        const title = document.getElementById('post-title')?.value || '';
        const category = document.getElementById('post-category')?.value || 'Software & AI';
        const read_time = document.getElementById('post-readtime')?.value || '3 min read';
        const tags = document.getElementById('post-tags')?.value || '';
        const content = document.getElementById('post-content')?.value || '';

        // Determine cover image (file upload / URL / preset / default)
        const image_url = currentSelectedImage || urlInput?.value?.trim() || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80';

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Publishing...`;
        }

        let postCreated = false;

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
                postCreated = true;
            }
        } catch (err) {
            console.warn('Backend post creation offline, adding to local posts:', err);
        }

        if (!postCreated) {
            const newLocalPost = {
                id: Date.now(),
                title,
                category,
                read_time,
                image_url,
                tags,
                content,
                author: 'Kelvin Kimani',
                likes: 0,
                comment_count: 0,
                created_at: new Date().toISOString()
            };
            FALLBACK_POSTS.unshift(newLocalPost);
        }

        if (modal) modal.style.display = 'none';
        form.reset();
        setImagePreview('');
        await loadPosts();

        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = `Publish Post`;
        }
    });

    loadPosts();
}
