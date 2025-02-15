import React, { useState } from "react";
import AuthForm from "./AuthForm";
import { sendUserAuthRequest } from "../../api-helpers/api-helpers";
import { useDispatch } from "react-redux";
import { userActions } from "../../store";
import { useNavigate } from "react-router-dom";
import { Alert, Snackbar, LinearProgress, Box } from "@mui/material";

const Auth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState("success");
    const [showProgress, setShowProgress] = useState(false);

    const handleCloseSnackbar = () => {
        setMessage(null);
        setShowProgress(false);
    };

    const onResReceived = (data, isSignup) => {
        dispatch(userActions.login());
        localStorage.setItem("userId", data.id);

        if (isSignup) {
            setMessage("✅ Signed up successfully!");
        } else {
            setMessage("✅ Logged in successfully!");
        }

        setMessageType("success");
        setShowProgress(true);

        setTimeout(() => {
            navigate("/");
        }, 2000);
    };

    const getData = (data) => {
        console.log("Auth", data);

        sendUserAuthRequest(data.inputs, data.signup)
            .then((res) => {
                onResReceived(res, data.signup);
            })
            .catch((err) => {
                console.error(err);

                if (err.response?.data?.message === "Email already exists") {
                    setMessage("❌ Email already exists!");
                } else {
                    setMessage("❌ Incorrect email or password!");
                }

                setMessageType("error");
            });
    };

    return (
        <div>
            <AuthForm onSubmit={getData} isAdmin={false} />

            {/* Snackbar for success/error messages */}
            <Snackbar
                open={!!message}
                autoHideDuration={2000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Box sx={{ width: "100%" }}>
                    <Alert
                        onClose={handleCloseSnackbar}
                        severity={messageType}
                        sx={{
                            width: "100%",
                            fontSize: "1.1rem",
                            padding: "10px 18px",
                        }}
                    >
                        {message}
                    </Alert>

                    {/* Animated Progress Bar (only for success messages) */}
                    {messageType === "success" && showProgress && (
                        <LinearProgress
                            sx={{
                                height: 3,
                                backgroundColor: "rgba(255, 255, 255, 0.2)", // Subtle background
                                "& .MuiLinearProgress-bar": {
                                    backgroundColor: "#4caf50", // Green progress bar
                                },
                            }}
                        />
                    )}
                </Box>
            </Snackbar>
        </div>
    );
};

export default Auth;
