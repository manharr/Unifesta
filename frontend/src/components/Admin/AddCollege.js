import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Snackbar,
  Alert,
  Paper,
} from "@mui/material";
import Sidebar from "./Sidebar";
import { createCollege } from "../../api-helpers/api-helpers";

const AddCollege = () => {
  const [collegeData, setCollegeData] = useState({
    name: "",
    location: "",
    description: "",
  });

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Handle input change
  const handleChange = (e) => {
    setCollegeData({ ...collegeData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setSnackbarMessage("Unauthorized: Please log in as admin.");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        return;
      }

      await createCollege(collegeData, token); // Call API helper function

      setSnackbarMessage("College added successfully!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      setCollegeData({ name: "", location: "", description: "" }); // Reset form
    } catch (err) {
      setSnackbarMessage("Failed to add college. Please try again.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "#F5F5F5" }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#333" }}>
          Add College
        </Typography>

        <Grid container justifyContent="center" sx={{ mt: 4 }}>
          <Grid item xs={12} sm={8} md={6}>
            <Paper elevation={3} sx={{ p: 4, bgcolor: "#ffffff" }}>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold", color: "#555" }}>
                Enter College Details
              </Typography>
              <TextField
                fullWidth
                label="College Name"
                name="name"
                variant="outlined"
                sx={{ mb: 2 }}
                value={collegeData.name}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                label="College Location"
                name="location"
                variant="outlined"
                sx={{ mb: 2 }}
                value={collegeData.location}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                label="College Description"
                name="description"
                variant="outlined"
                multiline
                rows={3}
                sx={{ mb: 2 }}
                value={collegeData.description}
                onChange={handleChange}
              />
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                onClick={handleSubmit}
              >
                Save College
              </Button>
            </Paper>
          </Grid>
        </Grid>

        {/* Snackbar Notification */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={() => setOpenSnackbar(false)}
        >
          <Alert severity={snackbarSeverity} sx={{ width: "100%" }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default AddCollege;
