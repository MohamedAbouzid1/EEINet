const express = require('express');
const router = express.Router();
const { body, param, query } = require('express-validator');

// Import controllers
const exonController = require('../controllers/exonController');
const proteinController = require('../controllers/proteinController');
const interactionController = require('../controllers/interactionController');
const statsController = require('../controllers/statsController');
const exportController = require('../controllers/exportController');

// Validation middleware
const validateExonId = [
  param('exon_id').notEmpty().withMessage('Exon ID is required')
];

const validateProteinId = [
  param('protein_id').notEmpty().withMessage('Protein ID is required')
];

const validateInteractionId = [
  param('interaction_id').isInt().withMessage('Interaction ID must be an integer')
];

const validatePagination = [
  query('limit').optional().isInt({ min: 1, max: 1000 }).withMessage('Limit must be between 1 and 1000'),
  query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be >= 0')
];

const validateMethod = [
  query('method').optional().isIn(['contact_based', 'PISA', 'EPPIC', 'predicted_contact', 'predicted_PISA', 'predicted_EPPIC']).withMessage('Invalid method')
];

// ===== EXON ROUTES =====
router.get('/exon/:exon_id',
  validateExonId,
  exonController.getExon
);

router.get('/exon/:exon_id/interactions',
  validateExonId,
  validatePagination,
  validateMethod,
  exonController.getExonInteractions
);

// ===== PROTEIN ROUTES =====
router.get('/protein/:protein_id',
  validateProteinId,
  proteinController.getProtein
);

router.get('/protein/:protein_id/exons',
  validateProteinId,
  validatePagination,
  proteinController.getProteinExons
);

router.get('/protein/:protein_id/interactions',
  validateProteinId,
  validatePagination,
  validateMethod,
  proteinController.getProteinInteractions
);

// ===== INTERACTION ROUTES =====
router.get('/interactions/experimental',
  validatePagination,
  validateMethod,
  query('min_jaccard').optional().isFloat({ min: 0, max: 100 }).withMessage('min_jaccard must be between 0 and 100'),
  interactionController.getExperimentalInteractions
);

router.get('/interactions/predicted',
  validatePagination,
  validateMethod,
  query('min_confidence').optional().isFloat({ min: 0, max: 1 }).withMessage('min_confidence must be between 0 and 1'),
  interactionController.getPredictedInteractions
);

router.get('/interactions/:interaction_id',
  validateInteractionId,
  interactionController.getInteraction
);

// ===== STATS ROUTES =====
router.get('/stats/summary', statsController.getSummary);
router.get('/stats/distributions', statsController.getDistributions);
router.get('/stats/confidence', statsController.getConfidenceStats);

// ===== EXPORT ROUTES =====
router.get('/export/interactions',
  validatePagination,
  validateMethod,
  query('format').optional().isIn(['csv', 'tsv', 'json']).withMessage('Format must be csv, tsv, or json'),
  exportController.exportInteractions
);

// ===== SEARCH ROUTES =====
router.get('/search',
  query('q').notEmpty().withMessage('Search query is required'),
  query('type').optional().isIn(['gene', 'protein', 'exon', 'any']).withMessage('Invalid search type'),
  validatePagination,
  require('../controllers/searchController').search
);

module.exports = router;