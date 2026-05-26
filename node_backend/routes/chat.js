const express = require('express');
const router = express.Router();

// Mock AI Chatbot logic
router.post('/', async (req, res) => {
    const { message, history } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });

    try {
        // Simulate thinking time
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

        let reply = "I am the PhishGuard AI assistant. I can help explain scan results, detect suspicious patterns, and provide cybersecurity advice.";
        const msgLower = message.toLowerCase();

        if (msgLower.includes('phishing')) {
            reply = "Phishing is a cyber attack where attackers disguise themselves as a trusted entity to deceive victims into opening an email, instant message, or text message. Always check the sender's address and domain for subtle typos (like rnicrosoft.com instead of microsoft.com).";
        } else if (msgLower.includes('explain') || msgLower.includes('result')) {
            reply = "Based on our hybrid ML engine, a 'SUSPICIOUS' or 'PHISHING' result indicates that the URL or email contains heuristic red flags such as excessive subdomains, recently registered domains, or obfuscated code designed to hide its true intent.";
        } else if (msgLower.includes('safe')) {
            reply = "A 'SAFE' verdict means our models did not detect any known threat signatures. However, always remain vigilant and verify the source if you are asked for sensitive information.";
        } else if (msgLower.includes('hello') || msgLower.includes('hi')) {
            reply = "Hello! I'm here to assist you with cybersecurity analysis. Try asking me to explain a scan result, or how to spot a fake URL.";
        }

        res.json({
            reply,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error in chat:', error.message);
        res.status(500).json({ error: 'Failed to process chat message' });
    }
});

module.exports = router;
