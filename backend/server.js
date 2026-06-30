require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/profile', (req, res) => {
    res.json({
        name: 'Kelvin Kimani Mugure',
        title: 'Bachelor of Science in Computer Science and System Security'
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));
