import React from 'react';
import {
    Container,
    Typography,
    Box,
    Card,
    CardContent,
    Grid,
    CircularProgress,
    Alert,
    Chip,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { statsAPI } from '../services/api';
import { motion } from 'framer-motion';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from 'recharts';

const COLORS = ['#1976d2', '#388e3c', '#f57c00', '#7b1fa2', '#d32f2f', '#00796b'];

const StatisticsPage = () => {
    const { data: summaryData, isLoading: summaryLoading, error: summaryError } = useQuery({
        queryKey: ['stats', 'summary'],
        queryFn: statsAPI.getSummary,
    });

    const { data: distributionsData, isLoading: distributionsLoading } = useQuery({
        queryKey: ['stats', 'distributions'],
        queryFn: statsAPI.getDistributions,
    });

    const { data: confidenceData, isLoading: confidenceLoading } = useQuery({
        queryKey: ['stats', 'confidence'],
        queryFn: statsAPI.getConfidence,
    });

    if (summaryLoading || distributionsLoading || confidenceLoading) {
        return (
            <Container maxWidth="lg">
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    if (summaryError) {
        return (
            <Container maxWidth="lg">
                <Box sx={{ py: 4 }}>
                    <Alert severity="error">
                        Error loading statistics: {summaryError.message}
                    </Alert>
                </Box>
            </Container>
        );
    }

    const summary = summaryData?.data || {};
    const distributions = distributionsData?.data || {};
    const confidence = confidenceData?.data || [];

    // Prepare chart data
    const methodData = distributions.methods?.map(method => ({
        method: method.method_name,
        count: parseInt(method.count),
        type: method.method_type,
    })) || [];

    const jaccardData = distributions.jaccard_distribution?.map(item => ({
        range: item.jaccard_range,
        count: parseInt(item.count),
    })) || [];

    const confidenceDistData = distributions.confidence_distribution?.map(item => ({
        range: item.confidence_range,
        count: parseInt(item.count),
    })) || [];

    return (
        <Container maxWidth="lg">
            <Box sx={{ py: 4 }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <Typography variant="h4" component="h1" gutterBottom>
                        Database Statistics
                    </Typography>
                    <Typography variant="body1" color="text.secondary" paragraph>
                        Comprehensive analysis of EEI network data across experimental and predicted methods.
                    </Typography>

                    {/* Summary Statistics */}
                    <Grid container spacing={3} sx={{ mb: 4 }} justifyContent="center">
                        {[
                            { title: 'Total Interactions', value: summary.total_eei_interactions, color: '#1976d2' },
                            { title: 'Experimental EEIs', value: summary.experimental_eeis, color: '#388e3c' },
                            { title: 'Predicted EEIs', value: summary.predicted_eeis, color: '#f57c00' },
                            { title: 'Unique Exons', value: summary.unique_exons, color: '#7b1fa2' },
                            { title: 'Unique Proteins', value: summary.unique_proteins, color: '#d32f2f' },
                            { title: 'PDB Structures', value: summary.unique_pdb_structures, color: '#00796b' },
                        ].map((stat, index) => (
                            <Grid item xs={12} sm={6} md={4} key={stat.title}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.1 * index }}
                                >
                                    <Card>
                                        <CardContent sx={{ textAlign: 'center' }}>
                                            <Typography
                                                variant="h4"
                                                component="div"
                                                sx={{ color: stat.color, fontWeight: 'bold', mb: 1 }}
                                            >
                                                {stat.value?.toLocaleString() || 0}
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

                    {/* Method Distribution */}
                    <Grid container spacing={3} sx={{ mb: 4 }} justifyContent="center">
                        <Grid item xs={12} lg={8}>
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            Interactions by Method
                                        </Typography>
                                        <ResponsiveContainer width="100%" height={300} minWidth={400}>
                                            <BarChart data={methodData}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="method" />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Bar dataKey="count" fill="#1976d2" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </Grid>

                        <Grid item xs={12} lg={4}>
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            Method Types
                                        </Typography>
                                        <ResponsiveContainer width="100%" height={300} minWidth={400}>
                                            <PieChart>
                                                <Pie
                                                    data={[
                                                        { name: 'Experimental', value: summary.experimental_eeis || 0 },
                                                        { name: 'Predicted', value: summary.predicted_eeis || 0 },
                                                    ]}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                                    outerRadius={80}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                >
                                                    {[0, 1].map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </Grid>
                    </Grid>

                    {/* Quality Distributions */}
                    <Grid container spacing={3} sx={{ mb: 4 }} justifyContent="center">
                        <Grid item xs={12} md={6}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                            >
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            Jaccard Percentage Distribution (Experimental)
                                        </Typography>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <BarChart data={jaccardData}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="range" />
                                                <YAxis />
                                                <Tooltip />
                                                <Bar dataKey="count" fill="#388e3c" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                            >
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            Confidence Distribution (Predicted)
                                        </Typography>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <BarChart data={confidenceDistData}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="range" />
                                                <YAxis />
                                                <Tooltip />
                                                <Bar dataKey="count" fill="#f57c00" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </Grid>
                    </Grid>

                    {/* Confidence Statistics for Predicted Methods */}
                    {confidence.length > 0 && (
                        <Grid container spacing={3} sx={{ mb: 4 }} justifyContent="center">
                            <Grid item xs={12}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.6 }}
                                >
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom>
                                                Prediction Confidence Statistics
                                            </Typography>
                                            <Grid container spacing={3}>
                                                {confidence.map((method, index) => (
                                                    <Grid item xs={12} md={4} key={method.method_name}>
                                                        <Card variant="outlined">
                                                            <CardContent>
                                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: 2 }}>
                                                                    <Typography variant="subtitle1">
                                                                        {method.method_name}
                                                                    </Typography>
                                                                    <Chip
                                                                        label={`${method.total_interactions} interactions`}
                                                                        size="small"
                                                                        color="primary"
                                                                    />
                                                                </Box>
                                                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                        <Typography variant="body2" color="text.secondary">
                                                                            Average:
                                                                        </Typography>
                                                                        <Typography variant="body2">
                                                                            {(parseFloat(method.avg_confidence) * 100).toFixed(1)}%
                                                                        </Typography>
                                                                    </Box>
                                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                        <Typography variant="body2" color="text.secondary">
                                                                            Median:
                                                                        </Typography>
                                                                        <Typography variant="body2">
                                                                            {(parseFloat(method.median_confidence) * 100).toFixed(1)}%
                                                                        </Typography>
                                                                    </Box>
                                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                        <Typography variant="body2" color="text.secondary">
                                                                            Range:
                                                                        </Typography>
                                                                        <Typography variant="body2">
                                                                            {(parseFloat(method.min_confidence) * 100).toFixed(1)}% - {(parseFloat(method.max_confidence) * 100).toFixed(1)}%
                                                                        </Typography>
                                                                    </Box>
                                                                </Box>
                                                            </CardContent>
                                                        </Card>
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </Grid>
                        </Grid>
                    )}
                </motion.div>
            </Box>
        </Container>
    );
};

export default StatisticsPage;