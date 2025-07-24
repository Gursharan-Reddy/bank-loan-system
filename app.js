const express = require('express');
const bodyParser = require('body-parser');
const loansRouter = require('./routes/loans');
const db = require('./db/database');

const app = express();
app.use(bodyParser.json());

// API Routes
app.use('/api', loansRouter);

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Bank Loan API running on http://localhost:${PORT}`);
});