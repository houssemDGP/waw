import React, { useState,useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Paper,
  Avatar,
} from "@mui/material";
import Navbar from "../components/NavbarRegister";
import TopBar from "../components/TopBar";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import axios from "axios";

// Icône personnalisée Leaflet
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Sélection de position sur la carte + reverse geocoding
const LocationSelector = ({ position, setPosition, setFormData }) => {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);

      try {
        const res = await axios.get("https://nominatim.openstreetmap.org/reverse", {
          params: {
            lat,
            lon: lng,
            format: "json",
            addressdetails: 1,
          },
        });

        const addr = res.data.address || {};
        const rue = res.data.display_name || "";
        const ville = addr.state || addr.state_district || "";
        const pays = addr.country || "";

        setFormData((prev) => ({
          ...prev,
          rue,
          ville,
          pays,
        }));
      } catch (err) {
        console.error("Reverse geocoding error:", err);
      }
    },
  });

  return position ? <Marker position={position} icon={markerIcon} /> : null;
};

const RegisterPage = () => {
  const [step, setStep] = useState(1);
  const [accountType, setAccountType] = useState("entreprise");
  const [image, setImage] = useState(null);
  const [position, setPosition] = useState([36.8065, 10.1815]);
  const [searchQuery, setSearchQuery] = useState("");

  const [formData, setFormData] = useState({
    nom: "",
    telephone: "",
    email: "",
    rne: "",
    raisonSociale: "",
    description: "",
    rue: "",
    ville: "",
    pays: "",
  });


  const handleSearch = async () => {
    if (!searchQuery) return;
    try {
      const response = await axios.get("https://nominatim.openstreetmap.org/search", {
        params: {
          q: searchQuery,
          format: "json",
          addressdetails: 1,
        },
      });

      if (response.data.length > 0) {
        const { lat, lon, display_name, address } = response.data[0];
        setPosition([parseFloat(lat), parseFloat(lon)]);

        const rue = display_name;
        const ville = address.city || address.town || address.village || "";
        const pays = address.country || "";

        setFormData((prev) => ({
          ...prev,
          rue,
          ville,
          pays,
        }));
      }
    } catch (error) {
      console.error("Geocoding search failed:", error);
    }
  };

const requiredFieldsPerStep = {
  1: [],
  2: ["nom", "telephone", "email", ...(accountType === "entreprise" ? ["raisonSociale"] : []), "description"],
  3: ["ville", "pays", "rue"],
};

const handleNext = () => {
  if (step === 1) {
    setStep(2);
    return;
  }

  const missing = requiredFieldsPerStep[step]?.filter((key) => !formData[key]?.trim());
  if (missing && missing.length > 0) {
    alert("Veuillez remplir tous les champs obligatoires.");
    return;
  }

  setStep((prev) => Math.min(prev + 1, 3));
};

  const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
const [geoError, setGeoError] = useState(null);

useEffect(() => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition([latitude, longitude]);
        setGeoError(null);
      },
      (err) => {
        setGeoError("Géolocalisation désactivée ou refusée.");
      },
      { timeout: 10000 }
    );
  }
}, []);
const [imageFile, setImageFile] = useState(null);

const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    setImage(URL.createObjectURL(file));
    setImageFile(file); // stocker le vrai fichier pour l'upload
  }
};
const handleSubmit = async (e) => {
  e.preventDefault();

  const missing = requiredFieldsPerStep[step]?.filter((key) => !formData[key]?.trim());
  if (missing && missing.length > 0) {
    alert("Veuillez remplir tous les champs obligatoires.");
    return;
  }

  try {
    // 1. Création du business
    const businessData = {
      nom: formData.nom,
      phone: formData.telephone,
      email: formData.email,
      rne: formData.rne,
      rs: formData.raisonSociale,
      description: formData.description,
      adresse: formData.rue,
      ville: formData.ville,
      pays: formData.pays,
      latitude: position[0],
      longitude: position[1],
      role: accountType === "entreprise" ? "ENTREPRISE" : "VENDEUR",
      type: accountType,
      password: formData.password
    };

    const res = await axios.post("http://102.211.209.131:3011/api/business", businessData);
    const createdBusiness = res.data;
localStorage.setItem("businessId", createdBusiness.id);

    console.log("Business créé :", createdBusiness);

if (imageFile) {
  const formImageData = new FormData();
  formImageData.append("image", imageFile);

  await axios.post(
    `http://102.211.209.131:3011/api/business/${createdBusiness.id}/upload-image`,
    formImageData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
}

    // 3. Redirection
    window.location.href = "http://102.211.209.131:3010/Backoffice/Dashboard";

  } catch (error) {
    console.error("Erreur lors de l'inscription :", error);
    alert("Erreur lors de la création du compte.");
  }
};

  return (
    <>
      <TopBar />
      <Navbar />
      <Container maxWidth={false} sx={{ mt: 4, mb: 6 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h5" fontWeight="bold" mb={2}>
            Création d'un compte - Étape {step} / 3
          </Typography>

          {/* Étape 1 : Type de compte */}
          {step === 1 && (
            <Stack direction="row" spacing={2} justifyContent="center" mb={3}>
              <Button
                variant={accountType === "entreprise" ? "contained" : "outlined"}
                onClick={() => setAccountType("entreprise")}
                sx={accountType === "entreprise" ? {
                  backgroundColor: "#181AD6",
                  "&:hover": { backgroundColor: "#12149a" },
                  color: "#fff",
                } : {}}
              >
                Compte Moral
              </Button>
              <Button
                variant={accountType === "vendeur" ? "contained" : "outlined"}
                onClick={() => setAccountType("vendeur")}
                sx={accountType === "vendeur" ? {
                  backgroundColor: "#181AD6",
                  "&:hover": { backgroundColor: "#12149a" },
                  color: "#fff",
                } : {}}
              >
                Compte Physique
              </Button>
            </Stack>
          )}

          {/* Étape 2 : Infos de base */}
          {step === 2 && (
            <Box component="form" noValidate autoComplete="off">
              <Stack spacing={3}>
                <Box textAlign="center">
                  <Avatar src={image} sx={{ width: 100, height: 100, mx: "auto", mb: 1 }} />
                  <Button
                    variant="outlined"
                    component="label"
                    sx={{ backgroundColor: "#181AD6", color: "#fff", "&:hover": { backgroundColor: "#12149a" } }}
                  >
                    Télécharger un logo / photo
                    <input type="file" hidden onChange={handleImageChange} />
                  </Button>
                </Box>

                <Stack direction={{ xs: "column", sm: "row" }} flexWrap="wrap" justifyContent="space-between">
                  <TextField label="Nom" name="nom" required fullWidth value={formData.nom} onChange={handleChange} sx={{ flexBasis: "48%", mb: 2 }} />
                  <TextField label="Téléphone" name="telephone" required fullWidth value={formData.telephone} onChange={handleChange} sx={{ flexBasis: "48%", mb: 2 }} />
                  <TextField label="Email" name="email" type="email" required fullWidth value={formData.email} onChange={handleChange} sx={{ flexBasis: "48%", mb: 2 }} />
                                                         

                                                                      {accountType === "vendeur" && (

                  <TextField label="CIN" name="cin" fullWidth value={formData.cin} onChange={handleChange} sx={{ flexBasis: "48%", mb: 2 }} />
                  )}
                              

                                    {accountType === "entreprise" && (

                  <TextField label="RNE" name="rne" fullWidth value={formData.rne} onChange={handleChange} sx={{ flexBasis: "48%", mb: 2 }} />
                  )}




                  <TextField label="mot de passe"   type="password" name="password" required fullWidth value={formData.password} onChange={handleChange} sx={{ flexBasis: "48%", mb: 2 }} />
                 


                  {accountType === "entreprise" && (
                    <TextField label="Raison sociale" name="raisonSociale" fullWidth value={formData.raisonSociale} onChange={handleChange} sx={{ flexBasis: "48%", mb: 2 }} />
                  )}


                  <TextField label="Description" name="description" required fullWidth multiline rows={3} value={formData.description} onChange={handleChange} sx={{ flexBasis: "100%", mb: 2 }} />
                </Stack>
              </Stack>
            </Box>
          )}

          {/* Étape 3 : Localisation */}
          {step === 3 && (
            <>
              <Stack spacing={2} mt={2}>
                <Stack direction="row" spacing={2}>
                  <TextField
                    fullWidth
                    placeholder="Rechercher une ville ou une adresse (ex : Hammamet)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button
                    variant="contained"
                    onClick={handleSearch}
                    sx={{ backgroundColor: "#181AD6", "&:hover": { backgroundColor: "#12149a" } }}
                  >
                    Rechercher
                  </Button>
                </Stack>

                <Box sx={{ height: 300, borderRadius: 2, overflow: "hidden" }}>
                  <MapContainer center={position} zoom={13} style={{ height: "100%", width: "100%" }}>
                    <TileLayer
                      attribution="&copy; OpenStreetMap"
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationSelector position={position} setPosition={setPosition} setFormData={setFormData} />
                  </MapContainer>
                </Box>

                <TextField label="Rue / Adresse complète" name="rue" fullWidth required value={formData.rue} onChange={handleChange} />
                <TextField label="Ville" name="ville" fullWidth required value={formData.ville} onChange={handleChange} />
                <TextField label="Pays" name="pays" fullWidth required value={formData.pays} onChange={handleChange} />
{geoError && (
  <Typography color="error" sx={{ mb: 2 }}>
    {geoError}
  </Typography>
)}
                <Typography variant="body2">
                  📍 Latitude : {position[0].toFixed(5)} | Longitude : {position[1].toFixed(5)}
                </Typography>

                <Button
                  type="submit"
                  variant="contained"
                  onClick={handleSubmit}
                  fullWidth
                  size="large"
                  sx={{ backgroundColor: "#181AD6", "&:hover": { backgroundColor: "#12149a" } }}
                >
                  Créer un compte
                </Button>
              </Stack>
            </>
          )}

          {/* Navigation */}
          <Box mt={4} display="flex" justifyContent="space-between">
            {step > 1 && (
              <Button variant="outlined" onClick={handleBack}>
                Retour
              </Button>
            )}
            {step < 3 && (
              <Button
                variant="contained"
                onClick={handleNext}
                sx={{ backgroundColor: "#181AD6", "&:hover": { backgroundColor: "#12149a" } }}
              >
                Suivant
              </Button>
            )}
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default RegisterPage;
