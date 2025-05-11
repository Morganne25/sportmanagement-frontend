import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  Box,
} from '@mui/material';

const localizer = momentLocalizer(moment);
const apiBaseUrl = 'https://sport-management-app-latest.onrender.com';

const STATUS_COLORS = {
  approved: '#4CAF50',
  rejected: '#F44336',
  pending: '#FFC107',
};

const BookingCalendar = ({ facilityType, user }) => {
  const [events, setEvents] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (facilityType) {
      fetchBookings();
    }
  }, [facilityType]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${apiBaseUrl}/api/bookings`, {
        params: { facility: facilityType },
      });

      const formatted = data.map((booking) => ({
        id: booking.id,
        title: booking.status.toUpperCase(),
        start: new Date(booking.date),
        end: new Date(booking.date),
        allDay: true,
        status: booking.status,
        link: booking.link || null,
      }));

      setEvents(formatted);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      triggerSnackbar('Failed to load bookings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSlot = ({ start }) => {
    const selectedDate = moment(start).startOf('day').toDate();

    const isUnavailable = events.some(
      (event) =>
        moment(event.start).isSame(selectedDate, 'day') &&
        ['approved', 'pending'].includes(event.status)
    );

    if (isUnavailable) {
      triggerSnackbar('This date is already booked or pending', 'warning');
    } else {
      setSelectedSlot(selectedDate);
      setOpenDialog(true);
    }
  };

  const handleBook = async () => {
    const user = JSON.parse(localStorage.getItem('userData'));

    if (!user) {
      triggerSnackbar('You must be logged in to book.', 'error');
      return;
    }

    try {
      const formattedDate = moment(selectedSlot).format('YYYY-MM-DD');
      await axios.post(`${apiBaseUrl}/api/bookings`, {
       "facility": facilityType,
        "date": formattedDate,
        "user": { "userID": user.userId },
      });
 
      triggerSnackbar('Booking request sent!', 'success');
      setOpenDialog(false);
      fetchBookings();
    } catch (error) {
      console.log(user);
      console.error('Booking failed:', error);
      triggerSnackbar('Booking failed', 'error');
    }
  };

  const triggerSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const eventStyleGetter = (event) => ({
    style: {
      backgroundColor: STATUS_COLORS[event.status] || '#90A4AE',
      color: 'white',
      borderRadius: 5,
      padding: '2px 6px',
    },
  });

  const CustomEvent = ({ event }) => (
    <span>
      <strong>{event.title}</strong>
      {event.link && (
        <>
          {' - '}
          <a
            href={event.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{ color: '#fff', textDecoration: 'underline' }}
          >
            View
          </a>
        </>
      )}
    </span>
  );

  return (
    <div style={{ height: 500, marginTop: 20 }}>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
          <CircularProgress />
        </Box>
      ) : (
        <Calendar
          localizer={localizer}
          events={events}
          selectable
          onSelectSlot={handleSelectSlot}
          eventPropGetter={eventStyleGetter}
          components={{ event: CustomEvent }}
          defaultView="month"
          views={['month']}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
        />
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Booking</DialogTitle>
        <DialogContent>
          <p><strong>Date:</strong> {moment(selectedSlot).format('LL')}</p>
          <p><strong>Facility:</strong> {facilityType}</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleBook} variant="contained" color="primary">Confirm</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </div>
  );
};

export default BookingCalendar;
