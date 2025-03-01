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
import { getSponsorById, updateSponsor, uploadImage } from "../../api-helpers/api-helpers";

const EditSponsor = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [sponsorData, setSponsorData] = useState({
    name: "",
    type: "",
    image: "",
  });

  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    const fetchSponsor = async () => {
      try {
        // console.log("Fetching sponsor for ID:", id);
        const response = await getSponsorById(id); 

        if (response && response.sponsor) {
          setSponsorData(response.sponsor);
        } else {
          throw new Error("Sponsor not found");
        }
      } catch (error) {
        console.error("Error fetching sponsor:", error);
        setSnackbarMessage("Failed to load sponsor details.");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      } finally {
        setLoading(false);
      }
    };

    fetchSponsor();
  }, [id]);

  const handleChange = (e) => {
    setSponsorData((prevData) => ({ ...prevData, [e.target.name]: e.target.value }));
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
      let imageUrl = sponsorData.image;

      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);
        const response = await uploadImage(formData);
        imageUrl = response.imageUrl;
      }

      const updatedSponsor = { ...sponsorData, image: imageUrl };

      await updateSponsor(id, updatedSponsor); 

      setSnackbarMessage("Sponsor updated successfully!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);

      setTimeout(() => navigate("/admin/sponsors/"), 1500);
    } catch (err) {
      console.error("Error updating sponsor:", err);
      setSnackbarMessage("Failed to update sponsor. Please try again.");
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
            Edit Sponsor
          </Typography>

          {loading ? (
            <Typography textAlign="center">Loading sponsor details...</Typography>
          ) : (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField fullWidth label="Sponsor Name" name="name" variant="outlined" value={sponsorData.name} onChange={handleChange} />
              </Grid>

              <Grid item xs={12}>
                <TextField fullWidth label="Sponsor Type" name="type" variant="outlined" value={sponsorData.type} onChange={handleChange} />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1">Upload New Logo:</Typography>
                <input type="file" accept="image/*" onChange={handleImageChange} />
                {/* {sponsorData.image && (
                  <Typography variant="caption" sx={{ display: "block", color: "#777", mt: 1 }}>
                    Current logo: {sponsorData.image}
                  </Typography>
                )} */}
              </Grid>

              <Grid item xs={12}>
                <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>
                  Update Sponsor
                </Button>
              </Grid>
            </Grid>
          )}
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

export default EditSponsor;
