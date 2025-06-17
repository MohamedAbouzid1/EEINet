import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    IconButton,
    Drawer,
    List,
    ListItem,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import {
    Menu as MenuIcon,
    Home,
    Search,
    BarChart,
    FileDownload,
    Info,
    Help,
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/logo_white1.png';

const Navbar = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const location = useLocation();

    const menuItems = [
        { text: 'Home', path: '/', icon: <Home /> },
        { text: 'About', path: '/about', icon: <Info /> },
        { text: 'Search', path: '/search', icon: <Search /> },
        { text: 'Statistics', path: '/statistics', icon: <BarChart /> },
        { text: 'Export', path: '/export', icon: <FileDownload /> },
        { text: 'Help', path: '/help', icon: <Help /> },
    ];

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const drawer = (
        <Box
            onClick={handleDrawerToggle}
            sx={{
                textAlign: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                height: '100%',
                color: 'white'
            }}
        >
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                py: 3,
                borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}>
                <img
                    src={logo}
                    alt="EEI Network"
                    style={{
                        width: '40px',
                        height: '40px',
                        marginRight: '12px',
                        filter: 'brightness(0) invert(1)'
                    }}
                />
                <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: '0.5px' }}>
                    EEINet
                </Typography>
            </Box>
            <List sx={{ pt: 2 }}>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                        <Button
                            component={Link}
                            to={item.path}
                            fullWidth
                            startIcon={item.icon}
                            sx={{
                                justifyContent: 'flex-start',
                                px: 3,
                                py: 2,
                                mx: 2,
                                borderRadius: 2,
                                color: 'white',
                                backgroundColor: location.pathname === item.path
                                    ? 'rgba(255,255,255,0.2)'
                                    : 'transparent',
                                backdropFilter: location.pathname === item.path
                                    ? 'blur(10px)'
                                    : 'none',
                                border: location.pathname === item.path
                                    ? '1px solid rgba(255,255,255,0.3)'
                                    : '1px solid transparent',
                                fontWeight: location.pathname === item.path ? 700 : 500,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    backgroundColor: 'rgba(255,255,255,0.15)',
                                    backdropFilter: 'blur(10px)',
                                    transform: 'translateX(8px)',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                },
                                '& .MuiButton-startIcon': {
                                    color: location.pathname === item.path
                                        ? 'white'
                                        : 'rgba(255,255,255,0.8)',
                                }
                            }}
                        >
                            {item.text}
                        </Button>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <>
            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                }}
            >
                <Toolbar sx={{ minHeight: '70px' }}>
                    {isMobile && (
                        <IconButton
                            color="primary"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{
                                mr: 2,
                                backgroundColor: 'rgba(103, 126, 234, 0.1)',
                                '&:hover': {
                                    backgroundColor: 'rgba(103, 126, 234, 0.2)',
                                    transform: 'scale(1.05)',
                                },
                                transition: 'all 0.2s ease',
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}

                    <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            borderRadius: 3,
                            px: 2,
                            py: 1,
                            mr: 2,
                            boxShadow: '0 4px 15px rgba(103, 126, 234, 0.3)',
                        }}>
                            <img
                                src={logo}
                                alt="EEI Network"
                                style={{
                                    width: '35px',
                                    height: '35px',
                                    marginRight: '8px',
                                    filter: 'brightness(0) invert(1)'
                                }}
                            />
                            <Typography
                                variant="h6"
                                component={Link}
                                to="/"
                                sx={{
                                    textDecoration: 'none',
                                    color: 'white',
                                    fontWeight: 700,
                                    letterSpacing: '0.5px',
                                    '&:hover': {
                                        transform: 'scale(1.02)',
                                    },
                                    transition: 'transform 0.2s ease',
                                }}
                            >
                                EEINet
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
                        {menuItems.map((item) => (
                            <Button
                                key={item.text}
                                component={Link}
                                to={item.path}
                                startIcon={item.icon}
                                sx={{
                                    px: 3,
                                    py: 1.5,
                                    borderRadius: 3,
                                    color: location.pathname === item.path
                                        ? 'white'
                                        : theme.palette.text.primary,
                                    backgroundColor: location.pathname === item.path
                                        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                        : 'transparent',
                                    background: location.pathname === item.path
                                        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                        : 'transparent',
                                    fontWeight: location.pathname === item.path ? 700 : 500,
                                    boxShadow: location.pathname === item.path
                                        ? '0 4px 15px rgba(103, 126, 234, 0.3)'
                                        : 'none',
                                    border: location.pathname === item.path
                                        ? 'none'
                                        : '1px solid rgba(103, 126, 234, 0.2)',
                                    transition: 'all 0.3s ease',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    '&:hover': {
                                        backgroundColor: location.pathname === item.path
                                            ? 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
                                            : 'rgba(103, 126, 234, 0.1)',
                                        transform: 'translateY(-2px)',
                                        boxShadow: location.pathname === item.path
                                            ? '0 6px 20px rgba(103, 126, 234, 0.4)'
                                            : '0 4px 15px rgba(103, 126, 234, 0.2)',
                                        border: location.pathname === item.path
                                            ? 'none'
                                            : '1px solid rgba(103, 126, 234, 0.3)',
                                    },
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: 0,
                                        left: '-100%',
                                        width: '100%',
                                        height: '100%',
                                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                                        transition: 'left 0.5s',
                                    },
                                    '&:hover::before': {
                                        left: '100%',
                                    },
                                    '& .MuiButton-startIcon': {
                                        color: location.pathname === item.path
                                            ? 'white'
                                            : theme.palette.primary.main,
                                    }
                                }}
                            >
                                {item.text}
                            </Button>
                        ))}
                    </Box>
                </Toolbar>
            </AppBar>

            <Drawer
                variant="temporary"
                anchor="left"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true,
                }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: 280,
                        border: 'none',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                    },
                }}
            >
                {drawer}
            </Drawer>
        </>
    );
};

export default Navbar;