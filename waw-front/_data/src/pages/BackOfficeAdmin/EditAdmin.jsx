import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Stack,
  Tooltip,
  IconButton,Toolbar
} from "@mui/material";
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import axios from "axios";
import SideBar from "./SideBar";
import styled from 'styled-components';

const Container = styled.div`
  font-family: 'Poppins', sans-serif;
  background: #f8f9fa;
  min-height: 100vh;
  padding: 0 1rem;
`;


const EditAdminPage = () => {
  const adminId = localStorage.getItem("adminId"); // récupération adminId depuis localStorage

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    if (!adminId) {
      setError("ID admin manquant");
      setLoading(false);
      return;
    }
    setLoading(true);
    axios.get(`http://102.211.209.131:3011/api/admins/${adminId}`)
      .then(res => {
        const data = res.data;
        setAdminData({
          name: data.name || "",
          email: data.email || "",
          password: "", // vide par défaut (pas de changement)
        });
      })
      .catch(err => {
        setError("Erreur lors du chargement des données");
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [adminId]);

  const handleChange = (e) => {
    setAdminData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const toggleStatus = () => {
    setAdminData(prev => ({
      ...prev    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const payload = {
        ...adminData,      };

      // Ne pas envoyer password vide (si vide on ignore)
      if (!payload.password) {
        delete payload.password;
      }

      await axios.put(`http://102.211.209.131:3011/api/admins/${adminId}`, payload);
      alert("Admin mis à jour avec succès !");
    } catch (err) {
      setError("Erreur lors de la sauvegarde");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Box sx={{ mt: 10, textAlign: "center" }}><CircularProgress /></Box>;
  }

  if (error) {
    return <Box sx={{ mt: 10, textAlign: "center", color: "red" }}>{error}</Box>;
  }

  return (
        <Box sx={{ display: "flex" }}>
      <SideBar />

      {/* Main content */}
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, backgroundColor: "#f5f5f5", minHeight: "100vh" }}
      >
        <Toolbar />
    <Container>
          <Typography variant="h5" mb={3}>Modifier l'administrateur</Typography>

      <form onSubmit={handleSubmit} noValidate autoComplete="off">
        <Stack spacing={3}>

          <TextField
            label="Nom"
            name="name"
            value={adminData.name}
            onChange={handleChange}
            required
            fullWidth
          />

          <TextField
            label="Email"
            name="email"
            type="email"
            value={adminData.email}
            onChange={handleChange}
            required
            fullWidth
          />

          <TextField
            label="Mot de passe"
            name="password"
            type="password"
            value={adminData.password}
            onChange={handleChange}
            helperText="Laisser vide pour ne pas modifier"
            fullWidth
          />
          <Button type="submit" variant="contained" disabled={saving}>
            {saving ? "Sauvegarde en cours..." : "Enregistrer"}
          </Button>
        </Stack>
      </form>
    </Container>
          </Box>

    </Box>   );
};

export default EditAdminPage;
