// src/components/Admin/AdminLayout.js
import { Box } from "@mui/material";

const AdminLayout = ({ children }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: "#212121",
        color: "white",
        padding: 3,  
      }}
    >
      {children}
    </Box>
  );
};

export default AdminLayout;
