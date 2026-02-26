import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import React, { useState, useEffect } from 'react';
import { Modal } from "../../ui/modal";
import axios from "axios";
import Badge from "../../ui/badge/Badge";
import dayjs from "dayjs";
import "dayjs/locale/fr";
dayjs.locale("fr");
import Button from "../../ui/button/Button";
import { Link } from "react-router-dom";
import {
  Typography,
  IconButton,
  Box,
  Chip,
  Divider,
  Grid,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Autocomplete,
  TextField
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

function BackOfficeAdminRestaurants({ isOpen, onClose, restaurant }) {
  if (!isOpen || !restaurant) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[800px] p-6">
      <div className="no-scrollbar relative w-full max-w-5xl overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-6">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{restaurant.name}</h2>
        </div>

        {/* Images */}
        {restaurant.galleryImages?.length > 0 && (
          <div className="mb-4 flex gap-2 overflow-x-auto">
            {restaurant.galleryImages.map((url, idx) => (
              <img
                key={idx}
                src={`https://waw.com.tn${url}`}
                alt={`${restaurant.name} image ${idx + 1}`}
                className="w-32 h-20 object-cover rounded"
              />
            ))}
          </div>
        )}

        {/* Description */}
        {restaurant.description && (
          <p className="mb-4 text-gray-700 dark:text-gray-300">{restaurant.description}</p>
        )}

        {/* Infos générales */}
        <div className="mb-4 grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div><strong>Adresse:</strong> {restaurant.address || "N/A"}</div>
          <div><strong>Ville:</strong> {restaurant.city || "N/A"}</div>
          <div><strong>Téléphone:</strong> {restaurant.phone || "N/A"}</div>
          <div><strong>Email:</strong> {restaurant.email || "N/A"}</div>
          <div><strong>Type de cuisine:</strong> {restaurant.cuisineType || "N/A"}</div>
          <div><strong>Gamme de prix:</strong> {restaurant.priceRange || "N/A"}</div>
          <div><strong>Parking:</strong> {restaurant.hasParking ? "Oui" : "Non"}</div>
          <div><strong>WiFi:</strong> {restaurant.hasWifi ? "Oui" : "Non"}</div>
          <div><strong>Salles privées:</strong> {restaurant.hasPrivateRooms ? "Oui" : "Non"}</div>
          <div><strong>Famille friendly:</strong> {restaurant.isFamilyFriendly ? "Oui" : "Non"}</div>
          <div><strong>24h/24:</strong> {restaurant.is24Hours ? "Oui" : "Non"}</div>
          <div><strong>Horaires:</strong> {restaurant.openingTime} - {restaurant.closingTime}</div>
          {restaurant.latitude && restaurant.longitude && (
            <>
              <div><strong>Latitude:</strong> {restaurant.latitude}</div>
              <div><strong>Longitude:</strong> {restaurant.longitude}</div>
            </>
          )}
        </div>

        {/* Contact */}
        <div className="mb-4">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Contact</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><strong>Personne de contact:</strong> {restaurant.contactPerson || "N/A"}</div>
            <div><strong>Téléphone contact:</strong> {restaurant.contactPersonPhone || "N/A"}</div>
          </div>
        </div>

        {/* Réseaux sociaux */}
        <div className="mb-4">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Réseaux sociaux</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><strong>Facebook:</strong> {restaurant.facebookUrl || "N/A"}</div>
            <div><strong>Instagram:</strong> {restaurant.instagramUrl || "N/A"}</div>
          </div>
        </div>

        {/* Localisation sur la carte */}
        {restaurant.latitude && restaurant.longitude && (
          <div className="mt-6">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Localisation</h3>
            <div className="h-64 rounded-lg overflow-hidden">
              <MapContainer
                center={[restaurant.latitude, restaurant.longitude]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={[restaurant.latitude, restaurant.longitude]} icon={markerIcon}>
                  <Popup>
                    {restaurant.name}<br />
                    {restaurant.address}
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

export default function BackOfficeVendeurRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const businessId = localStorage.getItem("businessId");

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  useEffect(() => {
    async function fetchRestaurants() {
      try {
        const res = await fetch(`https://waw.com.tn/api/restaurants`);
        if (!res.ok) throw new Error("Erreur de récupération des restaurants");
        const data = await res.json();
        setRestaurants(data);
      } catch (e) {
        setError(e.message || "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    }
    fetchRestaurants();
  }, [businessId]);

  const handleVoirDetails = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setShowDetailModal(true);
  };

  const handleToggleActive = async (id) => {
    try {
      const res = await axios.put(`https://waw.com.tn/api/restaurants/status/${id}`);
      const updatedRestaurant = res.data;

      setRestaurants((prevRestaurants) =>
        prevRestaurants.map((restaurant) =>
          restaurant.id === id ? { ...restaurant, isActive: updatedRestaurant.isActive } : restaurant
        )
      );
    } catch (err) {
      console.error('Error updating status', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce restaurant ?")) {
      try {
        await axios.delete(`https://waw.com.tn/api/restaurants/${id}`);
        setRestaurants(restaurants.filter(restaurant => restaurant.id !== id));
      } catch (err) {
        console.error('Error deleting restaurant', err);
        alert('Erreur lors de la suppression');
      }
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="text-gray-600 dark:text-gray-400">Chargement...</div>
    </div>
  );
  
  if (error) return (
    <div className="p-6">
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <div className="text-red-600 dark:text-red-400">Erreur: {error}</div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-200 dark:border-gray-700">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Nom
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Ville
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Cuisine
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Statut
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-gray-700">
              {restaurants.map((restaurant) => (
                <TableRow key={restaurant.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <TableCell className="px-4 py-3 text-gray-700 dark:text-gray-300 text-start text-theme-sm">
                    <div className="font-medium">{restaurant.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{restaurant.phone}</div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-700 dark:text-gray-300 text-start text-theme-sm">
                    {restaurant.city}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-700 dark:text-gray-300 text-start text-theme-sm">
                    <Chip 
                      label={restaurant.cuisineType || "Non spécifié"} 
                      size="small" 
                      className="capitalize"
                    />
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-700 dark:text-gray-300 text-start text-theme-sm">
                    <Badge size="sm" color={restaurant.isActive ? "success" : "error"}>
                      {restaurant.isActive ? "Actif" : "Inactif"}
                    </Badge>

                      {/* Activer/Désactiver */}
                      <IconButton 
                        size="small" 
                        onClick={() => handleToggleActive(restaurant.id)}
                        title={restaurant.isActive ? "Désactiver" : "Activer"}
                        className="text-orange-600 hover:text-orange-800 dark:text-orange-400 dark:hover:text-orange-300"
                      >
                        <PowerSettingsNewIcon fontSize="small" />
                      </IconButton>
                  </TableCell>
                  <TableCell className="px-4 py-3">
<div className="flex items-center gap-2 flex-wrap">
  {/* Voir détails */}
  <button
    onClick={() => handleVoirDetails(restaurant)}
    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-2 py-1 rounded transition-colors"
    title="Voir détails"
  >
    <VisibilityIcon fontSize="small" />
    <span className="text-sm">Voir détails</span>
  </button>
  
  {/* Éditer */}
  <button
    onClick={() => window.location.href = `/admin/restaurant/edit/${restaurant.id}`}
    className="flex items-center gap-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 px-2 py-1 rounded transition-colors"
    title="Éditer"
  >
    <EditIcon fontSize="small" />
    <span className="text-sm">Éditer</span>
  </button>
  
  {/* Gérer les places */}
  <button
    onClick={() => window.location.href = `/admin/restaurant/${restaurant.id}/places`}
    className="flex items-center gap-1 text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 px-2 py-1 rounded transition-colors"
    title="Gérer les places"
  >
    <AccessTimeIcon fontSize="small" />
    <span className="text-sm">Gérer les places</span>
  </button>

  {/* Supprimer */}
  <button
    onClick={() => handleDelete(restaurant.id)}
    className="flex items-center gap-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 px-2 py-1 rounded transition-colors"
    title="Supprimer"
  >
    <DeleteIcon fontSize="small" />
    <span className="text-sm">Supprimer</span>
  </button>
</div>
                  </TableCell>
                </TableRow>
              ))}

              {restaurants.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col items-center justify-center">
                      <svg className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <p className="text-lg font-medium mb-2">Aucun restaurant trouvé</p>
                      <p className="text-sm">Commencez par ajouter votre premier restaurant</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Modal de détails */}
      {selectedRestaurant && (
        <RestaurantDetailModal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          restaurant={selectedRestaurant}
        />
      )}
    </div>
  );
}