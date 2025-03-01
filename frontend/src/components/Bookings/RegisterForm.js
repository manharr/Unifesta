import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    MenuItem,
    Typography,
    Grid,
    Box,
    // Snackbar,
    // Alert,
} from "@mui/material";
import { newBooking, createRazorpayOrder, newOrder, getUserById  } from "../../api-helpers/api-helpers";


const RegisterForm = ({ open, handleClose, subEvent }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        eventType: "",
        college: "",
    });

    const [selectedGame, setSelectedGame] = useState(null);
    const [errors, setErrors] = useState({});
    const userId = localStorage.getItem("userId"); 
    
    useEffect(() => {
        if (!userId) return;

        const fetchUserDetails = async () => {
            try {
                const user = await getUserById(userId);
                if (user) {
                    setFormData((prev) => ({
                        ...prev,
                        name: user.name,
                        email: user.email,
                    }));
                }
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        };

        fetchUserDetails();
    }, [userId]);



    useEffect(() => {
        if (!subEvent) return; 
        setSelectedGame(null);
        
        setFormData((prev) => ({
            ...prev,
            eventType: subEvent?.type !== "Gaming" ? subEvent.type : "",
        }));
    }, [subEvent]);
    
    

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });

        if (name === "phone") {
            const phoneRegex = /^[789]\d{9}$/;
            if (!phoneRegex.test(value)) {
                setErrors({ ...errors, phone: "Please enter a valid number." });
            } else {
                setErrors({ ...errors, phone: "" });
            }
        }

        if (subEvent?.type === "Gaming" && name === "eventType" && subEvent.details) {
            const selectedGame = subEvent.details.find((detail) => detail.gameTitle === value);
            setSelectedGame(selectedGame || null);
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        Object.keys(formData).forEach((key) => {
            if (!formData[key] && key !== "eventType") { 
                newErrors[key] = "This field is required";
            }
        });

        const phoneRegex = /^[789]\d{9}$/;
        if (formData.phone && !phoneRegex.test(formData.phone)) {
            newErrors.phone = "Please enter a valid number.";
        }

        if (subEvent?.type === "Gaming" && !formData.eventType) {
            newErrors.eventType = "Please select a game";
        }
    
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        if (!userId) {
            console.error("User is not logged in!");
            return;
        }
    
        if (validateForm()) {
            const bookingData = {
                event: subEvent.event,
                user: userId,
                subEvent: subEvent._id,
                additionalInfo: subEvent.type === "Gaming" ? formData.eventType : "",
                college: formData.college,
                contact: formData.phone
            };
    
            try {
                const eventAmount = subEvent?.type === "Gaming"
                ? selectedGame?.entryFee || 0
                : subEvent?.details?.[0]?.entryFee || 0;
    
                if (eventAmount === 0) {
                    alert("No payment required for this event.");
                    handleClose(); 
                
                    try {
                        const bookingResponse = await newBooking(bookingData);
                        // console.log("Booking Created:", bookingResponse);
                
                        if (bookingResponse && bookingResponse._id) { 
                            window.location.href = '/success'; 
                        } else {
                            window.location.href = '/success';
                        }
                    } catch (error) {
                        console.error("Error creating booking for free event:", error);
                        alert("An error occurred while processing your registration.");
                    }
                    return;
                }
    
                const paymentData = {
                    userId,
                    eventId: subEvent.event,
                    amount: eventAmount, 
                    currency: "INR",
                };
    
                const razorpayOrder = await createRazorpayOrder(paymentData);
                console.log("Razorpay Order Created:", razorpayOrder);
    
                // Now open the Razorpay payment gateway
                const options = {
                    key: process.env.RAZORPAY_KEY_ID,  
                    amount: razorpayOrder.amount,  
                    currency: razorpayOrder.currency,
                    name: "UniFesta", 
                    description: "Booking for " + subEvent.event, 
                    image: "/logo1.png",  
                    order_id: razorpayOrder.id,  
                    handler: async function (response) {
                        // Handle successful payment here
                        console.log("Payment Successful:", response);
                        const paymentData = {
                            paymentId: response.razorpay_payment_id,
                            orderId: response.razorpay_order_id,
                            signature: response.razorpay_signature,
                        };
    
                        const paymentVerificationResponse = await newOrder(paymentData);
                        console.log("Payment Verification Response:", paymentVerificationResponse);
    
                        // Only create the booking after payment is successfully verified
                        if (paymentVerificationResponse.success) {
                            const bookingResponse = await newBooking(bookingData);
                            console.log("Booking Created:", bookingResponse);
                            window.location.href = '/success'; 
                        } else {
                            alert("Payment verification failed. Please try again.");
                        }
                    },
                    prefill: {
                        name: formData.name,
                        email: formData.email,
                        contact: formData.phone,
                    },
                    notes: {
                        address: formData.college,
                    },
                    theme: {
                        color: "#F37254", 
                    },
                };
    
                const rzp = new window.Razorpay(options);
                rzp.open();  
    
                handleClose(); 
            } catch (error) {
                console.error("Error during booking or Razorpay order:", error);
            }
        } else {
            console.log("Validation failed", errors);
        }
    };
    
    
    
    

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
    <DialogTitle
        sx={{
            fontWeight: "bold",
            textAlign: "center",
            bgcolor: "#1A1D21", 
            color: "#FFFFFF",
            fontSize: "1.5rem",
            p: 3,
            borderBottom: "1px solid #2C2F34", 
        }}
    >
        Register for {subEvent?.type}
    </DialogTitle>

    <DialogContent sx={{ bgcolor: "#1E2125", color: "#E0E0E0", p: 4 }}>
        <Box
            sx={{
                mb: 3,
                p: 3,
                bgcolor: "#2C2F34",
                borderRadius: "8px",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
            }}
        >
            <Typography
                variant="h6"
                sx={{
                    fontWeight: "bold",
                    color: "#FFFFFF",
                    mb: 2,
                    fontSize: "1.2rem",
                    letterSpacing: "0.5px",
                }}
            >
                {subEvent?.description}
            </Typography>

            {/* For Gaming Events */}
            {subEvent?.type === "Gaming" && selectedGame && (
                <Box mt={2} sx={{ color: "#D1D1D1" }}>
                    <Typography variant="body1" sx={{ fontSize: "1rem", mb: 1 }}>
                        <strong>Entry Fee:</strong>{" "}
                        <span style={{ color: selectedGame.entryFee ? "#FFCC00" : "#66FF99" }}>
                            {selectedGame.entryFee ? `₹${selectedGame.entryFee}` : "FREE"}
                        </span>
                    </Typography>
                    {selectedGame.date && (
                        <Typography variant="body1" sx={{ fontSize: "1rem", mb: 1 }}>
                            <strong>Date:</strong> {new Date(selectedGame.date).toDateString()}
                        </Typography>
                    )}
                    {selectedGame.time && (
                        <Typography variant="body1" sx={{ fontSize: "1rem" }}>
                            <strong>Time:</strong>{" "}
                            {new Date(`1970-01-01T${selectedGame.time}`).toLocaleTimeString([], {
                                hour: "numeric",
                                minute: "2-digit",
                                hour12: true,
                            })}
                        </Typography>
                    )}
                </Box>
            )}

            {/* For Non-Gaming Events */}
            {subEvent?.type !== "Gaming" && subEvent?.details?.length > 0 && (
                <Box mt={2} sx={{ color: "#D1D1D1" }}>
                    {subEvent.details.map((detail, index) => (
                        <Box key={index} sx={{ mb: 2 }}>
                            <Typography variant="body1" sx={{ fontSize: "1rem", mb: 1 }}>
                                <strong>Entry Fee:</strong>{" "}
                                <span style={{ color: detail.entryFee ? "#FFCC00" : "#66FF99" }}>
                                    {detail.entryFee ? `₹${detail.entryFee}` : "FREE"}
                                </span>
                            </Typography>
                            {detail.date && (
                                <Typography variant="body1" sx={{ fontSize: "1rem", mb: 1 }}>
                                    <strong>Date:</strong> {new Date(detail.date).toDateString()}
                                </Typography>
                            )}
                            {detail.time && (
                                <Typography variant="body1" sx={{ fontSize: "1rem" }}>
                                    <strong>Time:</strong>{" "}
                                    {new Date(`1970-01-01T${detail.time}`).toLocaleTimeString([], {
                                        hour: "numeric",
                                        minute: "2-digit",
                                        hour12: true,
                                    })}
                                </Typography>
                            )}
                        </Box>
                    ))}
                </Box>
            )}
        </Box>

        <Grid container spacing={3}>
            {/* Full Name Field */}
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    variant="outlined"
                    required
                    error={!!errors.name}
                    helperText={errors.name}
                    disabled
                    sx={{
                        bgcolor: "#2C2F34",
                        borderRadius: "8px",
                        input: { color: "#E3E3E3", fontWeight: 500 },
                        "& .MuiOutlinedInput-root": {
                            background: "#2C2F34",
                            borderRadius: "8px",
                            "& fieldset": { borderColor: "#50555C" },
                            "&:hover fieldset": { borderColor: "#FFB74D" },
                            "&.Mui-focused fieldset": { borderColor: "#FF9800" },
                        },
                        "& .MuiInputLabel-root": {
                            color: "#B0B3B8",
                            fontWeight: 600,
                            fontSize: "1rem",
                        },
                        "& .MuiInputBase-input.Mui-disabled": {
                            color: "#FFFFFF !important",
                            "-webkit-text-fill-color": "#FFFFFF !important",
                            opacity: 1,
                        },
                    }}
                />
            </Grid>

            {/* Email Address Field */}
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    label="Email Address"
                    name="email"
                    value={formData.email}
                    variant="outlined"
                    required
                    error={!!errors.email}
                    helperText={errors.email}
                    disabled
                    sx={{
                        bgcolor: "#2C2F34",
                        borderRadius: "8px",
                        input: { color: "#E3E3E3", fontWeight: 500 },
                        "& .MuiOutlinedInput-root": {
                            background: "#2C2F34",
                            borderRadius: "8px",
                            "& fieldset": { borderColor: "#50555C" },
                            "&:hover fieldset": { borderColor: "#FFB74D" },
                            "&.Mui-focused fieldset": { borderColor: "#FF9800" },
                        },
                        "& .MuiInputLabel-root": {
                            color: "#B0B3B8",
                            fontWeight: 600,
                            fontSize: "1rem",
                        },
                        "& .MuiInputBase-input.Mui-disabled": {
                            color: "#FFFFFF !important",
                            "-webkit-text-fill-color": "#FFFFFF !important",
                            opacity: 1,
                        },
                    }}
                />
            </Grid>

            {/* Phone Number Field */}
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    variant="outlined"
                    placeholder="Enter your phone number"
                    required
                    error={!!errors.phone}
                    helperText={errors.phone}
                    sx={{
                        bgcolor: "#2C2F34",
                        borderRadius: "8px",
                        input: { color: "#E3E3E3", fontWeight: 500 },
                        "& .MuiOutlinedInput-root": {
                            background: "#2C2F34",
                            borderRadius: "8px",
                            "& fieldset": { borderColor: "#50555C" },
                            "&:hover fieldset": { borderColor: "#FFB74D" },
                            "&.Mui-focused fieldset": { borderColor: "#FF9800" },
                        },
                        "& .MuiInputLabel-root": {
                            color: "#B0B3B8",
                            fontWeight: 600,
                            fontSize: "1rem",
                        },
                    }}
                    inputProps={{
                        maxLength: 10,
                    }}
                />
            </Grid>

            {/* College Field */}
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    label="College"
                    name="college"
                    value={formData.college}
                    onChange={handleInputChange}
                    variant="outlined"
                    placeholder="Enter your college name"
                    required
                    error={!!errors.college}
                    helperText={errors.college}
                    sx={{
                        bgcolor: "#2C2F34",
                        borderRadius: "8px",
                        input: { color: "#E3E3E3", fontWeight: 500 },
                        "& .MuiOutlinedInput-root": {
                            background: "#2C2F34",
                            borderRadius: "8px",
                            "& fieldset": { borderColor: "#50555C" },
                            "&:hover fieldset": { borderColor: "#FFB74D" },
                            "&.Mui-focused fieldset": { borderColor: "#FF9800" },
                        },
                        "& .MuiInputLabel-root": {
                            color: "#B0B3B8",
                            fontWeight: 600,
                            fontSize: "1rem",
                        },
                    }}
                />
            </Grid>

            {/* For Gaming Events */}
            {subEvent?.type === "Gaming" && subEvent?.details?.length > 0 && (
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        select
                        label="Select Game"
                        name="eventType"
                        value={formData.eventType}
                        onChange={handleInputChange}
                        variant="outlined"
                        required
                        error={!!errors.eventType}
                        helperText={errors.eventType}
                        SelectProps={{
                            MenuProps: {
                                PaperProps: {
                                    sx: {
                                        bgcolor: "#2C2F34",
                                        color: "#E3E3E3",
                                    },
                                },
                            },
                        }}
                        sx={{
                            bgcolor: "#2C2F34",
                            borderRadius: "8px",
                            input: { color: "#E3E3E3", fontWeight: 500 },
                            "& .MuiInputLabel-root": {
                                color: "#B0B3B8",
                                fontWeight: 600,
                                fontSize: "1rem",
                            },
                            "& .MuiSelect-select": {
                                color: "#E3E3E3",
                            },
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": { borderColor: "#50555C" },
                                "&:hover fieldset": { borderColor: "#FFB74D" },
                                "&.Mui-focused fieldset": { borderColor: "#FF9800" },
                            },
                        }}
                    >
                        {subEvent.details
                            .filter((detail) => detail.maxParticipants > detail.registeredParticipants)
                            .map((detail, index) => (
                                <MenuItem key={index} value={detail.gameTitle}>
                                    {detail.gameTitle}
                                </MenuItem>
                            ))}
                    </TextField>
                </Grid>
            )}
        </Grid>
    </DialogContent>
    <DialogActions sx={{ bgcolor: "#1A1D21", p: 2, borderTop: "1px solid #2C2F34" }}>
        <Button onClick={handleClose} sx={{ color: "#B0B3B8", fontWeight: 600 }}>
            Cancel
        </Button>
        <Button
            onClick={handleSubmit}
            sx={{
                bgcolor: "#FF9800",
                color: "#FFFFFF",
                fontWeight: 600,
                "&:hover": { bgcolor: "#E68900" },
                borderRadius: "8px",
                px: 3,
                py: 1,
            }}
            variant="contained"
        >
            Register
        </Button>
    </DialogActions>
</Dialog>    );
};

export default RegisterForm;
