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
    Science,
    AccountTree,
    BarChart,
    FileDownload,
    TrendingUp,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { statsAPI } from '../services/api';

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
            icon: <SearchIcon />,
            title: 'Advanced Search',
            description: 'Search exon, protein, or gene across species',
            link: '/search',
            color: '#1976d2',
        },
        {
            icon: <AccountTree />,
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
            icon: <FileDownload />,
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
            icon: <TrendingUp />,
            color: '#1976d2',
        },
        {
            title: 'Experimental EEIs',
            value: stats?.data?.experimental_eeis || 72352,
            icon: <Science />,
            color: '#388e3c',
        },
        {
            title: 'Unique Exons',
            value: stats?.data?.unique_exons || 12769,
            icon: <AccountTree />,
            color: '#f57c0',
        },
        {
            title: 'Unique Proteins',
            value: stats?.data?.unique_proteins || 3166,
            icon: <Science />,
            color: '#7b1fa2',
        },
    ];

    return (
        <Container maxWidth="lg">
            <Box sx={{ py: 4 }}>
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
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
                            EEINet
                        </Typography>
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
                            The Exon-Exon Interaction Network Database
                        </Typography>
                        <Typography
                            variant="h5"
                            color="text.secondary"
                            paragraph
                            sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}
                        >
                            Explore human exon-exon interactions across species with experimental and predicted data
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
                                placeholder="Search exons, proteins, or genes (e.g., ENSE00001126122, TP53)"
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
                                sx={{ px: 3 }}
                            >
                                Search
                            </Button>
                        </Paper>

                        {/* Quick Search Chips */}
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                            {['ENSE00001126122', 'TP53', 'BRCA1', 'P53'].map((term) => (
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
                                            <Typography variant="h4" component="div" gutterBottom>
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
                                        <CardContent sx={{ p: 3 }}>
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

                {/* Methods Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                >
                    <Box sx={{ mt: 6, textAlign: 'center' }}>
                        <Typography variant="h5" component="h2" gutterBottom>
                            Detection Methods
                        </Typography>
                        <Typography variant="body1" color="text.secondary" paragraph>
                            Our database includes EEI data from multiple detection methods:
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                            {['Contact-based', 'PISA', 'EPPIC', 'Orthology-based Predictions'].map((method) => (
                                <Chip
                                    key={method}
                                    label={method}
                                    variant="outlined"
                                    size="medium"
                                />
                            ))}
                        </Box>
                    </Box>
                </motion.div>
            </Box>
        </Container>
    );
};

export default HomePage;