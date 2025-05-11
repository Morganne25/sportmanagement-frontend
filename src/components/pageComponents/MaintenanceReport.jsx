import { useEffect, useState } from 'react';
import {
  Box, Button, TextField, Paper, Typography, Snackbar, Alert,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { Comment, Delete } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MaintenanceReport = () => {
  const [reports, setReports] = useState([]);
  const [description, setDescription] = useState('');
  const [feedback, setFeedback] = useState('');
  const [currentReport, setCurrentReport] = useState(null);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const apiBase = 'http://localhost:8080/api/v1/maintenance';
  const statusOptions = ['Open', 'In Progress', 'Completed' ];

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      navigate('/login');
    } else {
      setUser(userData);
    }
  }, [navigate]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await axios.get(apiBase);
      const allReports = res.data || [];
      const visibleReports = user.role === 'Admin'
        ? allReports
        : allReports.filter(r => r.createdBy === user.id);
      setReports(visibleReports);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch reports.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchReports();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${apiBase}?email=${user.email}`, {
        description,
        status: 'Open'
      });
      setReports(prev => [...prev, res.data]);
      setDescription('');
      setSuccess("Report submitted successfully!");
    } catch (err) {
      console.error(err);
      setError("Failed to submit report.");
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await axios.put(`${apiBase}/${id}/status?email=${user.email}`, {
        status: newStatus
      });
      setReports(reports.map(r => r.id === id ? res.data : r));
      setSuccess("Status updated!");
    } catch (err) {
      console.error(err);
      setError("Failed to update status.");
    }
  };

  const handleFeedbackSubmit = async () => {
    try {
      const res = await axios.put(`${apiBase}/${currentReport.id}/feedback?email=${user.email}`, {
        feedback
      });
      setReports(reports.map(r => r.id === currentReport.id ? res.data : r));
      setFeedback('');
      setCurrentReport(null);
      setFeedbackDialogOpen(false);
      setSuccess("Feedback added!");
    } catch (err) {
      console.error(err);
      setError("Failed to add feedback.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiBase}/${id}`);
      setReports(reports.filter(r => r.id !== id));
      setSuccess("Report deleted.");
    } catch (err) {
      console.error(err);
      setError("Failed to delete report.");
    }
  };

  if (!user) return <Typography>Loading user data...</Typography>;

  return (
    <Box sx={{ p: 4 }}>
      {/* Alerts */}
      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
        <Alert severity="error">{error}</Alert>
      </Snackbar>
      <Snackbar open={!!success} autoHideDuration={6000} onClose={() => setSuccess('')}>
        <Alert severity="success">{success}</Alert>
      </Snackbar>

      {/* New Report Form */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6">New Report</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Describe the issue"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={4}
            required
            sx={{ my: 2 }}
          />
          <Button variant="contained" type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </Paper>

      {/* Reports Table */}
      <Typography variant="h6" gutterBottom>Report List</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Feedback</TableCell>
              {user.role === 'Admin' && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">Loading...</TableCell>
              </TableRow>
            ) : reports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">No reports found.</TableCell>
              </TableRow>
            ) : (
              reports.map(report => (
                <TableRow key={report.id}>
                  <TableCell>{report.createdAt ? new Date(report.createdAt).toLocaleDateString() : '—'}</TableCell>
                  <TableCell>{report.description || '—'}</TableCell>
                  <TableCell>
                    <FormControl fullWidth size="small">
                      <Select
                        value={report.status}
                        onChange={(e) => handleStatusChange(report.id, e.target.value)}
                        disabled={report.status === 'Completed' && user.role !== 'Admin'}
                      >
                        {statusOptions.map(status => (
                          <MenuItem key={status} value={status}>{status}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>{report.feedback || '—'}</TableCell>
                  {user.role === 'Admin' && (
                    <TableCell>
                      <IconButton onClick={() => {
                        setCurrentReport(report);
                        setFeedback(report.feedback || '');
                        setFeedbackDialogOpen(true);
                      }}>
                        <Comment color="primary" />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(report.id)}>
                        <Delete color="error" />
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Feedback Dialog */}
      <Dialog open={feedbackDialogOpen} onClose={() => setFeedbackDialogOpen(false)}>
        <DialogTitle>Add Feedback</DialogTitle>
        <DialogContent>
          <TextField
            label="Feedback"
            fullWidth
            multiline
            rows={4}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFeedbackDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleFeedbackSubmit} variant="contained">Submit</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MaintenanceReport;