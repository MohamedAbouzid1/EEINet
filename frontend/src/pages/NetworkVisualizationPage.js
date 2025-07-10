import React, { useState, useEffect, useRef, useCallback } from 'react';
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
    Chip,
    CircularProgress,
    Alert,
    Slider,
    Switch,
    FormControlLabel,
    Tooltip,
    IconButton,
    Paper,
    Divider,
} from '@mui/material';
import {
    ZoomIn,
    ZoomOut,
    CenterFocusStrong,
    Download,
    Settings,
    Info,
    Refresh,
    FilterList,
    Visibility,
    VisibilityOff,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import cytoscape from 'cytoscape';
import cose from 'cytoscape-cose-bilkent';
import { searchAPI, interactionAPI, networkAPI } from '../services/api';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import FooterComponent from '../components/layout/Footer';

// Register the layout extension
cytoscape.use(cose);

const NetworkVisualizationPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchType, setSearchType] = useState('gene');
    const [selectedMethods, setSelectedMethods] = useState(['all']);
    const [confidenceThreshold, setConfidenceThreshold] = useState(0.5);
    const [jaccardThreshold, setJaccardThreshold] = useState(0);
    const [maxNodes, setMaxNodes] = useState(100);
    const [layoutName, setLayoutName] = useState('cose-bilkent');
    const [showLabels, setShowLabels] = useState(true);
    const [showLegend, setShowLegend] = useState(true);

    const cyRef = useRef(null);
    const containerRef = useRef(null);

    const [networkData, setNetworkData] = useState({ nodes: [], edges: [] });
    const [networkStats, setNetworkStats] = useState({});
    const [isBuilding, setIsBuilding] = useState(false);

    // Fetch network data using the new API
    const { data: networkResults, isLoading: networkLoading } = useQuery({
        queryKey: ['network-data', searchQuery, searchType, selectedMethods, confidenceThreshold, jaccardThreshold],
        queryFn: async () => {
            if (searchType === 'gene') {
                return networkAPI.getGeneNetwork(searchQuery, {
                    method_filter: selectedMethods.includes('all') ? null : selectedMethods[0],
                    min_confidence: confidenceThreshold,
                    min_jaccard: jaccardThreshold,
                    max_interactions: maxNodes
                });
            } else if (searchType === 'protein') {
                return networkAPI.getProteinNetwork(searchQuery, {
                    method_filter: selectedMethods.includes('all') ? null : selectedMethods[0],
                    min_confidence: confidenceThreshold,
                    min_jaccard: jaccardThreshold,
                    max_interactions: maxNodes
                });
            } else {
                // For other types, use the general subgraph API
                const searchParams = {};
                if (searchType === 'exon') {
                    searchParams.exons = searchQuery;
                } else {
                    // For 'any' type, try to detect what it is and set multiple params
                    searchParams.genes = searchQuery;
                    searchParams.proteins = searchQuery;
                    searchParams.exons = searchQuery;
                }

                return networkAPI.getInteractionSubgraph({
                    ...searchParams,
                    method_filter: selectedMethods.includes('all') ? null : selectedMethods[0],
                    min_confidence: confidenceThreshold,
                    min_jaccard: jaccardThreshold,
                    max_interactions: maxNodes
                });
            }
        },
        enabled: !!searchQuery,
    });

    // Build network from API results
    const buildNetwork = useCallback(async () => {
        if (!networkResults?.data?.interactions) return;

        setIsBuilding(true);
        try {
            const interactions = networkResults.data.interactions;

            // Build nodes and edges directly from the API response
            const nodeMap = new Map();
            const edges = [];

            interactions.forEach((interaction) => {
                const exon1 = interaction.exon1 || interaction.source_exon;
                const exon2 = interaction.exon2 || interaction.target_exon;
                const protein1 = interaction.protein1 || interaction.source_protein;
                const protein2 = interaction.protein2 || interaction.target_protein;
                const gene1 = interaction.gene1 || interaction.source_gene;
                const gene2 = interaction.gene2 || interaction.target_gene;

                // Add nodes for exons
                if (!nodeMap.has(exon1)) {
                    nodeMap.set(exon1, {
                        id: exon1,
                        label: exon1,
                        type: 'exon',
                        gene: gene1 || 'Unknown',
                        protein: protein1,
                    });
                }

                if (!nodeMap.has(exon2)) {
                    nodeMap.set(exon2, {
                        id: exon2,
                        label: exon2,
                        type: 'exon',
                        gene: gene2 || 'Unknown',
                        protein: protein2,
                    });
                }

                // Add edge
                edges.push({
                    id: `edge-${interaction.eei_id}`,
                    source: exon1,
                    target: exon2,
                    method: interaction.method_name,
                    methodType: interaction.method_type,
                    confidence: interaction.confidence,
                    jaccard: interaction.jaccard_percent,
                    pdb: interaction.pdb_id,
                    eeiId: interaction.eei_id,
                });
            });

            const nodes = Array.from(nodeMap.values());

            setNetworkData({ nodes, edges });

            // Use network stats from API if available, otherwise calculate
            const stats = networkResults.data.network_stats || {};
            setNetworkStats({
                totalNodes: nodes.length,
                totalEdges: edges.length,
                experimentalEdges: edges.filter(e => e.methodType === 'experimental').length,
                predictedEdges: edges.filter(e => e.methodType === 'predicted').length,
                uniqueGenes: stats.unique_genes || new Set(nodes.map(n => n.gene)).size,
                uniqueProteins: stats.unique_proteins || new Set(nodes.map(n => n.protein)).size,
            });

        } catch (error) {
            console.error('Error building network:', error);
            toast.error('Failed to build network');
        } finally {
            setIsBuilding(false);
        }
    }, [networkResults]);

    // Initialize Cytoscape
    useEffect(() => {
        if (!containerRef.current || networkData.nodes.length === 0) return;

        const cy = cytoscape({
            container: containerRef.current,
            elements: [
                ...networkData.nodes.map(node => ({
                    data: {
                        id: node.id,
                        label: showLabels ? node.label : '',
                        type: node.type,
                        gene: node.gene,
                        protein: node.protein,
                    }
                })),
                ...networkData.edges.map(edge => ({
                    data: {
                        id: edge.id,
                        source: edge.source,
                        target: edge.target,
                        method: edge.method,
                        methodType: edge.methodType,
                        confidence: edge.confidence,
                        jaccard: edge.jaccard,
                        pdb: edge.pdb,
                        eeiId: edge.eeiId,
                    }
                }))
            ],
            style: [
                {
                    selector: 'node',
                    style: {
                        'background-color': (node) => {
                            const gene = node.data('gene');
                            // Color nodes by gene
                            const hash = gene.split('').reduce((a, b) => {
                                a = ((a << 5) - a) + b.charCodeAt(0);
                                return a & a;
                            }, 0);
                            const hue = Math.abs(hash) % 360;
                            return `hsl(${hue}, 70%, 60%)`;
                        },
                        'width': 30,
                        'height': 30,
                        'label': 'data(label)',
                        'text-valign': 'center',
                        'text-halign': 'center',
                        'font-size': '12px',
                        'color': '#333',
                        'border-width': 2,
                        'border-color': '#666',
                        'text-outline-width': 2,
                        'text-outline-color': 'white',
                    }
                },
                {
                    selector: 'edge',
                    style: {
                        'width': (edge) => {
                            const confidence = edge.data('confidence');
                            const jaccard = edge.data('jaccard');
                            if (confidence) {
                                return Math.max(1, confidence * 5);
                            } else if (jaccard) {
                                return Math.max(1, jaccard / 20);
                            }
                            return 2;
                        },
                        'line-color': (edge) => {
                            const methodType = edge.data('methodType');
                            return methodType === 'experimental' ? '#1976d2' : '#f57c00';
                        },
                        'target-arrow-color': (edge) => {
                            const methodType = edge.data('methodType');
                            return methodType === 'experimental' ? '#1976d2' : '#f57c00';
                        },
                        'target-arrow-shape': 'triangle',
                        'curve-style': 'bezier',
                        'opacity': 0.8,
                    }
                },
                {
                    selector: 'node:selected',
                    style: {
                        'border-width': 4,
                        'border-color': '#ff4444',
                    }
                },
                {
                    selector: 'edge:selected',
                    style: {
                        'width': 4,
                        'line-color': '#ff4444',
                        'target-arrow-color': '#ff4444',
                    }
                }
            ],
            layout: {
                name: layoutName,
                animate: true,
                animationDuration: 1000,
                fit: true,
                padding: 50,
                // Cose-bilkent specific options
                randomize: false,
                nodeRepulsion: 4500,
                idealEdgeLength: 50,
                edgeElasticity: 0.45,
                nestingFactor: 0.1,
                gravity: 0.25,
                numIter: 2500,
                tile: true,
                tilingPaddingVertical: 10,
                tilingPaddingHorizontal: 10,
            },
            wheelSensitivity: 0.2,
            minZoom: 0.1,
            maxZoom: 3,
        });

        // Add event listeners
        cy.on('tap', 'node', (evt) => {
            const node = evt.target;
            const nodeData = node.data();
            toast.success(`Selected: ${nodeData.label} (Gene: ${nodeData.gene})`);
        });

        cy.on('tap', 'edge', (evt) => {
            const edge = evt.target;
            const edgeData = edge.data();
            toast.success(`Interaction: ${edgeData.method} (EEI ID: ${edgeData.eeiId})`);
        });

        cyRef.current = cy;

        return () => {
            if (cyRef.current) {
                cyRef.current.destroy();
            }
        };
    }, [networkData, layoutName, showLabels]);

    // Network controls
    const handleZoomIn = () => {
        if (cyRef.current) {
            cyRef.current.zoom(cyRef.current.zoom() * 1.2);
            cyRef.current.center();
        }
    };

    const handleZoomOut = () => {
        if (cyRef.current) {
            cyRef.current.zoom(cyRef.current.zoom() * 0.8);
            cyRef.current.center();
        }
    };

    const handleResetView = () => {
        if (cyRef.current) {
            cyRef.current.fit();
            cyRef.current.center();
        }
    };

    const handleRelayout = () => {
        if (cyRef.current) {
            cyRef.current.layout({
                name: layoutName,
                animate: true,
                animationDuration: 1000,
                fit: true,
            }).run();
        }
    };

    const handleDownload = () => {
        if (cyRef.current) {
            const png = cyRef.current.png({
                output: 'blob',
                bg: 'white',
                full: true,
                scale: 2,
            });

            const url = URL.createObjectURL(png);
            const a = document.createElement('a');
            a.href = url;
            a.download = `network_${searchQuery}_${Date.now()}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            toast.success('Network image downloaded!');
        }
    };

    const handleSearch = () => {
        // The useQuery will automatically trigger when searchQuery changes
        // buildNetwork will be called automatically via useEffect when data arrives
    };

    // Auto-build network when data is available
    useEffect(() => {
        if (networkResults?.data?.interactions) {
            buildNetwork();
        }
    }, [networkResults, buildNetwork]);

    return (
        <>
            <Container maxWidth="xl">
                <Box sx={{ py: 4 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Typography variant="h4" component="h1" gutterBottom>
                            Network Visualization
                        </Typography>
                        <Typography variant="body1" color="text.secondary" paragraph>
                            Explore exon-exon interaction networks through interactive visualization
                        </Typography>

                        <Grid container spacing={3}>
                            {/* Controls Panel */}
                            <Grid item xs={12} lg={3}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            Search & Filter
                                        </Typography>

                                        {/* Search */}
                                        <Box sx={{ mb: 3 }}>
                                            <TextField
                                                fullWidth
                                                label="Search Gene/Protein/Exon"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                placeholder="e.g., TP53, BRCA1"
                                                size="small"
                                                sx={{ mb: 2 }}
                                            />

                                            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                                                <InputLabel>Search Type</InputLabel>
                                                <Select
                                                    value={searchType}
                                                    label="Search Type"
                                                    onChange={(e) => setSearchType(e.target.value)}
                                                >
                                                    <MenuItem value="any">Any</MenuItem>
                                                    <MenuItem value="gene">Gene</MenuItem>
                                                    <MenuItem value="protein">Protein</MenuItem>
                                                    <MenuItem value="exon">Exon</MenuItem>
                                                </Select>
                                            </FormControl>

                                            <Button
                                                fullWidth
                                                variant="contained"
                                                onClick={handleSearch}
                                                disabled={!searchQuery.trim() || networkLoading || isBuilding}
                                                startIcon={networkLoading || isBuilding ? <CircularProgress size={16} /> : <FilterList />}
                                            >
                                                {isBuilding ? 'Building...' : 'Build Network'}
                                            </Button>
                                        </Box>

                                        <Divider sx={{ my: 2 }} />

                                        {/* Filters */}
                                        <Typography variant="subtitle2" gutterBottom>
                                            Filters
                                        </Typography>

                                        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                                            <InputLabel>Methods</InputLabel>
                                            <Select
                                                multiple
                                                value={selectedMethods}
                                                label="Methods"
                                                onChange={(e) => setSelectedMethods(e.target.value)}
                                                renderValue={(selected) => (
                                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                        {selected.map((value) => (
                                                            <Chip key={value} label={value} size="small" />
                                                        ))}
                                                    </Box>
                                                )}
                                            >
                                                <MenuItem value="all">All Methods</MenuItem>
                                                <MenuItem value="contact_based">Contact</MenuItem>
                                                <MenuItem value="PISA">PISA</MenuItem>
                                                <MenuItem value="EPPIC">EPPIC</MenuItem>
                                                <MenuItem value="predicted_contact">Predicted Contact</MenuItem>
                                                <MenuItem value="predicted_PISA">Predicted PISA</MenuItem>
                                                <MenuItem value="predicted_EPPIC">Predicted EPPIC</MenuItem>
                                            </Select>
                                        </FormControl>

                                        <Typography variant="body2" gutterBottom>
                                            Confidence Threshold: {confidenceThreshold}
                                        </Typography>
                                        <Slider
                                            value={confidenceThreshold}
                                            onChange={(e, value) => setConfidenceThreshold(value)}
                                            min={0}
                                            max={1}
                                            step={0.1}
                                            size="small"
                                            sx={{ mb: 2 }}
                                        />

                                        <Typography variant="body2" gutterBottom>
                                            Jaccard Threshold: {jaccardThreshold}%
                                        </Typography>
                                        <Slider
                                            value={jaccardThreshold}
                                            onChange={(e, value) => setJaccardThreshold(value)}
                                            min={0}
                                            max={100}
                                            step={5}
                                            size="small"
                                            sx={{ mb: 2 }}
                                        />

                                        <Typography variant="body2" gutterBottom>
                                            Max Interactions: {maxNodes}
                                        </Typography>
                                        <Slider
                                            value={maxNodes}
                                            onChange={(e, value) => setMaxNodes(value)}
                                            min={50}
                                            max={500}
                                            step={50}
                                            size="small"
                                            sx={{ mb: 2 }}
                                        />

                                        <Divider sx={{ my: 2 }} />

                                        {/* Layout Controls */}
                                        <Typography variant="subtitle2" gutterBottom>
                                            Layout
                                        </Typography>

                                        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                                            <InputLabel>Layout Algorithm</InputLabel>
                                            <Select
                                                value={layoutName}
                                                label="Layout Algorithm"
                                                onChange={(e) => setLayoutName(e.target.value)}
                                            >
                                                <MenuItem value="cose-bilkent">Cose-Bilkent</MenuItem>
                                                <MenuItem value="circle">Circle</MenuItem>
                                                <MenuItem value="grid">Grid</MenuItem>
                                                <MenuItem value="random">Random</MenuItem>
                                                <MenuItem value="concentric">Concentric</MenuItem>
                                            </Select>
                                        </FormControl>

                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={showLabels}
                                                    onChange={(e) => setShowLabels(e.target.checked)}
                                                    size="small"
                                                />
                                            }
                                            label="Show Labels"
                                            sx={{ mb: 1 }}
                                        />

                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={showLegend}
                                                    onChange={(e) => setShowLegend(e.target.checked)}
                                                    size="small"
                                                />
                                            }
                                            label="Show Legend"
                                        />
                                    </CardContent>
                                </Card>

                                {/* Network Stats */}
                                {networkStats.totalNodes > 0 && (
                                    <Card sx={{ mt: 2 }}>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom>
                                                Network Statistics
                                            </Typography>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <Typography variant="body2">Nodes:</Typography>
                                                    <Typography variant="body2">{networkStats.totalNodes}</Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <Typography variant="body2">Edges:</Typography>
                                                    <Typography variant="body2">{networkStats.totalEdges}</Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <Typography variant="body2">Experimental:</Typography>
                                                    <Typography variant="body2" color="primary">{networkStats.experimentalEdges}</Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <Typography variant="body2">Predicted:</Typography>
                                                    <Typography variant="body2" sx={{ color: '#f57c00' }}>{networkStats.predictedEdges}</Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <Typography variant="body2">Genes:</Typography>
                                                    <Typography variant="body2">{networkStats.uniqueGenes}</Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <Typography variant="body2">Proteins:</Typography>
                                                    <Typography variant="body2">{networkStats.uniqueProteins}</Typography>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                )}
                            </Grid>

                            {/* Network Visualization */}
                            <Grid item xs={12} lg={9}>
                                <Card>
                                    <CardContent sx={{ p: 1 }}>
                                        {/* Toolbar */}
                                        <Box sx={{ display: 'flex', gap: 1, mb: 1, p: 1 }}>
                                            <Tooltip title="Zoom In">
                                                <IconButton onClick={handleZoomIn} size="small">
                                                    <ZoomIn />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Zoom Out">
                                                <IconButton onClick={handleZoomOut} size="small">
                                                    <ZoomOut />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Reset View">
                                                <IconButton onClick={handleResetView} size="small">
                                                    <CenterFocusStrong />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Re-layout">
                                                <IconButton onClick={handleRelayout} size="small">
                                                    <Refresh />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Download Image">
                                                <IconButton onClick={handleDownload} size="small">
                                                    <Download />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>

                                        {/* Network Container */}
                                        <Box
                                            ref={containerRef}
                                            sx={{
                                                width: '100%',
                                                height: '70vh',
                                                border: '1px solid #ddd',
                                                borderRadius: 1,
                                                position: 'relative',
                                                backgroundColor: '#fafafa',
                                            }}
                                        >
                                            {networkData.nodes.length === 0 && !isBuilding && (
                                                <Box
                                                    sx={{
                                                        position: 'absolute',
                                                        top: '50%',
                                                        left: '50%',
                                                        transform: 'translate(-50%, -50%)',
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    <Typography variant="h6" color="text.secondary" gutterBottom>
                                                        No Network Data
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Search for genes, proteins, or exons to build a network
                                                    </Typography>
                                                </Box>
                                            )}
                                        </Box>

                                        {/* Legend */}
                                        {showLegend && networkData.edges.length > 0 && (
                                            <Paper sx={{ p: 2, mt: 1 }}>
                                                <Typography variant="subtitle2" gutterBottom>
                                                    Legend
                                                </Typography>
                                                <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Box
                                                            sx={{
                                                                width: 20,
                                                                height: 3,
                                                                backgroundColor: '#1976d2',
                                                            }}
                                                        />
                                                        <Typography variant="body2">Experimental</Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Box
                                                            sx={{
                                                                width: 20,
                                                                height: 3,
                                                                backgroundColor: '#f57c00',
                                                            }}
                                                        />
                                                        <Typography variant="body2">Predicted</Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Box
                                                            sx={{
                                                                width: 15,
                                                                height: 15,
                                                                borderRadius: '50%',
                                                                backgroundColor: '#666',
                                                                border: '2px solid #333',
                                                            }}
                                                        />
                                                        <Typography variant="body2">Exon (colored by gene)</Typography>
                                                    </Box>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Edge thickness = confidence/jaccard score
                                                    </Typography>
                                                </Box>
                                            </Paper>
                                        )}
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </motion.div>
                </Box>
            </Container>
            <FooterComponent />
        </>
    );
};

export default NetworkVisualizationPage;