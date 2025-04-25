import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './updates.css';
import { CircularProgress, Chip, Button } from '@mui/material';
import { CalendarToday, LocationOn, Schedule } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function Updates() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/events');
        // Sort events by start date (newest first) and filter upcoming events
        const sortedEvents = response.data
          .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
          .filter(event => event.status === 'UPCOMING');
        setEvents(sortedEvents);
      } catch (err) {
        setError('Failed to fetch events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
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

  const handleViewAllEvents = () => {
    navigate('/events'); // Make sure you have a route set up for this
  };

  // Get only the first 3 upcoming events
  
  const latestEvents = events.slice(0, 3);

  return (
    <div className="updates">
      <h1>Updates</h1>
      <div className="notification-container">
        <div className="notification-item events-section">
          <div className="events-header">
            <h4>Upcoming Events</h4>
            {events.length > 3 && (
              <Button 
                variant="outlined" 
                size="small"
                onClick={handleViewAllEvents}
                className="view-all-btn"
              >
                View All Events
              </Button>
            )}
          </div>
          {loading ? (
            <div className="loading-container">
              <CircularProgress size={24} />
              <p>Loading events...</p>
            </div>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : latestEvents.length === 0 ? (
            <p className="no-events">No upcoming events scheduled</p>
          ) : (
            <div className="events-list">
              {latestEvents.map((event) => (
                <div key={event.id} className="event-card">
                  <div className="event-header">
                    <h5>{event.title}</h5>
                    <Chip 
                      label={event.status} 
                      size="small"
                      color="warning"
                    />
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

        <div className="notification-item">
          <h4>Planned Maintenance</h4>
          <p className='notification-description'>
            Show planned maintenance updates
          </p>
        </div>

        <div className="notification-item">
          <h4>Facility Availability</h4>
          <p className='notification-description'>
            <a href="">Check Availability</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Updates;