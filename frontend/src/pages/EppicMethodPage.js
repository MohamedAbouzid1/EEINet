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
    Timeline,
    Assessment,
    Biotech,
    Computer,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import FooterComponent from '../components/layout/Footer';

const EppicMethodPage = () => {
    const advantages = [
        'Evolutionary information enhances prediction accuracy',
        'Surface area considerations for interface significance',
        'Robust classification of biological vs crystal interfaces',
        'Handles interfaces of varying sizes effectively',
        'Validated across diverse protein families'
    ];

    const limitations = [
        'Requires sufficient homologous sequences for MSA',
        'Limited by available evolutionary data',
        'May struggle with rapidly evolving interfaces',
        'Computationally intensive for large datasets',
        'Dependent on sequence alignment quality'
    ];

    const classificationCriteria = [
        {
            category: 'Large Interfaces',
            threshold: '> 2200 Ų',
            classification: 'Biological',
            rationale: 'Large surface area strongly suggests biological relevance'
        },
        {
            category: 'Small Interfaces',
            threshold: '< 440 Ų',
            classification: 'Crystal Contact',
            rationale: 'Small interfaces are typically crystal packing artifacts'
        },
        {
            category: 'Medium Interfaces',
            threshold: '440-2200 Ų',
            classification: 'Evolutionary Analysis',
            rationale: 'Requires sequence conservation analysis for classification'
        }
    ];

    const scores = [
        {
            score: 'CS Score',
            name: 'Core-Surface Score',
            description: 'Measures evolutionary conservation of core vs surface residues',
            interpretation: 'Higher values indicate biological interfaces'
        },
        {
            score: 'CR Score',
            name: 'Core-Rim Score',
            description: 'Compares conservation between interface core and rim regions',
            interpretation: 'Distinguishes specific from non-specific interactions'
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
                                    background: 'linear-gradient(135deg, #f57c00 0%, #ffb74d 100%)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                EPPIC-Based Detection
                            </Typography>
                            <Typography variant="h6" color="text.secondary" paragraph>
                                Evolutionary Protein-Protein Interface Classifier - Evolution-guided interface analysis
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                                <Chip
                                    label="Computational Method"
                                    color="primary"
                                    icon={<Computer />}
                                />
                                <Chip
                                    label="Evolutionary Analysis"
                                    variant="outlined"
                                    icon={<Timeline />}
                                    sx={{ color: '#f57c00', borderColor: '#f57c00' }}
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
                                        EPPIC (Evolutionary Protein-Protein Interface Classifier) is a sophisticated method that
                                        combines structural analysis with evolutionary information to distinguish biologically
                                        relevant protein-protein interfaces from crystal packing artifacts. It leverages the
                                        principle that functionally important interfaces are more likely to be evolutionarily
                                        conserved than random crystal contacts.
                                    </Typography>
                                    <Typography variant="body1" paragraph>
                                        The method uses a two-tiered approach: first, it applies simple surface area thresholds
                                        to classify obviously biological or non-biological interfaces. For ambiguous cases, it
                                        performs detailed evolutionary analysis using multiple sequence alignments and conservation
                                        scoring to make the final determination.
                                    </Typography>
                                    <Typography variant="body1" paragraph>
                                        <strong>Key Innovation:</strong> EPPIC is the first method to systematically combine
                                        interface size criteria with evolutionary conservation analysis for interface classification.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Classification Criteria */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                                Classification Criteria
                            </Typography>
                            <TableContainer component={Paper} sx={{ mb: 4 }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell><strong>Interface Category</strong></TableCell>
                                            <TableCell><strong>Surface Area</strong></TableCell>
                                            <TableCell><strong>Classification</strong></TableCell>
                                            <TableCell><strong>Rationale</strong></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {classificationCriteria.map((criteria, index) => (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    <Typography variant="body2" fontWeight="medium">
                                                        {criteria.category}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={criteria.threshold}
                                                        size="small"
                                                        variant="outlined"
                                                        sx={{ color: '#f57c00', borderColor: '#f57c00' }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={criteria.classification}
                                                        size="small"
                                                        color={criteria.classification === 'Biological' ? 'success' :
                                                            criteria.classification === 'Crystal Contact' ? 'error' : 'warning'}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {criteria.rationale}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </motion.div>

                        {/* Evolutionary Scores */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                        >
                            <Typography variant="h5" gutterBottom>
                                Evolutionary Conservation Scores
                            </Typography>
                            <Grid container spacing={3} sx={{ mb: 4 }}>
                                {scores.map((scoreInfo, index) => (
                                    <Grid item xs={12} md={6} key={scoreInfo.score}>
                                        <Card sx={{ height: '100%' }}>
                                            <CardContent>
                                                <Typography variant="h6" gutterBottom sx={{ color: '#f57c00' }}>
                                                    {scoreInfo.score}
                                                </Typography>
                                                <Typography variant="subtitle1" gutterBottom>
                                                    {scoreInfo.name}
                                                </Typography>
                                                <Typography variant="body2" paragraph>
                                                    {scoreInfo.description}
                                                </Typography>
                                                <Alert severity="info" variant="outlined">
                                                    <Typography variant="caption">
                                                        <strong>Interpretation:</strong> {scoreInfo.interpretation}
                                                    </Typography>
                                                </Alert>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </motion.div>

                        {/* Technical Implementation */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.8 }}
                        >
                            <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                                Technical Implementation
                            </Typography>
                            <Grid container spacing={3} sx={{ mb: 4 }}>
                                <Grid item xs={12} md={4}>
                                    <Paper sx={{ p: 3, height: '100%' }}>
                                        <Typography variant="h6" gutterBottom sx={{ color: '#f57c00' }}>
                                            Sequence Analysis
                                        </Typography>
                                        <Typography variant="body2" paragraph>
                                            <strong>MSA Generation:</strong> Multiple sequence alignments using PSI-BLAST
                                        </Typography>
                                        <Typography variant="body2" paragraph>
                                            <strong>Homolog Collection:</strong> E-value threshold of 0.0001
                                        </Typography>
                                        <Typography variant="body2" paragraph>
                                            <strong>Conservation Scoring:</strong> Position-specific scoring matrices
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong>Minimum Sequences:</strong> At least 10 homologs required
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Paper sx={{ p: 3, height: '100%' }}>
                                        <Typography variant="h6" gutterBottom sx={{ color: '#f57c00' }}>
                                            Interface Analysis
                                        </Typography>
                                        <Typography variant="body2" paragraph>
                                            <strong>Surface Calculation:</strong> Accessible surface area using probe radius 1.4 Å
                                        </Typography>
                                        <Typography variant="body2" paragraph>
                                            <strong>Core Definition:</strong> Residues with &gt;95% burial upon binding
                                        </Typography>
                                        <Typography variant="body2" paragraph>
                                            <strong>Rim Definition:</strong> Residues with 5-95% burial
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong>Contact Distance:</strong> 5 Å cutoff for interface residues
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Paper sx={{ p: 3, height: '100%' }}>
                                        <Typography variant="h6" gutterBottom sx={{ color: '#f57c00' }}>
                                            Classification
                                        </Typography>
                                        <Typography variant="body2" paragraph>
                                            <strong>Score Combination:</strong> Weighted average of CS and CR scores
                                        </Typography>
                                        <Typography variant="body2" paragraph>
                                            <strong>Threshold Optimization:</strong> Trained on curated dataset
                                        </Typography>
                                        <Typography variant="body2" paragraph>
                                            <strong>Confidence Assessment:</strong> Statistical significance testing
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong>Final Output:</strong> Binary classification with confidence score
                                        </Typography>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </motion.div>

                        {/* Advantages and Limitations */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 1.0 }}
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
                            transition={{ duration: 0.6, delay: 1.2 }}
                        >
                            <Card sx={{ mb: 4 }}>
                                <CardContent>
                                    <Typography variant="h5" gutterBottom>
                                        EPPIC-Based Data in EEINet
                                    </Typography>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} sm={6} md={3}>
                                            <Box sx={{ textAlign: 'center' }}>
                                                <Typography variant="h4" sx={{ color: '#f57c00' }} gutterBottom>
                                                    25,600+
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    EPPIC-validated EEIs
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={3}>
                                            <Box sx={{ textAlign: 'center' }}>
                                                <Typography variant="h4" sx={{ color: '#f57c00' }} gutterBottom>
                                                    3,900+
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Analyzed Complexes
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={3}>
                                            <Box sx={{ textAlign: 'center' }}>
                                                <Typography variant="h4" sx={{ color: '#f57c00' }} gutterBottom>
                                                    0.78
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Avg. CS Score
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={3}>
                                            <Box sx={{ textAlign: 'center' }}>
                                                <Typography variant="h4" sx={{ color: '#f57c00' }} gutterBottom>
                                                    0.65
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Avg. CR Score
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
                            transition={{ duration: 0.6, delay: 1.4 }}
                        >
                            <Card sx={{ mb: 4 }}>
                                <CardContent>
                                    <Typography variant="h5" gutterBottom>
                                        Key References
                                    </Typography>
                                    <Typography variant="body1" paragraph>
                                        EPPIC represents a significant advancement in computational structural biology,
                                        combining evolutionary and structural information for interface classification.
                                    </Typography>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} md={8}>
                                            <Typography variant="subtitle1" gutterBottom>
                                                Primary Reference:
                                            </Typography>
                                            <Typography variant="body2" paragraph>
                                                <cite>Duarte, J.M., Srebniak, A., Schärer, M.A. and Capitani, G. (2012).
                                                    "Protein interface classification by evolutionary analysis." BMC Bioinformatics, 13, 334.</cite>
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
                                                href="https://github.com/eppic-team/eppic"
                                                target="_blank"
                                                sx={{ mb: 1, display: 'block', color: '#f57c00', borderColor: '#f57c00' }}
                                                size="small"
                                                fullWidth
                                            >
                                                EPPIC GitHub
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                startIcon={<OpenInNew />}
                                                href="https://www.eppic-web.org/"
                                                target="_blank"
                                                size="small"
                                                fullWidth
                                                sx={{ color: '#f57c00', borderColor: '#f57c00' }}
                                            >
                                                EPPIC Web Server
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
                            transition={{ duration: 0.6, delay: 1.6 }}
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
                                            to="/methods/pisa"
                                            variant="outlined"
                                            color="success"
                                        >
                                            PISA-Based Method
                                        </Button>
                                        <Button
                                            component={Link}
                                            to="/methods/orthology"
                                            variant="outlined"
                                            color="secondary"
                                        >
                                            Orthology-Based Method
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

export default EppicMethodPage;