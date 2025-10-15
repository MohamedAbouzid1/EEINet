--
-- PostgreSQL database dump
--

-- Dumped from database version 15.13
-- Dumped by pg_dump version 15.13

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: analyze_contact_eei_data(); Type: FUNCTION; Schema: public; Owner: bbf3630
--

CREATE FUNCTION public.analyze_contact_eei_data() RETURNS TABLE(issue_type character varying, count bigint, examples text)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    
    -- Check for exons with different lengths
    SELECT 
        'Exons with multiple lengths'::VARCHAR(100),
        COUNT(*)::BIGINT,
        string_agg(DISTINCT exon_id || ':' || lengths, ', ' ORDER BY exon_id || ':' || lengths)
    FROM (
        SELECT 
            exon1 as exon_id,
            string_agg(DISTINCT exon1_length::text, '|' ORDER BY exon1_length::text) as lengths
        FROM temp_contact_eei 
        WHERE exon1 IS NOT NULL
        GROUP BY exon1
        HAVING COUNT(DISTINCT exon1_length) > 1
        UNION
        SELECT 
            exon2 as exon_id,
            string_agg(DISTINCT exon2_length::text, '|' ORDER BY exon2_length::text) as lengths
        FROM temp_contact_eei 
        WHERE exon2 IS NOT NULL
        GROUP BY exon2
        HAVING COUNT(DISTINCT exon2_length) > 1
    ) inconsistent_exons
    
    UNION ALL
    
    -- Check for NULL values
    SELECT 
        'Rows with NULL exon1'::VARCHAR(100),
        COUNT(*)::BIGINT,
        string_agg(DISTINCT protein1, ', ' ORDER BY protein1) 
    FROM temp_contact_eei 
    WHERE exon1 IS NULL
    
    UNION ALL
    
    SELECT 
        'Rows with NULL exon2'::VARCHAR(100),
        COUNT(*)::BIGINT,
        string_agg(DISTINCT protein1, ', ' ORDER BY protein1)
    FROM temp_contact_eei 
    WHERE exon2 IS NULL
    
    UNION ALL
    
    -- Check total valid rows
    SELECT 
        'Valid rows (no NULLs)'::VARCHAR(100),
        COUNT(*)::BIGINT,
        'Ready for processing'
    FROM temp_contact_eei 
    WHERE exon1 IS NOT NULL 
      AND exon2 IS NOT NULL 
      AND protein1 IS NOT NULL 
      AND protein1_1 IS NOT NULL;
END;
$$;


ALTER FUNCTION public.analyze_contact_eei_data() OWNER TO bbf3630;

--
-- Name: analyze_eppic_eei_data(); Type: FUNCTION; Schema: public; Owner: bbf3630
--

CREATE FUNCTION public.analyze_eppic_eei_data() RETURNS TABLE(issue_type character varying, count bigint, examples text)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    
    -- Check for NULL values in critical fields
    SELECT 
        'Rows with NULL exon1'::VARCHAR(100),
        COUNT(*)::BIGINT,
        string_agg(DISTINCT protein1, ', ' ORDER BY protein1) 
    FROM temp_eppic_eei 
    WHERE exon1 IS NULL
    
    UNION ALL
    
    SELECT 
        'Rows with NULL exon2'::VARCHAR(100),
        COUNT(*)::BIGINT,
        string_agg(DISTINCT protein1, ', ' ORDER BY protein1)
    FROM temp_eppic_eei 
    WHERE exon2 IS NULL
    
    UNION ALL
    
    SELECT 
        'Rows with NULL protein1'::VARCHAR(100),
        COUNT(*)::BIGINT,
        'NULL protein1 cases'
    FROM temp_eppic_eei 
    WHERE protein1 IS NULL
    
    UNION ALL
    
    SELECT 
        'Rows with NULL protein2'::VARCHAR(100),
        COUNT(*)::BIGINT,
        'NULL protein2 cases'
    FROM temp_eppic_eei 
    WHERE protein2 IS NULL
    
    UNION ALL
    
    SELECT 
        'Rows with NULL pdb_id'::VARCHAR(100),
        COUNT(*)::BIGINT,
        'NULL PDB ID cases'
    FROM temp_eppic_eei 
    WHERE pdb_id IS NULL
    
    UNION ALL
    
    -- Check total valid rows
    SELECT 
        'Valid rows (no critical NULLs)'::VARCHAR(100),
        COUNT(*)::BIGINT,
        'Ready for processing'
    FROM temp_eppic_eei 
    WHERE exon1 IS NOT NULL 
      AND exon2 IS NOT NULL 
      AND protein1 IS NOT NULL 
      AND protein2 IS NOT NULL
      AND pdb_id IS NOT NULL
    
    UNION ALL
    
    -- Check CS score range
    SELECT 
        'CS Score range'::VARCHAR(100),
        1::BIGINT,
        CONCAT('Min: ', MIN(cs_score)::TEXT, ', Max: ', MAX(cs_score)::TEXT, ', Avg: ', ROUND(AVG(cs_score), 2)::TEXT)
    FROM temp_eppic_eei 
    WHERE cs_score IS NOT NULL
    
    UNION ALL
    
    -- Check CR score range
    SELECT 
        'CR Score range'::VARCHAR(100),
        1::BIGINT,
        CONCAT('Min: ', MIN(cr_score)::TEXT, ', Max: ', MAX(cr_score)::TEXT, ', Avg: ', ROUND(AVG(cr_score), 2)::TEXT)
    FROM temp_eppic_eei 
    WHERE cr_score IS NOT NULL
    
    UNION ALL
    
    SELECT 
        'Unique PDB structures'::VARCHAR(100),
        COUNT(DISTINCT pdb_id)::BIGINT,
        string_agg(DISTINCT pdb_id, ', ' ORDER BY pdb_id)
    FROM temp_eppic_eei 
    WHERE pdb_id IS NOT NULL;
END;
$$;


ALTER FUNCTION public.analyze_eppic_eei_data() OWNER TO bbf3630;

--
-- Name: analyze_pisa_eei_data(); Type: FUNCTION; Schema: public; Owner: bbf3630
--

CREATE FUNCTION public.analyze_pisa_eei_data() RETURNS TABLE(issue_type character varying, count bigint, examples text)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    
    -- Check for NULL values in critical fields
    SELECT 
        'Rows with NULL exon1'::VARCHAR(100),
        COUNT(*)::BIGINT,
        string_agg(DISTINCT protein1, ', ' ORDER BY protein1) 
    FROM temp_pisa_eei 
    WHERE exon1 IS NULL
    
    UNION ALL
    
    SELECT 
        'Rows with NULL exon2'::VARCHAR(100),
        COUNT(*)::BIGINT,
        string_agg(DISTINCT protein1, ', ' ORDER BY protein1)
    FROM temp_pisa_eei 
    WHERE exon2 IS NULL
    
    UNION ALL
    
    SELECT 
        'Rows with NULL protein1'::VARCHAR(100),
        COUNT(*)::BIGINT,
        'NULL protein1 cases'
    FROM temp_pisa_eei 
    WHERE protein1 IS NULL
    
    UNION ALL
    
    SELECT 
        'Rows with NULL protein2'::VARCHAR(100),
        COUNT(*)::BIGINT,
        'NULL protein2 cases'
    FROM temp_pisa_eei 
    WHERE protein2 IS NULL
    
    UNION ALL
    
    SELECT 
        'Rows with NULL pdb_id'::VARCHAR(100),
        COUNT(*)::BIGINT,
        'NULL PDB ID cases'
    FROM temp_pisa_eei 
    WHERE pdb_id IS NULL
    
    UNION ALL
    
    -- Check total valid rows
    SELECT 
        'Valid rows (no critical NULLs)'::VARCHAR(100),
        COUNT(*)::BIGINT,
        'Ready for processing'
    FROM temp_pisa_eei 
    WHERE exon1 IS NOT NULL 
      AND exon2 IS NOT NULL 
      AND protein1 IS NOT NULL 
      AND protein2 IS NOT NULL
      AND pdb_id IS NOT NULL
    
    UNION ALL
    
    -- Check data ranges
    SELECT 
        'Free energy range'::VARCHAR(100),
        1::BIGINT,
        CONCAT('Min: ', MIN(free_energy)::TEXT, ', Max: ', MAX(free_energy)::TEXT, ', Avg: ', ROUND(AVG(free_energy), 2)::TEXT)
    FROM temp_pisa_eei 
    WHERE free_energy IS NOT NULL
    
    UNION ALL
    
    SELECT 
        'Unique PDB structures'::VARCHAR(100),
        COUNT(DISTINCT pdb_id)::BIGINT,
        string_agg(DISTINCT pdb_id, ', ' ORDER BY pdb_id)
    FROM temp_pisa_eei 
    WHERE pdb_id IS NOT NULL;
END;
$$;


ALTER FUNCTION public.analyze_pisa_eei_data() OWNER TO bbf3630;

--
-- Name: analyze_predicted_contact_eei_data(); Type: FUNCTION; Schema: public; Owner: bbf3630
--

CREATE FUNCTION public.analyze_predicted_contact_eei_data() RETURNS TABLE(issue_type character varying, count bigint, examples text)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    
    -- Check for NULL values in critical fields
    SELECT 
        'Rows with NULL exon1'::VARCHAR(100),
        COUNT(*)::BIGINT,
        string_agg(DISTINCT protein1, ', ' ORDER BY protein1) 
    FROM temp_predicted_contact_eei 
    WHERE exon1 IS NULL
    
    UNION ALL
    
    SELECT 
        'Rows with NULL exon2'::VARCHAR(100),
        COUNT(*)::BIGINT,
        string_agg(DISTINCT protein1, ', ' ORDER BY protein1)
    FROM temp_predicted_contact_eei 
    WHERE exon2 IS NULL
    
    UNION ALL
    
    SELECT 
        'Rows with NULL protein1'::VARCHAR(100),
        COUNT(*)::BIGINT,
        'NULL protein1 cases'
    FROM temp_predicted_contact_eei 
    WHERE protein1 IS NULL
    
    UNION ALL
    
    SELECT 
        'Rows with NULL protein1_1'::VARCHAR(100),
        COUNT(*)::BIGINT,
        'NULL protein1_1 cases'
    FROM temp_predicted_contact_eei 
    WHERE protein1_1 IS NULL
    
    UNION ALL
    
    -- Check total valid rows
    SELECT 
        'Valid rows (no critical NULLs)'::VARCHAR(100),
        COUNT(*)::BIGINT,
        'Ready for processing'
    FROM temp_predicted_contact_eei 
    WHERE exon1 IS NOT NULL 
      AND exon2 IS NOT NULL 
      AND protein1 IS NOT NULL 
      AND protein1_1 IS NOT NULL
    
    UNION ALL
    
    -- Check confidence score range
    SELECT 
        'Confidence range'::VARCHAR(100),
        1::BIGINT,
        CONCAT('Min: ', MIN(confidence)::TEXT, ', Max: ', MAX(confidence)::TEXT, ', Avg: ', ROUND(AVG(confidence), 4)::TEXT)
    FROM temp_predicted_contact_eei 
    WHERE confidence IS NOT NULL
    
    UNION ALL
    
    -- Check identity ranges
    SELECT 
        'Identity1 range'::VARCHAR(100),
        1::BIGINT,
        CONCAT('Min: ', MIN(identity1)::TEXT, ', Max: ', MAX(identity1)::TEXT, ', Avg: ', ROUND(AVG(identity1), 3)::TEXT)
    FROM temp_predicted_contact_eei 
    WHERE identity1 IS NOT NULL
    
    UNION ALL
    
    SELECT 
        'Identity2 range'::VARCHAR(100),
        1::BIGINT,
        CONCAT('Min: ', MIN(identity2)::TEXT, ', Max: ', MAX(identity2)::TEXT, ', Avg: ', ROUND(AVG(identity2), 3)::TEXT)
    FROM temp_predicted_contact_eei 
    WHERE identity2 IS NOT NULL
    
    UNION ALL
    
    -- Check mapping types
    SELECT 
        'Mapping types'::VARCHAR(100),
        1::BIGINT,
        string_agg(DISTINCT CONCAT(type1, '-', type2), ', ' ORDER BY CONCAT(type1, '-', type2))
    FROM temp_predicted_contact_eei 
    WHERE type1 IS NOT NULL AND type2 IS NOT NULL;
END;
$$;


ALTER FUNCTION public.analyze_predicted_contact_eei_data() OWNER TO bbf3630;

--
-- Name: analyze_predicted_eppic_eei_data(); Type: FUNCTION; Schema: public; Owner: bbf3630
--

CREATE FUNCTION public.analyze_predicted_eppic_eei_data() RETURNS TABLE(issue_type character varying, count bigint, examples text)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    
    -- Check for NULL values in critical fields
    SELECT 
        'Rows with NULL exon1'::VARCHAR(100),
        COUNT(*)::BIGINT,
        string_agg(DISTINCT protein1, ', ' ORDER BY protein1) 
    FROM temp_predicted_eppic_eei 
    WHERE exon1 IS NULL
    
    UNION ALL
    
    SELECT 
        'Rows with NULL exon2'::VARCHAR(100),
        COUNT(*)::BIGINT,
        string_agg(DISTINCT protein1, ', ' ORDER BY protein1)
    FROM temp_predicted_eppic_eei 
    WHERE exon2 IS NULL
    
    UNION ALL
    
    SELECT 
        'Rows with NULL protein1'::VARCHAR(100),
        COUNT(*)::BIGINT,
        'NULL protein1 cases'
    FROM temp_predicted_eppic_eei 
    WHERE protein1 IS NULL
    
    UNION ALL
    
    SELECT 
        'Rows with NULL protein2'::VARCHAR(100),
        COUNT(*)::BIGINT,
        'NULL protein2 cases'
    FROM temp_predicted_eppic_eei 
    WHERE protein2 IS NULL
    
    UNION ALL
    
    -- Check total valid rows
    SELECT 
        'Valid rows (no critical NULLs)'::VARCHAR(100),
        COUNT(*)::BIGINT,
        'Ready for processing'
    FROM temp_predicted_eppic_eei 
    WHERE exon1 IS NOT NULL 
      AND exon2 IS NOT NULL 
      AND protein1 IS NOT NULL 
      AND protein2 IS NOT NULL
    
    UNION ALL
    
    -- Check confidence score range
    SELECT 
        'Confidence range'::VARCHAR(100),
        1::BIGINT,
        CONCAT('Min: ', MIN(confidence)::TEXT, ', Max: ', MAX(confidence)::TEXT, ', Avg: ', ROUND(AVG(confidence), 4)::TEXT)
    FROM temp_predicted_eppic_eei 
    WHERE confidence IS NOT NULL
    
    UNION ALL
    
    -- Check CS score range
    SELECT 
        'CS Score range'::VARCHAR(100),
        1::BIGINT,
        CONCAT('Min: ', MIN(cs_score)::TEXT, ', Max: ', MAX(cs_score)::TEXT, ', Avg: ', ROUND(AVG(cs_score), 2)::TEXT)
    FROM temp_predicted_eppic_eei 
    WHERE cs_score IS NOT NULL
    
    UNION ALL
    
    -- Check CR score range
    SELECT 
        'CR Score range'::VARCHAR(100),
        1::BIGINT,
        CONCAT('Min: ', MIN(cr_score)::TEXT, ', Max: ', MAX(cr_score)::TEXT, ', Avg: ', ROUND(AVG(cr_score), 2)::TEXT)
    FROM temp_predicted_eppic_eei 
    WHERE cr_score IS NOT NULL
    
    UNION ALL
    
    SELECT 
        'Unique PDB structures'::VARCHAR(100),
        COUNT(DISTINCT pdb_id)::BIGINT,
        string_agg(DISTINCT pdb_id, ', ' ORDER BY pdb_id)
    FROM temp_predicted_eppic_eei 
    WHERE pdb_id IS NOT NULL;
END;
$$;


ALTER FUNCTION public.analyze_predicted_eppic_eei_data() OWNER TO bbf3630;

--
-- Name: analyze_predicted_pisa_eei_data(); Type: FUNCTION; Schema: public; Owner: bbf3630
--

CREATE FUNCTION public.analyze_predicted_pisa_eei_data() RETURNS TABLE(issue_type character varying, count bigint, examples text)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    
    -- Check for NULL values in critical fields
    SELECT 
        'Rows with NULL exon1'::VARCHAR(100),
        COUNT(*)::BIGINT,
        string_agg(DISTINCT protein1, ', ' ORDER BY protein1) 
    FROM temp_predicted_pisa_eei 
    WHERE exon1 IS NULL
    
    UNION ALL
    
    SELECT 
        'Rows with NULL exon2'::VARCHAR(100),
        COUNT(*)::BIGINT,
        string_agg(DISTINCT protein1, ', ' ORDER BY protein1)
    FROM temp_predicted_pisa_eei 
    WHERE exon2 IS NULL
    
    UNION ALL
    
    SELECT 
        'Rows with NULL protein1'::VARCHAR(100),
        COUNT(*)::BIGINT,
        'NULL protein1 cases'
    FROM temp_predicted_pisa_eei 
    WHERE protein1 IS NULL
    
    UNION ALL
    
    SELECT 
        'Rows with NULL protein2'::VARCHAR(100),
        COUNT(*)::BIGINT,
        'NULL protein2 cases'
    FROM temp_predicted_pisa_eei 
    WHERE protein2 IS NULL
    
    UNION ALL
    
    -- Check total valid rows
    SELECT 
        'Valid rows (no critical NULLs)'::VARCHAR(100),
        COUNT(*)::BIGINT,
        'Ready for processing'
    FROM temp_predicted_pisa_eei 
    WHERE exon1 IS NOT NULL 
      AND exon2 IS NOT NULL 
      AND protein1 IS NOT NULL 
      AND protein2 IS NOT NULL
    
    UNION ALL
    
    -- Check confidence score range
    SELECT 
        'Confidence range'::VARCHAR(100),
        1::BIGINT,
        CONCAT('Min: ', MIN(confidence)::TEXT, ', Max: ', MAX(confidence)::TEXT, ', Avg: ', ROUND(AVG(confidence), 4)::TEXT)
    FROM temp_predicted_pisa_eei 
    WHERE confidence IS NOT NULL
    
    UNION ALL
    
    -- Check free energy range
    SELECT 
        'Free energy range'::VARCHAR(100),
        1::BIGINT,
        CONCAT('Min: ', MIN(free_energy)::TEXT, ', Max: ', MAX(free_energy)::TEXT, ', Avg: ', ROUND(AVG(free_energy), 2)::TEXT)
    FROM temp_predicted_pisa_eei 
    WHERE free_energy IS NOT NULL
    
    UNION ALL
    
    SELECT 
        'Unique PDB structures'::VARCHAR(100),
        COUNT(DISTINCT pdb_id)::BIGINT,
        string_agg(DISTINCT pdb_id, ', ' ORDER BY pdb_id)
    FROM temp_predicted_pisa_eei 
    WHERE pdb_id IS NOT NULL;
END;
$$;


ALTER FUNCTION public.analyze_predicted_pisa_eei_data() OWNER TO bbf3630;

--
-- Name: compare_methods_for_protein_pair(character varying, character varying); Type: FUNCTION; Schema: public; Owner: bbf3630
--

CREATE FUNCTION public.compare_methods_for_protein_pair(protein1_param character varying, protein2_param character varying) RETURNS TABLE(method_name character varying, eei_count bigint, avg_confidence numeric, avg_jaccard numeric, unique_exon_pairs bigint)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        em.method_name,
        COUNT(*)::BIGINT as eei_count,
        AVG(eom.confidence) as avg_confidence,
        AVG(ei.jaccard_percent) as avg_jaccard,
        COUNT(DISTINCT CONCAT(e1.ensembl_exon_id, '-', e2.ensembl_exon_id))::BIGINT as unique_exon_pairs
    FROM eei_interactions ei
    JOIN exons e1 ON ei.exon1_id = e1.exon_id
    JOIN exons e2 ON ei.exon2_id = e2.exon_id
    JOIN proteins p1 ON ei.protein1_id = p1.protein_id
    JOIN proteins p2 ON ei.protein2_id = p2.protein_id
    JOIN eei_methods em ON ei.method_id = em.method_id
    LEFT JOIN eei_orthology_mapping eom ON ei.eei_id = eom.eei_id
    WHERE 
        (p1.uniprot_id = protein1_param AND p2.uniprot_id = protein2_param)
        OR (p1.uniprot_id = protein2_param AND p2.uniprot_id = protein1_param)
    GROUP BY em.method_name
    ORDER BY eei_count DESC;
END;
$$;


ALTER FUNCTION public.compare_methods_for_protein_pair(protein1_param character varying, protein2_param character varying) OWNER TO bbf3630;

--
-- Name: debug_bulk_load_contact_eei(); Type: FUNCTION; Schema: public; Owner: bbf3630
--

CREATE FUNCTION public.debug_bulk_load_contact_eei() RETURNS TABLE(step_name character varying, records_affected integer, details text)
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_method_exists INTEGER;
    v_exons_inserted INTEGER;
    v_proteins_inserted INTEGER;
    v_pdb_inserted INTEGER;
    v_eei_inserted INTEGER;
BEGIN
    -- Check if method exists
    SELECT COUNT(*) INTO v_method_exists FROM eei_methods WHERE method_name = 'contact_based';
    RETURN QUERY SELECT 'Method Check'::VARCHAR(100), v_method_exists, 
        CASE WHEN v_method_exists > 0 THEN 'contact_based method exists' ELSE 'contact_based method MISSING' END;
    
    -- Insert organisms
    INSERT INTO organisms (name, scientific_name) 
    VALUES ('Human', 'Homo sapiens') 
    ON CONFLICT (name) DO NOTHING;
    RETURN QUERY SELECT 'Organisms'::VARCHAR(100), 1, 'Human organism ensured';
    
    -- Insert exons
    WITH exon_data AS (
        SELECT exon1 as exon_id, MAX(exon1_length) as max_length
        FROM temp_contact_eei 
        WHERE exon1 IS NOT NULL
        GROUP BY exon1
        UNION
        SELECT exon2 as exon_id, MAX(exon2_length) as max_length
        FROM temp_contact_eei 
        WHERE exon2 IS NOT NULL
        GROUP BY exon2
    )
    INSERT INTO exons (ensembl_exon_id, exon_length)
    SELECT exon_id, max_length 
    FROM exon_data
    WHERE exon_id NOT IN (SELECT ensembl_exon_id FROM exons)
    ON CONFLICT (ensembl_exon_id) DO NOTHING;
    GET DIAGNOSTICS v_exons_inserted = ROW_COUNT;
    RETURN QUERY SELECT 'Exons'::VARCHAR(100), v_exons_inserted, 'Exons inserted';
    
    -- Insert proteins
    WITH protein_data AS (
        SELECT DISTINCT split_part(protein1, '_', 1) as uniprot_id
        FROM temp_contact_eei 
        WHERE protein1 IS NOT NULL AND split_part(protein1, '_', 1) != ''
        UNION
        SELECT DISTINCT split_part(protein1_1, '_', 1) as uniprot_id
        FROM temp_contact_eei 
        WHERE protein1_1 IS NOT NULL AND split_part(protein1_1, '_', 1) != ''
    )
    INSERT INTO proteins (uniprot_id)
    SELECT uniprot_id 
    FROM protein_data
    WHERE uniprot_id NOT IN (SELECT uniprot_id FROM proteins)
    ON CONFLICT (uniprot_id) DO NOTHING;
    GET DIAGNOSTICS v_proteins_inserted = ROW_COUNT;
    RETURN QUERY SELECT 'Proteins'::VARCHAR(100), v_proteins_inserted, 'Proteins inserted';
    
    -- Insert PDB structures
    WITH pdb_data AS (
        SELECT DISTINCT split_part(protein1, '_', 2) as pdb_id
        FROM temp_contact_eei 
        WHERE protein1 IS NOT NULL AND split_part(protein1, '_', 2) != ''
    )
    INSERT INTO pdb_structures (pdb_id)
    SELECT pdb_id 
    FROM pdb_data
    WHERE pdb_id NOT IN (SELECT pdb_id FROM pdb_structures)
    ON CONFLICT (pdb_id) DO NOTHING;
    GET DIAGNOSTICS v_pdb_inserted = ROW_COUNT;
    RETURN QUERY SELECT 'PDB Structures'::VARCHAR(100), v_pdb_inserted, 'PDB structures inserted';
    
    -- Now check what we have available for EEI insertion
    RETURN QUERY 
    SELECT 'Available Data Check'::VARCHAR(100), 
           COUNT(*)::INTEGER,
           'Rows ready for EEI insertion'
    FROM temp_contact_eei t
    WHERE EXISTS (SELECT 1 FROM exons e1 WHERE e1.ensembl_exon_id = t.exon1)
      AND EXISTS (SELECT 1 FROM exons e2 WHERE e2.ensembl_exon_id = t.exon2)
      AND EXISTS (SELECT 1 FROM proteins p1 WHERE p1.uniprot_id = split_part(t.protein1, '_', 1))
      AND EXISTS (SELECT 1 FROM proteins p2 WHERE p2.uniprot_id = split_part(t.protein1_1, '_', 1))
      AND EXISTS (SELECT 1 FROM eei_methods em WHERE em.method_name = 'contact_based');
    
END;
$$;


ALTER FUNCTION public.debug_bulk_load_contact_eei() OWNER TO bbf3630;

--
-- Name: efficient_bulk_load_contact_eei(); Type: FUNCTION; Schema: public; Owner: bbf3630
--

CREATE FUNCTION public.efficient_bulk_load_contact_eei() RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_inserted_count INTEGER := 0;
BEGIN
    -- Insert organisms if they don't exist
    INSERT INTO organisms (name, scientific_name) 
    VALUES ('Human', 'Homo sapiens') 
    ON CONFLICT (name) DO NOTHING;
    
    -- Bulk insert exons
    INSERT INTO exons (ensembl_exon_id, exon_length)
    SELECT DISTINCT exon1, exon1_length FROM temp_contact_eei
    WHERE exon1 NOT IN (SELECT ensembl_exon_id FROM exons)
    UNION
    SELECT DISTINCT exon2, exon2_length FROM temp_contact_eei
    WHERE exon2 NOT IN (SELECT ensembl_exon_id FROM exons);
    
    -- Bulk insert proteins
    INSERT INTO proteins (uniprot_id)
    SELECT DISTINCT split_part(protein1, '_', 1) FROM temp_contact_eei
    WHERE split_part(protein1, '_', 1) NOT IN (SELECT uniprot_id FROM proteins)
    UNION
    SELECT DISTINCT split_part(protein1_1, '_', 1) FROM temp_contact_eei
    WHERE split_part(protein1_1, '_', 1) NOT IN (SELECT uniprot_id FROM proteins);
    
    -- Bulk insert PDB structures
    INSERT INTO pdb_structures (pdb_id)
    SELECT DISTINCT split_part(protein1, '_', 2) FROM temp_contact_eei
    WHERE split_part(protein1, '_', 2) NOT IN (SELECT pdb_id FROM pdb_structures);
    
    -- Bulk insert EEI interactions
    INSERT INTO eei_interactions (
        exon1_id, exon2_id, protein1_id, protein2_id, method_id, pdb_id,
        exon1_length, exon2_length, exon1_coverage, exon2_coverage,
        exon1_coverage_percent, exon2_coverage_percent, jaccard_percent,
        protein1_chain, protein2_chain
    )
    SELECT 
        e1.exon_id,
        e2.exon_id,
        p1.protein_id,
        p2.protein_id,
        em.method_id,
        split_part(t.protein1, '_', 2),
        t.exon1_length,
        t.exon2_length,
        t.exon1_coverage,
        t.exon2_coverage,
        t.exon1_coverage_percent,
        t.exon2_coverage_percent,
        t.jaccard_percent,
        split_part(t.protein1, '_', 3),
        split_part(t.protein1_1, '_', 3)
    FROM temp_contact_eei t
    JOIN exons e1 ON e1.ensembl_exon_id = t.exon1
    JOIN exons e2 ON e2.ensembl_exon_id = t.exon2
    JOIN proteins p1 ON p1.uniprot_id = split_part(t.protein1, '_', 1)
    JOIN proteins p2 ON p2.uniprot_id = split_part(t.protein1_1, '_', 1)
    JOIN eei_methods em ON em.method_name = 'contact_based'
    ON CONFLICT (exon1_id, exon2_id, method_id, pdb_id) DO NOTHING;
    
    GET DIAGNOSTICS v_inserted_count = ROW_COUNT;
    
    RETURN v_inserted_count;
END;
$$;


ALTER FUNCTION public.efficient_bulk_load_contact_eei() OWNER TO bbf3630;

--
-- Name: efficient_bulk_load_contact_eei_fixed(); Type: FUNCTION; Schema: public; Owner: bbf3630
--

CREATE FUNCTION public.efficient_bulk_load_contact_eei_fixed() RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_inserted_count INTEGER := 0;
BEGIN
    -- Insert organisms if they don't exist
    INSERT INTO organisms (name, scientific_name) 
    VALUES ('Human', 'Homo sapiens') 
    ON CONFLICT (name) DO NOTHING;
    
    -- Bulk insert exons - use MAX length for duplicates and handle conflicts
    WITH exon_data AS (
        SELECT exon1 as exon_id, MAX(exon1_length) as max_length
        FROM temp_contact_eei 
        WHERE exon1 IS NOT NULL
        GROUP BY exon1
        UNION
        SELECT exon2 as exon_id, MAX(exon2_length) as max_length
        FROM temp_contact_eei 
        WHERE exon2 IS NOT NULL
        GROUP BY exon2
    )
    INSERT INTO exons (ensembl_exon_id, exon_length)
    SELECT exon_id, max_length 
    FROM exon_data
    WHERE exon_id NOT IN (SELECT ensembl_exon_id FROM exons)
    ON CONFLICT (ensembl_exon_id) DO NOTHING;
    
    -- Bulk insert proteins - handle conflicts
    WITH protein_data AS (
        SELECT DISTINCT split_part(protein1, '_', 1) as uniprot_id
        FROM temp_contact_eei 
        WHERE protein1 IS NOT NULL
        UNION
        SELECT DISTINCT split_part(protein1_1, '_', 1) as uniprot_id
        FROM temp_contact_eei 
        WHERE protein1_1 IS NOT NULL
    )
    INSERT INTO proteins (uniprot_id)
    SELECT uniprot_id 
    FROM protein_data
    WHERE uniprot_id NOT IN (SELECT uniprot_id FROM proteins)
    ON CONFLICT (uniprot_id) DO NOTHING;
    
    -- Bulk insert PDB structures - handle conflicts
    WITH pdb_data AS (
        SELECT DISTINCT split_part(protein1, '_', 2) as pdb_id
        FROM temp_contact_eei 
        WHERE protein1 IS NOT NULL AND split_part(protein1, '_', 2) != ''
    )
    INSERT INTO pdb_structures (pdb_id)
    SELECT pdb_id 
    FROM pdb_data
    WHERE pdb_id NOT IN (SELECT pdb_id FROM pdb_structures)
    ON CONFLICT (pdb_id) DO NOTHING;
    
    -- Bulk insert EEI interactions
    INSERT INTO eei_interactions (
        exon1_id, exon2_id, protein1_id, protein2_id, method_id, pdb_id,
        exon1_length, exon2_length, exon1_coverage, exon2_coverage,
        exon1_coverage_percent, exon2_coverage_percent, jaccard_percent,
        protein1_chain, protein2_chain
    )
    SELECT 
        e1.exon_id,
        e2.exon_id,
        p1.protein_id,
        p2.protein_id,
        em.method_id,
        CASE 
            WHEN split_part(t.protein1, '_', 2) = '' THEN NULL 
            ELSE split_part(t.protein1, '_', 2) 
        END,
        t.exon1_length,
        t.exon2_length,
        t.exon1_coverage,
        t.exon2_coverage,
        t.exon1_coverage_percent,
        t.exon2_coverage_percent,
        t.jaccard_percent,
        CASE 
            WHEN split_part(t.protein1, '_', 3) = '' THEN NULL 
            ELSE split_part(t.protein1, '_', 3) 
        END,
        CASE 
            WHEN split_part(t.protein1_1, '_', 3) = '' THEN NULL 
            ELSE split_part(t.protein1_1, '_', 3) 
        END
    FROM temp_contact_eei t
    JOIN exons e1 ON e1.ensembl_exon_id = t.exon1
    JOIN exons e2 ON e2.ensembl_exon_id = t.exon2
    JOIN proteins p1 ON p1.uniprot_id = split_part(t.protein1, '_', 1)
    JOIN proteins p2 ON p2.uniprot_id = split_part(t.protein1_1, '_', 1)
    JOIN eei_methods em ON em.method_name = 'contact_based'
    WHERE t.exon1 IS NOT NULL 
      AND t.exon2 IS NOT NULL 
      AND t.protein1 IS NOT NULL 
      AND t.protein1_1 IS NOT NULL
    ON CONFLICT (exon1_id, exon2_id, method_id, pdb_id) DO NOTHING;
    
    GET DIAGNOSTICS v_inserted_count = ROW_COUNT;
    
    RETURN v_inserted_count;
END;
$$;


ALTER FUNCTION public.efficient_bulk_load_contact_eei_fixed() OWNER TO bbf3630;

--
-- Name: efficient_bulk_load_eppic_eei(); Type: FUNCTION; Schema: public; Owner: bbf3630
--

CREATE FUNCTION public.efficient_bulk_load_eppic_eei() RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_inserted_count INTEGER := 0;
BEGIN
    -- Ensure EPPIC method exists
    INSERT INTO eei_methods (method_name, method_type, description) 
    VALUES ('EPPIC', 'experimental', 'EPPIC-based experimental EEI detection')
    ON CONFLICT (method_name) DO NOTHING;
    
    -- Insert any missing exons (likely very few since contact and PISA data already loaded)
    WITH exon_data AS (
        SELECT exon1 as exon_id, NULL::INTEGER as length
        FROM temp_eppic_eei 
        WHERE exon1 IS NOT NULL
        GROUP BY exon1
        UNION
        SELECT exon2 as exon_id, NULL::INTEGER as length
        FROM temp_eppic_eei 
        WHERE exon2 IS NOT NULL
        GROUP BY exon2
    )
    INSERT INTO exons (ensembl_exon_id, exon_length)
    SELECT exon_id, length 
    FROM exon_data
    WHERE exon_id NOT IN (SELECT ensembl_exon_id FROM exons)
    ON CONFLICT (ensembl_exon_id) DO NOTHING;
    
    -- Insert any missing proteins
    WITH protein_data AS (
        SELECT DISTINCT protein1 as uniprot_id
        FROM temp_eppic_eei 
        WHERE protein1 IS NOT NULL
        UNION
        SELECT DISTINCT protein2 as uniprot_id
        FROM temp_eppic_eei 
        WHERE protein2 IS NOT NULL
    )
    INSERT INTO proteins (uniprot_id)
    SELECT uniprot_id 
    FROM protein_data
    WHERE uniprot_id NOT IN (SELECT uniprot_id FROM proteins)
    ON CONFLICT (uniprot_id) DO NOTHING;
    
    -- Insert any missing PDB structures
    INSERT INTO pdb_structures (pdb_id)
    SELECT DISTINCT pdb_id
    FROM temp_eppic_eei 
    WHERE pdb_id IS NOT NULL 
      AND pdb_id NOT IN (SELECT pdb_id FROM pdb_structures)
    ON CONFLICT (pdb_id) DO NOTHING;
    
    -- Insert EEI interactions
    INSERT INTO eei_interactions (
        exon1_id, exon2_id, protein1_id, protein2_id, method_id, pdb_id,
        aa1, aa2
    )
    SELECT 
        e1.exon_id,
        e2.exon_id,
        p1.protein_id,
        p2.protein_id,
        em.method_id,
        t.pdb_id,
        t.aa1,
        t.aa2
    FROM temp_eppic_eei t
    JOIN exons e1 ON e1.ensembl_exon_id = t.exon1
    JOIN exons e2 ON e2.ensembl_exon_id = t.exon2
    JOIN proteins p1 ON p1.uniprot_id = t.protein1
    JOIN proteins p2 ON p2.uniprot_id = t.protein2
    JOIN eei_methods em ON em.method_name = 'EPPIC'
    WHERE t.exon1 IS NOT NULL 
      AND t.exon2 IS NOT NULL 
      AND t.protein1 IS NOT NULL 
      AND t.protein2 IS NOT NULL
    ON CONFLICT (exon1_id, exon2_id, method_id, pdb_id) DO NOTHING;
    
    GET DIAGNOSTICS v_inserted_count = ROW_COUNT;
    
    -- Insert EPPIC-specific attributes
    INSERT INTO eei_eppic_attributes (
        eei_id, buried_area_abs, sol_acc_area_abs, cs_score, cr_score
    )
    SELECT 
        ei.eei_id,
        t.buried_area_abs,
        t.sol_acc_area_abs,
        t.cs_score,
        t.cr_score
    FROM temp_eppic_eei t
    JOIN exons e1 ON e1.ensembl_exon_id = t.exon1
    JOIN exons e2 ON e2.ensembl_exon_id = t.exon2
    JOIN proteins p1 ON p1.uniprot_id = t.protein1
    JOIN proteins p2 ON p2.uniprot_id = t.protein2
    JOIN eei_methods em ON em.method_name = 'EPPIC'
    JOIN eei_interactions ei ON (
        ei.exon1_id = e1.exon_id AND 
        ei.exon2_id = e2.exon_id AND 
        ei.protein1_id = p1.protein_id AND 
        ei.protein2_id = p2.protein_id AND 
        ei.method_id = em.method_id AND
        ei.pdb_id = t.pdb_id
    )
    WHERE t.exon1 IS NOT NULL 
      AND t.exon2 IS NOT NULL 
      AND t.protein1 IS NOT NULL 
      AND t.protein2 IS NOT NULL
    ON CONFLICT (eei_id) DO NOTHING;
    
    RETURN v_inserted_count;
END;
$$;


ALTER FUNCTION public.efficient_bulk_load_eppic_eei() OWNER TO bbf3630;

--
-- Name: efficient_bulk_load_pisa_eei(); Type: FUNCTION; Schema: public; Owner: bbf3630
--

CREATE FUNCTION public.efficient_bulk_load_pisa_eei() RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_inserted_count INTEGER := 0;
BEGIN
    -- Ensure PISA method exists
    INSERT INTO eei_methods (method_name, method_type, description) 
    VALUES ('PISA', 'experimental', 'PISA-based experimental EEI detection')
    ON CONFLICT (method_name) DO NOTHING;
    
    -- Insert any missing exons (likely few since contact data already loaded)
    WITH exon_data AS (
        SELECT exon1 as exon_id, NULL as length
        FROM temp_pisa_eei 
        WHERE exon1 IS NOT NULL
        GROUP BY exon1
        UNION
        SELECT exon2 as exon_id, NULL as length
        FROM temp_pisa_eei 
        WHERE exon2 IS NOT NULL
        GROUP BY exon2
    )
    INSERT INTO exons (ensembl_exon_id, exon_length)
    SELECT exon_id, length 
    FROM exon_data
    WHERE exon_id NOT IN (SELECT ensembl_exon_id FROM exons)
    ON CONFLICT (ensembl_exon_id) DO NOTHING;
    
    -- Insert any missing proteins
    WITH protein_data AS (
        SELECT DISTINCT protein1 as uniprot_id
        FROM temp_pisa_eei 
        WHERE protein1 IS NOT NULL
        UNION
        SELECT DISTINCT protein2 as uniprot_id
        FROM temp_pisa_eei 
        WHERE protein2 IS NOT NULL
    )
    INSERT INTO proteins (uniprot_id)
    SELECT uniprot_id 
    FROM protein_data
    WHERE uniprot_id NOT IN (SELECT uniprot_id FROM proteins)
    ON CONFLICT (uniprot_id) DO NOTHING;
    
    -- Insert any missing PDB structures
    INSERT INTO pdb_structures (pdb_id)
    SELECT DISTINCT pdb_id
    FROM temp_pisa_eei 
    WHERE pdb_id IS NOT NULL 
      AND pdb_id NOT IN (SELECT pdb_id FROM pdb_structures)
    ON CONFLICT (pdb_id) DO NOTHING;
    
    -- Insert EEI interactions
    INSERT INTO eei_interactions (
        exon1_id, exon2_id, protein1_id, protein2_id, method_id, pdb_id,
        aa1, aa2
    )
    SELECT 
        e1.exon_id,
        e2.exon_id,
        p1.protein_id,
        p2.protein_id,
        em.method_id,
        t.pdb_id,
        t.aa1,
        t.aa2
    FROM temp_pisa_eei t
    JOIN exons e1 ON e1.ensembl_exon_id = t.exon1
    JOIN exons e2 ON e2.ensembl_exon_id = t.exon2
    JOIN proteins p1 ON p1.uniprot_id = t.protein1
    JOIN proteins p2 ON p2.uniprot_id = t.protein2
    JOIN eei_methods em ON em.method_name = 'PISA'
    WHERE t.exon1 IS NOT NULL 
      AND t.exon2 IS NOT NULL 
      AND t.protein1 IS NOT NULL 
      AND t.protein2 IS NOT NULL
    ON CONFLICT (exon1_id, exon2_id, method_id, pdb_id) DO NOTHING
    RETURNING eei_id;
    
    GET DIAGNOSTICS v_inserted_count = ROW_COUNT;
    
    -- Insert PISA-specific attributes
    INSERT INTO eei_pisa_attributes (
        eei_id, free_energy, buried_area, buried_area_abs, sol_acc_area_abs,
        hydrogen_bonds, disulphide_bonds, salt_bridges, covalent_bonds
    )
    SELECT 
        ei.eei_id,
        t.free_energy,
        t.buried_area,
        t.buried_area_abs,
        t.sol_acc_area_abs,
        COALESCE(t.hydrogen, 0),
        COALESCE(t.disulphide, 0),
        COALESCE(t.saltbridge, 0),
        COALESCE(t.covalent, 0)
    FROM temp_pisa_eei t
    JOIN exons e1 ON e1.ensembl_exon_id = t.exon1
    JOIN exons e2 ON e2.ensembl_exon_id = t.exon2
    JOIN proteins p1 ON p1.uniprot_id = t.protein1
    JOIN proteins p2 ON p2.uniprot_id = t.protein2
    JOIN eei_methods em ON em.method_name = 'PISA'
    JOIN eei_interactions ei ON (
        ei.exon1_id = e1.exon_id AND 
        ei.exon2_id = e2.exon_id AND 
        ei.protein1_id = p1.protein_id AND 
        ei.protein2_id = p2.protein_id AND 
        ei.method_id = em.method_id AND
        ei.pdb_id = t.pdb_id
    )
    WHERE t.exon1 IS NOT NULL 
      AND t.exon2 IS NOT NULL 
      AND t.protein1 IS NOT NULL 
      AND t.protein2 IS NOT NULL
    ON CONFLICT (eei_id) DO NOTHING;
    
    RETURN v_inserted_count;
END;
$$;


ALTER FUNCTION public.efficient_bulk_load_pisa_eei() OWNER TO bbf3630;

--
-- Name: efficient_bulk_load_pisa_eei_fixed(); Type: FUNCTION; Schema: public; Owner: bbf3630
--

CREATE FUNCTION public.efficient_bulk_load_pisa_eei_fixed() RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_inserted_count INTEGER := 0;
BEGIN
    -- Ensure PISA method exists
    INSERT INTO eei_methods (method_name, method_type, description) 
    VALUES ('PISA', 'experimental', 'PISA-based experimental EEI detection')
    ON CONFLICT (method_name) DO NOTHING;
    
    -- Insert any missing exons (likely few since contact data already loaded)
    -- Cast NULL to INTEGER for exon_length
    WITH exon_data AS (
        SELECT exon1 as exon_id, NULL::INTEGER as length
        FROM temp_pisa_eei 
        WHERE exon1 IS NOT NULL
        GROUP BY exon1
        UNION
        SELECT exon2 as exon_id, NULL::INTEGER as length
        FROM temp_pisa_eei 
        WHERE exon2 IS NOT NULL
        GROUP BY exon2
    )
    INSERT INTO exons (ensembl_exon_id, exon_length)
    SELECT exon_id, length 
    FROM exon_data
    WHERE exon_id NOT IN (SELECT ensembl_exon_id FROM exons)
    ON CONFLICT (ensembl_exon_id) DO NOTHING;
    
    -- Insert any missing proteins
    WITH protein_data AS (
        SELECT DISTINCT protein1 as uniprot_id
        FROM temp_pisa_eei 
        WHERE protein1 IS NOT NULL
        UNION
        SELECT DISTINCT protein2 as uniprot_id
        FROM temp_pisa_eei 
        WHERE protein2 IS NOT NULL
    )
    INSERT INTO proteins (uniprot_id)
    SELECT uniprot_id 
    FROM protein_data
    WHERE uniprot_id NOT IN (SELECT uniprot_id FROM proteins)
    ON CONFLICT (uniprot_id) DO NOTHING;
    
    -- Insert any missing PDB structures
    INSERT INTO pdb_structures (pdb_id)
    SELECT DISTINCT pdb_id
    FROM temp_pisa_eei 
    WHERE pdb_id IS NOT NULL 
      AND pdb_id NOT IN (SELECT pdb_id FROM pdb_structures)
    ON CONFLICT (pdb_id) DO NOTHING;
    
    -- Insert EEI interactions
    INSERT INTO eei_interactions (
        exon1_id, exon2_id, protein1_id, protein2_id, method_id, pdb_id,
        aa1, aa2
    )
    SELECT 
        e1.exon_id,
        e2.exon_id,
        p1.protein_id,
        p2.protein_id,
        em.method_id,
        t.pdb_id,
        t.aa1,
        t.aa2
    FROM temp_pisa_eei t
    JOIN exons e1 ON e1.ensembl_exon_id = t.exon1
    JOIN exons e2 ON e2.ensembl_exon_id = t.exon2
    JOIN proteins p1 ON p1.uniprot_id = t.protein1
    JOIN proteins p2 ON p2.uniprot_id = t.protein2
    JOIN eei_methods em ON em.method_name = 'PISA'
    WHERE t.exon1 IS NOT NULL 
      AND t.exon2 IS NOT NULL 
      AND t.protein1 IS NOT NULL 
      AND t.protein2 IS NOT NULL
    ON CONFLICT (exon1_id, exon2_id, method_id, pdb_id) DO NOTHING;
    
    GET DIAGNOSTICS v_inserted_count = ROW_COUNT;
    
    -- Insert PISA-specific attributes
    INSERT INTO eei_pisa_attributes (
        eei_id, free_energy, buried_area, buried_area_abs, sol_acc_area_abs,
        hydrogen_bonds, disulphide_bonds, salt_bridges, covalent_bonds
    )
    SELECT 
        ei.eei_id,
        t.free_energy,
        t.buried_area,
        t.buried_area_abs,
        t.sol_acc_area_abs,
        COALESCE(t.hydrogen, 0),
        COALESCE(t.disulphide, 0),
        COALESCE(t.saltbridge, 0),
        COALESCE(t.covalent, 0)
    FROM temp_pisa_eei t
    JOIN exons e1 ON e1.ensembl_exon_id = t.exon1
    JOIN exons e2 ON e2.ensembl_exon_id = t.exon2
    JOIN proteins p1 ON p1.uniprot_id = t.protein1
    JOIN proteins p2 ON p2.uniprot_id = t.protein2
    JOIN eei_methods em ON em.method_name = 'PISA'
    JOIN eei_interactions ei ON (
        ei.exon1_id = e1.exon_id AND 
        ei.exon2_id = e2.exon_id AND 
        ei.protein1_id = p1.protein_id AND 
        ei.protein2_id = p2.protein_id AND 
        ei.method_id = em.method_id AND
        ei.pdb_id = t.pdb_id
    )
    WHERE t.exon1 IS NOT NULL 
      AND t.exon2 IS NOT NULL 
      AND t.protein1 IS NOT NULL 
      AND t.protein2 IS NOT NULL
    ON CONFLICT (eei_id) DO NOTHING;
    
    RETURN v_inserted_count;
END;
$$;


ALTER FUNCTION public.efficient_bulk_load_pisa_eei_fixed() OWNER TO bbf3630;

--
-- Name: efficient_bulk_load_predicted_contact_eei(); Type: FUNCTION; Schema: public; Owner: bbf3630
--

CREATE FUNCTION public.efficient_bulk_load_predicted_contact_eei() RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_inserted_count INTEGER := 0;
    v_method_id INTEGER;
    v_source_organism_id INTEGER;
BEGIN
    -- Ensure predicted_contact method exists
    INSERT INTO eei_methods (method_name, method_type, description) 
    VALUES ('predicted_contact', 'predicted', 'Orthology-based prediction from contact method')
    ON CONFLICT (method_name) DO NOTHING;
    
    -- Get method and organism IDs
    SELECT method_id INTO v_method_id FROM eei_methods WHERE method_name = 'predicted_contact';
    SELECT organism_id INTO v_source_organism_id FROM organisms WHERE name = 'Mouse';
    
    -- Create mouse organism if doesn't exist
    IF v_source_organism_id IS NULL THEN
        INSERT INTO organisms (name, scientific_name) VALUES ('Mouse', 'Mus musculus') 
        RETURNING organism_id INTO v_source_organism_id;
    END IF;
    
    -- Insert any missing exons
    WITH exon_data AS (
        SELECT exon1 as exon_id, MAX(exon1_length) as max_length
        FROM temp_predicted_contact_eei 
        WHERE exon1 IS NOT NULL
        GROUP BY exon1
        UNION
        SELECT exon2 as exon_id, MAX(exon2_length) as max_length
        FROM temp_predicted_contact_eei 
        WHERE exon2 IS NOT NULL
        GROUP BY exon2
    )
    INSERT INTO exons (ensembl_exon_id, exon_length)
    SELECT exon_id, max_length 
    FROM exon_data
    WHERE exon_id NOT IN (SELECT ensembl_exon_id FROM exons)
    ON CONFLICT (ensembl_exon_id) DO NOTHING;
    
    -- Insert any missing proteins  
    WITH protein_data AS (
        SELECT DISTINCT protein1 as uniprot_id
        FROM temp_predicted_contact_eei 
        WHERE protein1 IS NOT NULL
        UNION
        SELECT DISTINCT protein1_1 as uniprot_id
        FROM temp_predicted_contact_eei 
        WHERE protein1_1 IS NOT NULL
    )
    INSERT INTO proteins (uniprot_id)
    SELECT uniprot_id 
    FROM protein_data
    WHERE uniprot_id NOT IN (SELECT uniprot_id FROM proteins)
    ON CONFLICT (uniprot_id) DO NOTHING;
    
    -- Insert EEI interactions
    INSERT INTO eei_interactions (
        exon1_id, exon2_id, protein1_id, protein2_id, method_id,
        exon1_length, exon2_length, exon1_coverage, exon2_coverage,
        exon1_coverage_percent, exon2_coverage_percent, jaccard_percent
    )
    SELECT 
        e1.exon_id,
        e2.exon_id,
        p1.protein_id,
        p2.protein_id,
        v_method_id,
        t.exon1_length,
        t.exon2_length,
        t.exon1_coverage,
        t.exon2_coverage,
        t.exon1_coverage_percent,
        t.exon2_coverage_percent,
        t.jaccard_percent
    FROM temp_predicted_contact_eei t
    JOIN exons e1 ON e1.ensembl_exon_id = t.exon1
    JOIN exons e2 ON e2.ensembl_exon_id = t.exon2
    JOIN proteins p1 ON p1.uniprot_id = t.protein1
    JOIN proteins p2 ON p2.uniprot_id = t.protein1_1
    WHERE t.exon1 IS NOT NULL 
      AND t.exon2 IS NOT NULL 
      AND t.protein1 IS NOT NULL 
      AND t.protein1_1 IS NOT NULL
    ON CONFLICT (exon1_id, exon2_id, method_id, pdb_id) DO NOTHING;
    
    GET DIAGNOSTICS v_inserted_count = ROW_COUNT;
    
    -- Insert orthology mapping data
    INSERT INTO eei_orthology_mapping (
        eei_id, source_organism_id, mouse_exon1_coordinates, mouse_exon2_coordinates,
        confidence, identity1, identity2, mapping_type1, mapping_type2
    )
    SELECT 
        ei.eei_id,
        v_source_organism_id,
        t.mouse_exon1,
        t.mouse_exon2,
        t.confidence,
        t.identity1,
        t.identity2,
        t.type1,
        t.type2
    FROM temp_predicted_contact_eei t
    JOIN exons e1 ON e1.ensembl_exon_id = t.exon1
    JOIN exons e2 ON e2.ensembl_exon_id = t.exon2
    JOIN proteins p1 ON p1.uniprot_id = t.protein1
    JOIN proteins p2 ON p2.uniprot_id = t.protein1_1
    JOIN eei_interactions ei ON (
        ei.exon1_id = e1.exon_id AND 
        ei.exon2_id = e2.exon_id AND 
        ei.protein1_id = p1.protein_id AND 
        ei.protein2_id = p2.protein_id AND 
        ei.method_id = v_method_id
    )
    WHERE t.exon1 IS NOT NULL 
      AND t.exon2 IS NOT NULL 
      AND t.protein1 IS NOT NULL 
      AND t.protein1_1 IS NOT NULL
    ON CONFLICT (eei_id) DO NOTHING;
    
    RETURN v_inserted_count;
END;
$$;


ALTER FUNCTION public.efficient_bulk_load_predicted_contact_eei() OWNER TO bbf3630;

--
-- Name: efficient_bulk_load_predicted_eppic_eei(); Type: FUNCTION; Schema: public; Owner: bbf3630
--

CREATE FUNCTION public.efficient_bulk_load_predicted_eppic_eei() RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_inserted_count INTEGER := 0;
    v_method_id INTEGER;
    v_source_organism_id INTEGER;
BEGIN
    -- Ensure predicted_EPPIC method exists
    INSERT INTO eei_methods (method_name, method_type, description) 
    VALUES ('predicted_EPPIC', 'predicted', 'Orthology-based prediction from EPPIC method')
    ON CONFLICT (method_name) DO NOTHING;
    
    -- Get method and organism IDs
    SELECT method_id INTO v_method_id FROM eei_methods WHERE method_name = 'predicted_EPPIC';
    SELECT organism_id INTO v_source_organism_id FROM organisms WHERE name = 'Mouse';
    
    -- Create mouse organism if doesn't exist
    IF v_source_organism_id IS NULL THEN
        INSERT INTO organisms (name, scientific_name) VALUES ('Mouse', 'Mus musculus') 
        RETURNING organism_id INTO v_source_organism_id;
    END IF;
    
    -- Insert any missing exons
    WITH exon_data AS (
        SELECT exon1 as exon_id, NULL::INTEGER as max_length
        FROM temp_predicted_eppic_eei 
        WHERE exon1 IS NOT NULL
        GROUP BY exon1
        UNION
        SELECT exon2 as exon_id, NULL::INTEGER as max_length
        FROM temp_predicted_eppic_eei 
        WHERE exon2 IS NOT NULL
        GROUP BY exon2
    )
    INSERT INTO exons (ensembl_exon_id, exon_length)
    SELECT exon_id, max_length 
    FROM exon_data
    WHERE exon_id NOT IN (SELECT ensembl_exon_id FROM exons)
    ON CONFLICT (ensembl_exon_id) DO NOTHING;
    
    -- Insert any missing proteins  
    WITH protein_data AS (
        SELECT DISTINCT protein1 as uniprot_id
        FROM temp_predicted_eppic_eei 
        WHERE protein1 IS NOT NULL
        UNION
        SELECT DISTINCT protein2 as uniprot_id
        FROM temp_predicted_eppic_eei 
        WHERE protein2 IS NOT NULL
    )
    INSERT INTO proteins (uniprot_id)
    SELECT uniprot_id 
    FROM protein_data
    WHERE uniprot_id NOT IN (SELECT uniprot_id FROM proteins)
    ON CONFLICT (uniprot_id) DO NOTHING;
    
    -- Insert any missing PDB structures
    INSERT INTO pdb_structures (pdb_id)
    SELECT DISTINCT pdb_id
    FROM temp_predicted_eppic_eei 
    WHERE pdb_id IS NOT NULL 
      AND pdb_id NOT IN (SELECT pdb_id FROM pdb_structures)
    ON CONFLICT (pdb_id) DO NOTHING;
    
    -- Insert EEI interactions
    INSERT INTO eei_interactions (
        exon1_id, exon2_id, protein1_id, protein2_id, method_id, pdb_id,
        aa1, aa2
    )
    SELECT 
        e1.exon_id,
        e2.exon_id,
        p1.protein_id,
        p2.protein_id,
        v_method_id,
        t.pdb_id,
        t.aa1,
        t.aa2
    FROM temp_predicted_eppic_eei t
    JOIN exons e1 ON e1.ensembl_exon_id = t.exon1
    JOIN exons e2 ON e2.ensembl_exon_id = t.exon2
    JOIN proteins p1 ON p1.uniprot_id = t.protein1
    JOIN proteins p2 ON p2.uniprot_id = t.protein2
    WHERE t.exon1 IS NOT NULL 
      AND t.exon2 IS NOT NULL 
      AND t.protein1 IS NOT NULL 
      AND t.protein2 IS NOT NULL
    ON CONFLICT (exon1_id, exon2_id, method_id, pdb_id) DO NOTHING;
    
    GET DIAGNOSTICS v_inserted_count = ROW_COUNT;
    
    -- Insert orthology mapping data
    INSERT INTO eei_orthology_mapping (
        eei_id, source_organism_id, mouse_exon1_coordinates, mouse_exon2_coordinates,
        confidence, identity1, identity2, mapping_type1, mapping_type2
    )
    SELECT 
        ei.eei_id,
        v_source_organism_id,
        t.mouse_exon1,
        t.mouse_exon2,
        t.confidence,
        t.identity1,
        t.identity2,
        t.type1,
        t.type2
    FROM temp_predicted_eppic_eei t
    JOIN exons e1 ON e1.ensembl_exon_id = t.exon1
    JOIN exons e2 ON e2.ensembl_exon_id = t.exon2
    JOIN proteins p1 ON p1.uniprot_id = t.protein1
    JOIN proteins p2 ON p2.uniprot_id = t.protein2
    JOIN eei_interactions ei ON (
        ei.exon1_id = e1.exon_id AND 
        ei.exon2_id = e2.exon_id AND 
        ei.protein1_id = p1.protein_id AND 
        ei.protein2_id = p2.protein_id AND 
        ei.method_id = v_method_id AND
        (ei.pdb_id = t.pdb_id OR (ei.pdb_id IS NULL AND t.pdb_id IS NULL))
    )
    WHERE t.exon1 IS NOT NULL 
      AND t.exon2 IS NOT NULL 
      AND t.protein1 IS NOT NULL 
      AND t.protein2 IS NOT NULL
    ON CONFLICT (eei_id) DO NOTHING;
    
    -- Insert EPPIC-specific attributes
    INSERT INTO eei_eppic_attributes (
        eei_id, buried_area_abs, sol_acc_area_abs, cs_score, cr_score
    )
    SELECT 
        ei.eei_id,
        t.buried_area_abs,
        t.sol_acc_area_abs,
        t.cs_score,
        t.cr_score
    FROM temp_predicted_eppic_eei t
    JOIN exons e1 ON e1.ensembl_exon_id = t.exon1
    JOIN exons e2 ON e2.ensembl_exon_id = t.exon2
    JOIN proteins p1 ON p1.uniprot_id = t.protein1
    JOIN proteins p2 ON p2.uniprot_id = t.protein2
    JOIN eei_interactions ei ON (
        ei.exon1_id = e1.exon_id AND 
        ei.exon2_id = e2.exon_id AND 
        ei.protein1_id = p1.protein_id AND 
        ei.protein2_id = p2.protein_id AND 
        ei.method_id = v_method_id AND
        (ei.pdb_id = t.pdb_id OR (ei.pdb_id IS NULL AND t.pdb_id IS NULL))
    )
    WHERE t.exon1 IS NOT NULL 
      AND t.exon2 IS NOT NULL 
      AND t.protein1 IS NOT NULL 
      AND t.protein2 IS NOT NULL
    ON CONFLICT (eei_id) DO NOTHING;
    
    RETURN v_inserted_count;
END;
$$;


ALTER FUNCTION public.efficient_bulk_load_predicted_eppic_eei() OWNER TO bbf3630;

--
-- Name: efficient_bulk_load_predicted_pisa_eei(); Type: FUNCTION; Schema: public; Owner: bbf3630
--

CREATE FUNCTION public.efficient_bulk_load_predicted_pisa_eei() RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_inserted_count INTEGER := 0;
    v_method_id INTEGER;
    v_source_organism_id INTEGER;
BEGIN
    -- Ensure predicted_PISA method exists
    INSERT INTO eei_methods (method_name, method_type, description) 
    VALUES ('predicted_PISA', 'predicted', 'Orthology-based prediction from PISA method')
    ON CONFLICT (method_name) DO NOTHING;
    
    -- Get method and organism IDs
    SELECT method_id INTO v_method_id FROM eei_methods WHERE method_name = 'predicted_PISA';
    SELECT organism_id INTO v_source_organism_id FROM organisms WHERE name = 'Mouse';
    
    -- Create mouse organism if doesn't exist
    IF v_source_organism_id IS NULL THEN
        INSERT INTO organisms (name, scientific_name) VALUES ('Mouse', 'Mus musculus') 
        RETURNING organism_id INTO v_source_organism_id;
    END IF;
    
    -- Insert any missing exons
    WITH exon_data AS (
        SELECT exon1 as exon_id, NULL::INTEGER as max_length
        FROM temp_predicted_pisa_eei 
        WHERE exon1 IS NOT NULL
        GROUP BY exon1
        UNION
        SELECT exon2 as exon_id, NULL::INTEGER as max_length
        FROM temp_predicted_pisa_eei 
        WHERE exon2 IS NOT NULL
        GROUP BY exon2
    )
    INSERT INTO exons (ensembl_exon_id, exon_length)
    SELECT exon_id, max_length 
    FROM exon_data
    WHERE exon_id NOT IN (SELECT ensembl_exon_id FROM exons)
    ON CONFLICT (ensembl_exon_id) DO NOTHING;
    
    -- Insert any missing proteins  
    WITH protein_data AS (
        SELECT DISTINCT protein1 as uniprot_id
        FROM temp_predicted_pisa_eei 
        WHERE protein1 IS NOT NULL
        UNION
        SELECT DISTINCT protein2 as uniprot_id
        FROM temp_predicted_pisa_eei 
        WHERE protein2 IS NOT NULL
    )
    INSERT INTO proteins (uniprot_id)
    SELECT uniprot_id 
    FROM protein_data
    WHERE uniprot_id NOT IN (SELECT uniprot_id FROM proteins)
    ON CONFLICT (uniprot_id) DO NOTHING;
    
    -- Insert any missing PDB structures
    INSERT INTO pdb_structures (pdb_id)
    SELECT DISTINCT pdb_id
    FROM temp_predicted_pisa_eei 
    WHERE pdb_id IS NOT NULL 
      AND pdb_id NOT IN (SELECT pdb_id FROM pdb_structures)
    ON CONFLICT (pdb_id) DO NOTHING;
    
    -- Insert EEI interactions
    INSERT INTO eei_interactions (
        exon1_id, exon2_id, protein1_id, protein2_id, method_id, pdb_id,
        aa1, aa2
    )
    SELECT 
        e1.exon_id,
        e2.exon_id,
        p1.protein_id,
        p2.protein_id,
        v_method_id,
        t.pdb_id,
        t.aa1,
        t.aa2
    FROM temp_predicted_pisa_eei t
    JOIN exons e1 ON e1.ensembl_exon_id = t.exon1
    JOIN exons e2 ON e2.ensembl_exon_id = t.exon2
    JOIN proteins p1 ON p1.uniprot_id = t.protein1
    JOIN proteins p2 ON p2.uniprot_id = t.protein2
    WHERE t.exon1 IS NOT NULL 
      AND t.exon2 IS NOT NULL 
      AND t.protein1 IS NOT NULL 
      AND t.protein2 IS NOT NULL
    ON CONFLICT (exon1_id, exon2_id, method_id, pdb_id) DO NOTHING;
    
    GET DIAGNOSTICS v_inserted_count = ROW_COUNT;
    
    -- Insert orthology mapping data
    INSERT INTO eei_orthology_mapping (
        eei_id, source_organism_id, mouse_exon1_coordinates, mouse_exon2_coordinates,
        confidence, identity1, identity2, mapping_type1, mapping_type2
    )
    SELECT 
        ei.eei_id,
        v_source_organism_id,
        t.mouse_exon1,
        t.mouse_exon2,
        t.confidence,
        t.identity1,
        t.identity2,
        t.type1,
        t.type2
    FROM temp_predicted_pisa_eei t
    JOIN exons e1 ON e1.ensembl_exon_id = t.exon1
    JOIN exons e2 ON e2.ensembl_exon_id = t.exon2
    JOIN proteins p1 ON p1.uniprot_id = t.protein1
    JOIN proteins p2 ON p2.uniprot_id = t.protein2
    JOIN eei_interactions ei ON (
        ei.exon1_id = e1.exon_id AND 
        ei.exon2_id = e2.exon_id AND 
        ei.protein1_id = p1.protein_id AND 
        ei.protein2_id = p2.protein_id AND 
        ei.method_id = v_method_id AND
        (ei.pdb_id = t.pdb_id OR (ei.pdb_id IS NULL AND t.pdb_id IS NULL))
    )
    WHERE t.exon1 IS NOT NULL 
      AND t.exon2 IS NOT NULL 
      AND t.protein1 IS NOT NULL 
      AND t.protein2 IS NOT NULL
    ON CONFLICT (eei_id) DO NOTHING;
    
    -- Insert PISA-specific attributes
    INSERT INTO eei_pisa_attributes (
        eei_id, free_energy, buried_area, buried_area_abs, sol_acc_area_abs,
        hydrogen_bonds, disulphide_bonds, salt_bridges, covalent_bonds
    )
    SELECT 
        ei.eei_id,
        t.free_energy,
        t.buried_area,
        t.buried_area_abs,
        t.sol_acc_area_abs,
        COALESCE(t.hydrogen, 0),
        COALESCE(t.disulphide, 0),
        COALESCE(t.saltbridge, 0),
        COALESCE(t.covalent, 0)
    FROM temp_predicted_pisa_eei t
    JOIN exons e1 ON e1.ensembl_exon_id = t.exon1
    JOIN exons e2 ON e2.ensembl_exon_id = t.exon2
    JOIN proteins p1 ON p1.uniprot_id = t.protein1
    JOIN proteins p2 ON p2.uniprot_id = t.protein2
    JOIN eei_interactions ei ON (
        ei.exon1_id = e1.exon_id AND 
        ei.exon2_id = e2.exon_id AND 
        ei.protein1_id = p1.protein_id AND 
        ei.protein2_id = p2.protein_id AND 
        ei.method_id = v_method_id AND
        (ei.pdb_id = t.pdb_id OR (ei.pdb_id IS NULL AND t.pdb_id IS NULL))
    )
    WHERE t.exon1 IS NOT NULL 
      AND t.exon2 IS NOT NULL 
      AND t.protein1 IS NOT NULL 
      AND t.protein2 IS NOT NULL
    ON CONFLICT (eei_id) DO NOTHING;
    
    RETURN v_inserted_count;
END;
$$;


ALTER FUNCTION public.efficient_bulk_load_predicted_pisa_eei() OWNER TO bbf3630;

--
-- Name: export_eei_by_method(character varying); Type: FUNCTION; Schema: public; Owner: bbf3630
--

CREATE FUNCTION public.export_eei_by_method(method_name_param character varying) RETURNS TABLE(exon1 character varying, exon2 character varying, protein1 character varying, protein2 character varying, gene1 character varying, gene2 character varying, pdb_id character varying, confidence numeric, jaccard_percent numeric, aa1 integer, aa2 integer, method_specific_data json)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e1.ensembl_exon_id,
        e2.ensembl_exon_id,
        p1.uniprot_id,
        p2.uniprot_id,
        g1.gene_symbol,
        g2.gene_symbol,
        ei.pdb_id,
        eom.confidence,
        ei.jaccard_percent,
        ei.aa1,
        ei.aa2,
        CASE 
            WHEN em.method_name IN ('PISA', 'predicted_PISA') THEN
                json_build_object(
                    'free_energy', epa.free_energy,
                    'buried_area', epa.buried_area,
                    'buried_area_abs', epa.buried_area_abs,
                    'sol_acc_area_abs', epa.sol_acc_area_abs,
                    'hydrogen_bonds', epa.hydrogen_bonds,
                    'disulphide_bonds', epa.disulphide_bonds,
                    'salt_bridges', epa.salt_bridges,
                    'covalent_bonds', epa.covalent_bonds
                )
            WHEN em.method_name IN ('EPPIC', 'predicted_EPPIC') THEN
                json_build_object(
                    'buried_area_abs', eea.buried_area_abs,
                    'sol_acc_area_abs', eea.sol_acc_area_abs,
                    'cs_score', eea.cs_score,
                    'cr_score', eea.cr_score
                )
            ELSE
                json_build_object(
                    'coverage_data', json_build_object(
                        'exon1_coverage', ei.exon1_coverage,
                        'exon2_coverage', ei.exon2_coverage,
                        'exon1_coverage_percent', ei.exon1_coverage_percent,
                        'exon2_coverage_percent', ei.exon2_coverage_percent
                    )
                )
        END as method_specific_data
    FROM eei_interactions ei
    JOIN exons e1 ON ei.exon1_id = e1.exon_id
    JOIN exons e2 ON ei.exon2_id = e2.exon_id
    JOIN proteins p1 ON ei.protein1_id = p1.protein_id
    JOIN proteins p2 ON ei.protein2_id = p2.protein_id
    JOIN genes g1 ON e1.gene_id = g1.gene_id
    JOIN genes g2 ON e2.gene_id = g2.gene_id
    JOIN eei_methods em ON ei.method_id = em.method_id
    LEFT JOIN eei_orthology_mapping eom ON ei.eei_id = eom.eei_id
    LEFT JOIN eei_pisa_attributes epa ON ei.eei_id = epa.eei_id
    LEFT JOIN eei_eppic_attributes eea ON ei.eei_id = eea.eei_id
    WHERE em.method_name = method_name_param
    ORDER BY 
        CASE WHEN eom.confidence IS NOT NULL THEN eom.confidence ELSE 1.0 END DESC;
END;
$$;


ALTER FUNCTION public.export_eei_by_method(method_name_param character varying) OWNER TO bbf3630;

--
-- Name: get_eei_details(integer); Type: FUNCTION; Schema: public; Owner: bbf3630
--

CREATE FUNCTION public.get_eei_details(eei_id_param integer) RETURNS TABLE(eei_id integer, exon1_id character varying, exon2_id character varying, exon1_coordinates character varying, exon2_coordinates character varying, protein1_id character varying, protein2_id character varying, protein1_name character varying, protein2_name character varying, gene1_symbol character varying, gene2_symbol character varying, gene1_name character varying, gene2_name character varying, method_name character varying, method_type character varying, pdb_id character varying, pdb_title text, confidence numeric, mouse_exon1 character varying, mouse_exon2 character varying, jaccard_percent numeric, aa1 integer, aa2 integer, free_energy numeric, buried_area numeric, buried_area_abs numeric, sol_acc_area_abs numeric, hydrogen_bonds integer, disulphide_bonds integer, salt_bridges integer, covalent_bonds integer, cs_score numeric, cr_score numeric)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ei.eei_id,
        e1.ensembl_exon_id,
        e2.ensembl_exon_id,
        CONCAT(e1.chromosome, ':', e1.exon_start, '-', e1.exon_end, ':', e1.strand),
        CONCAT(e2.chromosome, ':', e2.exon_start, '-', e2.exon_end, ':', e2.strand),
        p1.uniprot_id,
        p2.uniprot_id,
        p1.protein_name,
        p2.protein_name,
        g1.gene_symbol,
        g2.gene_symbol,
        g1.gene_name,
        g2.gene_name,
        em.method_name,
        em.method_type,
        ei.pdb_id,
        pdb.title,
        eom.confidence,
        eom.mouse_exon1_coordinates,
        eom.mouse_exon2_coordinates,
        ei.jaccard_percent,
        ei.aa1,
        ei.aa2,
        epa.free_energy,
        epa.buried_area,
        COALESCE(epa.buried_area_abs, eea.buried_area_abs),
        COALESCE(epa.sol_acc_area_abs, eea.sol_acc_area_abs),
        epa.hydrogen_bonds,
        epa.disulphide_bonds,
        epa.salt_bridges,
        epa.covalent_bonds,
        eea.cs_score,
        eea.cr_score
    FROM eei_interactions ei
    JOIN exons e1 ON ei.exon1_id = e1.exon_id
    JOIN exons e2 ON ei.exon2_id = e2.exon_id
    JOIN proteins p1 ON ei.protein1_id = p1.protein_id
    JOIN proteins p2 ON ei.protein2_id = p2.protein_id
    JOIN genes g1 ON e1.gene_id = g1.gene_id
    JOIN genes g2 ON e2.gene_id = g2.gene_id
    JOIN eei_methods em ON ei.method_id = em.method_id
    LEFT JOIN pdb_structures pdb ON ei.pdb_id = pdb.pdb_id
    LEFT JOIN eei_orthology_mapping eom ON ei.eei_id = eom.eei_id
    LEFT JOIN eei_pisa_attributes epa ON ei.eei_id = epa.eei_id
    LEFT JOIN eei_eppic_attributes eea ON ei.eei_id = eea.eei_id
    WHERE ei.eei_id = eei_id_param;
END;
$$;


ALTER FUNCTION public.get_eei_details(eei_id_param integer) OWNER TO bbf3630;

--
-- Name: get_eei_statistics(); Type: FUNCTION; Schema: public; Owner: bbf3630
--

CREATE FUNCTION public.get_eei_statistics() RETURNS TABLE(metric character varying, value bigint)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT 'Total EEI Interactions'::VARCHAR(100), COUNT(*)::BIGINT FROM eei_interactions
    UNION ALL
    SELECT 'Experimental EEIs', COUNT(*)::BIGINT FROM eei_interactions ei JOIN eei_methods em ON ei.method_id = em.method_id WHERE em.method_type = 'experimental'
    UNION ALL
    SELECT 'Predicted EEIs', COUNT(*)::BIGINT FROM eei_interactions ei JOIN eei_methods em ON ei.method_id = em.method_id WHERE em.method_type = 'predicted'
    UNION ALL
    SELECT 'Contact-based EEIs', COUNT(*)::BIGINT FROM eei_interactions ei JOIN eei_methods em ON ei.method_id = em.method_id WHERE em.method_name = 'contact_based'
    UNION ALL
    SELECT 'PISA EEIs', COUNT(*)::BIGINT FROM eei_interactions ei JOIN eei_methods em ON ei.method_id = em.method_id WHERE em.method_name = 'PISA'
    UNION ALL
    SELECT 'EPPIC EEIs', COUNT(*)::BIGINT FROM eei_interactions ei JOIN eei_methods em ON ei.method_id = em.method_id WHERE em.method_name = 'EPPIC'
    UNION ALL
    SELECT 'Unique Exons', COUNT(DISTINCT ensembl_exon_id)::BIGINT FROM exons
    UNION ALL
    SELECT 'Unique Proteins', COUNT(DISTINCT uniprot_id)::BIGINT FROM proteins
    UNION ALL
    SELECT 'Unique Genes', COUNT(DISTINCT gene_symbol)::BIGINT FROM genes
    UNION ALL
    SELECT 'Unique PDB Structures', COUNT(DISTINCT pdb_id)::BIGINT FROM pdb_structures;
END;
$$;


ALTER FUNCTION public.get_eei_statistics() OWNER TO bbf3630;

--
-- Name: get_gene_eei_network(character varying, integer); Type: FUNCTION; Schema: public; Owner: bbf3630
--

CREATE FUNCTION public.get_gene_eei_network(gene_symbol_param character varying, max_interactions integer DEFAULT 50) RETURNS TABLE(source_gene character varying, target_gene character varying, source_exon character varying, target_exon character varying, source_protein character varying, target_protein character varying, method_name character varying, confidence numeric, jaccard_percent numeric, eei_id integer)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        g1.gene_symbol as source_gene,
        g2.gene_symbol as target_gene,
        e1.ensembl_exon_id as source_exon,
        e2.ensembl_exon_id as target_exon,
        p1.uniprot_id as source_protein,
        p2.uniprot_id as target_protein,
        em.method_name,
        eom.confidence,
        ei.jaccard_percent,
        ei.eei_id
    FROM eei_interactions ei
    JOIN exons e1 ON ei.exon1_id = e1.exon_id
    JOIN exons e2 ON ei.exon2_id = e2.exon_id
    JOIN proteins p1 ON ei.protein1_id = p1.protein_id
    JOIN proteins p2 ON ei.protein2_id = p2.protein_id
    JOIN genes g1 ON e1.gene_id = g1.gene_id
    JOIN genes g2 ON e2.gene_id = g2.gene_id
    JOIN eei_methods em ON ei.method_id = em.method_id
    LEFT JOIN eei_orthology_mapping eom ON ei.eei_id = eom.eei_id
    WHERE 
        g1.gene_symbol ILIKE gene_symbol_param 
        OR g2.gene_symbol ILIKE gene_symbol_param
    ORDER BY 
        CASE WHEN eom.confidence IS NOT NULL THEN eom.confidence ELSE 1.0 END DESC
    LIMIT max_interactions;
END;
$$;


ALTER FUNCTION public.get_gene_eei_network(gene_symbol_param character varying, max_interactions integer) OWNER TO bbf3630;

--
-- Name: load_contact_based_eei(character varying, character varying, character varying, character varying, integer, integer, integer, integer, numeric, numeric, numeric); Type: FUNCTION; Schema: public; Owner: bbf3630
--

CREATE FUNCTION public.load_contact_based_eei(p_protein1 character varying, p_protein1_chain character varying, p_exon1 character varying, p_exon2 character varying, p_exon1_length integer, p_exon2_length integer, p_exon1_coverage integer, p_exon2_coverage integer, p_exon1_coverage_percent numeric, p_exon2_coverage_percent numeric, p_jaccard_percent numeric) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_eei_id INTEGER;
    v_exon1_id INTEGER;
    v_exon2_id INTEGER;
    v_protein1_id INTEGER;
    v_protein2_id INTEGER;
    v_method_id INTEGER;
    v_pdb_id VARCHAR(10);
BEGIN
    -- Extract PDB ID from protein chain identifier
    v_pdb_id := split_part(p_protein1_chain, '_', 2);
    
    -- Get method ID for contact_based
    SELECT method_id INTO v_method_id FROM eei_methods WHERE method_name = 'contact_based';
    
    -- Get or create exon1
    SELECT exon_id INTO v_exon1_id FROM exons WHERE ensembl_exon_id = p_exon1;
    IF v_exon1_id IS NULL THEN
        INSERT INTO exons (ensembl_exon_id, exon_length) VALUES (p_exon1, p_exon1_length) RETURNING exon_id INTO v_exon1_id;
    END IF;
    
    -- Get or create exon2
    SELECT exon_id INTO v_exon2_id FROM exons WHERE ensembl_exon_id = p_exon2;
    IF v_exon2_id IS NULL THEN
        INSERT INTO exons (ensembl_exon_id, exon_length) VALUES (p_exon2, p_exon2_length) RETURNING exon_id INTO v_exon2_id;
    END IF;
    
    SELECT protein_id INTO v_protein1_id FROM proteins WHERE uniprot_id = p_protein1;
    IF v_protein1_id IS NULL THEN
        INSERT INTO proteins (uniprot_id) VALUES (p_protein1) RETURNING protein_id INTO v_protein1_id;
    END IF;
    
    SELECT protein_id INTO v_protein2_id FROM proteins WHERE uniprot_id = p_protein2;
    IF v_protein2_id IS NULL THEN
        INSERT INTO proteins (uniprot_id) VALUES (p_protein2) RETURNING protein_id INTO v_protein2_id;
    END IF;
    
    -- Insert PDB structure if provided
    IF p_pdb_id IS NOT NULL THEN
        INSERT INTO pdb_structures (pdb_id) VALUES (p_pdb_id) ON CONFLICT (pdb_id) DO NOTHING;
    END IF;
    
    -- Insert EEI interaction
    INSERT INTO eei_interactions (
        exon1_id, exon2_id, protein1_id, protein2_id, method_id, pdb_id,
        exon1_length, exon2_length, exon1_coverage, exon2_coverage,
        exon1_coverage_percent, exon2_coverage_percent, jaccard_percent,
        aa1, aa2
    ) VALUES (
        v_exon1_id, v_exon2_id, v_protein1_id, v_protein2_id, v_method_id, p_pdb_id,
        p_exon1_length, p_exon2_length, p_exon1_coverage, p_exon2_coverage,
        p_exon1_coverage_percent, p_exon2_coverage_percent, p_jaccard_percent,
        p_aa1, p_aa2
    ) ON CONFLICT (exon1_id, exon2_id, method_id, pdb_id) DO NOTHING
    RETURNING eei_id INTO v_eei_id;
    
    -- Insert orthology mapping
    IF v_eei_id IS NOT NULL THEN
        INSERT INTO eei_orthology_mapping (
            eei_id, source_organism_id, mouse_exon1_coordinates, mouse_exon2_coordinates,
            confidence, identity1, identity2, mapping_type1, mapping_type2
        ) VALUES (
            v_eei_id, v_source_organism_id, p_mouse_exon1, p_mouse_exon2,
            p_confidence, p_identity1, p_identity2, p_type1, p_type2
        );
        
        -- Insert method-specific attributes
        IF p_method_name = 'predicted_PISA' THEN
            INSERT INTO eei_pisa_attributes (
                eei_id, free_energy, buried_area, buried_area_abs, sol_acc_area_abs,
                hydrogen_bonds, disulphide_bonds, salt_bridges, covalent_bonds
            ) VALUES (
                v_eei_id, p_free_energy, p_buried_area, p_buried_area_abs, p_sol_acc_area_abs,
                p_hydrogen, p_disulphide, p_saltbridge, p_covalent
            );
        ELSIF p_method_name = 'predicted_EPPIC' THEN
            INSERT INTO eei_eppic_attributes (
                eei_id, buried_area_abs, sol_acc_area_abs, cs_score, cr_score
            ) VALUES (
                v_eei_id, p_buried_area_abs, p_sol_acc_area_abs, p_cs_score, p_cr_score
            );
        END IF;
    END IF;
    
    RETURN v_eei_id;
END;
$$;


ALTER FUNCTION public.load_contact_based_eei(p_protein1 character varying, p_protein1_chain character varying, p_exon1 character varying, p_exon2 character varying, p_exon1_length integer, p_exon2_length integer, p_exon1_coverage integer, p_exon2_coverage integer, p_exon1_coverage_percent numeric, p_exon2_coverage_percent numeric, p_jaccard_percent numeric) OWNER TO bbf3630;

--
-- Name: load_eppic_eei(character varying, character varying, integer, integer, character varying, character varying, numeric, numeric, numeric, numeric, character varying); Type: FUNCTION; Schema: public; Owner: bbf3630
--

CREATE FUNCTION public.load_eppic_eei(p_exon1 character varying, p_exon2 character varying, p_aa1 integer, p_aa2 integer, p_protein1 character varying, p_protein2 character varying, p_buried_area_abs numeric, p_sol_acc_area_abs numeric, p_cs_score numeric, p_cr_score numeric, p_pdb_id character varying) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_eei_id INTEGER;
    v_exon1_id INTEGER;
    v_exon2_id INTEGER;
    v_protein1_id INTEGER;
    v_protein2_id INTEGER;
    v_method_id INTEGER;
BEGIN
    -- Get method ID for EPPIC
    SELECT method_id INTO v_method_id FROM eei_methods WHERE method_name = 'EPPIC';
    
    -- Get or create entities (similar to previous functions)
    SELECT exon_id INTO v_exon1_id FROM exons WHERE ensembl_exon_id = p_exon1;
    IF v_exon1_id IS NULL THEN
        INSERT INTO exons (ensembl_exon_id) VALUES (p_exon1) RETURNING exon_id INTO v_exon1_id;
    END IF;
    
    SELECT exon_id INTO v_exon2_id FROM exons WHERE ensembl_exon_id = p_exon2;
    IF v_exon2_id IS NULL THEN
        INSERT INTO exons (ensembl_exon_id) VALUES (p_exon2) RETURNING exon_id INTO v_exon2_id;
    END IF;
    
    SELECT protein_id INTO v_protein1_id FROM proteins WHERE uniprot_id = p_protein1;
    IF v_protein1_id IS NULL THEN
        INSERT INTO proteins (uniprot_id) VALUES (p_protein1) RETURNING protein_id INTO v_protein1_id;
    END IF;
    
    SELECT protein_id INTO v_protein2_id FROM proteins WHERE uniprot_id = p_protein2;
    IF v_protein2_id IS NULL THEN
        INSERT INTO proteins (uniprot_id) VALUES (p_protein2) RETURNING protein_id INTO v_protein2_id;
    END IF;
    
    -- Insert PDB structure
    INSERT INTO pdb_structures (pdb_id) VALUES (p_pdb_id) ON CONFLICT (pdb_id) DO NOTHING;
    
    -- Insert EEI interaction
    INSERT INTO eei_interactions (
        exon1_id, exon2_id, protein1_id, protein2_id, method_id, pdb_id, aa1, aa2
    ) VALUES (
        v_exon1_id, v_exon2_id, v_protein1_id, v_protein2_id, v_method_id, p_pdb_id, p_aa1, p_aa2
    ) ON CONFLICT (exon1_id, exon2_id, method_id, pdb_id) DO NOTHING
    RETURNING eei_id INTO v_eei_id;
    
    -- Insert EPPIC-specific attributes
    IF v_eei_id IS NOT NULL THEN
        INSERT INTO eei_eppic_attributes (
            eei_id, buried_area_abs, sol_acc_area_abs, cs_score, cr_score
        ) VALUES (
            v_eei_id, p_buried_area_abs, p_sol_acc_area_abs, p_cs_score, p_cr_score
        );
    END IF;
    
    RETURN v_eei_id;
END;
$$;


ALTER FUNCTION public.load_eppic_eei(p_exon1 character varying, p_exon2 character varying, p_aa1 integer, p_aa2 integer, p_protein1 character varying, p_protein2 character varying, p_buried_area_abs numeric, p_sol_acc_area_abs numeric, p_cs_score numeric, p_cr_score numeric, p_pdb_id character varying) OWNER TO bbf3630;

--
-- Name: load_pisa_eei(character varying, character varying, integer, integer, character varying, character varying, numeric, numeric, integer, integer, integer, integer, numeric, numeric, character varying); Type: FUNCTION; Schema: public; Owner: bbf3630
--

CREATE FUNCTION public.load_pisa_eei(p_exon1 character varying, p_exon2 character varying, p_aa1 integer, p_aa2 integer, p_protein1 character varying, p_protein2 character varying, p_free_energy numeric, p_buried_area numeric, p_hydrogen integer, p_disulphide integer, p_saltbridge integer, p_covalent integer, p_buried_area_abs numeric, p_sol_acc_area_abs numeric, p_pdb_id character varying) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_eei_id INTEGER;
    v_exon1_id INTEGER;
    v_exon2_id INTEGER;
    v_protein1_id INTEGER;
    v_protein2_id INTEGER;
    v_method_id INTEGER;
BEGIN
    -- Get method ID for PISA
    SELECT method_id INTO v_method_id FROM eei_methods WHERE method_name = 'PISA';
    
    -- Get or create entities (similar to contact_based function)
    SELECT exon_id INTO v_exon1_id FROM exons WHERE ensembl_exon_id = p_exon1;
    IF v_exon1_id IS NULL THEN
        INSERT INTO exons (ensembl_exon_id) VALUES (p_exon1) RETURNING exon_id INTO v_exon1_id;
    END IF;
    
    SELECT exon_id INTO v_exon2_id FROM exons WHERE ensembl_exon_id = p_exon2;
    IF v_exon2_id IS NULL THEN
        INSERT INTO exons (ensembl_exon_id) VALUES (p_exon2) RETURNING exon_id INTO v_exon2_id;
    END IF;
    
    SELECT protein_id INTO v_protein1_id FROM proteins WHERE uniprot_id = p_protein1;
    IF v_protein1_id IS NULL THEN
        INSERT INTO proteins (uniprot_id) VALUES (p_protein1) RETURNING protein_id INTO v_protein1_id;
    END IF;
    
    SELECT protein_id INTO v_protein2_id FROM proteins WHERE uniprot_id = p_protein2;
    IF v_protein2_id IS NULL THEN
        INSERT INTO proteins (uniprot_id) VALUES (p_protein2) RETURNING protein_id INTO v_protein2_id;
    END IF;
    
    -- Insert PDB structure
    INSERT INTO pdb_structures (pdb_id) VALUES (p_pdb_id) ON CONFLICT (pdb_id) DO NOTHING;
    
    -- Insert EEI interaction
    INSERT INTO eei_interactions (
        exon1_id, exon2_id, protein1_id, protein2_id, method_id, pdb_id, aa1, aa2
    ) VALUES (
        v_exon1_id, v_exon2_id, v_protein1_id, v_protein2_id, v_method_id, p_pdb_id, p_aa1, p_aa2
    ) ON CONFLICT (exon1_id, exon2_id, method_id, pdb_id) DO NOTHING
    RETURNING eei_id INTO v_eei_id;
    
    -- Insert PISA-specific attributes
    IF v_eei_id IS NOT NULL THEN
        INSERT INTO eei_pisa_attributes (
            eei_id, free_energy, buried_area, buried_area_abs, sol_acc_area_abs,
            hydrogen_bonds, disulphide_bonds, salt_bridges, covalent_bonds
        ) VALUES (
            v_eei_id, p_free_energy, p_buried_area, p_buried_area_abs, p_sol_acc_area_abs,
            p_hydrogen, p_disulphide, p_saltbridge, p_covalent
        );
    END IF;
    
    RETURN v_eei_id;
END;
$$;


ALTER FUNCTION public.load_pisa_eei(p_exon1 character varying, p_exon2 character varying, p_aa1 integer, p_aa2 integer, p_protein1 character varying, p_protein2 character varying, p_free_energy numeric, p_buried_area numeric, p_hydrogen integer, p_disulphide integer, p_saltbridge integer, p_covalent integer, p_buried_area_abs numeric, p_sol_acc_area_abs numeric, p_pdb_id character varying) OWNER TO bbf3630;

--
-- Name: load_predicted_eei(character varying, character varying, character varying, character varying, numeric, numeric, numeric, character varying, character varying, character varying, character varying, character varying, character varying, integer, integer, integer, integer, integer, integer, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric, integer, integer, integer, integer); Type: FUNCTION; Schema: public; Owner: bbf3630
--

CREATE FUNCTION public.load_predicted_eei(p_exon1 character varying, p_exon2 character varying, p_mouse_exon1 character varying, p_mouse_exon2 character varying, p_confidence numeric, p_identity1 numeric, p_identity2 numeric, p_type1 character varying, p_type2 character varying, p_protein1 character varying, p_protein2 character varying, p_method_name character varying, p_pdb_id character varying DEFAULT NULL::character varying, p_aa1 integer DEFAULT NULL::integer, p_aa2 integer DEFAULT NULL::integer, p_exon1_length integer DEFAULT NULL::integer, p_exon2_length integer DEFAULT NULL::integer, p_exon1_coverage integer DEFAULT NULL::integer, p_exon2_coverage integer DEFAULT NULL::integer, p_exon1_coverage_percent numeric DEFAULT NULL::numeric, p_exon2_coverage_percent numeric DEFAULT NULL::numeric, p_jaccard_percent numeric DEFAULT NULL::numeric, p_buried_area_abs numeric DEFAULT NULL::numeric, p_sol_acc_area_abs numeric DEFAULT NULL::numeric, p_cs_score numeric DEFAULT NULL::numeric, p_cr_score numeric DEFAULT NULL::numeric, p_free_energy numeric DEFAULT NULL::numeric, p_buried_area numeric DEFAULT NULL::numeric, p_hydrogen integer DEFAULT NULL::integer, p_disulphide integer DEFAULT NULL::integer, p_saltbridge integer DEFAULT NULL::integer, p_covalent integer DEFAULT NULL::integer) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_eei_id INTEGER;
    v_exon1_id INTEGER;
    v_exon2_id INTEGER;
    v_protein1_id INTEGER;
    v_protein2_id INTEGER;
    v_method_id INTEGER;
    v_source_organism_id INTEGER;
BEGIN
    -- Get method ID
    SELECT method_id INTO v_method_id FROM eei_methods WHERE method_name = p_method_name;
    
    -- Validate method exists
    IF v_method_id IS NULL THEN
        RAISE EXCEPTION 'Method % not found in eei_methods table', p_method_name;
    END IF;
    
    -- Get source organism (mouse)
    SELECT organism_id INTO v_source_organism_id FROM organisms WHERE name = 'Mouse';
    
    -- Create mouse organism if doesn't exist
    IF v_source_organism_id IS NULL THEN
        INSERT INTO organisms (name, scientific_name) VALUES ('Mouse', 'Mus musculus') 
        RETURNING organism_id INTO v_source_organism_id;
    END IF;
    
    -- Get or create exon1
    SELECT exon_id INTO v_exon1_id FROM exons WHERE ensembl_exon_id = p_exon1;
    IF v_exon1_id IS NULL THEN
        INSERT INTO exons (ensembl_exon_id, exon_length) 
        VALUES (p_exon1, p_exon1_length) 
        RETURNING exon_id INTO v_exon1_id;
    END IF;
    
    -- Get or create exon2
    SELECT exon_id INTO v_exon2_id FROM exons WHERE ensembl_exon_id = p_exon2;
    IF v_exon2_id IS NULL THEN
        INSERT INTO exons (ensembl_exon_id, exon_length) 
        VALUES (p_exon2, p_exon2_length) 
        RETURNING exon_id INTO v_exon2_id;
    END IF;
    
    -- Get or create protein1
    SELECT protein_id INTO v_protein1_id FROM proteins WHERE uniprot_id = p_protein1;
    IF v_protein1_id IS NULL THEN
        INSERT INTO proteins (uniprot_id) 
        VALUES (p_protein1) 
        RETURNING protein_id INTO v_protein1_id;
    END IF;
    
    -- Get or create protein2
    SELECT protein_id INTO v_protein2_id FROM proteins WHERE uniprot_id = p_protein2;
    IF v_protein2_id IS NULL THEN
        INSERT INTO proteins (uniprot_id) 
        VALUES (p_protein2) 
        RETURNING protein_id INTO v_protein2_id;
    END IF;
    
    -- Insert PDB structure if provided
    IF p_pdb_id IS NOT NULL THEN
        INSERT INTO pdb_structures (pdb_id) 
        VALUES (p_pdb_id) 
        ON CONFLICT (pdb_id) DO NOTHING;
    END IF;
    
    -- Insert EEI interaction
    INSERT INTO eei_interactions (
        exon1_id, exon2_id, protein1_id, protein2_id, method_id, pdb_id,
        exon1_length, exon2_length, exon1_coverage, exon2_coverage,
        exon1_coverage_percent, exon2_coverage_percent, jaccard_percent,
        aa1, aa2
    ) VALUES (
        v_exon1_id, v_exon2_id, v_protein1_id, v_protein2_id, v_method_id, p_pdb_id,
        p_exon1_length, p_exon2_length, p_exon1_coverage, p_exon2_coverage,
        p_exon1_coverage_percent, p_exon2_coverage_percent, p_jaccard_percent,
        p_aa1, p_aa2
    ) ON CONFLICT (exon1_id, exon2_id, method_id, pdb_id) DO NOTHING
    RETURNING eei_id INTO v_eei_id;
    
    -- Only proceed if the interaction was inserted (not a duplicate)
    IF v_eei_id IS NOT NULL THEN
        -- Insert orthology mapping
        INSERT INTO eei_orthology_mapping (
            eei_id, source_organism_id, mouse_exon1_coordinates, mouse_exon2_coordinates,
            confidence, identity1, identity2, mapping_type1, mapping_type2
        ) VALUES (
            v_eei_id, v_source_organism_id, p_mouse_exon1, p_mouse_exon2,
            p_confidence, p_identity1, p_identity2, p_type1, p_type2
        );
        
        -- Insert method-specific attributes based on method type
        IF p_method_name = 'predicted_PISA' AND 
           (p_free_energy IS NOT NULL OR p_buried_area IS NOT NULL OR p_buried_area_abs IS NOT NULL) THEN
            INSERT INTO eei_pisa_attributes (
                eei_id, free_energy, buried_area, buried_area_abs, sol_acc_area_abs,
                hydrogen_bonds, disulphide_bonds, salt_bridges, covalent_bonds
            ) VALUES (
                v_eei_id, p_free_energy, p_buried_area, p_buried_area_abs, p_sol_acc_area_abs,
                COALESCE(p_hydrogen, 0), COALESCE(p_disulphide, 0), 
                COALESCE(p_saltbridge, 0), COALESCE(p_covalent, 0)
            );
        ELSIF p_method_name = 'predicted_EPPIC' AND 
              (p_buried_area_abs IS NOT NULL OR p_sol_acc_area_abs IS NOT NULL OR 
               p_cs_score IS NOT NULL OR p_cr_score IS NOT NULL) THEN
            INSERT INTO eei_eppic_attributes (
                eei_id, buried_area_abs, sol_acc_area_abs, cs_score, cr_score
            ) VALUES (
                v_eei_id, p_buried_area_abs, p_sol_acc_area_abs, p_cs_score, p_cr_score
            );
        END IF;
        
        -- Log successful insertion
        RAISE NOTICE 'Successfully inserted predicted EEI with ID: %', v_eei_id;
    ELSE
        -- Get existing EEI ID for duplicate case
        SELECT eei_id INTO v_eei_id 
        FROM eei_interactions 
        WHERE exon1_id = v_exon1_id 
          AND exon2_id = v_exon2_id 
          AND method_id = v_method_id 
          AND (pdb_id = p_pdb_id OR (pdb_id IS NULL AND p_pdb_id IS NULL));
        
        RAISE NOTICE 'EEI already exists with ID: %', v_eei_id;
    END IF;
    
    RETURN v_eei_id;
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error in load_predicted_eei: %, SQLSTATE: %', SQLERRM, SQLSTATE;
END;
$$;


ALTER FUNCTION public.load_predicted_eei(p_exon1 character varying, p_exon2 character varying, p_mouse_exon1 character varying, p_mouse_exon2 character varying, p_confidence numeric, p_identity1 numeric, p_identity2 numeric, p_type1 character varying, p_type2 character varying, p_protein1 character varying, p_protein2 character varying, p_method_name character varying, p_pdb_id character varying, p_aa1 integer, p_aa2 integer, p_exon1_length integer, p_exon2_length integer, p_exon1_coverage integer, p_exon2_coverage integer, p_exon1_coverage_percent numeric, p_exon2_coverage_percent numeric, p_jaccard_percent numeric, p_buried_area_abs numeric, p_sol_acc_area_abs numeric, p_cs_score numeric, p_cr_score numeric, p_free_energy numeric, p_buried_area numeric, p_hydrogen integer, p_disulphide integer, p_saltbridge integer, p_covalent integer) OWNER TO bbf3630;

--
-- Name: search_eei(character varying, character varying); Type: FUNCTION; Schema: public; Owner: bbf3630
--

CREATE FUNCTION public.search_eei(search_term character varying, search_type character varying DEFAULT 'any'::character varying) RETURNS TABLE(eei_id integer, exon1 character varying, exon2 character varying, protein1 character varying, protein2 character varying, gene1 character varying, gene2 character varying, method_name character varying, pdb_id character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT DISTINCT
        vee.eei_id,
        vee.exon1,
        vee.exon2,
        vee.protein1,
        vee.protein2,
        vee.gene1,
        vee.gene2,
        vee.method_name,
        vee.pdb_id
    FROM v_experimental_eei vee
    WHERE 
        (search_type = 'any' OR search_type = 'gene') AND (vee.gene1 ILIKE '%' || search_term || '%' OR vee.gene2 ILIKE '%' || search_term || '%')
        OR
        (search_type = 'any' OR search_type = 'protein') AND (vee.protein1 ILIKE '%' || search_term || '%' OR vee.protein2 ILIKE '%' || search_term || '%')
        OR
        (search_type = 'any' OR search_type = 'exon') AND (vee.exon1 ILIKE '%' || search_term || '%' OR vee.exon2 ILIKE '%' || search_term || '%')
    
    UNION
    
    SELECT DISTINCT
        vpe.eei_id,
        vpe.exon1,
        vpe.exon2,
        vpe.protein1,
        vpe.protein2,
        vpe.gene1,
        vpe.gene2,
        vpe.method_name,
        vpe.pdb_id
    FROM v_predicted_eei vpe
    WHERE 
        (search_type = 'any' OR search_type = 'gene') AND (vpe.gene1 ILIKE '%' || search_term || '%' OR vpe.gene2 ILIKE '%' || search_term || '%')
        OR
        (search_type = 'any' OR search_type = 'protein') AND (vpe.protein1 ILIKE '%' || search_term || '%' OR vpe.protein2 ILIKE '%' || search_term || '%')
        OR
        (search_type = 'any' OR search_type = 'exon') AND (vpe.exon1 ILIKE '%' || search_term || '%' OR vpe.exon2 ILIKE '%' || search_term || '%')
    
    ORDER BY eei_id;
END;
$$;


ALTER FUNCTION public.search_eei(search_term character varying, search_type character varying) OWNER TO bbf3630;

--
-- Name: search_eei_interactions(character varying, character varying, integer, integer); Type: FUNCTION; Schema: public; Owner: bbf3630
--

CREATE FUNCTION public.search_eei_interactions(search_term character varying, search_type character varying DEFAULT 'any'::character varying, result_limit integer DEFAULT 50, result_offset integer DEFAULT 0) RETURNS TABLE(eei_id integer, exon1 character varying, exon2 character varying, protein1 character varying, protein2 character varying, gene1 character varying, gene2 character varying, method_name character varying, method_type character varying, pdb_id character varying, jaccard_percent numeric, confidence numeric)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
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
        eom.confidence
    FROM eei_interactions ei
    JOIN exons e1 ON ei.exon1_id = e1.exon_id
    JOIN exons e2 ON ei.exon2_id = e2.exon_id
    JOIN proteins p1 ON ei.protein1_id = p1.protein_id
    JOIN proteins p2 ON ei.protein2_id = p2.protein_id
    LEFT JOIN genes g1 ON e1.gene_id = g1.gene_id
    LEFT JOIN genes g2 ON e2.gene_id = g2.gene_id
    JOIN eei_methods em ON ei.method_id = em.method_id
    LEFT JOIN eei_orthology_mapping eom ON ei.eei_id = eom.eei_id
    WHERE 
        CASE 
            WHEN search_type = 'exon' THEN 
                (e1.ensembl_exon_id ILIKE '%' || search_term || '%' OR 
                 e2.ensembl_exon_id ILIKE '%' || search_term || '%')
            WHEN search_type = 'protein' THEN 
                (p1.uniprot_id ILIKE '%' || search_term || '%' OR 
                 p2.uniprot_id ILIKE '%' || search_term || '%')
            WHEN search_type = 'gene' THEN 
                (g1.gene_symbol ILIKE '%' || search_term || '%' OR 
                 g2.gene_symbol ILIKE '%' || search_term || '%')
            ELSE -- 'any'
                (e1.ensembl_exon_id ILIKE '%' || search_term || '%' OR 
                 e2.ensembl_exon_id ILIKE '%' || search_term || '%' OR
                 p1.uniprot_id ILIKE '%' || search_term || '%' OR 
                 p2.uniprot_id ILIKE '%' || search_term || '%' OR
                 g1.gene_symbol ILIKE '%' || search_term || '%' OR 
                 g2.gene_symbol ILIKE '%' || search_term || '%')
        END
    ORDER BY 
        CASE WHEN eom.confidence IS NOT NULL THEN eom.confidence ELSE 1.0 END DESC,
        ei.jaccard_percent DESC NULLS LAST,
        ei.eei_id
    LIMIT result_limit OFFSET result_offset;
END;
$$;


ALTER FUNCTION public.search_eei_interactions(search_term character varying, search_type character varying, result_limit integer, result_offset integer) OWNER TO bbf3630;

--
-- Name: web_search_eei(character varying, character varying, character varying, numeric, integer, integer); Type: FUNCTION; Schema: public; Owner: bbf3630
--

CREATE FUNCTION public.web_search_eei(search_term character varying DEFAULT NULL::character varying, search_type character varying DEFAULT 'any'::character varying, method_filter character varying DEFAULT NULL::character varying, confidence_min numeric DEFAULT NULL::numeric, limit_results integer DEFAULT 100, offset_results integer DEFAULT 0) RETURNS TABLE(eei_id integer, exon1 character varying, exon2 character varying, protein1 character varying, protein2 character varying, gene1 character varying, gene2 character varying, method_name character varying, method_type character varying, pdb_id character varying, confidence numeric, jaccard_percent numeric, aa1 integer, aa2 integer, created_at timestamp without time zone)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    WITH combined_eei AS (
        -- Experimental EEIs
        SELECT 
            vee.eei_id,
            vee.exon1,
            vee.exon2,
            vee.protein1,
            vee.protein2,
            vee.gene1,
            vee.gene2,
            vee.method_name,
            'experimental'::VARCHAR(20) as method_type,
            vee.pdb_id,
            NULL::DECIMAL(15,13) as confidence,
            vee.jaccard_percent,
            vee.aa1,
            vee.aa2,
            vee.created_at
        FROM v_experimental_eei vee
        
        UNION ALL
        
        -- Predicted EEIs
        SELECT 
            vpe.eei_id,
            vpe.exon1,
            vpe.exon2,
            vpe.protein1,
            vpe.protein2,
            vpe.gene1,
            vpe.gene2,
            vpe.method_name,
            'predicted'::VARCHAR(20) as method_type,
            vpe.pdb_id,
            vpe.confidence,
            vpe.jaccard_percent,
            vpe.aa1,
            vpe.aa2,
            vpe.created_at
        FROM v_predicted_eei vpe
    )
    SELECT 
        ce.eei_id,
        ce.exon1,
        ce.exon2,
        ce.protein1,
        ce.protein2,
        ce.gene1,
        ce.gene2,
        ce.method_name,
        ce.method_type,
        ce.pdb_id,
        ce.confidence,
        ce.jaccard_percent,
        ce.aa1,
        ce.aa2,
        ce.created_at
    FROM combined_eei ce
    WHERE 
        (search_term IS NULL OR (
            (search_type = 'any' OR search_type = 'gene') AND (ce.gene1 ILIKE '%' || search_term || '%' OR ce.gene2 ILIKE '%' || search_term || '%')
            OR
            (search_type = 'any' OR search_type = 'protein') AND (ce.protein1 ILIKE '%' || search_term || '%' OR ce.protein2 ILIKE '%' || search_term || '%')
            OR
            (search_type = 'any' OR search_type = 'exon') AND (ce.exon1 ILIKE '%' || search_term || '%' OR ce.exon2 ILIKE '%' || search_term || '%')
            OR
            (search_type = 'any' OR search_type = 'pdb') AND ce.pdb_id ILIKE '%' || search_term || '%'
        ))
        AND (method_filter IS NULL OR ce.method_name = method_filter)
        AND (confidence_min IS NULL OR ce.confidence IS NULL OR ce.confidence >= confidence_min)
    ORDER BY 
        CASE WHEN ce.confidence IS NOT NULL THEN ce.confidence ELSE 1.0 END DESC,
        ce.eei_id
    LIMIT limit_results OFFSET offset_results;
END;
$$;


ALTER FUNCTION public.web_search_eei(search_term character varying, search_type character varying, method_filter character varying, confidence_min numeric, limit_results integer, offset_results integer) OWNER TO bbf3630;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: eei_eppic_attributes; Type: TABLE; Schema: public; Owner: bbf3630
--

CREATE TABLE public.eei_eppic_attributes (
    eei_id integer NOT NULL,
    buried_area_abs numeric(10,3),
    sol_acc_area_abs numeric(10,3),
    cs_score numeric(8,3),
    cr_score numeric(8,3)
);


ALTER TABLE public.eei_eppic_attributes OWNER TO bbf3630;

--
-- Name: eei_interactions; Type: TABLE; Schema: public; Owner: bbf3630
--

CREATE TABLE public.eei_interactions (
    eei_id integer NOT NULL,
    exon1_id integer,
    exon2_id integer,
    protein1_id integer,
    protein2_id integer,
    method_id integer,
    pdb_id character varying(10),
    exon1_length integer,
    exon2_length integer,
    exon1_coverage integer,
    exon2_coverage integer,
    exon1_coverage_percent numeric(5,2),
    exon2_coverage_percent numeric(5,2),
    jaccard_percent numeric(5,2),
    aa1 integer,
    aa2 integer,
    protein1_chain character varying(10),
    protein2_chain character varying(10),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.eei_interactions OWNER TO bbf3630;

--
-- Name: eei_interactions_eei_id_seq; Type: SEQUENCE; Schema: public; Owner: bbf3630
--

CREATE SEQUENCE public.eei_interactions_eei_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.eei_interactions_eei_id_seq OWNER TO bbf3630;

--
-- Name: eei_interactions_eei_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bbf3630
--

ALTER SEQUENCE public.eei_interactions_eei_id_seq OWNED BY public.eei_interactions.eei_id;


--
-- Name: eei_methods; Type: TABLE; Schema: public; Owner: bbf3630
--

CREATE TABLE public.eei_methods (
    method_id integer NOT NULL,
    method_name character varying(50) NOT NULL,
    method_type character varying(20) NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT eei_methods_method_type_check CHECK (((method_type)::text = ANY (ARRAY[('experimental'::character varying)::text, ('predicted'::character varying)::text])))
);


ALTER TABLE public.eei_methods OWNER TO bbf3630;

--
-- Name: eei_methods_method_id_seq; Type: SEQUENCE; Schema: public; Owner: bbf3630
--

CREATE SEQUENCE public.eei_methods_method_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.eei_methods_method_id_seq OWNER TO bbf3630;

--
-- Name: eei_methods_method_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bbf3630
--

ALTER SEQUENCE public.eei_methods_method_id_seq OWNED BY public.eei_methods.method_id;


--
-- Name: eei_orthology_mapping; Type: TABLE; Schema: public; Owner: bbf3630
--

CREATE TABLE public.eei_orthology_mapping (
    eei_id integer NOT NULL,
    source_organism_id integer,
    mouse_exon1_coordinates character varying(100),
    mouse_exon2_coordinates character varying(100),
    confidence numeric(15,13),
    identity1 numeric(4,3),
    identity2 numeric(4,3),
    mapping_type1 character varying(10),
    mapping_type2 character varying(10)
);


ALTER TABLE public.eei_orthology_mapping OWNER TO bbf3630;

--
-- Name: eei_pisa_attributes; Type: TABLE; Schema: public; Owner: bbf3630
--

CREATE TABLE public.eei_pisa_attributes (
    eei_id integer NOT NULL,
    free_energy numeric(10,6),
    buried_area numeric(12,6),
    buried_area_abs numeric(10,3),
    sol_acc_area_abs numeric(10,3),
    hydrogen_bonds integer DEFAULT 0,
    disulphide_bonds integer DEFAULT 0,
    salt_bridges integer DEFAULT 0,
    covalent_bonds integer DEFAULT 0
);


ALTER TABLE public.eei_pisa_attributes OWNER TO bbf3630;

--
-- Name: exons; Type: TABLE; Schema: public; Owner: bbf3630
--

CREATE TABLE public.exons (
    exon_id integer NOT NULL,
    ensembl_exon_id character varying(50) NOT NULL,
    gene_id integer,
    exon_number integer,
    chromosome character varying(20),
    strand character(1),
    exon_start bigint,
    exon_end bigint,
    exon_length integer,
    sequence text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT exons_strand_check CHECK ((strand = ANY (ARRAY['+'::bpchar, '-'::bpchar, '1'::bpchar, '-1'::bpchar])))
);


ALTER TABLE public.exons OWNER TO bbf3630;

--
-- Name: exons_exon_id_seq; Type: SEQUENCE; Schema: public; Owner: bbf3630
--

CREATE SEQUENCE public.exons_exon_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.exons_exon_id_seq OWNER TO bbf3630;

--
-- Name: exons_exon_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bbf3630
--

ALTER SEQUENCE public.exons_exon_id_seq OWNED BY public.exons.exon_id;


--
-- Name: genes; Type: TABLE; Schema: public; Owner: bbf3630
--

CREATE TABLE public.genes (
    gene_id integer NOT NULL,
    gene_symbol character varying(50) NOT NULL,
    gene_name character varying(255),
    organism_id integer,
    description text,
    chromosome character varying(20),
    strand character(1),
    gene_start bigint,
    gene_end bigint,
    ensembl_gene_id character varying(50),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT genes_strand_check CHECK ((strand = ANY (ARRAY['+'::bpchar, '-'::bpchar, '1'::bpchar, '-1'::bpchar])))
);


ALTER TABLE public.genes OWNER TO bbf3630;

--
-- Name: genes_gene_id_seq; Type: SEQUENCE; Schema: public; Owner: bbf3630
--

CREATE SEQUENCE public.genes_gene_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.genes_gene_id_seq OWNER TO bbf3630;

--
-- Name: genes_gene_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bbf3630
--

ALTER SEQUENCE public.genes_gene_id_seq OWNED BY public.genes.gene_id;


--
-- Name: organisms; Type: TABLE; Schema: public; Owner: bbf3630
--

CREATE TABLE public.organisms (
    organism_id integer NOT NULL,
    name character varying(100) NOT NULL,
    scientific_name character varying(200),
    taxonomy_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.organisms OWNER TO bbf3630;

--
-- Name: organisms_organism_id_seq; Type: SEQUENCE; Schema: public; Owner: bbf3630
--

CREATE SEQUENCE public.organisms_organism_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.organisms_organism_id_seq OWNER TO bbf3630;

--
-- Name: organisms_organism_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bbf3630
--

ALTER SEQUENCE public.organisms_organism_id_seq OWNED BY public.organisms.organism_id;


--
-- Name: pdb_structures; Type: TABLE; Schema: public; Owner: bbf3630
--

CREATE TABLE public.pdb_structures (
    pdb_id character varying(10) NOT NULL,
    title text,
    resolution numeric(4,2),
    method character varying(50),
    deposition_date date,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.pdb_structures OWNER TO bbf3630;

--
-- Name: proteins; Type: TABLE; Schema: public; Owner: bbf3630
--

CREATE TABLE public.proteins (
    protein_id integer NOT NULL,
    uniprot_id character varying(50) NOT NULL,
    protein_name character varying(255),
    gene_id integer,
    sequence_length integer,
    molecular_weight numeric(10,3),
    description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.proteins OWNER TO bbf3630;

--
-- Name: proteins_protein_id_seq; Type: SEQUENCE; Schema: public; Owner: bbf3630
--

CREATE SEQUENCE public.proteins_protein_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.proteins_protein_id_seq OWNER TO bbf3630;

--
-- Name: proteins_protein_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bbf3630
--

ALTER SEQUENCE public.proteins_protein_id_seq OWNED BY public.proteins.protein_id;


--
-- Name: v_experimental_eei; Type: VIEW; Schema: public; Owner: bbf3630
--

CREATE VIEW public.v_experimental_eei AS
 SELECT ei.eei_id,
    e1.ensembl_exon_id AS exon1,
    e2.ensembl_exon_id AS exon2,
    p1.uniprot_id AS protein1,
    p2.uniprot_id AS protein2,
    g1.gene_symbol AS gene1,
    g2.gene_symbol AS gene2,
    em.method_name,
    ei.pdb_id,
    ei.exon1_length,
    ei.exon2_length,
    ei.exon1_coverage,
    ei.exon2_coverage,
    ei.exon1_coverage_percent,
    ei.exon2_coverage_percent,
    ei.jaccard_percent,
    ei.aa1,
    ei.aa2,
    ei.protein1_chain,
    ei.protein2_chain,
    ei.created_at
   FROM (((((((public.eei_interactions ei
     JOIN public.exons e1 ON ((ei.exon1_id = e1.exon_id)))
     JOIN public.exons e2 ON ((ei.exon2_id = e2.exon_id)))
     JOIN public.proteins p1 ON ((ei.protein1_id = p1.protein_id)))
     JOIN public.proteins p2 ON ((ei.protein2_id = p2.protein_id)))
     JOIN public.genes g1 ON ((e1.gene_id = g1.gene_id)))
     JOIN public.genes g2 ON ((e2.gene_id = g2.gene_id)))
     JOIN public.eei_methods em ON ((ei.method_id = em.method_id)))
  WHERE ((em.method_type)::text = 'experimental'::text);


ALTER TABLE public.v_experimental_eei OWNER TO bbf3630;

--
-- Name: v_eppic_eei; Type: VIEW; Schema: public; Owner: bbf3630
--

CREATE VIEW public.v_eppic_eei AS
 SELECT vee.eei_id,
    vee.exon1,
    vee.exon2,
    vee.protein1,
    vee.protein2,
    vee.gene1,
    vee.gene2,
    vee.method_name,
    vee.pdb_id,
    vee.exon1_length,
    vee.exon2_length,
    vee.exon1_coverage,
    vee.exon2_coverage,
    vee.exon1_coverage_percent,
    vee.exon2_coverage_percent,
    vee.jaccard_percent,
    vee.aa1,
    vee.aa2,
    vee.protein1_chain,
    vee.protein2_chain,
    vee.created_at,
    eea.buried_area_abs,
    eea.sol_acc_area_abs,
    eea.cs_score,
    eea.cr_score
   FROM (public.v_experimental_eei vee
     JOIN public.eei_eppic_attributes eea ON ((vee.eei_id = eea.eei_id)))
  WHERE ((vee.method_name)::text = ANY (ARRAY[('EPPIC'::character varying)::text, ('predicted_EPPIC'::character varying)::text]));


ALTER TABLE public.v_eppic_eei OWNER TO bbf3630;

--
-- Name: v_pisa_eei; Type: VIEW; Schema: public; Owner: bbf3630
--

CREATE VIEW public.v_pisa_eei AS
 SELECT vee.eei_id,
    vee.exon1,
    vee.exon2,
    vee.protein1,
    vee.protein2,
    vee.gene1,
    vee.gene2,
    vee.method_name,
    vee.pdb_id,
    vee.exon1_length,
    vee.exon2_length,
    vee.exon1_coverage,
    vee.exon2_coverage,
    vee.exon1_coverage_percent,
    vee.exon2_coverage_percent,
    vee.jaccard_percent,
    vee.aa1,
    vee.aa2,
    vee.protein1_chain,
    vee.protein2_chain,
    vee.created_at,
    epa.free_energy,
    epa.buried_area,
    epa.buried_area_abs,
    epa.sol_acc_area_abs,
    epa.hydrogen_bonds,
    epa.disulphide_bonds,
    epa.salt_bridges,
    epa.covalent_bonds
   FROM (public.v_experimental_eei vee
     JOIN public.eei_pisa_attributes epa ON ((vee.eei_id = epa.eei_id)))
  WHERE ((vee.method_name)::text = ANY (ARRAY[('PISA'::character varying)::text, ('predicted_PISA'::character varying)::text]));


ALTER TABLE public.v_pisa_eei OWNER TO bbf3630;

--
-- Name: v_predicted_eei; Type: VIEW; Schema: public; Owner: bbf3630
--

CREATE VIEW public.v_predicted_eei AS
 SELECT ei.eei_id,
    e1.ensembl_exon_id AS exon1,
    e2.ensembl_exon_id AS exon2,
    p1.uniprot_id AS protein1,
    p2.uniprot_id AS protein2,
    g1.gene_symbol AS gene1,
    g2.gene_symbol AS gene2,
    em.method_name,
    ei.pdb_id,
    eom.mouse_exon1_coordinates,
    eom.mouse_exon2_coordinates,
    eom.confidence,
    eom.identity1,
    eom.identity2,
    eom.mapping_type1,
    eom.mapping_type2,
    ei.exon1_length,
    ei.exon2_length,
    ei.exon1_coverage,
    ei.exon2_coverage,
    ei.exon1_coverage_percent,
    ei.exon2_coverage_percent,
    ei.jaccard_percent,
    ei.aa1,
    ei.aa2,
    ei.created_at
   FROM ((((((((public.eei_interactions ei
     JOIN public.exons e1 ON ((ei.exon1_id = e1.exon_id)))
     JOIN public.exons e2 ON ((ei.exon2_id = e2.exon_id)))
     JOIN public.proteins p1 ON ((ei.protein1_id = p1.protein_id)))
     JOIN public.proteins p2 ON ((ei.protein2_id = p2.protein_id)))
     JOIN public.genes g1 ON ((e1.gene_id = g1.gene_id)))
     JOIN public.genes g2 ON ((e2.gene_id = g2.gene_id)))
     JOIN public.eei_methods em ON ((ei.method_id = em.method_id)))
     JOIN public.eei_orthology_mapping eom ON ((ei.eei_id = eom.eei_id)))
  WHERE ((em.method_type)::text = 'predicted'::text);


ALTER TABLE public.v_predicted_eei OWNER TO bbf3630;

--
-- Name: eei_interactions eei_id; Type: DEFAULT; Schema: public; Owner: bbf3630
--

ALTER TABLE ONLY public.eei_interactions ALTER COLUMN eei_id SET DEFAULT nextval('public.eei_interactions_eei_id_seq'::regclass);


--
-- Name: eei_methods method_id; Type: DEFAULT; Schema: public; Owner: bbf3630
--

ALTER TABLE ONLY public.eei_methods ALTER COLUMN method_id SET DEFAULT nextval('public.eei_methods_method_id_seq'::regclass);


--
-- Name: exons exon_id; Type: DEFAULT; Schema: public; Owner: bbf3630
--

ALTER TABLE ONLY public.exons ALTER COLUMN exon_id SET DEFAULT nextval('public.exons_exon_id_seq'::regclass);


--
-- Name: genes gene_id; Type: DEFAULT; Schema: public; Owner: bbf3630
--

ALTER TABLE ONLY public.genes ALTER COLUMN gene_id SET DEFAULT nextval('public.genes_gene_id_seq'::regclass);


--
-- Name: organisms organism_id; Type: DEFAULT; Schema: public; Owner: bbf3630
--

ALTER TABLE ONLY public.organisms ALTER COLUMN organism_id SET DEFAULT nextval('public.organisms_organism_id_seq'::regclass);


--
-- Name: proteins protein_id; Type: DEFAULT; Schema: public; Owner: bbf3630
--

ALTER TABLE ONLY public.proteins ALTER COLUMN protein_id SET DEFAULT nextval('public.proteins_protein_id_seq'::regclass);


--
-- Name: eei_eppic_attributes eei_eppic_attributes_pkey; Type: CONSTRAINT; Schema: public; Owner: bbf3630
--

ALTER TABLE ONLY public.eei_eppic_attributes
    ADD CONSTRAINT eei_eppic_attributes_pkey PRIMARY KEY (eei_id);


--
-- Name: eei_interactions eei_interactions_exon1_id_exon2_id_method_id_pdb_id_key; Type: CONSTRAINT; Schema: public; Owner: bbf3630
--

ALTER TABLE ONLY public.eei_interactions
    ADD CONSTRAINT eei_interactions_exon1_id_exon2_id_method_id_pdb_id_key UNIQUE (exon1_id, exon2_id, method_id, pdb_id);


--
-- Name: eei_interactions eei_interactions_pkey; Type: CONSTRAINT; Schema: public; Owner: bbf3630
--

ALTER TABLE ONLY public.eei_interactions
    ADD CONSTRAINT eei_interactions_pkey PRIMARY KEY (eei_id);


--
-- Name: eei_methods eei_methods_method_name_key; Type: CONSTRAINT; Schema: public; Owner: bbf3630
--

ALTER TABLE ONLY public.eei_methods
    ADD CONSTRAINT eei_methods_method_name_key UNIQUE (method_name);


--
-- Name: eei_methods eei_methods_pkey; Type: CONSTRAINT; Schema: public; Owner: bbf3630
--

ALTER TABLE ONLY public.eei_methods
    ADD CONSTRAINT eei_methods_pkey PRIMARY KEY (method_id);


--
-- Name: eei_orthology_mapping eei_orthology_mapping_pkey; Type: CONSTRAINT; Schema: public; Owner: bbf3630
--

ALTER TABLE ONLY public.eei_orthology_mapping
    ADD CONSTRAINT eei_orthology_mapping_pkey PRIMARY KEY (eei_id);


--
-- Name: eei_pisa_attributes eei_pisa_attributes_pkey; Type: CONSTRAINT; Schema: public; Owner: bbf3630
--

ALTER TABLE ONLY public.eei_pisa_attributes
    ADD CONSTRAINT eei_pisa_attributes_pkey PRIMARY KEY (eei_id);


--
-- Name: exons exons_ensembl_exon_id_key; Type: CONSTRAINT; Schema: public; Owner: bbf3630
--

ALTER TABLE ONLY public.exons
    ADD CONSTRAINT exons_ensembl_exon_id_key UNIQUE (ensembl_exon_id);


--
-- Name: exons exons_pkey; Type: CONSTRAINT; Schema: public; Owner: bbf3630
--

ALTER TABLE ONLY public.exons
    ADD CONSTRAINT exons_pkey PRIMARY KEY (exon_id);


--
-- Name: genes genes_gene_symbol_organism_id_key; Type: CONSTRAINT; Schema: public; Owner: bbf3630
--

ALTER TABLE ONLY public.genes
    ADD CONSTRAINT genes_gene_symbol_organism_id_key UNIQUE (gene_symbol, organism_id);


--
-- Name: genes genes_pkey; Type: CONSTRAINT; Schema: public; Owner: bbf3630
--

ALTER TABLE ONLY public.genes
    ADD CONSTRAINT genes_pkey PRIMARY KEY (gene_id);


--
-- Name: organisms organisms_name_key; Type: CONSTRAINT; Schema: public; Owner: bbf3630
--

ALTER TABLE ONLY public.organisms
    ADD CONSTRAINT organisms_name_key UNIQUE (name);


--
-- Name: organisms organisms_pkey; Type: CONSTRAINT; Schema: public; Owner: bbf3630
--

ALTER TABLE ONLY public.organisms
    ADD CONSTRAINT organisms_pkey PRIMARY KEY (organism_id);


--
-- Name: pdb_structures pdb_structures_pkey; Type: CONSTRAINT; Schema: public; Owner: bbf3630
--

ALTER TABLE ONLY public.pdb_structures
    ADD CONSTRAINT pdb_structures_pkey PRIMARY KEY (pdb_id);


--
-- Name: proteins proteins_pkey; Type: CONSTRAINT; Schema: public; Owner: bbf3630
--

ALTER TABLE ONLY public.proteins
    ADD CONSTRAINT proteins_pkey PRIMARY KEY (protein_id);


--
-- Name: proteins proteins_uniprot_id_key; Type: CONSTRAINT; Schema: public; Owner: bbf3630
--

ALTER TABLE ONLY public.proteins
    ADD CONSTRAINT proteins_uniprot_id_key UNIQUE (uniprot_id);


--
-- Name: idx_eei_exon1; Type: INDEX; Schema: public; Owner: bbf3630
--

CREATE INDEX idx_eei_exon1 ON public.eei_interactions USING btree (exon1_id);


--
-- Name: idx_eei_exon2; Type: INDEX; Schema: public; Owner: bbf3630
--

CREATE INDEX idx_eei_exon2 ON public.eei_interactions USING btree (exon2_id);


--
-- Name: idx_eei_method; Type: INDEX; Schema: public; Owner: bbf3630
--

CREATE INDEX idx_eei_method ON public.eei_interactions USING btree (method_id);


--
-- Name: idx_eei_pdb; Type: INDEX; Schema: public; Owner: bbf3630
--

CREATE INDEX idx_eei_pdb ON public.eei_interactions USING btree (pdb_id);


--
-- Name: idx_eei_protein1; Type: INDEX; Schema: public; Owner: bbf3630
--

CREATE INDEX idx_eei_protein1 ON public.eei_interactions USING btree (protein1_id);


--
-- Name: idx_eei_protein2; Type: INDEX; Schema: public; Owner: bbf3630
--

CREATE INDEX idx_eei_protein2 ON public.eei_interactions USING btree (protein2_id);


--
-- Name: idx_exons_ensembl; Type: INDEX; Schema: public; Owner: bbf3630
--

CREATE INDEX idx_exons_ensembl ON public.exons USING btree (ensembl_exon_id);


--
-- Name: idx_genes_organism; Type: INDEX; Schema: public; Owner: bbf3630
--

CREATE INDEX idx_genes_organism ON public.genes USING btree (organism_id);


--
-- Name: idx_genes_symbol; Type: INDEX; Schema: public; Owner: bbf3630
--

CREATE INDEX idx_genes_symbol ON public.genes USING btree (gene_symbol);


--
-- Name: idx_proteins_uniprot; Type: INDEX; Schema: public; Owner: bbf3630
--

CREATE INDEX idx_proteins_uniprot ON public.proteins USING btree (uniprot_id);


--
-- Name: eei_eppic_attributes eei_eppic_attributes_eei_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bbf3630
--

ALTER TABLE ONLY public.eei_eppic_attributes
    ADD CONSTRAINT eei_eppic_attributes_eei_id_fkey FOREIGN KEY (eei_id) REFERENCES public.eei_interactions(eei_id) ON DELETE CASCADE;


--
-- Name: eei_interactions eei_interactions_exon1_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bbf3630
--

ALTER TABLE ONLY public.eei_interactions
    ADD CONSTRAINT eei_interactions_exon1_id_fkey FOREIGN KEY (exon1_id) REFERENCES public.exons(exon_id);


--
-- Name: eei_interactions eei_interactions_exon2_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bbf3630
--

ALTER TABLE ONLY public.eei_interactions
    ADD CONSTRAINT eei_interactions_exon2_id_fkey FOREIGN KEY (exon2_id) REFERENCES public.exons(exon_id);


--
-- Name: eei_interactions eei_interactions_method_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bbf3630
--

ALTER TABLE ONLY public.eei_interactions
    ADD CONSTRAINT eei_interactions_method_id_fkey FOREIGN KEY (method_id) REFERENCES public.eei_methods(method_id);


--
-- Name: eei_interactions eei_interactions_pdb_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bbf3630
--

ALTER TABLE ONLY public.eei_interactions
    ADD CONSTRAINT eei_interactions_pdb_id_fkey FOREIGN KEY (pdb_id) REFERENCES public.pdb_structures(pdb_id);


--
-- Name: eei_interactions eei_interactions_protein1_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bbf3630
--

ALTER TABLE ONLY public.eei_interactions
    ADD CONSTRAINT eei_interactions_protein1_id_fkey FOREIGN KEY (protein1_id) REFERENCES public.proteins(protein_id);


--
-- Name: eei_interactions eei_interactions_protein2_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bbf3630
--

ALTER TABLE ONLY public.eei_interactions
    ADD CONSTRAINT eei_interactions_protein2_id_fkey FOREIGN KEY (protein2_id) REFERENCES public.proteins(protein_id);


--
-- Name: eei_orthology_mapping eei_orthology_mapping_eei_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bbf3630
--

ALTER TABLE ONLY public.eei_orthology_mapping
    ADD CONSTRAINT eei_orthology_mapping_eei_id_fkey FOREIGN KEY (eei_id) REFERENCES public.eei_interactions(eei_id) ON DELETE CASCADE;


--
-- Name: eei_orthology_mapping eei_orthology_mapping_source_organism_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bbf3630
--

ALTER TABLE ONLY public.eei_orthology_mapping
    ADD CONSTRAINT eei_orthology_mapping_source_organism_id_fkey FOREIGN KEY (source_organism_id) REFERENCES public.organisms(organism_id);


--
-- Name: eei_pisa_attributes eei_pisa_attributes_eei_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bbf3630
--

ALTER TABLE ONLY public.eei_pisa_attributes
    ADD CONSTRAINT eei_pisa_attributes_eei_id_fkey FOREIGN KEY (eei_id) REFERENCES public.eei_interactions(eei_id) ON DELETE CASCADE;


--
-- Name: exons exons_gene_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bbf3630
--

ALTER TABLE ONLY public.exons
    ADD CONSTRAINT exons_gene_id_fkey FOREIGN KEY (gene_id) REFERENCES public.genes(gene_id);


--
-- Name: genes genes_organism_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bbf3630
--

ALTER TABLE ONLY public.genes
    ADD CONSTRAINT genes_organism_id_fkey FOREIGN KEY (organism_id) REFERENCES public.organisms(organism_id);


--
-- Name: proteins proteins_gene_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bbf3630
--

ALTER TABLE ONLY public.proteins
    ADD CONSTRAINT proteins_gene_id_fkey FOREIGN KEY (gene_id) REFERENCES public.genes(gene_id);


--
-- PostgreSQL database dump complete
--

