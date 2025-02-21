import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Grid,
  Button,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";
import Sidebar from "./Sidebar";
import { getSubEventsByEvent, deleteSubEvent } from "../../api-helpers/api-helpers";

const ViewSubevents = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [subEvents, setSubEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    const fetchSubEvents = async () => {
      if (!eventId) {
        console.error("Error: eventId is missing from URL!");
        setLoading(false);
        return;
      }

      try {
        const data = await getSubEventsByEvent(eventId);
        console.log("Fetched sub-events:", data);
        setSubEvents(data || []); 
      } catch (err) {
        console.error("Error fetching sub-events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubEvents();
  }, [eventId]);

  const handleDeleteSubEvent = async (subEventId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setSnackbar({ open: true, message: "Unauthorized! Please log in.", severity: "error" });
      return;
    }

    try {
      await deleteSubEvent(subEventId, token);
      setSubEvents((prevSubEvents) => prevSubEvents.filter((sub) => sub._id !== subEventId));
      setSnackbar({ open: true, message: "Sub-event deleted successfully.", severity: "success" });
    } catch (error) {
      console.error("Error deleting sub-event:", error);
      setSnackbar({ open: true, message: "Failed to delete sub-event.", severity: "error" });
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", bgcolor: "#F5F5F5", minHeight: "100vh" }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#333", mb: 2 }}>
          Sub-Events for Event
        </Typography>

        <Paper elevation={3} sx={{ p: 3 }}>
          <Grid container spacing={2}>
            {subEvents.length > 0 ? (
              subEvents.map((subEvent) => (
                <Grid item xs={12} key={subEvent._id}>
                  <Paper sx={{ p: 3, border: "1px solid #ddd", borderRadius: "8px", boxShadow: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {subEvent.type} - {subEvent.description} 
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: "bold", mt: 1, color: "#555" }}>
                      <strong>Venue:</strong> {subEvent.venue || "Not specified"}
                    </Typography>
                    {/* Sub-Event Details */}
                    {subEvent.details?.length > 0 ? (
                      subEvent.details.map((detail, detailIndex) => (
                        <Box key={detailIndex} sx={{ mt: 2, p: 2, bgcolor: "#f9f9f9", borderRadius: "8px" }}>
                          {detail.gameTitle && (
                            <Typography variant="body1" sx={{ fontWeight: "bold", color: "#333" }}>
                              {detail.gameTitle}
                            </Typography>
                          )}
                          <Typography variant="body2">
                            <strong>Date:</strong> {detail.date ? new Date(detail.date).toDateString() : "N/A"}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Time:</strong>{" "}
                            {detail.time
                              ? new Date(`1970-01-01T${detail.time}`).toLocaleTimeString([], {
                                  hour: "numeric",
                                  minute: "2-digit",
                                  hour12: true,
                                })
                              : "N/A"}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Entry Fee:</strong> {detail.entryFee > 0 ? `₹${detail.entryFee}` : "FREE"}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Max Participants:</strong> {detail.maxParticipants > 0 ? detail.maxParticipants : "N/A"}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Registered Participants:</strong> {detail.registeredParticipants || "N/A"}
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: "bold", mt: 1, color: subEvent.registrationStatus === "ON" ? "success.main" : "error.main" }}>
                            Registration Status: {subEvent.registrationStatus === "ON" ? "OPEN" : "CLOSED"}
                          </Typography>
                        </Box>
                      ))
                    ) : (
                      <Typography variant="body2" sx={{ color: "#999", mt: 1 }}>
                        No details available for this sub-event.
                      </Typography>
                    )}

                    <Divider sx={{ my: 2 }} />

                    {/* Buttons for Edit & Delete */}
                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate(`/admin/edit-subevent/${subEvent._id}`)}
                      >
                        Edit Sub-Event
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleDeleteSubEvent(subEvent._id)}
                      >
                        Delete
                      </Button>
                    </Box>
                  </Paper>
                </Grid>
              ))
            ) : (
              <Typography variant="body2" sx={{ color: "#999" }}>
                No sub-events found.
              </Typography>
            )}
          </Grid>
        </Paper>
      </Box>

      {/* Snackbar Notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ViewSubevents;
