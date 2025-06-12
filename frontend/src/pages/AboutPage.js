import React from 'react';
import {
    Container,
    Typography,
    Box,
    Card,
    CardContent,
    Grid,
    Chip,
    Divider,
    Paper,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import {
    Science,
    DataObject,
    Biotech,
    School,
    Code,
    Storage,
    Timeline,
    ArrowForwardIos,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const AboutPage = () => {
    const features = [
        {
            icon: <Science />,
            title: 'Experimental Data',
            description: 'Experimental human exon-exon interactions from structural protein complexes',
        },
        {
            icon: <Biotech />,
            title: 'Predicted Interactions',
            description: 'Computationally predicted interactions using orthology mapping',
        },
        {
            icon: <DataObject />,
            title: 'Multiple Methods',
            description: 'Contact-based, PISA, EPPIC detection methods for comprehensive coverage',
        },
        {
            icon: <Storage />,
            title: 'Comprehensive Database',
            description: 'Extensive collection of human exon-exon interaction data',
        },
    ];

    const methods = [
        {
            name: 'Contact-based',
            type: 'Experimental',
            description: 'Direct structural contact analysis between exons in protein complexes',
        },
        {
            name: 'PISA-based',
            type: 'Experimental',
            description: 'Protein Interfaces, Surfaces and Assemblies analysis',
        },
        {
            name: 'EPPIC-based',
            type: 'Experimental',
            description: 'Evolutionary Protein-Protein Interface Classifier in protein complexes',
        },
        {
            name: 'Orthology-based Prediction',
            type: 'Predicted',
            description: 'Orthology mapping for interaction prediction using EGIO',
        },
    ];

    const researchApplications = [
        'Alternative splicing analysis',
        'Protein domain interaction studies',
        'Disease variant impact assessment',
        'Evolutionary conservation analysis',
        'Structural biology research',
        'Drug target identification',
    ];

    return (
        <Container maxWidth="lg">
            <Box sx={{ py: 4 }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Header */}
                    <Box sx={{ textAlign: 'center', mb: 6 }}>
                        <Typography
                            variant="h3"
                            component="h1"
                            gutterBottom
                            sx={{
                                fontWeight: 700,
                                background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            About EEINet
                        </Typography>
                        <Typography
                            variant="h5"
                            color="text.secondary"
                            paragraph
                            sx={{ maxWidth: 800, mx: 'auto' }}
                        >
                            A comprehensive resource for exploring human exon-exon interactions based on protein complexes
                        </Typography>
                    </Box>

                    {/* Overview */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <Card sx={{ mb: 4 }}>
                            <CardContent sx={{ p: 4 }}>
                                <Typography variant="h4" gutterBottom>
                                    What is EEI Network?
                                </Typography>
                                <Typography variant="body1" paragraph>
                                    The Exon-Exon Interaction (EEI) Network Database is a specialized resource that catalogs
                                    and analyzes interactions between protein exons. These interactions represent functional
                                    relationships where exons from different genes encode protein segments that physically
                                    interact in three-dimensional space.
                                </Typography>
                                <Typography variant="body1" paragraph>
                                    Our database combines experimental structural data with computational predictions to provide
                                    a comprehensive view of the exon interaction landscape in human proteins. This resource is
                                    valuable for understanding protein function, evolution, and the impact of genetic variations.
                                </Typography>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Key Features */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
                            Key Features
                        </Typography>
                        <Grid container spacing={3} sx={{ mb: 4 }}>
                            {features.map((feature, index) => (
                                <Grid item xs={12} md={6} key={feature.title}>
                                    <motion.div
                                        initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.6, delay: 0.1 * index }}
                                    >
                                        <Card sx={{ height: '100%' }}>
                                            <CardContent>
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                    <Box
                                                        sx={{
                                                            display: 'inline-flex',
                                                            p: 1.5,
                                                            borderRadius: 2,
                                                            backgroundColor: 'primary.light',
                                                            color: 'primary.contrastText',
                                                            mr: 2,
                                                        }}
                                                    >
                                                        {feature.icon}
                                                    </Box>
                                                    <Typography variant="h6">
                                                        {feature.title}
                                                    </Typography>
                                                </Box>
                                                <Typography variant="body2" color="text.secondary">
                                                    {feature.description}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </Grid>
                            ))}
                        </Grid>
                    </motion.div>

                    {/* Detection Methods */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                    >
                        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
                            Detection Methods
                        </Typography>
                        <Grid container spacing={3} sx={{ mb: 4 }}>
                            {methods.map((method, index) => (
                                <Grid item xs={12} md={6} key={method.name}>
                                    <Card>
                                        <CardContent>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                                <Typography variant="h6">
                                                    {method.name}
                                                </Typography>
                                                <Chip
                                                    label={method.type}
                                                    color={method.type === 'Experimental' ? 'primary' : 'secondary'}
                                                    size="small"
                                                />
                                            </Box>
                                            <Typography variant="body2" color="text.secondary">
                                                {method.description}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </motion.div>

                    <Divider sx={{ my: 4 }} />

                    {/* Research Applications */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                    >
                        <Grid container spacing={4}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h4" gutterBottom>
                                    Research Applications
                                </Typography>
                                <Typography variant="body1" paragraph>
                                    The EEI Network Database supports various research applications in molecular biology,
                                    structural biology, and biomedicine:
                                </Typography>
                                <List>
                                    {researchApplications.map((application, index) => (
                                        <ListItem key={index}>
                                            <ListItemIcon>
                                                <ArrowForwardIos color="primary" />
                                            </ListItemIcon>
                                            <ListItemText primary={application} />
                                        </ListItem>
                                    ))}
                                </List>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h4" gutterBottom>
                                    Data Sources & Quality
                                </Typography>
                                <Typography variant="body1" paragraph>
                                    Our database integrates data from multiple high-quality sources:
                                </Typography>
                                <Paper sx={{ p: 2, mb: 2 }}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        Experimental Data
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Derived from high-resolution protein structures in the Protein Data Bank (PDB)
                                    </Typography>
                                </Paper>
                                <Paper sx={{ p: 2, mb: 2 }}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        Sequence Data
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Ensembl gene annotations and UniProt protein sequences
                                    </Typography>
                                </Paper>
                                <Paper sx={{ p: 2 }}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        Orthology Data
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Mouse-human orthology mappings for prediction validation
                                    </Typography>
                                </Paper>
                            </Grid>
                        </Grid>
                    </motion.div>

                    <Divider sx={{ my: 4 }} />

                    {/* Citation & Contact */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 1.0 }}
                    >
                        <Grid container spacing={4}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h5" gutterBottom>
                                    How to Cite:
                                </Typography>
                                <Paper sx={{ p: 3, backgroundColor: 'grey.50' }}>
                                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                        EEINet: A comprehensive database resource for human exon-exon interactions. 2025. Available at:
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h5" gutterBottom>
                                    Development Team
                                </Typography>
                                <Typography variant="body1" paragraph>
                                    This database was developed as part of ongoing research in NeStOme Lab Dr. Khalique Newaz <br />
                                    The institute of computational systems biology at the University of Hamburg, Prof. Dr. Jan Baumbach.
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    For questions, suggestions, or collaboration opportunities, please contact us
                                    through the <Link to="/help"> Help</Link> page.
                                </Typography>
                            </Grid>
                        </Grid>
                    </motion.div>
                </motion.div>
            </Box>
        </Container>
    );
};

export default AboutPage;