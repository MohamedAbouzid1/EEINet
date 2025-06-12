import React, { useState } from 'react';
import {
    Container,
    Typography,
    Box,
    Card,
    CardContent,
    Grid,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Alert,
    Button,
    TextField,
} from '@mui/material';
import {
    ExpandMore,
    Search,
    Download,
    BarChart,
    HelpOutline,
    Code,
    Email,
    GitHub,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const HelpPage = () => {
    const [expanded, setExpanded] = useState('search');

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const searchExamples = [
        { query: 'ENSE00001126122', type: 'Exon ID', description: 'Search for a specific exon' },
        { query: 'TP53', type: 'Gene Symbol', description: 'Find all exons and interactions for a gene' },
        { query: 'P04637', type: 'UniProt ID', description: 'Search for protein-specific interactions' },
        { query: 'BRCA1', type: 'Gene Name', description: 'Search using common gene names' },
    ];

    const apiEndpoints = [
        { method: 'GET', endpoint: '/api/exon/{exon_id}', description: 'Get exon details' },
        { method: 'GET', endpoint: '/api/exon/{exon_id}/interactions', description: 'Get exon interactions' },
        { method: 'GET', endpoint: '/api/protein/{protein_id}', description: 'Get protein details' },
        { method: 'GET', endpoint: '/api/search?q={query}', description: 'Search database' },
        { method: 'GET', endpoint: '/api/stats/summary', description: 'Get database statistics' },
        { method: 'GET', endpoint: '/api/export/interactions', description: 'Export interaction data' },
    ];

    const faqs = [
        {
            question: 'What are exon-exon interactions?',
            answer: 'Exon-exon interactions (EEIs) occur when protein segments encoded by different exons physically interact in three-dimensional space. These interactions can occur within the same protein (intra-protein) or between different proteins (inter-protein).',
        },
        {
            question: 'What is the difference between experimental and predicted interactions?',
            answer: 'Experimental interactions are derived from high-resolution protein structures in the Protein Data Bank (PDB), while predicted interactions are computationally inferred using orthology mapping from mouse structural data to human sequences.',
        },
        {
            question: 'How reliable are the predicted interactions?',
            answer: 'Predicted interactions include confidence scores based on sequence similarity and structural conservation. Higher confidence scores indicate more reliable predictions. We recommend using confidence thresholds based on your specific research needs.',
        },
        {
            question: 'Can I download the entire database?',
            answer: 'Yes, you can export interaction data in various formats (JSON, CSV, TSV) through the Export page. You can filter the data by interaction type, method, and quality scores before downloading.',
        },
        {
            question: 'How often is the database updated?',
            answer: 'The database is updated periodically as new structural data becomes available and as we improve our prediction algorithms. Check the About page for the latest update information.',
        },
        {
            question: 'What file formats are supported for data export?',
            answer: 'We support JSON (for programmatic access), CSV (for spreadsheet applications), and TSV (tab-separated values) formats. Each format includes the same core interaction data with optional filtering parameters.',
        },
    ];

    const tutorialSteps = [
        {
            title: 'Basic Search',
            steps: [
                'Enter an exon ID, protein ID, or gene symbol in the search box',
                'Select the appropriate search type from the dropdown',
                'Click "Search" to view results',
                'Browse through interaction results and click "View Details" for more information',
            ],
        },
        {
            title: 'Advanced Filtering',
            steps: [
                'Use the search type filter to narrow results to specific data types',
                'Apply method filters to focus on experimental or predicted interactions',
                'Set quality thresholds using Jaccard score or confidence filters',
                'Combine multiple filters for precise data retrieval',
            ],
        },
        {
            title: 'Data Export',
            steps: [
                'Navigate to the Export page',
                'Select your desired data type (experimental or predicted)',
                'Choose export format (JSON, CSV, or TSV)',
                'Apply any necessary filters',
                'Click "Export Data" to download your dataset',
            ],
        },
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
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Typography variant="h3" component="h1" color="primary" gutterBottom>
                            Help & Documentation
                        </Typography>
                        <Typography variant="h6" color="text.secondary" paragraph>
                            Learn how to effectively use the EEI Network Database
                        </Typography>
                    </Box>

                    {/* Quick Start Guide */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <Card sx={{ mb: 4 }}>
                            <CardContent>
                                <Typography variant="h5" gutterBottom>
                                    Quick Start Guide
                                </Typography>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={4}>
                                        <Box sx={{ textAlign: 'center', p: 2 }}>
                                            <Search sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                                            <Typography variant="h6" gutterBottom>
                                                1. Search
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Enter an exon ID, gene symbol, or protein ID to search for interactions
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Box sx={{ textAlign: 'center', p: 2 }}>
                                            <BarChart sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                                            <Typography variant="h6" gutterBottom>
                                                2. Explore
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Browse interaction details, view statistics, and analyze network patterns
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Box sx={{ textAlign: 'center', p: 2 }}>
                                            <Download sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                                            <Typography variant="h6" gutterBottom>
                                                3. Export
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Download filtered datasets in your preferred format for further analysis
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Search Examples */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <Card sx={{ mb: 4 }}>
                            <CardContent>
                                <Typography variant="h5" gutterBottom>
                                    Search Examples
                                </Typography>
                                <Typography variant="body1" paragraph>
                                    Try these example searches to explore the database:
                                </Typography>
                                <Grid container spacing={2}>
                                    {searchExamples.map((example, index) => (
                                        <Grid item xs={12} sm={6} key={index}>
                                            <Paper sx={{ p: 2, height: '100%' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                    <Chip label={example.type} size="small" color="primary" sx={{ mr: 1 }} />
                                                    <Button
                                                        component={Link}
                                                        to={`/search?q=${example.query}`}
                                                        variant="text"
                                                        size="small"
                                                        sx={{ fontFamily: 'monospace' }}
                                                    >
                                                        {example.query}
                                                    </Button>
                                                </Box>
                                                <Typography variant="body2" color="text.secondary">
                                                    {example.description}
                                                </Typography>
                                            </Paper>
                                        </Grid>
                                    ))}
                                </Grid>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Detailed Help Sections */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                    >
                        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                            Detailed Instructions
                        </Typography>

                        {/* Search Help */}
                        <Accordion expanded={expanded === 'search'} onChange={handleChange('search')}>
                            <AccordionSummary expandIcon={<ExpandMore />}>
                                <Typography variant="h6">Search Functionality</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography variant="body1" paragraph>
                                    The search function supports multiple identifier types and search strategies:
                                </Typography>
                                <Typography variant="subtitle2" gutterBottom>
                                    Supported Identifiers:
                                </Typography>
                                <ul>
                                    <li><strong>Exon IDs:</strong> Ensembl exon identifiers (e.g., ENSE00001126122)</li>
                                    <li><strong>Gene Symbols:</strong> Official gene symbols (e.g., TP53, BRCA1)</li>
                                    <li><strong>Protein IDs:</strong> UniProt identifiers (e.g., P04637)</li>
                                    <li><strong>PDB IDs:</strong> Protein Data Bank structure identifiers</li>
                                </ul>
                                <Alert severity="info" sx={{ mt: 2 }}>
                                    <strong>Tip:</strong> Use the autocomplete feature to see suggestions as you type.
                                    The search is case-insensitive and supports partial matches.
                                </Alert>
                            </AccordionDetails>
                        </Accordion>

                        {/* Data Interpretation */}
                        <Accordion expanded={expanded === 'data'} onChange={handleChange('data')}>
                            <AccordionSummary expandIcon={<ExpandMore />}>
                                <Typography variant="h6">Data Interpretation</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography variant="subtitle2" gutterBottom>
                                    Quality Scores:
                                </Typography>
                                <TableContainer component={Paper} sx={{ mb: 2 }}>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Score Type</TableCell>
                                                <TableCell>Range</TableCell>
                                                <TableCell>Description</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell>Jaccard Score</TableCell>
                                                <TableCell>0-100%</TableCell>
                                                <TableCell>Overlap similarity for experimental interactions</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Confidence Score</TableCell>
                                                <TableCell>0-1.0</TableCell>
                                                <TableCell>Prediction reliability for orthology-based interactions</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <Typography variant="subtitle2" gutterBottom>
                                    Method Types:
                                </Typography>
                                <ul>
                                    <li><strong>Experimental:</strong> Direct evidence from protein structures</li>
                                    <li><strong>Predicted:</strong> Computationally inferred using orthology</li>
                                </ul>
                            </AccordionDetails>
                        </Accordion>

                        {/* API Documentation */}
                        <Accordion expanded={expanded === 'api'} onChange={handleChange('api')}>
                            <AccordionSummary expandIcon={<ExpandMore />}>
                                <Typography variant="h6">API Access</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography variant="body1" paragraph>
                                    Access our data programmatically using our REST API:
                                </Typography>
                                <Typography variant="subtitle2" gutterBottom>
                                    Base URL:
                                </Typography>
                                <Paper sx={{ p: 2, mb: 2, backgroundColor: 'grey.100' }}>
                                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                        http://localhost:5000/api
                                    </Typography>
                                </Paper>
                                <Typography variant="subtitle2" gutterBottom>
                                    Main Endpoints:
                                </Typography>
                                <TableContainer component={Paper}>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Method</TableCell>
                                                <TableCell>Endpoint</TableCell>
                                                <TableCell>Description</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {apiEndpoints.map((endpoint, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>
                                                        <Chip label={endpoint.method} size="small" />
                                                    </TableCell>
                                                    <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                                                        {endpoint.endpoint}
                                                    </TableCell>
                                                    <TableCell>{endpoint.description}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </AccordionDetails>
                        </Accordion>

                        {/* Tutorials */}
                        <Accordion expanded={expanded === 'tutorials'} onChange={handleChange('tutorials')}>
                            <AccordionSummary expandIcon={<ExpandMore />}>
                                <Typography variant="h6">Step-by-Step Tutorials</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container spacing={3}>
                                    {tutorialSteps.map((tutorial, index) => (
                                        <Grid item xs={12} md={4} key={index}>
                                            <Paper sx={{ p: 2, height: '100%' }}>
                                                <Typography variant="subtitle1" gutterBottom>
                                                    {tutorial.title}
                                                </Typography>
                                                <ol>
                                                    {tutorial.steps.map((step, stepIndex) => (
                                                        <li key={stepIndex}>
                                                            <Typography variant="body2" sx={{ mb: 1 }}>
                                                                {step}
                                                            </Typography>
                                                        </li>
                                                    ))}
                                                </ol>
                                            </Paper>
                                        </Grid>
                                    ))}
                                </Grid>
                            </AccordionDetails>
                        </Accordion>
                    </motion.div>

                    {/* FAQ Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                    >
                        <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 3 }}>
                            Frequently Asked Questions
                        </Typography>
                        {faqs.map((faq, index) => (
                            <Accordion key={index}>
                                <AccordionSummary expandIcon={<ExpandMore />}>
                                    <Typography variant="subtitle1">{faq.question}</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography variant="body2">{faq.answer}</Typography>
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </motion.div>

                    {/* Contact Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 1.0 }}
                    >
                        <Card sx={{ mt: 4 }}>
                            <CardContent>
                                <Typography variant="h5" gutterBottom>
                                    Need More Help?
                                </Typography>
                                <Typography variant="body1" paragraph>
                                    If you can't find the answer to your question, we're here to help!
                                </Typography>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={4}>
                                        <Box sx={{ textAlign: 'center', p: 2 }}>
                                            <Email sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                                            <Typography variant="h6" gutterBottom>
                                                Email Support
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" paragraph>
                                                Send us your questions or feedback
                                            </Typography>
                                            <Button variant="outlined" href="mailto:support@eeinet.org">
                                                Contact Us
                                            </Button>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Box sx={{ textAlign: 'center', p: 2 }}>
                                            <GitHub sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                                            <Typography variant="h6" gutterBottom>
                                                GitHub Issues
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" paragraph>
                                                Report bugs or request features
                                            </Typography>
                                            <Button variant="outlined" href="https://github.com/MohamedAbouzid1/EEINet/issues">
                                                Open Issue
                                            </Button>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Box sx={{ textAlign: 'center', p: 2 }}>
                                            <HelpOutline sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                                            <Typography variant="h6" gutterBottom>
                                                Documentation
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" paragraph>
                                                Read our detailed documentation
                                            </Typography>
                                            <Button variant="outlined" component={Link} to="/about">
                                                Learn More
                                            </Button>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>
            </Box>
        </Container>
    );
};

export default HelpPage;