const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { Pool } = require('pg');
const { drizzle } = require('drizzle-orm/node-postgres');
const schema = require('./schema');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true  // Uses sslmode=verify-full (recommended by pg v9 migration guide)
});

// Prevent backend crash on idle database connection drops (common with Neon serverless)
pool.on('error', (err) => {
    console.warn('⚠️ Idle PostgreSQL pool client error (auto-recovering):', err.message);
});

// Initialize Drizzle ORM with schema
const db = drizzle(pool, { schema });

// Auto-check connection and verify schema on startup
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('❌ Neon PostgreSQL Connection Error:', err.message);
    } else {
        console.log('✅ Connected to Neon PostgreSQL Database via Drizzle ORM at:', res.rows[0].now);
        
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS messages (
                id SERIAL PRIMARY KEY,
                name TEXT,
                email TEXT,
                message TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS chat_messages (
                id SERIAL PRIMARY KEY,
                session_id TEXT NOT NULL,
                sender TEXT NOT NULL,
                sender_name TEXT DEFAULT 'Visitor',
                message TEXT NOT NULL,
                is_admin_reply BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS posts (
                id SERIAL PRIMARY KEY,
                title TEXT NOT NULL,
                category TEXT DEFAULT 'Software & AI',
                read_time TEXT DEFAULT '3 min read',
                image_url TEXT,
                content TEXT NOT NULL,
                tags TEXT,
                author TEXT DEFAULT 'Kelvin Kimani',
                likes INT DEFAULT 0,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );

            ALTER TABLE posts ADD COLUMN IF NOT EXISTS image_url TEXT;

            CREATE TABLE IF NOT EXISTS post_comments (
                id SERIAL PRIMARY KEY,
                post_id INT NOT NULL,
                author TEXT NOT NULL DEFAULT 'Visitor',
                comment TEXT NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `;
        pool.query(createTableQuery)
            .then(() => console.log('✅ Drizzle ORM schema verified in Neon DB'))
            .catch(e => console.error('❌ Schema initialization error:', e.message));
    }
});

module.exports = {
    db,
    pool,
    ...schema
};
