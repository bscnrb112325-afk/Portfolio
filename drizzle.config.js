const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'backend/.env') });
const { defineConfig } = require('drizzle-kit');

module.exports = defineConfig({
    schema: './backend/database/schema.js',
    out: './drizzle',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL,
    },
});
