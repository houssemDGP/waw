import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Box,
  Typography,
  Grid,
  Avatar,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BathtubIcon from '@mui/icons-material/Bathtub';
import KingBedIcon from '@mui/icons-material/KingBed';
import LandscapeIcon from '@mui/icons-material/Landscape';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

// Your destinations
const destinations = [
  {
    image: 'imgs/33.jpg',
    price: '233 TND',
    days: '8 Days Tour',
    title: 'Circuit 2 Jour Privé Ksar Ghilan et Douz avec Bivouac',
    location: 'Djerba, Tunisie',
    lat: 33.875,
    lng: 10.858,
    rating: 4.5,
    ratingCount: 23,
    amenities: [
      { icon: <BathtubIcon fontSize="small" />, text: '2' },
      { icon: <KingBedIcon fontSize="small" />, text: '3' },
      { icon: <LandscapeIcon fontSize="small" />, text: 'Near Mountain' },
    ],
    authorName: 'John Doe',
    authorImage: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    image: 'imgs/32.jpg',
    price: '85 TND',
    days: '10 Days Tour',
    title: 'Excursion d’une journée complète à Kairouan et El Jem',
    location: 'Tunisie',
    lat: 35.678,
    lng: 10.096,
    rating: 4.5,
    ratingCount: 23,
    amenities: [
      { icon: <BathtubIcon fontSize="small" />, text: '2' },
      { icon: <KingBedIcon fontSize="small" />, text: '3' },
      { icon: <BeachAccessIcon fontSize="small" />, text: 'Near Beach' },
    ],
    authorName: 'Jane Smith',
    authorImage: 'https://randomuser.me/api/portraits/women/45.jpg',
  },
  {
    image: 'imgs/30.jpg',
    price: '350 TND',
    days: '7 Days Tour',
    title: 'Hors du temps villages berbères Tekrouna et Zriba Alia',
    location: 'Sousse',
    lat: 35.8256,
    lng: 10.6084,
    rating: 4.5,
    ratingCount: 23,
    amenities: [
      { icon: <BathtubIcon fontSize="small" />, text: '2' },
      { icon: <KingBedIcon fontSize="small" />, text: '3' },
      { icon: <BeachAccessIcon fontSize="small" />, text: 'Near Beach' },
    ],
    authorName: 'Michael Lee',
    authorImage: 'https://randomuser.me/api/portraits/men/65.jpg',
  },
  {
    image: 'imgs/31.jpg',
    price: '350 TND',
    days: '8 Days Tour',
    title: 'Tour privée: Médina, Carthage, Sidi Bou Saïd, musée Bardo+déjeuner',
    location: 'Bizerte',
    lat: 37.2744,
    lng: 9.8642,
    rating: 4.5,
    ratingCount: 23,
    amenities: [
      { icon: <BathtubIcon fontSize="small" />, text: '2' },
      { icon: <KingBedIcon fontSize="small" />, text: '3' },
      { icon: <BeachAccessIcon fontSize="small" />, text: 'Near Beach' },
    ],
    authorName: 'Anna Lopez',
    authorImage: 'https://randomuser.me/api/portraits/women/21.jpg',
  },
];

const EventMapWithCards = () => {
  const [activeTooltip, setActiveTooltip] = useState(null);

  return (
    <MapContainer
      center={[34.5, 9.5]}
      zoom={6}
      style={{ height: '80vh', width: '100%' }}
      scrollWheelZoom={false}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {destinations.map((dest, index) => (
        <Marker
          key={index}
          position={[dest.lat, dest.lng]}
          eventHandlers={{
            click: () => setActiveTooltip(index === activeTooltip ? null : index),
          }}
        >
          {activeTooltip === index && (
            <Tooltip direction="top" permanent>
              <Grid item xs={12} sx={{ maxWidth: 260 }}>
                <Box sx={{ boxShadow: 3, borderRadius: 2, overflow: 'hidden', bgcolor: 'white' }}>
                  <Box
                    sx={{
                      height: 120,
                      backgroundImage: `url(${dest.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                  <Box sx={{ p: 2 }}>
                    <Typography variant="subtitle2" color="primary">
                      {dest.days}
                    </Typography>
                    <Typography variant="h6">{dest.title}</Typography>
                    <Typography
                      variant="body2"
                      sx={{ display: 'flex', alignItems: 'center', color: '#d62828', fontWeight: 'bold', my: 1 }}
                    >
                      <LocationOnIcon fontSize="small" sx={{ mr: 0.5 }} />
                      {dest.location}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 'bold', color: '#003049', mb: 1 }}
                    >
                      {dest.price}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                      <Avatar src={dest.authorImage} sx={{ width: 30, height: 30, mr: 1 }} />
                      <Typography variant="body2">{dest.authorName}</Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Tooltip>
          )}
        </Marker>
      ))}
    </MapContainer>
  );
};

export default EventMapWithCards;
