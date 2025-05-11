import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/event.css';
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
        <div className="all-events">
        <h1>All Events</h1>
        {loading ? (
            <div className="loading-container">
            <CircularProgress size={24} />
            <p>Loading events...</p>
            </div>
        ) : error ? (
            <p className="error-message">{error}</p>
        ) : events.length === 0 ? (
            <p className="no-events">No events available</p>
        ) : (
            <div className="events-list">
            {events.map((event) => (
                <div key={event.id} className="event-card">
                <div className="event-header">
                    <h5>{event.title}</h5>
                    <Chip label={event.status} size="small" color="warning" />
                </div>
                <p className="event-description">{event.description}</p>
                <div className="event-details">
                    <div className="detail-item">
                    <CalendarToday fontSize="small" />
                    <span>{formatDate(event.startDate)}</span>
                    </div>
                    {event.endDate && (
                    <div className="detail-item">
                        <Schedule fontSize="small" />
                        <span>Ends: {formatDate(event.endDate)}</span>
                    </div>
                    )}
                    {event.location && (
                    <div className="detail-item">
                        <LocationOn fontSize="small" />
                        <span>{event.location}</span>
                    </div>
                    )}
                </div>
                <div className="event-type">
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