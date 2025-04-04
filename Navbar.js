import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  useMediaQuery,
  useTheme,
  Menu,
  MenuItem,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import QrCodeIcon from '@mui/icons-material/QrCode';
import { useState } from 'react';

const Navbar = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuClick = (path) => {
    navigate(path);
    handleClose();
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="home"
          onClick={() => navigate('/')}
          sx={{ mr: 2 }}
        >
          <QrCodeIcon />
        </IconButton>
        
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          QR Code System
        </Typography>

        {isMobile ? (
          <>
            <IconButton
              color="inherit"
              aria-label="menu"
              onClick={handleMenu}
              edge="end"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={() => handleMenuClick('/generate')}>
                Generate QR
              </MenuItem>
              <MenuItem onClick={() => handleMenuClick('/scan')}>
                Scan QR
              </MenuItem>
              <MenuItem onClick={() => handleMenuClick('/history')}>
                History
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Box>
            <Button
              color="inherit"
              onClick={() => navigate('/generate')}
            >
              Generate QR
            </Button>
            <Button
              color="inherit"
              onClick={() => navigate('/scan')}
            >
              Scan QR
            </Button>
            <Button
              color="inherit"
              onClick={() => navigate('/history')}
            >
              History
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 