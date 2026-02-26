import React, { useState, useEffect } from "react";
import {
  Typography,
  TextField,
  Button,
  Chip,
  CircularProgress,
  RadioGroup,
  FormControlLabel,
  Radio,
  Grid,
  Autocomplete,
  Box,
  IconButton,
  Divider,
  FormControl,
  MenuItem,
  Select,
  InputLabel,
  Checkbox,
  ListItemText,
  FormGroup,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import Input from "./form/input/InputField";
import TextArea from "./form/input/TextArea";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Map click component
const LocationSelector = ({ position, setPosition, setFormData }) => {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      try {
        const res = await axios.get("https://nominatim.openstreetmap.org/reverse", {
          params: { lat, lon: lng, format: "json", addressdetails: 1 },
        });
        const addr = res.data.address || {};
        setFormData(prev => ({
          ...prev,
          address: res.data.display_name || "",
          city: addr.state || addr.state_district || "",
          country: addr.country || "",
        }));
      } catch (err) {
        console.error("Reverse geocoding error:", err);
      }
    },
  });
  return position ? <Marker position={position} icon={markerIcon} /> : null;
};

const cuisineOptions = [
  "Lebanese", "Moroccan", "Turkish", "Arabic", "International", 
  "French", "Italian", "Asian", "Mexican", "Mediterranean", "Tunisian"
];

const priceRangeOptions = ["BUDGET", "MODERATE", "EXPENSIVE", "LUXURY"];

// Types de clientèle
const clientTypeOptions = [
  { value: "EN_FAMILLE", label: "En famille" },
  { value: "ENTRE_AMIS", label: "Entre amis" },
  { value: "ROMANTIQUE", label: "Romantique" },
  { value: "FESTIF", label: "Festif" },
  { value: "COSY", label: "Cosy" },
  { value: "IMMERSIF", label: "Immersif" },
  { value: "ANNIVERSAIRE", label: "Anniversaire" },
  { value: "MARIAGES", label: "Mariages" },
  { value: "EVENEMENTS_ENTREPRISE", label: "Événements d'entreprise" },
  { value: "REPAS_AFFAIRES", label: "Repas d'affaires" },
  { value: "SPECIAL_GROUPE", label: "Spécial groupe" }
];

// Jours de la semaine
const dayOfWeekOptions = [
  { value: "LUNDI", label: "Lundi" },
  { value: "MARDI", label: "Mardi" },
  { value: "MERCREDI", label: "Mercredi" },
  { value: "JEUDI", label: "Jeudi" },
  { value: "VENDREDI", label: "Vendredi" },
  { value: "SAMEDI", label: "Samedi" },
  { value: "DIMANCHE", label: "Dimanche" }
];

export default function RestaurantEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [restaurant, setRestaurant] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    phone: "",
    email: "",
    description: "",
    cuisineType: "",
    priceRange: "MODERATE",
    hasParking: false,
    hasPrivateRooms: false,
    isActive: true,
    logoUrl: "",
    coverImageUrl: "",
    latitude: 0,
    longitude: 0,
    contactPerson: "",
    contactPersonPhone: "",
    facebookUrl: "",
    instagramUrl: "",
    clientTypes: [], // Types de clientèle
    openingHours: [] // Horaires par jour
  });

  const [position, setPosition] = useState([0, 0]);
  const [existingImages, setExistingImages] = useState([]);
  const [newImagesFiles, setNewImagesFiles] = useState([]);
  const [logoFile, setLogoFile] = useState(null);
  const [coverImageFile, setCoverImageFile] = useState(null);
  
  // Gestion des horaires
  const [newOpeningHour, setNewOpeningHour] = useState({
    dayOfWeek: "LUNDI",
    isClosed: false,
    openingTime: "09:00",
    closingTime: "18:00"
  });

  // Fetch restaurant data
  useEffect(() => {
    setLoading(true);
    fetch(`https://waw.com.tn/api/restaurants/${id}`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log("Restaurant data:", data);
        setRestaurant(data);
        
        // Update form data
        setFormData({
          name: data.name || "",
          address: data.address || "",
          city: data.city || "",
          phone: data.phone || "",
          email: data.email || "",
          description: data.description || "",
          cuisineType: data.cuisineType || "",
          priceRange: data.priceRange || "MODERATE",
          hasParking: data.hasParking || false,
          hasPrivateRooms: data.hasPrivateRooms || false,
          isActive: data.isActive ?? true,
          logoUrl: data.logoUrl || "",
          coverImageUrl: data.coverImageUrl || "",
          latitude: data.latitude || 0,
          longitude: data.longitude || 0,
          contactPerson: data.contactPerson || "",
          contactPersonPhone: data.contactPersonPhone || "",
          facebookUrl: data.facebookUrl || "",
          instagramUrl: data.instagramUrl || "",
          clientTypes: data.clientTypes || [], // Types de clientèle
          openingHours: data.openingHours || [] // Horaires par jour
        });

        // Update position
        if (data.latitude && data.longitude) {
          setPosition([data.latitude, data.longitude]);
        }

        // Update images
        setExistingImages(data.galleryImages || []);
      })
      .catch(error => {
        console.error("Error fetching restaurant:", error);
        alert("Erreur lors du chargement du restaurant: " + error.message);
      })
      .finally(() => setLoading(false));
  }, [id]);

  // Handlers
  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Gestion des types de clientèle
  const handleClientTypeChange = (event) => {
    const {
      target: { value },
    } = event;
    setFormData(prev => ({
      ...prev,
      clientTypes: typeof value === 'string' ? value.split(',') : value,
    }));
  };

  // Gestion des horaires
  const handleOpeningHourChange = (field, value) => {
    setNewOpeningHour(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addOpeningHour = () => {
    // Vérifier si l'horaire pour ce jour existe déjà
    const existingHour = formData.openingHours.find(
      hour => hour.dayOfWeek === newOpeningHour.dayOfWeek
    );

    if (existingHour) {
      // Mettre à jour l'horaire existant
      const updatedHours = formData.openingHours.map(hour => 
        hour.dayOfWeek === newOpeningHour.dayOfWeek ? { ...newOpeningHour } : hour
      );
      setFormData(prev => ({ ...prev, openingHours: updatedHours }));
    } else {
      // Ajouter un nouvel horaire
      setFormData(prev => ({
        ...prev,
        openingHours: [...prev.openingHours, { ...newOpeningHour }]
      }));
    }
  };

  const removeOpeningHour = (dayOfWeek) => {
    setFormData(prev => ({
      ...prev,
      openingHours: prev.openingHours.filter(hour => hour.dayOfWeek !== dayOfWeek)
    }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      handleFormChange("logoUrl", ""); // Clear URL si on upload un fichier
    }
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImageFile(file);
      handleFormChange("coverImageUrl", ""); // Clear URL si on upload un fichier
    }
  };

  const handleFilesChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImagesFiles(prev => [...prev, ...files]);
  };

  const handleRemoveImage = (index, type) => {
    if (type === 'existing') {
      setExistingImages(prev => prev.filter((_, i) => i !== index));
    } else {
      setNewImagesFiles(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleUploadImages = async (id, files, type = "gallery") => {
    const formData = new FormData();
    
    if (type === "gallery") {
      for (const file of files) {
        formData.append("images", file);
      }
    } else if (type === "logo" && files) {
      formData.append("logo", files);
    } else if (type === "cover" && files) {
      formData.append("cover", files);
    }

    try {
      const response = await fetch(`https://waw.com.tn/api/restaurants/${id}/upload-images`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const uploadedUrls = await response.json();
        console.log(`Upload ${type} URLs:`, uploadedUrls);
        return uploadedUrls;
      } else {
        console.error(`Erreur lors de l'upload ${type}`);
        return type === "gallery" ? [] : null;
      }
    } catch (error) {
      console.error(`Erreur réseau pendant upload ${type}:`, error);
      return type === "gallery" ? [] : null;
    }
  };

  const handleSave = async () => {
    try {
      setUploading(true);
      
      let finalLogoUrl = formData.logoUrl;
      let finalCoverUrl = formData.coverImageUrl;
      let finalGalleryImages = [...existingImages];
      
      // 1. Uploader le logo si un fichier est sélectionné
      if (logoFile) {
        const uploadedLogoUrl = await handleUploadImages(id, logoFile, "logo");
        if (uploadedLogoUrl && uploadedLogoUrl.logo) {
          finalLogoUrl = uploadedLogoUrl.logo;
        }
      }
      
      // 2. Uploader l'image de couverture si un fichier est sélectionné
      if (coverImageFile) {
        const uploadedCoverUrl = await handleUploadImages(id, coverImageFile, "cover");
        if (uploadedCoverUrl && uploadedCoverUrl.cover) {
          finalCoverUrl = uploadedCoverUrl.cover;
        }
      }
      
      // 3. Uploader les nouvelles images de galerie
      if (newImagesFiles.length > 0) {
        const uploadedImageUrls = await handleUploadImages(id, newImagesFiles, "gallery");
        if (uploadedImageUrls && uploadedImageUrls.gallery) {
          finalGalleryImages = [...existingImages, ...uploadedImageUrls.gallery];
        }
      }

      // 4. Préparer les données de mise à jour
      const updateData = {
        ...formData,
        logoUrl: finalLogoUrl,
        coverImageUrl: finalCoverUrl,
        galleryImages: finalGalleryImages,
        latitude: position[0],
        longitude: position[1],
        openingHours: formData.openingHours.map(hour => ({
          ...hour,
          id: hour.id || null // Laissez null pour les nouvelles entrées
        }))
      };

      console.log("Updating restaurant with data:", updateData);

      // 5. Mettre à jour le restaurant
      const res = await fetch(`https://waw.com.tn/api/restaurants/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData)
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Error response:", errorText);
        throw new Error(`HTTP error! status: ${res.status} - ${errorText}`);
      }
      
      const data = await res.json();
      console.log("Restaurant updated successfully:", data);
      
      alert("Restaurant mis à jour avec succès!");
      navigate("/vendeur/restaurants");
      
    } catch(e) { 
      console.error("Error saving restaurant:", e);
      alert("Erreur lors de l'enregistrement: " + e.message);
    } finally {
      setUploading(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <CircularProgress />
    </div>
  );
  
  if (!restaurant) return (
    <div className="p-6">
      <Typography variant="h6" color="error">Restaurant non trouvé</Typography>
    </div>
  );

  return (
    <>
      <PageBreadcrumb pageTitle="Éditer un restaurant" />
      <PageMeta title="Éditer un restaurant" description="Modifier les informations du restaurant" />

      <div className="space-y-6">
        <div className="rounded-2xl bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6 mt-4 border-l-0">
          <div className="p-6 max-w-6xl mx-auto space-y-6">
            <Typography variant="h4" className="text-black">Éditer le restaurant: {restaurant.name}</Typography>

            {/* Informations de base */}
            <div className="space-y-4">
              <Typography variant="h6" className="text-black">Informations de base</Typography>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                    Nom du restaurant *
                  </label>
                  <Input
                    type="text"
                    placeholder="Nom du restaurant"
                    value={formData.name}
                    onChange={(e) => handleFormChange("name", e.target.value)}
                    className="w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                    Téléphone *
                  </label>
                  <Input
                    type="tel"
                    placeholder="Téléphone"
                    value={formData.phone}
                    onChange={(e) => handleFormChange("phone", e.target.value)}
                    className="w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => handleFormChange("email", e.target.value)}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                    Type de cuisine
                  </label>
                  <Autocomplete
                    freeSolo
                    options={cuisineOptions}
                    value={formData.cuisineType}
                    onChange={(event, newValue) => handleFormChange("cuisineType", newValue)}
                    renderInput={(params) => (
                      <TextField {...params} placeholder="Sélectionnez ou entrez un type de cuisine" />
                    )}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                  Description
                </label>
                <TextArea
                  placeholder="Description du restaurant"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleFormChange("description", e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            {/* Localisation */}
            <div className="space-y-4">
              <Typography variant="h6" className="text-black">Localisation</Typography>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                    Adresse *
                  </label>
                  <Input
                    type="text"
                    placeholder="Adresse"
                    value={formData.address}
                    onChange={(e) => handleFormChange("address", e.target.value)}
                    className="w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                    Ville *
                  </label>
                  <Input
                    type="text"
                    placeholder="Ville"
                    value={formData.city}
                    onChange={(e) => handleFormChange("city", e.target.value)}
                    className="w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                    Pays
                  </label>
                  <Input
                    type="text"
                    placeholder="Pays"
                    value={formData.country || ""}
                    onChange={(e) => handleFormChange("country", e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Carte */}
              <div className="h-64 mt-4 rounded-lg overflow-hidden">
                <MapContainer center={position} zoom={13} className="h-full w-full">
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <LocationSelector 
                    position={position} 
                    setPosition={setPosition} 
                    setFormData={setFormData}
                  />
                </MapContainer>
              </div>
              
              <Typography variant="body2" className="text-black">
                📍 Cliquez sur la carte pour définir la position | 
                Latitude : {position[0].toFixed(5)} | 
                Longitude : {position[1].toFixed(5)}
              </Typography>
            </div>

            {/* Informations du restaurant */}
            <div className="space-y-4">
              <Typography variant="h6" className="text-black">Informations du restaurant</Typography>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                    Gamme de prix
                  </label>
                  <FormControl fullWidth>
                    <Select
                      value={formData.priceRange}
                      onChange={(e) => handleFormChange("priceRange", e.target.value)}
                    >
                      {priceRangeOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option === "BUDGET" && "$ - Budget"}
                          {option === "MODERATE" && "$$ - Modéré"}
                          {option === "EXPENSIVE" && "$$$ - Cher"}
                          {option === "LUXURY" && "$$$$ - Luxe"}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>

                <div className="space-y-2">
                  <Typography variant="body2" className="text-black">Équipements et services</Typography>
                  <div className="space-y-2">
                    <FormControlLabel
                      control={
                        <RadioGroup
                          row
                          value={formData.hasParking}
                          onChange={(e) => handleFormChange("hasParking", e.target.value === "true")}
                        >
                          <FormControlLabel value={true} control={<Radio />} label="Parking" />
                          <FormControlLabel value={false} control={<Radio />} label="Pas de parking" />
                        </RadioGroup>
                      }
                      label=""
                    />
                    
                    <FormControlLabel
                      control={
                        <RadioGroup
                          row
                          value={formData.hasPrivateRooms}
                          onChange={(e) => handleFormChange("hasPrivateRooms", e.target.value === "true")}
                        >
                          <FormControlLabel value={true} control={<Radio />} label="Salles privées" />
                          <FormControlLabel value={false} control={<Radio />} label="Pas de salles privées" />
                        </RadioGroup>
                      }
                      label=""
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Types de clientèle */}
            <div className="space-y-4">
              <Typography variant="h6" className="text-black">Types de clientèle</Typography>
              
              <FormControl fullWidth>
                <InputLabel>Types de clientèle (sélection multiple)</InputLabel>
                <Select
                  multiple
                  value={formData.clientTypes}
                  onChange={handleClientTypeChange}
                  label="Types de clientèle (sélection multiple)"
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip 
                          key={value} 
                          label={clientTypeOptions.find(opt => opt.value === value)?.label || value} 
                        />
                      ))}
                    </Box>
                  )}
                >
                  {clientTypeOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <Checkbox checked={formData.clientTypes.indexOf(option.value) > -1} />
                      <ListItemText primary={option.label} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <Typography variant="caption" color="textSecondary">
                Sélectionnez un ou plusieurs types de clientèle qui correspondent à votre restaurant
              </Typography>
            </div>

            {/* Horaires par jour */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">Horaires d'ouverture par jour</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                        Jour
                      </label>
                      <Select
                        fullWidth
                        value={newOpeningHour.dayOfWeek}
                        onChange={(e) => handleOpeningHourChange("dayOfWeek", e.target.value)}
                      >
                        {dayOfWeekOptions.map((day) => (
                          <MenuItem key={day.value} value={day.value}>
                            {day.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </div>

                    <div className="flex items-center">
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={newOpeningHour.isClosed}
                            onChange={(e) => handleOpeningHourChange("isClosed", e.target.checked)}
                          />
                        }
                        label="Fermé"
                      />
                    </div>

                    {!newOpeningHour.isClosed && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                            Heure d'ouverture
                          </label>
                          <Input
                            type="time"
                            value={newOpeningHour.openingTime}
                            onChange={(e) => handleOpeningHourChange("openingTime", e.target.value)}
                            className="w-full"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                            Heure de fermeture
                          </label>
                          <Input
                            type="time"
                            value={newOpeningHour.closingTime}
                            onChange={(e) => handleOpeningHourChange("closingTime", e.target.value)}
                            className="w-full"
                          />
                        </div>
                      </>
                    )}
                  </div>

                  <Button
                    variant="outlined"
                    onClick={addOpeningHour}
                    fullWidth
                  >
                    Ajouter/Modifier cet horaire
                  </Button>

                  {/* Tableau des horaires */}
                  {formData.openingHours.length > 0 && (
                    <TableContainer component={Paper} className="mt-4">
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Jour</TableCell>
                            <TableCell>Statut</TableCell>
                            <TableCell>Heure d'ouverture</TableCell>
                            <TableCell>Heure de fermeture</TableCell>
                            <TableCell>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {formData.openingHours.map((hour, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                {dayOfWeekOptions.find(d => d.value === hour.dayOfWeek)?.label || hour.dayOfWeek}
                              </TableCell>
                              <TableCell>
                                {hour.isClosed ? (
                                  <Chip label="Fermé" color="error" size="small" />
                                ) : (
                                  <Chip label="Ouvert" color="success" size="small" />
                                )}
                              </TableCell>
                              <TableCell>
                                {!hour.isClosed ? (hour.openingTime || "09:00") : "-"}
                              </TableCell>
                              <TableCell>
                                {!hour.isClosed ? (hour.closingTime || "18:00") : "-"}
                              </TableCell>
                              <TableCell>
                                <IconButton
                                  size="small"
                                  onClick={() => {
                                    setNewOpeningHour({
                                      dayOfWeek: hour.dayOfWeek,
                                      isClosed: hour.isClosed || false,
                                      openingTime: hour.openingTime || "09:00",
                                      closingTime: hour.closingTime || "18:00"
                                    });
                                  }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={() => removeOpeningHour(hour.dayOfWeek)}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </div>
              </AccordionDetails>
            </Accordion>

            {/* Images */}
            <div className="space-y-4">
              <Typography variant="h6" className="text-black">Images</Typography>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Logo */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                      Logo
                    </label>
                    
                    <div className="space-y-2">
                      {/* Aperçu */}
                      {(formData.logoUrl || logoFile) && (
                        <div className="relative w-32 h-32">
                          <img 
                            src={logoFile ? URL.createObjectURL(logoFile) : formData.logoUrl} 
                            alt="Logo" 
                            className="w-full h-full object-contain rounded border"
                          />
                          <IconButton
                            onClick={() => {
                              setLogoFile(null);
                              handleFormChange("logoUrl", "");
                            }}
                            sx={{ position: 'absolute', top: -8, right: -8, bgcolor: 'white', boxShadow: 1 }}
                            size="small"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </div>
                      )}
                      
                      {/* Upload fichier */}
                      <div>
                        <Input
                          accept="image/*"
                          type="file"
                          onChange={handleLogoChange}
                          className="w-full"
                        />
                        <Typography variant="caption" className="text-gray-500">
                          OU entrez une URL
                        </Typography>
                      </div>
                      
                      {/* Champ URL */}
                      <Input
                        type="text"
                        placeholder="URL du logo (optionnel)"
                        value={formData.logoUrl}
                        onChange={(e) => handleFormChange("logoUrl", e.target.value)}
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Image de couverture */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                      Image de couverture
                    </label>
                    
                    <div className="space-y-2">
                      {/* Aperçu */}
                      {(formData.coverImageUrl || coverImageFile) && (
                        <div className="relative w-full h-32">
                          <img 
                            src={coverImageFile ? URL.createObjectURL(coverImageFile) : formData.coverImageUrl} 
                            alt="Couverture" 
                            className="w-full h-full object-cover rounded border"
                          />
                          <IconButton
                            onClick={() => {
                              setCoverImageFile(null);
                              handleFormChange("coverImageUrl", "");
                            }}
                            sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'white', boxShadow: 1 }}
                            size="small"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </div>
                      )}
                      
                      {/* Upload fichier */}
                      <div>
                        <Input
                          accept="image/*"
                          type="file"
                          onChange={handleCoverImageChange}
                          className="w-full"
                        />
                        <Typography variant="caption" className="text-gray-500">
                          OU entrez une URL
                        </Typography>
                      </div>
                      
                      {/* Champ URL */}
                      <Input
                        type="text"
                        placeholder="URL de l'image de couverture (optionnel)"
                        value={formData.coverImageUrl}
                        onChange={(e) => handleFormChange("coverImageUrl", e.target.value)}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Galerie d'images */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                    Galerie d'images
                  </label>
                  <Box
                    sx={{
                      border: "2px dashed #ccc",
                      borderRadius: 2,
                      p: 4,
                      textAlign: "center",
                      cursor: "pointer",
                      mb: 3,
                    }}
                  >
                    <Input
                      accept="image/*"
                      multiple
                      type="file"
                      onChange={handleFilesChange}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                      Déposez vos photos ici, ou cliquez pour en charger.
                    </Typography>
                  </Box>

                  {/* Images existantes */}
                  <div className="flex flex-wrap gap-4 mb-4">
                    {existingImages.map((imageUrl, index) => (
                      <Box key={`existing-${index}`} sx={{ position: 'relative', width: 100, height: 100 }}>
                        <img
                          src={`https://waw.com.tn${imageUrl}`}
                          alt={`Existante ${index}`}
                          className="w-full h-full object-cover rounded"
                        />
                        <IconButton
                          onClick={() => handleRemoveImage(index, 'existing')}
                          sx={{ position: 'absolute', top: 2, right: 2, bgcolor: 'rgba(255,255,255,0.8)' }}
                          size="small"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                  </div>

                  {/* Nouvelles images */}
                  <div className="flex flex-wrap gap-4">
                    {newImagesFiles.map((file, index) => (
                      <Box key={`new-${index}`} sx={{ position: 'relative', width: 100, height: 100 }}>
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="w-full h-full object-cover rounded"
                        />
                        <IconButton
                          onClick={() => handleRemoveImage(index, 'new')}
                          sx={{ position: 'absolute', top: 2, right: 2, bgcolor: 'rgba(255,255,255,0.8)' }}
                          size="small"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <Typography variant="h6" className="text-black">Contact</Typography>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                    Personne de contact
                  </label>
                  <Input
                    type="text"
                    placeholder="Nom de la personne de contact"
                    value={formData.contactPerson}
                    onChange={(e) => handleFormChange("contactPerson", e.target.value)}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                    Téléphone de contact
                  </label>
                  <Input
                    type="tel"
                    placeholder="Téléphone de contact"
                    value={formData.contactPersonPhone}
                    onChange={(e) => handleFormChange("contactPersonPhone", e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Réseaux sociaux */}
            <div className="space-y-4">
              <Typography variant="h6" className="text-black">Réseaux sociaux</Typography>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                    Facebook URL
                  </label>
                  <Input
                    type="url"
                    placeholder="https://facebook.com/..."
                    value={formData.facebookUrl}
                    onChange={(e) => handleFormChange("facebookUrl", e.target.value)}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                    Instagram URL
                  </label>
                  <Input
                    type="url"
                    placeholder="https://instagram.com/..."
                    value={formData.instagramUrl}
                    onChange={(e) => handleFormChange("instagramUrl", e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Statut */}
            <div className="space-y-4">
              <Typography variant="h6" className="text-black">Statut</Typography>
              
              <FormControlLabel
                control={
                  <RadioGroup
                    row
                    value={formData.isActive}
                    onChange={(e) => handleFormChange("isActive", e.target.value === "true")}
                  >
                    <FormControlLabel value={true} control={<Radio />} label="Actif" />
                    <FormControlLabel value={false} control={<Radio />} label="Inactif" />
                  </RadioGroup>
                }
                label=""
              />
            </div>

            {/* Boutons d'action */}
            <div className="flex justify-between pt-6 border-t">
              <Button
                variant="outlined"
                onClick={() => navigate("/vendeur/restaurants")}
              >
                Annuler
              </Button>
              
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                disabled={uploading}
                startIcon={uploading ? <CircularProgress size={20} /> : null}
              >
                {uploading ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}