import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
  Box,
  Grid,
  Chip
} from '@mui/material';
import { Add, Edit, Delete, DateRange } from '@mui/icons-material';

const API_BASE_URL = 'http://localhost:8080/api/v1/events';

function EventsManagement() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    eventType: 'tournament',
    startDate: '',
    endDate: '',
    location: '',
    status: 'upcoming'
  });
  const [errors, setErrors] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if user is admin from localStorage
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const adminStatus = userData?.role === 'admin';
    setIsAdmin(adminStatus);
    
    if (adminStatus) {
      fetchEvents();
    }
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_BASE_URL);
      setEvents(response.data);
      setLoading(false);
    } catch (error) {
      showSnackbar('Failed to fetch events', 'error');
      setLoading(false);
    }
  };

  const validateEvent = (event) => {
    const newErrors = {};
    if (!event.title.trim()) newErrors.title = 'Title is required';
    if (!event.description.trim()) newErrors.description = 'Description is required';
    if (!event.eventType) newErrors.eventType = 'Event type is required';
    if (!event.startDate) newErrors.startDate = 'Start date is required';
    if (!event.endDate) newErrors.endDate = 'End date is required';
    if (new Date(event.endDate) < new Date(event.startDate)) {
      newErrors.endDate = 'End date must be after start date';
    }
    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (currentEvent) {
      setCurrentEvent(prev => ({ ...prev, [name]: value }));
    } else {
      setNewEvent(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleOpenCreate = () => {
    if (!isAdmin) {
      showSnackbar('Only admins can create events', 'error');
      return;
    }
    setCurrentEvent(null);
    setErrors({});
    setOpenDialog(true);
  };

  const handleOpenEdit = (event) => {
    if (!isAdmin) {
      showSnackbar('Only admins can edit events', 'error');
      return;
    }
    setCurrentEvent({ ...event });
    setErrors({});
    setOpenDialog(true);
  };

  const handleSubmit = async () => {
    if (!isAdmin) {
      showSnackbar('Only admins can manage events', 'error');
      return;
    }

    const eventToValidate = currentEvent || newEvent;
    const validationErrors = validateEvent(eventToValidate);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      if (currentEvent) {
        await axios.put(`${API_BASE_URL}/${currentEvent.id}`, currentEvent);
        showSnackbar('Event updated successfully', 'success');
      } else {
        await axios.post(API_BASE_URL, newEvent);
        showSnackbar('Event created successfully', 'success');
        setNewEvent({
          title: '',
          description: '',
          eventType: 'tournament',
          startDate: '',
          endDate: '',
          location: '',
          status: 'upcoming'
        });
      }
      setOpenDialog(false);
      fetchEvents();
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Operation failed', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!isAdmin) {
      showSnackbar('Only admins can delete events', 'error');
      return;
    }

    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await axios.delete(`${API_BASE_URL}/${id}`);
        showSnackbar('Event deleted successfully', 'success');
        fetchEvents();
      } catch (error) {
        showSnackbar('Failed to delete event', 'error');
      }
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setErrors({});
  };

  if (!isAdmin) {
    return (
      <Container maxWidth="lg">
        <Box mt={5} textAlign="center">
          <Typography variant="h4" color="error">
            Access Denied
          </Typography>
          <Typography variant="body1">
            You must be an administrator to access this page.
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom>
          Events & Notifications
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleOpenCreate}
        >
          Create Event
          </Button>
      </Box>

      <Paper elevation={3}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'primary.main' }}>
                <TableCell sx={{ color: 'white' }}>Title</TableCell>
                <TableCell sx={{ color: 'white' }}>Type</TableCell>
                <TableCell sx={{ color: 'white' }}>Dates</TableCell>
                <TableCell sx={{ color: 'white' }}>Location</TableCell>
                <TableCell sx={{ color: 'white' }}>Status</TableCell>
                <TableCell sx={{ color: 'white' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : events.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No events found
                  </TableCell>
                </TableRow>
              ) : (
                events.map((event) => (
                  <TableRow key={event.id} hover>
                    <TableCell>
                      <Typography fontWeight="bold">{event.title}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {event.description.substring(0, 50)}...
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={event.eventType} 
                        color={
                          event.eventType === 'tournament' ? 'primary' : 
                          event.eventType === 'meeting' ? 'secondary' : 'default'
                        } 
                      />
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <DateRange color="action" sx={{ mr: 1 }} />
                        <div>
                          <Typography variant="body2">
                            {new Date(event.startDate).toLocaleDateString()}
                          </Typography>
                          <Typography variant="body2">
                            to {new Date(event.endDate).toLocaleDateString()}
                          </Typography>
                        </div>
                      </Box>
                    </TableCell>
                    <TableCell>{event.location || 'Online'}</TableCell>
                    <TableCell>
                      <Chip 
                        label={event.status} 
                        color={
                          event.status === 'upcoming' ? 'warning' : 
                          event.status === 'ongoing' ? 'success' : 'error'
                        } 
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton 
                        color="primary" 
                        onClick={() => handleOpenEdit(event)}
                        aria-label="edit"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        onClick={() => handleDelete(event.id)}
                        aria-label="delete"
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Event Form Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="md">
        <DialogTitle>
          {currentEvent ? 'Edit Event' : 'Create New Event'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Event Title"
                name="title"
                value={currentEvent?.title || newEvent.title}
                onChange={handleInputChange}
                error={!!errors.title}
                helperText={errors.title}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                multiline
                rows={4}
                value={currentEvent?.description || newEvent.description}
                onChange={handleInputChange}
                error={!!errors.description}
                helperText={errors.description}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.eventType}>
                <InputLabel>Event Type</InputLabel>
                <Select
                  name="eventType"
                  value={currentEvent?.eventType || newEvent.eventType}
                  onChange={handleInputChange}
                  label="Event Type"
                  required
                >
                  <MenuItem value="tournament">Tournament</MenuItem>
                  <MenuItem value="meeting">Meeting</MenuItem>
                  <MenuItem value="workshop">Workshop</MenuItem>
                  <MenuItem value="social">Social Event</MenuItem>
                </Select>
                {errors.eventType && (
                  <Typography variant="caption" color="error">
                    {errors.eventType}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={currentEvent?.location || newEvent.location}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Start Date"
                name="startDate"
                type="datetime-local"
                InputLabelProps={{ shrink: true }}
                value={currentEvent?.startDate || newEvent.startDate}
                onChange={handleInputChange}
                error={!!errors.startDate}
                helperText={errors.startDate}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="End Date"
                name="endDate"
                type="datetime-local"
                InputLabelProps={{ shrink: true }}
                value={currentEvent?.endDate || newEvent.endDate}
                onChange={handleInputChange}
                error={!!errors.endDate}
                helperText={errors.endDate}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={currentEvent?.status || newEvent.status}
                  onChange={handleInputChange}
                  label="Status"
                >
                  <MenuItem value="upcoming">Upcoming</MenuItem>
                  <MenuItem value="ongoing">Ongoing</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            color="primary" 
            variant="contained"
          >
            {currentEvent ? 'Update Event' : 'Create Event'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default EventsManagement;