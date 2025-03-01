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
        px: { xs: 3, md: 6 },
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Main Footer Content */}
      <Grid container spacing={5} maxWidth="1200px" mx="auto">
        {/* About Section */}
        <Grid item xs={12} md={4} sx={{ display: "flex", justifyContent: "flex-start" }}>
          <Box
            component="img"
            src="/logo1.png"
            alt="UniFesta Logo"
            sx={{
              width: "280px", 
              height: "auto", 
            }}
          />
        </Grid>

        {/* Quick Links */}
        <Grid item xs={6} md={2} ml={-3}>
          <Typography variant="h6" fontWeight="bold" color="#FFD700" gutterBottom>
            Quick Links
          </Typography>
          <Box display="flex" flexDirection="column" gap={1.8}>
            {["Events", "Admin", "Contact"].map((item) => (
              <Link key={item} to={`/${item.toLowerCase()}`} style={{ textDecoration: "none", color: "white" }}>
                <Typography variant="body2" sx={{ opacity: 0.8, "&:hover": { opacity: 1, color: "#FFD700" } }}>
                  {item}
                </Typography>
              </Link>
            ))}
          </Box>
        </Grid>

        {/* Resources */}
        <Grid item xs={6} md={2}>
          <Typography variant="h6" fontWeight="bold" color="#FFD700" gutterBottom>
            Resources
          </Typography>
          <Box display="flex" flexDirection="column" gap={1.8}>
            {["FAQ", "Privacy Policy", "Terms of Service"].map((item) => (
              <Link key={item} to={'/'} style={{ textDecoration: "none", color: "white" }}>
                <Typography variant="body2" sx={{ opacity: 0.8, "&:hover": { opacity: 1, color: "#FFD700" } }}>
                  {item}
                </Typography>
              </Link>
            ))}
          </Box>
        </Grid>

        {/* Contact Info */}
        <Grid item xs={12} md={4}>
          <Typography variant="h6" fontWeight="bold" color="#FFD700" gutterBottom>
            Contact Us
          </Typography>
          <Box display="flex" flexDirection="column" gap={1.8}>
            <Box display="flex" alignItems="center" gap={1}>
              <EmailIcon sx={{ color: "#FFD700" }} />
              <Typography variant="body2" sx={{ opacity: 0.8 }}>support@unifesta.com</Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <PhoneIcon sx={{ color: "#FFD700" }} />
              <Typography variant="body2" sx={{ opacity: 0.8 }}>+91 98765 43210</Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Horizontal Divider */}
      <Divider sx={{ my: 4, bgcolor: "rgba(255, 215, 0, 0.5)" }} />

      {/* Social Media Section */}
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

      {/* Copyright Section */}
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
