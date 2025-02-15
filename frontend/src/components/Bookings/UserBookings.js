import React, { useState, useEffect } from "react";
import { Container, Typography, Box, Card, CardContent, CircularProgress, Alert, Grid, Divider } from "@mui/material";
import { useSelector } from "react-redux";
import { getUserBookings } from "../../api-helpers/api-helpers";

const UserBookings = () => {
  const userId = useSelector(state => state.user.userId);

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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
        setError(`Error fetching bookings: ${err.message || 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [userId]);

  // Function to format time as 3:00 PM
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours, 10);
    const period = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12; // Convert 0 to 12 for 12-hour format
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
    <Container maxWidth="lg" sx={{ mt: 6, mb: 6, backgroundColor: "#121212", minHeight: "100vh", paddingTop: 4 }}>
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: "bold",
            color: "#BB86FC",
            fontFamily: "'Poppins', sans-serif",
            letterSpacing: 1.2,
            textTransform: "uppercase",
          }}
        >
          Your Bookings
        </Typography>
        <Typography variant="subtitle1" sx={{ color: "#A0A0A0", mt: 1 }}>
          {/* Manage and view all your bookings in one place. */}
        </Typography>
      </Box>

      {bookings.length === 0 ? (
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Typography variant="h6" color="#A0A0A0">
            You have no bookings yet.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={4}>
          {bookings.map((booking) => {
            // For gaming events, find the selected game using additionalInfo
            // For non-gaming events, use the first (or only) entry in the details array
            const selectedDetail = booking.subEvent.type === "Gaming"
              ? booking.subEvent.details.find(
                  (detail) => detail.gameTitle === booking.additionalInfo
                )
              : booking.subEvent.details[0]; // Use the first detail for non-gaming events

            return (
              <Grid item xs={12} sm={6} md={4} key={booking._id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 3,
                    backgroundColor: "#1E1E1E",
                    boxShadow: "0 6px 15px rgba(0, 0, 0, 0.3)",
                    transition: "transform 0.3s, box-shadow 0.3s",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5)",
                    },
                  }}
                >
                  <CardContent>
                    <Typography variant="h5" sx={{ fontWeight: "bold", color: "#BB86FC", mb: 2 }}>
                      {booking.event.title}
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#E0E0E0", mb: 1 }}>
                      {booking.subEvent.type} - {booking.subEvent.description}
                    </Typography>

                    {/* Display Sub-Event Date and Time */}
                    {selectedDetail && (
                      <>
                        <Divider sx={{ backgroundColor: "#BB86FC", my: 2, opacity: 0.5 }} />
                        <Typography variant="body2" sx={{ color: "#B0B0B0", mb: 1 }}>
                          <strong>Event Date:</strong>{" "}
                          {new Date(selectedDetail.date).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#B0B0B0", mb: 1 }}>
                          <strong>Event Time:</strong> {formatTime(selectedDetail.time)}
                        </Typography>
                      </>
                    )}

                    <Divider sx={{ backgroundColor: "#BB86FC", my: 2, opacity: 0.5 }} />
                    <Typography variant="body2" sx={{ color: "#B0B0B0", mb: 1 }}>
                      <strong>Registered on:</strong>{" "}
                      {new Date(booking.registeredOn).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#B0B0B0", mb: 1 }}>
                      <strong>Booking ID:</strong> {booking.ticketNumber}
                    </Typography>
                    {booking.additionalInfo && (
                      <Typography variant="body2" sx={{ color: "#A0A0A0", mt: 1 }}>
                        <strong>Additional Info:</strong> {booking.additionalInfo}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Container>
  );
};

export default UserBookings;