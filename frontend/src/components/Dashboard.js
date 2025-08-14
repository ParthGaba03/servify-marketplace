import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

// MUI Imports
import { Box, Typography, Button, Paper, Divider, CircularProgress } from '@mui/material';

function Dashboard() {
    const { user } = useContext(AuthContext);

    if (!user) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    }

    return (
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                {user.username}'s Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
                Welcome! This is your central hub to manage your activities on Servify.
            </Typography>
            
            <Divider sx={{ my: 3 }} />

            {/* This Box now uses flexbox and 'gap' to create space */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {user.is_provider ? (
                    // Links for Providers
                    <>
                        <Button component={Link} to="/my-profile" variant="contained">
                            View/Edit Profile
                        </Button>
                        <Button component={Link} to="/manage-services" variant="contained">
                            Manage Services
                        </Button>
                        <Button component={Link} to="/provider/bookings" variant="contained">
                            View Received Bookings
                        </Button>
                    </>
                ) : (
                    // Links for Customers
                    <>
                        <Button component={Link} to="/my-bookings" variant="contained">
                            My Bookings
                        </Button>
                        <Button component={Link} to="/create-profile" variant="outlined">
                            Become a Provider
                        </Button>
                    </>
                )}
            </Box>
        </Paper>
    );
}
export default Dashboard;
