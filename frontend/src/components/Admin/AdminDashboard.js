import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Grid,
  Paper,
} from "@mui/material";
import { ExitToApp as ExitToAppIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { adminActions } from "../../store";
import Sidebar from "./Sidebar";
import { getAllColleges, getAllEvents, getAllBookings } from "../../api-helpers/api-helpers";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const [collegeCount, setCollegeCount] = useState(0); 
  const [eventCount, setEventCount] = useState(0);
  const [bookingCount, setBookingCount] = useState(0); 


  useEffect(() => {
    const fetchData = async () => {
      try {
        const colleges = await getAllColleges();
        if (colleges && Array.isArray(colleges)) {
          setCollegeCount(colleges.length);
        } else {
          console.error("Invalid college data format:", colleges);
        }
  
        const response = await getAllEvents();
        // console.log("Events API Response:", response); // Debugging
  
        if (response && response.events && Array.isArray(response.events)) {
          setEventCount(response.events.length); 
        } else {
          console.error("Invalid event data format:", response);
        }
        
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
  
    fetchData();
  }, []);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookings = await getAllBookings();
  
        if (bookings && Array.isArray(bookings)) {
          setBookingCount(bookings.length);
        } else if (bookings && Array.isArray(bookings.bookings)) { 
          setBookingCount(bookings.bookings.length);
        } else {
          console.error("Invalid booking data format:", bookings);
        }
      } catch (err) {
        console.error("Error fetching bookings:", err);
      }
    };
  
    fetchData();
  }, []);
  

  const handleLogout = () => {
    dispatch(adminActions.logout());
    navigate("/");
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#F5F5F5" }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, p: 3 }}>
        {/* Top Navbar */}
        <AppBar position="static" sx={{ bgcolor: "#ffffff", boxShadow: 1 }}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold", color: "#333" }}>
              UniFesta Dashboard
            </Typography>
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
              <Avatar sx={{ bgcolor: "#1976D2" }}>A</Avatar>
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)} sx={{ mt: 2 }}>
              <MenuItem onClick={handleLogout}>
                <ExitToAppIcon sx={{ mr: 1 }} /> Logout
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        {/* Dashboard Header */}
        <Typography variant="h4" sx={{ mt: 3, fontWeight: "bold", color: "#333" }}></Typography>
        <Typography sx={{ mt: 1, color: "#666", fontSize: "1.25rem", ml: 2 }}>
          Info
        </Typography>

        {/* Dashboard Stats */}
        <Grid container spacing={3} sx={{ mt: 4 }}>
          {[
            { title: "Total Events", value: eventCount }, 
            { title: "Total Registrations", value: bookingCount  },
            { title: "Total Colleges", value: collegeCount }, 
          ].map((stat, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper elevation={3} sx={{ p: 3, textAlign: "center" }}>
                <Typography variant="h6" sx={{ color: "#555", fontWeight: "medium" }}>
                  {stat.title}
                </Typography>
                <Typography variant="h3" sx={{ mt: 1, color: "#1976D2", fontWeight: "bold" }}>
                  {stat.value}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
