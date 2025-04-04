import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  Box,
} from '@mui/material';
import QrCodeIcon from '@mui/icons-material/QrCode';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import HistoryIcon from '@mui/icons-material/History';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    {
      title: 'Generate QR Codes',
      description: 'Create custom QR codes for your needs',
      icon: <QrCodeIcon fontSize="large" />,
      path: '/generate',
    },
    {
      title: 'Scan QR Codes',
      description: 'Scan and decode QR codes instantly',
      icon: <QrCodeScannerIcon fontSize="large" />,
      path: '/scan',
    },
    {
      title: 'View History',
      description: 'Access your QR code history',
      icon: <HistoryIcon fontSize="large" />,
      path: '/history',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box textAlign="center" mb={6}>
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to QR Code System
        </Typography>
        <Typography variant="h5" color="textSecondary" paragraph>
          Generate, scan, and manage QR codes with ease
        </Typography>
      </Box>

      <Grid container spacing={4} justifyContent="center">
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: '100%',
                textAlign: 'center',
              }}
              elevation={3}
            >
              {feature.icon}
              <Typography variant="h5" component="h2" mt={2}>
                {feature.title}
              </Typography>
              <Typography color="textSecondary" mt={1}>
                {feature.description}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                onClick={() => navigate(feature.path)}
                disabled={!user}
              >
                {feature.title}
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {!user && (
        <Box textAlign="center" mt={6}>
          <Typography variant="h6" gutterBottom>
            Please log in or register to use these features
          </Typography>
          <Box mt={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/login')}
              sx={{ mr: 2 }}
            >
              Login
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate('/register')}
            >
              Register
            </Button>
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default Home; 