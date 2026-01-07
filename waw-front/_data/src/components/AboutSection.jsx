import React from 'react';
import { Box, Container, Grid, Typography, Button } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

function AboutSection() {
  return (
    <>
      {/* First About Section (Video Background) */}
      <Box
        sx={{
          py: 8, // ftco-section ftco-about img
          backgroundImage: 'url(images/bg_4.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          '&::before': { // Overlay
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', // Adjust overlay color/opacity
            zIndex: 1,
          },
        }}
      >
        <Container sx={{ py: { md: 5 }, position: 'relative', zIndex: 2 }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: { xs: 200, md: 300 }, // Ensure some height for content
          }}>
            <Button
              component="a"
              href="https://vimeo.com/45830194"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                width: 100,
                height: 100,
                borderRadius: '50%',
                backgroundColor: 'white',
                color: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 3,
                '&:hover': {
                  backgroundColor: 'lightgray',
                },
              }}
            >
              <PlayArrowIcon sx={{ fontSize: 60 }} />
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Second About Section (Text & Image) */}
      <Box sx={{ py: 8 }}> {/* ftco-section ftco-about ftco-no-pt img */}
        <Container>
          <Grid container spacing={4} sx={{ display: 'flex' }}>
            <Grid item xs={12}>
              <Grid container spacing={0}>
                <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'stretch' }}>
                  <Box
                    sx={{
                      backgroundImage: 'url(images/about-1.jpg)',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      width: '100%',
                      minHeight: 400, // Ensure image box has height
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 1, // Optional: add some border radius
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6} sx={{ pl: { md: 5 }, py: { xs: 5, md: 0 } }}>
                  <Box sx={{ pr: { md: 5 } }}>
                    <Typography variant="subtitle1" component="span" color="text.secondary">
                      About Us
                    </Typography>
                    <Typography variant="h4" component="h2" sx={{ mb: 3, fontWeight: 'bold' }}>
                      Make Your Tour Memorable and Safe With Us
                    </Typography>
                    <Typography variant="body1" paragraph>
                      Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean.
                    </Typography>
                    <Button variant="contained" color="primary" href="#" sx={{ py: 1.5, px: 3, mt: 2 }}>
                      Book Your Destination
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}

export default AboutSection;