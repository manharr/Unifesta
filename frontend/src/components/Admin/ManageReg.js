import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
  Alert,
  Typography,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import Sidebar from "./Sidebar";
import { getAllBookings, deleteBooking } from "../../api-helpers/api-helpers";
import { Delete as DeleteIcon } from "@mui/icons-material";

const ManageReg = () => {
  const [bookings, setBookings] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const data = await getAllBookings();
      setBookings(data.bookings || []);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setSnackbarMessage("Failed to load registrations.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteBooking(id);
      setSnackbarMessage("Booking deleted successfully.");
      setSnackbarSeverity("success");
      setBookings((prev) => prev.filter((booking) => booking._id !== id));
    } catch (err) {
      console.error("Error deleting booking:", err);
      setSnackbarMessage("Failed to delete booking.");
      setSnackbarSeverity("error");
    }
    setSnackbarOpen(true);
  };

  return (
    <Box sx={{ display: "flex", bgcolor: "#F5F5F5", minHeight: "100vh", overflow: "hidden" }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, p: 3, maxWidth: "100vw", overflowX: "hidden" }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#333", mb: 3 }}>
          Manage Registrations
        </Typography>

        <Paper elevation={3} sx={{ p: 2, overflow: "hidden" }}>
          <TableContainer sx={{ maxWidth: "100%", overflowX: "auto" }}>
            <Table sx={{ minWidth: "100%" }}>
              <TableHead>
                <TableRow sx={{ bgcolor: "#eeeeee" }}>
                  {["Ticket Number", "Event", "Sub-Event", "User", "Email", "Contact", "College", "Registered On", "Actions"].map((header, idx) => (
                    <TableCell key={idx} sx={{ fontWeight: "bold", fontSize: "1rem", color: "#333", whiteSpace: "nowrap" }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {bookings.length > 0 ? (
                  bookings.map((booking) => (
                    <TableRow key={booking._id} sx={{ "&:nth-of-type(odd)": { bgcolor: "#fafafa" }, height: "60px" }}>
                      <TableCell sx={{ fontSize: "1rem", color: "#333", fontWeight: "bold", whiteSpace: "nowrap" }}>
                        {booking.ticketNumber || "N/A"}
                      </TableCell>
                      <TableCell sx={{ fontSize: "1rem", color: "#333", whiteSpace: "nowrap" }}>
                        {booking.event?.title || "N/A"}
                      </TableCell>
                      <TableCell sx={{ fontSize: "1rem", color: "#333", whiteSpace: "nowrap" }}>
                        {booking.subEvent?.description || "N/A"}
                      </TableCell>
                      <TableCell sx={{ fontSize: "1rem", color: "#333", whiteSpace: "nowrap" }}>
                        {booking.user?.name || "Unknown"}
                      </TableCell>
                      <TableCell sx={{ fontSize: "1rem", color: "#333", whiteSpace: "nowrap" }}>
                        {booking.user?.email || "N/A"}
                      </TableCell>
                      <TableCell sx={{ fontSize: "1rem", color: "#333", whiteSpace: "nowrap" }}>
                        {booking.contact || "N/A"}
                      </TableCell>
                      <TableCell sx={{ fontSize: "1rem", color: "#333", whiteSpace: "nowrap" }}>
                        {booking.college || "N/A"}
                      </TableCell>
                      <TableCell sx={{ fontSize: "1rem", color: "#333", whiteSpace: "nowrap" }}>
                        {new Date(booking.registeredOn).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Delete Registration">
                          <IconButton
                            sx={{
                              color: "#D32F2F",
                              "&:hover": { bgcolor: "#FFEBEE" },
                            }}
                            onClick={() => handleDelete(booking._id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} sx={{ textAlign: "center", fontSize: "1rem", color: "#777", py: 2 }}>
                      No registrations found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={() => setSnackbarOpen(false)}>
          <Alert severity={snackbarSeverity} sx={{ width: "100%" }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default ManageReg;
