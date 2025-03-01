import React, { useEffect, useState } from "react";
import { Container, Typography, Box } from "@mui/material";
import EventCards from "./EventCards";
import { getAllEvents } from "../../api-helpers/api-helpers";

const Events = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    getAllEvents()
      .then((data) => {
        setEvents(data.events);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4}}>
      {/* Header Section */}
      <Box sx={{ mb: 5, textAlign: "center" }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: "bold",
            color: "#c9c616",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          ALL EVENTS
        </Typography>
      </Box>

      {/* Event Cards Section */}
      <EventCards events={events} isUpcoming={true} />
    </Container>
  );
};

export default Events;
