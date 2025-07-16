import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CircularProgress, Chip } from '@mui/material';
import { CalendarToday, LocationOn, Schedule } from '@mui/icons-material';
import Header from "./pageComponents/Header";
import Footer from "./pageComponents/Footer";

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllEvents = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/events');
        setEvents(response.data);
      } catch (err) {
        setError('Failed to fetch events');
      } finally {
        setLoading(false);
      }
    };

    fetchAllEvents();
  }, []);

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <>
        <Header/>
    <div className="container py-4">
        <h1 className="mb-4 text-primary">All Events</h1>
        {loading ? (
            <div className="d-flex align-items-center gap-2 text-muted">
            <CircularProgress size={24} />
            <p className="mb-0">Loading events...</p>
            </div>
        ) : error ? (
            <p className="text-danger">{error}</p>
        ) : events.length === 0 ? (
            <p className="fst-italic text-muted">No events available</p>
        ) : (
            <div className="d-flex flex-column gap-3">
            {events.map((event) => (
                <div key={event.id} className="card shadow-sm p-3 transition-hover">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="mb-0 text-primary">{event.title}</h5>
                    <Chip label={event.status} size="small" color="warning" />
                </div>
                <p className="text-muted mb-2 small">{event.description}</p>
                <div className="d-flex flex-column gap-2 mt-3 text-secondary small">
                    <div className="d-flex align-items-center gap-2">
                    <CalendarToday fontSize="small" />
                    <span>{formatDate(event.startDate)}</span>
                    </div>
                    {event.endDate && (
                    <div className="d-flex align-items-center gap-2">
                        <Schedule fontSize="small" />
                        <span>Ends: {formatDate(event.endDate)}</span>
                    </div>
                    )}
                    {event.location && (
                    <div className="d-flex align-items-center gap-2">
                        <LocationOn fontSize="small" />
                        <span>{event.location}</span>
                    </div>
                    )}
                </div>
                <div className="mt-2">
                    <Chip label={event.eventType} color="primary" size="small" />
                </div>
                </div>
            ))}
            </div>
        )}
        </div>
        <Footer/>
    </>
  );
}

export default Events;