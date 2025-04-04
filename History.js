import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Button,
  IconButton,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Share as ShareIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';

const History = () => {
  const [qrCodes, setQrCodes] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchQrCodes = async () => {
    try {
      setLoading(true);
      const params = {
        page: page + 1,
        limit: rowsPerPage,
        ...(startDate && { startDate: startDate.toISOString() }),
        ...(endDate && { endDate: endDate.toISOString() }),
      };

      const response = await axios.get('/api/qr/history', { params });
      setQrCodes(response.data.qrCodes);
      setTotalCount(response.data.total);
    } catch (error) {
      console.error('Error fetching QR codes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQrCodes();
  }, [page, rowsPerPage, startDate, endDate]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/qr/${id}`);
      fetchQrCodes();
    } catch (error) {
      console.error('Error deleting QR code:', error);
    }
  };

  const handleShare = async (id) => {
    try {
      await axios.post('/api/qr/share', { qrCodeId: id });
    } catch (error) {
      console.error('Error sharing QR code:', error);
    }
  };

  const handleDownload = (imageUrl) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'qr-code.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          QR Code History
        </Typography>

        <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={setStartDate}
              renderInput={(params) => <TextField {...params} />}
            />
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={setEndDate}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
          <Button
            variant="contained"
            onClick={() => {
              setStartDate(null);
              setEndDate(null);
            }}
          >
            Clear Filters
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Content</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Scan Count</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {qrCodes.map((qrCode) => (
                <TableRow key={qrCode._id}>
                  <TableCell>{qrCode.content}</TableCell>
                  <TableCell>{qrCode.type}</TableCell>
                  <TableCell>
                    {new Date(qrCode.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell>{qrCode.scanCount}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleShare(qrCode._id)}
                      title="Share"
                    >
                      <ShareIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDownload(qrCode.imageUrl)}
                      title="Download"
                    >
                      <DownloadIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(qrCode._id)}
                      title="Delete"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={totalCount}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Container>
  );
};

export default History; 