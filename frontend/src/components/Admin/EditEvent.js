import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Snackbar,
  Alert,
  Autocomplete,
  Checkbox,
  FormControlLabel,
  Grid,
  List,
  ListItem,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { getEventDetails, updateEventDetails, uploadImage, getAllColleges } from "../../api-helpers/api-helpers";

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [eventData, setEventData] = useState({
    title: "",
    startDate: "",
    endDate: "",
    description: "",
    college: null,
    location: "",
    images: [],
    maxParticipants: 0,
    isFeatured: false,
    eventStatus: "",
    coordinatorsContact: [{ name: "", phone: "" }],
    rules: [],
  });

  const [colleges, setColleges] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const event = await getEventDetails(id);
        if (event && event.event) {
          setEventData(event.event);
        }
      } catch (err) {
        console.error(err);
        setSnackbarMessage("Failed to fetch event details.");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    };

    const fetchColleges = async () => {
      try {
        const collegeList = await getAllColleges();
        setColleges(collegeList || []);

        setEventData((prevData) => ({
          ...prevData,
          college: collegeList.find((c) => c._id === prevData.college?._id) || null,
        }));
      } catch (error) {
        console.error("Failed to fetch colleges", error);
      }
    };

    fetchEventDetails().then(fetchColleges);
  }, [id]);

  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
  };

  const handleCoordinatorChange = (index, field, value) => {
    const updatedCoordinators = [...eventData.coordinatorsContact];
    updatedCoordinators[index][field] = value;
    setEventData({ ...eventData, coordinatorsContact: updatedCoordinators });
  };

  const handleAddCoordinator = () => {
    setEventData({
      ...eventData,
      coordinatorsContact: [...eventData.coordinatorsContact, { name: "", phone: "" }],
    });
  };

  const handleSubmit = async () => {
    if (!eventData.title.trim() || !eventData.eventStatus.trim()) {
      setSnackbarMessage("Title and Event Status cannot be empty!");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    try {
      let imageUrls = eventData.images;

      if (imageFiles.length > 0) {
        const uploadPromises = imageFiles.map(async (file) => {
          const formData = new FormData();
          formData.append("image", file);
          const response = await uploadImage(formData);
          return response.imageUrl;
        });

        imageUrls = await Promise.all(uploadPromises); 
      }

      await updateEventDetails(id, { ...eventData, images: imageUrls });

      setEventData((prevState) => ({
        ...prevState,
        images: imageUrls, 
      }));

      setSnackbarMessage("Event updated successfully!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);

      setTimeout(() => navigate("/admin/manage-event"), 1500);
    } catch (err) {
      console.error(err);
      setSnackbarMessage("Failed to update event. Please try again.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleRuleChange = (index, value) => {
    const updatedRules = [...eventData.rules];
    updatedRules[index] = value;
    setEventData({ ...eventData, rules: updatedRules });
  };

  const handleAddRule = () => {
    setEventData({ ...eventData, rules: [...eventData.rules, ""] });
  };

  const handleDeleteRule = (index) => {
    const updatedRules = eventData.rules.filter((_, i) => i !== index);
    setEventData({ ...eventData, rules: updatedRules });
  };

  const handleDeleteCoordinator = (index) => {
    setEventData((prevData) => ({
      ...prevData,
      coordinatorsContact: prevData.coordinatorsContact.filter((_, i) => i !== index),
    }));
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "#F5F5F5" }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", justifyContent: "center", p: 3 }}>
        <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: "900px", bgcolor: "#ffffff", maxHeight: "90vh", overflow: "auto" }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold", textAlign: "center", color: "#555" }}>
            Edit Event
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField fullWidth label="Event Title" name="title" variant="outlined" value={eventData.title} onChange={handleChange} />
            </Grid>
            <Grid item xs={6}>
              <Autocomplete
                options={["Ongoing", "Upcoming"]}
                value={eventData.eventStatus}
                onChange={(event, newValue) => setEventData({ ...eventData, eventStatus: newValue || "" })}
                renderInput={(params) => <TextField {...params} label="Event Status" variant="outlined" />}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField fullWidth type="date" label="Start Date" name="startDate" variant="outlined" value={eventData.startDate} onChange={handleChange} InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth type="date" label="End Date" name="endDate" variant="outlined" value={eventData.endDate} onChange={handleChange} InputLabelProps={{ shrink: true }} />
            </Grid>

            <Grid item xs={6}>
              <TextField fullWidth label="Location" name="location" variant="outlined" value={eventData.location} onChange={handleChange} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth type="number" label="Max Participants" name="maxParticipants" variant="outlined" value={eventData.maxParticipants} onChange={handleChange} />
            </Grid>

            <Grid item xs={6}>
              <Autocomplete
                options={colleges}
                getOptionLabel={(option) => option?.name || ""}
                value={eventData.college}
                onChange={(event, newValue) =>
                  setEventData({ ...eventData, college: newValue || null })
                }
                renderInput={(params) => <TextField {...params} label="Select College" variant="outlined" />}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1">Upload Images:</Typography>
              <input type="file" accept="image/*" multiple onChange={handleImageChange} />
            </Grid>

            <Grid item xs={12}>
              <TextField fullWidth label="Description" name="description" variant="outlined" multiline rows={2} value={eventData.description} onChange={handleChange} />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel control={<Checkbox checked={eventData.isFeatured} onChange={(e) => setEventData({ ...eventData, isFeatured: e.target.checked })} />} label="Featured Event" />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1">Rules:</Typography>
              <List>
                {eventData.rules.map((rule, index) => (
                  <ListItem key={index} secondaryAction={
                    <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteRule(index)}>
                      <DeleteIcon />
                    </IconButton>
                  }>
                    <TextField
                      fullWidth
                      label={`Rule ${index + 1}`}
                      value={rule}
                      onChange={(e) => handleRuleChange(index, e.target.value)}
                    />
                  </ListItem>
                ))}
              </List>
              <Button onClick={handleAddRule}>Add Rule</Button>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1">Coordinators:</Typography>
              {eventData.coordinatorsContact.map((contact, index) => (
                <Grid container spacing={2} key={index} sx={{ mb: 2, alignItems: "center" }}>
                  <Grid item xs={5}>
                    <TextField
                      fullWidth
                      label="Coordinator Name"
                      value={contact.name}
                      onChange={(e) => handleCoordinatorChange(index, "name", e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={5}>
                    <TextField
                      fullWidth
                      label="Contact Number"
                      type="tel"
                      value={contact.phone}
                      onChange={(e) => handleCoordinatorChange(index, "phone", e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteCoordinator(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}
              <Button onClick={handleAddCoordinator}>Add Coordinator</Button>
            </Grid>

            <Grid item xs={12}>
              <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>Update Event</Button>
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

export default EditEvent;