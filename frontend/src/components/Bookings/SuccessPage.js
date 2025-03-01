import React from "react";
import { Container, Typography, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const SuccessPage = () => {
    const navigate = useNavigate(); // Initialize useNavigate

  return (
    <Container
      maxWidth="lg"
      sx={{
        color: "#E0E0E0", // Light gray for text
        bgcolor: "#121212", // Dark background
        py: 8,
        mt: 2,
        mb: 2,
        borderRadius: 4,
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.5)", // Subtle elevation
        fontFamily: "'Inter', sans-serif", // Professional font
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Gradient Overlay */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background:
            "radial-gradient(circle, rgba(187, 134, 252, 0.1) 0%, rgba(18, 18, 18, 1) 70%)",
          zIndex: 1,
        }}
      />

      {/* Custom Checkmark Animation */}
      <Box
        sx={{
          width: "120px",
          height: "120px",
          position: "relative",
          mb: 4,
          zIndex: 2,
          "&::before, &::after": {
            content: '""',
            position: "absolute",
            backgroundColor: "#BB86FC", 
            borderRadius: "2px",
          },
          "&::before": {
            width: "30%",
            height: "60%",
            transform: "rotate(45deg)",
            bottom: "30%",
            left: "35%",
            animation: "drawBefore 0.75s ease-in-out forwards",
          },
          "&::after": {
            width: "60%",
            height: "30%",
            transform: "rotate(-45deg)",
            bottom: "35%",
            left: "10%",
            animation: "drawAfter 0.75s ease-in-out 0.75s forwards",
          },
          "@keyframes drawBefore": {
            "0%": { height: "0%" },
            "100%": { height: "60%" },
          },
          "@keyframes drawAfter": {
            "0%": { width: "0%" },
            "100%": { width: "60%" },
          },
        }}
      />

      {/* Success Message */}
      <Typography
        variant="h4"
        color="#BB86FC" // Purple accent for headings
        sx={{
          mb: 4,
          fontWeight: "bold",
          fontFamily: "'Inter', sans-serif", // Consistent font
          letterSpacing: "0.5px",
          zIndex: 2,
        }}
      >
        Registered Successfully!
      </Typography>

      {/* Description Text */}
      {/* <Typography
        variant="body1"
        color="#E0E0E0"
        sx={{
          mb: 6,
          maxWidth: "600px",
          zIndex: 2,
        }}
      >
        Thank you for registering with us. You can now access your account and
        explore all the features we offer.
      </Typography> */}

      {/* Buttons */}
      <Box sx={{ display: "flex", gap: 3, mt: 4, zIndex: 2 }}>
        <Button
          variant="contained"
          sx={{
            bgcolor: "#BB86FC", // Purple accent for buttons
            color: "#030202", // Dark text for contrast
            fontWeight: "bold",
            textTransform: "none",
            padding: "12px 24px",
            borderRadius: "6px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
            cursor: "pointer",
            transition: "background-color 0.3s, transform 0.2s",
            "&:hover": {
              bgcolor: "#9C27B0", // Darker purple on hover
              transform: "scale(1.05)",
            },
          }}
          onClick={() => {
            // Navigate to Bookings page
            navigate("/bookings");
          }}
        >
          Bookings
        </Button>

        <Button
          variant="contained"
          sx={{
            bgcolor: "#81C784", // Green accent for buttons
            color: "#030202", // Dark text for contrast
            fontWeight: "bold",
            textTransform: "none",
            padding: "12px 24px",
            borderRadius: "6px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
            cursor: "pointer",
            transition: "background-color 0.3s, transform 0.2s",
            "&:hover": {
              bgcolor: "#4CAF50", // Darker green on hover
              transform: "scale(1.05)",
            },
          }}
          onClick={() => {
            // Navigate to Home page
            navigate("/");
        }}
        >
          Home
        </Button>
      </Box>
    </Container>
  );
};

export default SuccessPage;