import React from 'react';
import useAxios from '../utils/useAxios';
import { Button, Box, Typography } from '@mui/material';

function BookingTest() {
    const api = useAxios();

    const handleTestBooking = async () => {
        console.log("Attempting to create a booking...");
        const serviceIdToBook = 3; // IMPORTANT: Change this to a real service ID from your admin panel
        const bookingTimestamp = new Date().toISOString(); 

        try {
            // Step 1: Create the booking
            const bookingResponse = await api.post('/bookings/create/', { 
                service: serviceIdToBook, 
                booking_time: bookingTimestamp
            });
            const bookingId = bookingResponse.data.id;
            console.log("Booking created with ID:", bookingId);

            // Step 2: Confirm the booking, sending the ID
            await api.post('/bookings/mock-payment-success/', { 
                booking_id: bookingId 
            });

            console.log("Mock payment successful!");
            alert('SUCCESS! The test booking was confirmed.');

        } catch (error) {
            console.error('TEST FAILED. Error object:', error);
            if (error.response) {
                console.error('Error response data:', error.response.data);
            }
            alert('TEST FAILED. Check the console for the error.');
        }
    };

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4">Booking Test Page</Typography>
            <p>This page is for debugging the booking process.</p>
            <p>Make sure you are logged in as a CUSTOMER.</p>
            <p>Also, change the `serviceIdToBook` in the code to a real service ID.</p>
            <Button variant="contained" color="error" onClick={handleTestBooking}>
                Run Booking Test
            </Button>
        </Box>
    );
}

export default BookingTest;