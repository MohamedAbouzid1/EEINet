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
    CircularProgress,
    Alert,
    Divider,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs,
    Tab,
    Link as MuiLink,
} from '@mui/material';
import {
    Science,
    Biotech,
    OpenInNew,
    Share,
    Download,
    Timeline,
    Assessment,
} from '@mui/icons-material';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { interactionAPI } from '../services/api';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const InteractionDetailsPage = () => {
    const { interactionId } = useParams();
    const [tabValue, setTabValue] = useState(0);

    const { data: interactionData, isLoading, error } = useQuery({
        queryKey: ['interaction', interactionId],
        queryFn: () => interactionAPI.getInteraction(interactionId),
    });

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
    };

    const handleExport = () => {
        const interaction = interactionData?.data;
        if (!interaction) return;

        const exportData = {
            eei_id: interaction.eei_id,
            exons: {
                exon1: interaction.exon1,
                exon2: interaction.exon2,
            },
            proteins: {
                protein1: interaction.protein1,
                protein2: interaction.protein2,
            },
            method: {
                name: interaction.method_name,
                type: interaction.method_type,
            },
            quality_scores: {
                jaccard_percent: interaction.jaccard_percent,
                confidence: interaction.confidence,
            },
            structural_data: {
                pdb_id: interaction.pdb_id,
                amino_acids: {
                    aa1: interaction.aa1,
                    aa2: interaction.aa2,
                },
            },
            attributes: getMethodAttributes(interaction),
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json',
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `eei_${interactionId}_details.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast.success('Interaction data exported!');
    };

    const getMethodAttributes = (interaction) => {
        const attributes = {};

        // PISA attributes
        if (interaction.free_energy !== null || interaction.buried_area !== null) {
            attributes.pisa = {
                free_energy: interaction.free_energy,
                buried_area: interaction.buried_area,
                hydrogen_bonds: interaction.hydrogen_bonds,
                salt_bridges: interaction.salt_bridges,
            };
        }

        // EPPIC attributes
        if (interaction.cs_score !== null || interaction.cr_score !== null) {
            attributes.eppic = {
                cs_score: interaction.cs_score,
                cr_score: interaction.cr_score,
            };
        }

        // Orthology mapping attributes
        if (interaction.confidence !== null) {
            attributes.orthology = {
                confidence: interaction.confidence,
                identity1: interaction.identity1,
                identity2: interaction.identity2,
                mouse_exon1_coordinates: interaction.mouse_exon1_coordinates,
                mouse_exon2_coordinates: interaction.mouse_exon2_coordinates,
            };
        }

        return attributes;
    };

    if (isLoading) {
        return (
            <Container maxWidth="lg">
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="lg">
                <Box sx={{ py: 4 }}>
                    <Alert severity="error">
                        Error loading interaction details: {error.message}
                    </Alert>
                </Box>
            </Container>
        );
    }

    const interaction = interactionData?.data;

    if (!interaction) {
        return (
            <Container maxWidth="lg">
                <Box sx={{ py: 4 }}>
                    <Alert severity="info">
                        Interaction not found.
                    </Alert>
                </Box>
            </Container>
        );
    }

    const isExperimental = interaction.method_type === 'experimental';
    const isPredicted = interaction.method_type === 'predicted';

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
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                            <Box>
                                <Typography variant="h4" component="h1" gutterBottom>
                                    Interaction Details
                                </Typography>
                                <Typography variant="h5" color="primary" gutterBottom>
                                    EEI #{interaction.eei_id}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                                    <Chip
                                        icon={isExperimental ? <Science /> : <Biotech />}
                                        label={interaction.method_name}
                                        color={isExperimental ? 'primary' : 'secondary'}
                                        size="medium"
                                    />
                                    <Chip
                                        label={isExperimental ? 'Experimental' : 'Predicted'}
                                        variant="outlined"
                                        size="medium"
                                    />
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button
                                    variant="outlined"
                                    startIcon={<Share />}
                                    onClick={handleShare}
                                    size="small"
                                >
                                    Share
                                </Button>
                                <Button
                                    variant="outlined"
                                    startIcon={<Download />}
                                    onClick={handleExport}
                                    size="small"
                                >
                                    Export
                                </Button>
                            </Box>
                        </Box>
                    </Box>

                    {/* Main Information Cards */}
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        {/* Exon Information */}
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Timeline color="primary" />
                                        Interacting Exons
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                                                <Typography variant="subtitle2" gutterBottom>
                                                    Exon 1
                                                </Typography>
                                                <Button
                                                    component={Link}
                                                    to={`/exon/${interaction.exon1}`}
                                                    variant="contained"
                                                    color="inherit"
                                                    size="small"
                                                    sx={{ mt: 1 }}
                                                >
                                                    {interaction.exon1}
                                                </Button>
                                                {interaction.aa1 && (
                                                    <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                                                        AA: {interaction.aa1}
                                                    </Typography>
                                                )}
                                            </Paper>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'secondary.light', color: 'secondary.contrastText' }}>
                                                <Typography variant="subtitle2" gutterBottom>
                                                    Exon 2
                                                </Typography>
                                                <Button
                                                    component={Link}
                                                    to={`/exon/${interaction.exon2}`}
                                                    variant="contained"
                                                    color="inherit"
                                                    size="small"
                                                    sx={{ mt: 1 }}
                                                >
                                                    {interaction.exon2}
                                                </Button>
                                                {interaction.aa2 && (
                                                    <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                                                        AA: {interaction.aa2}
                                                    </Typography>
                                                )}
                                            </Paper>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Protein Information */}
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Assessment color="primary" />
                                        Associated Proteins
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <Box sx={{ textAlign: 'center' }}>
                                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                    Protein 1
                                                </Typography>
                                                <Button
                                                    component={Link}
                                                    to={`/protein/${interaction.protein1}`}
                                                    variant="outlined"
                                                    size="medium"
                                                    fullWidth
                                                >
                                                    {interaction.protein1}
                                                </Button>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Box sx={{ textAlign: 'center' }}>
                                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                    Protein 2
                                                </Typography>
                                                <Button
                                                    component={Link}
                                                    to={`/protein/${interaction.protein2}`}
                                                    variant="outlined"
                                                    size="medium"
                                                    fullWidth
                                                >
                                                    {interaction.protein2}
                                                </Button>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Quality Scores */}
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Quality Scores
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        {interaction.jaccard_percent && (
                                            <Box>
                                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                                    Jaccard Percentage
                                                </Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Chip
                                                        label={`${interaction.jaccard_percent}%`}
                                                        color="primary"
                                                        size="medium"
                                                    />
                                                    <Typography variant="caption" color="text.secondary">
                                                        (Experimental overlap similarity)
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        )}
                                        {interaction.confidence && (
                                            <Box>
                                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                                    Prediction Confidence
                                                </Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Chip
                                                        label={`${(interaction.confidence * 100).toFixed(1)}%`}
                                                        color="secondary"
                                                        size="medium"
                                                    />
                                                    <Typography variant="caption" color="text.secondary">
                                                        (Orthology-based reliability)
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        )}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Structural Information */}
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Structural Information
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        {interaction.pdb_id && (
                                            <Box>
                                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                                    PDB Structure
                                                </Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Chip
                                                        label={interaction.pdb_id}
                                                        variant="outlined"
                                                        size="medium"
                                                    />
                                                    <MuiLink
                                                        href={`https://www.rcsb.org/structure/${interaction.pdb_id}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                                                    >
                                                        View in PDB
                                                        <OpenInNew fontSize="small" />
                                                    </MuiLink>
                                                </Box>
                                            </Box>
                                        )}
                                        <Box>
                                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                                Detection Method
                                            </Typography>
                                            <Typography variant="body1">
                                                {interaction.method_name}
                                            </Typography>
                                        </Box>
                                        {interaction.created_at && (
                                            <Box>
                                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                                    Added to Database
                                                </Typography>
                                                <Typography variant="body2">
                                                    {new Date(interaction.created_at).toLocaleDateString()}
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    {/* Detailed Attributes */}
                    <Card>
                        <CardContent>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                                <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
                                    <Tab label="Method Details" />
                                    {isPredicted && <Tab label="Orthology Mapping" />}
                                </Tabs>
                            </Box>

                            {/* Method Details Tab */}
                            {tabValue === 0 && (
                                <Box>
                                    <Typography variant="h6" gutterBottom>
                                        {interaction.method_name} Method Details
                                    </Typography>

                                    {/* PISA Attributes */}
                                    {(interaction.free_energy !== null || interaction.buried_area !== null) && (
                                        <Box sx={{ mb: 3 }}>
                                            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                                                PISA Analysis
                                            </Typography>
                                            <TableContainer component={Paper} variant="outlined">
                                                <Table size="small">
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>Parameter</TableCell>
                                                            <TableCell align="right">Value</TableCell>
                                                            <TableCell>Description</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {interaction.free_energy !== null && (
                                                            <TableRow>
                                                                <TableCell>Free Energy</TableCell>
                                                                <TableCell align="right">{interaction.free_energy} kcal/mol</TableCell>
                                                                <TableCell>Binding free energy</TableCell>
                                                            </TableRow>
                                                        )}
                                                        {interaction.buried_area !== null && (
                                                            <TableRow>
                                                                <TableCell>Buried Area</TableCell>
                                                                <TableCell align="right">{interaction.buried_area} Ų</TableCell>
                                                                <TableCell>Surface area buried upon binding</TableCell>
                                                            </TableRow>
                                                        )}
                                                        {interaction.hydrogen_bonds !== null && (
                                                            <TableRow>
                                                                <TableCell>Hydrogen Bonds</TableCell>
                                                                <TableCell align="right">{interaction.hydrogen_bonds}</TableCell>
                                                                <TableCell>Number of hydrogen bonds</TableCell>
                                                            </TableRow>
                                                        )}
                                                        {interaction.salt_bridges !== null && (
                                                            <TableRow>
                                                                <TableCell>Salt Bridges</TableCell>
                                                                <TableCell align="right">{interaction.salt_bridges}</TableCell>
                                                                <TableCell>Number of salt bridges</TableCell>
                                                            </TableRow>
                                                        )}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </Box>
                                    )}

                                    {/* EPPIC Attributes */}
                                    {(interaction.cs_score !== null || interaction.cr_score !== null) && (
                                        <Box sx={{ mb: 3 }}>
                                            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                                                EPPIC Analysis
                                            </Typography>
                                            <TableContainer component={Paper} variant="outlined">
                                                <Table size="small">
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>Score Type</TableCell>
                                                            <TableCell align="right">Value</TableCell>
                                                            <TableCell>Interpretation</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {interaction.cs_score !== null && (
                                                            <TableRow>
                                                                <TableCell>CS Score</TableCell>
                                                                <TableCell align="right">{interaction.cs_score}</TableCell>
                                                                <TableCell>Core-Surface score</TableCell>
                                                            </TableRow>
                                                        )}
                                                        {interaction.cr_score !== null && (
                                                            <TableRow>
                                                                <TableCell>CR Score</TableCell>
                                                                <TableCell align="right">{interaction.cr_score}</TableCell>
                                                                <TableCell>Core-Rim score</TableCell>
                                                            </TableRow>
                                                        )}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </Box>
                                    )}

                                    {/* Basic method info if no specific attributes */}
                                    {!interaction.free_energy && !interaction.buried_area &&
                                        !interaction.cs_score && !interaction.cr_score && (
                                            <Alert severity="info">
                                                This {interaction.method_name} interaction was detected using {interaction.method_type} methods.
                                                {interaction.jaccard_percent && ` Jaccard similarity: ${interaction.jaccard_percent}%`}
                                            </Alert>
                                        )}
                                </Box>
                            )}

                            {/* Orthology Mapping Tab */}
                            {tabValue === 1 && isPredicted && (
                                <Box>
                                    <Typography variant="h6" gutterBottom>
                                        Orthology Mapping Details
                                    </Typography>
                                    <Typography variant="body2" paragraph color="text.secondary">
                                        This predicted interaction is based on orthology mapping from mouse structural data to human sequences.
                                    </Typography>

                                    <TableContainer component={Paper} variant="outlined">
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Parameter</TableCell>
                                                    <TableCell align="right">Value</TableCell>
                                                    <TableCell>Description</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell>Confidence Score</TableCell>
                                                    <TableCell align="right">
                                                        {interaction.confidence ? `${(interaction.confidence * 100).toFixed(1)}%` : 'N/A'}
                                                    </TableCell>
                                                    <TableCell>Overall prediction reliability</TableCell>
                                                </TableRow>
                                                {interaction.identity1 && (
                                                    <TableRow>
                                                        <TableCell>Sequence Identity 1</TableCell>
                                                        <TableCell align="right">{(interaction.identity1 * 100).toFixed(1)}%</TableCell>
                                                        <TableCell>Human-mouse identity for exon 1</TableCell>
                                                    </TableRow>
                                                )}
                                                {interaction.identity2 && (
                                                    <TableRow>
                                                        <TableCell>Sequence Identity 2</TableCell>
                                                        <TableCell align="right">{(interaction.identity2 * 100).toFixed(1)}%</TableCell>
                                                        <TableCell>Human-mouse identity for exon 2</TableCell>
                                                    </TableRow>
                                                )}
                                                {interaction.mouse_exon1_coordinates && (
                                                    <TableRow>
                                                        <TableCell>Mouse Exon 1 Coords</TableCell>
                                                        <TableCell align="right">{interaction.mouse_exon1_coordinates}</TableCell>
                                                        <TableCell>Mouse genome coordinates</TableCell>
                                                    </TableRow>
                                                )}
                                                {interaction.mouse_exon2_coordinates && (
                                                    <TableRow>
                                                        <TableCell>Mouse Exon 2 Coords</TableCell>
                                                        <TableCell align="right">{interaction.mouse_exon2_coordinates}</TableCell>
                                                        <TableCell>Mouse genome coordinates</TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </Box>
        </Container>
    );
};

export default InteractionDetailsPage;