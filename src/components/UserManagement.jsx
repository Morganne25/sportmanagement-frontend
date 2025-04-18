import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
  Typography,
  Container,
  Box
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';

const API_BASE_URL = 'http://localhost:8080/api/v1/user';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'member',
    status: 'active'
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/all`);
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      showSnackbar('Failed to fetch users', 'error');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
  };

  const handleAddUser = async () => {
    try {
      await axios.post(`${API_BASE_URL}/register`, newUser);
      showSnackbar('User added successfully', 'success');
      fetchUsers();
    } catch (error) {
      showSnackbar('Failed to add user', 'error');
    }
  };

  const handleEditUser = (user) => {
    setCurrentUser({ ...user });
    setOpen(true);
  };

  const handleUpdateUser = async () => {
    try {
      await axios.put(`${API_BASE_URL}`, currentUser);
      setOpen(false);
      showSnackbar('User updated successfully', 'success');
      fetchUsers();
    } catch (error) {
      showSnackbar('Failed to update user', 'error');
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`${API_BASE_URL}/${id}`);
        showSnackbar('User deleted successfully', 'success');
        fetchUsers();
      } catch (error) {
        showSnackbar('Failed to delete user', 'error');
      }
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom style={{ color: '#1976d2', textAlign: 'center' }}>
        User Management
      </Typography>
      <Typography variant="a" gutterBottom style={{ color: '#1976d2', textAlign: 'center' }}>
       <a href='/landing'>Home</a>
      </Typography>
      <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px', backgroundColor: '#f5f5f5' }}>
        <Typography variant="h6" gutterBottom>Add New User</Typography>
        <Box display="flex" gap="15px" flexWrap="wrap">
          <TextField label="Name" name="name" value={newUser.name} onChange={handleInputChange} required />
          <TextField label="Email" name="email" type="email" value={newUser.email} onChange={handleInputChange} required />
          <FormControl>
            <InputLabel>Role</InputLabel>
            <Select name="role" value={newUser.role} onChange={handleInputChange}>
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="manager">Manager</MenuItem>
              <MenuItem value="member">Member</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" color="primary" onClick={handleAddUser}>Add User</Button>
        </Box>
      </Paper>

      <Paper elevation={3}>
        <TableContainer>
          <Table>
            <TableHead style={{ backgroundColor: '#1976d2', color: 'white' }}>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center"><CircularProgress /></TableCell>
                </TableRow>
              ) : (
                users.map(user => (
                  <TableRow key={user.userid}>
                    <TableCell>{user.userid}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <IconButton color="primary" onClick={() => handleEditUser(user)}><Edit /></IconButton>
                      <IconButton color="error" onClick={() => handleDeleteUser(user.userid)}><Delete /></IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
}

export default UserManagement;