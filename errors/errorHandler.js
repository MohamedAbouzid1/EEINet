const { StatusCodes } = require('http-status-codes');
const handleError = (error, res) => {
    console.error('API Error:', error);

    // Database connection errors
    if (error.code === 'ECONNREFUSED') {
        return res.status(StatusCodes.SERVICE_UNAVAILABLE).json({
            success: false,
            error: 'Database connection failed',
            message: 'Unable to connect to the database. Please try again later.'
        });
    }

    // PostgreSQL specific errors
    if (error.code) {
        switch (error.code) {
            case '23505': // Unique violation
                return res.status(StatusCodes.CONFLICT).json({
                    success: false,
                    error: 'Duplicate entry',
                    message: 'A record with this information already exists.'
                });
            case '23503': // Foreign key violation
                return res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    error: 'Invalid reference',
                    message: 'Referenced record does not exist.'
                });
            case '42P01': // Undefined table
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    error: 'Database schema error',
                    message: 'Database table not found.'
                });
            default:
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    error: 'Database error',
                    message: 'An error occurred while processing your request.'
                });
        }
    }

    // Default error response
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: 'Internal server error',
        message: 'An unexpected error occurred. Please try again later.'
    });
};

module.exports = { handleError };