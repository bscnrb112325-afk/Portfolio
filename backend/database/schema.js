const { pgTable, serial, text, timestamp, boolean, integer } = require('drizzle-orm/pg-core');
const { relations } = require('drizzle-orm');

// 1. Messages table (Contact Form)
const messages = pgTable('messages', {
    id: serial('id').primaryKey(),
    name: text('name'),
    email: text('email'),
    message: text('message'),
    created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// 2. Chat Messages table (Realtime Visitor & AI Assistant Chat)
const chatMessages = pgTable('chat_messages', {
    id: serial('id').primaryKey(),
    session_id: text('session_id').notNull(),
    sender: text('sender').notNull(),
    sender_name: text('sender_name').default('Visitor'),
    message: text('message').notNull(),
    is_admin_reply: boolean('is_admin_reply').default(false),
    created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// 3. Posts table (Articles / Publications)
const posts = pgTable('posts', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    category: text('category').default('Software & AI'),
    read_time: text('read_time').default('3 min read'),
    image_url: text('image_url'),
    content: text('content').notNull(),
    tags: text('tags'),
    author: text('author').default('Kelvin Kimani'),
    likes: integer('likes').default(0),
    created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// 4. Post Comments table
const postComments = pgTable('post_comments', {
    id: serial('id').primaryKey(),
    post_id: integer('post_id').notNull(),
    author: text('author').notNull().default('Visitor'),
    comment: text('comment').notNull(),
    created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// Relations for relational queries
const postsRelations = relations(posts, ({ many }) => ({
    comments: many(postComments),
}));

const postCommentsRelations = relations(postComments, ({ one }) => ({
    post: one(posts, {
        fields: [postComments.post_id],
        references: [posts.id],
    }),
}));

module.exports = {
    messages,
    chatMessages,
    posts,
    postComments,
    postsRelations,
    postCommentsRelations,
};
