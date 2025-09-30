import React from 'react';
import {
    Box,
    Container,
    Typography,
    Link,
    Divider,
    Grid,
    IconButton,
} from '@mui/material';
import {
    X,
    GitHub,
    Web,
    LinkedIn,
} from '@mui/icons-material';
import logo from '../../assets/logo_colored.png';

const FooterComponent = () => {
    return (
        <Box
            component="footer"
            sx={{
                backgroundColor: 'white',
                borderTop: '1px solid #e2e8f0',
                py: 4,
                mt: 'auto',
            }}
        >
            <Container maxWidth="lg">
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: 4,
                    }}
                >
                    {/* Logo Section */}
                    <Box
                        component={Link}
                        href="https://apps.cosy.bio/eeinet/"
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: { xs: 'center', md: 'flex-start' },
                            textDecoration: 'none',
                            color: 'inherit',
                            '&:hover': {
                                textDecoration: 'none',
                            },
                        }}
                    >
                        <Box
                            component="img"
                            src={logo}
                            alt="EEINet Logo"
                            sx={{
                                width: 128,
                                height: 128,
                                mb: 2,
                                objectFit: 'contain',
                            }}
                        />
                        <Typography
                            variant="h4"
                            component="span"
                            sx={{
                                fontWeight: 600,
                                color: 'text.primary',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            EEINet
                        </Typography>
                    </Box>

                    {/* Imprint Section */}
                    <Box sx={{ textAlign: { xs: 'center', md: 'right' } }}>
                        <Typography
                            variant="h6"
                            component="h2"
                            sx={{
                                mb: 2,
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                textTransform: 'uppercase',
                                color: 'text.primary',
                            }}
                        >
                            Imprint
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" paragraph sx={{ mb: 0.5 }}>
                                Prof. Dr. Jan Baumbach
                            </Typography>
                            <Typography variant="body2" paragraph sx={{ mb: 0.5 }}>
                                Chair of Computational Systems Biology
                            </Typography>
                            <Typography variant="body2" paragraph sx={{ mb: 0.5 }}>
                                Phone: +49-40-42838-7313
                            </Typography>
                            <Typography variant="body2" paragraph sx={{ mb: 0.5 }}>
                                E-Mail:{' '}
                                <Link
                                    href="mailto:cosy[at)zbh.uni-hamburg.de"
                                    sx={{
                                        color: 'text.secondary',
                                        textDecoration: 'none',
                                        '&:hover': {
                                            textDecoration: 'underline',
                                            color: 'text.primary',
                                        },
                                    }}
                                >
                                    cosy[at)zbh.uni-hamburg.de
                                </Link>
                            </Typography>
                            <Typography variant="body2" paragraph sx={{ mb: 0.5 }}>
                                Address: Prof. Dr. Jan Baumbach
                            </Typography>
                            <Typography variant="body2" paragraph sx={{ mb: 0.5 }}>
                                University of Hamburg
                            </Typography>
                            <Typography variant="body2" paragraph sx={{ mb: 0.5 }}>
                                Notkestraße 9
                            </Typography>
                            <Typography variant="body2" paragraph sx={{ mb: 0 }}>
                                22607 Hamburg, Germany
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Bottom Section */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 2,
                    }}
                >
                    {/* Copyright */}
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ textAlign: { xs: 'center', sm: 'left' } }}
                    >
                        © {new Date().getFullYear()}{' '}
                        <Link
                            href="#"
                            sx={{
                                color: 'text.secondary',
                                textDecoration: 'none',
                                '&:hover': {
                                    textDecoration: 'underline',
                                    color: 'text.primary',
                                },
                            }}
                        >
                            EEINet
                        </Link>
                        . All Rights Reserved.
                    </Typography>

                    {/* Social Links */}
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                        }}
                    >
                        <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                            Follow us on:
                        </Typography>
                        <IconButton
                            component={Link}
                            href="https://www.linkedin.com/company/cosy-bio/"
                            target="_blank"
                            rel="noopener noreferrer"
                            size="small"
                            sx={{
                                color: 'text.secondary',
                                '&:hover': {
                                    color: 'primary.main',
                                },
                            }}
                        >
                            <LinkedIn fontSize="small" />
                        </IconButton>
                        <IconButton
                            component={Link}
                            href="https://x.com/cosybio_UHH"
                            target="_blank"
                            rel="noopener noreferrer"
                            size="small"
                            sx={{
                                color: 'text.secondary',
                                '&:hover': {
                                    color: 'primary.main',
                                },
                            }}
                        >
                            <X fontSize="small" />
                        </IconButton>
                        <IconButton
                            component={Link}
                            href="https://www.cosy.bio/"
                            target="_blank"
                            rel="noopener noreferrer"
                            size="small"
                            sx={{
                                color: 'text.secondary',
                                '&:hover': {
                                    color: 'primary.main',
                                },
                            }}
                        >
                            <Web fontSize="small" />
                        </IconButton>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default FooterComponent;