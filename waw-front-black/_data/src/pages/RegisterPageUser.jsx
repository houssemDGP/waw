import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Paper,
  Avatar,
  Grid,
} from "@mui/material";
import Navbar from "../components/NavbarRegister";
import TopBar from "../components/TopBar";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import axios from "axios";

// Icône personnalisée
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Composant pour cliquer sur la carte
const LocationSelector = ({ position, setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position ? <Marker position={position} icon={markerIcon} /> : null;
};

const RegisterPage = () => {
  const [image, setImage] = useState(null);
  const [position, setPosition] = useState([36.8065, 10.1815]); // Tunis par défaut
  const [searchQuery, setSearchQuery] = useState("");
  const [accountType, setAccountType] = useState("entreprise");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImage(URL.createObjectURL(file));
  };

  const handleSearch = async () => {
    if (!searchQuery) return;

    try {
      const response = await axios.get("https://nominatim.openstreetmap.org/search", {
        params: {
          q: searchQuery,
          format: "json",
        },
      });

      if (response.data && response.data.length > 0) {
        const { lat, lon } = response.data[0];
        setPosition([parseFloat(lat), parseFloat(lon)]);
      } else {
        alert("Aucun résultat trouvé.");
      }
    } catch (error) {
      console.error("Erreur de géocodage :", error);
    }
  };

  return (
    <>
      <TopBar />
      <Navbar />
      <Container maxWidth={false} sx={{ mt: 4, mb: 6 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h5" fontWeight="bold" mb={2}>
            Création d'un compte
          </Typography>


          <Box component="form" noValidate autoComplete="off">
            <Stack spacing={3}>
              {/* Upload image */}
              <Box textAlign="center">
                <Avatar
                  src={image}
                  sx={{ width: 100, height: 100, mx: "auto", mb: 1 }}
                />
                <Button variant="outlined" component="label"  sx={{ backgroundColor: "#181AD6", color: "#fff", "&:hover": { backgroundColor: "#12149a" } }}>
                  Télécharger une photo
                  <input type="file" hidden onChange={handleImageChange}  
/>
                </Button>
              </Box>

<Stack
  direction={{ xs: "column", sm: "row" }}
  flexWrap="wrap"
  justifyContent="space-between"
>
                  <TextField
                    label="Nom"
                    fullWidth
                    required
                        sx={{ mb: 2 }}

                  />
                  <TextField
                    label="Prenom"
                    fullWidth
                    required
                        sx={{ mb: 2 }}

                  />
                  <TextField
                    label="Numéro de téléphone"
                    fullWidth
                    required
                    placeholder="+216 50 000 000"
                        sx={{ mb: 2 }}

                  />

                  <TextField
                    label="Adresse e-mail"
                    type="email"
                    fullWidth
                    required
                        sx={{ mb: 2 }}

                  />
</Stack>



              <Button
                type="submit"
                variant="contained"
  sx={{ backgroundColor: "#181AD6", "&:hover": { backgroundColor: "#12149a" } }}
                fullWidth
                size="large"
              >
                Créer un compte
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default RegisterPage;
