import { Box, Button, Dialog, FormLabel, IconButton, TextField, Typography, Snackbar, Alert } from "@mui/material";
import React, { useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from "react-router-dom"; 

const AuthForm = ({ onSubmit, isAdmin }) => {
    const [isSignup, setIsSignup] = useState(false);
    const navigate = useNavigate(); 

    const handleClose = () => {
        navigate("/"); 
    };

    const [inputs, setInputs] = useState({
        name: "",
        email: "",
        password: "",
        cpassword: "",
    });

    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState("error");

    const handleCloseSnackbar = () => {
        setMessage(null);
    };

    const handleChange = (e) => {
        setInputs((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    
        if (isSignup) {
            if (!inputs.password || inputs.password.length < 6) {
                setMessage("❌ Password must be at least 6 characters!");
                setMessageType("warning");
                return;
            }
    
            if (inputs.password !== inputs.cpassword) {
                setMessage("⚠️ Passwords do not match!");
                setMessageType("warning");
                return;
            }
        }
    
        onSubmit({ inputs, signup: isAdmin ? false : isSignup });
    };

    return (
        <>
            <Dialog
                open={true}
                onClose={handleClose}
                sx={{
                    "& .MuiPaper-root": {
                        backgroundColor: "#121212",
                        color: "#fff",
                        borderRadius: 8,
                        padding: 4,
                        width: "440px",
                        maxWidth: "90vw",
                        position: "relative",
                        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.8)",
                    },
                }}
            >
                {/* Close Icon */}
                <IconButton 
                    sx={{ position: "absolute", top: 10, right: 10, color: "#fff" }} 
                    onClick={handleClose}
                >
                    <CloseIcon />
                </IconButton>

                <Typography 
                    variant="h4" 
                    fontWeight="bold" 
                    textAlign="center" 
                    sx={{ mb: 3, color: "#f0f0f0", fontFamily: "'Roboto', sans-serif" }}
                >
                    {isSignup ? "Sign Up" : "Login"}
                </Typography>

                <form onSubmit={handleSubmit}>
                    <Box display="flex" flexDirection="column" alignItems="center" px={3} py={2}>
                        {!isAdmin && isSignup && (
                            <>
                                <FormLabel sx={{ color: "#bbb", fontSize: "0.9rem", mb: 1, fontFamily: "'Roboto', sans-serif" }}>
                                    Full Name
                                </FormLabel>
                                <TextField
                                    value={inputs.name}
                                    onChange={handleChange}
                                    margin="dense"
                                    variant="outlined"
                                    type="text"
                                    name="name"
                                    fullWidth
                                    InputProps={{ style: { color: "#fff" } }}
                                    sx={{ bgcolor: "#222", borderRadius: 2, borderColor: "#444", "& .MuiOutlinedInput-root": { "&:hover fieldset": { borderColor: "#ff9800" } } }}
                                />
                            </>
                        )}

                        <FormLabel sx={{ color: "#bbb", fontSize: "0.9rem", mb: 1, fontFamily: "'Roboto', sans-serif" }}>Email</FormLabel>
                        <TextField
                            value={inputs.email}
                            onChange={handleChange}
                            margin="dense"
                            variant="outlined"
                            type="email"
                            name="email"
                            fullWidth
                            InputProps={{ style: { color: "#fff" } }}
                            sx={{ bgcolor: "#222", borderRadius: 2, borderColor: "#444", "& .MuiOutlinedInput-root": { "&:hover fieldset": { borderColor: "#ff9800" } } }}
                        />

                        <FormLabel sx={{ color: "#bbb", fontSize: "0.9rem", mt: 1, mb: 1, fontFamily: "'Roboto', sans-serif" }}>
                            Password
                        </FormLabel>
                        <TextField
                            value={inputs.password}
                            onChange={handleChange}
                            margin="dense"
                            variant="outlined"
                            type="password"
                            name="password"
                            fullWidth
                            InputProps={{ style: { color: "#fff" } }}
                            sx={{ bgcolor: "#222", borderRadius: 2, borderColor: "#444", "& .MuiOutlinedInput-root": { "&:hover fieldset": { borderColor: "#ff9800" } } }}
                        />

                        {isSignup && !isAdmin && (
                            <>
                                <FormLabel sx={{ color: "#bbb", fontSize: "0.9rem", mt: 1, mb: 1, fontFamily: "'Roboto', sans-serif" }}>
                                    Confirm Password
                                </FormLabel>
                                <TextField
                                    value={inputs.cpassword}
                                    onChange={handleChange}
                                    margin="dense"
                                    variant="outlined"
                                    type="password"
                                    name="cpassword"
                                    fullWidth
                                    InputProps={{ style: { color: "#fff" } }}
                                    sx={{ bgcolor: "#222", borderRadius: 2, borderColor: "#444", "& .MuiOutlinedInput-root": { "&:hover fieldset": { borderColor: "#ff9800" } } }}
                                />
                            </>
                        )}

                        <Button
                            sx={{
                                mt: 3,
                                borderRadius: 2,
                                bgcolor: "#0051ff",
                                color: "#fff",
                                fontSize: "1rem",
                                padding: "12px",
                                transition: "0.3s",
                                width: "100%",
                                fontFamily: "'Roboto', sans-serif",
                                "&:hover": { bgcolor: "#0238ad" },
                            }}
                            type="submit"
                        >
                            {isSignup ? "Sign Up" : "Login"}
                        </Button>

                        {!isAdmin && (
                            <Typography
                                sx={{
                                    mt: 2,
                                    fontSize: "0.9rem",
                                    color: "#bbb",
                                    cursor: "pointer",
                                    "&:hover": { color: "#fff" },
                                    fontFamily: "'Roboto', sans-serif",
                                }}
                                onClick={() => setIsSignup(!isSignup)}
                            >
                                {isSignup ? "Already have an account? Login" : "Don't have an account? Sign Up"}
                            </Typography>
                        )}
                    </Box>
                </form>
            </Dialog>

            {/* Snackbar for validation messages */}
            <Snackbar
                open={!!message}
                autoHideDuration={2000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={messageType}
                    sx={{ width: "100%", fontSize: "1.1rem", padding: "10px 18px" }}
                >
                    {message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default AuthForm;
