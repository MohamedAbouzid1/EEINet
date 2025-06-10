const db = require('../db/connect');
const { validationResult } = require('express-validator');
const { handleError } = require('../errors/errorHandler');

const statsController = {
    // GET /api/stats/summary
    async getSummary(req, res) {
        try {
            const query = `SELECT * FROM get_eei_statistics()`;
            const result = await db.query(query);

            // Transform the result into a more useful format
            const stats = {};
            result.rows.forEach(row => {
                stats[row.metric.toLowerCase().replace(/\s+/g, '_')] = parseInt(row.value);
            });

            res.json({
                success: true,
                data: stats
            });
        } catch (error) {
            handleError(error, res);
        }
    },

    // GET /api/stats/distributions
    async getDistributions(req, res) {
        try {
            // Get method distribution
            const methodQuery = `
        SELECT 
          em.method_name,
          em.method_type,
          COUNT(*) as count
        FROM eei_interactions ei
        JOIN eei_methods em ON ei.method_id = em.method_id
        GROUP BY em.method_name, em.method_type
        ORDER BY count DESC
      `;

            // Get jaccard distribution for experimental
            const jaccardQuery = `
        SELECT 
          CASE 
            WHEN ei.jaccard_percent < 10 THEN '0-10'
            WHEN ei.jaccard_percent < 25 THEN '10-25'
            WHEN ei.jaccard_percent < 50 THEN '25-50'
            WHEN ei.jaccard_percent < 75 THEN '50-75'
            ELSE '75-100'
          END as jaccard_range,
          COUNT(*) as count
        FROM eei_interactions ei
        JOIN eei_methods em ON ei.method_id = em.method_id
        WHERE em.method_type = 'experimental' AND ei.jaccard_percent IS NOT NULL
        GROUP BY jaccard_range
        ORDER BY MIN(ei.jaccard_percent)
      `;

            // Get confidence distribution for predicted
            const confidenceQuery = `
        SELECT 
          CASE 
            WHEN eom.confidence < 0.5 THEN '0.0-0.5'
            WHEN eom.confidence < 0.7 THEN '0.5-0.7'
            WHEN eom.confidence < 0.9 THEN '0.7-0.9'
            ELSE '0.9-1.0'
          END as confidence_range,
          COUNT(*) as count
        FROM eei_orthology_mapping eom
        WHERE eom.confidence IS NOT NULL
        GROUP BY confidence_range
        ORDER BY MIN(eom.confidence)
      `;

            const [methodResult, jaccardResult, confidenceResult] = await Promise.all([
                db.query(methodQuery),
                db.query(jaccardQuery),
                db.query(confidenceQuery)
            ]);

            res.json({
                success: true,
                data: {
                    methods: methodResult.rows,
                    jaccard_distribution: jaccardResult.rows,
                    confidence_distribution: confidenceResult.rows
                }
            });
        } catch (error) {
            handleError(error, res);
        }
    },

    // GET /api/stats/confidence
    async getConfidenceStats(req, res) {
        try {
            const query = `
        SELECT 
          em.method_name,
          COUNT(*) as total_interactions,
          AVG(eom.confidence) as avg_confidence,
          MIN(eom.confidence) as min_confidence,
          MAX(eom.confidence) as max_confidence,
          PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY eom.confidence) as q1_confidence,
          PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY eom.confidence) as median_confidence,
          PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY eom.confidence) as q3_confidence
        FROM eei_interactions ei
        JOIN eei_methods em ON ei.method_id = em.method_id
        JOIN eei_orthology_mapping eom ON ei.eei_id = eom.eei_id
        WHERE em.method_type = 'predicted'
        GROUP BY em.method_name
        ORDER BY avg_confidence DESC
      `;

            const result = await db.query(query);

            res.json({
                success: true,
                data: result.rows
            });
        } catch (error) {
            handleError(error, res);
        }
    }
};

module.exports = statsController;