import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';

function IntroSection() {
  return (
    <Box sx={{ py: 8 }}> {/* ftco-intro ftco-section ftco-no-pt */}
      <Container>
        <Box sx={{ textAlign: 'center' }}>
          <Box
            sx={{
              backgroundImage: 'url(images/bg_2.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'relative',
              borderRadius: 2, // Optional: add some border radius
              overflow: 'hidden',
              p: { xs: 4, md: 8 },
              color: 'white',
              '&::before': { // Overlay
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
                zIndex: 1,
              },
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 2 }}>
              <Typography variant="h3" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
                We Are Pacific A Travel Agency
              </Typography>
              <Typography variant="body1" paragraph>
                We can manage your dream building A small river named Duden flows by their place
              </Typography>
              <Button variant="contained" color="primary" href="#" sx={{ py: 1.5, px: 3, mt: 3 }}>
                Ask For A Quote
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default IntroSection;