const Interaction = require('../models/Interaction');
const { validationResult } = require('express-validator');
const { handleError } = require('../errors/errorHandler');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const { Parser } = require('json2csv');

const exportController = {
    async exportInteractions(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array()
                });
            }

            const {
                format = 'json',
                limit = 1000,
                offset = 0,
                method,
                type = 'experimental',
                min_jaccard,
                min_confidence
            } = req.query;

            let interactions;
            let actualLimit = limit;

            // Handle "all" limit for export
            if (limit === 'all' || limit === 'ALL') {
                actualLimit = null; // This will be handled in the model methods
            } else {
                actualLimit = parseInt(limit);
            }

            if (type === 'experimental') {
                interactions = await Interaction.getExperimental(
                    actualLimit,
                    parseInt(offset),
                    method,
                    min_jaccard ? parseFloat(min_jaccard) : null
                );
            } else if (type === 'predicted') {
                interactions = await Interaction.getPredicted(
                    actualLimit,
                    parseInt(offset),
                    method,
                    min_confidence ? parseFloat(min_confidence) : null
                );
            } else if (type === 'All') {
                // For "All" type, we need to get both experimental and predicted interactions
                let experimentalInteractions = [];
                let predictedInteractions = [];

                // Map method names for predicted interactions
                let experimentalMethod = method;
                let predictedMethod = method;

                if (method === 'PISA') {
                    predictedMethod = 'predicted_PISA';
                } else if (method === 'EPPIC') {
                    predictedMethod = 'predicted_EPPIC';
                } else if (method === 'Contact') {
                    predictedMethod = 'predicted_contact';
                } else if (method === 'All Methods') {
                    // For "All Methods", we don't filter by method
                    experimentalMethod = null;
                    predictedMethod = null;
                }

                // Get experimental interactions
                experimentalInteractions = await Interaction.getExperimental(
                    actualLimit,
                    parseInt(offset),
                    experimentalMethod,
                    min_jaccard ? parseFloat(min_jaccard) : null
                );

                // Get predicted interactions
                predictedInteractions = await Interaction.getPredicted(
                    actualLimit,
                    parseInt(offset),
                    predictedMethod,
                    min_confidence ? parseFloat(min_confidence) : null
                );

                // Combine both sets of interactions
                interactions = [...experimentalInteractions, ...predictedInteractions];
            } else {
                // Default to predicted for backward compatibility
                interactions = await Interaction.getPredicted(
                    actualLimit,
                    parseInt(offset),
                    method,
                    min_confidence ? parseFloat(min_confidence) : null
                );
            }

            // Set appropriate headers
            const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
            const filename = `eei_interactions_${type}_${timestamp}`;

            // Determine which fields to include based on interaction types present
            const hasExperimental = type === 'experimental' || type === 'All';
            const hasPredicted = type === 'predicted' || type === 'All';

            switch (format) {
                case 'csv':
                    res.setHeader('Content-Type', 'text/csv');
                    res.setHeader('Content-Disposition', `attachment; filename="${filename}.csv"`);

                    const csvFields = [
                        'eei_id', 'exon1', 'exon2', 'protein1', 'protein2',
                        'method_name', 'pdb_id', 'jaccard_percent', 'aa1', 'aa2'
                    ];

                    if (hasPredicted) {
                        csvFields.push('confidence', 'identity1', 'identity2', 'mouse_exon1_coordinates', 'mouse_exon2_coordinates');
                    }

                    const parser = new Parser({ fields: csvFields });
                    const csv = parser.parse(interactions);
                    res.send(csv);
                    break;

                case 'tsv':
                    res.setHeader('Content-Type', 'text/tab-separated-values');
                    res.setHeader('Content-Disposition', `attachment; filename="${filename}.tsv"`);

                    const tsvFields = [
                        'eei_id', 'exon1', 'exon2', 'protein1', 'protein2',
                        'method_name', 'pdb_id', 'jaccard_percent', 'aa1', 'aa2'
                    ];

                    if (hasPredicted) {
                        tsvFields.push('confidence', 'identity1', 'identity2', 'mouse_exon1_coordinates', 'mouse_exon2_coordinates');
                    }

                    const tsvParser = new Parser({ fields: tsvFields, delimiter: '\t' });
                    const tsv = tsvParser.parse(interactions);
                    res.send(tsv);
                    break;

                case 'json':
                default:
                    res.setHeader('Content-Type', 'application/json');
                    res.setHeader('Content-Disposition', `attachment; filename="${filename}.json"`);

                    // Count interactions by type for the export info
                    let experimentalCount = 0;
                    let predictedCount = 0;

                    if (type === 'All') {
                        experimentalCount = interactions.filter(i => !i.confidence).length;
                        predictedCount = interactions.filter(i => i.confidence).length;
                    } else if (type === 'experimental') {
                        experimentalCount = interactions.length;
                    } else if (type === 'predicted') {
                        predictedCount = interactions.length;
                    }

                    res.json({
                        success: true,
                        export_info: {
                            format: format,
                            type: type,
                            total_records: interactions.length,
                            experimental_count: experimentalCount,
                            predicted_count: predictedCount,
                            generated_at: new Date().toISOString(),
                            filters: {
                                method: method || null,
                                min_jaccard: min_jaccard ? parseFloat(min_jaccard) : null,
                                min_confidence: min_confidence ? parseFloat(min_confidence) : null
                            }
                        },
                        data: interactions
                    });
                    break;
            }
        } catch (error) {
            handleError(error, res);
        }
    }
};

module.exports = exportController;