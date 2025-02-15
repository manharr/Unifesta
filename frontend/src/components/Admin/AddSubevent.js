import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Snackbar,
  Alert,
  Grid,
  Autocomplete,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import { createSubEvent } from "../../api-helpers/api-helpers";

const AddSubevent = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const token = localStorage.getItem("token");

  const [subEventData, setSubEventData] = useState({
    event: eventId,
    type: "",
    description: "",
    registrationStatus: true,
    details: [
      {
        gameTitle: "",
        date: "",
        time: "",
        entryFee: 0,
        maxParticipants: 0,
        registeredParticipants: 0,
      },
    ],
  });

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleChange = (e) => {
    setSubEventData({ ...subEventData, [e.target.name]: e.target.value });
  };

  const handleDetailChange = (index, field, value) => {
    const updatedDetails = [...subEventData.details];
    updatedDetails[index][field] = value;
    setSubEventData({ ...subEventData, details: updatedDetails });
  };

  const handleAddDetail = () => {
    setSubEventData({
      ...subEventData,
      details: [
        ...subEventData.details,
        {
          gameTitle: "",
          date: "",
          time: "",
          entryFee: 0,
          maxParticipants: 0,
          registeredParticipants: 0,
        },
      ],
    });
  };

  const handleToggleRegistration = () => {
    setSubEventData({
      ...subEventData,
      registrationStatus: !subEventData.registrationStatus,
    });
  };

  const handleSubmit = async () => {
    if (!subEventData.type.trim() || !subEventData.description.trim()) {
      setSnackbarMessage("Type and Description are required!");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    for (const detail of subEventData.details) {
      if (!detail.date || !detail.time) {
        setSnackbarMessage("Date and Time are required for each sub-event.");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        return;
      }
      if (subEventData.type === "Gaming" && !detail.gameTitle) {
        setSnackbarMessage("Game Title is required for Gaming sub-events.");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        return;
      }
    }

    try {
      await createSubEvent(subEventData, token);
      setSnackbarMessage("Sub-event added successfully!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      setTimeout(() => navigate(`/admin/view-subevent/${eventId}`), 1500);
    } catch (err) {
      console.error(err);
      setSnackbarMessage("Failed to add sub-event. Please try again.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "#F5F5F5" }}>
      <Sidebar />
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: "100%",
            maxWidth: "700px",
            bgcolor: "#ffffff",
            maxHeight: "90vh",
            overflow: "auto",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              mb: 3,
              fontWeight: "bold",
              textAlign: "center",
              color: "#555",
            }}
          >
            Add New Sub-Event
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Autocomplete
                options={["Gaming", "Workshop", "Sports", "Technical", "Cultural"]}
                value={subEventData.type}
                onChange={(event, newValue) => setSubEventData({ ...subEventData, type: newValue || "" })}
                renderInput={(params) => <TextField {...params} label="Sub-Event Type" variant="outlined" />}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                variant="outlined"
                multiline
                rows={2}
                value={subEventData.description}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1">Details:</Typography>
              {subEventData.details.map((detail, index) => (
                <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
                  {subEventData.type === "Gaming" && (
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Game Title"
                        variant="outlined"
                        value={detail.gameTitle}
                        onChange={(e) => handleDetailChange(index, "gameTitle", e.target.value)}
                      />
                    </Grid>
                  )}
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      type="date"
                      label="Date"
                      variant="outlined"
                      value={detail.date}
                      onChange={(e) => handleDetailChange(index, "date", e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      type="time"
                      label="Time"
                      variant="outlined"
                      value={detail.time}
                      onChange={(e) => handleDetailChange(index, "time", e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Entry Fee"
                      variant="outlined"
                      value={detail.entryFee}
                      onChange={(e) => handleDetailChange(index, "entryFee", e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Max Participants"
                      variant="outlined"
                      value={detail.maxParticipants}
                      onChange={(e) => handleDetailChange(index, "maxParticipants", e.target.value)}
                    />
                  </Grid>
                </Grid>
              ))}
              {subEventData.type === "Gaming" && <Button onClick={handleAddDetail}>Add Detail</Button>}
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={<Switch checked={subEventData.registrationStatus} onChange={handleToggleRegistration} />}
                label={subEventData.registrationStatus ? "Registration Open" : "Registration Closed"}
              />
            </Grid>

            <Grid item xs={12}>
              <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>
                Add Sub-Event
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
        <Alert severity={snackbarSeverity}>{snackbarMessage}</Alert>
      </Snackbar>
    </Box>
  );
};

export default AddSubevent;
