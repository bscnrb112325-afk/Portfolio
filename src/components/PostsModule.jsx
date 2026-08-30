import React, { useState, useEffect } from 'react';

const IMAGE_PRESETS = [
    { label: '💻 React & Code', url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80' },
    { label: '🛡️ Cyber Security', url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80' },
    { label: '🤖 AI & Neural', url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80' },
    { label: '☁️ Cloud & DevOps', url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80' },
    { label: '🗄️ PostgreSQL DB', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80' }
];

export default function PostsModule() {
    const [posts, setPosts] = useState([]);
    const [activeCategory, setActiveCategory] = useState('All');
    const [loading, setLoading] = useState(true);

    // Create Modal State
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [createTitle, setCreateTitle] = useState('');
    const [createCategory, setCreateCategory] = useState('Software Engineering');
    const [createReadTime, setCreateReadTime] = useState('4 min read');
    const [createTags, setCreateTags] = useState('');
    const [createContent, setCreateContent] = useState('');
    const [selectedImage, setSelectedImage] = useState('');
    const [urlInput, setUrlInput] = useState('');
    const [aiDrafting, setAiDrafting] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Read & Comments Modal State
    const [activeReadingPost, setActiveReadingPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentsLoading, setCommentsLoading] = useState(false);
    const [commentAuthor, setCommentAuthor] = useState(localStorage.getItem('portfolio_comment_author') || 'Visitor');
    const [commentText, setCommentText] = useState('');
    const [commentPosting, setCommentPosting] = useState(false);
    const [commentStatusMsg, setCommentStatusMsg] = useState('');

    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async () => {
        try {
            const res = await fetch('/api/posts');
            if (res.ok) {
                const data = await res.json();
                setPosts(data);
            }
        } catch (err) {
            console.warn('API offline, rendering fallback posts');
        } finally {
            setLoading(false);
        }
    };

    // Like Post
    const handleLike = async (postId, e) => {
        e.stopPropagation();
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: (p.likes || 0) + 1 } : p));
        try {
            await fetch(`/api/posts/${postId}/like`, { method: 'POST' });
        } catch (e) {}
    };

    // Open Read & Comments Modal
    const handleOpenPost = async (post) => {
        setActiveReadingPost(post);
        setCommentsLoading(true);
        try {
            const res = await fetch(`/api/posts/${post.id}/comments`);
            if (res.ok) {
                const data = await res.json();
                setComments(data);
            }
        } catch (e) {
            setComments([]);
        } finally {
            setCommentsLoading(false);
        }
    };

    // Post a Comment
    const handlePostComment = async (e) => {
        e.preventDefault();
        if (!activeReadingPost || !commentText.trim()) return;

        setCommentPosting(true);
        localStorage.setItem('portfolio_comment_author', commentAuthor);

        const newComment = {
            author: commentAuthor.trim() || 'Visitor',
            comment: commentText.trim()
        };

        try {
            const res = await fetch(`/api/posts/${activeReadingPost.id}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newComment)
            });

            if (res.ok) {
                const result = await res.json();
                setComments(prev => [...prev, result.comment]);
                setCommentText('');
                setCommentStatusMsg('Comment published successfully!');
                setTimeout(() => setCommentStatusMsg(''), 4000);
                
                // Update comment count in posts list
                setPosts(prev => prev.map(p => p.id === activeReadingPost.id ? { ...p, comment_count: (p.comment_count || 0) + 1 } : p));
            }
        } catch (err) {
            console.error('Error posting comment:', err);
        } finally {
            setCommentPosting(false);
        }
    };

    // Image upload handler
    const handleFileUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const dataUrl = event.target?.result;
                if (dataUrl) {
                    setSelectedImage(dataUrl);
                    setUrlInput('(Uploaded image file)');
                }
            };
            reader.readAsDataURL(file);
        }
    };

    // Gemini AI Draft Post
    const handleAiDraftPost = async () => {
        setAiDrafting(true);
        const topic = createTitle || 'Modern Scalable Software Architecture with React, PostgreSQL and AI';
        try {
            const res = await fetch('/api/ai/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: `Write a short, high-impact 3-paragraph technical blog post on the topic: "${topic}". Focus on practical engineering insights, performance, and best practices. Return only the post body text.`
                })
            });
            if (res.ok) {
                const data = await res.json();
                if (data.text) {
                    setCreateContent(data.text.trim());
                    if (!createTitle) setCreateTitle(topic);
                    if (!createTags) setCreateTags('React, PostgreSQL, AI, Engineering');
                    if (!selectedImage) setSelectedImage(IMAGE_PRESETS[0].url);
                }
            }
        } catch (e) {
            setCreateContent(`When architecting robust applications, selecting the right tech stack is critical. Using React alongside Node.js and PostgreSQL provides both rapid frontend rendering and reliable relational data integrity. Coupled with AI automation, modern engineering workflows can achieve both speed and rock-solid stability.`);
            if (!selectedImage) setSelectedImage(IMAGE_PRESETS[0].url);
        } finally {
            setAiDrafting(false);
        }
    };

    // Submit Create Post Form
    const handleCreatePostSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const newPost = {
            title: createTitle,
            category: createCategory,
            read_time: createReadTime,
            image_url: selectedImage || urlInput || IMAGE_PRESETS[0].url,
            tags: createTags,
            content: createContent,
            author: 'Kelvin Kimani'
        };

        try {
            const res = await fetch('/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPost)
            });

            if (res.ok) {
                setShowCreateModal(false);
                setCreateTitle('');
                setCreateContent('');
                setCreateTags('');
                setSelectedImage('');
                setUrlInput('');
                await loadPosts();
            }
        } catch (err) {
            console.error('Create post error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredPosts = activeCategory === 'All'
        ? posts
        : posts.filter(p => (p.category || '').toLowerCase() === activeCategory.toLowerCase());

    const getAuthorBadge = (name) => {
        const initial = (name || 'V').charAt(0).toUpperCase();
        return (
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #4cc9f0, #4361ee)', color: '#fff', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {initial}
            </div>
        );
    };

    return (
        <section className="posts-section module-content-container" id="posts-module">
            <div className="container">

                {/* Section Header */}
                <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h2 className="section-title" style={{ marginBottom: '0.3rem' }}>
                            Engineering Posts & Insights
                        </h2>
                        <p style={{ color: 'var(--text-secondary)' }}>Technical deep dives, architectural lessons, and project updates with live interactive comments.</p>
                    </div>
                    <button className="btn-primary" onClick={() => setShowCreateModal(true)} style={{ padding: '0.55rem 1.2rem', fontSize: '0.88rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                        <i className="fa-solid fa-pen-to-square"></i> Write Post
                    </button>
                </div>

                {/* Categories Filter Bar */}
                <div className="posts-filter-bar">
                    {['All', 'Software Engineering', 'System Security', 'Artificial Intelligence'].map(cat => (
                        <button
                            key={cat}
                            className={`posts-filter-btn ${activeCategory === cat ? 'active' : ''}`}
                            onClick={() => setActiveCategory(cat)}
                        >
                            {cat === 'All' ? 'All Posts' : cat}
                        </button>
                    ))}
                </div>

                {/* Posts Grid */}
                <div id="posts-grid-container" className="posts-grid">
                    {loading ? (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '2.5rem', color: 'var(--text-secondary)' }}>
                            <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '1.5rem', color: 'var(--accent-color)', marginBottom: '0.5rem' }}></i>
                            <p>Loading posts from database...</p>
                        </div>
                    ) : filteredPosts.length === 0 ? (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                            <p>No posts in this category yet.</p>
                            <button className="btn-primary" onClick={() => setShowCreateModal(true)}>Write First Post</button>
                        </div>
                    ) : (
                        filteredPosts.map(post => (
                            <article key={post.id} className="glass-card post-card" onClick={() => handleOpenPost(post)}>
                                {post.image_url && (
                                    <div className="post-card-image-wrap">
                                        <img src={post.image_url} alt={post.title} className="post-card-img" />
                                    </div>
                                )}
                                <div className="post-card-body">
                                    <div className="post-card-top">
                                        <span className="post-category-badge">{post.category || 'Engineering'}</span>
                                        <span className="post-read-time"><i className="fa-regular fa-clock" style={{ marginRight: '4px' }}></i>{post.read_time || '3 min read'}</span>
                                    </div>
                                    <h3 className="post-card-title clickable-post-title">{post.title}</h3>
                                    <p className="post-card-preview">{post.content}</p>
                                    <div className="post-tags-container">
                                        {(post.tags || '').split(',').filter(t => t.trim()).map(t => (
                                            <span key={t} className="post-tag">{t.trim()}</span>
                                        ))}
                                    </div>
                                    <div className="post-card-footer">
                                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                                            <i className="fa-solid fa-user-pen" style={{ color: 'var(--accent-color)', marginRight: '5px' }}></i>{post.author || 'Kelvin Kimani'}
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                                            <button className="post-comment-btn" title="Read & Add Comments" onClick={(e) => { e.stopPropagation(); handleOpenPost(post); }}>
                                                <i className="fa-regular fa-comment"></i> <span>{post.comment_count || 0}</span>
                                            </button>
                                            <button className="post-like-btn" title="Like this post" onClick={(e) => handleLike(post.id, e)}>
                                                <i className="fa-regular fa-heart"></i> <span>{post.likes || 0}</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        ))
                    )}
                </div>

                {/* CREATE POST MODAL */}
                {showCreateModal && (
                    <div className="post-modal" style={{ display: 'flex' }} onClick={() => setShowCreateModal(false)}>
                        <div className="post-modal-content glass-card" style={{ maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
                            <div className="post-modal-header">
                                <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#fff' }}><i className="fa-solid fa-pen-nib" style={{ color: 'var(--accent-color)', marginRight: '8px' }}></i>Create New Tech Post</h3>
                                <button className="post-close-btn" onClick={() => setShowCreateModal(false)}>&times;</button>
                            </div>

                            {/* Gemini Assistant for Posts */}
                            <div style={{ background: 'rgba(76, 201, 240, 0.07)', border: '1px solid rgba(76, 201, 240, 0.2)', borderRadius: '12px', padding: '0.8rem 1rem', marginBottom: '1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                                <span style={{ fontSize: '0.82rem', color: 'var(--accent-color)', fontWeight: 500 }}>
                                    <i className="fa-solid fa-sparkles"></i> Want Gemini AI to draft this article for you?
                                </span>
                                <button type="button" className="ai-feat-btn" onClick={handleAiDraftPost} disabled={aiDrafting} style={{ padding: '0.35rem 0.8rem', fontSize: '0.78rem' }}>
                                    <i className="fa-solid fa-wand-magic-sparkles"></i> {aiDrafting ? 'Drafting...' : 'Draft with Gemini'}
                                </button>
                            </div>

                            <form className="post-form" onSubmit={handleCreatePostSubmit}>
                                <div className="cv-field">
                                    <label>Post Title</label>
                                    <input type="text" value={createTitle} onChange={e => setCreateTitle(e.target.value)} placeholder="e.g. Scaling PostgreSQL with Drizzle ORM in Production" required />
                                </div>

                                {/* Image Upload & Preset Section */}
                                <div className="cv-field" style={{ background: 'rgba(255, 255, 255, 0.025)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '1rem' }}>
                                    <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                                        <span style={{ fontWeight: 600, color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <i className="fa-solid fa-image" style={{ color: 'var(--accent-color)' }}></i> Cover Image
                                        </span>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Upload file, enter URL, or select a preset</span>
                                    </label>

                                    <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '0.8rem', flexWrap: 'wrap' }}>
                                        <label htmlFor="react-post-file" className="ai-feat-btn" style={{ cursor: 'pointer', padding: '0.5rem 0.9rem', fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(76, 201, 240, 0.15)', border: '1px solid rgba(76, 201, 240, 0.3)', color: 'var(--accent-color)' }}>
                                            <i className="fa-solid fa-cloud-arrow-up"></i> Upload From Device
                                            <input type="file" id="react-post-file" accept="image/*" style={{ display: 'none' }} onChange={handleFileUpload} />
                                        </label>
                                        <div style={{ flex: 1, minWidth: '220px' }}>
                                            <input type="url" value={urlInput} onChange={e => { setUrlInput(e.target.value); setSelectedImage(e.target.value); }} placeholder="Or paste image URL (https://...)" style={{ width: '100%', padding: '0.5rem 0.8rem', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.82rem' }} />
                                        </div>
                                    </div>

                                    {/* Presets */}
                                    <div style={{ marginBottom: '0.8rem' }}>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Quick Presets:</div>
                                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                                            {IMAGE_PRESETS.map(p => (
                                                <button
                                                    key={p.label}
                                                    type="button"
                                                    onClick={() => { setSelectedImage(p.url); setUrlInput(p.url); }}
                                                    style={{ background: selectedImage === p.url ? 'rgba(76, 201, 240, 0.2)' : 'rgba(255,255,255,0.05)', border: `1px solid ${selectedImage === p.url ? 'var(--accent-color)' : 'rgba(255,255,255,0.1)'}`, borderRadius: '6px', padding: '0.25rem 0.6rem', fontSize: '0.75rem', color: '#cbd5e1', cursor: 'pointer' }}
                                                >
                                                    {p.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Preview */}
                                    {selectedImage && (
                                        <div style={{ position: 'relative', marginTop: '0.6rem', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.15)', maxHeight: '200px' }}>
                                            <img src={selectedImage} alt="Cover Preview" style={{ width: '100%', height: '180px', objectFit: 'cover', display: 'block' }} />
                                            <button type="button" onClick={() => { setSelectedImage(''); setUrlInput(''); }} style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.2)', color: '#ff6b6b', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                                <i className="fa-solid fa-xmark"></i>
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                                    <div className="cv-field">
                                        <label>Category</label>
                                        <select value={createCategory} onChange={e => setCreateCategory(e.target.value)}>
                                            <option value="Software Engineering">Software Engineering</option>
                                            <option value="System Security">System Security</option>
                                            <option value="Artificial Intelligence">Artificial Intelligence</option>
                                            <option value="Cloud & DevOps">Cloud & DevOps</option>
                                        </select>
                                    </div>
                                    <div className="cv-field">
                                        <label>Read Time</label>
                                        <input type="text" value={createReadTime} onChange={e => setCreateReadTime(e.target.value)} />
                                    </div>
                                </div>

                                <div className="cv-field">
                                    <label>Tags (Comma separated)</label>
                                    <input type="text" value={createTags} onChange={e => setCreateTags(e.target.value)} placeholder="e.g. React, PostgreSQL, AI" />
                                </div>

                                <div className="cv-field">
                                    <label>Content</label>
                                    <textarea rows="5" value={createContent} onChange={e => setCreateContent(e.target.value)} placeholder="Write your technical article or insights here..." required></textarea>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '1rem' }}>
                                    <button type="button" className="cv-template-btn" onClick={() => setShowCreateModal(false)}>Cancel</button>
                                    <button type="submit" className="btn-primary" disabled={isSubmitting}>
                                        {isSubmitting ? 'Publishing...' : 'Publish Post'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* READ POST & DISCUSSION MODAL */}
                {activeReadingPost && (
                    <div className="post-modal" style={{ display: 'flex' }} onClick={() => setActiveReadingPost(null)}>
                        <div className="post-modal-content glass-card" style={{ maxWidth: '780px', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
                            <div className="post-modal-header">
                                <span className="post-category-badge">{activeReadingPost.category || 'Engineering'}</span>
                                <button className="post-close-btn" onClick={() => setActiveReadingPost(null)}>&times;</button>
                            </div>

                            {/* Post Detail Body */}
                            <div>
                                {activeReadingPost.image_url && (
                                    <img src={activeReadingPost.image_url} alt={activeReadingPost.title} style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '12px', marginBottom: '1.2rem', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }} />
                                )}
                                <h2 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '0.6rem', lineHeight: '1.4' }}>{activeReadingPost.title}</h2>
                                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1.4rem', display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                                    <span><i className="fa-solid fa-user-check" style={{ color: 'var(--accent-color)', marginRight: '4px' }}></i> By <strong style={{ color: '#fff' }}>{activeReadingPost.author || 'Kelvin Kimani'}</strong></span>
                                    <span>•</span>
                                    <span><i className="fa-regular fa-clock" style={{ marginRight: '4px' }}></i> {activeReadingPost.read_time || '3 min read'}</span>
                                </div>
                                <div style={{ color: '#e2e8f0', fontSize: '0.95rem', lineHeight: '1.75', whiteSpace: 'pre-line', background: 'rgba(255,255,255,0.02)', padding: '1.2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                                    {activeReadingPost.content}
                                </div>
                            </div>

                            {/* Comments Section */}
                            <div className="post-comments-wrapper" style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.12)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                                    <h4 style={{ color: '#fff', margin: 0, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                        <i className="fa-solid fa-comments" style={{ color: 'var(--accent-color)' }}></i>
                                        Discussion ({comments.length})
                                    </h4>
                                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Join the conversation</span>
                                </div>

                                {/* Add Comment Form */}
                                <form onSubmit={handlePostComment} style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '1.1rem', marginBottom: '1.8rem' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.8rem', marginBottom: '0.8rem' }}>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>Your Name / Handle</label>
                                            <input type="text" value={commentAuthor} onChange={e => setCommentAuthor(e.target.value)} placeholder="e.g. Alex Rivera" style={{ width: '100%', padding: '0.6rem 0.9rem', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.88rem' }} required />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>Comment or Question</label>
                                            <textarea rows="3" value={commentText} onChange={e => setCommentText(e.target.value)} placeholder="Share your feedback, architectural thoughts, or questions on this article..." style={{ width: '100%', padding: '0.7rem 0.9rem', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.88rem', resize: 'vertical', lineHeight: '1.5' }} required></textarea>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ fontSize: '0.8rem', color: '#06d6a0' }}>{commentStatusMsg}</div>
                                        <button type="submit" className="btn-primary" disabled={commentPosting} style={{ padding: '0.5rem 1.3rem', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <i className="fa-solid fa-paper-plane"></i> {commentPosting ? 'Posting...' : 'Post Comment'}
                                        </button>
                                    </div>
                                </form>

                                {/* Comments List */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', maxHeight: '340px', overflowY: 'auto', paddingRight: '4px' }}>
                                    {commentsLoading ? (
                                        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '1rem' }}>Loading comments...</p>
                                    ) : comments.length === 0 ? (
                                        <div style={{ textAlign: 'center', padding: '1.5rem 1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px dashed rgba(255,255,255,0.08)' }}>
                                            <p style={{ color: '#cbd5e1', margin: 0 }}>No comments yet on this article.</p>
                                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>Be the first to share your thoughts above!</span>
                                        </div>
                                    ) : (
                                        comments.map((c, idx) => {
                                            const isKelvin = (c.author || '').toLowerCase().includes('kelvin');
                                            return (
                                                <div key={c.id || idx} style={{ padding: '0.85rem 1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: '0.8rem', alignItems: 'flex-start' }}>
                                                    {getAuthorBadge(c.author)}
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem', flexWrap: 'wrap', gap: '0.4rem' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                                <strong style={{ color: '#fff', fontSize: '0.88rem' }}>{c.author}</strong>
                                                                {isKelvin && <span style={{ fontSize: '0.68rem', background: 'rgba(76, 201, 240, 0.15)', color: 'var(--accent-color)', padding: '0.1rem 0.4rem', borderRadius: '4px', border: '1px solid rgba(76, 201, 240, 0.3)' }}>Author</span>}
                                                            </div>
                                                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{c.created_at ? new Date(c.created_at).toLocaleDateString() : 'Recent'}</span>
                                                        </div>
                                                        <p style={{ color: '#cbd5e1', fontSize: '0.88rem', margin: 0, lineHeight: '1.55', whiteSpace: 'pre-line' }}>{c.comment}</p>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </section>
    );
}
