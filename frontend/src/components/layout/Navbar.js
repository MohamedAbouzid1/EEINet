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
    ListItemIcon,
    ListItemText,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import {
    Menu as MenuIcon,
    Home,
    Search,
    BarChart,
    AccountTree,
    FileDownload,
    Science,
    Info,
    Help,
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const location = useLocation();

    const menuItems = [
        { text: 'Home', path: '/', icon: <Home /> },
        { text: 'Search', path: '/search', icon: <Search /> },
        { text: 'Statistics', path: '/statistics', icon: <BarChart /> },
        { text: 'Network', path: '/network', icon: <AccountTree /> },
        { text: 'Export', path: '/export', icon: <FileDownload /> },
        { text: 'About', path: '/about', icon: <Info /> },
        { text: 'Help', path: '/help', icon: <Help /> },
    ];

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ my: 2 }}>
                EEI Network
            </Typography>
            <List>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemIcon sx={{ minWidth: 40 }}>
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText>
                            <Button
                                component={Link}
                                to={item.path}
                                color={location.pathname === item.path ? 'primary' : 'inherit'}
                                sx={{ justifyContent: 'flex-start', width: '100%' }}
                            >
                                {item.text}
                            </Button>
                        </ListItemText>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <>
            <AppBar position="fixed" elevation={2}>
                <Toolbar>
                    {isMobile && (
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}

                    <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                        <Science sx={{ mr: 1 }} />
                        <Typography
                            variant="h6"
                            component={Link}
                            to="/"
                            sx={{
                                textDecoration: 'none',
                                color: 'inherit',
                                fontWeight: 600,
                            }}
                        >
                            EEINet
                        </Typography>
                    </Box>

                    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                        {menuItems.map((item) => (
                            <Button
                                key={item.text}
                                component={Link}
                                to={item.path}
                                color={location.pathname === item.path ? 'secondary' : 'inherit'}
                                startIcon={item.icon}
                                sx={{ ml: 1 }}
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
                    keepMounted: true, // Better open performance on mobile.
                }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
                }}
            >
                {drawer}
            </Drawer>
        </>
    );
};

export default Navbar;