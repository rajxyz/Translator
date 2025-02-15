require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors({ origin: '*' })); // Allow all origins (Change '*' to your frontend URL later)
app.use(express.json()); // Ensure JSON body parsing

// **Detect Language API**
app.post('/detect', async (req, res) => {
    try {
        console.log("Detect Request Body:", req.body);
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ error: "Text is required" });
        }

        const response = await axios.post('https://libretranslate.com/detect', {
            q: text
        }, {
            headers: { 'Content-Type': 'application/json' }
        });

        res.json(response.data[0]); // Return detected language
    } catch (error) {
        console.error("Error detecting language:", error.response?.data || error.message);
        res.status(500).json({ error: "Error detecting language" });
    }
});

// **Translate Text API**
app.post('/translate', async (req, res) => {
    try {  
        console.log("Translate Request Body:", req.body); // Log request body
        const { text, source = "auto", target } = req.body;

        if (!text || !target) {
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
        console.error("Error translating text:", error.response?.data || error.message);
        res.status(500).json({ error: "Error translating text" });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});
