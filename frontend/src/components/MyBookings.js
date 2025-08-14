import React, { useState, useEffect, useContext, useCallback } from 'react'; // 1. Import useCallback
import useAxios from '../utils/useAxios';
import AuthContext from '../context/AuthContext';
import { Box, Typography, List, ListItem, ListItemText, CircularProgress, Paper, Chip, Button, Modal, Rating, TextField } from '@mui/material';
import { format } from 'date-fns';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function MyBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);
    const api = useAxios();

    // State for review modal
    const [open, setOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    // 2. Move fetchBookings outside and wrap in useCallback
    const fetchBookings = useCallback(async () => {
        try {
            const response = await api.get('/bookings/my-bookings/');
            setBookings(response.data);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    }, [api]); // Dependency for useCallback

    useEffect(() => {
        if (user) {
            fetchBookings();
        } else {
            setLoading(false);
        }
    }, [user, fetchBookings]); // 3. Use fetchBookings in the dependency array

    const handleOpen = (booking) => {
        setSelectedBooking(booking);
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
        setRating(0);
        setComment('');
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/reviews/create/', {
                booking: selectedBooking.id,
                rating: rating,
                comment: comment,
            });
            alert('Review submitted successfully!');
            handleClose();
            fetchBookings(); // This can now see the function
        } catch (error) {
            console.error("Error submitting review:", error.response?.data);
            alert('Failed to submit review. You may have already reviewed this booking.');
        }
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;

    return (
        <Paper sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom>My Bookings</Typography>
            <List>
                {bookings.length > 0 ? (
                    bookings.map(booking => (
                        <ListItem key={booking.id} divider>
                            <ListItemText
                                primary={booking.service ? `Service: ${booking.service.name}` : 'Service not available'}
                                secondary={`On: ${format(new Date(booking.booking_time), 'PPPP p')}`}
                            />
                            <Chip label={booking.status} color={booking.status === 'CONFIRMED' ? 'success' : (booking.status === 'COMPLETED' ? 'primary' : 'default')} sx={{ mx: 2 }} />
                            {booking.status === 'COMPLETED' && !booking.has_review && (
                                <Button variant="outlined" size="small" onClick={() => handleOpen(booking)}>
                                    Leave a Review
                                </Button>
                            )}
                        </ListItem>
                    ))
                ) : (
                    <Typography>You have no bookings.</Typography>
                )}
            </List>

            <Modal open={open} onClose={handleClose}>
                <Box sx={modalStyle} component="form" onSubmit={handleReviewSubmit}>
                    <Typography variant="h6" component="h2">Leave a Review</Typography>
                    <Rating name="rating" value={rating} onChange={(event, newValue) => { setRating(newValue); }} sx={{ my: 2 }} />
                    <TextField label="Comment" multiline rows={4} fullWidth value={comment} onChange={(e) => setComment(e.target.value)} required />
                    <Button type="submit" variant="contained" sx={{ mt: 2 }}>Submit Review</Button>
                </Box>
            </Modal>
        </Paper>
    );
}

export default MyBookings;