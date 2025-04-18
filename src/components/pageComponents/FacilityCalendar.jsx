import { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Button, Dialog, DialogTitle, DialogContent, TextField } from '@mui/material';

// Configure the localizer with date-fns
const locales = {
  'en-US': enUS
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const FacilityCalendar = () => {
  const [events, setEvents] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const handleSelectSlot = (slotInfo) => {
    setSelectedSlot(slotInfo);
    setOpen(true);
  };

  const handleBookingSubmit = () => {
    // Add booking logic here
    setOpen(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div style={{ height: 500 }}>
        <Calendar
          localizer={localizer}
          events={events}
          selectable
          onSelectSlot={handleSelectSlot}
          defaultView="week"
          culture="en-US"
        />
      </div>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Book Facility</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Facility"
            fullWidth
            variant="standard"
          />
          <TextField
            margin="dense"
            label="Purpose"
            fullWidth
            variant="standard"
          />
          <Button onClick={handleBookingSubmit} sx={{ mt: 2 }}>
            Submit Booking
          </Button>
        </DialogContent>
      </Dialog>
    </LocalizationProvider>
  );
};

export default FacilityCalendar;