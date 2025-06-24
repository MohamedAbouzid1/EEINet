import React from 'react';
import {
    Container,
    Typography,
    Box,
    Card,
    CardContent,
    Grid,
    Paper,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Alert,
    Chip,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';
import {
    Science,
    Analytics,
    CheckCircle,
    ArrowBack,
    OpenInNew,
    Functions,
    Assessment,
    Computer,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import FooterComponent from '../components/layout/Footer';

const PisaMethodPage = () => {
    const advantages = [
        'Thermodynamically informed interaction assessment',
        'Quantitative stability measurements',
        'Distinction between biological and crystal contacts',
        'Comprehensive interface characterization',
        'Standardized analysis protocol'
    ];

    const limitations = [
        'Relies on static crystal structures',
        'May not capture conformational dynamics',
        'Limited to available PDB structures',
        'Computational approximations in energy calculations',
        'Sensitivity to crystal conditions'
    ];

    const analysisParameters = [
        {
            parameter: 'Solvation Free Energy (ΔG)',
            description: 'Energy gained upon interface formation',
            unit: 'kcal/mol',
            interpretation: 'More negative values indicate stronger interactions'
        },
        {
            parameter: 'Buried Surface Area',
            description: 'Surface area buried upon complex formation',
            unit: 'Ų',
            interpretation: 'Larger values suggest more extensive interfaces'
        },
        {
            parameter: 'Hydrogen Bonds',
            description: 'Number of intermolecular hydrogen bonds',
            unit: 'count',
            interpretation: 'More bonds indicate stronger specific interactions'
        },
        {
            parameter: 'Salt Bridges',
            description: 'Number of ionic interactions',
            unit: 'count',
            interpretation: 'Important for interface stability and specificity'
        }
    ];

    return (
        <>
            <Container maxWidth="lg">
                <Box sx={{ py: 4 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        {/* Header */}
                        <Box sx={{ mb: 4 }}>
                            <Button
                                component={Link}
                                to="/"
                                startIcon={<ArrowBack />}
                                variant="outlined"
                                sx={{ mb: 2 }}
                            >
                                Back to Home
                            </Button>
                            <Typography
                                variant="h3"
                                component="h1"
                                gutterBottom
                                sx={{
                                    fontWeight: 700,
                                    background: 'linear-gradient(135deg, #388e3c 0%, #66bb6a 100%)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                PISA-Based Detection
                            </Typography>
                            <Typography variant="h6" color="text.secondary" paragraph>
                                Protein Interfaces, Surfaces and Assemblies - Thermodynamic analysis of protein complexes
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                                <Chip
                                    label="Computational Method"
                                    color="primary"
                                    icon={<Computer />}
                                />
                            </Box>
                        </Box>

                        {/* Overview */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <Card sx={{ mb: 4 }}>
                                <CardContent sx={{ p: 4 }}>
                                    <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Analytics color="primary" />
                                        Method Overview
                                    </Typography>
                                    <Typography variant="body1" paragraph>
                                        PISA (Protein Interfaces, Surfaces and Assemblies) is a computational tool developed by the
                                        European Bioinformatics Institute (EBI) that analyzes protein-protein interactions based on
                                        thermodynamic principles. It evaluates the stability and biological relevance of protein
                                        complexes by calculating the solvation free energy gained upon interface formation.
                                    </Typography>
                                    <Typography variant="body1" paragraph>
                                        Unlike simple distance-based methods, PISA considers the thermodynamic feasibility of
                                        interactions by computing the energy balance between the buried surface area and the
                                        loss of entropy upon complex formation. This approach helps distinguish biologically
                                        relevant interfaces from crystal packing artifacts.
                                    </Typography>
                                    <Typography variant="body1" paragraph>
                                        <strong>Key Principle:</strong> An interface is considered biologically relevant if the
                                        probability of observing the same solvation free energy gain by chance is less than 0.5.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Technical Implementation */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                                Technical Implementation
                            </Typography>
                            <Grid container spacing={3} sx={{ mb: 4 }}>
                                <Grid item xs={12} md={6}>
                                    <Paper sx={{ p: 3, height: '100%' }}>
                                        <Typography variant="h6" gutterBottom color="success.main">
                                            Energy Calculations
                                        </Typography>
                                        <Typography variant="body2" paragraph>
                                            <strong>Solvation Energy:</strong> Calculated using the accessible surface area
                                            model with atom-specific solvation parameters
                                        </Typography>
                                        <Typography variant="body2" paragraph>
                                            <strong>Interface Area:</strong> Difference between the sum of isolated monomer
                                            surfaces and the surface of the complex
                                        </Typography>
                                        <Typography variant="body2" paragraph>
                                            <strong>Statistical Assessment:</strong> Comparison with random interface patches
                                            of similar size from the same proteins
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong>Threshold:</strong> P-value &lt; 0.5 for biological relevance
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Paper sx={{ p: 3, height: '100%' }}>
                                        <Typography variant="h6" gutterBottom color="success.main">
                                            Analysis Pipeline
                                        </Typography>
                                        <Typography variant="body2" paragraph>
                                            <strong>Input:</strong> PDB structure coordinates and topology
                                        </Typography>
                                        <Typography variant="body2" paragraph>
                                            <strong>Processing:</strong> Interface detection, energy calculation,
                                            statistical validation
                                        </Typography>
                                        <Typography variant="body2" paragraph>
                                            <strong>Validation:</strong> Cross-reference with known biological assemblies
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong>Output:</strong> Thermodynamic scores and biological relevance assessment
                                        </Typography>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </motion.div>

                        {/* Analysis Parameters */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                        >
                            <Typography variant="h5" gutterBottom>
                                PISA Analysis Parameters
                            </Typography>
                            <TableContainer component={Paper} sx={{ mb: 4 }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell><strong>Parameter</strong></TableCell>
                                            <TableCell><strong>Description</strong></TableCell>
                                            <TableCell><strong>Unit</strong></TableCell>
                                            <TableCell><strong>Interpretation</strong></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {analysisParameters.map((param, index) => (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    <Typography variant="body2" fontWeight="medium">
                                                        {param.parameter}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">
                                                        {param.description}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip label={param.unit} size="small" variant="outlined" />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {param.interpretation}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </motion.div>

                        {/* Advantages and Limitations */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.8 }}
                        >
                            <Grid container spacing={3} sx={{ mb: 4 }}>
                                <Grid item xs={12} md={6}>
                                    <Card sx={{ height: '100%' }}>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom color="success.main">
                                                Advantages
                                            </Typography>
                                            <List>
                                                {advantages.map((advantage, index) => (
                                                    <ListItem key={index} sx={{ py: 0.5 }}>
                                                        <ListItemIcon>
                                                            <CheckCircle color="success" fontSize="small" />
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary={advantage}
                                                            primaryTypographyProps={{ variant: 'body2' }}
                                                        />
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Card sx={{ height: '100%' }}>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom color="warning.main">
                                                Limitations
                                            </Typography>
                                            <List>
                                                {limitations.map((limitation, index) => (
                                                    <ListItem key={index} sx={{ py: 0.5 }}>
                                                        <ListItemIcon>
                                                            <Assessment color="warning" fontSize="small" />
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary={limitation}
                                                            primaryTypographyProps={{ variant: 'body2' }}
                                                        />
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </motion.div>

                        <Divider sx={{ my: 4 }} />

                        {/* Database Statistics */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 1.0 }}
                        >
                            <Card sx={{ mb: 4 }}>
                                <CardContent>
                                    <Typography variant="h5" gutterBottom>
                                        PISA-Based Data in EEINet
                                    </Typography>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} sm={6} md={3}>
                                            <Box sx={{ textAlign: 'center' }}>
                                                <Typography variant="h4" color="success.main" gutterBottom>
                                                    24,800+
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    PISA-validated EEIs
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={3}>
                                            <Box sx={{ textAlign: 'center' }}>
                                                <Typography variant="h4" color="success.main" gutterBottom>
                                                    3,900+
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Analyzed Complexes
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={3}>
                                            <Box sx={{ textAlign: 'center' }}>
                                                <Typography variant="h4" color="success.main" gutterBottom>
                                                    -12.5
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Avg. ΔG (kcal/mol)
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={3}>
                                            <Box sx={{ textAlign: 'center' }}>
                                                <Typography variant="h4" color="success.main" gutterBottom>
                                                    1,450
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Avg. Buried Area (Ų)
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Citation and References */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 1.2 }}
                        >
                            <Card sx={{ mb: 4 }}>
                                <CardContent>
                                    <Typography variant="h5" gutterBottom>
                                        Key References
                                    </Typography>
                                    <Typography variant="body1" paragraph>
                                        PISA is an established tool in structural bioinformatics with extensive validation
                                        in the scientific literature.
                                    </Typography>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} md={8}>
                                            <Typography variant="subtitle1" gutterBottom>
                                                Primary Reference:
                                            </Typography>
                                            <Typography variant="body2" paragraph>
                                                <cite>Krissinel, E. and Henrick, K. (2007). "Inference of macromolecular
                                                    assemblies from crystalline state." Journal of Molecular Biology, 372(3), 774-797.</cite>
                                            </Typography>
                                            <Typography variant="subtitle1" gutterBottom>
                                                Application in EEINet:
                                            </Typography>
                                            <Typography variant="body2" paragraph>
                                                <cite>Newaz, K. et al. (2024). "Prognostic importance of splicing-triggered
                                                    aberrations of protein complex interfaces in cancer." NAR Genomics and Bioinformatics.</cite>
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <Typography variant="subtitle1" gutterBottom>
                                                External Resources:
                                            </Typography>
                                            <Button
                                                variant="outlined"
                                                startIcon={<OpenInNew />}
                                                href="https://www.ebi.ac.uk/msd-srv/prot_int/pistart.html"
                                                target="_blank"
                                                sx={{ mb: 1, display: 'block' }}
                                                size="small"
                                                fullWidth
                                            >
                                                PISA Server (EBI)
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                startIcon={<OpenInNew />}
                                                href="https://www.ebi.ac.uk/pdbe/"
                                                target="_blank"
                                                size="small"
                                                fullWidth
                                            >
                                                PDBe Database
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Related Methods */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 1.4 }}
                        >
                            <Card>
                                <CardContent>
                                    <Typography variant="h5" gutterBottom>
                                        Explore Other Detection Methods
                                    </Typography>
                                    <Typography variant="body1" paragraph color="text.secondary">
                                        Learn about complementary approaches used in EEINet:
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                        <Button
                                            component={Link}
                                            to="/methods/contact"
                                            variant="outlined"
                                            color="primary"
                                        >
                                            Contact-Based Method
                                        </Button>
                                        <Button
                                            component={Link}
                                            to="/methods/eppic"
                                            variant="outlined"
                                            sx={{ color: '#f57c00', borderColor: '#f57c00' }}
                                        >
                                            EPPIC-Based Method
                                        </Button>
                                        <Button
                                            component={Link}
                                            to="/methods/orthology"
                                            variant="outlined"
                                            color="secondary"
                                        >
                                            Orthology-Based Predictions
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </motion.div>
                </Box>
            </Container>
            <FooterComponent />
        </>
    );
};

export default PisaMethodPage;