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
    Divider,
    Paper,
    LinearProgress,
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

const COLORS = ['#1976d2', '#388e3c', '#f57c00', '#7b1fa2', '#d32f2f', '#00796b', '#e91e63', '#ff9800'];

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

    // Prepare chart data based on your actual database statistics
    const methodData = distributions.methods?.map(method => ({
        method: method.method_name,
        count: parseInt(method.count),
        type: method.method_type,
    })) || [];

    const confidenceDistData = distributions.confidence_distribution?.map(item => ({
        range: item.confidence_range,
        count: parseInt(item.count),
    })) || [];

    // Data based on your database query results
    const biotypeData = [
        { name: 'lncRNA', value: 34656, percentage: 44.83, color: COLORS[0] },
        { name: 'protein_coding', value: 20129, percentage: 26.04, color: COLORS[1] },
        { name: 'processed_pseudogene', value: 9481, percentage: 12.26, color: COLORS[2] },
        { name: 'unprocessed_pseudogene', value: 1951, percentage: 2.52, color: COLORS[3] },
        { name: 'miRNA', value: 1877, percentage: 2.43, color: COLORS[4] },
        { name: 'Other', value: 8212, percentage: 10.62, color: COLORS[5] },
    ];

    const methodOverlapData = [
        { methods: 'EPPIC & PISA', overlaps: 8598, description: 'Highest validation' },
        { methods: 'Contact & PISA', overlaps: 6332, description: 'Strong agreement' },
        { methods: 'Contact & EPPIC', overlaps: 4816, description: 'Moderate overlap' },
        { methods: 'Predicted Methods', overlaps: 38, description: 'Cross-validated predictions' },
    ];

    const dataQualityMetrics = [
        { metric: 'Genes with Symbols', value: 77306, total: 77306, percentage: 100 },
        { metric: 'Exons with Length', value: 12441, total: 12769, percentage: 97.4 },
        { metric: 'Proteins with Names', value: 3102, total: 3166, percentage: 98.0 },
        { metric: 'Interactions with PDB', value: 72526, total: 72657, percentage: 99.8 },
    ];

    const coverageData = [
        { level: 'Total Human Genes', count: 77306, percentage: 100 },
        { level: 'Genes with Proteins', count: 3100, percentage: 4.0 },
        { level: 'Genes with Exons in EEIs', count: 3087, percentage: 4.0 },
        { level: 'Exons with Interactions', count: 12769, percentage: 16.5 },
    ];

    const topInteractors = [
        { name: 'UBB', interactions: 348, type: 'Ubiquitin' },
        { name: 'H3C1', interactions: 330, type: 'Histone' },
        { name: 'UBC', interactions: 249, type: 'Ubiquitin' },
        { name: 'GNB1', interactions: 209, type: 'G-protein' },
        { name: 'GNAI1', interactions: 194, type: 'G-protein' },
    ];

    return (
        <Container maxWidth="lg">
            <Box sx={{ py: 4 }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <Typography variant="h4" component="h1" gutterBottom>
                        Database Statistics & Analytics
                    </Typography>
                    <Typography variant="body1" color="text.secondary" paragraph>
                        Comprehensive analysis of EEI network data, coverage, and quality metrics.
                    </Typography>

                    {/* Core Statistics */}
                    <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2, textAlign: 'center' }}>
                        Core Database Statistics
                    </Typography>
                    <Grid container spacing={3} sx={{ mb: 4, textAlign: 'center' }} justifyContent="center" alignItems="center">
                        {[
                            { title: 'Total Interactions', value: summary.total_eei_interactions || 72657, color: '#1976d2', icon: '🔗' },
                            { title: 'Structure-based EEIs', value: summary.experimental_eeis || 72352, color: '#388e3c', icon: '🧪' },
                            { title: 'Orthology-based EEIs', value: summary.predicted_eeis || 305, color: '#f57c00', icon: '🧬' },
                            { title: 'Unique Exons', value: summary.unique_exons || 12769, color: '#7b1fa2', icon: '📊' },
                            { title: 'Unique Proteins', value: summary.unique_proteins || 3166, color: '#d32f2f', icon: '🔬' },
                            { title: 'PDB Structures', value: summary.unique_pdb_structures || 2291, color: '#00796b', icon: '🏗️' },
                        ].map((stat, index) => (
                            <Grid item xs={12} sm={6} md={4} key={stat.title}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.1 * index }}
                                >
                                    <Card sx={{ height: '100%' }}>
                                        <CardContent sx={{ textAlign: 'center' }}>
                                            <Typography variant="h2" sx={{ fontSize: '2rem', mb: 1 }}>
                                                {stat.icon}
                                            </Typography>
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

                    <Divider sx={{ my: 4 }} />

                    {/* Network Properties */}
                    <Typography variant="h5" gutterBottom sx={{ mb: 3, textAlign: 'center' }}>
                        Network Properties
                    </Typography>
                    <Grid container spacing={3} sx={{ mb: 4, textAlign: 'center' }} justifyContent="center" alignItems="center">
                        <Grid item xs={12} md={4}>
                            <Card>
                                <CardContent sx={{ textAlign: 'center' }}>
                                    <Typography variant="h3" color="primary" gutterBottom>
                                        100%
                                    </Typography>
                                    <Typography variant="h6" gutterBottom>
                                        Inter-protein
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        All interactions occur between different proteins
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Card>
                                <CardContent sx={{ textAlign: 'center' }}>
                                    <Typography variant="h3" color="primary" gutterBottom>
                                        22.9
                                    </Typography>
                                    <Typography variant="h6" gutterBottom>
                                        Avg. Interactions/Protein
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Based on 72,657 interactions across 3,166 proteins
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Card>
                                <CardContent sx={{ textAlign: 'center' }}>
                                    <Typography variant="h3" color="primary" gutterBottom>
                                        35%
                                    </Typography>
                                    <Typography variant="h6" gutterBottom>
                                        Multi-method Validated
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Interactions confirmed by multiple detection methods
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 4 }} />

                    {/* Gene Biotype & Top Interactors */}
                    <Typography variant="h5" gutterBottom sx={{ mb: 3, textAlign: 'center' }}>
                        Gene Biotype & Top Interactors
                    </Typography>
                    <Grid container spacing={3} sx={{ mb: 4 }} justifyContent="center" alignItems="stretch">
                        <Grid item xs={12} md={7}>
                            <Card sx={{ height: '100%', width: '100%' }}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Gene Biotype Distribution in the Database
                                    </Typography>
                                    <ResponsiveContainer width="100%" height={400}>
                                        <PieChart>
                                            <Pie
                                                data={biotypeData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={true}
                                                label={({ name, percentage }) => `${percentage}%`}
                                                outerRadius={120}
                                                fill="#8884d8"
                                                dataKey="value"
                                                fontSize={12}
                                                stroke="#fff"
                                                strokeWidth={2}
                                            >
                                                {biotypeData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                formatter={(value, name) => [
                                                    `${value.toLocaleString()} genes (${biotypeData.find(d => d.value === value)?.percentage}%)`,
                                                    name
                                                ]}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={1}>
                            <Card sx={{ height: '100%' }}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Breakdown
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        {biotypeData.map((item, index) => (
                                            <Box key={item.name} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Box
                                                    sx={{
                                                        width: 16,
                                                        height: 16,
                                                        bgcolor: item.color,
                                                        borderRadius: '50%',
                                                        flexShrink: 0
                                                    }}
                                                />
                                                <Box>
                                                    <Typography variant="body2" fontWeight="bold">
                                                        {item.name}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {item.percentage}%
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        ))}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Card sx={{ height: '100%' }}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Top Interacting Exons
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" paragraph>
                                        Exons with highest interaction counts
                                    </Typography>
                                    {topInteractors.map((interactor, index) => (
                                        <Box key={interactor.name} sx={{ mb: 2 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                                <Typography variant="body2" fontWeight="bold">
                                                    {interactor.name}
                                                </Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Chip label={interactor.type} size="small" />
                                                    <Typography variant="body2" fontWeight="bold">
                                                        {interactor.interactions}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <LinearProgress
                                                variant="determinate"
                                                value={(interactor.interactions / 348) * 100}
                                                sx={{
                                                    height: 6,
                                                    borderRadius: 3,
                                                    '& .MuiLinearProgress-bar': {
                                                        bgcolor: COLORS[index]
                                                    }
                                                }}
                                            />
                                        </Box>
                                    ))}
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                    <Divider sx={{ my: 4 }} />

                    {/* Data Coverage Analysis */}
                    <Typography variant="h5" gutterBottom sx={{ mb: 3, textAlign: 'center' }}>
                        Data Coverage & Quality
                    </Typography>
                    <Grid container spacing={3} sx={{ mb: 4, textAlign: 'center' }} justifyContent="center" alignItems="center">
                        <Grid item xs={12} md={4}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Coverage Funnel
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" paragraph>
                                        From total genes to interaction-participating exons
                                    </Typography>
                                    {coverageData.map((level, index) => (
                                        <Box key={level.level} sx={{ mb: 2 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                <Typography variant="body2">{level.level}</Typography>
                                                <Typography variant="body2" fontWeight="bold">
                                                    {level.count.toLocaleString()}
                                                </Typography>
                                            </Box>
                                            <LinearProgress
                                                variant="determinate"
                                                value={level.percentage}
                                                sx={{
                                                    height: 8,
                                                    borderRadius: 4,
                                                    '& .MuiLinearProgress-bar': {
                                                        bgcolor: COLORS[index]
                                                    }
                                                }}
                                            />
                                            <Typography variant="caption" color="text.secondary">
                                                {level.percentage}% of total genes
                                            </Typography>
                                        </Box>
                                    ))}
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Data Completeness
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" paragraph>
                                        Quality metrics across data types
                                    </Typography>
                                    {dataQualityMetrics.map((metric, index) => (
                                        <Box key={metric.metric} sx={{ mb: 2 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                <Typography variant="body2">{metric.metric}</Typography>
                                                <Typography variant="body2" fontWeight="bold">
                                                    {metric.percentage}%
                                                </Typography>
                                            </Box>
                                            <LinearProgress
                                                variant="determinate"
                                                value={metric.percentage}
                                                sx={{
                                                    height: 6,
                                                    borderRadius: 3,
                                                    bgcolor: '#f5f5f5',
                                                    '& .MuiLinearProgress-bar': {
                                                        bgcolor: metric.percentage > 95 ? '#4caf50' : '#ff9800'
                                                    }
                                                }}
                                            />
                                            <Typography variant="caption" color="text.secondary">
                                                {metric.value.toLocaleString()} of {metric.total.toLocaleString()}
                                            </Typography>
                                        </Box>
                                    ))}
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Method Cross-Validation
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" paragraph>
                                        Overlapping interactions between methods
                                    </Typography>
                                    {methodOverlapData.map((overlap, index) => (
                                        <Box key={overlap.methods} sx={{ mb: 2 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                <Typography variant="body2">{overlap.methods}</Typography>
                                                <Typography variant="body2" fontWeight="bold">
                                                    {overlap.overlaps.toLocaleString()}
                                                </Typography>
                                            </Box>
                                            <LinearProgress
                                                variant="determinate"
                                                value={(overlap.overlaps / 8598) * 100}
                                                sx={{
                                                    height: 6,
                                                    borderRadius: 3,
                                                    '& .MuiLinearProgress-bar': {
                                                        bgcolor: COLORS[index + 2]
                                                    }
                                                }}
                                            />
                                            <Typography variant="caption" color="text.secondary">
                                                {overlap.description}
                                            </Typography>
                                        </Box>
                                    ))}
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    {/* Confidence Distribution */}
                    {confidence.length > 0 && (
                        <>
                            <Divider sx={{ my: 4 }} />
                            <Typography variant="h5" gutterBottom sx={{ mb: 3, textAlign: 'center' }}>
                                Prediction Quality Metrics
                            </Typography>
                            <Grid container spacing={3} sx={{ mb: 4, textAlign: 'center' }} justifyContent="center" alignItems="center">
                                <Grid item xs={12} md={6}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom>
                                                Confidence Score Distribution (Orthology-based)
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
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom>
                                                Method-Specific Quality
                                            </Typography>
                                            {confidence.map((method, index) => (
                                                <Box key={method.method_name} sx={{ mb: 3 }}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                                        <Typography variant="subtitle1">
                                                            {method.method_name}
                                                        </Typography>
                                                        <Chip
                                                            label={`${method.total_interactions} interactions`}
                                                            size="small"
                                                            color="primary"
                                                        />
                                                    </Box>
                                                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mb: 1 }}>
                                                        <Typography variant="caption" color="text.secondary">
                                                            Avg: {(parseFloat(method.avg_confidence) * 100).toFixed(1)}%
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            Median: {(parseFloat(method.median_confidence) * 100).toFixed(1)}%
                                                        </Typography>
                                                    </Box>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={parseFloat(method.avg_confidence) * 100}
                                                        sx={{
                                                            height: 8,
                                                            borderRadius: 4,
                                                            '& .MuiLinearProgress-bar': {
                                                                bgcolor: COLORS[index]
                                                            }
                                                        }}
                                                    />
                                                </Box>
                                            ))}
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </>
                    )}
                </motion.div>
            </Box>
        </Container>
    );
};

export default StatisticsPage;