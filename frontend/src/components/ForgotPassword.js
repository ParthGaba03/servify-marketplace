import React, { useState } from 'react';
import axios from 'axios';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';

// --- Using your live backend URL for the API calls ---
const API_BASE_URL = 'https://servify-backend.onrender.com/api/';

function ForgotPassword() {
    const [step, setStep] = useState(1); // 1: enter email, 2: enter new password
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_BASE_URL}users/check-email/`, { email });
            if (response.data.exists) {
                setStep(2); // Go to the next step
                setMessage('');
            } else {
                setMessage('Email not found. Please enter a registered email address.');
            }
        } catch (error) {
            setMessage('Something went wrong. Please try again.');
            console.error('Error checking email:', error.response?.data);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage('Passwords do not match.');
            return;
        }
        try {
            await axios.post(`${API_BASE_URL}users/reset-password/`, { email, new_password: newPassword });
            setMessage('Password updated successfully!');
            // Optional: navigate to login page
            // navigate('/login');
        } catch (error) {
            setMessage('Password update failed. Please try again.');
            console.error('Error updating password:', error.response?.data);
        }
    };

    return (
        <Paper sx={{ p: 4, maxWidth: 400, margin: 'auto', mt: 4 }}>
            <Typography variant="h5" gutterBottom>
                {step === 1 ? 'Forgot Password' : 'Set New Password'}
            </Typography>

            {step === 1 && (
                <Box component="form" onSubmit={handleEmailSubmit} sx={{ mt: 2 }}>
                    <TextField 
                        fullWidth 
                        label="Email Address" 
                        variant="outlined" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <Button fullWidth type="submit" variant="contained" sx={{ mt: 2 }}>
                        Next
                    </Button>
                </Box>
            )}

            {step === 2 && (
                <Box component="form" onSubmit={handlePasswordSubmit} sx={{ mt: 2 }}>
                    <TextField 
                        fullWidth 
                        label="New Password" 
                        type="password"
                        variant="outlined" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        sx={{ mb: 2 }}
                    />
                    <TextField 
                        fullWidth 
                        label="Confirm Password" 
                        type="password"
                        variant="outlined" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <Button fullWidth type="submit" variant="contained" sx={{ mt: 2 }}>
                        Save Password
                    </Button>
                </Box>
            )}

            {message && <Typography sx={{ mt: 2, color: message.includes('successfully') ? 'success.main' : 'error.main' }}>{message}</Typography>}
        </Paper>
    );
}

export default ForgotPassword;
