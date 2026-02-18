import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Button, IconButton } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const slides = [
  {
    image: 'sliderindex/img1.png',
    subtitle: 'Welcome to WAW',
    title: 'Commencez votre exploration',
    description: 'Commencez votre exploration',
    videoLink: 'https://vimeo.com/45830194',
  },
  {
    image: 'sliderindex/img4.png',
    subtitle: 'Welcome to WAW',
    title: 'Commencez votre exploration',
    description: 'Commencez votre exploration',
    videoLink: 'https://vimeo.com/45830194',
  },
  {
    image: 'sliderindex/img3.png',
    subtitle: 'Welcome to WAW',
    title: 'Commencez votre exploration',
    description: 'Commencez votre exploration',
    videoLink: 'https://vimeo.com/45830194',
  },
];

function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [textAnimationKey, setTextAnimationKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
      setTextAnimationKey((k) => k + 1); // trigger re-animation
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const { image, subtitle, title, description, videoLink } = slides[currentSlide];

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setTextAnimationKey((k) => k + 1); // trigger re-animation
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setTextAnimationKey((k) => k + 1); // trigger re-animation
  };

  return (
    <Box
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{
        position: 'relative',
        height: { xs: '60vh', md: '738px' },
        backgroundImage: `url(${image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        textAlign: 'center',
        transition: 'background-image 1s ease-in-out',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          zIndex: 1,
        },
        // cursor pointer to show interactive area
        cursor: 'pointer',
      }}
    >
      {/* Prev Arrow */}
      <IconButton
        onClick={handlePrev}
        sx={{
          position: 'absolute',
          top: '50%',
          left: { xs: 10, md: 40 },
          transform: 'translateY(-50%)',
          color: 'white',
          backgroundColor: 'rgba(0,0,0,0.4)',
          opacity: hovered ? 1 : 0,
          pointerEvents: hovered ? 'auto' : 'none',
          transition: 'opacity 0.4s ease',
          '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' },
          zIndex: 3,
        }}
        aria-label="Previous slide"
      >
        <ArrowBackIosNewIcon />
      </IconButton>

      {/* Next Arrow */}
      <IconButton
        onClick={handleNext}
        sx={{
          position: 'absolute',
          top: '50%',
          right: { xs: 10, md: 40 },
          transform: 'translateY(-50%)',
          color: 'white',
          backgroundColor: 'rgba(0,0,0,0.4)',
          opacity: hovered ? 1 : 0,
          pointerEvents: hovered ? 'auto' : 'none',
          transition: 'opacity 0.4s ease',
          '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' },
          zIndex: 3,
        }}
        aria-label="Next slide"
      >
        <ArrowForwardIosIcon />
      </IconButton>

      <Container
        sx={{
          position: 'relative',
          zIndex: 2,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: { xs: 'center', md: 'flex-start' },
          textAlign: { xs: 'center', md: 'left' },
        }}
      >
        <Box
          key={textAnimationKey} // triggers remount for animation
          sx={{
            maxWidth: { xs: '90%', md: '70%' },
            animation: 'fadeInUp 1s ease-in-out',
            '@keyframes fadeInUp': {
              '0%': { opacity: 0, transform: 'translateY(20px)' },
              '100%': { opacity: 1, transform: 'translateY(0)' },
            },
          }}
        >
          <Typography variant="subtitle1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
            {subtitle}
          </Typography>
          <Typography variant="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
            {title}
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, textTransform: 'uppercase', letterSpacing: '2px' }}>
            {description}
          </Typography>
        </Box>

        <Button
          component="a"
          href={videoLink}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            position: 'absolute',
            bottom: { xs: '20px', md: 'auto' },
            left: { xs: '50%', md: 'auto' },
            top: { md: '50%' },
            right: { md: '10%' },
            transform: {
              xs: 'translateX(-50%)',
              md: 'translateY(-50%)',
            },
            width: 80,
            height: 80,
            borderRadius: '50%',
            backgroundColor: 'white',
            color: '#007bff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 3,
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

export default HeroSection;
