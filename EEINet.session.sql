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