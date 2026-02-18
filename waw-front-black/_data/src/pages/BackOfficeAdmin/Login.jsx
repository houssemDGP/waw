import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  Stack,
  Link,
  Paper,
  Alert,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(false);
const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      const res = await axios.post("http://102.211.209.131:3011/api/admins/login", {
        email,
        password,
      });
const createdBusiness = res.data;
localStorage.setItem("adminId", createdBusiness.id);
localStorage.setItem("adminemailId", createdBusiness.email);
localStorage.setItem("activites", createdBusiness.activites);
localStorage.setItem("banners", createdBusiness.banners);
localStorage.setItem("categories", createdBusiness.categories);
localStorage.setItem("events", createdBusiness.events);
localStorage.setItem("reservations", createdBusiness.reservations);
localStorage.setItem("role", createdBusiness.role);

      setSuccessMessage("Connexion réussie !");
setTimeout(() => {
  navigate("/BackofficeAdmin/Dashboard");
}, 1000);       console.log(res.data);
    } catch (err) {
      setError(
        err.response?.data || "Erreur de connexion. Vérifiez vos identifiants."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ mt: 5, p: 4, borderRadius: 3 }}>
          <Typography variant="h5" fontWeight="bold" mb={1}>
            Dashboard Admin
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={4}>
            Connectez-vous à votre compte avec votre adresse e-mail
          </Typography>

          <Box component="form" onSubmit={handleLogin} noValidate>
            <Stack spacing={3}>
              {error && <Alert severity="error">{error}</Alert>}
              {successMessage && <Alert severity="success">{successMessage}</Alert>}

              <TextField
                label="Adresse e-mail"
                variant="outlined"
                type="email"
                fullWidth
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                label="Mot de passe"
                variant="outlined"
                type="password"
                fullWidth
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                type="submit"
                disabled={loading}
              >
                {loading ? "Connexion..." : "Continuer"}
              </Button>

            </Stack>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default LoginPage;
