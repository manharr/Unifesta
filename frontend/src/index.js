import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import { Provider } from 'react-redux';
import { store } from './store';
import { Container, Typography,  Alert } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

// Set the base URL for axios
axios.defaults.baseURL = "https://unifesta.onrender.com";

const root = ReactDOM.createRoot(document.getElementById('root'));

function MaintenanceCheck() {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);

  useEffect(() => {
    axios.get("/")
      .then(response => {
        if (response.status === 503) {
          setIsMaintenanceMode(true);
        }
      })
      .catch(error => {
        console.error("Error connecting to backend:", error);
        setIsMaintenanceMode(true);
      });
  }, []);

  if (isMaintenanceMode) {
    return (
      <Container maxWidth="sm" sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        textAlign: 'center'
      }}>
        <Alert severity="error" icon={<WarningAmberIcon fontSize="large" />} sx={{ mb: 2 }}>
          <Typography variant="h5">The site is temporarily under maintenance</Typography>
        </Alert>
        <Typography variant="body1">Please check back later. Thank you for your patience.</Typography>
      </Container>
    );
  }

  return (
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  );
}

root.render(
  <React.StrictMode>
    <MaintenanceCheck />
  </React.StrictMode>
);
