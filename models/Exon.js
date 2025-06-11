const db = require("../db/connect");

class Exon {
  static async findById(exonId) {
    const query = `
        SELECT 
          e.exon_id,
          e.ensembl_exon_id,
          e.gene_id,
          e.exon_number,
          e.chromosome,
          e.strand,
          e.exon_start,
          e.exon_end,
          e.exon_length,
          e.sequence,
          g.gene_symbol,
          g.gene_name,
          o.name as organism
        FROM exons e
        LEFT JOIN genes g ON e.gene_id = g.gene_id
        LEFT JOIN organisms o ON g.organism_id = o.organism_id
        WHERE e.ensembl_exon_id = $1 OR e.exon_id = $1::integer
      `;

    const result = await db.query(query, [exonId]);
    return result.rows[0] || null;
  }

  static async getInteractions(exonId, limit = 50, offset = 0, method = null) {
    let methodFilter = '';
    let params = [exonId, exonId, limit, offset];

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
          CASE 
            WHEN eom.confidence IS NOT NULL THEN eom.confidence 
            ELSE NULL 
          END as confidence
        FROM eei_interactions ei
        JOIN exons e1 ON ei.exon1_id = e1.exon_id
        JOIN exons e2 ON ei.exon2_id = e2.exon_id
        JOIN proteins p1 ON ei.protein1_id = p1.protein_id
        JOIN proteins p2 ON ei.protein2_id = p2.protein_id
        JOIN eei_methods em ON ei.method_id = em.method_id
        LEFT JOIN eei_orthology_mapping eom ON ei.eei_id = eom.eei_id
        WHERE (e1.ensembl_exon_id = $1 OR e1.exon_id = $1::integer)
           OR (e2.ensembl_exon_id = $2 OR e2.exon_id = $2::integer)
        ${methodFilter}
        ORDER BY 
          CASE WHEN eom.confidence IS NOT NULL THEN eom.confidence ELSE 1.0 END DESC,
          ei.jaccard_percent DESC NULLS LAST
        LIMIT $3 OFFSET $4
      `;

    const result = await db.query(query, params);
    return result.rows;
  }

  static async getInteractionCount(exonId, method = null) {
    let methodFilter = '';
    let params = [exonId, exonId];

    if (method) {
      methodFilter = 'AND em.method_name = $3';
      params.push(method);
    }

    const query = `
        SELECT COUNT(*) as count
        FROM eei_interactions ei
        JOIN exons e1 ON ei.exon1_id = e1.exon_id
        JOIN exons e2 ON ei.exon2_id = e2.exon_id
        JOIN eei_methods em ON ei.method_id = em.method_id
        WHERE (e1.ensembl_exon_id = $1 OR e1.exon_id = $1::integer)
           OR (e2.ensembl_exon_id = $2 OR e2.exon_id = $2::integer)
        ${methodFilter}
      `;

    const result = await db.query(query, params);
    return parseInt(result.rows[0].count);
  }
}

module.exports = Exon;