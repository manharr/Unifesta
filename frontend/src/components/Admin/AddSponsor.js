import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Snackbar,
  Alert,
  Grid,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import { addSponsor, getEventById, uploadImage } from "../../api-helpers/api-helpers";

const AddSponsor = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  
  const [event, setEvent] = useState(null);
  const [sponsorData, setSponsorData] = useState({
    name: "",
    type: "",
    logo: "",
    event: eventId,
  });

  const [imageFile, setImageFile] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    setSponsorData({
      name: "",
      type: "",
      logo: "",
      event: eventId,
    });
    const fetchEvent = async () => {
      try {
        const eventDetails = await getEventById(eventId);
        setEvent(eventDetails.event);
      } catch (error) {
        console.error("Error fetching event:", error);
        setSnackbarMessage("Failed to load event details.");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    };
    fetchEvent();
  }, [eventId]);

  const handleChange = (e) => {
    setSponsorData({ ...sponsorData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!sponsorData.name.trim()) {
      setSnackbarMessage("Sponsor Name is required!");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }
  
    try {
      let logoUrl = sponsorData.logo;
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);
        const response = await uploadImage(formData);
        logoUrl = response.imageUrl;
      }
  
      const sponsorPayload = {
        ...sponsorData,
        type: sponsorData.type.trim() ? sponsorData.type : undefined, // If empty, don't send it
        logo: logoUrl,
        event: eventId,
      };
  
      console.log("Submitting sponsor:", sponsorPayload);
  
      await addSponsor(sponsorPayload);
  
      setSnackbarMessage("Sponsor added successfully!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
  
      setTimeout(() => navigate("/admin/sponsors"), 1500);
    } catch (err) {
      console.error(err);
      setSnackbarMessage("Failed to add sponsor. Please try again.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };
  
  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "#F5F5F5" }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", justifyContent: "center", p: 3 }}>
        <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: "600px", bgcolor: "#ffffff" }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold", textAlign: "center", color: "#555" }}>
            {event ? `Adding Sponsor for ${event.title}` : "Loading Event..."}
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Sponsor Name"
                name="name"
                variant="outlined"
                value={sponsorData.name}
                onChange={handleChange}
                placeholder="E.g., XYZ Corp, ABC Pvt Ltd"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Sponsor Type"
                name="type"
                variant="outlined"
                value={sponsorData.type}
                onChange={handleChange}
                placeholder="E.g., Title Sponsor, Gold Sponsor, Beverage Partner"
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1">Upload Logo:</Typography>
              <input type="file" accept="image/*" onChange={handleImageChange} />
              <Typography variant="caption" sx={{ color: "#777" }}>
                {/* Upload a high-quality logo (PNG, JPG) */}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>
                Add Sponsor
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
        <Alert severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddSponsor;
