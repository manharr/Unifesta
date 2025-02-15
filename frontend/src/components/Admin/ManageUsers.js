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
import { Link } from "react-router-dom";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import Sidebar from "./Sidebar";
import { getAllUsers, deleteUser } from "../../api-helpers/api-helpers";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setSnackbarMessage("Unauthorized: Please log in.");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
          return;
        }
        const data = await getAllUsers(token);
        setUsers(data.users);
      } catch (err) {
        setSnackbarMessage("Failed to load users.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    };
    fetchUsers();
  }, []);

  const handleDeleteUser = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setSnackbarMessage("Unauthorized: Please log in.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
      }

      await deleteUser(id, token);
      setUsers((prev) => prev.filter((user) => user._id !== id));
      setSnackbarMessage("User deleted successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err) {
      setSnackbarMessage("Failed to delete user. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  return (
    <Box sx={{ display: "flex", bgcolor: "#F5F5F5", minHeight: "100vh" }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: "bold", color: "#333" }}>
            Manage Users
          </Typography>
        </Box>

        <Paper elevation={3} sx={{ p: 2 }}>
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: "#eeeeee" }}>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "1.1rem", color: "#333" }}>
                    Name
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "1.1rem", color: "#333" }}>
                    Email
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "1.1rem", color: "#333" }}>
                    Bookings Count
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "1.1rem", color: "#333" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <TableRow key={user._id} sx={{ "&:nth-of-type(odd)": { bgcolor: "#fafafa" } }}>
                      <TableCell sx={{ fontSize: "1rem", color: "#333" }}>{user.name}</TableCell>
                      <TableCell sx={{ fontSize: "1rem", color: "#333" }}>{user.email}</TableCell>
                      <TableCell sx={{ fontSize: "1rem", color: "#333" }}>{user.bookings?.length || 0}</TableCell>
                      <TableCell>
                        <Tooltip title="Edit User">
                          <IconButton
                            component={Link}
                            to={`/admin/edit-user/${user._id}`}
                            sx={{ color: "#1976D2", "&:hover": { bgcolor: "#E3F2FD" } }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete User">
                          <IconButton
                            onClick={() => handleDeleteUser(user._id)}
                            sx={{ color: "#D32F2F", "&:hover": { bgcolor: "#FFEBEE" } }}
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
                      No users found.
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

export default ManageUsers;
