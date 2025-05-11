import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Typography,
  Box,
  CircularProgress,
  List,
  ListItem,
  Chip,
} from '@mui/material';
import BookingCalendar from './pageComponents/BookingCalendar';
import Header from './pageComponents/Header';
import './pageComponents/bookingfacility.css';

const apiBaseUrl = 'http://localhost:8080';

const BookingFacility = () => {
  const { facility } = useParams();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      navigate('/login');
    } else {
      setUser(userData);
    }
  }, [navigate]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/bookings`, {
          params: {
            facility,
            userEmail: user?.email, // filtre personnalisé (ajuste si nécessaire)
          },
        });
        setRequests(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error loading booking requests:', error);
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };

    if (facility && user?.email) fetchRequests();
  }, [facility, user]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'approved': return 'success';
      case 'rejected': return 'error';
      case 'pending': default: return 'warning';
    }
  };

  return (
    <Box p={3}>
      <Header />
      <Typography variant="h4" gutterBottom>
        Booking - {facility.charAt(0).toUpperCase() + facility.slice(1)}
      </Typography>

      <BookingCalendar facilityType={facility} user={user} />

      <Box mt={4}>
        <Typography variant="h6" gutterBottom>
          Your Booking Requests
        </Typography>
        {loading ? (
          <CircularProgress />
        ) : requests.length === 0 ? (
          <Typography>No requests found.</Typography>
        ) : (
          <List>
          {requests.map((req, i) => (
            <ListItem key={i} divider sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <Typography><strong>Date:</strong> {new Date(req.date).toLocaleDateString()}</Typography>
              <Typography><strong>Facility:</strong> {req.facility}</Typography>
              {req.timeSlot && <Typography><strong>Time Slot:</strong> {req.timeSlot}</Typography>}
              <Box mt={1}>
                <Chip
                  label={req.status.toUpperCase()}
                  color={getStatusColor(req.status)}
                  size="small"
                />
              </Box>
            </ListItem>
          ))}
        </List>
        
        )}
      </Box>
    </Box>
  );
};

export default BookingFacility;
