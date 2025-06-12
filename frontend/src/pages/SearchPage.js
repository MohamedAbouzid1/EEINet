import React, { useState, useEffect, useCallback } from 'react';
import {
    Container,
    Typography,
    Box,
    TextField,
    InputAdornment,
    Paper,
    Button,
    Grid,
    Card,
    CardContent,
    Chip,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Pagination,
    CircularProgress,
    Alert,
    Autocomplete,
} from '@mui/material';
import {
    Search as SearchIcon,
    Clear,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, Link } from 'react-router-dom';
import { searchAPI } from '../services/api';
import { motion } from 'framer-motion';
import { debounce } from 'lodash';

const SearchPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [query, setQuery] = useState(searchParams.get('q') || '');
    const [searchType, setSearchType] = useState(searchParams.get('type') || 'any');
    const [page, setPage] = useState(parseInt(searchParams.get('page') || '1'));
    const [suggestions, setSuggestions] = useState([]);
    const limit = 20;

    // Search query
    const {
        data: searchResults,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ['search', query, searchType, page],
        queryFn: () =>
            searchAPI.search(query, searchType, limit, (page - 1) * limit),
        enabled: !!query,
    });

    // Memoized debounced function to fix useEffect dependency
    const debouncedGetSuggestions = useCallback(
        debounce(async (inputValue) => {
            if (inputValue.length >= 2) {
                try {
                    const result = await searchAPI.getSuggestions(inputValue, 10);
                    setSuggestions(result.data.suggestions || []);
                } catch (error) {
                    console.error('Failed to get suggestions:', error);
                    setSuggestions([]);
                }
            } else {
                setSuggestions([]);
            }
        }, 300),
        []
    );

    useEffect(() => {
        debouncedGetSuggestions(query);
        return () => debouncedGetSuggestions.cancel();
    }, [query, debouncedGetSuggestions]);

    useEffect(() => {
        const params = new URLSearchParams();
        if (query) params.set('q', query);
        if (searchType !== 'any') params.set('type', searchType);
        if (page > 1) params.set('page', page.toString());
        setSearchParams(params);
    }, [query, searchType, page, setSearchParams]);

    const handleSearch = (newQuery = query) => {
        if (newQuery.trim()) {
            setQuery(newQuery.trim());
            setPage(1);
            refetch();
        }
    };

    const handleClear = () => {
        setQuery('');
        setSearchType('any');
        setPage(1);
        setSuggestions([]);
    };

    const totalPages = searchResults?.data?.pagination?.hasMore
        ? page + 1
        : page;

    return (
        <Container maxWidth="lg">
            <Box sx={{ py: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Search EEI Database
                </Typography>

                {/* Search Form */}
                <Paper sx={{ p: 3, mb: 4 }}>
                    <Grid container spacing={3} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <Autocomplete
                                freeSolo
                                options={suggestions}
                                getOptionLabel={(option) =>
                                    typeof option === 'string' ? option : option.value
                                }
                                renderOption={(props, option) => (
                                    <Box component="li" {...props}>
                                        <Box>
                                            <Typography variant="body2">
                                                {option.value}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {option.type}
                                            </Typography>
                                        </Box>
                                    </Box>
                                )}
                                inputValue={query}
                                onInputChange={(event, newInputValue) => {
                                    setQuery(newInputValue);
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        fullWidth
                                        placeholder="Enter exon ID, protein ID, or gene symbol"
                                        InputProps={{
                                            ...params.InputProps,
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <SearchIcon />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <FormControl fullWidth>
                                <InputLabel>Search Type</InputLabel>
                                <Select
                                    value={searchType}
                                    label="Search Type"
                                    onChange={(e) => setSearchType(e.target.value)}
                                >
                                    <MenuItem value="any">Any</MenuItem>
                                    <MenuItem value="exon">Exon</MenuItem>
                                    <MenuItem value="protein">Protein</MenuItem>
                                    <MenuItem value="gene">Gene</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button
                                    variant="contained"
                                    onClick={() => handleSearch()}
                                    disabled={!query.trim()}
                                    fullWidth
                                >
                                    Search
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={handleClear}
                                    startIcon={<Clear />}
                                >
                                    Clear
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Search Results */}
                {isLoading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress />
                    </Box>
                )}

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        Error searching: {error.message}
                    </Alert>
                )}

                {searchResults && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Search Results
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Found {searchResults.data.results.length} interactions
                                {searchResults.data.pagination.hasMore && ' (showing first page)'}
                            </Typography>
                        </Box>

                        <Grid container spacing={2}>
                            {searchResults.data.results.map((result) => (
                                <Grid item xs={12} key={result.eei_id}>
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Card sx={{ '&:hover': { boxShadow: 4 } }}>
                                            <CardContent>
                                                <Box sx={{ display: 'flex', justifyContent: 'between', alignItems: 'start', mb: 2 }}>
                                                    <Box sx={{ flexGrow: 1 }}>
                                                        <Typography variant="h6" gutterBottom>
                                                            EEI #{result.eei_id}
                                                        </Typography>
                                                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                                                            <Box>
                                                                <Typography variant="caption" color="text.secondary">
                                                                    Exon 1:
                                                                </Typography>
                                                                <Button
                                                                    component={Link}
                                                                    to={`/exon/${result.exon1}`}
                                                                    variant="outlined"
                                                                    size="small"
                                                                    sx={{ ml: 1 }}
                                                                >
                                                                    {result.exon1}
                                                                </Button>
                                                            </Box>
                                                            <Box>
                                                                <Typography variant="caption" color="text.secondary">
                                                                    Exon 2:
                                                                </Typography>
                                                                <Button
                                                                    component={Link}
                                                                    to={`/exon/${result.exon2}`}
                                                                    variant="outlined"
                                                                    size="small"
                                                                    sx={{ ml: 1 }}
                                                                >
                                                                    {result.exon2}
                                                                </Button>
                                                            </Box>
                                                        </Box>
                                                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                                                            <Box>
                                                                <Typography variant="caption" color="text.secondary">
                                                                    Protein 1:
                                                                </Typography>
                                                                <Button
                                                                    component={Link}
                                                                    to={`/protein/${result.protein1}`}
                                                                    variant="text"
                                                                    size="small"
                                                                    sx={{ ml: 1 }}
                                                                >
                                                                    {result.protein1}
                                                                </Button>
                                                            </Box>
                                                            <Box>
                                                                <Typography variant="caption" color="text.secondary">
                                                                    Protein 2:
                                                                </Typography>
                                                                <Button
                                                                    component={Link}
                                                                    to={`/protein/${result.protein2}`}
                                                                    variant="text"
                                                                    size="small"
                                                                    sx={{ ml: 1 }}
                                                                >
                                                                    {result.protein2}
                                                                </Button>
                                                            </Box>
                                                        </Box>
                                                    </Box>
                                                    <Box sx={{ textAlign: 'right' }}>
                                                        <Chip
                                                            label={result.method_name}
                                                            color={result.method_type === 'experimental' ? 'primary' : 'secondary'}
                                                            size="small"
                                                            sx={{ mb: 1 }}
                                                        />
                                                        {result.confidence && (
                                                            <Typography variant="caption" display="block" color="text.secondary">
                                                                Confidence: {(result.confidence * 100).toFixed(1)}%
                                                            </Typography>
                                                        )}
                                                        {result.jaccard_percent && (
                                                            <Typography variant="caption" display="block" color="text.secondary">
                                                                Jaccard: {result.jaccard_percent}%
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                </Box>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                                        {result.pdb_id && (
                                                            <Chip label={`PDB: ${result.pdb_id}`} variant="outlined" size="small" />
                                                        )}
                                                        {result.gene1 && (
                                                            <Chip label={`Gene: ${result.gene1}`} variant="outlined" size="small" />
                                                        )}
                                                    </Box>
                                                    <Button
                                                        component={Link}
                                                        to={`/interaction/${result.eei_id}`}
                                                        variant="contained"
                                                        size="small"
                                                    >
                                                        View Details
                                                    </Button>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </Grid>
                            ))}
                        </Grid>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                                <Pagination
                                    count={totalPages}
                                    page={page}
                                    onChange={(event, newPage) => setPage(newPage)}
                                    color="primary"
                                />
                            </Box>
                        )}
                    </motion.div>
                )}

                {searchResults && searchResults.data.results.length === 0 && (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                        <Typography variant="h6" gutterBottom>
                            No results found
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                            Try adjusting your search terms or search type
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Typography variant="body2" color="text.secondary">
                                Try searching for:
                            </Typography>
                            {['ENSE00001126122', 'TP53', 'BRCA1', 'P53'].map((term) => (
                                <Chip
                                    key={term}
                                    label={term}
                                    onClick={() => handleSearch(term)}
                                    variant="outlined"
                                    size="small"
                                    clickable
                                />
                            ))}
                        </Box>
                    </Box>
                )}
            </Box>
        </Container>
    );
};

export default SearchPage;