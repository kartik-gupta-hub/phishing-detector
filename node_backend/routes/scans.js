const express = require('express');
const router = express.Router();
const axios = require('axios');
const db = require('../db/database');

const FLASK_API_URL = process.env.FLASK_API_URL || 'http://localhost:8000/api/predict';

// Proxy URL prediction
router.post('/url', async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'URL is required' });

    try {
        const response = await axios.post(`${FLASK_API_URL}/url`, { url });
        const data = response.data;

        // Save scan to database
        const stmt = db.prepare(`INSERT INTO scans (type, target, prediction, confidence, risk_score) VALUES (?, ?, ?, ?, ?)`);
        stmt.run('url', url, data.prediction, data.confidence, data.risk_score, function(err) {
            if (err) console.error('Error saving scan:', err);
        });
        stmt.finalize();

        res.json(data);
    } catch (error) {
        console.error('Error scanning URL:', error.message);
        res.status(500).json({ error: 'Failed to communicate with ML Model' });
    }
});

// Proxy Email prediction
router.post('/email', async (req, res) => {
    const { email_text } = req.body;
    if (!email_text) return res.status(400).json({ error: 'Email text is required' });

    try {
        const response = await axios.post(`${FLASK_API_URL}/email`, { email_text });
        const data = response.data;

        // Save truncated string to DB as target
        const targetStr = email_text.substring(0, 50) + (email_text.length > 50 ? '...' : '');
        
        const stmt = db.prepare(`INSERT INTO scans (type, target, prediction, confidence, risk_score) VALUES (?, ?, ?, ?, ?)`);
        stmt.run('email', targetStr, data.prediction, data.confidence, data.risk_score, function(err) {
            if (err) console.error('Error saving scan:', err);
        });
        stmt.finalize();

        res.json(data);
    } catch (error) {
        console.error('Error scanning Email:', error.message);
        res.status(500).json({ error: 'Failed to communicate with ML Model' });
    }
});

// Mock Screenshot prediction
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.post('/screenshot', upload.single('screenshot'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'Screenshot image is required' });

    try {
        // Simulate AI analysis delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Mock visual analysis logic based on file size or random for demonstration
        const risk_score = Math.floor(Math.random() * 100);
        const prediction = risk_score > 60 ? 'PHISHING' : 'SAFE';
        const confidence = 85 + Math.random() * 14;

        let reasons = [];
        let ocr_text = "Microsoft Account \n Login to continue \n Email or phone";
        let fake_login_detected = false;
        let brand_impersonation = null;

        if (prediction === 'PHISHING') {
            reasons.push("Detected fake Microsoft login form layout.");
            reasons.push("Brand logo (Microsoft) impersonation detected.");
            reasons.push("Input fields mapped to suspicious destinations (not microsoft.com).");
            fake_login_detected = true;
            brand_impersonation = "Microsoft";
        } else {
            reasons.push("Image layout appears consistent with a standard web page.");
            reasons.push("No known phishing visual signatures detected.");
        }

        const data = {
            prediction,
            confidence,
            risk_score,
            reasons,
            ocr_text,
            fake_login_detected,
            brand_impersonation,
            type: 'screenshot'
        };

        // Save to DB
        const stmt = db.prepare(`INSERT INTO scans (type, target, prediction, confidence, risk_score) VALUES (?, ?, ?, ?, ?)`);
        stmt.run('screenshot', 'Image Upload', prediction, confidence, risk_score, function(err) {
            if (err) console.error('Error saving scan:', err);
        });
        stmt.finalize();

        res.json(data);
    } catch (error) {
        console.error('Error scanning screenshot:', error.message);
        res.status(500).json({ error: 'Failed to communicate with Visual AI Model' });
    }
});

// Get Scan History
router.get('/history', (req, res) => {
    db.all(`SELECT * FROM scans ORDER BY timestamp DESC LIMIT 50`, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ history: rows });
    });
});

// Get Stats for Dashboard
router.get('/stats', (req, res) => {
    const queries = {
        total: `SELECT COUNT(*) as count FROM scans`,
        phishing: `SELECT COUNT(*) as count FROM scans WHERE prediction = 'PHISHING'`,
        safe: `SELECT COUNT(*) as count FROM scans WHERE prediction = 'SAFE'`
    };

    let stats = { total: 0, phishing: 0, safe: 0 };
    let completed = 0;

    const checkDone = () => {
        completed++;
        if (completed === 3) {
            res.json(stats);
        }
    };

    db.get(queries.total, [], (err, row) => {
        if (!err) stats.total = row.count;
        checkDone();
    });
    db.get(queries.phishing, [], (err, row) => {
        if (!err) stats.phishing = row.count;
        checkDone();
    });
    db.get(queries.safe, [], (err, row) => {
        if (!err) stats.safe = row.count;
        checkDone();
    });
});

module.exports = router;
