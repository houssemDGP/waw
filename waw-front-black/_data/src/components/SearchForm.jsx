import React, { useEffect,useState } from 'react';
import {
  Autocomplete,
  Box,
  Container,
  Button,
  FormControl,
  TextField,IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import axios from 'axios';
import MyLocationIcon from '@mui/icons-material/MyLocation';

const countries = [
  'Tunis', 'Sfax', 'Sousse', 'Gabès', 'Bizerte', 'Kairouan', 'Gafsa', 'Tozeur', 'Djerba', 'Monastir',
];

const citiesByCountry = {
  France: ['Paris', 'Marseille', 'Lyon'],
  Italie: ['Rome', 'Milan', 'Naples'],
  Espagne: ['Madrid', 'Barcelone', 'Valence'],
};

const categories = ['Catégorie 1', 'Catégorie 2', 'Catégorie 3'];

function SearchForm() {
  const [checkInDate, setCheckInDate] = useState(null);
  const [category, setCategory] = useState(null);
  const [country, setCountry] = useState('');
  const [city, setCity] = useState(null);

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
        const location =
          address.city || address.town || address.village || address.county;

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
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          py: { xs: 4, md: 0 },
          position: 'relative',
          zIndex: 10,
          mt: { xs: 4, md: -10 },
        }}
      >
        <Container>
          <Box
            sx={{
              backgroundColor: 'white',
              borderRadius: 20,
              boxShadow: 3,
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Box sx={{ width: '100%' }}>
              <form action="#" style={{ width: '100%' }}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: 2,
                    width: '100%',
                  }}
                >
                  {/* Pays */}
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
                    }}
                  >
                    Inspire moi
                  </Button>
                </Box>
              </form>
            </Box>
          </Box>
        </Container>
      </Box>
    </LocalizationProvider>
  );
}

export default SearchForm;
