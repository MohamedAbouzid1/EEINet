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
import { exonAPI } from '../services/api';
import { motion } from 'framer-motion';

const ExonDetailsPage = () => {
    const { exonId } = useParams();
    const [tabValue, setTabValue] = useState(0);

    const { data: exonData, isLoading: exonLoading, error: exonError } = useQuery({
        queryKey: ['exon', exonId],
        queryFn: () => exonAPI.getExon(exonId),
    });

    const { data: interactionsData, isLoading: interactionsLoading } = useQuery({
        queryKey: ['exon-interactions', exonId],
        queryFn: () => exonAPI.getExonInteractions(exonId, { limit: 100 }),
    });

    if (exonLoading) {
        return (
            <Container maxWidth="lg">
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    if (exonError) {
        return (
            <Container maxWidth="lg">
                <Box sx={{ py: 4 }}>
                    <Alert severity="error">
                        Error loading exon details: {exonError.message}
                    </Alert>
                </Box>
            </Container>
        );
    }

    const exon = exonData?.data;
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
                            Exon Details
                        </Typography>
                        <Typography variant="h5" color="primary" gutterBottom>
                            {exon?.ensembl_exon_id}
                        </Typography>
                    </Box>

                    {/* Exon Information */}
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
                                                Exon ID:
                                            </Typography>
                                            <Typography variant="body2">
                                                {exon?.ensembl_exon_id}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Gene Symbol:
                                            </Typography>
                                            <Typography variant="body2">
                                                {exon?.gene_symbol || 'N/A'}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Gene Name:
                                            </Typography>
                                            <Typography variant="body2">
                                                {exon?.gene_name || 'N/A'}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Organism:
                                            </Typography>
                                            <Typography variant="body2">
                                                {exon?.organism || 'N/A'}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Genomic Location
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Chromosome:
                                            </Typography>
                                            <Typography variant="body2">
                                                {exon?.chromosome || 'N/A'}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Start:
                                            </Typography>
                                            <Typography variant="body2">
                                                {exon?.exon_start?.toLocaleString() || 'N/A'}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography variant="body2" color="text.secondary">
                                                End:
                                            </Typography>
                                            <Typography variant="body2">
                                                {exon?.exon_end?.toLocaleString() || 'N/A'}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Length:
                                            </Typography>
                                            <Typography variant="body2">
                                                {exon?.exon_length?.toLocaleString() || 'N/A'} bp
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Strand:
                                            </Typography>
                                            <Typography variant="body2">
                                                {exon?.strand || 'N/A'}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    {/* Interactions Section */}
                    <Card>
                        <CardContent>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                                <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
                                    <Tab label={`Interactions (${interactions.length})`} />
                                </Tabs>
                            </Box>

                            {interactionsLoading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                                    <CircularProgress />
                                </Box>
                            ) : interactions.length > 0 ? (
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Partner Exon</TableCell>
                                                <TableCell>Proteins</TableCell>
                                                <TableCell>Method</TableCell>
                                                <TableCell>Jaccard %</TableCell>
                                                <TableCell>Confidence</TableCell>
                                                <TableCell>PDB</TableCell>
                                                <TableCell>Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {interactions.map((interaction) => {
                                                const partnerExon = interaction.exon1 === exonId ? interaction.exon2 : interaction.exon1;
                                                return (
                                                    <TableRow key={interaction.eei_id}>
                                                        <TableCell>
                                                            <Button
                                                                component={Link}
                                                                to={`/exon/${partnerExon}`}
                                                                variant="text"
                                                                size="small"
                                                            >
                                                                {partnerExon}
                                                            </Button>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                                <Button
                                                                    component={Link}
                                                                    to={`/protein/${interaction.protein1}`}
                                                                    variant="outlined"
                                                                    size="small"
                                                                >
                                                                    {interaction.protein1}
                                                                </Button>
                                                                <Button
                                                                    component={Link}
                                                                    to={`/protein/${interaction.protein2}`}
                                                                    variant="outlined"
                                                                    size="small"
                                                                >
                                                                    {interaction.protein2}
                                                                </Button>
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Chip
                                                                label={interaction.method_name}
                                                                size="small"
                                                                color={interaction.method_type === 'experimental' ? 'primary' : 'secondary'}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            {interaction.jaccard_percent ? `${interaction.jaccard_percent}%` : 'N/A'}
                                                        </TableCell>
                                                        <TableCell>
                                                            {interaction.confidence ? `${(interaction.confidence * 100).toFixed(1)}%` : 'N/A'}
                                                        </TableCell>
                                                        <TableCell>
                                                            {interaction.pdb_id ? (
                                                                <Chip label={interaction.pdb_id} size="small" variant="outlined" />
                                                            ) : 'N/A'}
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
                                    No interactions found for this exon.
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </Box>
        </Container>
    );
};

export default ExonDetailsPage;