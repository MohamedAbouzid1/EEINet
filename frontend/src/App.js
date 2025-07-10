import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import InteractionDetailsPage from './pages/InteractionDetailsPage';
import StatisticsPage from './pages/StatisticsPage';
import NetworkVisualizationPage from './pages/NetworkVisualizationPage';
import ExportPage from './pages/ExportPage';
import AboutPage from './pages/AboutPage';
import HelpPage from './pages/HelpPage';
// Detection methods pages
import ContactMethodPage from './pages/ContactMethodPage';
import PisaMethodPage from './pages/PisaMethodPage';
import EppicMethodPage from './pages/EppicMethodPage';
import OrthologyMethodPage from './pages/OrthologyMethodPage';

const getBasename = () => {
  const path = window.location.pathname;
  if (path.startsWith('/eeinet')) {
    return '/eeinet';
  }
  return '';
};

// Create theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#667eea',
      light: '#8b9ff0',
      dark: '#5a6fd8',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#764ba2',
      light: '#8f5bb8',
      dark: '#6a4190',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#1a202c',
      secondary: '#4a5568',
    },
    success: {
      main: '#48bb78',
      light: '#68d391',
      dark: '#38a169',
    },
    warning: {
      main: '#ed8936',
      light: '#f6ad55',
      dark: '#dd6b20',
    },
    error: {
      main: '#f56565',
      light: '#fc8181',
      dark: '#e53e3e',
    },
    info: {
      main: '#4299e1',
      light: '#63b3ed',
      dark: '#3182ce',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      color: '#1a202c',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    h2: {
      fontWeight: 600,
      color: '#1a202c',
    },
    h3: {
      fontWeight: 600,
      color: '#1a202c',
    },
    h4: {
      fontWeight: 600,
      color: '#1a202c',
    },
    h5: {
      fontWeight: 500,
      color: '#1a202c',
    },
    h6: {
      fontWeight: 500,
      color: '#1a202c',
    },
    body1: {
      color: '#4a5568',
      lineHeight: 1.6,
    },
    body2: {
      color: '#718096',
      lineHeight: 1.5,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 20px rgba(103, 126, 234, 0.1)',
          borderRadius: 16,
          border: '1px solid rgba(103, 126, 234, 0.1)',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 8px 30px rgba(103, 126, 234, 0.15)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 24px',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 15px rgba(103, 126, 234, 0.3)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
          },
        },
        outlined: {
          borderColor: '#667eea',
          color: '#667eea',
          '&:hover': {
            backgroundColor: 'rgba(103, 126, 234, 0.1)',
            borderColor: '#5a6fd8',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#667eea',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#667eea',
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
        colorPrimary: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(103, 126, 234, 0.2)',
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: '#667eea',
          textDecoration: 'none',
          '&:hover': {
            color: '#5a6fd8',
            textDecoration: 'underline',
          },
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
        <Router basename={getBasename()}>
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <Box component="main" sx={{ flexGrow: 1, mt: 8 }}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/exon/:exonId" element={<ExonDetailsPage />} />
                <Route path="/protein/:proteinId" element={<ProteinDetailsPage />} />
                <Route path="/interaction/:interactionId" element={<InteractionDetailsPage />} />
                <Route path="/statistics" element={<StatisticsPage />} />
                <Route path="/network" element={<NetworkVisualizationPage />} />
                <Route path="/export" element={<ExportPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/help" element={<HelpPage />} />
                {/* Method explanation pages */}
                <Route path="/methods/contact" element={<ContactMethodPage />} />
                <Route path="/methods/pisa" element={<PisaMethodPage />} />
                <Route path="/methods/eppic" element={<EppicMethodPage />} />
                <Route path="/methods/orthology" element={<OrthologyMethodPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
                <Route path="" element={<Navigate to="/" replace />} />

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