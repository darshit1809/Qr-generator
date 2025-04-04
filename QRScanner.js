import React, { useState, useRef, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  Snackbar,
  Alert,
} from '@mui/material';
import Webcam from 'react-webcam';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const QRScanner = () => {
  const webcamRef = useRef(null);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleScan = async (data) => {
    if (data) {
      try {
        await axios.post('/api/qr/scan', { content: data });
        setResult(data);
        setSuccess('QR Code scanned successfully!');
        
        // If it's a URL, navigate to it
        if (data.startsWith('http://') || data.startsWith('https://')) {
          window.open(data, '_blank');
        }
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to scan QR Code');
      }
    }
  };

  const handleError = (error) => {
    setError(error.message);
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Scan QR Code
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Webcam
            ref={webcamRef}
            onUserMediaError={handleError}
            style={{
              width: '100%',
              maxWidth: '500px',
              margin: '0 auto',
              display: 'block',
            }}
          />
        </Box>

        {result && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Scanned Result:
            </Typography>
            <TextField
              fullWidth
              value={result}
              variant="outlined"
              InputProps={{
                readOnly: true,
              }}
            />
          </Box>
        )}

        <Button
          variant="contained"
          color="primary"
          onClick={() => setResult('')}
          sx={{ mr: 2 }}
        >
          Clear Result
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => navigate('/history')}
        >
          View History
        </Button>
      </Paper>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
      >
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess('')}
      >
        <Alert severity="success" onClose={() => setSuccess('')}>
          {success}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default QRScanner; 