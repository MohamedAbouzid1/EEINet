const Protein = require('../models/Protein');
const { validationResult } = require('express-validator');
const { handleError } = require('../errors/errorHandler');
const { StatusCodes } = require('http-status-codes');

const proteinController = {
    // GET /api/protein/{protein_id}
    async getProtein(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    errors: errors.array()
                });
            }

            const { protein_id } = req.params;
            const protein = await Protein.findById(protein_id);

            if (!protein) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    message: 'Protein not found'
                });
            }

            res.json({
                success: true,
                data: protein
            });
        } catch (error) {
            handleError(error, res);
        }
    },

    // GET /api/protein/{protein_id}/exons
    async getProteinExons(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    errors: errors.array()
                });
            }

            const { protein_id } = req.params;
            const { limit = 100, offset = 0 } = req.query;

            // Check if protein exists
            const protein = await Protein.findById(protein_id);
            if (!protein) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    message: 'Protein not found'
                });
            }

            const exons = await Protein.getExons(protein_id, parseInt(limit), parseInt(offset));

            res.json({
                success: true,
                data: {
                    protein: protein,
                    exons: exons,
                    pagination: {
                        limit: parseInt(limit),
                        offset: parseInt(offset),
                        count: exons.length
                    }
                }
            });
        } catch (error) {
            handleError(error, res);
        }
    },

    // GET /api/protein/{protein_id}/interactions
    async getProteinInteractions(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    errors: errors.array()
                });
            }

            const { protein_id } = req.params;
            const { limit = 50, offset = 0, method } = req.query;

            // Check if protein exists
            const protein = await Protein.findById(protein_id);
            if (!protein) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    message: 'Protein not found'
                });
            }

            const interactions = await Protein.getInteractions(protein_id, parseInt(limit), parseInt(offset), method);

            res.json({
                success: true,
                data: {
                    protein: protein,
                    interactions: interactions,
                    pagination: {
                        limit: parseInt(limit),
                        offset: parseInt(offset),
                        count: interactions.length
                    }
                }
            });
        } catch (error) {
            handleError(error, res);
        }
    }
};

module.exports = proteinController;