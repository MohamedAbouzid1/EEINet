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

    // Create debounced function outside of useCallback
    const getSuggestions = async (inputValue) => {
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
    };

    // Memoize the debounced function
    const debouncedGetSuggestions = useCallback(
        debounce(getSuggestions, 300),
        [] // Empty dependency array since getSuggestions is stable
    );

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
                    <Grid container spacing={3} alignItems="center" justifyContent="center">
                        <Grid item xs={12} md={10} sx={{ display: 'flex', justifyContent: 'center' }}>
                            <FormControl sx={{ minWidth: 300 }}>
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
                                            placeholder="Enter exon, protein, or gene symbol"
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
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <FormControl fullWidth sx={{ minWidth: 120 }}>
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
                        <Grid item xs={12} md={1}>
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                <Button
                                    variant="contained"
                                    onClick={() => handleSearch()}
                                    disabled={!query.trim()}
                                    fullWidth
                                    size="medium"
                                    sx={{
                                        py: 1.5,
                                        fontSize: 18
                                    }}
                                >
                                    Search
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={handleClear}
                                    startIcon={<Clear />}
                                    fullWidth
                                    size="medium"
                                    sx={{
                                        py: 1.5,
                                        fontSize: 18
                                    }}
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
                            {searchResults.data.pagination && typeof searchResults.data.pagination.total === 'number' && searchResults.data.pagination.total > 0 && (
                                <Typography variant="body2" color="text.secondary">
                                    {(() => {
                                        const total = searchResults.data.pagination.total;
                                        const from = (page - 1) * limit + 1;
                                        const to = Math.min(page * limit, total);
                                        return `Showing ${from}–${to} of ${total} results`;
                                    })()}
                                </Typography>
                            )}
                        </Box>

                        <Grid container spacing={3}>
                            {searchResults.data.results.map((result) => (
                                <Grid item xs={12} sm={6} lg={4} key={result.eei_id}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Card sx={{
                                            '&:hover': { boxShadow: 6 },
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            minHeight: '320px'
                                        }}>
                                            <CardContent sx={{
                                                flexGrow: 1,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                p: 3
                                            }}>
                                                {/* Header with EEI ID and Methods */}
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                                                    <Typography variant="h6" sx={{ fontSize: '1.3rem', fontWeight: 600 }}>
                                                        EEI #{result.eei_id}
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                                                        {result.method_names && result.method_names.length > 0 ? (
                                                            result.method_names.map((method, index) => (
                                                                <Chip
                                                                    key={index}
                                                                    label={method}
                                                                    color={result.method_type === 'experimental' ? 'primary' : 'secondary'}
                                                                    size="small"
                                                                    variant="filled"
                                                                    sx={{ fontSize: '0.8rem', height: '24px' }}
                                                                />
                                                            ))
                                                        ) : (
                                                            <Chip
                                                                label={result.method_name}
                                                                color={result.method_type === 'experimental' ? 'primary' : 'secondary'}
                                                                size="small"
                                                                sx={{ fontSize: '0.8rem', height: '24px' }}
                                                            />
                                                        )}
                                                    </Box>
                                                </Box>

                                                {/* Exon Information */}
                                                <Box sx={{ mb: 3 }}>
                                                    <Box sx={{ display: 'flex', gap: 1, mb: 1.5, alignItems: 'center' }}>
                                                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9rem', minWidth: '60px', fontWeight: 500 }}>
                                                            Exon 1:
                                                        </Typography>
                                                        <Button
                                                            component={Link}
                                                            to={`/exon/${result.exon1}`}
                                                            variant="outlined"
                                                            size="small"
                                                            sx={{ fontSize: '0.85rem', px: 1.5, py: 0.5, minHeight: '28px' }}
                                                        >
                                                            {result.exon1}
                                                        </Button>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9rem', minWidth: '60px', fontWeight: 500 }}>
                                                            Exon 2:
                                                        </Typography>
                                                        <Button
                                                            component={Link}
                                                            to={`/exon/${result.exon2}`}
                                                            variant="outlined"
                                                            size="small"
                                                            sx={{ fontSize: '0.85rem', px: 1.5, py: 0.5, minHeight: '28px' }}
                                                        >
                                                            {result.exon2}
                                                        </Button>
                                                    </Box>
                                                </Box>

                                                {/* Protein Information */}
                                                <Box sx={{ mb: 3 }}>
                                                    <Box sx={{ display: 'flex', gap: 1, mb: 1.5, alignItems: 'center' }}>
                                                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9rem', minWidth: '60px', fontWeight: 500 }}>
                                                            Protein 1:
                                                        </Typography>
                                                        <Button
                                                            component={Link}
                                                            to={`/protein/${result.protein1}`}
                                                            variant="text"
                                                            size="small"
                                                            sx={{ fontSize: '0.85rem', px: 1.5, py: 0.5, minHeight: '28px' }}
                                                        >
                                                            {result.protein1}
                                                        </Button>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9rem', minWidth: '60px', fontWeight: 500 }}>
                                                            Protein 2:
                                                        </Typography>
                                                        <Button
                                                            component={Link}
                                                            to={`/protein/${result.protein2}`}
                                                            variant="text"
                                                            size="small"
                                                            sx={{ fontSize: '0.85rem', px: 1.5, py: 0.5, minHeight: '28px' }}
                                                        >
                                                            {result.protein2}
                                                        </Button>
                                                    </Box>
                                                </Box>

                                                {/* Additional Info Chips - Fixed Height Container */}
                                                <Box sx={{
                                                    flexGrow: 1,
                                                    mb: 3,
                                                    minHeight: '60px',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    justifyContent: 'flex-start'
                                                }}>
                                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                        {result.pdb_ids && result.pdb_ids.length > 0 ? (
                                                            result.pdb_ids.map((pdbId, index) => (
                                                                <Chip
                                                                    key={index}
                                                                    label={`PDB: ${pdbId}`}
                                                                    variant="outlined"
                                                                    size="small"
                                                                    sx={{ fontSize: '0.8rem', height: '26px' }}
                                                                />
                                                            ))
                                                        ) : result.pdb_id && (
                                                            <Chip
                                                                label={`PDB: ${result.pdb_id}`}
                                                                variant="outlined"
                                                                size="small"
                                                                sx={{ fontSize: '0.8rem', height: '26px' }}
                                                            />
                                                        )}
                                                        {result.gene1 && (
                                                            <Chip
                                                                label={`Gene 1: ${result.gene1}`}
                                                                variant="outlined"
                                                                size="small"
                                                                sx={{ fontSize: '0.8rem', height: '26px' }}
                                                            />
                                                        )}
                                                        {result.gene2 && (
                                                            <Chip
                                                                label={`Gene 2: ${result.gene2}`}
                                                                variant="outlined"
                                                                size="small"
                                                                sx={{ fontSize: '0.8rem', height: '26px' }}
                                                            />
                                                        )}
                                                    </Box>
                                                </Box>

                                                {/* View Details Button */}
                                                <Box sx={{ mt: 'auto' }}>
                                                    <Button
                                                        component={Link}
                                                        to={`/interaction/${result.eei_id}`}
                                                        variant="contained"
                                                        size="medium"
                                                        fullWidth
                                                        sx={{ fontSize: '0.9rem', py: 1.25, fontWeight: 600 }}
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
                            {['ENSE00001126122', 'PSMB6', 'P28072'].map((term) => (
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