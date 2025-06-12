import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

// Components
import Navbar from './components/layout/Navbar';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import ExonDetailsPage from './pages/ExonDetailsPage';
import ProteinDetailsPage from './pages/ProteinDetailsPage';
//import InteractionDetailsPage from './pages/InteractionDetailsPage';
import StatisticsPage from './pages/StatisticsPage';
//import NetworkVisualizationPage from './pages/NetworkVisualizationPage';
import ExportPage from './pages/ExportPage';
import AboutPage from './pages/AboutPage';
import HelpPage from './pages/HelpPage';

// Create theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e',
      light: '#ff6090',
      dark: '#9a0036',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderRadius: 12,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
  },
});

// Create query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <Box component="main" sx={{ flexGrow: 1, mt: 8 }}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/exon/:exonId" element={<ExonDetailsPage />} />
                <Route path="/protein/:proteinId" element={<ProteinDetailsPage />} />
                {/*<Route path="/interaction/:interactionId" element={<InteractionDetailsPage />} />*/}
                <Route path="/statistics" element={<StatisticsPage />} />
                {/*<Route path="/network" element={<NetworkVisualizationPage />} />*/}
                <Route path="/export" element={<ExportPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/help" element={<HelpPage />} />
              </Routes>
            </Box>
          </Box>
        </Router>
        <Toaster position="top-right" />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;