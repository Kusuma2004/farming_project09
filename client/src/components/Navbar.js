// src/components/Navbar.js
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#2e7d32' }}>
      <Toolbar>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 'bold',
              fontFamily: "'Poppins', sans-serif",
              background: 'linear-gradient(90deg, #00c9ff, #92fe9d)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            CropIQ
          </Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button color="inherit" component={Link} to="/">
              Home
            </Button>
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
            <Button color="inherit" component={Link} to="/register">
              Register
            </Button>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
