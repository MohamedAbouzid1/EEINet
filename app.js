const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
require('dotenv').config();
const db = require('./db/connect');
const { StatusCodes } = require('http-status-codes');


// Import middleware
const corsMiddleware = require('./middleware/cors');
const { generalRateLimit, exportRateLimit, searchRateLimit } = require('./middleware/rateLimiter');
const { handleError } = require('./errors/errorHandler');

// Import routes
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

app.set('trust proxy', true); // trust nginx proxy


// SECURITY MIDDLEWARE
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}));

// GENERAL MIDDLEWARE
app.use(compression());
app.use(corsMiddleware);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// RATE LIMITING
app.use('/api/', generalRateLimit);
app.use('/api/export/', exportRateLimit);
app.use('/api/search', searchRateLimit);


// STATIC FILES
//app.use(express.static(path.join(__dirname, 'public')));

// API ROUTES
app.use('/api', apiRoutes);

// ROOT ENDPOINT
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'EEI Network API Server',
        version: '1.0.0',
        endpoints: {
            exons: '/api/exon/{exon_id}',
            exon_interactions: '/api/exon/{exon_id}/interactions',
            proteins: '/api/protein/{protein_id}',
            protein_exons: '/api/protein/{protein_id}/exons',
            protein_interactions: '/api/protein/{protein_id}/interactions',
            experimental_interactions: '/api/interactions/experimental',
            predicted_interactions: '/api/interactions/predicted',
            interaction_details: '/api/interactions/{interaction_id}',
            search: '/api/search?q={query}&type={type}',
            stats_summary: '/api/stats/summary',
            stats_distributions: '/api/stats/distributions',
            stats_confidence: '/api/stats/confidence',
            export: '/api/export/interactions?format={format}&type={type}'
        },
        database_status: 'Connected'
    });
});

// HEALTH CHECK
app.get('/health', async (req, res) => {
    try {
        const result = await db.query('SELECT 1 as status');

        res.json({
            success: true,
            status: 'healthy',
            database: 'connected',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(StatusCodes.SERVICE_UNAVAILABLE).json({
            success: false,
            status: 'unhealthy',
            database: 'disconnected',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// 404 HANDLER
app.use('*', (req, res) => {
    res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        error: 'Not Found',
        message: 'The requested endpoint does not exist.',
        path: req.originalUrl
    });
});

// GLOBAL ERROR HANDLER
app.use((error, req, res, next) => {
    handleError(error, res);
});

// START SERVER
app.listen(PORT, () => {
    console.log(`EEI Network API Server running on port ${PORT}`);
    console.log(`Database: ${process.env.DB_NAME}@${process.env.DB_HOST}:${process.env.DB_PORT}`);
    console.log(`API Documentation: http://localhost:${PORT}/`);
    console.log(`Health Check: http://localhost:${PORT}/health`);
});

module.exports = app;