import React, { useState } from 'react';
import {
    Container,
    Typography,
    Box,
    Card,
    CardContent,
    Grid,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    LinearProgress,
} from '@mui/material';
import {
    FileDownload,
    TableChart,
    Code,
    Description,
} from '@mui/icons-material';
import { exportAPI } from '../services/api';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const ExportPage = () => {
    const [exportConfig, setExportConfig] = useState({
        type: 'experimental',
        method: '',
        format: 'json',
        limit: 1000,
        min_jaccard: '',
        min_confidence: '',
    });
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async () => {
        try {
            setIsExporting(true);

            const params = {
                ...exportConfig,
                limit: parseInt(exportConfig.limit),
            };

            // Remove empty filters
            if (!params.min_jaccard) delete params.min_jaccard;
            if (!params.min_confidence) delete params.min_confidence;
            if (!params.method) delete params.method;

            const response = await exportAPI.exportInteractions(params);

            // Create download link
            let blob;
            let filename;

            if (params.format === 'json') {
                blob = new Blob([JSON.stringify(response, null, 2)], { type: 'application/json' });
                filename = `eei_interactions_${params.type}_${new Date().toISOString().slice(0, 10)}.json`;
            } else {
                blob = response;
                filename = `eei_interactions_${params.type}_${new Date().toISOString().slice(0, 10)}.${params.format}`;
            }

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast.success('Export completed successfully!');
        } catch (error) {
            console.error('Export error:', error);
            toast.error('Export failed: ' + error.message);
        } finally {
            setIsExporting(false);
        }
    };

    const formatOptions = [
        { value: 'json', label: 'JSON', icon: <Code />, description: 'JavaScript Object Notation' },
        { value: 'csv', label: 'CSV', icon: <TableChart />, description: 'Comma-separated values' },
        { value: 'tsv', label: 'TSV', icon: <Description />, description: 'Tab-separated values' },
    ];

    const methodOptions = [
        { value: '', label: 'All Methods' },
        { value: 'contact_based', label: 'Contact-based' },
        { value: 'PISA', label: 'PISA' },
        { value: 'EPPIC', label: 'EPPIC' },
        { value: 'predicted_contact', label: 'Predicted Contact' },
        { value: 'predicted_PISA', label: 'Predicted PISA' },
        { value: 'predicted_EPPIC', label: 'Predicted EPPIC' },
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
                        Export Data
                    </Typography>
                    <Typography variant="body1" color="text.secondary" paragraph>
                        Export EEI interaction data in various formats for analysis and research.
                    </Typography>

                    <Grid container spacing={3}>
                        {/* Export Configuration */}
                        <Grid item xs={12} md={8}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Export Configuration
                                    </Typography>

                                    <Grid container spacing={3}>
                                        {/* Data Type */}
                                        <Grid item xs={12} sm={6}>
                                            <FormControl fullWidth>
                                                <InputLabel>Data Type</InputLabel>
                                                <Select
                                                    value={exportConfig.type}
                                                    label="Data Type"
                                                    onChange={(e) => setExportConfig({ ...exportConfig, type: e.target.value })}
                                                >
                                                    <MenuItem value="experimental">Experimental Interactions</MenuItem>
                                                    <MenuItem value="predicted">Predicted Interactions</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>

                                        {/* Method */}
                                        <Grid item xs={12} sm={6}>
                                            <FormControl fullWidth>
                                                <InputLabel>Method</InputLabel>
                                                <Select
                                                    value={exportConfig.method}
                                                    label="Method"
                                                    onChange={(e) => setExportConfig({ ...exportConfig, method: e.target.value })}
                                                >
                                                    {methodOptions.map((option) => (
                                                        <MenuItem key={option.value} value={option.value}>
                                                            {option.label}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>

                                        {/* Format */}
                                        <Grid item xs={12} sm={6}>
                                            <FormControl fullWidth>
                                                <InputLabel>Format</InputLabel>
                                                <Select
                                                    value={exportConfig.format}
                                                    label="Format"
                                                    onChange={(e) => setExportConfig({ ...exportConfig, format: e.target.value })}
                                                >
                                                    {formatOptions.map((option) => (
                                                        <MenuItem key={option.value} value={option.value}>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                {option.icon}
                                                                <Box>
                                                                    <Typography variant="body1">{option.label}</Typography>
                                                                    <Typography variant="caption" color="text.secondary">
                                                                        {option.description}
                                                                    </Typography>
                                                                </Box>
                                                            </Box>
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>

                                        {/* Limit */}
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                type="number"
                                                label="Limit"
                                                value={exportConfig.limit}
                                                onChange={(e) => setExportConfig({ ...exportConfig, limit: e.target.value })}
                                                inputProps={{ min: 1, max: 10000 }}
                                                helperText="Maximum number of interactions to export (1-10000)"
                                            />
                                        </Grid>

                                        {/* Filters */}
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                type="number"
                                                label="Minimum Jaccard Score"
                                                value={exportConfig.min_jaccard}
                                                onChange={(e) => setExportConfig({ ...exportConfig, min_jaccard: e.target.value })}
                                                inputProps={{ min: 0, max: 1, step: 0.01 }}
                                                helperText="Filter by minimum Jaccard similarity (0-1)"
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                type="number"
                                                label="Minimum Confidence"
                                                value={exportConfig.min_confidence}
                                                onChange={(e) => setExportConfig({ ...exportConfig, min_confidence: e.target.value })}
                                                inputProps={{ min: 0, max: 1, step: 0.01 }}
                                                helperText="Filter by minimum confidence score (0-1)"
                                            />
                                        </Grid>
                                    </Grid>

                                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            startIcon={<FileDownload />}
                                            onClick={handleExport}
                                            disabled={isExporting}
                                            size="large"
                                        >
                                            {isExporting ? 'Exporting...' : 'Export Data'}
                                        </Button>
                                    </Box>

                                    {isExporting && (
                                        <Box sx={{ mt: 2 }}>
                                            <LinearProgress />
                                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                                Preparing your export...
                                            </Typography>
                                        </Box>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Help Section */}
                        <Grid item xs={12} md={4}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Export Help
                                    </Typography>
                                    <Typography variant="body2" paragraph>
                                        Choose your export options carefully:
                                    </Typography>
                                    <Typography variant="body2" component="ul" sx={{ pl: 2 }}>
                                        <li>Select the data type (experimental or predicted interactions)</li>
                                        <li>Filter by specific methods if needed</li>
                                        <li>Choose your preferred export format</li>
                                        <li>Set a limit to control the number of results</li>
                                        <li>Apply filters using Jaccard score and confidence thresholds</li>
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </motion.div>
            </Box>
        </Container>
    );
};

export default ExportPage;