import React, { useState, useRef, useEffect } from "react";
import styled, { keyframes } from 'styled-components';
import {
  Button,
  Popper,
  Paper,
  ClickAwayListener,
  Link,
  Stack,
  Box,
  MenuList,
  MenuItem,
  Typography,
  FormControl,
  Radio,
  RadioGroup,
  FormHelperText,
  IconButton,
  TextField,
  Autocomplete,
  Chip,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Rating,
  Slider,
  Pagination,
  Divider,
  FormControlLabel,
  Checkbox,
  FormGroup
} from "@mui/material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormLabel
} from '@mui/material';
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import GroupIcon from "@mui/icons-material/Group";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import StarIcon from "@mui/icons-material/Star";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import PhoneIcon from "@mui/icons-material/Phone";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShareIcon from "@mui/icons-material/Share";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import ChatIcon from "@mui/icons-material/Chat";
import { LocalizationProvider, DateCalendar } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import dayjs from 'dayjs';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Navbar from '../components/Navbar';
import TopBar from '../components/TopBar';
import Footer from '../components/Footer';

// Configuration de l'icône Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

dayjs.locale('fr');

const Container = styled.div`
  display: flex;
  flex-direction: row;
  height: 100vh;
  width: 100vw;

  @media (max-width: 768px) {
    flex-direction: column-reverse;
    height: auto;
  }
`;

const MapWrapper = styled.div`
  flex: 1;
  height: 100%;

  @media (max-width: 768px) {
    height: 40vh;
    order: -1;
  }
`;

const ListWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: #f7f7f7;
  position: relative;
`;

const StickyFilters = styled.div`
  top: 0px;
  background: white;
  padding: 10px 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  z-index: 1200;

  display: flex;
  align-items: flex-start;
  flex-direction: column;
  gap: 12px;

  @media (min-width: 600px) {
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    justify-content: flex-start;
  }
`;

const RestaurantCard = styled.div`
  display: flex;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgb(0 0 0 / 0.1);
  background: white;
  margin-bottom: 20px;
  position: relative;
  cursor: pointer;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgb(0 0 0 / 0.2);
  }

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ImgWrapper = styled.div`
  flex: 0 0 30%;
  max-width: 30%;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Content = styled.div`
  flex: 1;
  padding: 20px 30px;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const Title = styled.h2`
  margin: 0 0 10px;
  color: #00564a;
  font-size: 1.4rem;
`;

const Address = styled.p`
  margin: 0 0 10px;
  color: #555;
  font-size: 0.95rem;
`;

const Price = styled.p`
  font-weight: 700;
  color: #ee4d2d;
  margin: 0 0 14px;
`;

const SlotsContainer = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 12px;
  padding-bottom: 8px;
  margin-top: 10px;

  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: #00564a;
    border-radius: 3px;
  }
`;

const Slot = styled.button`
  flex: 0 0 auto;
  padding: 8px 14px;
  border-radius: 20px;
  border: 1px solid #00564a;
  background: ${({ selected }) => (selected ? "#00564a" : "white")};
  color: ${({ selected }) => (selected ? "white" : "#00564a")};
  cursor: pointer;
  font-weight: 600;
  white-space: nowrap;

  &:hover {
    background-color: #007d67;
    color: white;
  }
`;

const InfoBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  position: absolute;
  top: 16px;
  right: 20px;
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  font-weight: bold;
  color: #444;
  font-size: 0.9rem;

  svg {
    color: #ffc107;
    font-size: 1rem;
    margin-right: 3px;
  }
`;

const Label = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  background: black;
  color: white;
  padding: 6px 12px;
  font-size: 0.75rem;
  font-weight: bold;
  border-bottom-right-radius: 10px;
  z-index: 2;
`;

const HeaderBar = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 16px;
`;

const blink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
`;

const Places = styled.span`
  color: black;
  font-size: 13px;
  font-weight: 500;
  margin-top: 4px;
  animation: ${blink} 1s infinite;
`;

const PriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  font-size: 16px;
  margin-top: 8px;
`;

// Composant RestaurantCard
const RestaurantCardComponent = ({ restaurant, onClick }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const getPriceRangeLabel = (priceRange) => {
    switch(priceRange) {
      case "BUDGET": return "$";
      case "MODERATE": return "$$";
      case "EXPENSIVE": return "$$$";
      case "LUXURY": return "$$$$";
      default: return "$$";
    }
  };

  const formatOpeningHours = (hours) => {
    if (!hours || hours.length === 0) return "Horaires non définis";
    
    const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long' });
    const todayUpper = today.charAt(0).toUpperCase() + today.slice(1);
    
    const todayHour = hours.find(h => 
      h.dayOfWeek === todayUpper.toUpperCase().replace('É', 'E')
    );
    
    if (!todayHour) return "Horaires non définis pour aujourd'hui";
    
    if (todayHour.isClosed) return "Fermé aujourd'hui";
    
    return `Ouvert aujourd'hui: ${todayHour.openingTime || '09:00'} - ${todayHour.closingTime || '18:00'}`;
  };

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    const userId = localStorage.getItem("userId");
    
    if (!userId) {
      alert("Veuillez vous connecter pour ajouter aux favoris");
      return;
    }

    try {
      // API à adapter pour les restaurants
      const res = await fetch(`https://waw.com.tn/api/api/wishlist/add-restaurant?userId=${userId}&restaurantId=${restaurant.id}`, {
        method: 'POST'
      });

      if (res.ok) {
        setIsFavorite(!isFavorite);
        const current = Number(localStorage.getItem("fav-count")) || 0;
        localStorage.setItem("fav-count", (current + 1).toString());
        window.dispatchEvent(new Event("fav-count-changed"));
      }
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  return (
    <RestaurantCard onClick={onClick}>
      {/* Badge type de cuisine */}
      {restaurant.cuisineType && <Label>{restaurant.cuisineType}</Label>}

      <ImgWrapper style={{ position: 'relative' }}>
        <Box
          sx={{
            position: 'absolute',
            bottom: 8,
            right: 8,
            display: 'flex',
            gap: 1,
            zIndex: 2
          }}
        >
          <Box
            sx={{
              backgroundColor: 'white',
              borderRadius: '50%',
              p: 0.5,
              boxShadow: 1,
              cursor: 'pointer',
              '&:hover': { backgroundColor: '#f5f5f5' }
            }}
            onClick={handleFavoriteClick}
          >
            <FavoriteBorderIcon sx={{ 
              fontSize: 20, 
              color: isFavorite ? '#d62828' : '#555' 
            }} />
          </Box>
        </Box>
        <Image 
          src={restaurant.coverImageUrl || restaurant.logoUrl || "/default-restaurant.jpg"} 
          alt={restaurant.name} 
        />
      </ImgWrapper>

      <Content>
        <InfoBar>
          <RatingContainer>
            <StarIcon />
            <span>{restaurant.rating || "N/A"}</span>
          </RatingContainer>
        </InfoBar>

        <Title>{restaurant.name}</Title>
        <Address>
          <LocationOnIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 1 }} />
          {restaurant.city}
        </Address>
        
        <PriceRow>
          <Price>{getPriceRangeLabel(restaurant.priceRange)}</Price>
          <Places>
            <AccessTimeIcon sx={{ fontSize: 14, verticalAlign: 'middle', mr: 0.5 }} />
            {formatOpeningHours(restaurant.openingHours)}
          </Places>
        </PriceRow>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          <RestaurantIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 1 }} />
          {restaurant.cuisineType || "Cuisine variée"}
        </Typography>

        {/* Types de clientèle */}
        {restaurant.clientTypes && restaurant.clientTypes.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
              Ambiance:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {restaurant.clientTypes.slice(0, 3).map((type, index) => (
                <Chip
                  key={index}
                  label={type.replace('_', ' ').toLowerCase()}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.7rem' }}
                />
              ))}
              {restaurant.clientTypes.length > 3 && (
                <Chip
                  label={`+${restaurant.clientTypes.length - 3}`}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.7rem' }}
                />
              )}
            </Box>
          </Box>
        )}

        {/* Équipements */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          {restaurant.hasParking && (
            <Chip
              icon={<LocalParkingIcon />}
              label="Parking"
              size="small"
              variant="outlined"
              sx={{ fontSize: '0.7rem' }}
            />
          )}
          {restaurant.hasPrivateRooms && (
            <Chip
              label="Salles privées"
              size="small"
              variant="outlined"
              sx={{ fontSize: '0.7rem' }}
            />
          )}
        </Box>

        {/* Description (tronquée) */}
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            flexGrow: 1
          }}
        >
          {restaurant.description || "Aucune description disponible"}
        </Typography>

        {/* Actions */}
        <CardActions sx={{ p: 0, pt: 2, justifyContent: 'space-between' }}>
          <Button 
            size="small" 
            variant="outlined"
            onClick={(e) => {
              e.stopPropagation();
              window.open(`tel:${restaurant.phone}`, '_blank');
            }}
            startIcon={<PhoneIcon />}
          >
            Appeler
          </Button>
          <Button 
            size="small" 
            variant="contained"
            sx={{ backgroundColor: 'black' }}
          >
            Voir détails
          </Button>
        </CardActions>
      </Content>
    </RestaurantCard>
  );
};

export default function RestaurantsPage() {
  const navigate = useNavigate();
  
  // États filtres
  const [dateOpen, setDateOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const dateAnchorRef = useRef(null);

  const [hourOpen, setHourOpen] = useState(false);
  const [selectedHour, setSelectedHour] = useState(null);
  const hourAnchorRef = useRef(null);

  const [persOpen, setPersOpen] = useState(false);
  const [selectedPers, setSelectedPers] = useState(2);
  const persAnchorRef = useRef(null);

  const [anchorType, setAnchorType] = useState(null);
  const [anchorPrix, setAnchorPrix] = useState(null);
  const [anchorClientType, setAnchorClientType] = useState(null);
  const [anchorEquipments, setAnchorEquipments] = useState(null);

  // États des filtres
  const [cuisineType, setCuisineType] = useState("");
  const [priceRange, setPriceRange] = useState([0, 3000]);
  const [clientTypes, setClientTypes] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [openNow, setOpenNow] = useState(false);
  const [searchText, setSearchText] = useState("");

  // États des données
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [cities, setCities] = useState([]);
  const [cuisineTypes, setCuisineTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Options pour les filtres
  const clientTypeOptions = [
    "EN_FAMILLE", "ENTRE_AMIS", "ROMANTIQUE", "FESTIF", "COSY", 
    "IMMERSIF", "ANNIVERSAIRE", "MARIAGES", "EVENEMENTS_ENTREPRISE", 
    "REPAS_AFFAIRES", "SPECIAL_GROUPE"
  ];

  const equipmentOptions = [
    { value: "hasParking", label: "Parking", icon: <LocalParkingIcon /> },
    { value: "hasPrivateRooms", label: "Salles privées" }
  ];

  const hours = Array.from({ length: 24 }, (_, i) => {
    const hour = String(i).padStart(2, "0");
    return `${hour}:00`;
  });
  const persons = Array.from({ length: 30 }, (_, i) => i + 1);

  // Charger les restaurants
  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://waw.com.tn/api/api/restaurants');
      if (!response.ok) throw new Error('Erreur de chargement');
      const data = await response.json();
      
      // Filtrer seulement les restaurants actifs
      const activeRestaurants = data.filter(r => r.isActive);
      setRestaurants(activeRestaurants);
      setFilteredRestaurants(activeRestaurants);
      
      // Extraire les villes uniques
      const uniqueCities = [...new Set(activeRestaurants.map(r => r.city).filter(Boolean))];
      setCities(uniqueCities.sort());
      
      // Extraire les types de cuisine uniques
      const uniqueCuisines = [...new Set(activeRestaurants.map(r => r.cuisineType).filter(Boolean))];
      setCuisineTypes(uniqueCuisines.sort());
      
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      alert('Erreur lors du chargement des restaurants');
    } finally {
      setLoading(false);
    }
  };

  // Appliquer les filtres
  useEffect(() => {
    let result = [...restaurants];

    // Filtre par recherche textuelle
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      result = result.filter(r => 
        r.name.toLowerCase().includes(searchLower) ||
        (r.description && r.description.toLowerCase().includes(searchLower)) ||
        (r.cuisineType && r.cuisineType.toLowerCase().includes(searchLower))
      );
    }

    // Filtre par type de cuisine
    if (cuisineType) {
      result = result.filter(r => r.cuisineType === cuisineType);
    }

    // Filtre par gamme de prix
    result = result.filter(r => {
      const priceValue = r.priceRange === "BUDGET" ? 1 :
                        r.priceRange === "MODERATE" ? 2 :
                        r.priceRange === "EXPENSIVE" ? 3 :
                        r.priceRange === "LUXURY" ? 4 : 2;
      return priceValue >= priceRange[0] && priceValue <= priceRange[1];
    });

    // Filtre par types de clientèle
    if (clientTypes.length > 0) {
      result = result.filter(r => 
        r.clientTypes && 
        clientTypes.some(type => r.clientTypes.includes(type))
      );
    }

    // Filtre par équipements
    if (equipments.includes("hasParking")) {
      result = result.filter(r => r.hasParking === true);
    }
    if (equipments.includes("hasPrivateRooms")) {
      result = result.filter(r => r.hasPrivateRooms === true);
    }

    // Filtre restaurants ouverts maintenant
    if (openNow) {
      const now = new Date();
      const currentDay = now.toLocaleDateString('fr-FR', { weekday: 'long' });
      const currentDayUpper = currentDay.charAt(0).toUpperCase() + currentDay.slice(1);
      const currentTime = now.toTimeString().slice(0, 5);
      
      result = result.filter(r => {
        if (!r.openingHours || r.openingHours.length === 0) return false;
        
        const todayHour = r.openingHours.find(h => 
          h.dayOfWeek === currentDayUpper.toUpperCase().replace('É', 'E')
        );
        
        if (!todayHour || todayHour.isClosed) return false;
        
        const openingTime = todayHour.openingTime || '00:00';
        const closingTime = todayHour.closingTime || '23:59';
        
        return currentTime >= openingTime && currentTime <= closingTime;
      });
    }

    setFilteredRestaurants(result);
  }, [searchText, cuisineType, priceRange, clientTypes, equipments, openNow, restaurants]);

  // Gestion des filtres
  const toggleDateOpen = () => {
    setDateOpen((v) => !v);
    setHourOpen(false);
    setPersOpen(false);
  };

  const toggleHourOpen = () => {
    setHourOpen((v) => !v);
    setDateOpen(false);
    setPersOpen(false);
  };

  const togglePersOpen = () => {
    setPersOpen((v) => !v);
    setDateOpen(false);
    setHourOpen(false);
  };

  const toggleType = (event) => {
    setAnchorType(anchorType ? null : event.currentTarget);
  };

  const togglePrix = (event) => {
    setAnchorPrix(anchorPrix ? null : event.currentTarget);
  };

  const toggleClientType = (event) => {
    setAnchorClientType(anchorClientType ? null : event.currentTarget);
  };

  const toggleEquipments = (event) => {
    setAnchorEquipments(anchorEquipments ? null : event.currentTarget);
  };

  const closeDatePopper = (event) => {
    if (dateAnchorRef.current && dateAnchorRef.current.contains(event.target)) return;
    setDateOpen(false);
  };

  const closeHourPopper = (event) => {
    if (hourAnchorRef.current && hourAnchorRef.current.contains(event.target)) return;
    setHourOpen(false);
  };

  const closePersPopper = (event) => {
    if (persAnchorRef.current && persAnchorRef.current.contains(event.target)) return;
    setPersOpen(false);
  };

  const closeType = () => setAnchorType(null);
  const closePrix = () => setAnchorPrix(null);
  const closeClientType = () => setAnchorClientType(null);
  const closeEquipments = () => setAnchorEquipments(null);

  const openType = Boolean(anchorType);
  const openPrix = Boolean(anchorPrix);
  const openClientType = Boolean(anchorClientType);
  const openEquipments = Boolean(anchorEquipments);

  const handleRestaurantClick = (restaurantId) => {
    navigate(`/restaurants/${restaurantId}`);
  };

  const clearAllFilters = () => {
    setSearchText("");
    setCuisineType("");
    setPriceRange([0, 3000]);
    setClientTypes([]);
    setEquipments([]);
    setOpenNow(false);
    setSelectedHour(null);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>Chargement des restaurants...</Typography>
      </Box>
    );
  }

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Rock+Salt&display=swap"
        rel="stylesheet"
      />
      <TopBar />
      <Navbar />
      
      <StickyFilters>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { 
              xs: 'repeat(2, 1fr)',
              sm: 'repeat(4, auto)'
            },
            gap: 2,
            width: '100%',
            alignItems: 'center'
          }}
        >
 {/*           <Button
            ref={dateAnchorRef}
            variant="outlined"
            startIcon={<CalendarMonthIcon />}
            sx={{
              textTransform: "none",
              fontWeight: 500,
              borderColor: "#e5e7eb",
              color: "#2a3944",
              borderRadius: "20px",
              fontSize: { xs: '0.8rem', sm: '1rem' },
              gridColumn: { xs: '1 / -1', sm: 'auto' },
              "&:hover": { backgroundColor: "black10", borderColor: "black" }
            }}
            onClick={toggleDateOpen}
          >
            {selectedDate ? selectedDate.format('DD MMMM YYYY') : 'Date'}
          </Button>

         
          <Button
            ref={hourAnchorRef}
            variant="outlined"
            startIcon={<AccessTimeIcon />}
            sx={{
              textTransform: "none",
              fontWeight: 500,
              borderColor: "#e5e7eb",
              color: "#2a3944",
              borderRadius: "20px",
              "&:hover": { backgroundColor: "black10", borderColor: "black" }
            }}
            onClick={toggleHourOpen}
          >
            {selectedHour || "Heure"}
          </Button>

          <Button
            ref={persAnchorRef}
            variant="outlined"
            startIcon={<GroupIcon />}
            sx={{
              textTransform: "none",
              fontWeight: 500,
              borderColor: "#e5e7eb",
              borderRadius: "20px",
              color: "#2a3944",
              "&:hover": { backgroundColor: "black10", borderColor: "black" }
            }}
            onClick={togglePersOpen}
          >
            {selectedPers} Pers.
          </Button>
Filtre Heure */}
          {/* Filtre Type de cuisine */}
          <Button
            variant="outlined"
            sx={{
              textTransform: "none",
              fontWeight: 500,
              borderColor: cuisineType ? "black" : "#e5e7eb",
              borderRadius: "20px",
              color: cuisineType ? "#fff" : "#2a3944",
              backgroundColor: cuisineType ? "black" : "transparent",
              "&:hover": {
                backgroundColor: cuisineType ? "black" : "black10",
                borderColor: "black",
                color: cuisineType ? "#fff" : "black",
              },
            }}
            onClick={toggleType}
          >
            {cuisineType || "Cuisine"}
          </Button>

          {/* Filtre Prix */}
          <Button 
            variant="outlined"   
            sx={{
              textTransform: "none",
              fontWeight: 500,
              borderColor: "#e5e7eb",
              borderRadius: "20px",
              color: "#2a3944",
              "&:hover": { backgroundColor: "black10", borderColor: "black" }
            }} 
            onClick={togglePrix}
          >
            Prix
          </Button>

          {/* Bouton pour plus de filtres */}
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            sx={{
              textTransform: "none",
              fontWeight: 500,
              borderColor: "#e5e7eb",
              borderRadius: "20px",
              color: "#2a3944",
              "&:hover": { backgroundColor: "black10", borderColor: "black" }
            }}
            onClick={toggleClientType}
          >
            Plus de filtres
          </Button>

          {/* Bouton effacer filtres */}
          {(searchText || cuisineType || priceRange[0] > 0 || priceRange[1] < 3000 || 
            clientTypes.length > 0 || equipments.length > 0 || openNow) && (
            <Button
              variant="text"
              startIcon={<ClearIcon />}
              sx={{
                textTransform: "none",
                color: "#d32f2f",
                "&:hover": { backgroundColor: "#ffebee" }
              }}
              onClick={clearAllFilters}
            >
              Effacer
            </Button>
          )}

                 {/* Champ de recherche */}
        <TextField
          fullWidth
          size="small"
          placeholder="Rechercher un restaurant..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
          }}
          sx={{ borderRadius: "20px" }}
        />
        </Box>

 

        {/* Poppers pour les filtres */}
        
        {/* Popper Date */}
        <Popper open={dateOpen} anchorEl={dateAnchorRef.current} placement="bottom-start" style={{ zIndex: 1600 }}>
          <ClickAwayListener onClickAway={closeDatePopper}>
            <Paper sx={{ p: 1 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
                <DateCalendar
                  value={selectedDate}
                  onChange={(newDate) => {
                    setSelectedDate(newDate);
                    setDateOpen(false);
                  }}
                  minDate={dayjs()}
                />
              </LocalizationProvider>
            </Paper>
          </ClickAwayListener>
        </Popper>

        {/* Popper Heure */}
        <Popper open={hourOpen} anchorEl={hourAnchorRef.current} placement="bottom-start" style={{ zIndex: 1600 }}>
          <ClickAwayListener onClickAway={closeHourPopper}>
            <Paper sx={{ maxHeight: 250, overflowY: "auto", minWidth: 350, p: 2 }}>
              <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ borderRadius: "25px" }}
                  onClick={() => {
                    setSelectedHour(null);
                    setHourOpen(false);
                  }}
                >
                  Tous
                </Button>
                {hours.map((h) => (
                  <Button
                    key={h}
                    variant={selectedHour === h ? "contained" : "outlined"}
                    size="small"
                    sx={{ borderRadius: "25px" }}
                    onClick={() => {
                      setSelectedHour(h);
                      setHourOpen(false);
                    }}
                  >
                    {h}
                  </Button>
                ))}
              </Box>
            </Paper>
          </ClickAwayListener>
        </Popper>

        {/* Popper Personnes */}
        <Popper open={persOpen} anchorEl={persAnchorRef.current} placement="bottom-start" style={{ zIndex: 1600 }}>
          <ClickAwayListener onClickAway={closePersPopper}>
            <Paper sx={{ maxHeight: 250, overflowY: "auto", minWidth: 350, p: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2 }}>
                <Button onClick={() => setSelectedPers(Math.max(1, selectedPers - 1))}>-</Button>
                <TextField
                  type="number"
                  value={selectedPers}
                  onChange={(e) => setSelectedPers(Number(e.target.value))}
                  inputProps={{ min: 1, max: 100 }}
                  sx={{ width: 80 }}
                />
                <Button onClick={() => setSelectedPers(Math.min(100, selectedPers + 1))}>+</Button>
              </Box>
            </Paper>
          </ClickAwayListener>
        </Popper>

        {/* Popper Type de cuisine */}
        <Popper open={openType} anchorEl={anchorType} placement="bottom-start" style={{ zIndex: 1600 }}>
          <Paper sx={{ maxHeight: 300, overflowY: "auto", minWidth: 250 }}>
            <ClickAwayListener onClickAway={closeType}>
              <MenuList>
                <MenuItem onClick={() => { setCuisineType(""); closeType(); }}>
                  Tous les types
                </MenuItem>
                {cuisineTypes.map((type) => (
                  <MenuItem
                    key={type}
                    selected={cuisineType === type}
                    onClick={() => { setCuisineType(type); closeType(); }}
                  >
                    {type}
                  </MenuItem>
                ))}
              </MenuList>
            </ClickAwayListener>
          </Paper>
        </Popper>

        {/* Popper Prix */}
        <Popper open={openPrix} anchorEl={anchorPrix} placement="bottom-start" style={{ zIndex: 1600, width: 350 }}>
          <ClickAwayListener onClickAway={closePrix}>
            <Paper sx={{ p: 3, width: 350 }}>
              <Typography variant="subtitle1" gutterBottom>
                Gamme de prix
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {priceRange[0] === 0 && priceRange[1] === 3000 
                  ? "Toutes les gammes" 
                  : `${priceRange[0]} - ${priceRange[1]}`}
              </Typography>
              <Slider
                value={priceRange}
                onChange={(e, newValue) => setPriceRange(newValue)}
                valueLabelDisplay="auto"
                min={0}
                max={3000}
                step={1}
                sx={{ color: "black" }}
              />
              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                <Button onClick={() => setPriceRange([0, 3000])}>Réinitialiser</Button>
                <Button variant="contained" onClick={closePrix}>Appliquer</Button>
              </Box>
            </Paper>
          </ClickAwayListener>
        </Popper>

        {/* Popper Types de clientèle */}
        <Popper open={openClientType} anchorEl={anchorClientType} placement="bottom-start" style={{ zIndex: 1600, width: 300 }}>
          <ClickAwayListener onClickAway={closeClientType}>
            <Paper sx={{ p: 2, width: 300 }}>
              <Typography variant="subtitle1" gutterBottom>
                Types de clientèle
              </Typography>
              <FormGroup>
                {clientTypeOptions.map((type) => (
                  <FormControlLabel
                    key={type}
                    control={
                      <Checkbox
                        checked={clientTypes.includes(type)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setClientTypes([...clientTypes, type]);
                          } else {
                            setClientTypes(clientTypes.filter(t => t !== type));
                          }
                        }}
                      />
                    }
                    label={type.replace('_', ' ').toLowerCase()}
                  />
                ))}
              </FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={openNow}
                    onChange={(e) => setOpenNow(e.target.checked)}
                  />
                }
                label="Ouverts maintenant"
              />
            </Paper>
          </ClickAwayListener>
        </Popper>

        {/* Popper Équipements */}
        <Popper open={openEquipments} anchorEl={anchorEquipments} placement="bottom-start" style={{ zIndex: 1600, width: 250 }}>
          <ClickAwayListener onClickAway={closeEquipments}>
            <Paper sx={{ p: 2, width: 250 }}>
              <Typography variant="subtitle1" gutterBottom>
                Équipements
              </Typography>
              <FormGroup>
                {equipmentOptions.map((option) => (
                  <FormControlLabel
                    key={option.value}
                    control={
                      <Checkbox
                        checked={equipments.includes(option.value)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setEquipments([...equipments, option.value]);
                          } else {
                            setEquipments(equipments.filter(e => e !== option.value));
                          }
                        }}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {option.icon} {option.label}
                      </Box>
                    }
                  />
                ))}
              </FormGroup>
            </Paper>
          </ClickAwayListener>
        </Popper>
      </StickyFilters>

      <center style={{ textAlign: 'center', padding: '20px' }}>
        <Typography
          variant="h5"
          sx={{ 
            color: 'black', 
            fontWeight: 'bold',
            fontFamily: "Rock Salt",
            fontSize: { xs: '1rem', md: '1.5rem' }
          }}
        >
          Découvrez les meilleurs restaurants
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          {filteredRestaurants.length} restaurant{filteredRestaurants.length !== 1 ? 's' : ''} disponible{filteredRestaurants.length !== 1 ? 's' : ''}
        </Typography>
      </center>

      <Container>
        <ListWrapper>

          {filteredRestaurants.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <RestaurantIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                Aucun restaurant trouvé
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Essayez de modifier vos critères de recherche
              </Typography>
              <Button 
                variant="outlined" 
                onClick={clearAllFilters}
                startIcon={<ClearIcon />}
              >
                Réinitialiser les filtres
              </Button>
            </Box>
          ) : (
            filteredRestaurants.map((restaurant) => (
              <div key={restaurant.id} onClick={() => handleRestaurantClick(restaurant.id)}>
                <RestaurantCardComponent restaurant={restaurant} />
              </div>
            ))
          )}
        </ListWrapper>

        <MapWrapper>
          <MapContainer
            center={[33.8869, 9.5375]}
            zoom={6}
            scrollWheelZoom={true}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; OpenStreetMap'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {filteredRestaurants.map((restaurant) => (
              <Marker 
                key={restaurant.id} 
                position={[restaurant.latitude || 33.8869, restaurant.longitude || 9.5375]}
              >
                <Popup>
                  <div>
                    <img 
                      src={restaurant.coverImageUrl || restaurant.logoUrl || "/default-restaurant.jpg"}
                      alt={restaurant.name} 
                      style={{ width: 150, height: 100, objectFit: "cover", borderRadius: 8 }}
                    />
                    <div style={{ marginTop: 8 }}>
                      <b>{restaurant.name}</b>
                      <p style={{ margin: '4px 0', fontSize: 14 }}>{restaurant.city}</p>
                      <p style={{ margin: '4px 0', fontSize: 12, color: '#666' }}>
                        {restaurant.cuisineType}
                      </p>
                      <Button 
                        size="small" 
                        variant="contained" 
                        sx={{ mt: 1, backgroundColor: 'black' }}
                        onClick={() => handleRestaurantClick(restaurant.id)}
                      >
                        Voir détails
                      </Button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </MapWrapper>
      </Container>
      
      <Footer />
    </>
  );
}