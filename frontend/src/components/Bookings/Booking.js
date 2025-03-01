import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEventDetails, getSubEventsByEvent } from "../../api-helpers/api-helpers";
import { Card, CardContent, CardMedia, Typography, Button, Box, Grid, Container, Paper, Divider, Snackbar, Alert } from "@mui/material";
import { useSelector } from "react-redux";
import RegisterForm from "./RegisterForm";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import SponsorSlider from "./SponsorSlider";

const Booking = () => {
  const [event, setEvent] = useState(null);
  const [subEvents, setSubEvents] = useState([]);
  const { id } = useParams();

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSubEvent, setSelectedSubEvent] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const { isLoggedIn } = useSelector((state) => state.user);

  useEffect(() => {
    let isMounted = true; 
  
    const fetchEventData = async () => {
      try {
        const eventData = await getEventDetails(id);
        const subEventsData = await getSubEventsByEvent(id);
  
        if (isMounted) {
          setEvent(eventData.event);
          setSubEvents(subEventsData);
        }
      } catch (err) {
        console.error("Error fetching event or sub-events:", err);
      }
    };
  
    fetchEventData(); 
  
    const interval = setInterval(fetchEventData, 5000); 
  
    return () => {
      isMounted = false; 
      clearInterval(interval);
    };
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
        color: "#E0E0E0",
        bgcolor: "#121212",
        py: 6,
        mt: 2,
        mb: 2,
        borderRadius: 4,
        boxShadow: "0px 4px 15px rgba(0,0,0,0.5)",
        fontFamily: "'Inter', sans-serif",
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
                    bgcolor: "#1E1E1E",
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
                    image={
                      event.images[0]?.startsWith("http")
                        ? event.images[0] 
                        : `http://localhost:5000${event.images[0]}` 
                    }   
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
                color="#BB86FC"
                sx={{
                  mb: 2,
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  fontFamily: "'Inter', sans-serif",
                  
                }}
              >
                {event.title}
              </Typography>

              {/* Event Date */}
              <Typography
                variant="h6"
                color="#E0E0E0"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 3,
                  fontFamily: "'Inter', sans-serif",
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
                color="#FFA726"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 2,
                  fontWeight: "bold",
                  fontFamily: "'Inter', sans-serif",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                }}
              >
                🏫 <strong>{event.college?.name}</strong>
              </Typography>

              {/* Description Section */}
              <Paper
                sx={{
                  bgcolor: "#1E1E1E",
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
                    fontFamily: "'Inter', sans-serif",
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
                  color: "#E0E0E0",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  fontFamily: "'Inter', sans-serif",
                  letterSpacing: "0.5px",
                }}
              >
                📍 Location: <span style={{ color: "#81C784", fontWeight: "bold" }}>{event.location}</span>
              </Typography>

              
          {/* Event Rules Section */}
          {event.rules && (
            <Box
              sx={{
                position: "relative",
                mt: 2,
                cursor: "pointer",
                
                "&:hover .rules-content": {
                  opacity: 1,
                  visibility: "visible",
                  transform: "translateY(0)",
                },
              }}
            >
              {/* Hover Trigger */}
              <Box
                sx={{
                  bgcolor: "#FF0000", 
                  p: 1.5,
                  borderRadius: "8px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1,
                  boxShadow: "0px 2px 8px rgba(255, 0, 0, 0.3)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    bgcolor: "#CC0000",
                  },
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: "700",
                    color: "#FFFFFF", 
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  RULES
                </Typography>
                <Box
                  sx={{
                    width: "24px",
                    height: "24px",
                    bgcolor: "#2A2A2A", 
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#FF0000", 
                    fontSize: "0.9rem",
                    fontWeight: "700",
                  }}
                >
                  ?
                </Box>
              </Box>

              {/* Hidden Rules Content */}
              <Box
                className="rules-content"
                sx={{
                  position: "absolute",
                  top: "110%", 
                  left: 0,
                  bgcolor: "#1E1E1E", 
                  p: 2,
                  borderRadius: "12px", 
                  boxShadow: "0px 12px 24px rgba(0, 0, 0, 0.6)", 
                  mt: 1,
                  opacity: 0,
                  visibility: "hidden",
                  transform: "translateY(-10px)",
                  transition: "all 0.3s ease",
                  zIndex: 1,
                  
                  width: "340px", 
                  border: "1px solid rgba(255, 0, 0, 0.2)", 
                }}
              >
                {/* Map through the rules array and display each rule with a divider */}
                {event.rules.map((rule, index) => (
                  <Box key={index}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 1.5,
                        mb: 2,
                      }}
                    >
                      {/* Rule Icon */}
                      <Box
                        sx={{
                          width: "24px",
                          height: "24px",
                          bgcolor: "#FF0000",
                          borderRadius: "6px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#FFFFFF", 
                          fontSize: "0.9rem",
                          fontWeight: "700",
                          flexShrink: 0, 
                          boxShadow: "0px 2px 6px rgba(255, 0, 0, 0.4)",
                        }}
                      >
                        {index + 1}
                      </Box>
                      {/* Rule Text */}
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#E0E0E0", 
                          lineHeight: 1.6,
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "0.9rem",
                        }}
                      >
                        {rule}
                      </Typography>
                    </Box>
                    {/* Add a divider after each rule except the last one */}
                    {index !== event.rules.length - 1 && (
                      <Divider
                        sx={{
                          my: 1.5, 
                          bgcolor: "rgba(255, 255, 255, 0.1)", 
                        }}
                      />
                    )}
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </Grid>
      </Grid>
            

          {/* Sub-Events Section */}
          <Typography
            variant="h4"
            color="#BB86FC"
            sx={{
              mt: 6,
              mb: 4,
              textAlign: "center",
              fontWeight: "bold",
              fontFamily: "'Inter', sans-serif",
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
            background: "linear-gradient(135deg, #1E1E1E 30%, #2A2A2A 100%)",
            borderRadius: "12px",
            boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.4)",
            overflow: "hidden",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            border: "1px solid rgba(255, 255, 255, 0.1)", 
            "&:hover": {
              transform: "translateY(-5px)",
              boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.6)",
            },
          }}
        >
          <CardContent sx={{ p: 3, flexGrow: 1 }}>
            <Typography
              variant="h5"
              color="#BB86FC"
              fontWeight="bold"
              sx={{
                mb: 2,
                fontSize: "1.5rem",
                textAlign: "center",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {subEvent.type}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#E0E0E0",
                mb: 2,
                lineHeight: 1.6,
                textAlign: "center",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {subEvent.description}
            </Typography>
            
 
            <Typography
              variant="body2"
              sx={{
                color: "#F8FAFC",
                lineHeight: 1.45,
                textAlign: "center",
                fontFamily: "'Inter', sans-serif",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 0.7, 
                background: "linear-gradient(135deg, rgba(30, 41, 59, 0.85), rgba(17, 24, 39, 0.9))",
                p: 1.0, 
                borderRadius: "7px",
                border: "1px solid rgba(255, 255, 255, 0.14)",
                boxShadow: "0px 3px 8px rgba(0, 0, 0, 0.25)",
                width: "fit-content",
                maxWidth: "78%",
                mx: "auto",
                backdropFilter: "blur(9px)", 
                transition: "all 0.25s ease-in-out",
                "&:hover": {
                  boxShadow: "0px 5px 12px rgba(0, 0, 0, 0.35)",
                  background: "linear-gradient(135deg, rgba(30, 41, 59, 0.92), rgba(17, 24, 39, 1))",
                },
              }}
            >
              <LocationOnOutlinedIcon sx={{ fontSize: 17, color: "#0EA5E9" }} /> {/* Medium Icon */}
              <Box
                component="span"
                sx={{
                  fontWeight: 550,
                  fontSize: "13px",
                  color: "#E2E8F0",
                  textTransform: "uppercase",
                  letterSpacing: "0.45px",
                }}
              >
                {subEvent.venue || "Venue to be announced"}
              </Box>
          </Typography>


            <Divider sx={{ bgcolor: "#444", my: 2 }} />

            {/* Sub-Event Details */}
            {subEvent.details?.length > 0 ? (
              subEvent.details.map((detail, detailIndex) => (
                <Paper
                  key={detailIndex}
                  sx={{
                    p: 3,
                    background: "linear-gradient(135deg, #2A2A2A 30%, #1E1E1E 100%)",
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
                        color: "#F5F5F5",
                        mb: 2,
                        textTransform: "uppercase",
                        letterSpacing: "0.8px",
                        fontFamily: "'Inter', sans-serif",
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
                            fontFamily: "'Inter', sans-serif",
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
                          fontFamily: "'Inter', sans-serif",
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
                          color: detail.entryFee > 0 ? "#ff3a3a" : "#4CAF50",
                          fontFamily: "'Inter', sans-serif",
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
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      Max: {detail.maxParticipants > 0 ? detail.maxParticipants : "N/A"}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 500,
                        color: "#81C784",
                        fontFamily: "'Inter', sans-serif",
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
                  fontFamily: "'Inter', sans-serif",
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
                  bgcolor: "#BB86FC",
                  color: "#030202",
                  fontWeight: "bold",
                  textTransform: "none",
                  padding: "8px 20px",
                  borderRadius: "6px",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                  cursor: "pointer",
                  "&:hover": { bgcolor: "#9C27B0" },
                  "&.Mui-disabled": {
                    color: "#f73409",
                    bgcolor: "#171616",
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
              fontFamily: "'Inter', sans-serif",
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
              sx={{ width: "100%", fontFamily: "'Inter', sans-serif" }}
            >
              Please log in to register for events.
            </Alert>
          </Snackbar>
          <SponsorSlider eventId={id} />
        </Box>
      )
       : (
        
        <Typography
          variant="h6"
          textAlign="center"
          sx={{
            color: "#BB86FC",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Loading event details...
        </Typography>
      )}


    {/* COORDINATORS CONTACT INFO */}
    {event && event.coordinatorsContact && event.coordinatorsContact.length > 0 && (
      <Box
        mt={4}
        sx={{
          background: "linear-gradient(135deg, #0F0F0F, #1A1A1A)",
          p: 4,
          borderRadius: 3,
          boxShadow: "0px 6px 18px rgba(0, 0, 0, 0.3)",
          width: "100%",  
          maxWidth: "1200px",
          mx: "auto",
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            color: "#FFFFFF",
            fontWeight: 700,
            fontFamily: "'Inter', sans-serif",
            mb: 3,
            textAlign: "center",
            textTransform: "uppercase",
            letterSpacing: 1.1,
            fontSize: "22px",
          }}
        >
          Event Co-ordinator
        </Typography>

        <Grid container spacing={3} justifyContent="center">
          {event.coordinatorsContact.map((coordinator, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}> 
              <Paper
                elevation={4}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  background: "linear-gradient(145deg, #1E1E1E, #252525)",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.35)",
                  },
                }}
              >
            <Typography
              variant="h6"
              sx={{
                color: "#BB86FC",
                fontWeight: 600,
                fontFamily: "'Inter', sans-serif",
                mb: 1,
                textTransform: "capitalize",
                fontSize: "1.1rem",
              }}
            >
              {coordinator.name}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#E0E0E0",
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.95rem",
              }}
            >
               Number: {coordinator.phone}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>

    {/* Compact Footer-like Element */}
    <Box
      mt={4}
      sx={{
        textAlign: "center",
        color: "#A0A0A0",
        fontSize: "0.85rem",
        fontFamily: "'Inter', sans-serif",
        borderTop: "1px solid rgba(255, 255, 255, 0.1)",
        pt: 2,
        opacity: 0.8,
      }}
    >
      Need help? Contact the coordinators above.
    </Box>
  </Box>
)}

    </Container>
  );
};

export default Booking;