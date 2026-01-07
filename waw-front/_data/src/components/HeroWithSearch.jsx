import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Button,
  IconButton,
  Autocomplete,
  TextField,
  FormControl,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SearchIcon from '@mui/icons-material/Search';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import axios from 'axios';
import dayjs from 'dayjs';

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

const countries = [
  'Tunis', 'Sfax', 'Sousse', 'Gabès', 'Bizerte', 'Kairouan', 'Gafsa', 'Tozeur', 'Djerba', 'Monastir',
];

function HeroWithSearch() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [textAnimationKey, setTextAnimationKey] = useState(0);
  const [checkInDate, setCheckInDate] = useState(null);
  const [country, setCountry] = useState('');
  const [city, setCity] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
      setTextAnimationKey((k) => k + 1);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const { image, subtitle, title, description, videoLink } = slides[currentSlide];

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setTextAnimationKey((k) => k + 1);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setTextAnimationKey((k) => k + 1);
  };

  const handleDetectLocation = async () => {
    if (!navigator.geolocation) {
      alert("La géolocalisation n'est pas supportée.");
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      try {
        const res = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        );
        const address = res.data.address;
        const location = address.city || address.town || address.village || address.county;

        if (location) {
          setCountry(location);
          setCity(null);
        } else {
          alert("Impossible de détecter la ville.");
        }
      } catch (err) {
        console.error(err);
        alert("Erreur lors de la récupération de l'adresse.");
      }
    }, () => {
      alert("Impossible d'accéder à votre position.");
    });
  };

  return (
    <Box
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{
        position: 'relative',
        height: { xs: '100vh', md: '738px' },
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

      {/* Text Content */}
      <Container
        sx={{
          position: 'relative',
          zIndex: 2,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Box
          key={textAnimationKey}
          sx={{
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

        {/* Search Form inside Hero */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box
            sx={{
              backgroundColor: 'white',
              borderRadius: 8,
              boxShadow: 3,
              p: 3,
              width: '100%',
              maxWidth: '900px',
              mt: 4,
            }}
          >
            <Box component="form" sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
              {/* Destination */}
              <Autocomplete
                freeSolo
                options={countries}
                value={country}
                onChange={(e, newValue) => {
                  setCountry(newValue);
                  setCity(null);
                }}
                onInputChange={(e, newInputValue) => {
                  setCountry(newInputValue);
                  setCity(null);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Quelle destination ?"
                    placeholder="Quelle destination ?"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: <SearchIcon sx={{ mr: 1 }} />,
                    }}
                    fullWidth
                  />
                )}
                sx={{ flex: 1 }}
              />

              <IconButton onClick={handleDetectLocation} aria-label="Détecter ma position">
                <MyLocationIcon />
              </IconButton>

              {/* Date */}
              <FormControl fullWidth sx={{ flex: 1 }}>
<DatePicker
  label="Date de l'activité"
  value={checkInDate}
  onChange={(newValue) => setCheckInDate(newValue)}
  minDate={dayjs()} // ✅ Compatible avec AdapterDayjs
  slots={{ openPickerIcon: CalendarTodayIcon }}
  slotProps={{ textField: { fullWidth: true } }}
/>

              </FormControl>

              {/* Bouton */}
<Button
  variant="contained"
  color="primary"
  type="submit"
  sx={{
    flex: { xs: 'none', md: '0 0 auto' },
    height: '56px',
    minWidth: { xs: '100%', md: '120px' },
    mt: { xs: 2, md: 0 },
    backgroundColor: '#d65113',
    fontWeight: 'bold', // <- gras ici
  }}
>
  Inspirez moi
</Button>

            </Box>
          </Box>
        </LocalizationProvider>

        {/* Play button */}
        <Button
          component="a"
          href={videoLink}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            position: 'absolute',
            top: { md: '50%' },
            right: { md: '5%' },
            transform: 'translateY(-50%)',
            width: 80,
            height: 80,
            borderRadius: '50%',
            backgroundColor: 'white',
            color: '#007bff',
            display: { xs: 'none', md: 'flex' },
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

export default HeroWithSearch;
