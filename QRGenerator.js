import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Snackbar,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
} from '@mui/material';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5002/api';

const QRGenerator = () => {
  const [url, setUrl] = useState('');
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [csvFile, setCsvFile] = useState(null);
  const [csvQrCodes, setCsvQrCodes] = useState([]);

  const handleGenerate = async () => {
    if (!url) {
      setError('Please enter a URL');
      setOpenSnackbar(true);
      return;
    }

    setLoading(true);
    try {
      console.log('Sending request to generate QR code for URL:', url);

      const response = await axios.post(
        `${API_BASE_URL}/qr/generate`,
        { url }
      );

      console.log('Response from server:', response.data);

      if (response.data.success) {
        setQrCode(response.data.qrCode);
        setError('');
      } else {
        setError(response.data.message || 'Failed to generate QR Code');
        setOpenSnackbar(true);
      }
    } catch (err) {
      console.error('Error generating QR code:', err.response || err);
      setError(err.response?.data?.message || 'Failed to generate QR Code');
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCsvUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setCsvFile(file);
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('csvFile', file);

      const response = await axios.post(
        `${API_BASE_URL}/qr/generate/csv`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        setCsvQrCodes(response.data.qrCodes);
        setError('');
      } else {
        setError(response.data.message || 'Failed to generate QR Codes from CSV');
        setOpenSnackbar(true);
      }
    } catch (err) {
      console.error('Error generating QR codes from CSV:', err.response || err);
      setError(err.response?.data?.message || 'Failed to generate QR Codes from CSV');
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setQrCode(null);
    setCsvQrCodes([]);
    setError('');
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Generate QR Code
          </Typography>

          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={activeTab} onChange={handleTabChange}>
              <Tab label="URL" />
              <Tab label="CSV" />
            </Tabs>
          </Box>

          {activeTab === 0 ? (
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Enter URL"
                variant="outlined"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                margin="normal"
                placeholder="https://www.example.com"
              />
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleGenerate}
                disabled={loading}
                sx={{ mt: 2 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Generate QR Code'}
              </Button>

              {qrCode && (
                <Box
                  sx={{
                    mt: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <img
                    src={qrCode}
                    alt="Generated QR Code"
                    style={{ width: '256px', height: '256px' }}
                  />
                  <Button
                    variant="outlined"
                    color="primary"
                    sx={{ mt: 2 }}
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = qrCode;
                      link.download = 'qr-code.png';
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                  >
                    Download QR Code
                  </Button>
                </Box>
              )}
            </Box>
          ) : (
            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                component="label"
                fullWidth
                sx={{ mb: 2 }}
              >
                Upload CSV File
                <input
                  type="file"
                  hidden
                  accept=".csv"
                  onChange={handleCsvUpload}
                />
              </Button>

              {csvFile && (
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Selected file: {csvFile.name}
                </Typography>
              )}

              {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <CircularProgress />
                </Box>
              )}

              {csvQrCodes.length > 0 && (
                <Box sx={{ mt: 4 }}>
                  <Typography variant="h6" gutterBottom>
                    Generated QR Codes:
                  </Typography>
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                      gap: 2,
                      mt: 2,
                    }}
                  >
                    {csvQrCodes.map((qr, index) => (
                      <Box
                        key={qr.id}
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                        }}
                      >
                        <img
                          src={qr.qrCode}
                          alt={`QR Code ${index + 1}`}
                          style={{ width: '150px', height: '150px' }}
                        />
                        <Button
                          variant="outlined"
                          size="small"
                          sx={{ mt: 1 }}
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = qr.qrCode;
                            link.download = `qr-code-${index + 1}.png`;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          }}
                        >
                          Download
                        </Button>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </Paper>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default QRGenerator; 