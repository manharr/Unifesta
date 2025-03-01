import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { getCollegeDetails, updateCollegeDetails } from "../../api-helpers/api-helpers";

const EditCollege = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [collegeData, setCollegeData] = useState({
    name: "",
    location: "",
    description: "",
  });

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    const fetchCollegeDetailsData = async () => {
      try {
        const college = await getCollegeDetails(id);
        setCollegeData(college);
      } catch (err) {
        console.error(err);
        setSnackbarMessage("Failed to fetch college details.");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    };

    fetchCollegeDetailsData();
  }, [id]);

  const handleChange = (e) => {
    setCollegeData({ ...collegeData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setSnackbarMessage("Unauthorized: Please log in as admin.");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        return;
      }

      await updateCollegeDetails(id, collegeData, token); 

      setSnackbarMessage("College updated successfully!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);

      setTimeout(() => navigate("/admin/manage-colleges"), 1500);
    } catch (err) {
      console.error(err);
      setSnackbarMessage("Failed to update college. Please try again.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "#F5F5F5" }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#333" }}>
          Edit College
        </Typography>

        <Grid container justifyContent="center" sx={{ mt: 4 }}>
          <Grid item xs={12} sm={8} md={6}>
            <Paper elevation={3} sx={{ p: 4, bgcolor: "#ffffff" }}>
              <Typography
                variant="h5"
                sx={{ mb: 2, fontWeight: "bold", color: "#555" }}
              >
                Update College Details
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
                Update College
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

export default EditCollege;
