const { body, param, query } = require('express-validator');

const validators = {
    // Common parameter validators
    exonId: param('exon_id')
        .notEmpty()
        .withMessage('Exon ID is required')
        .withMessage('Exon ID must be in Ensembl format'),

    proteinId: param('protein_id')
        .notEmpty()
        .withMessage('Protein ID is required'),

    // Pagination validators
    pagination: [
        query('limit')
            .optional()
            .isInt({ min: 1, max: 1000 })
            .withMessage('Limit must be between 1 and 1000')
            .toInt(),
        query('offset')
            .optional()
            .isInt({ min: 0 })
            .withMessage('Offset must be >= 0')
            .toInt()
    ],

    // Method validator
    method: query('method')
        .optional()
        .isIn(['contact_based', 'PISA', 'EPPIC', 'predicted_contact', 'predicted_PISA', 'predicted_EPPIC'])
        .withMessage('Invalid method'),

    // Search validators
    search: [
        query('q')
            .notEmpty()
            .withMessage('Search query is required')
            .isLength({ min: 2, max: 100 })
            .withMessage('Search query must be between 2 and 100 characters'),
        query('type')
            .optional()
            .isIn(['gene', 'protein', 'exon', 'any'])
            .withMessage('Invalid search type')
    ],

    // Export validators
    export: [
        query('format')
            .optional()
            .isIn(['csv', 'tsv', 'json'])
            .withMessage('Format must be csv, tsv, or json'),
        query('type')
            .optional()
            .isIn(['experimental', 'predicted'])
            .withMessage('Type must be experimental or predicted')
    ]
};

module.exports = validators;