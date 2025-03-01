import React, { useEffect, useState } from "react";
import { getSponsorsByEvent } from "../../api-helpers/api-helpers";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-coverflow";
import { Box, Typography, Card, CardMedia, CardContent } from "@mui/material";

const SponsorSlider = ({ eventId }) => {
  const [sponsors, setSponsors] = useState([]);

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const sponsorData = await getSponsorsByEvent(eventId);
        setSponsors(sponsorData?.sponsors || []);
      } catch (err) {
        console.error("Error fetching sponsors:", err);
      }
    };
    fetchSponsors();
  }, [eventId]);

  return (
    <Box
      sx={{
        mt: 6,
        mb: 6,
        py: 5,
        borderRadius: 4,
        boxShadow: "0px 4px 15px rgba(0,0,0,0.5)",
        textAlign: "center",
        background: "linear-gradient(135deg, #0F0F0F, #1A1A1A)",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          mb: 3,
          fontWeight: "700",
          color: "#BB86FC",
          textTransform: "uppercase",
          letterSpacing: "1px",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        Our Sponsors
      </Typography>

      {sponsors.length > 0 ? (
        <Swiper
          modules={[Navigation, EffectCoverflow]}
          effect="coverflow"
          grabCursor={true}
          centeredSlides={true}
          slidesPerView="auto"
          navigation
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 250,
            modifier: 1,
            slideShadows: false,
          }}
          style={{ maxWidth: "1100px", margin: "auto", padding: "20px 0" }}
        >
          {sponsors.map((sponsor, index) => (
            <SwiperSlide key={index} style={{ maxWidth: "320px" }}>
              <Card
                sx={{
                  bgcolor: "#1E1E1E",
                  boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.7)",
                  borderRadius: "12px",
                  overflow: "hidden",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.06)",
                    boxShadow: "0px 12px 30px rgba(0, 0, 0, 0.9)",
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="180"
                  image={
                    sponsor.image.startsWith("http")
                      ? sponsor.image
                      : `http://localhost:5000${sponsor.image}`
                  }
                  alt={sponsor.name}
                  sx={{
                    objectFit: "cover",
                    width: "100%",
                    height: "180px",
                    bgcolor: "#1A1A1A",
                  }}
                />
                <CardContent
                  sx={{
                    bgcolor: "linear-gradient(145deg, #1E1E1E, #252525)",
                    py: 2.5,
                    px: 3,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#FFFFFF",
                      fontWeight: "600",
                      fontSize: "1.2rem",
                      fontFamily: "'Inter', sans-serif",
                      textAlign: "center",
                    }}
                  >
                    {sponsor.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#ffe035",
                      fontSize: "0.95rem",
                      mt: 1,
                      textAlign: "center",
                      fontWeight: "500",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    {sponsor.type}
                  </Typography>
                </CardContent>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <Typography
          variant="body1"
          sx={{
            color: "#E0E0E0",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          No sponsors available for this event.
        </Typography>
      )}
    </Box>
  );
};

export default SponsorSlider;
