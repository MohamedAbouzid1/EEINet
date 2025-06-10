const Interaction = require('../models/Interaction');
const { validationResult } = require('express-validator');
const { handleError } = require('../errors/errorHandler');
const { StatusCodes } = require('http-status-codes');

const interactionController = {
    // GET /api/interactions/experimental
    async getExperimentalInteractions(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    errors: errors.array()
                });
            }

            const {
                limit = 50,
                offset = 0,
                method,
                min_jaccard
            } = req.query;

            const interactions = await Interaction.getExperimental(
                parseInt(limit),
                parseInt(offset),
                method,
                min_jaccard ? parseFloat(min_jaccard) : null
            );

            res.json({
                success: true,
                data: {
                    interactions: interactions,
                    pagination: {
                        limit: parseInt(limit),
                        offset: parseInt(offset),
                        count: interactions.length,
                        hasMore: interactions.length === parseInt(limit)
                    },
                    filters: {
                        method: method || null,
                        min_jaccard: min_jaccard ? parseFloat(min_jaccard) : null
                    }
                }
            });
        } catch (error) {
            handleError(error, res);
        }
    },

    // GET /api/interactions/predicted
    async getPredictedInteractions(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    errors: errors.array()
                });
            }

            const {
                limit = 50,
                offset = 0,
                method,
                min_confidence
            } = req.query;

            const interactions = await Interaction.getPredicted(
                parseInt(limit),
                parseInt(offset),
                method,
                min_confidence ? parseFloat(min_confidence) : null
            );

            res.json({
                success: true,
                data: {
                    interactions: interactions,
                    pagination: {
                        limit: parseInt(limit),
                        offset: parseInt(offset),
                        count: interactions.length,
                        hasMore: interactions.length === parseInt(limit)
                    },
                    filters: {
                        method: method || null,
                        min_confidence: min_confidence ? parseFloat(min_confidence) : null
                    }
                }
            });
        } catch (error) {
            handleError(error, res);
        }
    },

    // GET /api/interactions/{interaction_id}
    async getInteraction(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    errors: errors.array()
                });
            }

            const { interaction_id } = req.params;
            const interaction = await Interaction.getById(interaction_id);

            if (!interaction) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    message: 'Interaction not found'
                });
            }

            res.json({
                success: true,
                data: interaction
            });
        } catch (error) {
            handleError(error, res);
        }
    }
};

module.exports = interactionController;