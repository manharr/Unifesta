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
import { newBooking, createRazorpayOrder, newOrder  } from "../../api-helpers/api-helpers";


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
    const userId = localStorage.getItem("userId"); // Example, modify as needed
    
    useEffect(() => {
        if (!subEvent) return; // Prevent unnecessary resets
        setSelectedGame(null);
        
        // Automatically set eventType for non-Gaming events
        setFormData((prev) => ({
            ...prev,
            eventType: subEvent?.type !== "Gaming" ? subEvent.type : "",
        }));
    }, [subEvent]);
    
    

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });

        if (subEvent?.type === "Gaming" && name === "eventType" && subEvent.details) {
            const selectedGame = subEvent.details.find((detail) => detail.gameTitle === value);
            setSelectedGame(selectedGame || null);
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        // Validate all required fields
        Object.keys(formData).forEach((key) => {
            if (!formData[key] && key !== "eventType") { // Exclude eventType from general validation
                newErrors[key] = "This field is required";
            }
        });
    
        // Only validate 'eventType' if it's a Gaming event
        if (subEvent?.type === "Gaming" && !formData.eventType) {
            newErrors.eventType = "Please select a game";
        }
    
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    // rzp_test_z3yR89BoU8AMms

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
                // Determine the correct amount based on event type
                const eventAmount = subEvent?.type === "Gaming"
                ? selectedGame?.entryFee || 0
                : subEvent?.details?.[0]?.entryFee || 0;
    
                // If amount is 0, no Razorpay should open
                if (eventAmount === 0) {
                    alert("No payment required for this event.");
                    handleClose(); // Close the dialog if no payment is required
                
                    try {
                        const bookingResponse = await newBooking(bookingData);
                        console.log("Booking Created:", bookingResponse);
                
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
    
                // Create Razorpay order only if payment is required
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
                    key: "rzp_test_z3yR89BoU8AMms",  // Replace with your Razorpay key
                    amount: razorpayOrder.amount,  // The order amount in paise
                    currency: razorpayOrder.currency,
                    name: "UniFesta", // You can set the event or company name here
                    description: "Booking for " + subEvent.event, // Event description
                    image: "https://your-logo-url.com/logo.png",  // Optionally add a logo
                    order_id: razorpayOrder.id,  // The order ID you received
                    handler: async function (response) {
                        // Handle successful payment here
                        console.log("Payment Successful:", response);
                        const paymentData = {
                            paymentId: response.razorpay_payment_id,
                            orderId: response.razorpay_order_id,
                            signature: response.razorpay_signature,
                        };
    
                        // Verify the payment on the server
                        const paymentVerificationResponse = await newOrder(paymentData);
                        console.log("Payment Verification Response:", paymentVerificationResponse);
    
                        // Only create the booking after payment is successfully verified
                        if (paymentVerificationResponse.success) {
                            // Now create the booking
                            const bookingResponse = await newBooking(bookingData);
                            console.log("Booking Created:", bookingResponse);
    
                            // Redirect to registration success page after successful booking and payment
                            window.location.href = '/success'; // Adjust this route as needed
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
                        color: "#F37254", // Set a theme color (optional)
                    },
                };
    
                const rzp = new window.Razorpay(options);
                rzp.open();  // Open the Razorpay payment modal
    
                handleClose();  // Close the dialog after the order is placed
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
                    bgcolor: "#1f2227",
                    color: "#f8f9fa",
                    fontSize: "1.5rem",
                    p: 2,
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
                }}
            >
                Register for {subEvent?.type}
            </DialogTitle>

            <DialogContent sx={{ bgcolor: "#292c31", color: "#e0e0e0", p: 4 }}>
                <Box
                    sx={{
                        mb: 3,
                        p: 3,
                        bgcolor: "#383c42",
                        borderRadius: 2,
                        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: "bold",
                            color: "#f5f5f5",
                            mb: 1,
                            fontSize: "1.2rem",
                            letterSpacing: "0.5px",
                        }}
                    >
                        {subEvent?.description}
                    </Typography>

                    {/* For Gaming Events */}
                    {subEvent?.type === "Gaming" && selectedGame && (
                        <Box mt={2} sx={{ color: "#d1d1d1" }}>
                            <Typography variant="body1" sx={{ fontSize: "1rem", mb: 1 }}>
                                <strong>Entry Fee:</strong>{" "}
                                <span style={{ color: selectedGame.entryFee ? "#ffcc00" : "#66ff99" }}>
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
                        <Box mt={2} sx={{ color: "#d1d1d1" }}>
                            {subEvent.details.map((detail, index) => (
                                <Box key={index} sx={{ mb: 2 }}>
                                    <Typography variant="body1" sx={{ fontSize: "1rem", mb: 1 }}>
                                        <strong>Entry Fee:</strong>{" "}
                                        <span style={{ color: detail.entryFee ? "#ffcc00" : "#66ff99" }}>
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
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Full Name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            variant="outlined"
                            placeholder="Enter your full name"
                            required
                            error={!!errors.name}
                            helperText={errors.name}
                            sx={{
                                bgcolor: "#444",
                                borderRadius: 2,
                                input: { color: "#fff" },
                                "& .MuiOutlinedInput-root": {
                                    "& fieldset": {
                                        borderColor: "#555",
                                    },
                                    "&:hover fieldset": {
                                        borderColor: "#ff9800",
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: "#ff9800",
                                    },
                                },
                                "& .MuiInputLabel-root": {
                                    color: "#ccc",
                                },
                            }}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Email Address"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            variant="outlined"
                            placeholder="Enter your email address"
                            required
                            error={!!errors.email}
                            helperText={errors.email}
                            sx={{
                                bgcolor: "#444",
                                borderRadius: 2,
                                input: { color: "#fff" },
                                "& .MuiOutlinedInput-root": {
                                    "& fieldset": {
                                        borderColor: "#555",
                                    },
                                    "&:hover fieldset": {
                                        borderColor: "#ff9800",
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: "#ff9800",
                                    },
                                },
                                "& .MuiInputLabel-root": {
                                    color: "#ccc",
                                },
                            }}
                        />
                    </Grid>

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
                                bgcolor: "#444",
                                borderRadius: 2,
                                input: { color: "#fff" },
                                "& .MuiOutlinedInput-root": {
                                    "& fieldset": {
                                        borderColor: "#555",
                                    },
                                    "&:hover fieldset": {
                                        borderColor: "#ff9800",
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: "#ff9800",
                                    },
                                },
                                "& .MuiInputLabel-root": {
                                    color: "#ccc",
                                },
                            }}
                        />
                    </Grid>

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
                                bgcolor: "#444",
                                borderRadius: 2,
                                input: { color: "#fff" },
                                "& .MuiOutlinedInput-root": {
                                    "& fieldset": {
                                        borderColor: "#555",
                                    },
                                    "&:hover fieldset": {
                                        borderColor: "#ff9800",
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: "#ff9800",
                                    },
                                },
                                "& .MuiInputLabel-root": {
                                    color: "#ccc",
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
                                                bgcolor: "#333",
                                                color: "#fff",
                                            },
                                        },
                                    },
                                }}
                                sx={{
                                    bgcolor: "#444",
                                    borderRadius: 2,
                                    input: { color: "#fff" },
                                    "& .MuiInputLabel-root": {
                                        color: "#fff", 
                                    },
                                    "& .MuiSelect-select": {
                                        color: "#fff", 
                                    },
                                    "& .MuiOutlinedInput-root": {
                                        "& fieldset": {
                                            borderColor: "#555",
                                            color:"#fff"
                                        },
                                        "&:hover fieldset": {
                                            borderColor: "#ff9800",
                                            color:"#fff"
                                        },
                                        "&.Mui-focused fieldset": {
                                            borderColor: "#ff9800",
                                            color:"#fff"
                                        },
                                    },
                                }}
                            >
                                {subEvent.details
                                .filter((detail) => detail.maxParticipants > detail.registeredParticipants) // Exclude full games
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
            <DialogActions sx={{ bgcolor: "#2c2f35", p: 2 }}>
                <Button onClick={handleClose} sx={{ color: "#aaa" }} variant="text">
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    sx={{
                        bgcolor: "#ff9800",
                        color: "#fff",
                        "&:hover": { bgcolor: "#e68900" },
                    }}
                    variant="contained"
                >
                    Register
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default RegisterForm;
