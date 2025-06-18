SELECT *
FROM exons
WHERE ensembl_exon_id = 'ENSE00001126122';
SELECT ensembl_exon_id
FROM exons
LIMIT 10;
SELECT *
FROM web_search_eei('ENSE00001126122', 'any', NULL, NULL, 10, 0);
SELECT *
FROM get_eei_statistics();
SELECT *
FROM eei_methods;
-- get the function definition of the export_eei_by_method function
SELECT proname,
    pg_catalog.pg_get_functiondef(p.oid)
FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE p.proname = 'export_eei_by_method';
SELECT *
FROM export_eei_by_method();
SELECT DISTINCT method_name
FROM eei_methods;
SELECT COUNT(*)
FROM eei_interactions;
COPY temp_genes_import (
    ensembl_gene_id,
    gene_symbol,
    gene_biotype,
    chromosome,
    strand,
    gene_start,
    gene_end
)
FROM '/cosybio/project/mabouzid/EEI_networks/EEI-Conservation-main/data/ensembl_gtf/human_genes.csv' WITH (FORMAT CSV, HEADER TRUE);
INSERT INTO genes (
        gene_symbol,
        gene_name,
        organism_id,
        description,
        chromosome,
        strand,
        gene_start,
        gene_end,
        ensembl_gene_id
    )
SELECT CASE
        WHEN TRIM(gene_symbol) = ''
        OR gene_symbol IS NULL THEN ensembl_gene_id -- Use Ensembl ID as symbol if no symbol provided
        ELSE TRIM(gene_symbol)
    END as gene_symbol,
    CASE
        WHEN TRIM(gene_symbol) = ''
        OR gene_symbol IS NULL THEN NULL
        ELSE TRIM(gene_symbol)
    END as gene_name,
    6 as organism_id,
    -- Assuming human organism_id = 1, adjust as needed
    gene_biotype as description,
    chromosome,
    CASE
        WHEN strand = '+' THEN '+'
        WHEN strand = '-' THEN '-'
        WHEN strand = '1' THEN '+'
        WHEN strand = '-1' THEN '-'
        ELSE strand
    END as strand,
    gene_start,
    gene_end,
    ensembl_gene_id
FROM temp_genes_import ON CONFLICT (gene_symbol, organism_id) DO NOTHING;
COPY temp_exon_gene_mapping (
    ensembl_exon_id,
    ensembl_gene_id,
    gene_name,
    gene_biotype,
    exon_number,
    transcript_id,
    chromosome,
    strand,
    exon_start,
    exon_end
)
FROM '/cosybio/project/mabouzid/EEI_networks/EEI-Conservation-main/data/ensembl_gtf/exon_gene_mapping.csv' WITH (FORMAT CSV, HEADER TRUE);
SELECT COUNT(*)
FROM export_eei_by_method('predicted_EPPIC');