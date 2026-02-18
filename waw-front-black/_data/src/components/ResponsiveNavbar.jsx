import React from 'react';
import { Box, Typography, Container, Button } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow'; // Import a play icon

function ResponsiveNavbar() {
  return (
    <Box
      sx={{
        position: 'relative',
        height: { xs: '60vh', md: '738px' }, // Responsive height
        backgroundImage: 'url("images/bg_5.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        textAlign: 'center',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)', // Overlay
          zIndex: 1,
        },
      }}
    >
      <Container
        sx={{
          position: 'relative',
          zIndex: 2, // Ensure content is above overlay
          height: '100%',
          display: 'flex',
          flexDirection: 'column', // Stack items vertically
          justifyContent: 'center', // Center vertically
          alignItems: { xs: 'center', md: 'flex-start' }, // Align text left on desktop, center on mobile
          textAlign: { xs: 'center', md: 'left' }, // Text alignment
        }}
      >
        <Box
          sx={{
            maxWidth: { xs: '90%', md: '70%' }, // Adjust width for content
            animation: 'fadeInUp 1s ease-in-out', // Simple animation hint
            '@keyframes fadeInUp': {
              '0%': { opacity: 0, transform: 'translateY(20px)' },
              '100%': { opacity: 1, transform: 'translateY(0)' },
            },
          }}
        >
          <Typography variant="subtitle1" component="span" sx={{ color: 'rgba(255,255,255,0.8)' }}>
            Welcome to Pacific
          </Typography>
          <Typography variant="h2" component="h1" sx={{ mb: 2, fontWeight: 'bold' }}>
            Discover Your Favorite Place with Us
          </Typography>
          <Typography variant="body1" component="p" sx={{ mb: 4, textTransform: 'uppercase', letterSpacing: '2px' }}>
            Travel to any corner of the world, without going around in circles
          </Typography>
        </Box>

        <Button
          component="a"
          href="https://vimeo.com/45830194"
          target="_blank" // Opens in a new tab
          rel="noopener noreferrer"
          sx={{
            position: 'absolute', // Position video button
            bottom: { xs: '20px', md: 'auto' }, // Adjust for mobile
            left: { xs: '50%', md: 'auto' },
            right: { xs: 'auto', md: 'auto' },
            transform: { xs: 'translateX(-50%)', md: 'none' }, // Center on mobile
            top: { md: '50%' }, // Center vertically on desktop
            right: { md: '10%' }, // Position on right for desktop
            transform: { md: 'translateY(-50%)' },
            width: 80,
            height: 80,
            borderRadius: '50%',
            backgroundColor: 'white',
            color: '#007bff', // Bootstrap primary blue
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 3, // Ensure it's above other content
            '&:hover': {
              backgroundColor: 'lightgray',
            },
          }}
        >
          <PlayArrowIcon sx={{ fontSize: 40 }} />
        </Button>
      </Container>
    </Box>
  );
}

export default ResponsiveNavbar;