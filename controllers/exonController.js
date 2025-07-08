const Exon = require('../models/Exon');
const { validationResult } = require('express-validator');
const { handleError } = require('../errors/errorHandler');
const { StatusCodes } = require('http-status-codes');

const exonController = {
    // GET /api/exon/{exon_id}
    async getExon(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    errors: errors.array()
                });
            }

            const { exon_id } = req.params;
            // Exon.findById already supports both numeric and Ensembl exon_id
            const exon = await Exon.findById(exon_id);

            if (!exon) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    message: `Exon not found for id or Ensembl id: ${exon_id}`
                });
            }

            res.json({
                success: true,
                data: exon
            });
        } catch (error) {
            handleError(error, res);
        }
    },

    // GET /api/exon/{exon_id}/interactions
    async getExonInteractions(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    errors: errors.array()
                });
            }

            const { exon_id } = req.params;
            const { limit = 50, offset = 0, method } = req.query;

            // Check if exon exists
            const exon = await Exon.findById(exon_id);
            if (!exon) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    message: 'Exon not found'
                });
            }

            const [interactions, totalCount] = await Promise.all([
                Exon.getInteractions(exon_id, parseInt(limit), parseInt(offset), method),
                Exon.getInteractionCount(exon_id, method)
            ]);

            res.json({
                success: true,
                data: {
                    exon: exon,
                    interactions: interactions,
                    pagination: {
                        total: totalCount,
                        limit: parseInt(limit),
                        offset: parseInt(offset),
                        hasMore: parseInt(offset) + parseInt(limit) < totalCount
                    }
                }
            });
        } catch (error) {
            handleError(error, res);
        }
    },

    // GET /api/exon/{exon_id}/interactions/detailed
    async getExonDetailedInteractions(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    errors: errors.array()
                });
            }

            const { exon_id } = req.params;
            const { limit = 50, offset = 0, method } = req.query;

            // Check if exon exists
            const exon = await Exon.findById(exon_id);
            if (!exon) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    message: 'Exon not found'
                });
            }

            const [interactions, totalCount] = await Promise.all([
                Exon.getDetailedInteractions(exon_id, parseInt(limit), parseInt(offset), method),
                Exon.getInteractionCount(exon_id, method)
            ]);

            res.json({
                success: true,
                data: {
                    exon: exon,
                    interactions: interactions,
                    pagination: {
                        total: totalCount,
                        limit: parseInt(limit),
                        offset: parseInt(offset),
                        hasMore: parseInt(offset) + parseInt(limit) < totalCount
                    }
                }
            });
        } catch (error) {
            handleError(error, res);
        }
    }
};

module.exports = exonController;