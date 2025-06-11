const db = require('../db/connect');

class Protein {
  static async findById(proteinId) {
    const query = `
      SELECT 
        p.protein_id,
        p.uniprot_id,
        p.protein_name,
        p.sequence_length,
        p.molecular_weight,
        p.description,
        g.gene_symbol,
        g.gene_name,
        o.name as organism
      FROM proteins p
      LEFT JOIN genes g ON p.gene_id = g.gene_id
      LEFT JOIN organisms o ON g.organism_id = o.organism_id
      WHERE p.uniprot_id = $1 OR p.protein_id = $1::integer
    `;

    const result = await db.query(query, [proteinId]);
    return result.rows[0] || null;
  }

  static async getExons(proteinId, limit = 100, offset = 0) {
    const query = `
      SELECT DISTINCT
        e.exon_id,
        e.ensembl_exon_id,
        e.exon_number,
        e.chromosome,
        e.strand,
        e.exon_start,
        e.exon_end,
        e.exon_length,
        COUNT(ei.eei_id) as interaction_count
      FROM proteins p
      JOIN eei_interactions ei ON (ei.protein1_id = p.protein_id OR ei.protein2_id = p.protein_id)
      JOIN exons e ON (ei.exon1_id = e.exon_id OR ei.exon2_id = e.exon_id)
      WHERE p.uniprot_id = $1 OR p.protein_id = $1::integer
      GROUP BY e.exon_id, e.ensembl_exon_id, e.exon_number, e.chromosome, e.strand, e.exon_start, e.exon_end, e.exon_length
      ORDER BY e.exon_number NULLS LAST, e.exon_start
      LIMIT $2 OFFSET $3
    `;

    const result = await db.query(query, [proteinId, limit, offset]);
    return result.rows;
  }

  static async getInteractions(proteinId, limit = 50, offset = 0, method = null) {
    let methodFilter = '';
    let params = [proteinId, proteinId, limit, offset];

    if (method) {
      methodFilter = 'AND em.method_name = $5';
      params.push(method);
    }

    const query = `
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
        ei.aa1,
        ei.aa2,
        eom.confidence
      FROM eei_interactions ei
      JOIN exons e1 ON ei.exon1_id = e1.exon_id
      JOIN exons e2 ON ei.exon2_id = e2.exon_id
      JOIN proteins p1 ON ei.protein1_id = p1.protein_id
      JOIN proteins p2 ON ei.protein2_id = p2.protein_id
      JOIN eei_methods em ON ei.method_id = em.method_id
      LEFT JOIN eei_orthology_mapping eom ON ei.eei_id = eom.eei_id
      WHERE (p1.uniprot_id = $1 OR p1.protein_id = $1::integer)
         OR (p2.uniprot_id = $2 OR p2.protein_id = $2::integer)
      ${methodFilter}
      ORDER BY 
        CASE WHEN eom.confidence IS NOT NULL THEN eom.confidence ELSE 1.0 END DESC,
        ei.jaccard_percent DESC NULLS LAST
      LIMIT $3 OFFSET $4
    `;

    const result = await db.query(query, params);
    return result.rows;
  }
}

module.exports = Protein;