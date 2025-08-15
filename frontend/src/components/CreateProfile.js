import React, { useState, useContext } from 'react'; // 1. Import useContext
import useAxios from '../utils/useAxios';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext'; // 2. Import AuthContext

// MUI Imports
import { Container, Box, Typography, TextField, Button, Paper } from '@mui/material';

function CreateProfile() {
    const [formData, setFormData] = useState({
        bio: '',
        city: '',
        phone_number: '',
        latitude: '',
        longitude: '',
    });
    const api = useAxios();
    const navigate = useNavigate();
    const { fetchUserDetails } = useContext(AuthContext); // 3. Get the function from context

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/providers/profile/create/', formData);
            
            // 4. Re-fetch user details after creating the profile
            const token = JSON.parse(localStorage.getItem('authTokens')).access;
            await fetchUserDetails(token);

            alert('Profile created successfully! You are now a provider.');
            navigate('/dashboard');
        } catch (error) {
            console.error('Error creating profile:', error.response?.data);
            alert('Failed to create profile. You may already have one.');
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography component="h1" variant="h5">
                        Become a Provider
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                        <TextField margin="normal" required fullWidth multiline rows={4} id="bio" label="Your Bio / Description" name="bio" value={formData.bio} onChange={handleChange} />
                        <TextField margin="normal" required fullWidth id="city" label="City" name="city" value={formData.city} onChange={handleChange} />
                        <TextField margin="normal" fullWidth name="phone_number" label="Phone Number" id="phone_number" value={formData.phone_number} onChange={handleChange} />
                        <TextField margin="normal" fullWidth name="latitude" label="Latitude (e.g., 13.3525)" type="number" id="latitude" value={formData.latitude} onChange={handleChange} />
                        <TextField margin="normal" fullWidth name="longitude" label="Longitude (e.g., 74.7825)" type="number" id="longitude" value={formData.longitude} onChange={handleChange} />
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                            Create Profile
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
}

export default CreateProfile;
