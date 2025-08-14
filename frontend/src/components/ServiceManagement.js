import React, { useState, useEffect, useCallback } from 'react';
import useAxios from '../utils/useAxios';

// MUI Imports
import { Box, Typography, List, ListItem, ListItemText, CircularProgress, Paper, Button, TextField, Divider, Modal, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

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

function ServiceManagement() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ name: '', description: '', price: '' });
    
    // State for the edit modal
    const [editingService, setEditingService] = useState(null);
    const [editData, setEditData] = useState({ name: '', description: '', price: '' });
    const [open, setOpen] = useState(false);
    
    const api = useAxios();

    const fetchServices = useCallback(async () => {
        try {
            const response = await api.get('/services/manage/');
            setServices(response.data.results || response.data);
        } catch (error) {
            console.error('Error fetching services:', error);
        } finally {
            setLoading(false);
        }
    }, [api]);

    useEffect(() => {
        fetchServices();
    }, [fetchServices]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleEditChange = (e) => setEditData({ ...editData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/services/manage/', formData);
            alert('Service added successfully!');
            setFormData({ name: '', description: '', price: '' });
            fetchServices();
        } catch (error) {
            console.error('Error adding service:', error.response?.data);
            alert('Failed to add service.');
        }
    };

    const handleDelete = async (serviceId) => {
        if (window.confirm("Are you sure you want to delete this service?")) {
            try {
                await api.delete(`/services/manage/${serviceId}/`);
                alert('Service deleted successfully!');
                fetchServices(); // Refresh the list
            } catch (error) {
                console.error('Error deleting service:', error);
                alert('Failed to delete service.');
            }
        }
    };

    const handleEditOpen = (service) => {
        setEditingService(service);
        setEditData({ name: service.name, description: service.description, price: service.price });
        setOpen(true);
    };
    const handleEditClose = () => setOpen(false);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await api.patch(`/services/manage/${editingService.id}/`, editData);
            alert('Service updated successfully!');
            handleEditClose();
            fetchServices();
        } catch (error) {
            console.error('Error updating service:', error.response.data);
            alert('Failed to update service.');
        }
    };
    
    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;

    return (
        <Paper sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom>Manage Your Services</Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
                <Typography variant="h6">Add a New Service</Typography>
                <TextField margin="normal" required fullWidth name="name" label="Service Name" value={formData.name} onChange={handleChange} />
                <TextField margin="normal" required fullWidth multiline rows={3} name="description" label="Description" value={formData.description} onChange={handleChange} />
                <TextField margin="normal" required fullWidth name="price" label="Price" type="number" value={formData.price} onChange={handleChange} />
                <Button type="submit" variant="contained" sx={{ mt: 2 }}>Add Service</Button>
            </Box>

            <Divider />

            <Box sx={{ mt: 4 }}>
                <Typography variant="h6">Your Current Services</Typography>
                <List>
                    {services.length > 0 ? (
                        services.map(service => (
                            <ListItem key={service.id} divider
                                secondaryAction={
                                    <>
                                        <IconButton edge="end" aria-label="edit" onClick={() => handleEditOpen(service)} sx={{ mr: 1 }}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(service.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </>
                                }
                            >
                                <ListItemText
                                    primary={`${service.name} - ₹${service.price}`}
                                    secondary={service.description}
                                />
                            </ListItem>
                        ))
                    ) : ( <Typography>You have not added any services yet.</Typography> )}
                </List>
            </Box>
            
            {/* Edit Service Modal */}
            <Modal open={open} onClose={handleEditClose}>
                <Box component="form" onSubmit={handleUpdate} sx={modalStyle}>
                    <Typography variant="h6" component="h2">Edit Service</Typography>
                    <TextField margin="normal" required fullWidth name="name" label="Service Name" value={editData.name} onChange={handleEditChange} />
                    <TextField margin="normal" required fullWidth multiline rows={3} name="description" label="Description" value={editData.description} onChange={handleEditChange} />
                    <TextField margin="normal" required fullWidth name="price" label="Price" type="number" value={editData.price} onChange={handleEditChange} />
                    <Button type="submit" variant="contained" sx={{ mt: 2 }}>Save Changes</Button>
                </Box>
            </Modal>
        </Paper>
    );
}
export default ServiceManagement;
