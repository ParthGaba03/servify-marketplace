import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Container, TextField } from '@mui/material';

function Home() {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/providers?search=${searchTerm.trim()}`);
        }
    };

    return (
        <Box>
            <Container maxWidth="sm" sx={{ textAlign: 'center', py: { xs: 4, md: 8 } }}>
                <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Find Trusted Professionals
                </Typography>
                <Typography variant="h5" color="text.secondary" paragraph>
                    Your one-stop solution for finding reliable local service experts.
                </Typography>

                {/* Search Form */}
                <Box component="form" onSubmit={handleSearch} sx={{ mt: 4, display: 'flex' }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="What service do you need today?"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button type="submit" variant="contained" size="large" sx={{ ml: 1 }}>
                        Search
                    </Button>
                </Box>
            </Container>
        </Box>
    );
}
export default Home;