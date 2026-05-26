const express = require('express');
const cors = require('cors');
const scansRouter = require('./routes/scans');
const chatRouter = require('./routes/chat');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allow frontend to connect
app.use(express.json());

// Routes
app.use('/api/scans', scansRouter);
app.use('/api/chat', chatRouter);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'Node.js Express Backend is running!' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
