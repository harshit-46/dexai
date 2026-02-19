const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(helmet());

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || origin.startsWith('http://localhost')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use('/api', rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: 'Too many requests from this IP, try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

let model;
try {
    if (!process.env.GOOGLE_GEMINI_API_KEY) {
        throw new Error('GOOGLE_API_KEY is missing in .env');
    }

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);
    model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
        generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
        },
    });

    console.log('✅ Gemini AI initialized');
} catch (err) {
    console.error('❌ Gemini initialization failed:', err.message);
    process.exit(1);
}

const validatePrompt = (req, res, next) => {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
        return res.status(400).json({ error: 'Invalid or empty prompt' });
    }

    if (prompt.length > 30000) {
        return res.status(400).json({ error: 'Prompt too long (max 30,000 characters)' });
    }

    req.body.prompt = prompt.trim();
    next();
};

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

app.post('/api/gemini', validatePrompt, async (req, res) => {
    const startTime = Date.now();
    const { prompt } = req.body;

    try {
        console.log(`🔍 Processing prompt (${prompt.length} chars)`);

        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Request timeout')), 30000)
        );

        const generatePromise = model.generateContent([prompt]);

        const result = await Promise.race([generatePromise, timeoutPromise]);

        if (!result || !result.response || typeof result.response.text !== 'function') {
            throw new Error('Invalid response from Gemini model');
        }

        const text = await result.response.text();

        const processingTime = Date.now() - startTime;
        console.log(`✅ Completed in ${processingTime}ms`);

        res.json({
            text,
            metadata: {
                processingTime,
                promptLength: prompt.length,
                responseLength: text.length,
                timestamp: new Date().toISOString()
            }
        });

    } catch (error) {
        const processingTime = Date.now() - startTime;
        console.error(`❌ Error after ${processingTime}ms:`, error.message);

        res.status(500).json({
            error: 'Failed to generate response',
            details: error.message,
            requestId: req.headers['x-request-id'] || 'unknown'
        });
    }
});

app.use('/*catchAll', (req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

app.use((err, req, res, next) => {
    console.error('🔥 Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

['SIGINT', 'SIGTERM'].forEach(sig => {
    process.on(sig, () => {
        console.log(`${sig} received, shutting down gracefully`);
        process.exit(0);
    });
});

app.listen(port, () => {
    console.log(`🚀 Server ready at http://localhost:${port}`);
});