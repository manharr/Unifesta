import React, { useState, useEffect, useCallback } from "react";
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
import { useSearchParams } from "react-router-dom";

const ManageReg = () => {
  const [bookings, setBookings] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get("event"); // Get event ID from URL

  const fetchBookings = useCallback(async () => {
    try {
      const data = await getAllBookings();
      let filteredBookings = data.bookings || [];

      if (eventId) {
        filteredBookings = filteredBookings.filter(
          (booking) => booking.event?._id === eventId
        );
      }

      setBookings(filteredBookings);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setSnackbarMessage("Failed to load registrations.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  }, [eventId]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

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
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#333", mb: 3, textAlign: "center" }}>
          {eventId ? "Event-Specific Registrations" : "Manage All Registrations"}
        </Typography>

        <Paper elevation={3} sx={{ p: 2, overflow: "hidden" }}>
          <TableContainer sx={{ width: "100%", overflowX: "hidden" }}>
            <Table sx={{ tableLayout: "fixed", width: "100%" }}>
              <TableHead>
                <TableRow sx={{ bgcolor: "#eeeeee" }}>
                  {[
                    { label: "Ticket Number", width: "120px" },
                    { label: "Event", width: "150px" },
                    { label: "Sub-Event", width: "180px" },
                    { label: "User", width: "150px" },
                    { label: "Email", width: "200px" },
                    { label: "Contact", width: "150px" },
                    { label: "College", width: "200px" },
                    { label: "Registered On", width: "150px" },
                    { label: "Actions", width: "100px" },
                  ].map((column, idx) => (
                    <TableCell
                      key={idx}
                      sx={{
                        fontWeight: "bold",
                        fontSize: "1rem",
                        color: "#333",
                        maxWidth: column.width,
                        wordWrap: "break-word",
                        whiteSpace: "normal",
                      }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {bookings.length > 0 ? (
                  bookings.map((booking) => (
                    <TableRow key={booking._id} sx={{ "&:nth-of-type(odd)": { bgcolor: "#fafafa" } }}>
                      <TableCell sx={{ fontWeight: "bold" }}>{booking.ticketNumber || "N/A"}</TableCell>
                      <TableCell sx={{ wordWrap: "break-word" }}>{booking.event?.title || "N/A"}</TableCell>
                      <TableCell sx={{ wordWrap: "break-word" }}>{booking.subEvent?.description || "N/A"}</TableCell>
                      <TableCell sx={{ wordWrap: "break-word" }}>{booking.user?.name || "Unknown"}</TableCell>
                      <TableCell sx={{ wordWrap: "break-word" }}>{booking.user?.email || "N/A"}</TableCell>
                      <TableCell sx={{ wordWrap: "break-word" }}>{booking.contact || "N/A"}</TableCell>
                      <TableCell sx={{ wordWrap: "break-word" }}>{booking.college || "N/A"}</TableCell>
                      <TableCell sx={{ wordWrap: "break-word" }}>{new Date(booking.registeredOn).toLocaleDateString()}</TableCell>
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
                      {eventId ? "No registrations found for this event." : "No registrations found."}
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
