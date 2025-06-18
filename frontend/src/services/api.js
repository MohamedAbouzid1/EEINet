import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        // Add any auth headers here if needed
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        console.error('API Error:', error);
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw new Error(error.message || 'An error occurred');
    }
);

// API methods
export const searchAPI = {
    search: (query, type = 'any', limit = 50, offset = 0) =>
        api.get('/search', { params: { q: query, type, limit, offset } }),

    getSuggestions: (query, limit = 10) =>
        api.get('/search/suggestions', { params: { q: query, limit } }),
};

export const exonAPI = {
    getExon: (exonId) => api.get(`/exon/${exonId}`),
    getExonInteractions: (exonId, params = {}) =>
        api.get(`/exon/${exonId}/interactions`, { params }),
    getExonDetailedInteractions: (exonId, params = {}) =>
        api.get(`/exon/${exonId}/interactions/detailed`, { params }),
};

export const proteinAPI = {
    getProtein: (proteinId) => api.get(`/protein/${proteinId}`),
    getProteinExons: (proteinId, params = {}) =>
        api.get(`/protein/${proteinId}/exons`, { params }),
    getProteinInteractions: (proteinId, params = {}) =>
        api.get(`/protein/${proteinId}/interactions`, { params }),
};

export const interactionAPI = {
    getExperimental: (params = {}) =>
        api.get('/interactions/experimental', { params }),

    getPredicted: (params = {}) =>
        api.get('/interactions/predicted', { params }),

    getInteraction: (interactionId) =>
        api.get(`/interactions/${interactionId}`),
};

export const statsAPI = {
    getSummary: () => api.get('/stats/summary'),
    getDistributions: () => api.get('/stats/distributions'),
    getConfidence: () => api.get('/stats/confidence'),
};

export const exportAPI = {
    exportInteractions: (params = {}) =>
        api.get('/export/interactions', {
            params,
            responseType: params.format === 'json' ? 'json' : 'blob'
        }),
};

export default api;