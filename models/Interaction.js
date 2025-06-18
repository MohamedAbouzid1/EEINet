const db = require('../db/connect');

class Interaction {
  static async getExperimental(limit = 50, offset = 0, method = null, minJaccard = null) {
    let filters = [];
    let params = [];
    let paramIndex = 1;

    if (method) {
      filters.push(`em.method_name = $${paramIndex}`);
      params.push(method);
      paramIndex++;
    }

    if (minJaccard) {
      filters.push(`ei.jaccard_percent >= $${paramIndex}`);
      params.push(minJaccard);
      paramIndex++;
    }

    const whereClause = filters.length > 0 ? `AND ${filters.join(' AND ')}` : '';

    // Handle limit for export (null means no limit)
    let limitClause = '';
    if (limit !== null) {
      limitClause = `LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
      params.push(limit, offset);
    }

    const query = `
      SELECT 
        ei.eei_id,
        e1.ensembl_exon_id as exon1,
        e2.ensembl_exon_id as exon2,
        p1.uniprot_id as protein1,
        p2.uniprot_id as protein2,
        em.method_name,
        ei.pdb_id,
        ei.jaccard_percent,
        ei.aa1,
        ei.aa2,
        ei.created_at
      FROM eei_interactions ei
      JOIN exons e1 ON ei.exon1_id = e1.exon_id
      JOIN exons e2 ON ei.exon2_id = e2.exon_id
      JOIN proteins p1 ON ei.protein1_id = p1.protein_id
      JOIN proteins p2 ON ei.protein2_id = p2.protein_id
      JOIN eei_methods em ON ei.method_id = em.method_id
      WHERE em.method_type = 'experimental'
      ${whereClause}
      ORDER BY ei.jaccard_percent DESC NULLS LAST, ei.eei_id
      ${limitClause}
    `;

    const result = await db.query(query, params);
    return result.rows;
  }

  static async getPredicted(limit = 50, offset = 0, method = null, minConfidence = null) {
    let filters = [];
    let params = [];
    let paramIndex = 1;

    if (method) {
      filters.push(`em.method_name = $${paramIndex}`);
      params.push(method);
      paramIndex++;
    }

    if (minConfidence) {
      filters.push(`eom.confidence >= $${paramIndex}`);
      params.push(minConfidence);
      paramIndex++;
    }

    const whereClause = filters.length > 0 ? `AND ${filters.join(' AND ')}` : '';

    // Handle limit for export (null means no limit)
    let limitClause = '';
    if (limit !== null) {
      limitClause = `LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
      params.push(limit, offset);
    }

    const query = `
      SELECT 
        ei.eei_id,
        e1.ensembl_exon_id as exon1,
        e2.ensembl_exon_id as exon2,
        p1.uniprot_id as protein1,
        p2.uniprot_id as protein2,
        em.method_name,
        ei.pdb_id,
        ei.jaccard_percent,
        ei.aa1,
        ei.aa2,
        eom.confidence,
        eom.identity1,
        eom.identity2,
        eom.mouse_exon1_coordinates,
        eom.mouse_exon2_coordinates,
        ei.created_at
      FROM eei_interactions ei
      JOIN exons e1 ON ei.exon1_id = e1.exon_id
      JOIN exons e2 ON ei.exon2_id = e2.exon_id
      JOIN proteins p1 ON ei.protein1_id = p1.protein_id
      JOIN proteins p2 ON ei.protein2_id = p2.protein_id
      JOIN eei_methods em ON ei.method_id = em.method_id
      JOIN eei_orthology_mapping eom ON ei.eei_id = eom.eei_id
      WHERE em.method_type = 'predicted'
      ${whereClause}
      ORDER BY eom.confidence DESC, ei.eei_id
      ${limitClause}
    `;

    const result = await db.query(query, params);
    return result.rows;
  }

  static async getById(interactionId) {
    const query = `
      SELECT 
        ei.*,
        e1.ensembl_exon_id as exon1,
        e2.ensembl_exon_id as exon2,
        p1.uniprot_id as protein1,
        p2.uniprot_id as protein2,
        em.method_name,
        em.method_type,
        eom.confidence,
        eom.identity1,
        eom.identity2,
        eom.mouse_exon1_coordinates,
        eom.mouse_exon2_coordinates,
        epa.free_energy,
        epa.buried_area,
        epa.hydrogen_bonds,
        epa.salt_bridges,
        eea.cs_score,
        eea.cr_score
      FROM eei_interactions ei
      JOIN exons e1 ON ei.exon1_id = e1.exon_id
      JOIN exons e2 ON ei.exon2_id = e2.exon_id
      JOIN proteins p1 ON ei.protein1_id = p1.protein_id
      JOIN proteins p2 ON ei.protein2_id = p2.protein_id
      JOIN eei_methods em ON ei.method_id = em.method_id
      LEFT JOIN eei_orthology_mapping eom ON ei.eei_id = eom.eei_id
      LEFT JOIN eei_pisa_attributes epa ON ei.eei_id = epa.eei_id
      LEFT JOIN eei_eppic_attributes eea ON ei.eei_id = eea.eei_id
      WHERE ei.eei_id = $1
    `;

    const result = await db.query(query, [interactionId]);
    return result.rows[0] || null;
  }
}

module.exports = Interaction;