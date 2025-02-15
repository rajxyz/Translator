require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// **Detect Language API**
app.post('/detect', async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) return res.status(400).json({ error: "Text is required" });

        const response = await axios.post('https://libretranslate.com/detect', {
            q: text
        }, {
            headers: { 'Content-Type': 'application/json' }
        });

        res.json(response.data[0]); // Return detected language
    } catch (error) {
        res.status(500).json({ error: "Error detecting language" });
    }
});

// **Translate Text API**
app.post('/translate', async (req, res) => {
    try {
        const { text, source, target } = req.body;
        if (!text || !source || !target) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const response = await axios.post('https://libretranslate.com/translate', {
            q: text,
            source: source,
            target: target
        }, {
            headers: { 'Content-Type': 'application/json' }
        });

        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Error translating text" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
