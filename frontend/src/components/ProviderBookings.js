import React, { useState, useEffect, useCallback } from 'react'; // 1. Import useCallback
import useAxios from '../utils/useAxios';
import { Box, Typography, List, ListItem, ListItemText, CircularProgress, Paper, Select, MenuItem, FormControl } from '@mui/material';
import { format } from 'date-fns';

function ProviderBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const api = useAxios();

    // 2. Wrap the fetch function in useCallback
    const fetchProviderBookings = useCallback(async () => {
        try {
            const response = await api.get('/bookings/provider/bookings/');
            setBookings(response.data);
        } catch (error) {
            console.error('Error fetching provider bookings:', error);
        } finally {
            setLoading(false);
        }
    }, [api]); // The dependency for useCallback is 'api'

    useEffect(() => {
        fetchProviderBookings();
    }, [fetchProviderBookings]); // 3. Use the function in the dependency array

    const handleStatusChange = async (bookingId, newStatus) => {
        try {
            await api.patch(`/bookings/provider/bookings/${bookingId}/update/`, { status: newStatus });
            // Refresh the list to show the updated status
            fetchProviderBookings();
        } catch (error) {
            console.error('Error updating booking status:', error);
            alert('Failed to update status.');
        }
    };

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    }

    return (
        <Paper sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom>My Received Bookings</Typography>
            <List>
                {bookings.length > 0 ? (
                    bookings.map(booking => (
                        <ListItem key={booking.id} divider>
                            <ListItemText
                                primary={`${booking.service.name} - Booked by ${booking.customer_username}`}
                                secondary={`On: ${format(new Date(booking.booking_time), 'PPPP p')}`}
                            />
                            <FormControl size="small">
                                <Select
                                    value={booking.status}
                                    onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                                >
                                    <MenuItem value="PENDING">Pending</MenuItem>
                                    <MenuItem value="CONFIRMED">Confirmed</MenuItem>
                                    <MenuItem value="COMPLETED">Completed</MenuItem>
                                    <MenuItem value="CANCELLED">Cancelled</MenuItem>
                                </Select>
                            </FormControl>
                        </ListItem>
                    ))
                ) : (
                    <Typography>You have not received any bookings yet.</Typography>
                )}
            </List>
        </Paper>
    );
}

export default ProviderBookings;