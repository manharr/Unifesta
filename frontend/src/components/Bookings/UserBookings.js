import React, { useState, useEffect } from "react";
import { Container, Typography, Box, Card, CardContent, CircularProgress, Alert, Grid, Divider } from "@mui/material";
import { useSelector } from "react-redux";
import { getUserBookings } from "../../api-helpers/api-helpers";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import BusinessIcon from "@mui/icons-material/Business";

const UserBookings = () => {
  const user = useSelector(state => state.user); // Fetch entire user object
  const userId = user?.userId; // Ensure userId is valid

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Fetched User ID:", userId); // Debugging userId

    if (!userId) {
      setError("User ID is missing or user is not logged in.");
      setLoading(false);
      return;
    }

    const fetchBookings = async () => {
      try {
        const data = await getUserBookings(userId);

        if (data && data.bookings?.length > 0) {
          setBookings(data.bookings);
        } else {
          setError("No bookings found for this user.");
        }
      } catch (err) {
        setError(`Error fetching bookings: ${err.response?.data?.message || err.message || 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [userId]);

  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours, 10);
    const period = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${period}`;
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: "#121212" }}>
        <CircularProgress color="secondary" size={60} thickness={4} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, backgroundColor: "#121212", minHeight: "100vh", paddingTop: 4 }}>
        <Alert severity="error" sx={{ mb: 2, backgroundColor: "#ff4444", color: "#fff" }}>{error}</Alert>
      </Container>
    );
  }
  

  return (
    <Container
    maxWidth="lg"
    sx={{
      mt: 6,
      mb: 6,
      background: "linear-gradient(135deg, #0F0F0F 0%, #1A1A1A 100%)", // Deep dark gradient
      minHeight: "100vh",
      padding: 4,
      borderRadius: 4,
      boxShadow: "0px 12px 24px rgba(0, 0, 0, 0.5)", // Subtle shadow for depth
      overflow: "hidden",
      border: "1px solid rgba(255, 255, 255, 0.1)", // Subtle border for definition
    }}
  >
    {/* Header Section */}
    <Box sx={{ textAlign: "center", mb: 6 }}>
      <Typography
        variant="h3"
        component="h1"
        sx={{
          fontWeight: 800,
          color: "#FF6B6B", // Vibrant accent color
          fontFamily: "'Poppins', sans-serif",
          letterSpacing: 1.5,
          textTransform: "uppercase",
          position: "relative",
          display: "inline-block",
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: -8,
            left: "50%",
            transform: "translateX(-50%)",
            width: "60%",
            height: "4px",
            background: "linear-gradient(90deg, #FF6B6B, transparent)",
            borderRadius: 2,
          },
        }}
      >
        Your Bookings
      </Typography>
    </Box>
    <Box
    sx={{
      textAlign: "center",
      mb: 4,
      padding: "12px 16px",
      backgroundColor: "rgba(255, 107, 107, 0.1)", // Subtle red tint
      borderLeft: "4px solid #FF6B6B", // Accent border
      borderRadius: "4px",
      maxWidth: "800px",
      mx: "auto", // Center horizontally
    }}
  >
    <Typography
      variant="body1"
      sx={{
        color: "#E2E8F0",
        fontFamily: "'Poppins', sans-serif",
        fontWeight: 500,
        fontSize: "0.95rem",
        lineHeight: 1.6,
      }}
    >
      If you wish to cancel your registration, please contact the respective event coordinator for assistance.
    </Typography>
  </Box>
  
    {/* Bookings Grid */}
    <Grid container spacing={4}>
      {bookings.map((booking) => {
        if (!booking.event) {
          console.warn("Skipping booking due to missing event:", booking);
          return null; // Skip invalid entries
        }
  
        const selectedDetail =
          booking.subEvent?.type === "Gaming"
            ? booking.subEvent.details.find(
                (detail) => detail.gameTitle === booking.additionalInfo
              )
            : booking.subEvent?.details?.[0];
  
        return (
          <Grid item xs={12} sm={6} md={4} key={booking._id}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                borderRadius: 4,
                background: "rgba(255, 255, 255, 0.05)", // Slightly transparent white
                backdropFilter: "blur(16px)", // Frosted glass effect
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.4)",
                border: "1px solid rgba(255, 255, 255, 0.1)", // Subtle border
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: "0 12px 32px rgba(0, 0, 0, 0.6)",
                  borderColor: "rgba(255, 255, 255, 0.2)", // Highlight border on hover
                },
              }}
            >
              <CardContent>
                {/* Event Title */}
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: "#FF6B6B", // Vibrant accent color
                    mb: 2,
                    fontFamily: "'Poppins', sans-serif",
                    letterSpacing: 0.8,
                    fontSize:"29px"
                  }}
                >
                  {booking.event?.title || "Unknown Event"}
                </Typography>

                <Typography
  variant="body2"
  sx={{
    color: "#FACC15", 
    lineHeight: 1.45,
    textAlign: "left",
    fontFamily: "'Inter', sans-serif",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 0.7,
    background: "linear-gradient(135deg, rgba(34, 34, 34, 0.9), rgba(24, 24, 24, 0.85))", // Elegant Dark
    p: 1.0,
    borderRadius: "7px",
    border: "1px solid rgba(250, 204, 21, 0.4)", // Subtle Gold Glow
    boxShadow: "0px 3px 8px rgba(0, 0, 0, 0.25)",
    width: "fit-content",
    maxWidth: "78%",
    mx: 0,
    backdropFilter: "blur(9px)",
    transition: "all 0.25s ease-in-out",
    "&:hover": {
      boxShadow: "0px 5px 12px rgba(250, 204, 21, 0.3)",
      background: "linear-gradient(135deg, rgba(34, 34, 34, 0.95), rgba(24, 24, 24, 0.9))",
    },
  }}
>
  <LocationOnOutlinedIcon sx={{ fontSize: 17, color: "#FACC15" }} />
  <Box
    component="span"
    sx={{
      fontWeight: 550,
      fontSize: "12px",
      color: "#FACC15", // Gold Text
      textTransform: "uppercase",
      letterSpacing: "0.45px",
    }}
  >
    {booking.subEvent?.venue || "Venue to be announced"}
  </Box>
</Typography>


  {/* SubEvent Type & Description */}
                <Typography
                  variant="body1"
                  sx={{
                    color: "#E2E8F0",
                    mb: 2,
                    fontSize: "0.95rem",
                    lineHeight: 1.6,
                    mt:2,
                  }}
                >
                  {booking.subEvent?.type || "Unknown"} -{" "}
                  {booking.subEvent?.description || "No description available"}
                </Typography>
  
                {/* 🎮 Gaming Details */}
                {selectedDetail && (
                  <>
                    <Divider
                      sx={{
                        backgroundColor: "rgba(255, 107, 107, 0.3)", // Accent color divider
                        my: 2,
                      }}
                    />
                    <Box sx={{ mb: 2 }}>
                      <Typography
                        variant="body2"
                        sx={{ color: "#CBD5E1", mb: 1 }}
                      >
                        <strong>Event Date:</strong>{" "}
                        {new Date(selectedDetail.date).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "#CBD5E1", mb: 1 }}
                      >
                        <strong>Event Time:</strong> {formatTime(selectedDetail.time)}
                      </Typography>
                    </Box>
                  </>
                )}
  
                <Divider
                  sx={{ backgroundColor: "rgba(255, 107, 107, 0.3)", my: 2 }}
                />
  
                {/* Booking Details */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ color: "#CBD5E1", mb: 1 }}>
                    <strong>Registered on:</strong>{" "}
                    {new Date(booking.registeredOn).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#CBD5E1", mb: 1 }}>
                    <strong>Booking ID:</strong> {booking.ticketNumber}
                  </Typography>
                </Box>
  
                {/* Additional Info */}
                {booking.additionalInfo && (
                  <Typography
                    variant="body2"
                    sx={{ color: "#A1A1AA", mt: 1, fontStyle: "italic" }}
                  >
                    <strong>Additional Info:</strong> {booking.additionalInfo}
                  </Typography>
                )}
  
                {/* College Info */}
{booking.event?.college?.name && (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 1,
      background: "linear-gradient(135deg, rgba(34, 34, 34, 0.9), rgba(24, 24, 24, 0.85))", // Elegant Dark Background
      padding: "8px 14px",
      borderRadius: "7px",
      border: "1px solid rgba(250, 204, 21, 0.4)", // Subtle Gold Border
      boxShadow: "0px 3px 8px rgba(0, 0, 0, 0.25)",
      width: "fit-content",
      backdropFilter: "blur(9px)",
      transition: "all 0.25s ease-in-out",
      "&:hover": {
        boxShadow: "0px 5px 12px rgba(250, 204, 21, 0.3)",
        background: "linear-gradient(135deg, rgba(34, 34, 34, 0.95), rgba(24, 24, 24, 0.9))",
      },
    }}
  >
    <BusinessIcon sx={{ fontSize: 18, color: "#FACC15" }} /> {/* Gold Icon */}
    <Typography
      variant="body2"
      sx={{
        color: "#FACC15", // Gold Text
        fontWeight: 550,
        fontSize: "0.85rem",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
      }}
    >
      {booking.event.college.name}
    </Typography>
  </Box>
)}

              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  </Container>


  );
};

export default UserBookings;
