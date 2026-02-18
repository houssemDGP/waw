import React, { useState, useEffect, useRef, useMemo } from 'react';
import styled from 'styled-components';
import TopBar from '../components/TopBar';
import Navbar from '../components/Navbar';
import PageMeta from "../components/common/PageMeta";
import {
  Check as CheckIcon,
  Block as BlockIcon,
  People as PeopleIcon,
  OutdoorGrill as OutdoorIcon,
  AcUnit as AcUnitIcon,
  Whatshot as HeatIcon,
  SmokingRooms as SmokingIcon,
} from "@mui/icons-material";

import {
  VerifiedOutlined,
  LocationOn as LocationOnIcon,
  Star as StarIcon,
  ArrowBackIos,
  ArrowForwardIos,
  Close,
  AccessTime,
  LocalParking,
  Restaurant as RestaurantIcon,
  Phone,
  Facebook,
  Instagram,
  Share,
  Favorite,
  FavoriteBorder
} from "@mui/icons-material";
import {
  Button,
  Typography,
  IconButton,
  Chip,  Card,
  CardContent,

  Box,
  Grid,
  Rating,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Alert
} from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from 'axios';
import { useParams, useNavigate } from "react-router-dom";
import dayjs from 'dayjs';
import 'dayjs/locale/fr';



// Configuration de l'icône Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

dayjs.locale('fr');

// Styled Components
const Container = styled.div`
  display: flex;
  gap: 30px;
  margin-top: 30px;
  margin-right: auto;
  padding: 0 20px;

  @media screen and (max-width: 768px) {
    flex-direction: column;
    padding: 0 10px;
  }
`;

const LeftColumn = styled.div`
  width: 70%;
`;

const RightStickyColumn = styled.div`
  flex: 2;
  top: 20px;
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  height: fit-content;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

  @media screen and (max-width: 768px) {
    position: static;
  }
`;

const TitleSection = styled.h3`
  color: black;
  font-weight: 700;
  margin-bottom: 16px;
  margin-top: 32px;
  font-size: 1.5rem;
  border-bottom: 2px solid black;
  padding-bottom: 8px;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
  margin-top: 16px;

  div {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    display: flex;
    align-items: center;
    padding: 12px;
    color: #333;
    font-size: 15px;
    background: #f9f9f9;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      border-color: black;
    }

    .feature-icon {
      margin-right: 12px;
      font-size: 24px;
      color: black;
    }
  }
`;

const DescriptionBlock = styled.div`
  margin-top: 30px;

  p {
    font-size: 16px;
    line-height: 1.7;
    color: #444;
    text-align: justify;
  }
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 15px;
  margin: 12px 0;
  padding: 8px 0;
  border-bottom: 1px solid #eee;

  span:first-child {
    font-weight: 600;
    color: #333;
  }

  span:last-child {
    color: #666;
  }
`;

const PublisherRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;

  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid black;
  }
`;

const ReserveButton = styled.button`
  margin-top: 24px;
  width: 100%;
  padding: 14px;
  background-color: black;
  color: #fff;
  border: none;
  font-weight: bold;
  font-size: 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #0f10a8;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(24, 26, 214, 0.2);
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const HeaderSection = styled.div`
  margin-bottom: 24px;
`;

const RestaurantTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  color: black;
  margin-bottom: 8px;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  color: #666;
  font-size: 16px;
  margin-bottom: 16px;

  .rating {
    display: flex;
    align-items: center;
    gap: 4px;
    color: #ff9500;
    font-weight: 600;
  }
`;

const ImageGallery = styled.div`
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 24px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
`;

const MainImage = styled.div`
  width: 100%;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
    cursor: pointer;

    &:hover {
      transform: scale(1.05);
    }
  }

  @media (max-width: 768px) {
    height: 300px;
  }
`;

const ThumbnailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-top: 10px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const Thumbnail = styled.div`
  overflow: hidden;
  border-radius: 8px;
  cursor: pointer;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.1);
    }
  }

  &.more {
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    font-size: 18px;
  }
`;

const Slider = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.9);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Slides = styled.div`
  position: relative;
  width: 90%;
  max-width: 1200px;
  height: 80vh;
  border-radius: 12px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    background: #000;
  }
`;

const NavigationButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 24px;
  transition: all 0.3s ease;
  z-index: 10000;

  &:hover {
    background: rgba(255, 255, 255, 0.4);
  }

  &.prev {
    left: 20px;
  }

  &.next {
    right: 20px;
  }

  &.close {
    top: 20px;
    right: 20px;
    transform: none;
    background: rgba(255, 255, 255, 0.1);
  }
`;

const OpeningHoursTable = styled.div`
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  margin-top: 20px;
`;

const DayRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #e0e0e0;

  &:last-child {
    border-bottom: none;
  }

  .day {
    font-weight: 600;
    color: #333;
  }

  .hours {
    color: #666;

    &.closed {
      color: #f44336;
      font-weight: 600;
    }
  }
`;

const ClientTypesGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
`;

const MapContainerStyled = styled.div`
  height: 400px;
  border-radius: 12px;
  overflow: hidden;
  margin-top: 24px;
  border: 1px solid #e0e0e0;
`;

const SocialButtons = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #eee;
`;

const SocialButton = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f5f5f5;
  color: #333;
  text-decoration: none;
  transition: all 0.3s ease;

  &:hover {
    background: black;
    color: white;
    transform: translateY(-2px);
  }

  &.facebook:hover {
    background: #1877f2;
  }

  &.instagram:hover {
    background: #e4405f;
  }
`;

const BottomStickyBar = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  border-top: 1px solid #e0e0e0;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1000;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
    padding: 12px 16px;
  }
`;

const PriceDisplay = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: black;

  .from {
    font-size: 1rem;
    color: #666;
    font-weight: 400;
  }
`;

// Composant principal
const RestaurantDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const rightColumnRef = useRef(null);

  // États
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const [openSlider, setOpenSlider] = useState(false);
  const [slideNumber, setSlideNumber] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [reservationModalOpen, setReservationModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  // États supplémentaires
  const [availableSpaces, setAvailableSpaces] = useState([]);
  const [availableTables, setAvailableTables] = useState([]);
  const [showAllSpaces, setShowAllSpaces] = useState(false);

  // Fonctions pour charger les données
  const fetchAvailableSpaces = async (date) => {
    try {
      const response = await axios.get(
        `https://waw.com.tn/api/api/restaurant-places/restaurant/${id}/active`,
        { params: { date } }
      );

      setAvailableSpaces(response.data);
      // Réinitialiser la sélection d'espace si la date change
      setReservationData(prev => ({ ...prev, spaceId: null, tableId: null }));
    } catch (error) {
      console.error('Erreur chargement espaces:', error);
      setAvailableSpaces([]);
    }
  };

  const fetchTableReservations = async (date) => {
    try {
      const response = await axios.get(
        'https://waw.com.tn/api/api/ramadan-reservations/check-date',
        {
          params: {
            date: date,
            restaurantId: id
          }
        }
      );
      
      return response.data.reservedTables || [];
    } catch (error) {
      console.error('Erreur lors de la vérification des réservations:', error);
      return [];
    }
  };

  const fetchAvailableTables = async (spaceId) => {
    try {
      const response = await axios.get(
        `https://waw.com.tn/api/api/restaurant-tables/place/${spaceId}`,
        { 
          params: { 
            date: reservationData.date // Pas de paramètre time
          } 
        }
      );
      
      // Vérifier les réservations pour toute la journée
      const reservedTables = await fetchTableReservations(reservationData.date);
const tablesWithAvailability = response.data.map(table => ({
  ...table,
  isReserved: reservedTables.some(reserved => reserved.tableId === table.id),
  reservedInfo: reservedTables.find(reserved => reserved.tableId === table.id)
}));
// Remove reserved tables
const cleanedTables = tablesWithAvailability.filter(
  table => !table.isReserved
);

setAvailableTables(cleanedTables);

      setReservationData(prev => ({ ...prev, tableId: null }));
    } catch (error) {
      console.error('Erreur chargement tables:', error);
      setAvailableTables([]);
    }
  };

const filterSpacesByCapacity = (totalGuests) => {
  if (!restaurant.spaces) return;
  
  const filtered = restaurant.spaces.filter(space => space.capacity >= totalGuests);
  setAvailableSpaces(filtered);
};

  // Initialiser les espaces disponibles
  useEffect(() => {
    if (restaurant?.spaces) {
      setAvailableSpaces(restaurant.spaces);
    }
  }, [restaurant]);

  // États pour la réservation
const [reservationData, setReservationData] = useState({
  date: dayjs().format('YYYY-MM-DD'),
  guestsAdult: 2, // Changed from guests
  guestsEnfant: 0,
  guestsBebe: 0,
  name: '',
  email: '',
  phone: '',
  specialRequests: '',
  spaceId: null,
  tableId: null,
  reservationType: 'IFTAR'
});


const totalGuests = useMemo(() => {
  return reservationData.guestsAdult + reservationData.guestsEnfant + reservationData.guestsBebe;
}, [reservationData.guestsAdult, reservationData.guestsEnfant, reservationData.guestsBebe]);

  // Charger les données du restaurant
  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://waw.com.tn/api/api/restaurants/${id}`);
        const data = response.data;
        setRestaurant(data);
        
        // Définir l'image principale
        if (data.coverImageUrl) {
          setMainImage(data.coverImageUrl);
        } else if (data.logoUrl) {
          setMainImage(data.logoUrl);
        } else if (data.galleryImages && data.galleryImages.length > 0) {
          setMainImage(data.galleryImages[0]);
        }
        
        // Vérifier si le restaurant est en favoris
        const userId = localStorage.getItem('userId');
        if (userId) {
          const favResponse = await axios.get(`https://waw.com.tn/api/api/wishlist/check-restaurant?userId=${userId}&restaurantId=${id}`);
          setIsFavorite(favResponse.data.isFavorite || false);
        }
      } catch (err) {
        console.error('Error fetching restaurant:', err);
        setError('Erreur lors du chargement du restaurant');
      } finally {
        setLoading(false);
      }
    };
    fetchAvailableSpaces(reservationData.date);
    fetchRestaurant();
  }, [id]);

  // Gestion du slider d'images
  const allImages = useMemo(() => {
    if (!restaurant) return [];
    const images = [];
    
    if (restaurant.coverImageUrl) images.push(restaurant.coverImageUrl);
    if (restaurant.logoUrl) images.push(restaurant.logoUrl);
    if (restaurant.galleryImages) {
      images.push(...restaurant.galleryImages);
    }
    
    return [...new Set(images)].filter(img => img);
  }, [restaurant]);

  const handleOpenSlider = (index) => {
    setSlideNumber(index);
    setOpenSlider(true);
  };

  const handleCloseSlider = () => {
    setOpenSlider(false);
  };

  const handlePrev = () => {
    setSlideNumber(prev => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSlideNumber(prev => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  // Gestion des favoris
  const handleFavoriteClick = async () => {
    const userId = localStorage.getItem('userId');
    
    if (!userId) {
      alert('Veuillez vous connecter pour ajouter aux favoris');
      navigate('/login');
      return;
    }

    try {
      if (isFavorite) {
        await axios.delete(`https://waw.com.tn/api/api/wishlist/remove-restaurant?userId=${userId}&restaurantId=${id}`);
      } else {
        await axios.post(`https://waw.com.tn/api/api/wishlist/add-restaurant?userId=${userId}&restaurantId=${id}`);
      }
      setIsFavorite(!isFavorite);
      
      const current = Number(localStorage.getItem("fav-count")) || 0;
      localStorage.setItem("fav-count", isFavorite ? (current - 1).toString() : (current + 1).toString());
      window.dispatchEvent(new Event("fav-count-changed"));
    } catch (err) {
      console.error('Erreur:', err);
      alert('Erreur lors de la mise à jour des favoris');
    }
  };
const [isSubmitting, setIsSubmitting] = useState(false);
  // Gestion de la réservation
  const handleReservationSubmit = async () => {
    try {
      // Valider les données
      if (!reservationData.name || !reservationData.email || !reservationData.phone) {
        alert('Veuillez remplir tous les champs obligatoires');
        return;
      }
      setIsSubmitting(true);
      // Trouver l'espace et la table sélectionnées
      const selectedSpace = availableSpaces.find(s => s.id === reservationData.spaceId);
const selectedTable = availableTables.find(t => t.id === reservationData.tableId);

let totalPrice = 0;

// Adult price
if (selectedTable?.pricePerPerson) {
  totalPrice += selectedTable.pricePerPerson * reservationData.guestsAdult;
}

// Child price (if defined)
if (selectedTable?.pricePerPersonEnfant) {
  totalPrice += selectedTable.pricePerPersonEnfant * reservationData.guestsEnfant;
}

// Baby price (if defined)
if (selectedTable?.pricePerPersonBebe) {
  totalPrice += selectedTable.pricePerPersonBebe * reservationData.guestsBebe;
}

      // Préparer les données de réservation Ramadan
const ramadanReservationRequest = {
  customerName: reservationData.name,
  customerPhone: reservationData.phone,
  customerEmail: reservationData.email,
  reservationDate: reservationData.date,
  reservationTime: "00:00:00",
  numberOfGuests: reservationData.guestsAdult, // Main guest count
  numberOfGuestsEnfant: reservationData.guestsEnfant, // Child count
  numberOfGuestsBebe: reservationData.guestsBebe, // Baby count
  reservationType: reservationData.reservationType,
  specialRequests: reservationData.specialRequests || "",
  totalPrice: totalPrice,
  status: "PENDING",
  restaurant: {
    id: parseInt(id)
  },
  table: {
    id: reservationData.tableId
  },
  business: {
    id: restaurant?.business?.id || 3
  }
};


      // Envoyer la réservation Ramadan
      const response = await axios.post(
        'https://waw.com.tn/api/api/ramadan-reservations',
        ramadanReservationRequest,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 201 || response.status === 200) {
        alert('Réservation Ramadan effectuée avec succès !');
        setReservationModalOpen(false);
setReservationData({
  date: dayjs().format('YYYY-MM-DD'),
  guestsAdult: 2, // FIXED
  guestsEnfant: 0, // ADDED
  guestsBebe: 0,   // ADDED
  name: '',
  email: '',
  phone: '',
  specialRequests: '',
  spaceId: null,
  tableId: null,
  reservationType: 'IFTAR'
});
      }
    } catch (err) {
      console.error('Erreur lors de la réservation Ramadan:', err);
      if (err.response) {
        console.error('Détails de l\'erreur:', err.response.data);
        alert(`Erreur: ${err.response.data.message || err.response.statusText}`);
      } else {
        alert('Erreur lors de la réservation. Veuillez réessayer.');
      }
    }
  };

  // Formater les horaires d'ouverture
  const formatOpeningHours = () => {
    if (!restaurant?.openingHours || restaurant.openingHours.length === 0) {
      return <p>Horaires non disponibles</p>;
    }

    const days = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI', 'DIMANCHE'];
    return days.map(day => {
      const hours = restaurant.openingHours.find(h => h.dayOfWeek === day);
      return (
        <DayRow key={day}>
          <span className="day">
            {day.toLowerCase().replace(/^\w/, c => c.toUpperCase())}
          </span>
          <span className={`hours ${hours?.isClosed ? 'closed' : ''}`}>
            {hours?.isClosed ? 'Fermé' : 
             `${hours?.openingTime || '--:--'} - ${hours?.closingTime || '--:--'}`}
          </span>
        </DayRow>
      );
    });
  };

  // Formater les types de clientèle
  const formatClientTypes = () => {
    if (!restaurant?.clientTypes || restaurant.clientTypes.length === 0) {
      return null;
    }

    const clientTypeLabels = {
      'EN_FAMILLE': '👨‍👩‍👧‍👦 En famille',
      'ENTRE_AMIS': '👥 Entre amis',
      'ROMANTIQUE': '💕 Romantique',
      'FESTIF': '🎉 Festif',
      'COSY': '🛋️ Cosy',
      'IMMERSIF': '🎭 Immersif',
      'ANNIVERSAIRE': '🎂 Anniversaire',
      'MARIAGES': '💒 Mariages',
      'EVENEMENTS_ENTREPRISE': '🏢 Événements d\'entreprise',
      'REPAS_AFFAIRES': '💼 Repas d\'affaires',
      'SPECIAL_GROUPE': '👨‍👩‍👧‍👦 Spécial groupe'
    };

    return (
      <ClientTypesGrid>
        {restaurant.clientTypes.map((type, index) => (
          <Chip
            key={index}
            label={clientTypeLabels[type] || type}
            color="primary"
            variant="outlined"
            sx={{ 
              backgroundColor: 'black10',
              borderColor: 'black',
              color: 'black',
              fontWeight: 500
            }}
          />
        ))}
      </ClientTypesGrid>
    );
  };

  // Obtenir le label de la gamme de prix
  const getPriceRangeLabel = () => {
    if (!restaurant?.priceRange) return 'Non spécifié';
    
    switch(restaurant.priceRange) {
      case 'BUDGET': return 'Budget';
      case 'MODERATE': return 'Modéré';
      case 'EXPENSIVE': return 'Cher';
      case 'LUXURY': return 'Luxe';
      default: return restaurant.priceRange;
    }
  };

  // Vérifier si le restaurant est ouvert maintenant
  const isOpenNow = () => {
    if (!restaurant?.openingHours || restaurant.openingHours.length === 0) {
      return false;
    }

    const now = new Date();
    const today = now.toLocaleDateString('fr-FR', { weekday: 'long' }).toUpperCase();
    const currentTime = now.toTimeString().slice(0, 5);
    
    const todayHours = restaurant.openingHours.find(h => 
      h.dayOfWeek === today.replace('É', 'E')
    );

    if (!todayHours || todayHours.isClosed) return false;

    return currentTime >= todayHours.openingTime && currentTime <= todayHours.closingTime;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Typography variant="h6" color="text.secondary">
          Chargement du restaurant...
        </Typography>
      </Box>
    );
  }

  if (error || !restaurant) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="error">
          {error || 'Restaurant non trouvé'}
        </Typography>
        <Button 
          variant="contained" 
          sx={{ mt: 2 }}
          onClick={() => navigate('/restaurants')}
        >
          Retour à la liste
        </Button>
      </Box>
    );
  }

  return (
    <>
      <PageMeta title="waw" description="waw" />
      <TopBar />
      <Navbar />

      {/* Slider d'images plein écran */}
      {openSlider && (
        <Slider>
          <Slides>
            <NavigationButton className="prev" onClick={handlePrev}>
              <ArrowBackIos />
            </NavigationButton>
            <NavigationButton className="next" onClick={handleNext}>
              <ArrowForwardIos />
            </NavigationButton>
            <NavigationButton className="close" onClick={handleCloseSlider}>
              <Close />
            </NavigationButton>
            <img 
              src={`https://waw.com.tn${allImages[slideNumber]}`} 
              alt={`Slide ${slideNumber + 1}`} 
            />
          </Slides>
        </Slider>
      )}

      <Container>
        {/* Colonne de gauche */}
        <LeftColumn>
          {/* En-tête */}
          <HeaderSection>
            <RestaurantTitle>{restaurant.name}</RestaurantTitle>
            <Subtitle>
              <Chip 
                label={getPriceRangeLabel()}
                variant="outlined"
                color="primary"
              />
            </Subtitle>
          </HeaderSection>

          {/* Galerie d'images */}
          <ImageGallery>
            <MainImage onClick={() => handleOpenSlider(0)}>
              <img 
                src={`https://waw.com.tn${mainImage}`} 
                alt={restaurant.name} 
              />
            </MainImage>
            
            {allImages.length > 1 && (
              <ThumbnailGrid>
                {allImages.slice(0, 3).map((img, index) => (
                  <Thumbnail key={index} onClick={() => handleOpenSlider(index)}>
                    <img 
                      src={`https://waw.com.tn${img}`} 
                      alt={`Thumbnail ${index + 1}`} 
                    />
                  </Thumbnail>
                ))}
                {allImages.length > 4 && (
                  <Thumbnail className="more" onClick={() => handleOpenSlider(3)}>
                    +{allImages.length - 3}
                  </Thumbnail>
                )}
              </ThumbnailGrid>
            )}
          </ImageGallery>

          {/* Description */}
          <DescriptionBlock>
            <TitleSection>À propos</TitleSection>
            <p>{restaurant.description || "Aucune description disponible."}</p>
          </DescriptionBlock>

          {/* Types de clientèle */}
          {restaurant.clientTypes && restaurant.clientTypes.length > 0 && (
            <div>
              <TitleSection>Ambiances et occasions</TitleSection>
              {formatClientTypes()}
            </div>
          )}

          {/* Équipements et services */}
          <div>
            <TitleSection>Équipements et services</TitleSection>
            <FeatureGrid>
              {restaurant.hasParking && (
                <div>
                  <LocalParking className="feature-icon" />
                  <span>Parking disponible</span>
                </div>
              )}
              {restaurant.hasPrivateRooms && (
                <div>
                  <VerifiedOutlined className="feature-icon" />
                  <span>Salles privées</span>
                </div>
              )}
              {restaurant.cuisineType && (
                <div>
                  <RestaurantIcon className="feature-icon" />
                  <span>Cuisine {restaurant.cuisineType}</span>
                </div>
              )}
            </FeatureGrid>
          </div>

          {/* Horaires d'ouverture */}
          <div>
            <TitleSection>Horaires d'ouverture</TitleSection>
            <OpeningHoursTable>
              {formatOpeningHours()}
            </OpeningHoursTable>
          </div>

          {/* Localisation */}
          <div>
            <TitleSection>Localisation</TitleSection>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <LocationOnIcon sx={{ color: 'black' }} />
              <Typography>
                {restaurant.address}, {restaurant.city}
              </Typography>
            </Box>
            
            {restaurant.latitude && restaurant.longitude && (
              <MapContainerStyled>
                <MapContainer
                  center={[restaurant.latitude, restaurant.longitude]}
                  zoom={15}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    attribution='&copy; OpenStreetMap'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[restaurant.latitude, restaurant.longitude]}>
                    <Popup>
                      <strong>{restaurant.name}</strong><br />
                      {restaurant.address}<br />
                      {restaurant.city}
                    </Popup>
                  </Marker>
                </MapContainer>
              </MapContainerStyled>
            )}
          </div>

          {/* Contact et réseaux sociaux */}
          <SocialButtons>
            <SocialButton 
              href={`tel:${restaurant.phone}`}
              title="Appeler"
            >
              <Phone />
            </SocialButton>
            <SocialButton 
              href={restaurant.facebookUrl || '#'}
              className="facebook"
              target="_blank"
              rel="noopener noreferrer"
              title="Facebook"
            >
              <Facebook />
            </SocialButton>
            <SocialButton 
              href={restaurant.instagramUrl || '#'}
              className="instagram"
              target="_blank"
              rel="noopener noreferrer"
              title="Instagram"
            >
              <Instagram />
            </SocialButton>
            <IconButton 
              onClick={handleFavoriteClick}
              sx={{ 
                color: isFavorite ? '#d62828' : '#666',
                '&:hover': { color: '#d62828' }
              }}
            >
              {isFavorite ? <Favorite /> : <FavoriteBorder />}
            </IconButton>
            <IconButton>
              <Share />
            </IconButton>
          </SocialButtons>
        </LeftColumn>

        {/* Colonne de droite (sticky) */}
        <RightStickyColumn ref={rightColumnRef}>
          <Typography variant="h6" sx={{ mb: 3, color: 'black', fontWeight: 600 }}>
            Réservez votre table
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Date */}

<LocalizationProvider dateAdapter={AdapterDayjs}>
  <DatePicker
    label="Date de réservation"
    value={dayjs(reservationData.date)}
    onChange={(newDate) => {
      if (newDate) {
        const formattedDate = newDate.format('YYYY-MM-DD');
        setReservationData({...reservationData, date: formattedDate, spaceId: null, tableId: null});
        fetchAvailableSpaces(formattedDate);
      }
    }}
    minDate={dayjs()}
    maxDate={dayjs().add(30, 'days')}
    slotProps={{
      textField: {
        fullWidth: true,
        error: false
      }
    }}
    disablePast
    format="DD/MM/YYYY"
    sx={{ width: '100%' }}
  />
</LocalizationProvider>

            {/* Nombre de personnes */}
<Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'black' }}>
    Nombre de personnes par catégorie
  </Typography>
  
  <Grid container spacing={2}>
    <Grid item xs={4}>
      <TextField
        type="number"
        label="Adultes (≥ 12 ans)"
        value={reservationData.guestsAdult}
        onChange={(e) => {
          const guestsAdult = parseInt(e.target.value) || 0;
          setReservationData({
            ...reservationData, 
            guestsAdult,
            tableId: null
          });
          filterSpacesByCapacity(totalGuests);
        }}
        inputProps={{ min: 0, max: 50 }}
        fullWidth
      />
    </Grid>
    
    <Grid item xs={4}>
      <TextField
        type="number"
        label="Enfants (3-11 ans)"
        value={reservationData.guestsEnfant}
        onChange={(e) => {
          const guestsEnfant = parseInt(e.target.value) || 0;
          setReservationData({
            ...reservationData, 
            guestsEnfant,
            tableId: null
          });
          filterSpacesByCapacity(totalGuests);
        }}
        inputProps={{ min: 0, max: 50 }}
        fullWidth
      />
    </Grid>
    
    <Grid item xs={4}>
      <TextField
        type="number"
        label="Bébés (0-2 ans)"
        value={reservationData.guestsBebe}
        onChange={(e) => {
          const guestsBebe = parseInt(e.target.value) || 0;
          setReservationData({
            ...reservationData, 
            guestsBebe,
            tableId: null
          });
          filterSpacesByCapacity(totalGuests);
        }}
        inputProps={{ min: 0, max: 50 }}
        fullWidth
      />
    </Grid>
  </Grid>
  
  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
    Total: <strong>{totalGuests}</strong> personnes
  </Typography>
</Box>
{/* Aperçu de la réservation */}
{reservationData.tableId && (() => {
  // Calculate these values here for the preview
  const selectedTable = availableTables.find(t => t.id === reservationData.tableId);
  const selectedSpace = availableSpaces.find(s => s.id === reservationData.spaceId);
  
  // Calculate total price for preview
  let previewTotalPrice = 0;
  if (selectedTable?.pricePerPerson) {
    previewTotalPrice += selectedTable.pricePerPerson * reservationData.guestsAdult;
  }
  if (selectedTable?.pricePerPersonEnfant) {
    previewTotalPrice += selectedTable.pricePerPersonEnfant * reservationData.guestsEnfant;
  }
  if (selectedTable?.pricePerPersonBebe) {
    previewTotalPrice += selectedTable.pricePerPersonBebe * reservationData.guestsBebe;
  }
  
  return (
    <Box sx={{ 
      mt: 3, 
      p: 2, 
      bgcolor: '#f5f5f5', 
      borderRadius: 2,
      border: '1px solid #e0e0e0'
    }}>
      <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'black' }}>
        📋 Aperçu de votre réservation
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography variant="caption" color="text.secondary">
              Date
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {dayjs(reservationData.date).format('DD MMMM YYYY')}
            </Typography>
          </Box>
        </Grid>
        
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography variant="caption" color="text.secondary">
              Personnes
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {reservationData.guestsAdult > 0 && `${reservationData.guestsAdult} adulte(s)`}
              {reservationData.guestsEnfant > 0 && `, ${reservationData.guestsEnfant} enfant(s)`}
              {reservationData.guestsBebe > 0 && `, ${reservationData.guestsBebe} bébé(s)`}
              {` (Total: ${totalGuests})`}
            </Typography>
          </Box>
        </Grid>
        
        {selectedSpace && (
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Typography variant="caption" color="text.secondary">
                Espace
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {selectedSpace.name}
              </Typography>
            </Box>
          </Grid>
        )}
        
        {selectedTable && (
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Typography variant="caption" color="text.secondary">
                Table
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Table {selectedTable.tableNumber}
                {' - '}
                {selectedTable.tableType}
              </Typography>
            </Box>
          </Grid>
        )}
        
        {/* Calcul du prix */}
        {selectedTable && (
          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Détail du prix
              </Typography>
              
              {selectedTable.pricePerPerson && reservationData.guestsAdult > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">
                    Adultes ({reservationData.guestsAdult})
                  </Typography>
                  <Typography variant="body2">
                    {selectedTable.pricePerPerson * reservationData.guestsAdult} DT
                  </Typography>
                </Box>
              )}
              
              {selectedTable.pricePerPersonEnfant && reservationData.guestsEnfant > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">
                    Enfants ({reservationData.guestsEnfant})
                  </Typography>
                  <Typography variant="body2">
                    {selectedTable.pricePerPersonEnfant * reservationData.guestsEnfant} DT
                  </Typography>
                </Box>
              )}
              
              {selectedTable.pricePerPersonBebe && reservationData.guestsBebe > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">
                    Bébés ({reservationData.guestsBebe})
                  </Typography>
                  <Typography variant="body2">
                    {selectedTable.pricePerPersonBebe * reservationData.guestsBebe} DT
                  </Typography>
                </Box>
              )}
              
              <Divider />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Total estimé
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'black' }}>
                  {previewTotalPrice} DT
                </Typography>
              </Box>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
})()}

            <ReserveButton 
              onClick={() => setReservationModalOpen(true)}
              disabled={
                !reservationData.date || 
                !reservationData.spaceId || 
                !reservationData.tableId ||
                totalGuests === 0
              }
              sx={{
                mt: 2,
                opacity: (
                  !reservationData.date || 
                  !reservationData.spaceId || 
                  !reservationData.tableId ||
                  totalGuests === 0
                ) ? 0.5 : 1
              }}
            >
              {reservationData.tableId ? 'Confirmer la réservation' : 'Vérifier la disponibilité'}
            </ReserveButton>
            {/* Sélection de l'espace - Version Carte */}
            {reservationData.date && availableSpaces.length > 0 && (
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'black' }}>
                  Sélectionnez un espace
                </Typography>
                <Box sx={{ 
                  maxHeight: 300, 
                  overflowY: 'auto', 
                  pr: 1,
                  '&::-webkit-scrollbar': {
                    width: '6px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'black',
                    borderRadius: '3px',
                  }
                }}>
                  {availableSpaces.map((space) => (
                    <Card
                      key={space.id}
                      sx={{
                        mb: 2,
                        cursor: 'pointer',
                        border: reservationData.spaceId === space.id ? '2px solid black' : '1px solid #e0e0e0',
                        backgroundColor: reservationData.spaceId === space.id ? 'black10' : 'white',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                          borderColor: 'black'
                        }
                      }}
onClick={() => {
  if (space.minCapacity && totalGuests < space.minCapacity) { // FIXED
    alert(`Cet espace nécessite un minimum de ${space.minCapacity} personnes`);
    return;
  }
  if (space.maxCapacity && totalGuests > space.maxCapacity) { // FIXED
    alert(`Cet espace ne peut accueillir que ${space.maxCapacity} personnes maximum`);
    return;
  }
  setReservationData({...reservationData, spaceId: space.id, tableId: null});
  fetchAvailableTables(space.id);
}}
                    >
                      <CardContent sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'black' }}>
                              {space.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                              {space.description || 'Aucune description'}
                            </Typography>
                          </Box>
                          
                          {reservationData.spaceId === space.id && (
                            <Box sx={{ 
                              width: 24, 
                              height: 24, 
                              borderRadius: '50%', 
                              bgcolor: 'black',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              <CheckIcon sx={{ color: 'white', fontSize: 16 }} />
                            </Box>
                          )}
                        </Box>

                        {/* Caractéristiques de l'espace */}
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                          {space.isOutdoor && (
                            <Chip 
                              label="Extérieur" 
                              size="small" 
                              variant="outlined"
                              color="primary"
                              icon={<OutdoorIcon />}
                            />
                          )}
                          {space.hasAc && (
                            <Chip 
                              label="Climatisé" 
                              size="small" 
                              variant="outlined"
                              color="primary"
                              icon={<AcUnitIcon />}
                            />
                          )}
                          {space.hasHeating && (
                            <Chip 
                              label="Chauffage" 
                              size="small" 
                              variant="outlined"
                              color="primary"
                              icon={<HeatIcon />}
                            />
                          )}
                          {space.isSmokingAllowed && (
                            <Chip 
                              label="Fumeurs autorisés" 
                              size="small" 
                              variant="outlined"
                              color="primary"
                              icon={<SmokingIcon />}
                            />
                          )}
                        </Box>

                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </Box>
            )}

            {/* Sélection de la table - Version Carte */}
            {reservationData.spaceId && availableTables.length > 0 && (
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'black' }}>
                  Sélectionnez une table
                </Typography>
                <Box sx={{ 
                  maxHeight: 300, 
                  overflowY: 'auto', 
                  pr: 1,
                  '&::-webkit-scrollbar': {
                    width: '6px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'black',
                    borderRadius: '3px',
                  }
                }}>
                  {availableTables.map((table) => {
const isTableTooSmall = table.maxCapacity < totalGuests;
const isTableTooBig = table.minCapacity > totalGuests;
const isReserved = table.isReserved;
const isDisabled = isTableTooSmall || isTableTooBig || isReserved;
                    
                    return (
                      <Card
                        key={table.id}
                        sx={{
                          mb: 2,
                          cursor: isDisabled ? 'not-allowed' : 'pointer',
                          border: reservationData.tableId === table.id ? '2px solid black' : 
                                isReserved ? '2px solid #f44336' : '1px solid #e0e0e0',
                          backgroundColor: reservationData.tableId === table.id ? 'black10' : 
                                        isReserved ? '#ffebee' : 
                                        isDisabled ? '#f5f5f5' : 'white',
                          opacity: isDisabled ? 0.7 : 1,
                          transition: 'all 0.3s ease',
                          '&:hover': !isDisabled && {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            borderColor: 'black'
                          }
                        }}
                        onClick={() => {
                          if (isDisabled) return;
                          setReservationData({...reservationData, tableId: table.id});
                        }}
                      >
                        <CardContent sx={{ p: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Box>
                              <Typography variant="subtitle1" sx={{ 
                                fontWeight: 600, 
                                color: isReserved ? '#f44336' : 'black'
                              }}>
                                Table {table.tableNumber}
                                {isReserved && (
                                  <Chip 
                                    label="RÉSERVÉE" 
                                    size="small" 
                                    color="error"
                                    sx={{ ml: 1, fontSize: '0.7rem', height: 20 }}
                                  />
                                )}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                Type: {table.tableType}
                              </Typography>
                            </Box>
                            
                            {reservationData.tableId === table.id && (
                              <Box sx={{ 
                                width: 24, 
                                height: 24, 
                                borderRadius: '50%', 
                                bgcolor: 'black',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}>
                                <CheckIcon sx={{ color: 'white', fontSize: 16 }} />
                              </Box>
                            )}
                            
                            {isDisabled && !isReserved && (
                              <BlockIcon sx={{ color: '#f44336', fontSize: 20 }} />
                            )}
                            
                            {isReserved && (
                              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                <Typography variant="caption" color="error" sx={{ fontWeight: 600 }}>
                                  Non disponible
                                </Typography>
                              </Box>
                            )}
                          </Box>

                          {/* Capacité et prix */}
                          <Box sx={{ mt: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
{/* In the table card, update the price display: */}
<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
  <PeopleIcon sx={{ 
    color: isReserved ? '#f44336' : '#666', 
    fontSize: 18 
  }} />
  <Typography variant="body2" sx={{ 
    color: isReserved ? '#f44336' : 'inherit'
  }}>
    {table.minCapacity || 1}-{table.maxCapacity} personnes
  </Typography>
</Box>

{table.pricePerPerson && (
  <Typography variant="subtitle2" sx={{ 
    color: isReserved ? '#f44336' : 'black', 
    fontWeight: 600,
    textDecoration: isReserved ? 'line-through' : 'none'
  }}>
    {table.pricePerPerson} DT/pers.
  </Typography>
)}

{/* Add this for child and baby prices if available: */}
{(table.pricePerPersonEnfant || table.pricePerPersonBebe) && (
  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
    {table.pricePerPersonEnfant && `Enfant: ${table.pricePerPersonEnfant} DT`}
    {table.pricePerPersonEnfant && table.pricePerPersonBebe && ' • '}
    {table.pricePerPersonBebe && `Bébé: ${table.pricePerPersonBebe} DT`}
  </Typography>
)}
                              

                            </Box>

                            {/* Messages d'erreur capacité */}
{isTableTooSmall && !isReserved && (
  <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>
    ❌ Trop petite pour {totalGuests} personnes // FIXED
  </Typography>
)}
{isTableTooBig && !isReserved && (
  <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>
    ❌ Minimum {table.minCapacity} personnes requis
  </Typography>
)}
                            
                            {/* Message de réservation */}
                            {isReserved && (
                              <Box sx={{ 
                                mt: 1, 
                                p: 1, 
                                bgcolor: '#ffebee', 
                                borderRadius: 1,
                                border: '1px solid #ffcdd2'
                              }}>
                                <Typography variant="caption" color="error" sx={{ display: 'block' }}>
                                  ⚠️ Cette table est déjà réservée pour cette date
                                </Typography>

                              </Box>
                            )}
                          </Box>
                        </CardContent>
                      </Card>
                    );
                  })}
                </Box>
              </Box>
            )}

            {/* Messages d'information */}
            {reservationData.date && availableSpaces.length === 0 && (
              <Alert severity="info">
                Aucun espace disponible pour cette date
              </Alert>
            )}

            {reservationData.spaceId && availableTables.length === 0 && (
              <Alert severity="info">
                Aucune table disponible pour cet espace
              </Alert>
            )}

            {/* Bouton de réservation */}
            <ReserveButton 
              onClick={() => setReservationModalOpen(true)}
              disabled={
                !reservationData.date || 
                !reservationData.spaceId || 
                !reservationData.tableId ||
                totalGuests === 0
              }
              sx={{
                mt: 2,
                opacity: (
                  !reservationData.date || 
                  !reservationData.spaceId || 
                  !reservationData.tableId ||
                  totalGuests === 0
                ) ? 0.5 : 1
              }}
            >
              {reservationData.tableId ? 'Confirmer la réservation' : 'Vérifier la disponibilité'}
            </ReserveButton>
          </Box>

          {/* Aperçu de la réservation */}


          <Divider sx={{ my: 3 }} />

          {/* Informations rapides */}
          <Box>
            <InfoRow>
              <span>Type de cuisine:</span>
              <span>{restaurant.cuisineType || 'Non spécifié'}</span>
            </InfoRow>
            
            <InfoRow>
              <span>Gamme de prix:</span>
              <span>{getPriceRangeLabel()}</span>
            </InfoRow>

            <InfoRow>
              <span>Téléphone:</span>
              <span>{restaurant.phone}</span>
            </InfoRow>

            <InfoRow>
              <span>Email:</span>
              <span>{restaurant.email || 'Non disponible'}</span>
            </InfoRow>

            {restaurant.contactPerson && (
              <InfoRow>
                <span>Contact:</span>
                <span>{restaurant.contactPerson}</span>
              </InfoRow>
            )}
          </Box>
        </RightStickyColumn>
      </Container>

      {/* Barre fixe du bas */}
      <BottomStickyBar>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <PriceDisplay>
            <span className="from">À partir de </span>
          </PriceDisplay>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant="outlined" 
            onClick={() => setContactModalOpen(true)}
            startIcon={<Phone />}
          >
            Contact
          </Button>
          <Button 
            variant="contained" 
            sx={{ backgroundColor: 'black' }}
            onClick={() => rightColumnRef.current?.scrollIntoView({ behavior: 'smooth' })}
          >
            Réserver maintenant
          </Button>
        </Box>
      </BottomStickyBar>

      {/* Modale de réservation */}
      <Dialog 
        open={reservationModalOpen} 
        onClose={() => setReservationModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: 'black', fontWeight: 700 }}>
          Réserver une table
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <Alert severity="info" sx={{ mb: 2 }}>
              Réservation pour le {dayjs(reservationData.date).format('DD MMMM YYYY')}
            </Alert>
            
            <TextField
              label="Nom complet *"
              value={reservationData.name}
              onChange={(e) => setReservationData({...reservationData, name: e.target.value})}
              fullWidth
            />
            
            <TextField
              label="Email *"
              type="email"
              value={reservationData.email}
              onChange={(e) => setReservationData({...reservationData, email: e.target.value})}
              fullWidth
            />
            
            <TextField
              label="Téléphone *"
              value={reservationData.phone}
              onChange={(e) => setReservationData({...reservationData, phone: e.target.value})}
              fullWidth
            />

            <TextField
              label="Demandes spéciales"
              multiline
              rows={3}
              value={reservationData.specialRequests}
              onChange={(e) => setReservationData({...reservationData, specialRequests: e.target.value})}
              fullWidth
              placeholder="Allergies, anniversaire, etc."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReservationModalOpen(false)}>
            Annuler
          </Button>
<Button 
  variant="contained"
  onClick={handleReservationSubmit}
  disabled={isSubmitting}
  sx={{ backgroundColor: 'black' }}
>
  {isSubmitting ? "Réservation..." : "Confirmer la réservation"}
</Button>
        </DialogActions>
      </Dialog>

      {/* Modale de contact */}
      <Dialog 
        open={contactModalOpen} 
        onClose={() => setContactModalOpen(false)}
      >
        <DialogTitle sx={{ color: 'black', fontWeight: 700 }}>
          Contactez {restaurant.name}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <InfoRow>
              <span>Téléphone:</span>
              <a href={`tel:${restaurant.phone}`} style={{ color: 'black', textDecoration: 'none' }}>
                {restaurant.phone}
              </a>
            </InfoRow>
            
            {restaurant.email && (
              <InfoRow>
                <span>Email:</span>
                <a href={`mailto:${restaurant.email}`} style={{ color: 'black', textDecoration: 'none' }}>
                  {restaurant.email}
                </a>
              </InfoRow>
            )}
            
            {restaurant.contactPerson && (
              <InfoRow>
                <span>Personne de contact:</span>
                <span>{restaurant.contactPerson}</span>
              </InfoRow>
            )}
            
            {restaurant.contactPersonPhone && (
              <InfoRow>
                <span>Téléphone contact:</span>
                <a href={`tel:${restaurant.contactPersonPhone}`} style={{ color: 'black', textDecoration: 'none' }}>
                  {restaurant.contactPersonPhone}
                </a>
              </InfoRow>
            )}
            
            <Divider sx={{ my: 2 }} />
            
            <SocialButtons>
              {restaurant.facebookUrl && (
                <SocialButton 
                  href={restaurant.facebookUrl}
                  className="facebook"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Facebook"
                >
                  <Facebook />
                </SocialButton>
              )}
              
              {restaurant.instagramUrl && (
                <SocialButton 
                  href={restaurant.instagramUrl}
                  className="instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Instagram"
                >
                  <Instagram />
                </SocialButton>
              )}
            </SocialButtons>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setContactModalOpen(false)}>
            Fermer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RestaurantDetailsPage;