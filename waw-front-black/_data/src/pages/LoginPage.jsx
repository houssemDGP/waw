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
import Navbar from "../components/Navbar";
import TopBar from "../components/TopBar";
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
      const res = await axios.post("http://102.211.209.131:3011/api/business/login", {
        email,
        password,
      });
const createdBusiness = res.data;
localStorage.setItem("businessId", createdBusiness.id);

      setSuccessMessage("Connexion réussie !");
setTimeout(() => {
  navigate("/Backoffice/Dashboard");
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
      <TopBar />
      <Navbar />
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ mt: 5, p: 4, borderRadius: 3 }}>
          <Typography variant="h5" fontWeight="bold" mb={1}>
            Connectez-vous et commencez votre découverte
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={4}>
            Connectez-vous à votre compte avec votre adresse e-mail, ou créez un
            compte ci-dessous. C'est simple et rapide, promis !
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

              <Divider>ou continuer avec</Divider>

              <Button
                variant="outlined"
                color="primary"
                fullWidth
                startIcon={
                  <img
                    src="/icons/google.png"
                    alt="Google"
                    style={{ width: 20, height: 20 }}
                  />
                }
              >
                Continuer avec Google
              </Button>
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                startIcon={
                  <img
                    src="/icons/fb.png"
                    alt="Facebook"
                    style={{ width: 20, height: 20 }}
                  />
                }
              >
                Continuer avec Facebook
              </Button>

              <Typography variant="body2" textAlign="center" mt={2}>
                Vous n'avez pas de compte ?{" "}
                <Link href="#" underline="hover">
                  Créez-en un ici
                </Link>
              </Typography>
              <Typography variant="body2" textAlign="right">
  <Link href="/mot-de-passe-oublie" underline="hover">
    Mot de passe oublié ?
  </Link>
</Typography>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default LoginPage;
