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

            if (type === 'experimental') {
                interactions = await Interaction.getExperimental(
                    parseInt(limit),
                    parseInt(offset),
                    method,
                    min_jaccard ? parseFloat(min_jaccard) : null
                );
            } else {
                interactions = await Interaction.getPredicted(
                    parseInt(limit),
                    parseInt(offset),
                    method,
                    min_confidence ? parseFloat(min_confidence) : null
                );
            }

            // Set appropriate headers
            const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
            const filename = `eei_interactions_${type}_${timestamp}`;

            switch (format) {
                case 'csv':
                    res.setHeader('Content-Type', 'text/csv');
                    res.setHeader('Content-Disposition', `attachment; filename="${filename}.csv"`);

                    const csvFields = [
                        'eei_id', 'exon1', 'exon2', 'protein1', 'protein2',
                        'method_name', 'pdb_id', 'jaccard_percent', 'aa1', 'aa2'
                    ];

                    if (type === 'predicted') {
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

                    if (type === 'predicted') {
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
                    res.json({
                        success: true,
                        export_info: {
                            format: format,
                            type: type,
                            total_records: interactions.length,
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