const db = require('../db/connect');
const { validationResult } = require('express-validator');
const { handleError } = require('../errors/errorHandler');

const searchController = {
    async search(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array()
                });
            }

            const {
                q: searchTerm,
                type = 'any',
                limit = 50,
                offset = 0,
                debug = false
            } = req.query;

            // First, let's check if the search term exists in the database
            let debugInfo = {};

            if (debug === 'true') {
                // Check if exon exists
                const exonCheck = await db.query(
                    'SELECT COUNT(*) as count FROM exons WHERE ensembl_exon_id ILIKE $1',
                    [`%${searchTerm}%`]
                );

                // Check if protein exists
                const proteinCheck = await db.query(
                    'SELECT COUNT(*) as count FROM proteins WHERE uniprot_id ILIKE $1',
                    [`%${searchTerm}%`]
                );

                // Check if gene exists
                const geneCheck = await db.query(
                    'SELECT COUNT(*) as count FROM genes WHERE gene_symbol ILIKE $1',
                    [`%${searchTerm}%`]
                );

                debugInfo = {
                    exons_matching: parseInt(exonCheck.rows[0].count),
                    proteins_matching: parseInt(proteinCheck.rows[0].count),
                    genes_matching: parseInt(geneCheck.rows[0].count)
                };
            }

            // Use the new search function
            const query = `SELECT * FROM search_eei_interactions($1, $2, $3, $4)`;
            const result = await db.query(query, [searchTerm, type, parseInt(limit), parseInt(offset)]);

            // If no results and it's an exact exon search, try alternative approaches
            if (result.rows.length === 0 && type === 'exon') {
                // Try direct lookup
                const directQuery = `
          SELECT 
            ei.eei_id,
            e1.ensembl_exon_id as exon1,
            e2.ensembl_exon_id as exon2,
            p1.uniprot_id as protein1,
            p2.uniprot_id as protein2,
            em.method_name,
            em.method_type,
            ei.pdb_id,
            ei.jaccard_percent,
            eom.confidence
          FROM eei_interactions ei
          JOIN exons e1 ON ei.exon1_id = e1.exon_id
          JOIN exons e2 ON ei.exon2_id = e2.exon_id
          JOIN proteins p1 ON ei.protein1_id = p1.protein_id
          JOIN proteins p2 ON ei.protein2_id = p2.protein_id
          JOIN eei_methods em ON ei.method_id = em.method_id
          LEFT JOIN eei_orthology_mapping eom ON ei.eei_id = eom.eei_id
          WHERE e1.ensembl_exon_id = $1 OR e2.ensembl_exon_id = $1
          ORDER BY ei.jaccard_percent DESC NULLS LAST
          LIMIT $2 OFFSET $3
        `;

                const directResult = await db.query(directQuery, [searchTerm, parseInt(limit), parseInt(offset)]);

                const response = {
                    success: true,
                    data: {
                        search_term: searchTerm,
                        search_type: type,
                        search_method: 'direct_lookup',
                        results: directResult.rows,
                        pagination: {
                            limit: parseInt(limit),
                            offset: parseInt(offset),
                            count: directResult.rows.length,
                            hasMore: directResult.rows.length === parseInt(limit)
                        }
                    }
                };

                if (debug === 'true') {
                    response.debug = debugInfo;
                }

                return res.json(response);
            }

            const response = {
                success: true,
                data: {
                    search_term: searchTerm,
                    search_type: type,
                    search_method: 'function_based',
                    results: result.rows,
                    pagination: {
                        limit: parseInt(limit),
                        offset: parseInt(offset),
                        count: result.rows.length,
                        hasMore: result.rows.length === parseInt(limit)
                    }
                }
            };

            if (debug === 'true') {
                response.debug = debugInfo;
            }

            res.json(response);
        } catch (error) {
            console.error('Search error:', error);
            handleError(error, res);
        }
    },

    // New endpoint to get suggestions
    async getSuggestions(req, res) {
        try {
            const { q: searchTerm, limit = 10 } = req.query;

            if (!searchTerm || searchTerm.length < 2) {
                return res.json({
                    success: true,
                    data: {
                        suggestions: []
                    }
                });
            }

            // Get suggestions from different tables
            const exonQuery = `
        SELECT DISTINCT ensembl_exon_id as value, 'exon' as type
        FROM exons 
        WHERE ensembl_exon_id ILIKE $1
        LIMIT $2
      `;

            const proteinQuery = `
        SELECT DISTINCT uniprot_id as value, 'protein' as type
        FROM proteins 
        WHERE uniprot_id ILIKE $1
        LIMIT $2
      `;

            const geneQuery = `
        SELECT DISTINCT gene_symbol as value, 'gene' as type
        FROM genes 
        WHERE gene_symbol ILIKE $1
        LIMIT $2
      `;

            const searchPattern = `%${searchTerm}%`;
            const suggestionLimit = Math.ceil(parseInt(limit) / 3);

            const [exonResults, proteinResults, geneResults] = await Promise.all([
                db.query(exonQuery, [searchPattern, suggestionLimit]),
                db.query(proteinQuery, [searchPattern, suggestionLimit]),
                db.query(geneQuery, [searchPattern, suggestionLimit])
            ]);

            const suggestions = [
                ...exonResults.rows,
                ...proteinResults.rows,
                ...geneResults.rows
            ].slice(0, parseInt(limit));

            res.json({
                success: true,
                data: {
                    search_term: searchTerm,
                    suggestions: suggestions
                }
            });
        } catch (error) {
            handleError(error, res);
        }
    }
};

module.exports = searchController;