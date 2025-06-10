const db = require('../db/connect');
const { validationResult } = require('express-validator');
const { handleError } = require('../errors/errorHandler');
const { StatusCodes } = require('http-status-codes');

const searchController = {
    async search(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    errors: errors.array()
                });
            }

            const {
                q: searchTerm,
                type = 'any',
                limit = 50,
                offset = 0
            } = req.query;

            const query = `SELECT * FROM web_search_eei($1, $2, NULL, NULL, $3, $4)`;
            const result = await db.query(query, [searchTerm, type, parseInt(limit), parseInt(offset)]);

            res.json({
                success: true,
                data: {
                    search_term: searchTerm,
                    search_type: type,
                    results: result.rows,
                    pagination: {
                        limit: parseInt(limit),
                        offset: parseInt(offset),
                        count: result.rows.length,
                        hasMore: result.rows.length === parseInt(limit)
                    }
                }
            });
        } catch (error) {
            handleError(error, res);
        }
    }
};

module.exports = searchController;