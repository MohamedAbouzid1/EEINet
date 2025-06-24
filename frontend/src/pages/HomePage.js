import React, { useState } from 'react';
import {
    Container,
    Typography,
    Box,
    Card,
    CardContent,
    Grid,
    Button,
    Chip,
    Divider,
    TextField,
    InputAdornment,
    Paper,
} from '@mui/material';
import {
    Search as SearchIcon,
    BarChart,
} from '@mui/icons-material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDna, faVial, faCalculator, faSearch, faHexagonNodes, faFileExport, faFingerprint } from '@fortawesome/free-solid-svg-icons';
import { faAtom } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { statsAPI } from '../services/api';
import FooterComponent from '../components/layout/Footer';

const HomePage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const { data: stats, isLoading } = useQuery({
        queryKey: ['stats', 'summary'],
        queryFn: statsAPI.getSummary,
    });

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const features = [
        {
            icon: <FontAwesomeIcon icon={faSearch} size="lg" />,
            title: 'Advanced Search',
            description: 'Search exon, protein, or gene across species',
            link: '/search',
            color: '#1976d2',
        },
        {
            icon: <FontAwesomeIcon icon={faHexagonNodes} size="lg" />,
            title: 'Network Visualization',
            description: 'Interactive visualization of exon-exon interaction networks',
            link: '/network',
            color: '#388e3c',
        },
        {
            icon: <BarChart />,
            title: 'Statistics & Analytics',
            description: 'Comprehensive statistics and data distributions',
            link: '/statistics',
            color: '#f57c00',
        },
        {
            icon: <FontAwesomeIcon icon={faFileExport} size="lg" />,
            title: 'Data Export',
            description: 'Export interaction data in multiple formats (CSV, TSV, JSON)',
            link: '/export',
            color: '#7b1fa2',
        },
    ];

    const statsCards = [
        {
            title: 'Total Interactions',
            value: stats?.data?.total_eei_interactions || 72657,
            icon: <FontAwesomeIcon icon={faDna} size="lg" />,
            color: '#1976d2',
            gradient: 'linear-gradient(45deg, #1976d2, #64b5f6)',
        },
        {
            title: 'Experimental EEIs',
            value: stats?.data?.experimental_eeis || 72352,
            icon: <FontAwesomeIcon icon={faAtom} size="lg" />,
            color: '#388e3c',
            gradient: 'linear-gradient(45deg, #388e3c, #81c784)',
        },
        {
            title: 'Unique Exons',
            value: stats?.data?.unique_exons || 12769,
            icon: <FontAwesomeIcon icon={faVial} size="lg" />,
            color: '#f57c00',
            gradient: 'linear-gradient(45deg, #f57c00, #ffb74d)',
        },
        {
            title: 'Unique Proteins',
            value: stats?.data?.unique_proteins || 3166,
            icon: <FontAwesomeIcon icon={faCalculator} size="lg" />,
            color: '#7b1fa2',
            gradient: 'linear-gradient(45deg, #7b1fa2, #ba68c8)',

        },
        {
            title: 'Unique PDB IDs',
            value: stats?.data?.unique_pdb_structures || 3166,
            icon: <FontAwesomeIcon icon={faFingerprint} size="lg" />,
            color: '#9d0208',
            gradient: 'linear-gradient(#9d0208, #9d0208, #d00000)',

        },

    ];
    // Detection methods with their routes
    const detectionMethods = [
        {
            name: 'Contact-based',
            route: '/methods/contact',
            color: '#1976d2',
            description: 'Direct structural contact analysis'
        },
        {
            name: 'PISA-based',
            route: '/methods/pisa',
            color: '#388e3c',
            description: 'Protein Interfaces, Surfaces and Assemblies'
        },
        {
            name: 'EPPIC-based',
            route: '/methods/eppic',
            color: '#f57c00',
            description: 'Evolutionary Protein-Protein Interface Classifier'
        },
        {
            name: 'Orthology-based Predictions',
            route: '/methods/orthology',
            color: '#7b1fa2',
            description: 'Cross-species orthology mapping'
        }
    ];

    return (
        <>
            <Container maxWidth="lg">
                <Box sx={{ py: 4 }}>
                    {/* Hero Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Box sx={{ textAlign: 'center', mb: 6, mt: 4 }}>
                            <Typography
                                variant="h3"
                                component="h1"
                                gutterBottom
                                sx={{
                                    fontWeight: 750,
                                    background: 'linear-gradient(90deg, #1976d2 0%, #00afb9 100%)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                EEINet
                            </Typography>
                            <Typography
                                variant="h3"
                                component="h1"
                                gutterBottom
                                sx={{
                                    fontWeight: 750,
                                    background: 'linear-gradient(90deg, #1976d2 0%, #00afb9 100%)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                The Exon-Exon Interactions Database
                            </Typography>
                            <Typography
                                variant="h5"
                                color="text.secondary"
                                paragraph
                                sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}
                            >
                                A comprehensive resource for human exon-exon interaction data

                            </Typography>

                            {/* Search Bar */}
                            <Paper
                                component="form"
                                onSubmit={handleSearch}
                                sx={{
                                    p: 2,
                                    maxWidth: 1000,
                                    mx: 'auto',
                                    mb: 4,
                                    display: 'flex',
                                    alignItems: 'center',
                                    boxShadow: 3,
                                }}
                            >
                                <TextField
                                    fullWidth
                                    placeholder="Search exons, genes, protein complexes, or proteins (e.g., ENSE00001126122)"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon color="action" />
                                            </InputAdornment>
                                        ),
                                    }}
                                    variant="outlined"
                                    sx={{ mr: 1 }}
                                />
                                <Button
                                    type="submit"
                                    variant="contained"
                                    size="large"

                                    sx={{ px: 3, py: 1.5 }}
                                >
                                    Search
                                </Button>
                            </Paper>

                            {/* Quick Search Chips */}
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                                {['ENSE00001126122', 'PSMB6', '8bzl', 'P28072'].map((term) => (
                                    <Chip
                                        key={term}
                                        label={term}
                                        onClick={() => navigate(`/search?q=${term}`)}
                                        variant="outlined"
                                        clickable
                                    />
                                ))}
                            </Box>
                        </Box>
                    </motion.div>

                    {/* Statistics Cards */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
                            Database Overview
                        </Typography>
                        <Grid container spacing={3} sx={{ mb: 6, justifyContent: 'center' }}>
                            {statsCards.map((stat, index) => (
                                <Grid item xs={12} sm={6} md={3} key={stat.title}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: 0.1 * index }}
                                    >
                                        <Card sx={{ height: '100%', textAlign: 'center' }}>
                                            <CardContent>
                                                <Box
                                                    sx={{
                                                        display: 'inline-flex',
                                                        p: 2,
                                                        borderRadius: 2,
                                                        backgroundColor: `${stat.color}20`,
                                                        color: stat.color,
                                                        mb: 2,
                                                    }}
                                                >
                                                    {stat.icon}
                                                </Box>
                                                <Typography
                                                    variant="h4"
                                                    component="div"
                                                    gutterBottom
                                                    sx={{
                                                        background: stat.gradient,
                                                        backgroundClip: 'text',
                                                        WebkitBackgroundClip: 'text',
                                                        WebkitTextFillColor: 'transparent',
                                                        fontWeight: 600
                                                    }}
                                                >
                                                    {isLoading ? '...' : stat.value.toLocaleString()}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {stat.title}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </Grid>
                            ))}
                        </Grid>
                    </motion.div>

                    <Divider sx={{ my: 6 }} />

                    {/* Features Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
                            Explore the Database
                        </Typography>
                        <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
                            {features.map((feature, index) => (
                                <Grid item xs={12} md={6} key={feature.title}>
                                    <motion.div
                                        initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.6, delay: 0.1 * index }}
                                    >
                                        <Card
                                            sx={{
                                                height: '100%',
                                                cursor: 'pointer',
                                                transition: 'transform 0.2s',
                                                '&:hover': {
                                                    transform: 'translateY(-4px)',
                                                    boxShadow: 4,
                                                },
                                            }}
                                            component={Link}
                                            to={feature.link}
                                            style={{ textDecoration: 'none' }}
                                        >
                                            <CardContent sx={{ p: 1.5 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                    <Box
                                                        sx={{
                                                            display: 'inline-flex',
                                                            p: 1.5,
                                                            borderRadius: 2,
                                                            backgroundColor: `${feature.color}20`,
                                                            color: feature.color,
                                                            mr: 2,
                                                        }}
                                                    >
                                                        {feature.icon}
                                                    </Box>
                                                    <Typography variant="h6" component="h3">
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
                    <Divider sx={{ my: 4 }} />

                    {/* Methods Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                    >
                        <Box sx={{ mt: 6, textAlign: 'center' }}>
                            <Typography variant="h4" component="h2" gutterBottom>
                                Detection Methods
                            </Typography>
                            <Typography variant="body1" color="text.secondary" paragraph>
                                Learn about the different methods used to detect exon-exon interactions:
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                                {detectionMethods.map((method, index) => (
                                    <motion.div
                                        key={method.name}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.3, delay: 0.1 * index }}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Chip
                                            label={method.name}
                                            component={Link}
                                            to={method.route}
                                            clickable
                                            sx={{
                                                fontSize: '1rem',
                                                height: 'auto',
                                                py: 1.5,
                                                px: 2,
                                                backgroundColor: `${method.color}15`,
                                                color: method.color,
                                                border: `2px solid ${method.color}30`,
                                                fontWeight: 600,
                                                textDecoration: 'none',
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    backgroundColor: `${method.color}25`,
                                                    borderColor: method.color,
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: `0 4px 12px ${method.color}40`
                                                },
                                                '&:active': {
                                                    transform: 'translateY(0px)',
                                                }
                                            }}
                                        />
                                    </motion.div>
                                ))}
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                                Click on any method to learn more about how it works
                            </Typography>
                        </Box>
                    </motion.div>
                </Box>
            </Container>
            <FooterComponent />
        </>
    );
};

export default HomePage;