import React from "react";
import { Card, CardMedia, CardContent, Typography, Grid, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";

const EventCards = ({ events, isUpcoming }) => {  // Accept isUpcoming prop
  return (
    <Grid container spacing={3} justifyContent="center" sx={{ mt: 3 }}>
      {events.map((event, index) => (
        <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
          <Card 
            sx={{ 
              bgcolor: "#1E1E1E", 
              color: "#ffffff", 
              borderRadius: 4, 
              height: "100%", 
              display: "flex", 
              flexDirection: "column",
              boxShadow: "0 6px 15px rgba(0,0,0,0.4)",
              transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
              "&:hover": { transform: "scale(1.05)", boxShadow: "0 10px 20px rgba(0,0,0,0.5)" }
            }}
          >
            {/* Event Image */}
            <CardMedia
              component="img"
              height="220"
              image={event.images[0]}
              alt={event.title}
              sx={{ objectFit: "cover", borderTopLeftRadius: 4, borderTopRightRadius: 4 }}
            />

            {/* Event Details */}
            <CardContent sx={{ flexGrow: 1, p: 2 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                {event.title}
              </Typography>
              <Typography variant="body2" color="#cbcbcb" gutterBottom>
                {event.college ? event.college.name : "College not available"}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                {event.date}
              </Typography>
            </CardContent>

            {/* Show "Know More" Button Only for Ongoing Events */}
            {!isUpcoming && (
              <Box sx={{ textAlign: "center", pb: 2 }}>
                <Button 
                  component={Link} 
                  to={`/event/${event._id}`} 
                  variant="contained" 
                  sx={{ 
                    bgcolor: "#d32f2f", 
                    color: "white", 
                    borderRadius: 8,
                    fontWeight: "bold",
                    px: 3,
                    py: 1,
                    "&:hover": { bgcolor: "#ff4444" }
                  }}
                >
                  Know More
                </Button>
              </Box>
            )}
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default EventCards;
