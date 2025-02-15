import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Grid,
  Divider,
} from "@mui/material";
import Sidebar from "./Sidebar";
import { getEventById, getSubEventsByEvent } from "../../api-helpers/api-helpers";

const ViewEvent = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [subEvents, setSubEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventAndSubEvents = async () => {
      try {
        const eventData = await getEventById(id);
        setEvent(eventData.event);

        // Fetch sub-events by event ID
        const subEventsData = await getSubEventsByEvent(id);
        setSubEvents(subEventsData);
      } catch (err) {
        console.error("Error fetching event and sub-events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEventAndSubEvents();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!event) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <Typography variant="h6" color="error">
          Event not found.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", bgcolor: "#F5F5F5", minHeight: "100vh" }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#333" }}>
          Event Details
        </Typography>

        <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
          <Grid container spacing={2}>
            {/* Event Title & Description */}
            <Grid item xs={12}>
              <Typography variant="h5" sx={{ fontWeight: "bold" }} mt={1}>
                {event.title}
              </Typography>
              <Typography variant="subtitle1" sx={{ color: "#555" }} mt={2}>
                {event.description}
              </Typography>
            </Grid>

            {/* Event Dates & Status */}
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" mt={1}>
                <strong>Start Date:</strong> {new Date(event.startDate).toDateString()}
              </Typography>
              <Typography variant="body1" mt={1}>
                <strong>End Date:</strong> {new Date(event.endDate).toDateString()}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="body1" mt={1}>
                <strong>Max Participants:</strong> {event.maxParticipants || "N/A"}
              </Typography>
              <Typography variant="body1" mt={1}>
                <strong>Event Status:</strong> {event.eventStatus || "N/A"}
              </Typography>
            </Grid>

            {/* College & Location */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                College Information
              </Typography>
              <Typography variant="body1" mt={1}>
                <strong>Name:</strong> {event.college?.name || "N/A"}
              </Typography>
              <Typography variant="body1" mt={1}>
                <strong>Location:</strong> {event.location}
              </Typography>
            </Grid>

            {/* Sub-Events */}
            {subEvents.length > 0 && (
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Sub-Events
                </Typography>
                {subEvents.map((subEvent, index) => (
                  <Box key={index} sx={{ mt: 2, p: 2, border: "1px solid #ddd", borderRadius: "8px" }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {subEvent.type} - {subEvent.description} 
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: "bold", mt: 1, color: subEvent.registrationStatus === "ON" ? "success.main" : "error.main" }}>
                    Registration Status - {subEvent.registrationStatus === "ON" ? "OPEN" : "CLOSED"}
                    </Typography>
                    {subEvent.details.length > 0 ? (
                      subEvent.details.map((detail, detailIndex) => (
                        <Box key={detailIndex} sx={{ mt: 1, p: 1, bgcolor: "#f9f9f9", borderRadius: "8px" }}>
                          {detail.gameTitle && (
                            <Typography variant="body1" sx={{ fontWeight: "bold", color: "#333" }}>
                              {detail.gameTitle}
                            </Typography>
                          )}
                          <Typography variant="body2">
                            <strong>Date:</strong> {new Date(detail.date).toDateString()}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Time:</strong> {new Date(`1970-01-01T${detail.time}`).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Entry Fee:</strong> {detail.entryFee > 0 ? `₹${detail.entryFee}` : "FREE"}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Max Participants:</strong> {detail.maxParticipants > 0 ? detail.maxParticipants : "N/A"}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Registered Participants:</strong> {detail.registeredParticipants}
                          </Typography>
                          
                        </Box>
                      ))
                    ) : (
                      <Typography variant="body2" sx={{ color: "#999" }}>
                        No details available for this sub-event.
                      </Typography>
                    )}
                  </Box>
                ))}
              </Grid>
            )}

            {/* Sponsors */}
            {event.sponsors.length > 0 && (
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Sponsors
                </Typography>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  {event.sponsors.map((sponsor, index) => (
                    <Grid item key={index} xs={12}>
                      <Typography variant="body1">{sponsor}</Typography>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            )}

            {/* Coordinators Contact */}
            {event.coordinatorsContact.length > 0 && (
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Coordinators Contact
                </Typography>   
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  {event.coordinatorsContact.map((coordinator, index) => (
                    <Grid item key={index} xs={12} sm={6}>
                      <Typography variant="body1">
                        <strong>{coordinator.name}</strong> 📞 {coordinator.phone}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            )}

            {/* Event Images */}
            {event.images?.length > 0 && (
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Event Images
                </Typography>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  {event.images.map((image, index) => (
                    <Grid item key={index} xs={12} sm={6} md={4}>
                      <img
                        src={image}
                        alt={`${index + 1}`}
                        style={{ width: "100%", borderRadius: "8px", objectFit: "cover" }}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            )}

          </Grid>
        </Paper>
      </Box>
    </Box>
  );
};

export default ViewEvent;
