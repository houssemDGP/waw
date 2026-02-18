import React from 'react';
import { Box, Container, Grid, Typography } from '@mui/material';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import AltRouteIcon from '@mui/icons-material/AltRoute';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import MapIcon from '@mui/icons-material/Map';

function ServicesSection() {
  const servicesData = [
    {
      icon: <DirectionsRunIcon sx={{ fontSize: 60 }} />,
      title: 'Activities',
      image: 'imgs/Activities.png',
    },
    {
      icon: <AltRouteIcon sx={{ fontSize: 60 }} />,
      title: 'Travel Arrangements',
      image: 'imgs/TravelArrangements.png',
    },
    {
      icon: <SelfImprovementIcon sx={{ fontSize: 60 }} />,
      title: 'Private Guide',
      image: 'imgs/PrivateGuide.png',
    },
    {
      icon: <MapIcon sx={{ fontSize: 60 }} />,
      title: 'Location Manager',
      image: 'imgs/LocationManager.png',
    },
  ];

  return (
    <Box sx={{ pt: 6, pb: 12 }}>
      <Container>
        <Typography
          variant="h5"
          component="h3"
          sx={{ mb: 4, fontWeight: 'bold', textAlign: 'center' }}
        >
          Il est temps de commencer votre aventure
        </Typography>

        <Grid container spacing={3} justifyContent="center">
          {servicesData.map((service, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  borderRadius: 1,
                  boxShadow: 2,
                  backgroundImage: `url(${service.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  color: '#f76b1c',
                  position: 'relative',
                  height: 300,
                  width:350,
                  overflow: 'hidden',
                  "&::after": {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    zIndex: 1,
                    transition: 'opacity 0.3s ease',
                    pointerEvents: 'none',
                  },
                  "&:hover::after": {
                    opacity: 0.1,
                  },
                }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    zIndex: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    width: '100%',
                    px: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      backgroundColor: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2,
                      color: 'primary.main',
                    }}
                  >
                    {service.icon}
                  </Box>
                  <Typography variant="h5" component="h3" sx={{ fontWeight: 'bold' }}>
                    {service.title}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default ServicesSection;
