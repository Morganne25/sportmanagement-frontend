import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './updates.css';
import { CircularProgress, Chip, Button } from '@mui/material';
import { CalendarToday, LocationOn, Schedule, Construction } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function Updates() {
  const [events, setEvents] = useState([]);
  const [maintenanceReports, setMaintenanceReports] = useState([]);
  const [loading, setLoading] = useState({ events: true, maintenance: true });
  const [error, setError] = useState({ events: null, maintenance: null });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch events
        const eventsResponse = await axios.get('http://localhost:8080/api/v1/events');
        const sortedEvents = eventsResponse.data
          .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
          .filter(event => event.status === 'UPCOMING');
        setEvents(sortedEvents);
        setLoading(prev => ({ ...prev, events: false }));
      } catch (err) {
        setError(prev => ({ ...prev, events: 'Failed to fetch events' }));
        setLoading(prev => ({ ...prev, events: false }));
      }

      try {
        // Fetch maintenance reports (only in-progress and upcoming)
        const maintenanceResponse = await axios.get('http://localhost:8080/api/v1/maintenance');
        const relevantReports = maintenanceResponse.data
          .filter(report => ['In Progress', 'Open'].includes(report.status))
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setMaintenanceReports(relevantReports);
        setLoading(prev => ({ ...prev, maintenance: false }));
      } catch (err) {
        setError(prev => ({ ...prev, maintenance: 'Failed to fetch maintenance reports' }));
        setLoading(prev => ({ ...prev, maintenance: false }));
      }
    };

    fetchData();
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

  const handleViewAllEvents = () => navigate('/events');
  const handleViewAllMaintenance = () => navigate('/maintenance');

  // Get only the first 3 upcoming events and maintenance reports
  const latestEvents = events.slice(0, 3);
  const latestMaintenance = maintenanceReports.slice(0, 3);

  return (
    <div className="updates">
      <h1>Updates</h1>
      <div className="notification-container">
        <div className="notification-item events-section">
          <div className="section-header">
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
          {loading.events ? (
            <div className="loading-container">
              <CircularProgress size={24} />
              <p>Loading events...</p>
            </div>
          ) : error.events ? (
            <p className="error-message">{error.events}</p>
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

        <div className="notification-item maintenance-section">
          <div className="section-header">
            <h4>Planned Maintenance</h4>
            {maintenanceReports.length > 3 && (
              <Button 
                variant="outlined" 
                size="small"
                onClick={handleViewAllMaintenance}
                className="view-all-btn"
              >
                View All Reports
              </Button>
            )}
          </div>
          {loading.maintenance ? (
            <div className="loading-container">
              <CircularProgress size={24} />
              <p>Loading maintenance reports...</p>
            </div>
          ) : error.maintenance ? (
            <p className="error-message">{error.maintenance}</p>
          ) : latestMaintenance.length === 0 ? (
            <p className="no-events">No planned maintenance</p>
          ) : (
            <div className="maintenance-list">
              {latestMaintenance.map((report) => (
                <div key={report.id} className="maintenance-card">
                  <div className="maintenance-header">
                    <h5>Maintenance Report</h5>
                    <Chip 
                      label={report.status} 
                      size="small"
                      color={report.status === 'In Progress' ? 'primary' : 'warning'}
                    />
                  </div>
                  <p className="maintenance-description">{report.description}</p>
                  <div className="maintenance-details">
                    <div className="detail-item">
                      <Construction fontSize="small" />
                      <span>Reported: {formatDate(report.createdAt)}</span>
                    </div>
                    {report.feedback && (
                      <div className="detail-item">
                        <span>Feedback: {report.feedback}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
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