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
    Stepper,
    Step,
    StepLabel,
    StepContent,
} from '@mui/material';
import {
    Biotech,
    Analytics,
    CheckCircle,
    ArrowBack,
    OpenInNew,
    Timeline,
    Assessment,
    Computer,
    CompareArrows,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import FooterComponent from '../components/layout/Footer';

const OrthologyMethodPage = () => {
    const advantages = [
        'Expands coverage beyond available human structures',
        'Leverages evolutionary conservation principles',
        'Provides confidence scores for reliability assessment',
        'Systematic cross-species validation',
        'Scalable to large genomic datasets'
    ];

    const limitations = [
        'Dependent on sequence similarity between species',
        'May miss species-specific interactions',
        'Requires high-quality orthology mappings',
        'Confidence decreases with evolutionary distance',
        'Limited by mouse structural data availability'
    ];

    const pipelineSteps = [
        {
            title: 'Structure Analysis',
            description: 'Exon-exon interactions are first identified in mouse protein structures using Contact-based, PISA, and EPPIC methods.'
        },
        {
            title: 'Orthology Mapping',
            description: 'Mouse exons are mapped to their human orthologs using EGIO (Exon Group Ideogram-based detection of Orthologous Exons and Orthologous Isoforms).'
        },
        {
            title: 'Genomic location mapping',
            description: 'Exon ids are mapped to their genomic locations for both mouse and human.'
        },
        {
            title: 'Interaction detection',
            description: 'Orthologous exons from mouse are then used with their genomic locations to detect interactions between human exons.'
        },
        {
            title: 'Interaction filtering',
            description: 'Interactions are filtered based on confidence thresholds and functional annotations.'
        }
    ];

    const confidenceFactors = [
        {
            factor: 'Sequence Identity',
            weight: 'High',
            description: 'Percentage of identical residues between mouse and human exons',
            typical_range: '70-100%'
        },
        {
            factor: 'Alignment Coverage',
            weight: 'Medium',
            description: 'Proportion of exon sequence covered by alignment',
            typical_range: '80-100%'
        },
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
                                    background: 'linear-gradient(135deg, #7b1fa2 0%, #ba68c8 100%)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                Orthology-Based Method
                            </Typography>
                            <Typography variant="h6" color="text.secondary" paragraph>
                                Cross-species interaction prediction using evolutionary conservation and EGIO analysis
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                                <Chip
                                    label="Computational Method"
                                    color="secondary"
                                    icon={<Computer />}
                                />
                                <Chip
                                    label="Cross-Species Analysis"
                                    variant="outlined"
                                    icon={<CompareArrows />}
                                    color="secondary"
                                />
                                <Chip
                                    label="Evolutionary Conservation"
                                    variant="outlined"
                                    icon={<Timeline />}
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
                                        The orthology-based prediction method expands the coverage of exon-exon interactions by
                                        leveraging evolutionary conservation between human and other species proteins. This computational
                                        approach uses experimentally validated interactions in other species protein structures to predict
                                        corresponding interactions in human proteins through orthology mapping.
                                    </Typography>
                                    <Typography variant="body1" paragraph>
                                        The method employs EGIO (Exon Group Ideogram-based detection of Orthologous Exons and
                                        Orthologous Isoforms), a sophisticated algorithm that maps exons between species based on
                                        sequence similarity, genomic organization, and evolutionary relationships. This allows us
                                        to predict human exon-exon interactions even when direct structural data is not available.
                                    </Typography>
                                    <Typography variant="body1" paragraph>
                                        <strong>Key Advantage:</strong> This method significantly increases the coverage of
                                        human EEI predictions by utilizing the extensive other species structural biology data.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Pipeline Steps */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                                Prediction Pipeline: (e.g. mouse-human)
                            </Typography>
                            <Card sx={{ mb: 4 }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Stepper orientation="vertical">
                                        {pipelineSteps.map((step, index) => (
                                            <Step key={step.title} active={true}>
                                                <StepLabel>
                                                    <Typography variant="h6" color="secondary">
                                                        {step.title}
                                                    </Typography>
                                                </StepLabel>
                                                <StepContent>
                                                    <Typography variant="body2" color="text.secondary" sx={{ pb: 2 }}>
                                                        {step.description}
                                                    </Typography>
                                                </StepContent>
                                            </Step>
                                        ))}
                                    </Stepper>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* EGIO Method Details */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                        >
                            <Typography variant="h5" gutterBottom>
                                EGIO: Exon Group Ideogram Analysis
                            </Typography>
                            <Grid container spacing={3} sx={{ mb: 4 }}>
                                <Grid item xs={12} md={6}>
                                    <Card sx={{ height: '100%' }}>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom color="secondary">
                                                Core Algorithm
                                            </Typography>
                                            <Typography variant="body2" paragraph>
                                                <strong>Exon Groups (EGs):</strong> Sets of corresponding exon mappings between species
                                            </Typography>
                                            <Typography variant="body2" paragraph>
                                                <strong>Dynamic Programming:</strong> Optimal alignment strategy for exon sequences
                                            </Typography>
                                            <Typography variant="body2" paragraph>
                                                <strong>Identity Thresholds:</strong> Minimum 80% sequence identity requirement
                                            </Typography>
                                            <Typography variant="body2">
                                                <strong>Coverage Criteria:</strong> At least 80% alignment coverage for validation
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Card sx={{ height: '100%' }}>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom color="secondary">
                                                Validation Metrics
                                            </Typography>
                                            <Typography variant="body2" paragraph>
                                                <strong>Reciprocal Best Hits:</strong> Bidirectional orthology confirmation
                                            </Typography>
                                            <Typography variant="body2" paragraph>
                                                <strong>Collinearity Test:</strong> Genomic organization conservation check
                                            </Typography>
                                            <Typography variant="body2" paragraph>
                                                <strong>Functional Annotation:</strong> Gene ontology and pathway consistency
                                            </Typography>
                                            <Typography variant="body2">
                                                <strong>Expression Correlation:</strong> Tissue-specific expression patterns
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </motion.div>

                        {/* Confidence Scoring */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.8 }}
                        >
                            <Typography variant="h5" gutterBottom>
                                Confidence Scoring System
                            </Typography>
                            <TableContainer component={Paper} sx={{ mb: 4 }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell><strong>Factor</strong></TableCell>
                                            <TableCell><strong>Weight</strong></TableCell>
                                            <TableCell><strong>Description</strong></TableCell>
                                            <TableCell><strong>Typical Range</strong></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {confidenceFactors.map((factor, index) => (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    <Typography variant="body2" fontWeight="medium">
                                                        {factor.factor}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={factor.weight}
                                                        size="small"
                                                        color={factor.weight === 'High' ? 'error' :
                                                            factor.weight === 'Medium' ? 'warning' : 'default'}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">
                                                        {factor.description}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {factor.typical_range}
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
                                        Orthology-Based Predictions in EEINet
                                    </Typography>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} sm={6} md={3}>
                                            <Box sx={{ textAlign: 'center' }}>
                                                <Typography variant="h4" color="secondary" gutterBottom>
                                                    305+
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Conserved EEIs
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={3}>
                                            <Box sx={{ textAlign: 'center' }}>
                                                <Typography variant="h4" color="secondary" gutterBottom>
                                                    18,762
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Orthologous Gene Pairs
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={3}>
                                            <Box sx={{ textAlign: 'center' }}>
                                                <Typography variant="h4" color="secondary" gutterBottom>
                                                    0.85
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Avg. Confidence Score
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={3}>
                                            <Box sx={{ textAlign: 'center' }}>
                                                <Typography variant="h4" color="secondary" gutterBottom>
                                                    89.3%
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Human Gene Coverage
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
                            transition={{ duration: 0.6, delay: 1.6 }}
                        >
                            <Card sx={{ mb: 4 }}>
                                <CardContent>
                                    <Typography variant="h5" gutterBottom>
                                        Key References
                                    </Typography>
                                    <Alert severity="info" sx={{ mb: 3 }}>
                                        The orthology-based prediction method builds upon established principles in
                                        comparative genomics and evolutionary biology.
                                    </Alert>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} md={8}>
                                            <Typography variant="subtitle1" gutterBottom>
                                                EGIO Method Reference:
                                            </Typography>
                                            <Typography variant="body2" paragraph>
                                                <cite>Ma, J., Wu, J.Y. and Zhu, L. (2022). "Detection of orthologous exons and
                                                    isoforms using EGIO." Bioinformatics, 38(19), 4474-4480.</cite>
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
                                                href="https://github.com/wu-lab-egio/EGIO"
                                                target="_blank"
                                                sx={{ mb: 1, display: 'block' }}
                                                size="small"
                                                fullWidth
                                                color="secondary"
                                            >
                                                EGIO GitHub
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
                            transition={{ duration: 0.6, delay: 1.8 }}
                        >
                            <Card>
                                <CardContent>
                                    <Typography variant="h5" gutterBottom>
                                        Explore Other Detection Methods
                                    </Typography>
                                    <Typography variant="body1" paragraph color="text.secondary">
                                        Learn about experimental approaches used in EEINet:
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
                                            to="/methods/eppic"
                                            variant="outlined"
                                            sx={{ color: '#f57c00', borderColor: '#f57c00' }}
                                        >
                                            EPPIC-Based Method
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

export default OrthologyMethodPage;