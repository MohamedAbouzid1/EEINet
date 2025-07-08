// Using built-in fetch (Node.js 18+) instead of node-fetch
const db = require('./db/connect'); // Adjust path to your database connection

// Function to fetch protein data from UniProt API
async function fetchProteinDataFromUniProt(uniprotId) {
    try {
        console.log(`Fetching data for ${uniprotId}...`);

        const response = await fetch(`https://rest.uniprot.org/uniprotkb/${uniprotId}.json`);

        if (!response.ok) {
            console.error(`Failed to fetch ${uniprotId}: ${response.status}`);
            return null;
        }

        const data = await response.json();

        // Extract relevant information
        const proteinData = {
            uniprot_id: uniprotId,
            protein_name: data.proteinDescription?.recommendedName?.fullName?.value ||
                data.proteinDescription?.alternativeNames?.[0]?.fullName?.value || '',
            gene_symbol: data.genes?.[0]?.geneName?.value || '',
            gene_name: data.genes?.[0]?.geneName?.value || '',
            organism_name: data.organism?.scientificName || '',
            sequence_length: data.sequence?.length || null,
            molecular_weight: data.sequence?.molWeight || null,
            description: data.proteinDescription?.recommendedName?.fullName?.value || ''
        };

        console.log(`✓ Successfully fetched data for ${uniprotId}`);
        return proteinData;

    } catch (error) {
        console.error(`Error fetching ${uniprotId}:`, error.message);
        return null;
    }
}

// Function to find or create gene in database
async function findOrCreateGene(proteinData) {
    if (!proteinData.gene_symbol) {
        console.log(`No gene symbol found for ${proteinData.uniprot_id}`);
        return null;
    }

    try {
        // First, try to find existing gene
        const existingGene = await db.query(
            'SELECT gene_id FROM genes WHERE gene_symbol = $1',
            [proteinData.gene_symbol]
        );

        if (existingGene.rows.length > 0) {
            console.log(`Found existing gene: ${proteinData.gene_symbol}`);
            return existingGene.rows[0].gene_id;
        }

        // If gene doesn't exist, create it
        console.log(`Creating new gene: ${proteinData.gene_symbol}`);

        // You'll need to determine the organism_id based on your organisms table
        // For now, I'll assume human (you may need to adjust this)
        const humanOrganismId = 6; // Based on your previous query showing organism_id = 6

        const newGene = await db.query(`
            INSERT INTO genes (gene_symbol, gene_name, organism_id, description)
            VALUES ($1, $2, $3, $4)
            RETURNING gene_id
        `, [
            proteinData.gene_symbol,
            proteinData.gene_name,
            humanOrganismId,
            'protein_coding' // Default description
        ]);

        console.log(`✓ Created new gene: ${proteinData.gene_symbol}`);
        return newGene.rows[0].gene_id;

    } catch (error) {
        console.error(`Error finding/creating gene for ${proteinData.gene_symbol}:`, error.message);
        return null;
    }
}

// Function to update protein in database
async function updateProteinInDatabase(proteinData) {
    try {
        // Find or create the gene
        const geneId = await findOrCreateGene(proteinData);

        // Update the protein record
        const result = await db.query(`
            UPDATE proteins 
            SET 
                protein_name = $1,
                gene_id = $2,
                sequence_length = $3,
                molecular_weight = $4,
                description = $5
            WHERE uniprot_id = $6
            RETURNING protein_id
        `, [
            proteinData.protein_name,
            geneId,
            proteinData.sequence_length,
            proteinData.molecular_weight,
            proteinData.description,
            proteinData.uniprot_id
        ]);

        if (result.rows.length > 0) {
            console.log(`✓ Updated protein ${proteinData.uniprot_id} with gene ${proteinData.gene_symbol}`);
            return true;
        } else {
            console.error(`Failed to update protein ${proteinData.uniprot_id}`);
            return false;
        }

    } catch (error) {
        console.error(`Error updating protein ${proteinData.uniprot_id}:`, error.message);
        return false;
    }
}

// Main function to process all proteins
async function updateAllProteins() {
    try {
        // Get all proteins that need updating (those with null gene_id)
        const proteinsToUpdate = await db.query(`
            SELECT uniprot_id 
            FROM proteins 
            WHERE gene_id IS NULL 
            ORDER BY protein_id
        `);

        console.log(`Found ${proteinsToUpdate.rows.length} proteins to update`);

        let successCount = 0;
        let failCount = 0;

        // Process each protein (with delay to respect API rate limits)
        for (const protein of proteinsToUpdate.rows) {
            const proteinData = await fetchProteinDataFromUniProt(protein.uniprot_id);

            if (proteinData) {
                const success = await updateProteinInDatabase(proteinData);
                if (success) {
                    successCount++;
                } else {
                    failCount++;
                }
            } else {
                failCount++;
            }

            // Add delay to respect API rate limits (UniProt allows ~10 requests/second)
            await new Promise(resolve => setTimeout(resolve, 200));
        }

        console.log(`\n=== Summary ===`);
        console.log(`Successfully updated: ${successCount} proteins`);
        console.log(`Failed to update: ${failCount} proteins`);

    } catch (error) {
        console.error('Error in main process:', error.message);
    } finally {
        // Close database connection
        await db.end();
    }
}

// Function to update just a few proteins for testing
async function updateSpecificProteins(uniprotIds) {
    console.log(`Updating specific proteins: ${uniprotIds.join(', ')}`);

    let successCount = 0;
    let failCount = 0;

    for (const uniprotId of uniprotIds) {
        const proteinData = await fetchProteinDataFromUniProt(uniprotId);

        if (proteinData) {
            const success = await updateProteinInDatabase(proteinData);
            if (success) {
                successCount++;
            } else {
                failCount++;
            }
        } else {
            failCount++;
        }

        // Add delay
        await new Promise(resolve => setTimeout(resolve, 200));
    }

    console.log(`\n=== Summary ===`);
    console.log(`Successfully updated: ${successCount} proteins`);
    console.log(`Failed to update: ${failCount} proteins`);

    await db.end();
}

// Export functions for use
module.exports = {
    updateAllProteins,
    updateSpecificProteins,
    fetchProteinDataFromUniProt,
    updateProteinInDatabase
};

// If running this script directly
if (require.main === module) {
    const args = process.argv.slice(2);

    if (args.length > 0) {
        // Update specific proteins
        updateSpecificProteins(args);
    } else {
        // Update all proteins
        updateAllProteins();
    }
}