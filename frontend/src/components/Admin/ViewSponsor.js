import React, { useState, useEffect } from "react";
import { 
  Box, Typography, Grid, Card, CardContent, CardMedia, CircularProgress, 
  Alert, IconButton, Snackbar 
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { getSponsorsByEvent, getEventById, deleteSponsor } from "../../api-helpers/api-helpers";

const ViewSponsors = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        setLoading(true);

        const eventDetails = await getEventById(eventId);
        setEvent(eventDetails.event || null);

        const sponsorData = await getSponsorsByEvent(eventId);
        setSponsors(sponsorData?.sponsors || []);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching sponsors:", error);
        setError(true);
        setLoading(false);
      }
    };
    fetchSponsors();
  }, [eventId]);

  const handleDeleteSponsor = async (sponsorId) => {
    try {
      await deleteSponsor(sponsorId);
      setSponsors((prevSponsors) => prevSponsors.filter((sponsor) => sponsor._id !== sponsorId));
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error deleting sponsor:", error);
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#F4F7FC" }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, p: 4 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold", textAlign: "center", color: "#2C3E50" }}>
          {loading ? "Loading Event..." : event ? `Sponsors for ${event.title}` : "Event Not Found"}
        </Typography>

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
            <CircularProgress size={50} />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ maxWidth: "600px", margin: "auto", textAlign: "center" }}>
            Failed to load sponsors. Please try again later.
          </Alert>
        )}

        {!loading && !error && sponsors.length > 0 ? (
          <Grid container spacing={3} justifyContent="center">
            {sponsors.map((sponsor) => (
              <Grid item key={sponsor._id} xs={12} sm={6} md={4} lg={3}>
                <Card 
                  sx={{ 
                    maxWidth: 300, 
                    margin: "auto", 
                    boxShadow: 3, 
                    borderRadius: 2, 
                    bgcolor: "#fff", 
                    textAlign: "center",
                    transition: "0.3s",
                    "&:hover": { boxShadow: 6, transform: "scale(1.02)" }
                  }}
                >
                  {sponsor.image ? (
                    <CardMedia
                      component="img"
                      height="140"
                      image={sponsor.image}
                      alt={sponsor.name}
                      sx={{ objectFit: "contain", p: 2, bgcolor: "#F9FAFC" }}
                    />
                  ) : (
                    <Box 
                      sx={{ height: 140, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "#F9FAFC" }}
                    >
                      <Typography variant="body2" color="textSecondary">No Image</Typography>
                    </Box>
                  )}

                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: "bold", color: "#34495E" }}>
                      {sponsor.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#7F8C8D", mb: 1 }}>
                      {sponsor.type}
                    </Typography>
                    
                    <IconButton 
                      onClick={() => navigate(`/admin/edit-sponsor/${sponsor._id}`)} 
                      sx={{ color: "#3498DB", mr: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                    
                    <IconButton 
                      onClick={() => handleDeleteSponsor(sponsor._id)} 
                      sx={{ color: "#E74C3C" }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          !loading &&
          !error && (
            <Typography variant="h6" sx={{ textAlign: "center", color: "#777", mt: 3 }}>
              No sponsors added for this event.
            </Typography>
          )
        )}

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert severity="success" onClose={() => setSnackbarOpen(false)}>
            Deleted Successfully!
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default ViewSponsors;
