import React, { useEffect, useState } from "react";
import { Box, Typography, CardMedia, useMediaQuery } from "@mui/material"; 
import { useTheme } from "@mui/material/styles";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import EventCards from "./Events/EventCards";
import { getAllEvents } from "../api-helpers/api-helpers";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos"; 
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos"; 

const HomePage = () => {
  const [events, setEvents] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    getAllEvents()
      .then((data) => setEvents(data.events))
      .catch((err) => console.error("Error fetching events:", err));
  }, []);

  const eventBanners = [
    "https://media.licdn.com/dms/image/v2/D4D1EAQHSsAsYoMHOEA/event-background-image-crop_720_1280/event-background-image-crop_720_1280/0/1671284860648?e=2147483647&v=beta&t=C5D3bl-TGxBZ1JrdRTcSYJDiojPTf1SpUl0wm7cbF2Y",
    "https://i.ytimg.com/vi/_TM9ROHi3j0/sddefault.jpg"
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };

  // Filter events
  const ongoingEvents = events.filter(event => event.eventStatus === "Ongoing");
  const upcomingEvents = events.filter(event => event.eventStatus === "Upcoming");

  return (
    <Box sx={{ bgcolor: "#121212", minHeight: "100vh", color: "#E0E0E0", py: 4, px: { xs: 2, md: 6 } }}>
  {/* Image Slider */}
  <Box
    sx={{
      width: "100%",
      maxWidth: "1200px",
      mx: "auto",
      borderRadius: 4,
      overflow: "hidden",
      boxShadow: "0 6px 15px rgba(0, 0, 0, 0.3)",
    }}
  >
    <Slider {...settings}>
      {eventBanners.map((banner, index) => (
        <Box key={index} sx={{ width: "100%" }}>
          <CardMedia
            component="img"
            image={banner}
            alt={`Event Banner ${index + 1}`}
            sx={{
              width: "100%",
              height: { xs: "250px", sm: "350px", md: "450px" },
              objectFit: "cover",
              borderRadius: 2,
            }}
          />
        </Box>
      ))}
    </Slider>
  </Box>

  {/* Ongoing Events Section */}
  {ongoingEvents.length > 0 && (
    <Box sx={{ mt: { xs: 4, md: 6 } }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 3 }}>
        <ArrowBackIosIcon sx={{ fontSize: isMobile ? 24 : 32, color: "#BB86FC", mr: 2 }} />
        <Typography
          variant={isMobile ? "h5" : "h4"}
          align="center"
          sx={{
            fontWeight: "bold",
            letterSpacing: 1.2,
            textTransform: "uppercase",
            color: "#BB86FC",
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          Happening
        </Typography>
        <ArrowForwardIosIcon sx={{ fontSize: isMobile ? 24 : 32, color: "#BB86FC", ml: 2 }} />
      </Box>
      <EventCards events={ongoingEvents} isUpcoming={false} />
    </Box>
  )}

  {/* Upcoming Events Section */}
  {upcomingEvents.length > 0 && (
    <Box sx={{ mt: { xs: 4, md: 6 } }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 3 }}>
        <ArrowBackIosIcon sx={{ fontSize: isMobile ? 24 : 32, color: "#BB86FC", mr: 2 }} />
        <Typography
          variant={isMobile ? "h5" : "h4"}
          align="center"
          sx={{
            fontWeight: "bold",
            letterSpacing: 1.2,
            textTransform: "uppercase",
            color: "#BB86FC",
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          Upcoming
        </Typography>
        <ArrowForwardIosIcon sx={{ fontSize: isMobile ? 24 : 32, color: "#BB86FC", ml: 2 }} />
      </Box>
      <EventCards events={upcomingEvents} isUpcoming={true} />
    </Box>
  )}
</Box>
  );
};

export default HomePage;
