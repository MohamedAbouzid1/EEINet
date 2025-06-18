const express = require('express');
const router = express.Router();
const { body, param, query } = require('express-validator');
const db = require('../db/connect');

// Import controllers
const exonController = require('../controllers/exonController');
const proteinController = require('../controllers/proteinController');
const interactionController = require('../controllers/interactionController');
const statsController = require('../controllers/statsController');
const exportController = require('../controllers/exportController');
const searchController = require('../controllers/searchController');

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

const validateExportPagination = [
  query('limit').optional().custom((value) => {
    if (value === 'all' || value === 'ALL') return true;
    const num = parseInt(value);
    if (isNaN(num) || num < 1) {
      throw new Error('Limit must be a positive integer or "all"');
    }
    return true;
  }),
  query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be >= 0')
];

const validateMethod = [
  query('method').optional().isIn(['Contact', 'PISA', 'EPPIC', 'predicted_contact', 'predicted_PISA', 'predicted_EPPIC', 'All Methods']).withMessage('Invalid method')
];

// EXON ROUTES
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

// PROTEIN ROUTES
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

// INTERACTION ROUTES
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

// STATS ROUTES
router.get('/stats/summary', statsController.getSummary);
router.get('/stats/distributions', statsController.getDistributions);
router.get('/stats/confidence', statsController.getConfidenceStats);

// EXPORT ROUTES
router.get('/export/interactions',
  validateExportPagination,
  validateMethod,
  query('format').optional().isIn(['csv', 'tsv', 'json']).withMessage('Format must be csv, tsv, or json'),
  exportController.exportInteractions
);

// SEARCH ROUTES
router.get('/search',
  query('q').notEmpty().withMessage('Search query is required'),
  query('type').optional().isIn(['gene', 'protein', 'exon', 'any']).withMessage('Invalid search type'),
  validatePagination,
  searchController.search
);

router.get('/search/suggestions',
  query('q').isLength({ min: 2 }).withMessage('Query must be at least 2 characters'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  searchController.getSuggestions
);
// ===== DEBUG ROUTES (remove in production) =====
router.get('/debug/database-simple',
  async (req, res) => {
    try {
      // Get basic counts
      const exonCount = await db.query('SELECT COUNT(*) as count FROM exons');
      const proteinCount = await db.query('SELECT COUNT(*) as count FROM proteins');
      const interactionCount = await db.query('SELECT COUNT(*) as count FROM eei_interactions');

      // Get sample data
      const sampleExons = await db.query('SELECT ensembl_exon_id FROM exons LIMIT 5');
      const sampleProteins = await db.query('SELECT uniprot_id FROM proteins LIMIT 5');

      // Check if our search function exists
      const functionExists = await db.query(`
        SELECT EXISTS(
          SELECT 1 FROM pg_proc 
          WHERE proname = 'search_eei_interactions'
        ) as exists
      `);

      res.json({
        success: true,
        database_status: {
          total_exons: parseInt(exonCount.rows[0].count),
          total_proteins: parseInt(proteinCount.rows[0].count),
          total_interactions: parseInt(interactionCount.rows[0].count),
          search_function_exists: functionExists.rows[0].exists,
          sample_exons: sampleExons.rows.map(r => r.ensembl_exon_id),
          sample_proteins: sampleProteins.rows.map(r => r.uniprot_id)
        }
      });
    } catch (error) {
      console.error('Database debug error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

router.get('/debug/exon/:exon_id',
  async (req, res) => {
    try {
      const { exon_id } = req.params;

      // Check if exon exists - only compare with ensembl_exon_id (text field)
      const exonQuery = 'SELECT * FROM exons WHERE ensembl_exon_id = $1';
      const exonResult = await db.query(exonQuery, [exon_id]);

      // Check interactions involving this exon
      const interactionQuery = `
        SELECT COUNT(*) as count
        FROM eei_interactions ei
        JOIN exons e1 ON ei.exon1_id = e1.exon_id
        JOIN exons e2 ON ei.exon2_id = e2.exon_id
        WHERE e1.ensembl_exon_id = $1 OR e2.ensembl_exon_id = $1
      `;
      const interactionResult = await db.query(interactionQuery, [exon_id]);

      // Get some sample interactions if they exist
      let sampleInteractions = [];
      if (parseInt(interactionResult.rows[0].count) > 0) {
        const sampleQuery = `
          SELECT 
            ei.eei_id,
            e1.ensembl_exon_id as exon1,
            e2.ensembl_exon_id as exon2,
            p1.uniprot_id as protein1,
            p2.uniprot_id as protein2,
            em.method_name
          FROM eei_interactions ei
          JOIN exons e1 ON ei.exon1_id = e1.exon_id
          JOIN exons e2 ON ei.exon2_id = e2.exon_id
          JOIN proteins p1 ON ei.protein1_id = p1.protein_id
          JOIN proteins p2 ON ei.protein2_id = p2.protein_id
          JOIN eei_methods em ON ei.method_id = em.method_id
          WHERE e1.ensembl_exon_id = $1 OR e2.ensembl_exon_id = $1
          LIMIT 5
        `;
        const sampleResult = await db.query(sampleQuery, [exon_id]);
        sampleInteractions = sampleResult.rows;
      }

      res.json({
        success: true,
        debug: {
          exon_id: exon_id,
          exon_exists: exonResult.rows.length > 0,
          exon_data: exonResult.rows[0] || null,
          interaction_count: parseInt(interactionResult.rows[0].count),
          sample_interactions: sampleInteractions,
          database_info: {
            total_exons: parseInt((await db.query('SELECT COUNT(*) as count FROM exons')).rows[0].count),
            total_interactions: parseInt((await db.query('SELECT COUNT(*) as count FROM eei_interactions')).rows[0].count)
          }
        }
      });
    } catch (error) {
      console.error('Debug endpoint error:', error);
      res.status(500).json({
        success: false,
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
);

router.get('/debug/test-search/:exon_id',
  async (req, res) => {
    try {
      const { exon_id } = req.params;

      // Direct search in interactions
      const directQuery = `
        SELECT 
          ei.eei_id,
          e1.ensembl_exon_id as exon1,
          e2.ensembl_exon_id as exon2,
          p1.uniprot_id as protein1,
          p2.uniprot_id as protein2,
          em.method_name,
          ei.jaccard_percent
        FROM eei_interactions ei
        JOIN exons e1 ON ei.exon1_id = e1.exon_id
        JOIN exons e2 ON ei.exon2_id = e2.exon_id
        JOIN proteins p1 ON ei.protein1_id = p1.protein_id
        JOIN proteins p2 ON ei.protein2_id = p2.protein_id
        JOIN eei_methods em ON ei.method_id = em.method_id
        WHERE e1.ensembl_exon_id = $1 OR e2.ensembl_exon_id = $1
        LIMIT 10
      `;

      const result = await db.query(directQuery, [exon_id]);

      res.json({
        success: true,
        test_results: {
          exon_id: exon_id,
          interactions_found: result.rows.length,
          interactions: result.rows
        }
      });
    } catch (error) {
      console.error('Test search error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

module.exports = router;