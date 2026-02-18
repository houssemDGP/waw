import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Paper,
  Avatar,
  Toolbar,
  CircularProgress,
} from "@mui/material";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import SideBar from "./SideBar";

// Icône personnalisée
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Composant map avec sélection de position + reverse geocoding
const LocationSelector = ({ position, setPosition, setFormData }) => {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);

      try {
        const res = await axios.get(
          "https://nominatim.openstreetmap.org/reverse",
          {
            params: {
              lat,
              lon: lng,
              format: "json",
              addressdetails: 1,
            },
          }
        );

        const addr = res.data.address || {};
        const rue = res.data.display_name || "";
        const ville =
          addr.city || addr.town || addr.village || addr.state || "";
        const pays = addr.country || "";

        setFormData((prev) => ({
          ...prev,
          rue,
          ville,
          pays,
        }));
      } catch (error) {
        console.error("Erreur reverse geocoding:", error);
      }
    },
  });

  return position ? <Marker position={position} icon={markerIcon} /> : null;
};

const RegisterPage = ({ }) => {
    const businessId = localStorage.getItem("businessId"); // récupère depuis localStorage

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [position, setPosition] = useState([36.8065, 10.1815]); // par défaut Tunis
  const [searchQuery, setSearchQuery] = useState("");

  const [formData, setFormData] = useState({
    rue: "",
    ville: "",
    pays: "",
    nom: "",
    description: "",
    telephone: "",
    email: "",
    rne: "",
    raisonSociale: "",
    password: "",
  });

  // Charger les données business au montage
  useEffect(() => {
    if (!businessId) return;
    setLoadingData(true);
    axios
      .get(`http://102.211.209.131:3011/api/business/${businessId}`)
      .then((res) => {
        const data = res.data;
        setFormData({
          nom: data.nom || "",
          description: data.description || "",
          telephone: data.phone || "",
          email: data.email || "",
          rne: data.rne || "",
          raisonSociale: data.rs || "",
          rue: data.adresse || "",
          ville: data.ville || "",
          pays: data.pays || "",
          password: "", // ne jamais pré-remplir le mdp
        });
        if (data.latitude && data.longitude) {
          setPosition([data.latitude, data.longitude]);
        }
        if (data.imageUrl) {
          setImage(data.imageUrl.startsWith("http") ? data.imageUrl : `http://102.211.209.131:3011${data.imageUrl}`);
        }
      })
      .catch((err) => {
        console.error("Erreur chargement business:", err);
        alert("Erreur lors du chargement des données");
      })
      .finally(() => setLoadingData(false));
  }, [businessId]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setImageFile(file);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery) return;

    try {
      const response = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
          params: {
            q: searchQuery,
            format: "json",
          },
        }
      );

      if (response.data && response.data.length > 0) {
        const { lat, lon, display_name, address } = response.data[0];
        setPosition([parseFloat(lat), parseFloat(lon)]);

        setFormData((prev) => ({
          ...prev,
          rue: display_name,
          ville:
            address.city ||
            address.town ||
            address.village ||
            address.state ||
            "",
          pays: address.country || "",
        }));
      } else {
        alert("Aucun résultat trouvé.");
      }
    } catch (error) {
      console.error("Erreur de géocodage :", error);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!businessId) {
      alert("Business ID manquant.");
      return;
    }
    setLoading(true);

    try {
      const payload = {
        nom: formData.nom,
        description: formData.description,
        phone: formData.telephone,
        email: formData.email,
        rne: formData.rne,
        rs: formData.raisonSociale,
        adresse: formData.rue,
        ville: formData.ville,
        pays: formData.pays,
        latitude: position[0],
        longitude: position[1],
        password: formData.password,
      };

      await axios.put(
        `http://102.211.209.131:3011/api/business/${businessId}`,
        payload
      );

      // Upload image si changé
      if (imageFile) {
        const formImage = new FormData();
        formImage.append("image", imageFile);

        await axios.post(
          `http://102.211.209.131:3011/api/business/${businessId}/upload-image`,
          formImage,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        
      }

      alert("Compte mis à jour avec succès !");
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      alert("Erreur lors de la mise à jour, veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <SideBar />
        <Box
          component="main"
          sx={{ flexGrow: 1, p: 3, backgroundColor: "#f5f5f5", minHeight: "100vh" }}
        >
          <Toolbar />
          <Paper elevation={3} sx={{ mt: 5, p: 4, borderRadius: 3 }}>
            <Typography variant="h5" fontWeight="bold" mb={2}>
              Editer votre compte
            </Typography>

            <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
              <Stack spacing={3}>
                {/* Upload image */}
                <Box textAlign="center">
                  <Avatar
                    src={image}
                    sx={{ width: 100, height: 100, mx: "auto", mb: 1 }}
                  />
                  <Button variant="outlined" component="label">
                    Télécharger un logo / photo
                    <input type="file" hidden onChange={handleImageChange} />
                  </Button>
                </Box>

                {/* Nom entreprise ou vendeur */}
                <TextField
                  label="Nom de l’entreprise ou du vendeur"
                  name="nom"
                  fullWidth
                  required
                  value={formData.nom}
                  onChange={handleChange}
                />

                {/* Description courte */}
                <TextField
                  label="Description courte"
                  name="description"
                  fullWidth
                  multiline
                  rows={3}
                  inputProps={{ maxLength: 300 }}
                  placeholder="Ex : Nous proposons des balades à cheval à Hammamet depuis 2022."
                  required
                  value={formData.description}
                  onChange={handleChange}
                />

                {/* Téléphone */}
                <TextField
                  label="Numéro de téléphone"
                  name="telephone"
                  fullWidth
                  required
                  placeholder="+216 50 000 000"
                  value={formData.telephone}
                  onChange={handleChange}
                />

                {/* Email */}
                <TextField
                  label="Adresse e-mail"
                  name="email"
                  type="email"
                  fullWidth
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
                <TextField
                  label="RNE"
                  name="rne"
                  required
                  fullWidth
                  value={formData.rne}
                  onChange={handleChange}
                />
                <TextField
                  label="Raison sociale"
                  name="raisonSociale"
                  required
                  fullWidth
                  value={formData.raisonSociale}
                  onChange={handleChange}
                />
                <TextField
                  label="Mot de passe"
                  name="password"
                  type="password"
                  fullWidth
                  value={formData.password}
                  onChange={handleChange}
                  helperText="Laisser vide pour ne pas changer le mot de passe"
                />

                <Box sx={{ mt: 2, mb: 1 }}>
                  <Stack direction="row" spacing={2}>
                    <TextField
                      fullWidth
                      placeholder="Rechercher une ville ou une adresse (ex : Hammamet)"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Button variant="contained" onClick={handleSearch}>
                      Rechercher
                    </Button>
                  </Stack>
                </Box>

                <Box sx={{ height: 300, borderRadius: 2, overflow: "hidden" }}>
                  <MapContainer
                    center={position}
                    zoom={13}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer
                      attribution="&copy; OpenStreetMap"
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationSelector
                      position={position}
                      setPosition={setPosition}
                      setFormData={setFormData}
                    />
                  </MapContainer>
                </Box>

                {/* Champs adresse récupérés */}
                <TextField
                  label="Rue / Adresse complète"
                  name="rue"
                  fullWidth
                  required
                  value={formData.rue}
                  onChange={handleChange}
                />
                <TextField
                  label="Ville"
                  name="ville"
                  fullWidth
                  required
                  value={formData.ville}
                  onChange={handleChange}
                />
                <TextField
                  label="Pays"
                  name="pays"
                  fullWidth
                  required
                  value={formData.pays}
                  onChange={handleChange}
                />

                {/* Coordonnées (en lecture seule) */}
<Typography variant="body2" sx={{ mt: 1 }}>
  📍 Latitude : {typeof position[0] === 'number' ? position[0].toFixed(5) : 'N/A'} | Longitude :{" "}
  {typeof position[1] === 'number' ? position[1].toFixed(5) : 'N/A'}
</Typography>

                {/* Bouton */}
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  disabled={loading}
                >
                  {loading ? "Mise à jour en cours..." : "Mise à jour du compte"}
                </Button>
              </Stack>
            </Box>
          </Paper>
        </Box>
      </Box>
    </>
  );
};

export default RegisterPage;
