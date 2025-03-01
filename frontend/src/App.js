import React, { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom"; 
import { Box } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useDispatch } from "react-redux";
import { adminActions, userActions } from "./store";

import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./components/HomePage";
import Events from "./components/Events/Events";
import Admin from "./components/Admin/Admin";
import Auth from "./components/Auth/Auth";
import Booking from "./components/Bookings/Booking";
import AdminDashboard from "./components/Admin/AdminDashboard";
import ProtectedRoute from "./components/Routes/ProtectedRoute";
import AddCollege from "./components/Admin/AddCollege";
import ManageColleges from "./components/Admin/ManageColleges";
import EditCollege from "./components/Admin/EditCollege";
import ManageEvent from "./components/Admin/ManageEvent";
import ViewEvent from "./components/Admin/ViewEvent";
import EditEvent from "./components/Admin/EditEvent";
import AddEvent from "./components/Admin/AddEvent";
import ManageSubevent from "./components/Admin/ManageSubevent";
import ViewSubevents from "./components/Admin/ViewSubevents";
import EditSubevent from "./components/Admin/EditSubevent";
import AddSubevent from "./components/Admin/AddSubevent";
import ManageUsers from "./components/Admin/ManageUsers";
import ManageReg from "./components/Admin/ManageReg";
import UserBookings from "./components/Bookings/UserBookings";
import SuccessPage from "./components/Bookings/SuccessPage";
import UserProfile from "./components/Bookings/UserProfile";
import Reports from "./components/Admin/Reports";
import ManageSponsors from "./components/Admin/ManageSponsors";
import AddSponsor from "./components/Admin/AddSponsor";
import ViewSponsors from "./components/Admin/ViewSponsor";
import EditSponsor from "./components/Admin/EditSponsor";

const theme = createTheme({
  typography: {
    fontFamily: "'Montserrat', sans-serif",
  },
  palette: {
    primary: {
      main: "#FFD700",
    },
    background: {
      default: "#101010",
    },
  },
});

function App() {
  const dispatch = useDispatch();
  const location = useLocation(); 

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedAdminId = localStorage.getItem("adminId");
  
    if (storedUserId) {
      dispatch(userActions.login(storedUserId));  
    } else if (storedAdminId) {
      dispatch(adminActions.login()); 
    }
  }, [dispatch]);
  

  const isAdminRoute = location.pathname.startsWith("/admin/");

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Header and Footer only if NOT on Admin Dashboard */}
      {!isAdminRoute && <Header />}
      
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/events" element={<Events />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/bookings" element={<UserBookings />} />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                    <AdminDashboard />

                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/manage-users/"
              element={
                <ProtectedRoute>
                  <ManageUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/add-college"
              element={
                <ProtectedRoute>
                  <AddCollege />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/manage-colleges"
              element={
                <ProtectedRoute>
                  <ManageColleges />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/edit-college/:id"
              element={
                <ProtectedRoute>
                  <EditCollege />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/manage-event"
              element={
                <ProtectedRoute>
                  <ManageEvent />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/view-event/:id"
              element={
                <ProtectedRoute>
                  <ViewEvent />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/edit-event/:id"
              element={
                <ProtectedRoute>
                  <EditEvent />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/add-event"
              element={
                <ProtectedRoute>
                  <AddEvent />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/manage-subevent"
              element={
                <ProtectedRoute>
                  <ManageSubevent />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/view-subevent/:eventId"
              element={
                <ProtectedRoute>
                  <ViewSubevents />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/edit-subevent/:id"
              element={
                <ProtectedRoute>
                  <EditSubevent />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/add-subevent/:eventId"
              element={
                <ProtectedRoute>
                  <AddSubevent />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/registrations"
              element={
                <ProtectedRoute>
                  <ManageReg />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/reports"
              element={
                <ProtectedRoute>
                  <Reports />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/sponsors"
              element={
                <ProtectedRoute>
                  <ManageSponsors />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/add-sponsor/:eventId"
              element={
                <ProtectedRoute>
                  <AddSponsor />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/view-sponsor/:eventId"
              element={
                <ProtectedRoute>
                  <ViewSponsors />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/edit-sponsor/:id"
              element={
                <ProtectedRoute>
                  <EditSponsor />
                </ProtectedRoute>
              }
            />
            
            <Route path="/auth" element={<Auth />} />
            <Route path="/event/:id" element={<Booking />} />
          </Routes>
        </Box>
      </ThemeProvider>

      {!isAdminRoute && <Footer />}
    </Box>
  );
}

export default App;
