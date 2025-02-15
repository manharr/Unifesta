import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEventDetails, getSubEventsByEvent, } from "../../api-helpers/api-helpers";
import { Card, CardContent, CardMedia, Typography, Button, Box, Grid, Container, Paper, Divider,  Snackbar, Alert } from "@mui/material";
import {  useSelector } from "react-redux"; // Importing useDispatch and useSelector from Redux
import RegisterForm from "./RegisterForm";

const Booking = () => {
  const [event, setEvent] = useState(null);
  const [subEvents, setSubEvents] = useState([]);
  const { id } = useParams();

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSubEvent, setSelectedSubEvent] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false); // To control the Snackbar state
  const { isLoggedIn } = useSelector((state) => state.user); // Check if the user is logged in

//   const dispatch = useDispatch(); // Dispatch function to interact with Redux store

 useEffect(() => {
    const fetchEventData = async () => {
      try {
        const eventData = await getEventDetails(id);
        setEvent(eventData.event);
        sessionStorage.setItem("eventData", JSON.stringify(eventData.event)); // Store event in sessionStorage

        const subEventsData = await getSubEventsByEvent(id);
        setSubEvents(subEventsData);
        sessionStorage.setItem("subEventsData", JSON.stringify(subEventsData)); // Store sub-events in sessionStorage
      } catch (err) {
        console.error("Error fetching event or sub-events:", err);
      }
    };

    // Check if event data exists in sessionStorage and use it if available
    const savedEventData = sessionStorage.getItem("eventData");
    const savedSubEventsData = sessionStorage.getItem("subEventsData");

    if (savedEventData && savedSubEventsData) {
      setEvent(JSON.parse(savedEventData));
      setSubEvents(JSON.parse(savedSubEventsData));
    } else {
      fetchEventData(); // Fetch data if not available in sessionStorage
    }

    const interval = setInterval(fetchEventData, 5000);

    return () => clearInterval(interval);
  }, [id]);
  

  const handleOpenRegisterForm = (subEvent) => {
    if (!isLoggedIn) {
      setOpenSnackbar(true); 
      return; 
      
    }

    setSelectedSubEvent(subEvent);
    setOpenDialog(true);
  };

  const handleCloseRegisterForm = () => {
    setOpenDialog(false);
    setSelectedSubEvent(null);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container
  maxWidth="lg"
  sx={{
    color: "#E0E0E0", // Light gray for text
    bgcolor: "#121212", // Dark background
    py: 6,
    mt: 2,
    mb: 2,
    borderRadius: 4,
    boxShadow: "0px 4px 15px rgba(0,0,0,0.5)", // Subtle elevation
    fontFamily: "'Inter', sans-serif", // Professional font
  }}
>
  {event ? (
    <Box>
      {/* Event Details */}
      <Grid container spacing={4} alignItems="center">
        {/* Event Image */}
        <Grid item xs={12} sm={4} sx={{ textAlign: "center", mb: { xs: 4, sm: 0 } }}>
          {event.images?.length > 0 && (
            <Card
              sx={{
                bgcolor: "#1E1E1E", // Dark card background
                boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.7)",
                borderRadius: "15px",
                overflow: "hidden",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "scale(1.02)",
                  boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.8)",
                },
              }}
            >
              <CardMedia
                component="img"
                height="350"
                image={event.images[0]}
                alt="Event Poster"
                sx={{
                  objectFit: "cover",
                  transition: "opacity 0.3s ease",
                  "&:hover": {
                    opacity: 0.9,
                  },
                }}
              />
            </Card>
          )}
        </Grid>

        {/* Event Information */}
        <Grid item xs={12} sm={8}>
          <Typography
            variant="h3"
            fontWeight="700"
            color="#BB86FC" // Purple accent for headings
            sx={{
              mb: 2,
              textTransform: "uppercase",
              letterSpacing: "1px",
              fontFamily: "'Inter', sans-serif", // Consistent font
            }}
          >
            {event.title}
          </Typography>

          {/* Event Date */}
          <Typography
            variant="h6"
            color="#E0E0E0" // Light gray for text
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 3,
              fontFamily: "'Inter', sans-serif", // Consistent font
            }}
          >
            📅{" "}
            {new Date(event.startDate).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}{" "}
            &mdash;{" "}
            {new Date(event.endDate).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </Typography>

          {/* College Name */}
          <Typography
            variant="h6"
            color="#FFA726" // Orange accent for college name
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 2,
              fontWeight: "bold",
              fontFamily: "'Inter', sans-serif", // Consistent font
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}
          >
            🏫 <strong>{event.college?.name}</strong>
          </Typography>

          {/* Description Section */}
          <Paper
            sx={{
              bgcolor: "#1E1E1E", // Dark background
              p: 3,
              borderRadius: "10px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.6)",
              transition: "transform 0.3s ease",
              "&:hover": {
                transform: "translateY(-2px)",
              },
            }}
          >
            <Typography
              variant="body1"
              sx={{
                color: "#E0E0E0",
                lineHeight: 1.8,
                textAlign: "justify",
                fontFamily: "'Inter', sans-serif", // Consistent font
              }}
            >
              {event.description}
            </Typography>
          </Paper>

          {/* Location */}
          <Typography
            variant="h6"
            sx={{
              mt: 3,
              fontWeight: "600",
              color: "#E0E0E0", // Light gray for text
              display: "flex",
              alignItems: "center",
              gap: 1,
              fontFamily: "'Inter', sans-serif", // Consistent font
              letterSpacing: "0.5px",
            }}
          >
            📍 Location: <span style={{ color: "#81C784", fontWeight: "bold" }}>{event.location}</span> {/* Green for location */}
          </Typography>
        </Grid>
      </Grid>

      {/* Sub-Events Section */}
      <Typography
        variant="h4"
        color="#BB86FC" // Purple accent for headings
        sx={{
          mt: 6,
          mb: 4,
          textAlign: "center",
          fontWeight: "bold",
          fontFamily: "'Inter', sans-serif", // Consistent font
        }}
      >
        Explore
      </Typography>

      <Grid
        container
        spacing={3}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "stretch",
          width: "100%",
          mt: 3,
        }}
      >
        {subEvents.length > 0 ? (
          subEvents.map((subEvent) => (
            <Grid item xs={12} sm={6} md={6} key={subEvent._id}>
              <Card
                sx={{
                  bgcolor: "#1E1E1E", // Dark card background
                  borderRadius: "12px",
                  boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.4)",
                  overflow: "hidden",
                  height: "100%", // Ensures uniform height for cards
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.6)",
                  },
                }}
              >
                <CardContent sx={{ p: 3, flexGrow: 1 }}>
                  <Typography
                    variant="h5"
                    color="#BB86FC" // Purple accent for headings
                    fontWeight="bold"
                    sx={{
                      mb: 2,
                      fontSize: "1.5rem",
                      textAlign: "center",
                      fontFamily: "'Inter', sans-serif", // Consistent font
                    }}
                  >
                    {subEvent.type}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#E0E0E0", // Light gray for text
                      mb: 2,
                      lineHeight: 1.6,
                      textAlign: "center",
                      fontFamily: "'Inter', sans-serif", // Consistent font
                    }}
                  >
                    {subEvent.description}
                  </Typography>

                  <Divider sx={{ bgcolor: "#444", my: 2 }} /> {/* Divider with subtle color */}

                  {/* Sub-Event Details */}
                  {subEvent.details?.length > 0 ? (
                    subEvent.details.map((detail, detailIndex) => (
                      <Paper
                        key={detailIndex}
                        sx={{
                          p: 3,
                          bgcolor: "#2A2A2A", // Slightly lighter dark background
                          borderRadius: "12px",
                          border: "1px solid #444",
                          width: "100%",
                          maxWidth: 600,
                          mx: "auto",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          textAlign: "center",
                          boxShadow: "0px 4px 10px rgba(0,0,0,0.3)",
                          mb: 2,
                          transition: "transform 0.3s ease",
                          "&:hover": {
                            transform: "translateY(-2px)",
                          },
                        }}
                      >
                        {/* Game Title (if available) */}
                        {detail.gameTitle && (
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 700,
                              color: "#F5F5F5", // White for emphasis
                              mb: 2,
                              textTransform: "uppercase",
                              letterSpacing: "0.8px",
                              fontFamily: "'Inter', sans-serif", // Consistent font
                            }}
                          >
                            {detail.gameTitle}
                          </Typography>
                        )}

                        {/* Details Grid */}
                        <Grid container spacing={2} sx={{ width: "100%" }}>
                          <Grid item xs={12} sm={4}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "center" }}>
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: 500,
                                  color: "#B0B0B0",
                                  whiteSpace: "nowrap",
                                  fontFamily: "'Inter', sans-serif", // Consistent font
                                }}
                              >
                                📅{" "}
                                {new Date(detail.date).toLocaleDateString("en-GB", {
                                  weekday: "short",
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </Typography>
                            </Box>
                          </Grid>

                          <Grid item xs={12} sm={4}>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 500,
                                color: "#B0B0B0",
                                fontFamily: "'Inter', sans-serif", // Consistent font
                              }}
                            >
                              ⏰{" "}
                              {new Date(`1970-01-01T${detail.time}`).toLocaleTimeString([], {
                                hour: "numeric",
                                minute: "2-digit",
                                hour12: true,
                              })}
                            </Typography>
                          </Grid>

                          <Grid item xs={12} sm={4}>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 600,
                                color: detail.entryFee > 0 ? "#FFD54F" : "#4CAF50", // Yellow for paid, green for free
                                fontFamily: "'Inter', sans-serif", // Consistent font
                              }}
                            >
                              {detail.entryFee > 0 ? `₹${detail.entryFee}` : "FREE"}
                            </Typography>
                          </Grid>
                        </Grid>

                        {/* Participants Info */}
                        <Box
                          sx={{
                            mt: 2,
                            display: "flex",
                            justifyContent: "space-between",
                            width: "100%",
                            px: 2,
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 500,
                              color: "#B0B0B0",
                              fontFamily: "'Inter', sans-serif", // Consistent font
                            }}
                          >
                            Max: {detail.maxParticipants > 0 ? detail.maxParticipants : "N/A"}
                          </Typography>

                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 500,
                              color: "#81C784", // Green for registered participants
                              fontFamily: "'Inter', sans-serif", // Consistent font
                            }}
                          >
                            Registered: {detail.registeredParticipants}
                          </Typography>
                        </Box>
                      </Paper>
                    ))
                  ) : (
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#999",
                        textAlign: "center",
                        fontFamily: "'Inter', sans-serif", // Consistent font
                      }}
                    >
                      No details available for this sub-event.
                    </Typography>
                  )}

                  {/* REGISTER BUTTON WITH REGISTRATION STATUS CHECK */}
                  <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                    <Button
                      variant="contained"
                      sx={{
                        bgcolor: "#BB86FC", // Purple accent for buttons
                        color: "#030202", // Dark text for contrast
                        fontWeight: "bold",
                        textTransform: "none",
                        padding: "8px 20px",
                        borderRadius: "6px",
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                        cursor: "pointer",
                        "&:hover": { bgcolor: "#9C27B0" }, // Darker purple on hover
                        "&.Mui-disabled": {
                          color: "#f73409", // Red for disabled state
                          bgcolor: "#171616", // Dark gray for disabled background
                        },
                      }}
                      disabled={
                        subEvent.registrationStatus === "OFF" ||
                        subEvent.details.every(
                          (detail) =>
                            (Number(detail.maxParticipants) > 0 &&
                            Number(detail.registeredParticipants) >= Number(detail.maxParticipants)) ||
                            detail.maxParticipants === "N/A"
                        )
                      }
                      onClick={() => handleOpenRegisterForm(subEvent)}
                    >
                      {subEvent.registrationStatus === "OFF"
                        ? "Closed"
                        : subEvent.details.every(
                            (detail) =>
                              (Number(detail.maxParticipants) > 0 &&
                              Number(detail.registeredParticipants) >= Number(detail.maxParticipants)) ||
                              detail.maxParticipants === "N/A"
                          )
                        ? "FULL"
                        : "Register"}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography
            variant="h6"
            textAlign="center"
            sx={{
              color: "#BB86FC",
              width: "100%",
              fontFamily: "'Inter', sans-serif", // Consistent font
            }}
          >
            No sub-events available.
          </Typography>
        )}
      </Grid>

      {/* Register Form Dialog */}
      <RegisterForm open={openDialog} handleClose={handleCloseRegisterForm} subEvent={selectedSubEvent} />

      {/* Snackbar for Login Required */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={1500}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="warning"
          sx={{ width: "100%", fontFamily: "'Inter', sans-serif" }} // Consistent font
        >
          Please log in to register for events.
        </Alert>
      </Snackbar>
    </Box>
  ) : (
    <Typography
      variant="h6"
      textAlign="center"
      sx={{
        color: "#BB86FC",
        fontFamily: "'Inter', sans-serif", // Consistent font
      }}
    >
      Loading event details...
    </Typography>
  )}
</Container>
  );
};

export default Booking;
