const rateLimit = require('express-rate-limit');

// Different rate limits for different endpoints
const createRateLimit = (windowMs, max, message) => {
    return rateLimit({
        windowMs: windowMs,
        max: max,
        message: {
            success: false,
            error: message
        },
        standardHeaders: true,
        legacyHeaders: false,
    });
};

// General API rate limit
const generalRateLimit = createRateLimit(
    15 * 60 * 1000, // 15 minutes
    100, // limit each IP to 100 requests per windowMs
    'Too many requests from this IP, please try again later.'
);

// Export rate limit (more restrictive)
const exportRateLimit = createRateLimit(
    60 * 60 * 1000, // 1 hour
    10, // limit each IP to 10 exports per hour
    'Too many export requests from this IP, please try again later.'
);

// Search rate limit
const searchRateLimit = createRateLimit(
    60 * 1000, // 1 minute
    30, // limit each IP to 30 searches per minute
    'Too many search requests from this IP, please try again later.'
);

module.exports = {
    generalRateLimit,
    exportRateLimit,
    searchRateLimit
};
