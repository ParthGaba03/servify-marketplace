import React, { useState, useEffect, useCallback } from 'react';
import useAxios from '../utils/useAxios';
import { Link } from 'react-router-dom';

// MUI Imports
import { Box, Typography, Paper, CircularProgress, Button, TextField } from '@mui/material';

function MyProfile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    // Initialize formData with empty strings
    const [formData, setFormData] = useState({
        bio: '',
        city: '',
        phone_number: '',
        latitude: '',
        longitude: ''
    });
    
    const api = useAxios();

    // This function now ONLY fetches the profile data
    const fetchProfile = useCallback(async () => {
        try {
            const response = await api.get('/providers/profile/me/');
            setProfile(response.data);
        } catch (err) {
            if (err.response && err.response.status === 404) {
                setError("You haven't created a provider profile yet.");
            } else {
                setError('Failed to fetch profile data.');
                console.error(err);
            }
        } finally {
            setLoading(false);
        }
    }, [api]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // The 'response' variable was removed here as it was unused
            await api.patch('/providers/profile/me/', formData);
            // After saving, we re-fetch the profile to show the latest data
            await fetchProfile();
            setIsEditing(false);
            alert('Profile updated successfully!');
        } catch (err) {
            console.error('Error updating profile:', err.response.data);
            alert('Failed to update profile.');
        }
    };

    // THIS IS THE KEY FIX: This function runs ONLY when you click the "Edit" button
    const handleEditClick = () => {
        // We populate the form with the current profile data, ensuring no null values
        setFormData({
            bio: profile.bio || '',
            city: profile.city || '',
            phone_number: profile.phone_number || '',
            latitude: profile.latitude || '',
            longitude: profile.longitude || '',
        });
        setIsEditing(true);
    };
    
    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;

    if (error) {
        return (
            <Paper sx={{p: 4, mt: 4, textAlign: 'center'}}>
                <Typography variant="h6">{error}</Typography>
                {error.includes("haven't created") && 
                    <Button component={Link} to="/create-profile" variant="contained" sx={{mt: 2}}>
                        Create one now
                    </Button>
                }
            </Paper>
        );
    }

    return (
        <Paper sx={{ p: 4, mt: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>My Provider Profile</Typography>
            {profile && (
                isEditing ? (
                    <Box component="form" onSubmit={handleSubmit}>
                        <TextField margin="normal" fullWidth multiline rows={4} name="bio" label="Bio" value={formData.bio} onChange={handleChange} />
                        <TextField margin="normal" fullWidth name="city" label="City" value={formData.city} onChange={handleChange} />
                        <TextField margin="normal" fullWidth name="phone_number" label="Phone" value={formData.phone_number} onChange={handleChange} />
                        <TextField margin="normal" fullWidth name="latitude" label="Latitude" type="number" value={formData.latitude} onChange={handleChange} />
                        <TextField margin="normal" fullWidth name="longitude" label="Longitude" type="number" value={formData.longitude} onChange={handleChange} />

                        <Box sx={{mt: 2}}>
                            <Button type="submit" variant="contained" sx={{ mr: 1 }}>Save Changes</Button>
                            <Button variant="outlined" onClick={() => setIsEditing(false)}>Cancel</Button>
                        </Box>
                    </Box>
                ) : (
                    <Box>
                        <Typography variant="body1" paragraph><strong>Bio:</strong> {profile.bio || 'Not set'}</Typography>
                        <Typography variant="body1" paragraph><strong>City:</strong> {profile.city}</Typography>
                        <Typography variant="body1" paragraph><strong>Phone:</strong> {profile.phone_number || 'Not provided'}</Typography>
                        <Typography variant="body1" paragraph><strong>Location:</strong> {profile.latitude && profile.longitude ? `${profile.latitude}, ${profile.longitude}` : 'Not set'}</Typography>
                        <Button variant="contained" onClick={handleEditClick}>Edit Profile</Button>
                    </Box>
                )
            )}
        </Paper>
    );
}

export default MyProfile;
