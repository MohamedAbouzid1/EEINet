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
} from '@mui/material';
import {
    Science,
    Timeline,
    Analytics,
    CheckCircle,
    ArrowBack,
    OpenInNew,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import FooterComponent from '../components/layout/Footer';

const ContactMethodPage = () => {
    const advantages = [
        'Direct structural evidence from experimental data',
        'High accuracy for resolved protein structures',
        'No computational prediction bias',
        'Comprehensive coverage of all residue types',
        'Validated through X-ray crystallography or cryo-EM'
    ];

    const limitations = [
        'Limited to proteins with available 3D structures',
        'Static snapshot of protein conformations',
        'May not capture dynamic interactions',
        'Resolution-dependent accuracy',
        'Potential crystal packing artifacts'
    ];

    const applications = [
        {
            title: 'Drug Discovery',
            description: 'Identifying druggable interaction sites and binding pockets'
        },
        {
            title: 'Protein Engineering',
            description: 'Understanding critical residues for protein stability and function'
        },
        {
            title: 'Disease Research',
            description: 'Analyzing how mutations affect protein-protein interactions'
        },
        {
            title: 'Structural Biology',
            description: 'Characterizing protein complex assembly and architecture'
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
                                    background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                Contact-Based Detection
                            </Typography>
                            <Typography variant="h6" color="text.secondary" paragraph>
                                Direct structural analysis of protein-protein interactions using atomic coordinates
                            </Typography>
                            <Chip
                                label="Computational Method"
                                color="primary"
                                icon={<Science />}
                                sx={{ mb: 3 }}
                            />
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
                                        The contact-based detection method identifies exon-exon interactions by analyzing direct
                                        physical contacts between amino acid residues in experimentally determined protein structures.
                                        This approach uses three-dimensional coordinates from the Protein Data Bank (PDB) to determine
                                        when residues from different exons are in close spatial proximity.
                                    </Typography>
                                    <Typography variant="body1" paragraph>
                                        An interaction is defined when any two heavy atoms from residues encoded by different exons
                                        are within 6 Å of each other. This distance threshold captures both direct contacts and
                                        near-neighbor interactions that contribute to protein complex stability and function.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Technical Details */}
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
                                        <Typography variant="h6" gutterBottom color="primary">
                                            Distance Calculation
                                        </Typography>
                                        <Typography variant="body2" paragraph>
                                            <strong>Threshold:</strong> 6 Å between heavy atoms
                                        </Typography>
                                        <Typography variant="body2" paragraph>
                                            <strong>Algorithm:</strong> Euclidean distance calculation using atomic coordinates
                                        </Typography>
                                        <Typography variant="body2" paragraph>
                                            <strong>Scope:</strong> All-against-all residue comparison within protein complexes
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong>Output:</strong> Binary interaction matrix (contact/no contact)
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Paper sx={{ p: 3, height: '100%' }}>
                                        <Typography variant="h6" gutterBottom color="primary">
                                            Data Sources
                                        </Typography>
                                        <Typography variant="body2" paragraph>
                                            <strong>Primary:</strong> Protein Data Bank (PDB) structures
                                        </Typography>
                                        <Typography variant="body2" paragraph>
                                            <strong>Resolution:</strong> High-resolution X-ray crystallography and cryo-EM structures
                                        </Typography>
                                        <Typography variant="body2" paragraph>
                                            <strong>Quality:</strong> Structures with resolution better than 3.0 Å
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong>Coverage:</strong> Over 2,000 unique protein complexes
                                        </Typography>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </motion.div>

                        {/* Advantages and Limitations */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
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
                                                            <Timeline color="warning" fontSize="small" />
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

                        {/* Applications */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.8 }}
                        >
                            <Typography variant="h5" gutterBottom>
                                Research Applications
                            </Typography>
                            <Grid container spacing={3} sx={{ mb: 4 }}>
                                {applications.map((app, index) => (
                                    <Grid item xs={12} sm={6} md={3} key={app.title}>
                                        <Card sx={{ height: '100%', textAlign: 'center' }}>
                                            <CardContent>
                                                <Typography variant="h6" gutterBottom color="primary">
                                                    {app.title}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {app.description}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </motion.div>

                        <Divider sx={{ my: 4 }} />

                        {/* Database Statistics */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 1.0 }}
                        >
                            <Card>
                                <CardContent>
                                    <Typography variant="h5" gutterBottom>
                                        Contact-Based Data in EEINet
                                    </Typography>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} sm={6} md={3}>
                                            <Box sx={{ textAlign: 'center' }}>
                                                <Typography variant="h4" color="primary" gutterBottom>
                                                    22,000+
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Contact-based EEIs
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={3}>
                                            <Box sx={{ textAlign: 'center' }}>
                                                <Typography variant="h4" color="primary" gutterBottom>
                                                    1,000+
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    PDB Structures
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={3}>
                                            <Box sx={{ textAlign: 'center' }}>
                                                <Typography variant="h4" color="primary" gutterBottom>
                                                    4,000+
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Unique Exons
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={3}>
                                            <Box sx={{ textAlign: 'center' }}>
                                                <Typography variant="h4" color="primary" gutterBottom>
                                                    2,200+
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Unique Proteins
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
                            <Card sx={{ mt: 4, mb: 4 }}>
                                <CardContent>
                                    <Typography variant="h5" gutterBottom>
                                        Key References
                                    </Typography>
                                    <Alert severity="info" sx={{ mb: 3 }}>
                                        The contact-based method is based on established principles in structural biology
                                        and protein-protein interaction analysis.
                                    </Alert>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="subtitle1" gutterBottom>
                                                Related Publications:
                                            </Typography>
                                            <Typography variant="body2" paragraph>
                                                • <cite>Newaz, K. et al. (2024). "Prognostic importance of splicing-triggered
                                                    aberrations of protein complex interfaces in cancer." NAR Genomics and Bioinformatics.</cite>
                                            </Typography>
                                            <Typography variant="body2" paragraph>
                                                • <cite>Protein Data Bank. "Guidelines for Structure Validation and Analysis."</cite>
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="subtitle1" gutterBottom>
                                                External Resources:
                                            </Typography>
                                            <Button
                                                variant="outlined"
                                                startIcon={<OpenInNew />}
                                                href="https://www.rcsb.org/"
                                                target="_blank"
                                                sx={{ mb: 1, mr: 1 }}
                                                size="small"
                                            >
                                                Protein Data Bank
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                startIcon={<OpenInNew />}
                                                href="https://www.ebi.ac.uk/pdbe/"
                                                target="_blank"
                                                size="small"
                                            >
                                                PDBe
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

export default ContactMethodPage;