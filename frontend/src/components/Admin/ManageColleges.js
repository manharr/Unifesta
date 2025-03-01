import React, { useState, useEffect } from "react";
import {
  Button,
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
import { Link } from "react-router-dom";
import { Delete as DeleteIcon, Edit as EditIcon, Add as AddIcon } from "@mui/icons-material";
import Sidebar from "./Sidebar";
import { deleteCollege, getAllColleges } from "../../api-helpers/api-helpers";

const ManageColleges = () => {
  const [colleges, setColleges] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Fetch colleges data on component mount
  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const data = await getAllColleges(); // Fetch colleges from API helper
        setColleges(data);
      } catch (err) {
        console.error("Error fetching colleges:", err);
        setSnackbarMessage("Failed to load colleges.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    };
    fetchColleges();
  }, []);

  // Handle college deletion
  const handleDeleteCollege = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setSnackbarMessage("Unauthorized: Please log in.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
      }

      await deleteCollege(id, token); 
      setColleges((prev) => prev.filter((college) => college._id !== id)); 
      setSnackbarMessage("College deleted successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err) {
      console.error("Error deleting college:", err);
      setSnackbarMessage("Failed to delete college. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  return (
    <Box sx={{ display: "flex", bgcolor: "#F5F5F5", minHeight: "100vh" }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, p: 3 }}>
        {/* Page Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: "bold", color: "#333" }}>
            Manage Colleges
          </Typography>
          <Button
            component={Link}
            to="/admin/add-college"
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              bgcolor: "#4CAF50",
              color: "#fff",
              "&:hover": { bgcolor: "#388E3C" },
            }}
          >
            Add College
          </Button>
        </Box>

        {/* Table Container */}
        <Paper elevation={3} sx={{ p: 2 }}>
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: "#eeeeee" }}>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "1.1rem", color: "#333" }}>
                    Name
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "1.1rem", color: "#333" }}>
                    Location
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "1.1rem", color: "#333" }}>
                    Event Count
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "1.1rem", color: "#333" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {colleges.length > 0 ? (
                  colleges.map((college) => (
                    <TableRow key={college._id} sx={{ "&:nth-of-type(odd)": { bgcolor: "#fafafa" } }}>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: "1rem", color: "#333" }}>
                        {college.name}
                      </TableCell>
                      <TableCell sx={{ fontSize: "1rem", color: "#333" }}>
                        {college.location}
                      </TableCell>
                      <TableCell sx={{ fontSize: "1rem", color: "#333" }}>
                        {college.eventCount} 
                      </TableCell>
                      <TableCell>
                        {/* Edit Button */}
                        <Tooltip title="Edit College">
                          <IconButton
                            component={Link}
                            to={`/admin/edit-college/${college._id}`}
                            sx={{
                              color: "#1976D2",
                              "&:hover": { bgcolor: "#E3F2FD" },
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>

                        {/* Delete Button */}
                        <Tooltip title="Delete College">
                          <IconButton
                            onClick={() => handleDeleteCollege(college._id)}
                            sx={{
                              color: "#D32F2F",
                              "&:hover": { bgcolor: "#FFEBEE" },
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} sx={{ textAlign: "center", fontSize: "1rem", color: "#777" }}>
                      No colleges found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Snackbar for feedback */}
        <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={() => setSnackbarOpen(false)}>
          <Alert severity={snackbarSeverity} sx={{ width: "100%" }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default ManageColleges;
