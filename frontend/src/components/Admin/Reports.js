import React, { useState, useEffect } from "react";
import { Box, Typography, CircularProgress, Card, Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";
import { getAllEventsWithRegistrationCount } from "../../api-helpers/api-helpers";

const Reports = () => {
  const [events, setEvents] = useState([]);
  const [collegeRegistrations, setCollegeRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEventReports();
  }, []);

  const fetchEventReports = async () => {
    try {
      const eventData = await getAllEventsWithRegistrationCount();
      setEvents(eventData || []);

      const collegeData = eventData.reduce((acc, event) => {
        if (event.college?._id) {
          acc[event.college._id] = acc[event.college._id] || {
            name: event.college.name,
            totalRegistrations: 0,
            id: event.college._id,
          };
          acc[event.college._id].totalRegistrations += event.registrationCount;
        }
        return acc;
      }, {});

      setCollegeRegistrations(Object.values(collegeData));
    } catch (err) {
      console.error("Error fetching event reports:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", bgcolor: "#F5F7FA", minHeight: "100vh" }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, p: 4 }}>
        <Typography variant="h4" fontWeight={700} color="#1E1E1E" mb={3}>
          Event Reports
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
                <Typography variant="h5" fontWeight={600} color="#1E1E1E" mb={2}>
                  College-Wise Registrations
                </Typography>
                <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: "#E3F2FD" }}>
                        <TableCell sx={{ fontWeight: "bold" }}>College</TableCell>
                        <TableCell align="right" sx={{ fontWeight: "bold" }}>Registrations</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {collegeRegistrations.map((college) => (
                        <TableRow key={college.id}>
                          <TableCell sx={{fontWeight: "bold"}}>{college.name}</TableCell>
                          <TableCell align="right">{college.totalRegistrations}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
                <Typography variant="h5" fontWeight={600} color="#1E1E1E" mb={2}>
                  Event-Wise Registrations
                </Typography>
                <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: "#E3F2FD" }}>
                        <TableCell sx={{ fontWeight: "bold" }}>Event Name</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>College</TableCell>
                        <TableCell align="right" sx={{ fontWeight: "bold" }}>Registrations</TableCell>
                        <TableCell align="right" sx={{ fontWeight: "bold" }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {events.map((event) => (
                        <TableRow key={event._id}>
                          <TableCell sx={{fontWeight: "bold"}}>{event.title || "N/A"}</TableCell>
                          <TableCell>{event.college?.name || "N/A"}</TableCell>
                          <TableCell align="right">{event.registrationCount ?? 0}</TableCell>
                          <TableCell align="right">
                            <Button
                              variant="contained"
                              onClick={() => navigate(`/admin/registrations?event=${event._id}`)}
                              sx={{
                                bgcolor: "#1976D2",
                                color: "#fff",
                                textTransform: "none",
                                fontWeight: "bold",
                                borderRadius: 2,
                                "&:hover": {
                                  backgroundColor: "#004494",
                                },
                              }}
                            >
                              View Registrations
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>
            </Grid>
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default Reports;
