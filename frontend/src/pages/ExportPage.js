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
    FormControlLabel,
    Checkbox,
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
        type: '',
        method: '',
        format: 'json',
        min_confidence: '',
        export_all: false,
    });
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async () => {
        try {
            setIsExporting(true);

            const params = {
                ...exportConfig,
            };

            // Remove empty filters
            if (!params.min_confidence) delete params.min_confidence;
            if (!params.method) delete params.method;

            // Set limit based on export_all checkbox
            if (params.export_all) {
                params.limit = 'all';
            }
            delete params.export_all; // Remove from params as it's not a backend parameter

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
        { value: 'json', label: 'JSON', icon: <Code /> },
        { value: 'csv', label: 'CSV', icon: <TableChart /> },
        { value: 'tsv', label: 'TSV', icon: <Description /> },
    ];

    const methodOptions = [
        { value: 'All Methods', label: 'All Methods' },
        { value: 'Contact', label: 'Contact-based' },
        { value: 'PISA', label: 'PISA' },
        { value: 'EPPIC', label: 'EPPIC' },
        { value: 'predicted_contact', label: 'Predicted Contact' },
        { value: 'predicted_PISA', label: 'Predicted PISA' },
        { value: 'predicted_EPPIC', label: 'Predicted EPPIC' },
    ];

    // Filter method options based on interaction type
    const getFilteredMethodOptions = () => {
        if (exportConfig.type === 'experimental') {
            return methodOptions.filter(option =>
                option.value === 'All Methods' ||
                option.value === 'Contact' ||
                option.value === 'PISA' ||
                option.value === 'EPPIC'
            );
        } else if (exportConfig.type === 'predicted') {
            return methodOptions.filter(option =>
                option.value === 'All Methods' ||
                option.value === 'predicted_contact' ||
                option.value === 'predicted_PISA' ||
                option.value === 'predicted_EPPIC'
            );
        }
        return methodOptions; // Show all options when "All" is selected
    };

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
                                        {/* Interaction Type */}
                                        <Grid item xs={12} sm={8}>
                                            <FormControl fullWidth size="medium">
                                                <InputLabel>Interaction Type</InputLabel>
                                                <Select
                                                    value={exportConfig.type}
                                                    label="Interaction Type"
                                                    onChange={(e) => setExportConfig({ ...exportConfig, type: e.target.value })}
                                                    sx={{ minHeight: '56px', minWidth: '150px' }}
                                                >
                                                    <MenuItem value="All">All</MenuItem>
                                                    <MenuItem value="experimental">Experimental Interactions</MenuItem>
                                                    <MenuItem value="predicted">Predicted Interactions</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>

                                        {/* Method */}
                                        <Grid item xs={12} sm={6}>
                                            <FormControl fullWidth size="medium">
                                                <InputLabel>Method</InputLabel>
                                                <Select
                                                    value={exportConfig.method}
                                                    label="Method"
                                                    onChange={(e) => setExportConfig({ ...exportConfig, method: e.target.value })}
                                                    sx={{ minHeight: '56px', minWidth: '150px' }}
                                                >
                                                    {getFilteredMethodOptions().map((option) => (
                                                        <MenuItem key={option.value} value={option.value}>
                                                            {option.label}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>

                                        {/* Format */}
                                        <Grid item xs={12} sm={6}>
                                            <FormControl fullWidth size="medium">
                                                <InputLabel>Format</InputLabel>
                                                <Select
                                                    value={exportConfig.format}
                                                    label="Format"
                                                    onChange={(e) => setExportConfig({ ...exportConfig, format: e.target.value })}
                                                    sx={{ minHeight: '56px' }}
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

                                        {/* Export All Records Option */}
                                        <Grid item xs={12}>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={exportConfig.export_all}
                                                        onChange={(e) => setExportConfig({ ...exportConfig, export_all: e.target.checked })}
                                                        color="primary"
                                                    />
                                                }
                                                label="Export All Records (uncheck to limit to 1000 records)"
                                            />
                                        </Grid>

                                        {/* Filters */}
                                        {(exportConfig.type === 'predicted' ||
                                            exportConfig.method === 'predicted_contact' ||
                                            exportConfig.method === 'predicted_PISA' ||
                                            exportConfig.method === 'predicted_EPPIC') && (
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
                                            )}
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
                                        <li>Check "Export All Records" to get complete datasets</li>
                                        <li>Apply filters using confidence thresholds</li>
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