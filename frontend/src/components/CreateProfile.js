// frontend/src/components/CreateProfile.js
import React, { useState, useContext } from 'react';
import useAxios from '../utils/useAxios';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Container, Box, Typography, TextField, Button, Paper } from '@mui/material';

function CreateProfile() {
    const [formData, setFormData] = useState({
        bio: '', city: '', phone_number: '', latitude: '', longitude: '',
    });
    const api = useAxios();
    const navigate = useNavigate();
    const { fetchUserDetails } = useContext(AuthContext);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/providers/profile/create/', formData);
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
                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography component="h1" variant="h5">Become a Provider</Typography>
                    <TextField margin="normal" required fullWidth multiline rows={4} name="bio" label="Your Bio / Description" value={formData.bio} onChange={handleChange} />
                    <TextField margin="normal" required fullWidth name="city" label="City" value={formData.city} onChange={handleChange} />
                    <TextField margin="normal" fullWidth name="phone_number" label="Phone Number" value={formData.phone_number} onChange={handleChange} />
                    <TextField margin="normal" fullWidth name="latitude" label="Latitude (e.g., 13.3525)" type="number" value={formData.latitude} onChange={handleChange} />
                    <TextField margin="normal" fullWidth name="longitude" label="Longitude (e.g., 74.7825)" type="number" value={formData.longitude} onChange={handleChange} />
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Create Profile</Button>
                </Box>
            </Paper>
        </Container>
    );
}

export default CreateProfile;