import React, { useEffect, useMemo, useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Tabs,
  Tab,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import FestivalIcon from "@mui/icons-material/Festival";
// import { getAllEvents } from "../api-helpers/api-helpers";
import { Link } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useDispatch, useSelector } from "react-redux";
import { adminActions, userActions } from "../store";
import { motion } from "framer-motion";

const Header = () => {
  const dispatch = useDispatch();
  const isAdminLoggedIn = useSelector((state) => state.admin.isLoggedIn);
  const isUserLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const userProfile = useSelector((state) => state.user.profile);
  // const userId = useSelector((state) => state.user.userId); // Get userId from Redux

  const [value, setValue] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    if ((isUserLoggedIn || isAdminLoggedIn) && value === 1) {
      setValue(0);
    }
  }, [isUserLoggedIn, isAdminLoggedIn, value]);

  const logout = (isAdmin) => {
    dispatch(isAdmin ? adminActions.logout() : userActions.logout());
  };

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const headerVariants = useMemo(() => ({
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  }), []);

  return (
    <motion.div initial="hidden" animate="visible" variants={headerVariants}>
      <AppBar
        position="static"
        sx={{
          background: "linear-gradient(135deg, #1a1a1a 30%, #2c2c2c 100%)",
          backdropFilter: "blur(10px)",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.5)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          height: "80px",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: "100%",
            px: { xs: 2, md: 4 },
          }}
        >
          {/* Logo and Title */}
          <Box display="flex" alignItems="center">
            <Link
              to="/"
              style={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <FestivalIcon
                fontSize="large"
                sx={{ color: "#ffcc00", cursor: "pointer", mr: 2 }}
              />
              <Typography
                variant="h5"
                fontWeight="bold"
                sx={{
                  color: "white",
                  letterSpacing: 2,
                  transition: "color 0.3s",
                  "&:hover": { color: "#ffcc00" },
                }}
              >
                UniFesta
              </Typography>
            </Link>
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Tabs
              value={value}
              onChange={(e, val) => setValue(val)}
              textColor="inherit"
              sx={{
                "& .MuiTab-root": {
                  fontSize: "1rem",
                  fontWeight: "500",
                  letterSpacing: "0.5px",
                  transition: "color 0.3s, transform 0.3s",
                  "&:hover": { color: "#ffcc00", transform: "translateY(-2px)" },
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: "#ffcc00",
                  height: "3px",
                },
              }}
            >
              {!isAdminLoggedIn && <Tab label="Events" component={Link} to="/events" />}

              {!isAdminLoggedIn && !isUserLoggedIn && (
                <Tab
                  key="auth"
                  label="Login"
                  component={Link}
                  to="/auth"
                  sx={{
                    textDecoration: "none",
                    "&.Mui-selected": {
                      textDecoration: "none",
                    },
                    "&:hover": {
                      textDecoration: "none",
                    },
                  }}
                />
              )}

              {/* Conditionally render User Profile and Logout */}
              {isUserLoggedIn && !isAdminLoggedIn && (
                <Box sx={{ display: "flex", alignItems: "center", ml: 3 }}>
                  <IconButton onClick={handleAvatarClick} sx={{ p: 0 }}>
                    <Avatar
                      src={userProfile?.avatar || "/default-avatar.png"}
                      sx={{
                        cursor: "pointer",
                        width: 40,
                        height: 40,
                        border: "2px solid #e0e0e0",
                        transition: "transform 0.3s ease-in-out, border-color 0.3s ease-in-out",
                        "&:hover": {
                          transform: "scale(1.1)",
                          borderColor: "#ffcc00",
                        },
                      }}
                    />
                  </IconButton>

                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleCloseMenu}
                    sx={{
                      mt: 1.5,
                      "& .MuiMenu-paper": {
                        background: "linear-gradient(135deg, #2c2c2c 30%, #1a1a1a 100%)",
                        color: "white",
                        borderRadius: "12px",
                        minWidth: "180px",
                        p: 1,
                        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.5)",
                      },
                    }}
                  >
                    <MenuItem
                      disabled
                      sx={{
                        fontWeight: "bold",
                        color: "#ffcc00",
                        fontSize: "1rem",
                        textAlign: "center",
                        justifyContent: "center",
                      }}
                    >
                      {userProfile?.name || "User"}
                    </MenuItem>

                    <MenuItem
                      component={Link}
                      to="/profile" // Use userId from Redux
                      onClick={handleCloseMenu}
                      sx={{
                        "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
                      }}
                    >
                      Profile
                    </MenuItem>
                    <MenuItem
                      component={Link}
                      to="/bookings"
                      onClick={handleCloseMenu}
                      sx={{
                        "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
                      }}
                    >
                      Bookings
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        logout(false);
                        handleCloseMenu();
                      }}
                      sx={{
                        "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
                      }}
                    >
                      Logout
                    </MenuItem>
                  </Menu>
                </Box>
              )}

              {/* Conditionally render Admin Dashboard and Logout */}
              {isAdminLoggedIn && [
                <Tab
                  key="dashboard"
                  label="Dashboard"
                  component={Link}
                  target="_blank"
                  to="/admin/dashboard"
                />,
                <Tab
                  key="admin-logout"
                  label="Logout"
                  onClick={() => logout(true)}
                  component={Link}
                  to="/"
                />,
              ]}
            </Tabs>
          )}

          {/* Mobile Menu (Hamburger Icon) */}
          {isMobile && (
            <IconButton
              sx={{ color: "#ffffff" }}
              onClick={() => setDrawerOpen(true)}
            >
              <MenuIcon fontSize="large" />
            </IconButton>
          )}
        </Toolbar>

        {/* Drawer for Mobile Navigation */}
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        >
          <Box
            sx={{
              width: 280,
              background: "linear-gradient(135deg, #1a1a1a 30%, #2c2c2c 100%)",
              height: "100vh",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              color: "white",
              padding: 2,
            }}
          >
            <List>
              <ListItem button component={Link} to="/" onClick={() => setDrawerOpen(false)}>
                <ListItemText primary="Home" sx={{ color: "#ffcc00" }} />
              </ListItem>
              {!isAdminLoggedIn && (
                <ListItem button component={Link} to="/events" onClick={() => setDrawerOpen(false)}>
                  <ListItemText primary="Events" sx={{ color: "#ffcc00" }} />
                </ListItem>
              )}
              {!isUserLoggedIn && !isAdminLoggedIn && (
                <ListItem button component={Link} to="/auth" onClick={() => setDrawerOpen(false)}>
                  <ListItemText primary="Login" sx={{ color: "#ffcc00" }} />
                </ListItem>
              )}

              {/* User Logged In Options */}
              {isUserLoggedIn && !isAdminLoggedIn && (
                <>
                  <ListItem button component={Link} to="/profile" onClick={() => setDrawerOpen(false)}>
                    <ListItemText primary="Profile" sx={{ color: "#ffcc00" }} />
                  </ListItem>
                  <ListItem button component={Link} to="/bookings" onClick={() => setDrawerOpen(false)}>
                    <ListItemText primary="Bookings" sx={{ color: "#ffcc00" }} />
                  </ListItem>
                  <ListItem button onClick={() => { logout(false); setDrawerOpen(false); }}>
                    <ListItemText primary="Logout" sx={{ color: "#ffcc00" }} />
                  </ListItem>
                </>
              )}

              {/* Admin Options */}
              {isAdminLoggedIn && (
                <>
                  <ListItem button component={Link} to="/admin/dashboard" onClick={() => setDrawerOpen(false)}>
                    <ListItemText primary="Dashboard" sx={{ color: "#ffcc00" }} />
                  </ListItem>
                  <ListItem button onClick={() => { logout(true); setDrawerOpen(false); }}>
                    <ListItemText primary="Logout" sx={{ color: "#ffcc00" }} />
                  </ListItem>
                </>
              )}
            </List>
          </Box>
        </Drawer>
      </AppBar>
    </motion.div>
  );
};

export default Header;