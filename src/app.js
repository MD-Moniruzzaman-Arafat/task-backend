const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const { sendError } = require('./middleware/response');

const app = express();

// Security headers
app.use(helmet());

// CORS
app.use(cors());

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Body parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'JobBoard API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// API Routes
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);

// 404 handler
app.use((req, res) => {
  sendError(res, `Route ${req.method} ${req.originalUrl} not found`, 404);
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  sendError(res, err.message || 'Internal server error', err.statusCode || 500);
});

module.exports = app;
