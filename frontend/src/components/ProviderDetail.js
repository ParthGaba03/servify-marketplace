import {React, useState , useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import axios from 'axios'; // For PUBLIC data
import useAxios from '../utils/useAxios'; // For PRIVATE actions

// MUI Imports
import { Box, Typography, Paper, CircularProgress, List, ListItem, ListItemText, Divider, Button, TextField, Rating } from '@mui/material';

function ProviderDetail() {
    const [provider, setProvider] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedService, setSelectedService] = useState(null);
    const [bookingTime, setBookingTime] = useState('');

    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const api = useAxios(); // This is for private/authenticated actions

    useEffect(() => {
        const fetchProviderData = async () => {
            setLoading(true);
            try {
                // Public data is fetched with standard axios
                const providerResponse = await axios.get(`https://servify-backend.onrender.com/api/providers/public-profiles/${id}/`);
                setProvider(providerResponse.data);

                const reviewResponse = await axios.get(`https://servify-backend.onrender.com/api/reviews/provider/${id}/`);
                setReviews(reviewResponse.data);
            } catch (error) {
                console.error('Error fetching public data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProviderData();
    }, [id]);

    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            alert('You must be logged in to make a booking.');
            navigate('/login');
            return;
        }
        
        try {
            // Use the 'api' instance from useAxios for ALL authenticated requests
            const bookingResponse = await api.post('/bookings/create/', { 
                service: selectedService.id, 
                booking_time: new Date(bookingTime).toISOString() 
            });

            const bookingId = bookingResponse.data.id;

            await api.post('/bookings/mock-payment-success/', { 
                booking_id: bookingId 
            });

            alert(`Booking confirmed for ${selectedService.name}!`);
            setSelectedService(null);
            setBookingTime('');

        } catch (error) {
            console.error('Error during booking process:', error.response?.data);
            alert('Booking failed. Check the console for the specific error.');
        }
    };
    
    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    if (!provider) return <Typography>Provider not found.</Typography>;

    return (
        <Paper elevation={3} sx={{ p: { xs: 2, md: 4 } }}>
            <Typography variant="h4" component="h1">{provider.username}</Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>{provider.city}</Typography>
            <Typography variant="body1" paragraph>{provider.bio}</Typography>
            
            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" gutterBottom component="h2">Services Offered</Typography>
            <List>
                {provider.services && provider.services.length > 0 ? (
                    provider.services.map(service => (
                        <ListItem key={service.id} divider sx={{ flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'flex-start' }}>
                            <ListItemText primary={`${service.name} - ₹${service.price}`} secondary={service.description} />
                            <Button variant="contained" size="small" onClick={() => setSelectedService(service)} sx={{ mt: { xs: 1, sm: 0 } }}>Book</Button>
                        </ListItem>
                    ))
                ) : (
                    <Typography>This provider has not listed any services yet.</Typography>
                )}
            </List>

            {selectedService && (
                 <Box component="form" onSubmit={handleBookingSubmit} sx={{ mt: 3, p: 2, border: '1px solid #ddd', borderRadius: 2 }}>
                    <Typography variant="h6" gutterBottom>Book Service: {selectedService.name}</Typography>
                    <TextField label="Select Date and Time" type="datetime-local" value={bookingTime} onChange={(e) => setBookingTime(e.target.value)} InputLabelProps={{ shrink: true }} required fullWidth />
                    <Box sx={{ mt: 2 }}>
                        <Button type="submit" variant="contained" sx={{ mr: 1 }}>Confirm Booking</Button>
                        <Button variant="outlined" onClick={() => setSelectedService(null)}>Cancel</Button>
                    </Box>
                </Box>
            )}

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" gutterBottom component="h2">Reviews</Typography>
            <List>
                {reviews.length > 0 ? (
                    reviews.map(review => (
                        <ListItem key={review.id} alignItems="flex-start" divider>
                            <ListItemText
                                primary={<Rating value={review.rating} readOnly />}
                                secondary={<>{`${review.customer_username} — ${review.comment}`}</>}
                            />
                        </ListItem>
                    ))
                ) : (
                    <Typography>No reviews yet for this provider.</Typography>
                )}
            </List>
        </Paper>
    );
}

export default ProviderDetail;