import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';

// MUI Imports
import { Card, CardContent, CardActions, Typography, Button, CircularProgress, Box } from '@mui/material';

// Import our Map component
import ProviderMap from './ProviderMap';

function ProviderList() {
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const fetchProviders = async () => {
            setLoading(true);
            try {
                const searchTerm = searchParams.get('search');
                let apiUrl = 'http://127.0.0.1:8000/api/providers/public-profiles/';

                if (searchTerm) {
                    apiUrl += `?search=${searchTerm}`;
                }

                const response = await axios.get(apiUrl);
                setProviders(response.data.results || response.data || []);
            } catch (error) {
                console.error('Error fetching providers:', error);
                setProviders([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProviders();
    }, [searchParams]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h4" gutterBottom component="h1">
                Our Service Providers
            </Typography>
            
            {/* Using a simple Flexbox layout */}
            <Box sx={{ display: 'flex', height: 'calc(100vh - 150px)', gap: 2 }}>
                
                {/* Left Column: Provider Cards */}
                <Box sx={{ width: '50%', overflowY: 'auto', pr: 1 }}>
                    {providers.length > 0 ? (
                        providers.map(provider => (
                            <Card key={provider.id} sx={{ mb: 2 }}>
                                <CardContent>
                                    <Typography variant="h5">{provider.username}</Typography>
                                    <Typography color="text.secondary">{provider.city}</Typography>
                                </CardContent>
                                <CardActions>
                                    <Button component={Link} to={`/providers/${provider.id}`} size="small">
                                        View Profile
                                    </Button>
                                </CardActions>
                            </Card>
                        ))
                    ) : (
                        <Typography>No providers found.</Typography>
                    )}
                </Box>

                {/* Right Column: Map */}
                <Box sx={{ width: '50%', height: '100%', display: { xs: 'none', md: 'block' } }}>
                    <ProviderMap providers={providers} />
                </Box>
            </Box>
        </Box>
    );
}

export default ProviderList;
