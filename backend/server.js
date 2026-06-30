require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

// Serve the frontend static files automatically
app.use(express.static(path.join(__dirname, '../')));

app.get('/api/profile', (req, res) => {
    res.json({
        name: 'Kelvin Kimani Mugure',
        title: 'Bachelor of Science in Computer Science and System Security'
    });
});

// Any other route should serve the frontend index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));
