require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const keepAlive = require('express-keepalive'); // Keeps the server alive

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(keepAlive()); // Prevents API from going idle

// ✅ Health Check Route
app.get('/', (req, res) => {
    res.status(200).json({ message: "Translator API is running" });
});

// ✅ Detect Language API (Fixed)
app.post('/detect', async (req, res) => {
    try {
        console.log("Detect Request Body:", req.body);
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ error: "Text is required" });
        }

        const response = await axios.post('https://libretranslate.com/detect', { q: text }, {
            headers: { 'Content-Type': 'application/json' },
            timeout: 10000  // Prevents hanging requests
        });

        res.json(response.data[0]); 
    } catch (error) {
        console.error("Error detecting language:", error.response?.data || error.message);
        res.status(500).json({ error: "Error detecting language" });
    }
});

// ✅ Translate Text API (Fixed)
app.post('/translate', async (req, res) => {
    try {
        console.log("Translate Request Body:", req.body);
        const { text, source = "auto", target } = req.body;

        if (!text || !target) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const response = await axios.post('https://libretranslate.com/translate', {
            q: text,
            source: source,
            target: target
        }, {
            headers: { 'Content-Type': 'application/json' },
            timeout: 10000  // Prevents timeout issues
        });

        res.json(response.data);
    } catch (error) {
        console.error("Error translating text:", error.response?.data || error.message);
        res.status(500).json({ error: "Error translating text" });
    }
});

// ✅ Start the server
app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});
