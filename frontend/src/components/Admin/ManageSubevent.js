import React, { useEffect, useState } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Snackbar, Alert, Typography, Box, Tooltip } from '@mui/material';
import { Link } from 'react-router-dom';
import { Add as AddIcon, Visibility as ViewIcon } from '@mui/icons-material';
import Sidebar from './Sidebar';
import { getAllEvents } from '../../api-helpers/api-helpers';

const ManageSubevent = () => {
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

  return (
    <Box sx={{ display: 'flex', bgcolor: '#F5F5F5', minHeight: '100vh' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#333' }}>
            Manage Sub-events
          </Typography>
        </Box>

        <Paper elevation={3} sx={{ p: 2 }}>
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: '#eeeeee' }}>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#333' }}>Sr No.</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#333' }}>Event Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#333' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {events.length > 0 ? (
                  events.map((event, index) => (
                    <TableRow key={event._id} sx={{ '&:nth-of-type(odd)': { bgcolor: '#fafafa' } }}>
                      <TableCell sx={{ fontSize: '1rem', color: '#333' }}>{index + 1}</TableCell>
                      <TableCell sx={{ fontSize: '1rem', color: '#333' }}>{event.title}</TableCell>
                      <TableCell>
                        {/* View Sub-events Button */}
                        <Tooltip title="View Sub-events">
                          <Button
                            component={Link}
                            to={`/admin/view-subevent/${event._id}`} 
                            variant="contained"
                            sx={{
                              bgcolor: '#1976D2',
                              color: '#fff',
                              mr: 2,
                              '&:hover': { bgcolor: '#1565C0' },
                            }}
                            startIcon={<ViewIcon />}
                          >
                            View Sub-events
                          </Button>
                        </Tooltip>

                        {/* Add Sub-event Button */}
                        <Tooltip title="Add Sub-event">
                          <Button
                            component={Link}
                            to={`/admin/add-subevent/${event._id}`}
                            variant="contained"
                            sx={{
                              bgcolor: '#4CAF50',
                              color: '#fff',
                              '&:hover': { bgcolor: '#388E3C' },
                            }}
                            startIcon={<AddIcon />}
                          >
                            Add Sub-event
                          </Button>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} sx={{ textAlign: 'center', fontSize: '1rem', color: '#777' }}>
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

export default ManageSubevent;
