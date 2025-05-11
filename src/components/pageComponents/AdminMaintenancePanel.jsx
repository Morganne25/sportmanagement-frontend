import React, { useEffect, useState } from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Snackbar,
  Alert,
} from '@mui/material';
import axios from 'axios';
import moment from 'moment';

const apiBaseUrl = 'https://sport-management-app-latest.onrender.com';

const AdminMaintenancePanel = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
     const { data } = await axios.get(`${apiBaseUrl}/api/bookings?facility=all`);
      setBookings(data);
      console.log(data);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      triggerSnackbar('Failed to load bookings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(`${apiBaseUrl}/api/bookings/${id}/status`, { status: newStatus });
      triggerSnackbar(`Booking ${newStatus}`, 'success');
      fetchBookings();
    } catch (err) {
      console.error(err);
      triggerSnackbar('Status update failed', 'error');
    }
  };

  const deleteBooking = async (id) => {
    try {
      await axios.delete(`${apiBaseUrl}/api/bookings/${id}`);
      triggerSnackbar('Booking deleted', 'info');
      fetchBookings();
    } catch (err) {
      console.error(err);
      triggerSnackbar('Delete failed', 'error');
    }
  };

  const triggerSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Booking Requests
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Facility</TableCell>
              <TableCell>User ID</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>{moment(booking.date).format('LL')}</TableCell>
                <TableCell>{booking.facility}</TableCell>
                <TableCell>{booking.user?.userID}</TableCell>
                <TableCell>{booking.status}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    onClick={() => updateStatus(booking.id, 'approved')}
                    disabled={booking.status === 'approved'}
                    style={{ marginRight: 5 }}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="contained"
                    color="warning"
                    size="small"
                    onClick={() => updateStatus(booking.id, 'rejected')}
                    disabled={booking.status === 'rejected'}
                    style={{ marginRight: 5 }}
                  >
                    Reject
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => deleteBooking(booking.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminMaintenancePanel;
