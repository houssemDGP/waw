// EventMap.jsx
import React from 'react';
import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, Typography } from '@mui/material';

// Fix des icônes Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

// Génère des événements aléatoires en Tunisie
const generateRandomEvents = (count = 10) => {
  const tunisBounds = {
    latMin: 33.0,
    latMax: 37.5,
    lngMin: 7.5,
    lngMax: 11.5,
  };

  return Array.from({ length: count }).map((_, i) => ({
    id: i,
    name: `Événement ${i + 1}`,
    description: `Ceci est la description de l'événement ${i + 1}`,
    lat: Math.random() * (tunisBounds.latMax - tunisBounds.latMin) + tunisBounds.latMin,
    lng: Math.random() * (tunisBounds.lngMax - tunisBounds.lngMin) + tunisBounds.lngMin,
  }));
};

const events = generateRandomEvents(12);

const EventMap = () => {
  return (
    <MapContainer
      center={[34.5, 9.5]}
      zoom={6}
      style={{ height: '100vh', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {events.map((event) => (
        <Marker key={event.id} position={[event.lat, event.lng]}>
          <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent={false}>
            <Card sx={{ minWidth: 200 }}>
              <CardContent>
                <Typography variant="h6">{event.name}</Typography>
                <Typography variant="body2">{event.description}</Typography>
              </CardContent>
            </Card>
          </Tooltip>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default EventMap;
