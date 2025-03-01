import React from "react";
import { Box, Typography, IconButton, Grid, Divider } from "@mui/material";
import { Link } from "react-router-dom";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";

const Footer = () => {
  return (
    <footer id="footer">
      <Box
        component="footer"
        sx={{
          bgcolor: "#212121",
          color: "white",
          pt: 6,
          pb: 4,
          px: { xs: 4, md: 6 },
          textAlign: { xs: "center", md: "left" },
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <Grid container spacing={4} maxWidth="1200px" mx="auto">
          <Grid item xs={12} md={4} display="flex" justifyContent={{ xs: "center", md: "flex-start" }}>
            <Box
              component="img"
              src="/logo1.png"
              alt="UniFesta Logo"
              sx={{
                width: { xs: "200px", md: "280px" },
                height: "auto",
              }}
            />
          </Grid>

          <Grid item xs={6} md={2}>
            <Typography variant="h6" fontWeight="bold" color="#FFD700" gutterBottom>
              Quick Links
            </Typography>
            <Box display="flex" flexDirection="column" gap={1.5}>
              {["Events", "Contact"].map((item) => (
                <Link key={item} to={`/${item.toLowerCase()}`} style={{ textDecoration: "none", color: "white" }}>
                  <Typography variant="body2" sx={{ opacity: 0.8, "&:hover": { opacity: 1, color: "#FFD700" } }}>
                    {item}
                  </Typography>
                </Link>
              ))}
            </Box>
          </Grid>

          <Grid item xs={6} md={2}>
            <Typography variant="h6" fontWeight="bold" color="#FFD700" gutterBottom>
              Resources
            </Typography>
            <Box display="flex" flexDirection="column" gap={1.5}>
              {["FAQ", "Privacy Policy", "Terms of Service"].map((item) => (
                <Link key={item} to={"/"} style={{ textDecoration: "none", color: "white" }}>
                  <Typography variant="body2" sx={{ opacity: 0.8, "&:hover": { opacity: 1, color: "#FFD700" } }}>
                    {item}
                  </Typography>
                </Link>
              ))}
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h6" fontWeight="bold" color="#FFD700" gutterBottom>
              Contact Us
            </Typography>
            <Box display="flex" flexDirection="column" gap={1.5}>
              <Box display="flex" alignItems="center" gap={1} justifyContent={{ xs: "center", md: "flex-start" }}>
                <EmailIcon sx={{ color: "#FFD700" }} />
                <Typography variant="body2" sx={{ opacity: 0.8 }}>support@unifesta.com</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1} justifyContent={{ xs: "center", md: "flex-start" }}>
                <PhoneIcon sx={{ color: "#FFD700" }} />
                <Typography variant="body2" sx={{ opacity: 0.8 }}>+91 98765 43210</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, bgcolor: "rgba(255, 215, 0, 0.5)" }} />

        <Box textAlign="center">
          <Typography variant="body1" fontWeight="bold" color="#FFD700" mb={1}>
            Connect with us
          </Typography>
          <Box display="flex" justifyContent="center" gap={2}>
            {[FacebookIcon, InstagramIcon, TwitterIcon, EmailIcon].map((Icon, index) => (
              <IconButton key={index} sx={{ bgcolor: "#FFD700", color: "#1A1A1A", "&:hover": { bgcolor: "#C0A000" } }}>
                <Icon />
              </IconButton>
            ))}
          </Box>
        </Box>

        <Box mt={4} textAlign="center">
          <Typography variant="body2" sx={{ opacity: 0.6 }}>
            Made with ❤️ by Mandy | © {new Date().getFullYear()} UniFesta. All Rights Reserved.
          </Typography>
        </Box>
      </Box>
    </footer>
  );
};

export default Footer;
