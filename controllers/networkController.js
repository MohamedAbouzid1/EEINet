const db = require('../db/connect');
const { validationResult } = require('express-validator');
const { handleError } = require('../errors/errorHandler');
const { StatusCodes } = require('http-status-codes');

const networkController = {
    // GET /api/network/gene/{gene_symbol}
    async getGeneNetwork(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    errors: errors.array()
                });
            }

            const { gene_symbol } = req.params;
            const {
                limit = 100,
                offset = 0,
                method_filter = null,
                min_confidence = null,
                min_jaccard = null,
                max_interactions = 500
            } = req.query;

            // Use the existing database function
            const interactions = await db.query(`
                SELECT * FROM get_gene_eei_network($1, $2)
            `, [gene_symbol, parseInt(max_interactions)]);

            // Apply additional filters
            let filteredInteractions = interactions.rows;

            if (method_filter) {
                filteredInteractions = filteredInteractions.filter(row =>
                    row.method_name === method_filter
                );
            }

            if (min_confidence) {
                filteredInteractions = filteredInteractions.filter(row =>
                    row.confidence >= parseFloat(min_confidence)
                );
            }

            if (min_jaccard) {
                filteredInteractions = filteredInteractions.filter(row =>
                    row.jaccard_percent >= parseFloat(min_jaccard)
                );
            }

            // Apply pagination
            const startIndex = parseInt(offset);
            const endIndex = startIndex + parseInt(limit);
            const paginatedResults = filteredInteractions.slice(startIndex, endIndex);

            res.json({
                success: true,
                data: {
                    gene_symbol: gene_symbol,
                    interactions: paginatedResults,
                    pagination: {
                        total: filteredInteractions.length,
                        limit: parseInt(limit),
                        offset: parseInt(offset),
                        hasMore: endIndex < filteredInteractions.length
                    },
                    network_stats: {
                        total_interactions: filteredInteractions.length,
                        unique_genes: new Set([
                            ...filteredInteractions.map(r => r.source_gene),
                            ...filteredInteractions.map(r => r.target_gene)
                        ]).size,
                        unique_proteins: new Set([
                            ...filteredInteractions.map(r => r.source_protein),
                            ...filteredInteractions.map(r => r.target_protein)
                        ]).size,
                        methods: [...new Set(filteredInteractions.map(r => r.method_name))]
                    }
                }
            });
        } catch (error) {
            handleError(error, res);
        }
    },

    // GET /api/network/interactions/subgraph
    async getInteractionSubgraph(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    errors: errors.array()
                });
            }

            const {
                genes = '',
                proteins = '',
                exons = '',
                method_filter = null,
                min_confidence = 0,
                min_jaccard = 0,
                max_interactions = 200
            } = req.query;

            // Parse input lists
            const geneList = genes ? genes.split(',').map(g => g.trim()).filter(g => g) : [];
            const proteinList = proteins ? proteins.split(',').map(p => p.trim()).filter(p => p) : [];
            const exonList = exons ? exons.split(',').map(e => e.trim()).filter(e => e) : [];

            if (geneList.length === 0 && proteinList.length === 0 && exonList.length === 0) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    message: 'At least one gene, protein, or exon must be specified'
                });
            }

            let whereConditions = [];
            let params = [];
            let paramIndex = 1;

            // Build WHERE conditions
            if (geneList.length > 0) {
                const genePlaceholders = geneList.map(() => `${paramIndex++}`).join(',');
                whereConditions.push(`(g1.gene_symbol IN (${genePlaceholders}) OR g2.gene_symbol IN (${genePlaceholders}))`);
                params.push(...geneList, ...geneList);
            }

            if (proteinList.length > 0) {
                const proteinPlaceholders = proteinList.map(() => `${paramIndex++}`).join(',');
                whereConditions.push(`(p1.uniprot_id IN (${proteinPlaceholders}) OR p2.uniprot_id IN (${proteinPlaceholders}))`);
                params.push(...proteinList, ...proteinList);
            }

            if (exonList.length > 0) {
                const exonPlaceholders = exonList.map(() => `${paramIndex++}`).join(',');
                whereConditions.push(`(e1.ensembl_exon_id IN (${exonPlaceholders}) OR e2.ensembl_exon_id IN (${exonPlaceholders}))`);
                params.push(...exonList, ...exonList);
            }

            // Add method filter
            if (method_filter) {
                whereConditions.push(`em.method_name = ${paramIndex++}`);
                params.push(method_filter);
            }

            // Add confidence filter
            if (min_confidence > 0) {
                whereConditions.push(`(eom.confidence IS NULL OR eom.confidence >= ${paramIndex++})`);
                params.push(min_confidence);
            }

            // Add jaccard filter
            if (min_jaccard > 0) {
                whereConditions.push(`(ei.jaccard_percent IS NULL OR ei.jaccard_percent >= ${paramIndex++})`);
                params.push(min_jaccard);
            }

            const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

            const query = `
                SELECT 
                    ei.eei_id,
                    e1.ensembl_exon_id as exon1,
                    e2.ensembl_exon_id as exon2,
                    p1.uniprot_id as protein1,
                    p2.uniprot_id as protein2,
                    g1.gene_symbol as gene1,
                    g2.gene_symbol as gene2,
                    em.method_name,
                    em.method_type,
                    ei.pdb_id,
                    ei.jaccard_percent,
                    eom.confidence,
                    ei.aa1,
                    ei.aa2,
                    ei.created_at
                FROM eei_interactions ei
                JOIN exons e1 ON ei.exon1_id = e1.exon_id
                JOIN exons e2 ON ei.exon2_id = e2.exon_id
                JOIN proteins p1 ON ei.protein1_id = p1.protein_id
                JOIN proteins p2 ON ei.protein2_id = p2.protein_id
                LEFT JOIN genes g1 ON e1.gene_id = g1.gene_id
                LEFT JOIN genes g2 ON e2.gene_id = g2.gene_id
                JOIN eei_methods em ON ei.method_id = em.method_id
                LEFT JOIN eei_orthology_mapping eom ON ei.eei_id = eom.eei_id
                ${whereClause}
                ORDER BY 
                    CASE WHEN eom.confidence IS NOT NULL THEN eom.confidence ELSE 1.0 END DESC,
                    ei.jaccard_percent DESC NULLS LAST
                LIMIT ${paramIndex}
            `;

            params.push(parseInt(max_interactions));

            const result = await db.query(query, params);
            const interactions = result.rows;

            // Calculate network statistics
            const allGenes = new Set([
                ...interactions.map(r => r.gene1),
                ...interactions.map(r => r.gene2)
            ]);
            const allProteins = new Set([
                ...interactions.map(r => r.protein1),
                ...interactions.map(r => r.protein2)
            ]);
            const allExons = new Set([
                ...interactions.map(r => r.exon1),
                ...interactions.map(r => r.exon2)
            ]);

            res.json({
                success: true,
                data: {
                    interactions: interactions,
                    network_stats: {
                        total_interactions: interactions.length,
                        unique_exons: allExons.size,
                        unique_genes: allGenes.size,
                        unique_proteins: allProteins.size,
                        experimental_interactions: interactions.filter(i => i.method_type === 'experimental').length,
                        predicted_interactions: interactions.filter(i => i.method_type === 'predicted').length,
                        methods: [...new Set(interactions.map(i => i.method_name))],
                        confidence_range: {
                            min: Math.min(...interactions.filter(i => i.confidence).map(i => i.confidence)),
                            max: Math.max(...interactions.filter(i => i.confidence).map(i => i.confidence)),
                            avg: interactions.filter(i => i.confidence).reduce((sum, i) => sum + i.confidence, 0) /
                                interactions.filter(i => i.confidence).length || 0
                        },
                        jaccard_range: {
                            min: Math.min(...interactions.filter(i => i.jaccard_percent).map(i => i.jaccard_percent)),
                            max: Math.max(...interactions.filter(i => i.jaccard_percent).map(i => i.jaccard_percent)),
                            avg: interactions.filter(i => i.jaccard_percent).reduce((sum, i) => sum + i.jaccard_percent, 0) /
                                interactions.filter(i => i.jaccard_percent).length || 0
                        }
                    },
                    filters_applied: {
                        genes: geneList,
                        proteins: proteinList,
                        exons: exonList,
                        method_filter: method_filter,
                        min_confidence: min_confidence,
                        min_jaccard: min_jaccard,
                        max_interactions: max_interactions
                    }
                }
            });
        } catch (error) {
            handleError(error, res);
        }
    },

    // GET /api/network/stats
    async getNetworkStats(req, res) {
        try {
            const query = `
                SELECT 
                    COUNT(*) as total_interactions,
                    COUNT(DISTINCT ei.exon1_id) + COUNT(DISTINCT ei.exon2_id) as total_exons,
                    COUNT(DISTINCT ei.protein1_id) + COUNT(DISTINCT ei.protein2_id) as total_proteins,
                    COUNT(DISTINCT COALESCE(g1.gene_id, g2.gene_id)) as total_genes,
                    COUNT(CASE WHEN em.method_type = 'experimental' THEN 1 END) as experimental_interactions,
                    COUNT(CASE WHEN em.method_type = 'predicted' THEN 1 END) as predicted_interactions,
                    COUNT(DISTINCT em.method_name) as total_methods,
                    COUNT(DISTINCT ei.pdb_id) as unique_pdb_structures
                FROM eei_interactions ei
                JOIN exons e1 ON ei.exon1_id = e1.exon_id
                JOIN exons e2 ON ei.exon2_id = e2.exon_id
                JOIN proteins p1 ON ei.protein1_id = p1.protein_id
                JOIN proteins p2 ON ei.protein2_id = p2.protein_id
                LEFT JOIN genes g1 ON e1.gene_id = g1.gene_id
                LEFT JOIN genes g2 ON e2.gene_id = g2.gene_id
                JOIN eei_methods em ON ei.method_id = em.method_id
            `;

            const result = await db.query(query);
            const stats = result.rows[0];

            // Get method distribution
            const methodQuery = `
                SELECT 
                    em.method_name,
                    em.method_type,
                    COUNT(*) as interaction_count
                FROM eei_interactions ei
                JOIN eei_methods em ON ei.method_id = em.method_id
                GROUP BY em.method_name, em.method_type
                ORDER BY interaction_count DESC
            `;

            const methodResult = await db.query(methodQuery);

            res.json({
                success: true,
                data: {
                    overview: {
                        total_interactions: parseInt(stats.total_interactions),
                        total_exons: parseInt(stats.total_exons),
                        total_proteins: parseInt(stats.total_proteins),
                        total_genes: parseInt(stats.total_genes),
                        experimental_interactions: parseInt(stats.experimental_interactions),
                        predicted_interactions: parseInt(stats.predicted_interactions),
                        total_methods: parseInt(stats.total_methods),
                        unique_pdb_structures: parseInt(stats.unique_pdb_structures)
                    },
                    method_distribution: methodResult.rows
                }
            });
        } catch (error) {
            handleError(error, res);
        }
    },

    // GET /api/network/protein/{protein_id}
    async getProteinNetwork(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    errors: errors.array()
                });
            }

            const { protein_id } = req.params;
            const {
                limit = 100,
                offset = 0,
                method_filter = null,
                min_confidence = null,
                min_jaccard = null
            } = req.query;

            let methodFilter = '';
            let params = [protein_id, protein_id];
            let paramIndex = 3;

            if (method_filter) {
                methodFilter = `AND em.method_name = $${paramIndex}`;
                params.push(method_filter);
                paramIndex++;
            }

            const query = `
                SELECT 
                    ei.eei_id,
                    e1.ensembl_exon_id as source_exon,
                    e2.ensembl_exon_id as target_exon,
                    p1.uniprot_id as source_protein,
                    p2.uniprot_id as target_protein,
                    g1.gene_symbol as source_gene,
                    g2.gene_symbol as target_gene,
                    em.method_name,
                    em.method_type,
                    ei.pdb_id,
                    ei.jaccard_percent,
                    eom.confidence,
                    ei.aa1,
                    ei.aa2
                FROM eei_interactions ei
                JOIN exons e1 ON ei.exon1_id = e1.exon_id
                JOIN exons e2 ON ei.exon2_id = e2.exon_id
                JOIN proteins p1 ON ei.protein1_id = p1.protein_id
                JOIN proteins p2 ON ei.protein2_id = p2.protein_id
                LEFT JOIN genes g1 ON e1.gene_id = g1.gene_id
                LEFT JOIN genes g2 ON e2.gene_id = g2.gene_id
                JOIN eei_methods em ON ei.method_id = em.method_id
                LEFT JOIN eei_orthology_mapping eom ON ei.eei_id = eom.eei_id
                WHERE (p1.uniprot_id = $1 OR p2.uniprot_id = $2)
                ${methodFilter}
                ORDER BY 
                    CASE WHEN eom.confidence IS NOT NULL THEN eom.confidence ELSE 1.0 END DESC,
                    ei.jaccard_percent DESC NULLS LAST
            `;

            const result = await db.query(query, params);
            let interactions = result.rows;

            // Apply confidence and jaccard filters
            if (min_confidence) {
                interactions = interactions.filter(row =>
                    row.confidence && row.confidence >= parseFloat(min_confidence)
                );
            }

            if (min_jaccard) {
                interactions = interactions.filter(row =>
                    row.jaccard_percent && row.jaccard_percent >= parseFloat(min_jaccard)
                );
            }

            // Apply pagination
            const startIndex = parseInt(offset);
            const endIndex = startIndex + parseInt(limit);
            const paginatedResults = interactions.slice(startIndex, endIndex);

            // Calculate network statistics
            const allGenes = new Set([
                ...interactions.map(r => r.source_gene),
                ...interactions.map(r => r.target_gene)
            ]);
            const allProteins = new Set([
                ...interactions.map(r => r.source_protein),
                ...interactions.map(r => r.target_protein)
            ]);
            const allExons = new Set([
                ...interactions.map(r => r.source_exon),
                ...interactions.map(r => r.target_exon)
            ]);

            res.json({
                success: true,
                data: {
                    protein_id: protein_id,
                    interactions: paginatedResults,
                    pagination: {
                        total: interactions.length,
                        limit: parseInt(limit),
                        offset: parseInt(offset),
                        hasMore: endIndex < interactions.length
                    },
                    network_stats: {
                        total_interactions: interactions.length,
                        unique_genes: allGenes.size,
                        unique_proteins: allProteins.size,
                        unique_exons: allExons.size,
                        methods: [...new Set(interactions.map(r => r.method_name))],
                        experimental_interactions: interactions.filter(i => i.method_type === 'experimental').length,
                        predicted_interactions: interactions.filter(i => i.method_type === 'predicted').length,
                        confidence_range: {
                            min: Math.min(...interactions.filter(i => i.confidence).map(i => i.confidence)),
                            max: Math.max(...interactions.filter(i => i.confidence).map(i => i.confidence)),
                            avg: interactions.filter(i => i.confidence).reduce((sum, i) => sum + i.confidence, 0) /
                                (interactions.filter(i => i.confidence).length || 1)
                        },
                        jaccard_range: {
                            min: Math.min(...interactions.filter(i => i.jaccard_percent).map(i => i.jaccard_percent)),
                            max: Math.max(...interactions.filter(i => i.jaccard_percent).map(i => i.jaccard_percent)),
                            avg: interactions.filter(i => i.jaccard_percent).reduce((sum, i) => sum + i.jaccard_percent, 0) /
                                (interactions.filter(i => i.jaccard_percent).length || 1)
                        }
                    }
                }
            });
        } catch (error) {
            handleError(error, res);
        }
    }
};

module.exports = networkController;