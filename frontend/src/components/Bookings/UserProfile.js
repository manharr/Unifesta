import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  Card,
  CardContent,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getUserById, updateUser } from "../../api-helpers/api-helpers";

const UserProfile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    contact: "",
  });
  const [error, setError] = useState("");

  // Fetch userId from local storage
  const userId = localStorage.getItem("userId");

  // Fetch user details on mount
  useEffect(() => {
    if (!userId) {
        navigate("/auth");
        return;
    }

    const fetchUserDetails = async () => {
        try {
            console.log("Fetching user details for ID:", userId);
            const userData = await getUserById(userId);
            console.log("Fetched User Data:", userData);

            setProfile({
                name: userData.name,
                email: userData.email,
                contact: userData.contact || "+91", // Default if not provided
            });
        } catch (err) {
            console.error("Error fetching user details:", err);
            setError("Failed to fetch user details. Please try again.");
        }
    };

    fetchUserDetails();
}, [userId, navigate]);

  const handleEdit = () => setIsEditing(true);

  const handleSave = async () => {
    try {
        const updatedProfile = {
            ...profile,
            password: profile.password || "defaultPassword123", // Provide a default
        };

        await updateUser(userId, updatedProfile);
        setIsEditing(false);
        alert("Profile updated successfully!");
    } catch (err) {
        setError("Failed to update profile. Please try again.");
    }
};
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  if (!userId) return null; // Don't render if user is not logged in

  return (
    <Container
      maxWidth="lg"
      sx={{
        color: "#E0E0E0",
        bgcolor: "#121212",
        py: 8,
        mt: 2,
        mb: 2,
        borderRadius: 4,
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.5)",
        fontFamily: "'Inter', sans-serif",
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
      {/* Background Overlay */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "radial-gradient(circle, rgba(187, 134, 252, 0.1) 0%, rgba(18, 18, 18, 1) 70%)",
          zIndex: 1,
        }}
      />

      <Typography
        variant="h4"
        color="#BB86FC"
        sx={{
          mb: 4,
          fontWeight: "bold",
          fontFamily: "'Inter', sans-serif",
          letterSpacing: "0.5px",
          zIndex: 2,
        }}
      >
        Your Profile
      </Typography>

      <Card
        sx={{
          width: "100%",
          maxWidth: "500px",
          bgcolor: "#1E1E1E",
          borderRadius: 2,
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.3)",
          zIndex: 2,
          overflow: "hidden",
        }}
      >
        <CardContent>
          {isEditing ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {["name", "email", "contact"].map((field) => (
                <TextField
                  key={field}
                  label={field.charAt(0).toUpperCase() + field.slice(1)}
                  name={field}
                  value={profile[field]}
                  onChange={handleChange}
                  fullWidth
                  sx={{
                    "& .MuiInputBase-input": { color: "#E0E0E0" },
                    "& .MuiInputLabel-root": { color: "#BB86FC" },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#BB86FC" },
                      "&:hover fieldset": { borderColor: "#BB86FC" },
                    },
                  }}
                />
              ))}
            </Box>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, textAlign: "left" }}>
              <Typography variant="h6" color="#BB86FC" sx={{ fontWeight: "bold" }}>
                Name
              </Typography>
              <Typography variant="body1" color="#E0E0E0">
                {profile.name}
              </Typography>
              <Typography variant="h6" color="#BB86FC" sx={{ fontWeight: "bold", mt: 2 }}>
                Email
              </Typography>
              <Typography variant="body1" color="#E0E0E0">
                {profile.email}
              </Typography>
              <Typography variant="h6" color="#BB86FC" sx={{ fontWeight: "bold", mt: 2 }}>
                Contact
              </Typography>
              <Typography variant="body1" color="#E0E0E0">
                {profile.contact}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      <Box sx={{ display: "flex", gap: 3, mt: 4, zIndex: 2 }}>
        <Button
          variant="contained"
          sx={{
            bgcolor: isEditing ? "#81C784" : "#BB86FC",
            color: "#030202",
            fontWeight: "bold",
            textTransform: "none",
            padding: "12px 24px",
            borderRadius: "6px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
            "&:hover": { bgcolor: isEditing ? "#4CAF50" : "#9C27B0", transform: "scale(1.05)" },
          }}
          onClick={isEditing ? handleSave : handleEdit}
        >
          {isEditing ? "Save" : "Edit"}
        </Button>
        <Button
          variant="contained"
          sx={{
            bgcolor: "#FF5252",
            color: "#030202",
            fontWeight: "bold",
            textTransform: "none",
            padding: "12px 24px",
            borderRadius: "6px",
          }}
          onClick={() => navigate("/")}
        >
          Back to Home
        </Button>
      </Box>

      {error && <Typography color="error" sx={{ mt: 2, zIndex: 2 }}>{error}</Typography>}
    </Container>
  );
};

export default UserProfile;
