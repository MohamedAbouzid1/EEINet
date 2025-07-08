import React, { useState } from 'react';
import {
    Container,
    Typography,
    Box,
    Card,
    CardContent,
    Grid,
    Chip,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
    Alert,
    Tabs,
    Tab,
} from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { proteinAPI } from '../services/api';
import { motion } from 'framer-motion';

const ProteinDetailsPage = () => {
    const { proteinId } = useParams();
    const [tabValue, setTabValue] = useState(0);

    const { data: proteinData, isLoading: proteinLoading, error: proteinError } = useQuery({
        queryKey: ['protein', proteinId],
        queryFn: () => proteinAPI.getProtein(proteinId),
    });

    const { data: exonsData, isLoading: exonsLoading } = useQuery({
        queryKey: ['protein-exons', proteinId],
        queryFn: () => proteinAPI.getProteinExons(proteinId, { limit: 100 }),
    });

    const { data: interactionsData, isLoading: interactionsLoading } = useQuery({
        queryKey: ['protein-interactions', proteinId],
        queryFn: () => proteinAPI.getProteinInteractions(proteinId, { limit: 100 }),
    });

    if (proteinLoading) {
        return (
            <Container maxWidth="lg">
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    if (proteinError) {
        return (
            <Container maxWidth="lg">
                <Box sx={{ py: 4 }}>
                    <Alert severity="error">
                        Error loading protein details: {proteinError.message}
                    </Alert>
                </Box>
            </Container>
        );
    }

    const protein = proteinData?.data;
    const exons = exonsData?.data?.exons || [];
    const interactions = interactionsData?.data?.interactions || [];

    return (
        <Container maxWidth="lg">
            <Box sx={{ py: 4 }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Header */}
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h4" component="h1" gutterBottom>
                            Protein Details
                        </Typography>
                        <Typography variant="h5" color="primary" gutterBottom>
                            {protein?.uniprot_id}
                        </Typography>
                        {protein?.protein_name && (
                            <Typography variant="h6" color="text.secondary">
                                {protein.protein_name}
                            </Typography>
                        )}
                    </Box>

                    {/* Protein Information */}
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Basic Information
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography variant="body2" color="text.secondary">
                                                UniProt ID:
                                            </Typography>
                                            <Typography variant="body2">
                                                {protein?.uniprot_id}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Gene Symbol:
                                            </Typography>
                                            <Typography variant="body2">
                                                {protein?.gene_symbol || 'N/A'}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Organism:
                                            </Typography>
                                            <Typography variant="body2">
                                                {protein?.organism || 'N/A'}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    {/* Tabs for Exons and Interactions */}
                    <Card>
                        <CardContent>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                                <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
                                    <Tab label={`Exons (${exons.length})`} />
                                    <Tab label={`Interactions (${interactions.length})`} />
                                </Tabs>
                            </Box>

                            {/* Exons Tab */}
                            {tabValue === 0 && (
                                <>
                                    {exonsLoading ? (
                                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                                            <CircularProgress />
                                        </Box>
                                    ) : exons.length > 0 ? (
                                        <TableContainer>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Exon ID</TableCell>
                                                        <TableCell>Length</TableCell>
                                                        <TableCell>Interactions</TableCell>
                                                        <TableCell>Actions</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {exons.map((exon) => (
                                                        <TableRow key={exon.exon_id}>
                                                            <TableCell>
                                                                <Button
                                                                    component={Link}
                                                                    to={`/exon/${exon.ensembl_exon_id}`}
                                                                    variant="text"
                                                                >
                                                                    {exon.ensembl_exon_id}
                                                                </Button>
                                                            </TableCell>
                                                            <TableCell>
                                                                {exon.exon_length ? `${exon.exon_length} bp` : 'N/A'}
                                                            </TableCell>
                                                            <TableCell>
                                                                <Chip
                                                                    label={exon.interaction_count || 0}
                                                                    size="small"
                                                                    color="primary"
                                                                />
                                                            </TableCell>
                                                            <TableCell>
                                                                <Button
                                                                    component={Link}
                                                                    to={`/exon/${exon.ensembl_exon_id}`}
                                                                    variant="outlined"
                                                                    size="small"
                                                                >
                                                                    View
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    ) : (
                                        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                                            No exons found for this protein.
                                        </Typography>
                                    )}
                                </>
                            )}

                            {/* Interactions Tab */}
                            {tabValue === 1 && (
                                <>
                                    {interactionsLoading ? (
                                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                                            <CircularProgress />
                                        </Box>
                                    ) : interactions.length > 0 ? (
                                        <TableContainer>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Exons</TableCell>
                                                        <TableCell>Partner Protein</TableCell>
                                                        <TableCell>Method</TableCell>
                                                        <TableCell>Actions</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {interactions.map((interaction) => {
                                                        const partnerProtein = interaction.protein1 === proteinId ? interaction.protein2 : interaction.protein1;
                                                        return (
                                                            <TableRow key={interaction.eei_id}>
                                                                <TableCell>
                                                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                                                        <Button
                                                                            component={Link}
                                                                            to={`/exon/${interaction.exon1}`}
                                                                            variant="outlined"
                                                                            size="small"
                                                                        >
                                                                            {interaction.exon1}
                                                                        </Button>
                                                                        <Button
                                                                            component={Link}
                                                                            to={`/exon/${interaction.exon2}`}
                                                                            variant="outlined"
                                                                            size="small"
                                                                        >
                                                                            {interaction.exon2}
                                                                        </Button>
                                                                    </Box>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Button
                                                                        component={Link}
                                                                        to={`/protein/${partnerProtein}`}
                                                                        variant="text"
                                                                    >
                                                                        {partnerProtein}
                                                                    </Button>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Chip
                                                                        label={interaction.method_name}
                                                                        size="small"
                                                                        color={interaction.method_type === 'experimental' ? 'primary' : 'secondary'}
                                                                    />
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Button
                                                                        component={Link}
                                                                        to={`/interaction/${interaction.eei_id}`}
                                                                        variant="contained"
                                                                        size="small"
                                                                    >
                                                                        Details
                                                                    </Button>
                                                                </TableCell>
                                                            </TableRow>
                                                        );
                                                    })}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    ) : (
                                        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                                            No interactions found for this protein.
                                        </Typography>
                                    )}
                                </>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </Box>
        </Container>
    );
};

export default ProteinDetailsPage;