import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';

// MUI Imports - Added Rating
import { Grid, Card, CardContent, CardActions, Typography, Button, CircularProgress, Box, Rating } from '@mui/material';

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
                // Correct endpoint for your backend's router
                let apiUrl = 'https://servify-backend.onrender.com/api/providers/public-profiles/';

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
            
            <Box sx={{ display: 'flex', height: 'calc(100vh - 150px)', gap: 2 }}>
                
                <Box sx={{ width: '50%', overflowY: 'auto', pr: 1 }}>
                    {providers.length > 0 ? (
                        providers.map(provider => (
                            <Card key={provider.id} sx={{ mb: 2 }}>
                                <CardContent>
                                    <Typography variant="h5">{provider.username}</Typography>
                                    
                                    {/* --- THIS IS THE FIXED RATING SECTION --- */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
                                        <Rating value={provider.avg_rating || 0} readOnly precision={0.5} size="small" />
                                        <Typography sx={{ ml: 1, fontSize: '0.9rem' }}>
                                            ({provider.num_reviews || 0})
                                        </Typography>
                                    </Box>

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

                <Box sx={{ width: '50%', height: '100%', display: { xs: 'none', md: 'block' } }}>
                    <ProviderMap providers={providers} />
                </Box>
            </Box>
        </Box>
    );
}

export default ProviderList;
