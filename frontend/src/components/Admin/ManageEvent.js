import React, { useEffect, useState } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Snackbar, Alert, Typography, Box, IconButton, Tooltip } from '@mui/material';
import { Link } from 'react-router-dom';
import { Delete as DeleteIcon, Edit as EditIcon, Add as AddIcon, Visibility as ViewIcon } from '@mui/icons-material';
import Sidebar from './Sidebar';
import { deleteEvent, getAllEvents } from '../../api-helpers/api-helpers';

const ManageEvent = () => {
  const [events, setEvents] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getAllEvents();
        setEvents(data.events);
      } catch (err) {
        console.error('Error fetching events:', err);
        setSnackbarMessage('Failed to load events.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    };
    fetchEvents();
  }, []);

  const handleDeleteEvent = async (id) => {
    try {
      await deleteEvent(id);
      setSnackbarMessage('Event deleted successfully');
      setSnackbarOpen(true); // Corrected line
      setEvents(events.filter(event => event._id !== id));
    } catch (error) {
      setSnackbarMessage('Failed to delete event');
      setSnackbarOpen(true); // Corrected line
    }
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: '#F5F5F5', minHeight: '100vh' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#333' }}>
            Manage Events
          </Typography>
          <Button
            component={Link}
            to="/admin/add-event"
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              bgcolor: '#4CAF50',
              color: '#fff',
              '&:hover': { bgcolor: '#388E3C' },
            }}
          >
            Add Event
          </Button>
        </Box>

        <Paper elevation={3} sx={{ p: 2 }}>
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: '#eeeeee' }}>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#333' }}>Sr No.</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#333' }}>Event Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#333' }}>College</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#333' }}>Location</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#333' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {events.length > 0 ? (
                  events.map((event, index) => (
                    <TableRow key={event._id} sx={{ '&:nth-of-type(odd)': { bgcolor: '#fafafa' } }}>
                      <TableCell sx={{ fontSize: '1rem', color: '#333' }}>{index + 1}</TableCell>
                      <TableCell sx={{ fontSize: '1rem', color: '#333', fontWeight: "bold" }}>{event.title}</TableCell>
                      <TableCell sx={{ fontSize: '1rem', color: '#333' }}>{event.college?.name}</TableCell>
                      <TableCell sx={{ fontSize: '1rem', color: '#333' }}>{event.location}</TableCell>
                      <TableCell>
                        {/* View Button */}
                        <Tooltip title="View Event">
                          <IconButton
                            component={Link}
                            to={`/admin/view-event/${event._id}`}
                            sx={{
                              color: '#1976D2',
                              '&:hover': { bgcolor: '#E3F2FD' },
                            }}
                          >
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>

                        {/* Edit Button */}
                        <Tooltip title="Edit Event">
                          <IconButton
                            component={Link}
                            to={`/admin/edit-event/${event._id}`}
                            sx={{
                              color: '#1976D2',
                              '&:hover': { bgcolor: '#E3F2FD' },
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>

                        {/* Delete Button */}
                        <Tooltip title="Delete Event">
                          <IconButton
                            onClick={() => handleDeleteEvent(event._id)}
                            sx={{
                              color: '#D32F2F',
                              '&:hover': { bgcolor: '#FFEBEE' },
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} sx={{ textAlign: 'center', fontSize: '1rem', color: '#777' }}>
                      No events found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={() => setSnackbarOpen(false)}>
          <Alert severity={snackbarSeverity} sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default ManageEvent;
