/**
 * Module 6: TWO-WAY LIVE CHAT & GEMINI AUTO-REPLY SYSTEM
 * - Visitors can send inquiries/messages stored in Neon DB
 * - Kelvin (Owner) can read visitor messages and send real human replies
 * - Google Gemini AI automatically steps in to reply when Kelvin is offline or unavailable
 */

// Generate or retrieve visitor session ID from localStorage
function getOrCreateSessionId() {
    let sid = localStorage.getItem('kelvin_portfolio_chat_sid');
    if (!sid) {
        sid = 'sess_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now();
        localStorage.setItem('kelvin_portfolio_chat_sid', sid);
    }
    return sid;
}

let currentSessionId = getOrCreateSessionId();
let currentViewMode = 'visitor'; // 'visitor' or 'admin'
let selectedAdminSession = null;
let pollInterval = null;

export function renderChat() {
    return `
    <section class="chat-section module-content-container" id="chat-module">
        <div class="container">

            <!-- Header with View Mode Switcher -->
            <div style="margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem;">
                <div>
                    <h2 class="section-title" style="margin-bottom: 0.3rem;">
                        Live Chat & Messaging
                    </h2>
                    <p style="color: var(--text-secondary);">Direct communication with Kelvin Kimani, backed by Google Gemini AI when offline.</p>
                </div>
                <div style="display: flex; gap: 0.6rem; align-items: center; flex-wrap: wrap;">
                    <button class="ai-feat-btn" id="btn-toggle-chat-mode" style="font-size: 0.82rem; padding: 0.4rem 0.9rem;">
                        <i class="fa-solid fa-user-shield"></i> <span id="chat-mode-label">Kelvin Inbox Mode</span>
                    </button>
                    <div class="cv-badge" style="background: rgba(76, 201, 240, 0.1); border: 1px solid rgba(76, 201, 240, 0.3); color: var(--accent-color); padding: 0.4rem 0.9rem; border-radius: 20px; font-size: 0.8rem;">
                        <i class="fa-solid fa-sparkles"></i> Gemini AI Backup Active
                    </div>
                </div>
            </div>

            <!-- VISITOR CHAT VIEW -->
            <div id="visitor-chat-view" class="glass-card chat-wrapper-card">
                
                <!-- Quick Prompt Suggestions -->
                <div class="chat-suggestions-bar">
                    <span style="font-size: 0.78rem; color: var(--text-secondary); margin-right: 0.4rem;">Quick ask:</span>
                    <button class="chat-prompt-chip" data-prompt="What projects has Kelvin built?">Projects built</button>
                    <button class="chat-prompt-chip" data-prompt="What is Kelvin's technical stack?">Tech Stack</button>
                    <button class="chat-prompt-chip" data-prompt="Tell me about Kelvin's System Security background">Security Background</button>
                    <button class="chat-prompt-chip" data-prompt="How can I contact or hire Kelvin?">Hire Kelvin</button>
                </div>

                <!-- Messages Window -->
                <div class="chat-messages-container" id="chat-messages-list">
                    <div class="chat-message ai-msg">
                        <div class="msg-avatar"><i class="fa-solid fa-robot"></i></div>
                        <div class="msg-bubble">
                            <span class="msg-author-badge gemini-badge">Kelvin AI (Gemini)</span>
                            <p>Hi! 👋 Welcome to Kelvin Kimani's portfolio. Send a message to get in touch directly. Kelvin or his Gemini AI assistant will reply right away!</p>
                        </div>
                    </div>
                </div>

                <!-- Input Box -->
                <form id="chat-input-form" class="chat-input-bar">
                    <input 
                        type="text" 
                        id="chat-user-input" 
                        placeholder="Type a message or inquiry..." 
                        autocomplete="off"
                        required
                    />
                    <button type="submit" id="chat-send-btn" class="chat-send-button" aria-label="Send message">
                        <i class="fa-solid fa-paper-plane"></i>
                    </button>
                </form>

            </div>

            <!-- KELVIN (OWNER / ADMIN) INBOX VIEW -->
            <div id="admin-chat-view" class="glass-card chat-admin-layout" style="display: none;">
                
                <!-- Conversations Sidebar -->
                <div class="admin-conv-sidebar">
                    <div style="padding: 0.8rem; border-bottom: 1px solid rgba(255, 255, 255, 0.08); display: flex; justify-content: space-between; align-items: center;">
                        <h4 style="margin: 0; font-size: 0.95rem; color: #fff;"><i class="fa-solid fa-inbox" style="color: var(--accent-color); margin-right: 6px;"></i> Inbox</h4>
                        <button id="btn-refresh-convs" class="ai-feat-btn" style="padding: 0.2rem 0.6rem; font-size: 0.75rem;">
                            <i class="fa-solid fa-rotate-right"></i>
                        </button>
                    </div>
                    <div id="admin-conversations-list" class="admin-conv-list">
                        <p style="padding: 1rem; color: var(--text-secondary); font-size: 0.85rem;">Loading conversations...</p>
                    </div>
                </div>

                <!-- Conversation Detail & Reply Pane -->
                <div class="admin-chat-detail">
                    <div id="admin-detail-header" style="padding: 0.8rem 1.2rem; border-bottom: 1px solid rgba(255, 255, 255, 0.08); font-size: 0.9rem; color: #fff;">
                        Select a conversation from the left to reply.
                    </div>
                    <div id="admin-messages-list" class="chat-messages-container" style="flex: 1; padding: 1.2rem;">
                        <p style="color: var(--text-secondary); font-size: 0.85rem; margin: auto;">No conversation selected</p>
                    </div>
                    <form id="admin-reply-form" class="chat-input-bar" style="padding: 0.8rem; display: none;">
                        <input 
                            type="text" 
                            id="admin-reply-input" 
                            placeholder="Reply directly as Kelvin (Owner)..." 
                            autocomplete="off"
                            required
                        />
                        <button type="submit" class="chat-send-button" style="background: #2ecc71;">
                            <i class="fa-solid fa-paper-plane"></i>
                        </button>
                    </form>
                </div>

            </div>

        </div>
    </section>
    `;
}

// ──────────────────────────────────────────────
//  Init & Event Handlers
// ──────────────────────────────────────────────
export function initChat() {
    const form = document.getElementById('chat-input-form');
    const input = document.getElementById('chat-user-input');
    const messagesContainer = document.getElementById('chat-messages-list');
    const toggleModeBtn = document.getElementById('btn-toggle-chat-mode');
    const modeLabel = document.getElementById('chat-mode-label');
    const visitorView = document.getElementById('visitor-chat-view');
    const adminView = document.getElementById('admin-chat-view');

    function scrollToBottom(container) {
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }

    // ── Fetch & render visitor chat messages ──
    async function loadVisitorMessages() {
        try {
            const res = await fetch(`http://localhost:3000/api/chat/messages?sessionId=${currentSessionId}`);
            if (res.ok) {
                const msgs = await res.json();
                if (msgs && msgs.length > 0 && messagesContainer) {
                    messagesContainer.innerHTML = msgs.map(m => {
                        const isUser = m.sender === 'user';
                        const isKelvin = m.sender === 'kelvin';
                        const badgeClass = isKelvin ? 'kelvin-badge' : 'gemini-badge';
                        const authorLabel = isKelvin ? 'Kelvin Kimani (Owner)' : (isUser ? 'You' : 'Kelvin AI (Gemini)');
                        const avatarIcon = isUser ? 'fa-user' : (isKelvin ? 'fa-user-check' : 'fa-robot');

                        return `
                            <div class="chat-message ${isUser ? 'user-msg' : 'ai-msg'}">
                                <div class="msg-avatar"><i class="fa-solid ${avatarIcon}"></i></div>
                                <div class="msg-bubble">
                                    ${!isUser ? `<span class="msg-author-badge ${badgeClass}">${authorLabel}</span>` : ''}
                                    <p>${m.message.replace(/\n/g, '<br>')}</p>
                                </div>
                            </div>
                        `;
                    }).join('');
                    scrollToBottom(messagesContainer);
                }
            }
        } catch (e) {
            console.log('Using offline chat state');
        }
    }

    // Initial load & polling every 4 seconds for new owner/AI replies
    loadVisitorMessages();
    if (pollInterval) clearInterval(pollInterval);
    pollInterval = setInterval(() => {
        if (currentViewMode === 'visitor') {
            loadVisitorMessages();
        } else {
            loadAdminConversations();
            if (selectedAdminSession) loadAdminMessages(selectedAdminSession);
        }
    }, 4000);

    // ── Send Visitor Message ──
    async function sendVisitorMessage(text) {
        if (!text || !text.trim()) return;

        if (input) input.value = '';

        // Append optimistic user message + thinking indicator
        if (messagesContainer) {
            messagesContainer.innerHTML += `
                <div class="chat-message user-msg">
                    <div class="msg-avatar"><i class="fa-solid fa-user"></i></div>
                    <div class="msg-bubble"><p>${text}</p></div>
                </div>
                <div class="chat-message ai-msg" id="chat-typing-indicator">
                    <div class="msg-avatar"><i class="fa-solid fa-robot"></i></div>
                    <div class="msg-bubble" style="opacity: 0.85;">
                        <span class="msg-author-badge gemini-badge">Kelvin AI (Gemini)</span>
                        <p><i class="fa-solid fa-spinner fa-spin"></i> Checking availability & preparing reply...</p>
                    </div>
                </div>
            `;
            scrollToBottom(messagesContainer);
        }

        try {
            const res = await fetch('http://localhost:3000/api/chat/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId: currentSessionId,
                    senderName: 'Visitor',
                    message: text,
                    enableAiAutoReply: true
                })
            });

            if (res.ok) {
                // Refresh list from DB
                await loadVisitorMessages();
            }
        } catch (err) {
            console.warn('Chat send error:', err);
            // Fallback display
            const typing = document.getElementById('chat-typing-indicator');
            if (typing) {
                typing.innerHTML = `
                    <div class="msg-avatar"><i class="fa-solid fa-robot"></i></div>
                    <div class="msg-bubble">
                        <span class="msg-author-badge gemini-badge">Kelvin AI (Gemini)</span>
                        <p>Thank you for reaching out! Kelvin has received your message and will reply soon. You can also reach him at kelvinkimani513@gmail.com.</p>
                    </div>
                `;
            }
        }
    }

    form?.addEventListener('submit', (e) => {
        e.preventDefault();
        sendVisitorMessage(input?.value || '');
    });

    document.querySelectorAll('.chat-prompt-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const p = chip.getAttribute('data-prompt');
            if (p) sendVisitorMessage(p);
        });
    });

    // ── Mode Toggle (Visitor vs Kelvin Inbox) ──
    toggleModeBtn?.addEventListener('click', () => {
        if (currentViewMode === 'visitor') {
            currentViewMode = 'admin';
            visitorView.style.display = 'none';
            adminView.style.display = 'grid';
            if (modeLabel) modeLabel.textContent = 'Switch to Visitor View';
            loadAdminConversations();
        } else {
            currentViewMode = 'visitor';
            adminView.style.display = 'none';
            visitorView.style.display = 'flex';
            if (modeLabel) modeLabel.textContent = 'Kelvin Inbox Mode';
            loadVisitorMessages();
        }
    });

    // ── Admin (Kelvin) Actions ──
    async function loadAdminConversations() {
        const convList = document.getElementById('admin-conversations-list');
        try {
            const res = await fetch('http://localhost:3000/api/chat/admin/conversations');
            if (res.ok) {
                const convs = await res.json();
                if (!convList) return;
                if (convs.length === 0) {
                    convList.innerHTML = '<p style="padding: 1rem; color: var(--text-secondary); font-size: 0.85rem;">No conversations yet.</p>';
                    return;
                }
                convList.innerHTML = convs.map(c => `
                    <div class="admin-conv-item ${selectedAdminSession === c.session_id ? 'active' : ''}" data-session="${c.session_id}">
                        <div style="font-weight: 600; color: #fff; font-size: 0.85rem; display: flex; justify-content: space-between;">
                            <span>${c.visitor_name || 'Visitor'}</span>
                            <span style="font-size: 0.72rem; color: var(--accent-color);">${new Date(c.last_activity).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                        <div style="font-size: 0.78rem; color: var(--text-secondary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-top: 0.2rem;">
                            ${c.last_message || ''}
                        </div>
                    </div>
                `).join('');

                document.querySelectorAll('.admin-conv-item').forEach(item => {
                    item.addEventListener('click', () => {
                        const sid = item.getAttribute('data-session');
                        selectedAdminSession = sid;
                        document.querySelectorAll('.admin-conv-item').forEach(i => i.classList.remove('active'));
                        item.classList.add('active');
                        loadAdminMessages(sid);
                    });
                });
            }
        } catch (e) {
            console.log('Error loading admin conversations');
        }
    }

    async function loadAdminMessages(sessionId) {
        const header = document.getElementById('admin-detail-header');
        const list = document.getElementById('admin-messages-list');
        const replyForm = document.getElementById('admin-reply-form');

        if (header) header.innerHTML = `<i class="fa-solid fa-comments" style="color: var(--accent-color); margin-right: 6px;"></i> Conversation with <strong>${sessionId}</strong>`;
        if (replyForm) replyForm.style.display = 'flex';

        try {
            const res = await fetch(`http://localhost:3000/api/chat/messages?sessionId=${sessionId}`);
            if (res.ok) {
                const msgs = await res.json();
                if (list) {
                    list.innerHTML = msgs.map(m => {
                        const isKelvin = m.sender === 'kelvin';
                        const isGemini = m.sender === 'gemini';
                        const authorBadge = isKelvin 
                            ? '<span class="msg-author-badge kelvin-badge">You (Kelvin)</span>' 
                            : (isGemini ? '<span class="msg-author-badge gemini-badge">Gemini AI</span>' : '<span class="msg-author-badge">Visitor</span>');
                        return `
                            <div class="chat-message ${isKelvin ? 'user-msg' : 'ai-msg'}">
                                <div class="msg-avatar"><i class="fa-solid ${isKelvin ? 'fa-user-check' : (isGemini ? 'fa-robot' : 'fa-user')}"></i></div>
                                <div class="msg-bubble">
                                    ${authorBadge}
                                    <p>${m.message.replace(/\n/g, '<br>')}</p>
                                </div>
                            </div>
                        `;
                    }).join('');
                    scrollToBottom(list);
                }
            }
        } catch (e) {
            console.log('Error loading admin messages');
        }
    }

    // Admin sends reply
    document.getElementById('admin-reply-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const replyInput = document.getElementById('admin-reply-input');
        const text = replyInput?.value || '';
        if (!text || !selectedAdminSession) return;

        replyInput.value = '';

        try {
            const res = await fetch('http://localhost:3000/api/chat/admin/reply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId: selectedAdminSession,
                    message: text
                })
            });

            if (res.ok) {
                await loadAdminMessages(selectedAdminSession);
                await loadAdminConversations();
            }
        } catch (err) {
            console.error('Admin reply error:', err);
        }
    });

    document.getElementById('btn-refresh-convs')?.addEventListener('click', loadAdminConversations);
}
