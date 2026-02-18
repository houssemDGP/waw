import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  TextField,
  Slider,
  Button,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import TopBar from '../components/TopBar';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import SearchForm from '../components/SearchForm';
import FilterSlider from '../components/FilterSlider';
// Dummy data
const allEvents = [
  {
    id: 1,
    title: 'Festival de Musique',
    location: 'Tunis',
    days: 3,
    price: 0,
    image: 'https://source.unsplash.com/random/400x300?concert',
    amenities: [
      { icon: '', text: 'WiFi' },
      { icon: '', text: 'Restauration' },
      { icon: '', text: 'Piscine' },
    ],
  },
  {
    id: 2,
    title: 'Salon de l’artisanat',
    location: 'Sousse',
    days: 2,
    price: 15,
    image: 'https://source.unsplash.com/random/400x300?market',
    amenities: [{ icon: '' ,text: 'Snacks' }],
  },
  {
    id: 3,
    title: 'Conférence Tech',
    location: 'Sfax',
    days: 1,
    price: 30,
    image: 'https://source.unsplash.com/random/400x300?technology',
    amenities: [{ icon: '', text: 'WiFi' }],
  },
  {
    id: 4,
    title: 'Exposition de Peinture',
    location: 'Nabeul',
    days: 1,
    price: 10,
    image: 'https://source.unsplash.com/random/400x300?art',
    amenities: [],
  },
  {
    id: 5,
    title: 'Startup Hackathon',
    location: 'Monastir',
    days: 2,
    price: 25,
    image: 'https://source.unsplash.com/random/400x300?startup',
    amenities: [{ icon:'', text: 'WiFi' }],
  },
];

// Event Card Component
function EventCard({ event }) {
  return (
    <Box
      sx={{
        borderRadius: 1,
        overflow: 'hidden',
        boxShadow: 3,
        transition: 'transform 0.3s ease',
        '&:hover': { transform: 'translateY(-5px)' },
        bgcolor: 'background.paper',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        component="a"
        href="#"
        sx={{
          display: 'block',
          position: 'relative',
          height: 180,
          backgroundImage: `url(${event.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          textDecoration: 'none',
          color: 'white',
        }}
      >
        <Box
          className="price"
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            backgroundColor: 'primary.main',
            color: 'white',
            px: 1.5,
            py: 0.5,
            borderRadius: 1,
            fontSize: '0.8rem',
            fontWeight: 'bold',
          }}
        >
          {event.price === 0 ? 'Gratuit' : `${event.price} TND`}
        </Box>
      </Box>

      <Box sx={{ p: 2, textAlign: 'left', flexGrow: 1 }}>
        <Typography
          variant="body2"
          component="span"
          sx={{ color: 'primary.main', mb: 1, display: 'block' }}
        >
          {event.days} {event.days > 1 ? 'jours' : 'jour'}
        </Typography>
        <Typography variant="h6" component="h3" sx={{ mb: 1, fontWeight: 'bold' }}>
          {event.title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ display: 'flex', alignItems: 'center', mb: 2 }}
        >
          <LocationOnIcon fontSize="small" sx={{ mr: 0.5 }} /> {event.location}
        </Typography>
        <Box
          component="ul"
          sx={{
            listStyle: 'none',
            p: 0,
            m: 0,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1,
          }}
        >
          {event.amenities.map((amenity, i) => (
            <Box
              component="li"
              key={i}
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              {amenity.icon}
              <Typography variant="body2" ml={0.5}>
                {amenity.text}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

// Filters Panel
function FilterPanel({ filters, setFilters }) {
  return (
    <Box
      sx={{
        p: 2,
        borderRight: '1px solid #ddd',
        height: '100vh',
        position: { md: 'sticky' },
        top: 0,
        bgcolor: 'white',
      }}
    >
      <Typography variant="h6" gutterBottom>
        Filtres
      </Typography>

      <TextField
        label="Lieu"
        variant="outlined"
        fullWidth
        margin="normal"
        value={filters.location}
        onChange={(e) => setFilters({ ...filters, location: e.target.value })}
      />

      <Typography gutterBottom>Prix maximum (TND)</Typography>
      <Slider
        value={filters.price}
        onChange={(e, val) => setFilters({ ...filters, price: val })}
        min={0}
        max={100}
        step={5}
        valueLabelDisplay="auto"
        sx={{ mb: 3 }}
      />

      <Typography gutterBottom>Durée minimum (jours)</Typography>
      <Slider
        value={filters.days}
        onChange={(e, val) => setFilters({ ...filters, days: val })}
        min={1}
        max={10}
        step={1}
        valueLabelDisplay="auto"
        sx={{ mb: 3 }}
      />

      <Button
        variant="outlined"
        fullWidth
        onClick={() =>
          setFilters({ location: '', price: 100, days: 1 })
        }
      >
        Réinitialiser
      </Button>
    </Box>
  );
}

// Main Page
export default function EventsPage() {
  const [filters, setFilters] = useState({
    location: '',
    price: 100,
    days: 1,
  });

  const filteredEvents = allEvents.filter((ev) => {
    const matchLocation = filters.location
      ? ev.location.toLowerCase().includes(filters.location.toLowerCase())
      : true;
    const matchPrice = ev.price <= filters.price;
    const matchDays = ev.days >= filters.days;
    return matchLocation && matchPrice && matchDays;
  });

  return (<>
        <TopBar />
      <Navbar />
            <HeroSection />
      <SearchForm />
      <FilterSlider />
    <Grid container>
      {/* Filters Panel */}
      <Grid item xs={12} md={3}>
        <FilterPanel filters={filters} setFilters={setFilters} />
      </Grid>

      {/* Events Cards */}
      <Grid item xs={12} md={9} sx={{ p: { xs: 2, md: 4 }, bgcolor: '#f9f9f9' }}>
        <Grid container spacing={3}>
          {filteredEvents.length ? (
            filteredEvents.map((event) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={event.id}>
                <EventCard event={event} />
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="h6">
                Aucun événement trouvé
              </Typography>
            </Grid>
          )}
        </Grid>
      </Grid>
    </Grid>
    </>
  );
}
