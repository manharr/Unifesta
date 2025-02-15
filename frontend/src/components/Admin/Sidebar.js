import React from "react";
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Drawer,
  Typography,
  Divider,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Event as EventIcon,
  School as SchoolIcon,
  People as PeopleIcon,
  Assessment as AssessmentIcon,
  Business as BusinessIcon,
} from "@mui/icons-material";
import FestivalIcon from "@mui/icons-material/Festival";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate, useLocation } from "react-router-dom";

const sidebarItems = [
  { text: "Dashboard", path: "/admin/dashboard", icon: <DashboardIcon /> },
  { text: "Events", path: "/admin/manage-event", icon: <FestivalIcon /> },
  { text: "Sub Events", path: "/admin/manage-subevent", icon: <EventIcon /> },
  { text: "Colleges", path: "/admin/manage-colleges", icon: <SchoolIcon /> },
  { text: "Users", path: "/admin/manage-users", icon: <AccountCircleIcon /> },
  { text: "Registrations", path: "/admin/registrations", icon: <PeopleIcon /> },
  { text: "Reports", path: "/admin/reports", icon: <AssessmentIcon /> },
  { text: "Sponsors", path: "/admin/sponsors", icon: <BusinessIcon /> },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 280,
        height: "100vh",
        flexShrink: 0,
        overflowX: "hidden",
        "& .MuiDrawer-paper": {
          width: 280,
          height: "100vh",
          overflowX: "hidden", 
          overflowY: "auto", 
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          bgcolor: "#ffffff",
          color: "#333",
          borderRight: "1px solid #ddd",
          boxShadow: "2px 0px 10px rgba(0, 0, 0, 0.1)",
          boxSizing: "border-box", 
        },
      }}
    >
      {/* Admin Title */}
      <Typography
        variant="h5"
        sx={{
          textAlign: "center",
          mt: 3,
          mb: 3,
          fontWeight: "bold",
          color: "#1976d2",
          whiteSpace: "nowrap", 
        }}
      >
        Welcome Admin
      </Typography>

      <Divider />

      {/* Sidebar Items */}
      <List sx={{ flexGrow: 1 }}>
        {sidebarItems.map((item, index) => (
          <ListItem
            button
            key={index}
            onClick={() => navigate(item.path)}
            sx={{
              borderRadius: "8px",
              mx: 1, 
              my: 1,
              px: 2,
              "&:hover": { bgcolor: "#f0f0f0" },
              bgcolor: location.pathname === item.path ? "#e3f2fd" : "transparent",
              whiteSpace: "nowrap",
            }}
          >
            <ListItemIcon sx={{ color: "#1976d2", minWidth: "40px" }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              primaryTypographyProps={{ fontSize: "1rem", fontWeight: "500" }}
            />
          </ListItem>
        ))}
      </List>

      <Divider />
    </Drawer>
  );
};

export default Sidebar;
