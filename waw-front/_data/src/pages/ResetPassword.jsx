import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  Stack,
} from "@mui/material";
import axios from "axios";
import TopBar from "../components/TopBar";
import Navbar from "../components/Navbar";

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1); // 1: email, 2: code + new password
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

// 📌 Étape 1 : Envoi du code (business → users → admins)
const handleSendCode = async (e) => {
  e.preventDefault();
  setError(null);
  setMessage(null);
  setLoading(true);

  try {
    try {
      // 1️⃣ Business
      const res = await axios.post("https://waw.com.tn/api/api/business/auth/forgot-password", {
        email,
      });
      setMessage(res.data);
      setStep(2);
    } catch {
      try {
        // 2️⃣ Users
        const res = await axios.post("https://waw.com.tn/api/api/users/auth/forgot-password", {
          email,
        });
        setMessage(res.data);
        setStep(2);
      } catch {
        // 3️⃣ Admins
        const res = await axios.post("https://waw.com.tn/api/api/admins/auth/forgot-password", {
          email,
        });
        setMessage(res.data);
        setStep(2);
      }
    }
  } catch (err) {
    setError(err.response?.data || "Erreur lors de l'envoi du code.");
  } finally {
    setLoading(false);
  }
};

// 📌 Étape 2 : Réinitialisation du mot de passe (business → users → admins)
const handleResetPassword = async (e) => {
  e.preventDefault();
  setError(null);
  setMessage(null);
  setLoading(true);

  try {
    try {
      // 1️⃣ Business
      await axios.post("https://waw.com.tn/api/api/business/auth/reset-password", {
        email,
        resetCode,
        newPassword,
      });
      setMessage("Mot de passe réinitialisé avec succès !");
      setStep(1);
    } catch {
      try {
        // 2️⃣ Users
        await axios.post("https://waw.com.tn/api/api/users/auth/reset-password", {
          email,
          resetCode,
          newPassword,
        });
        setMessage("Mot de passe réinitialisé avec succès !");
        setStep(1);
      } catch {
        // 3️⃣ Admins
        await axios.post("https://waw.com.tn/api/api/admins/auth/reset-password", {
          email,
          resetCode,
          newPassword,
        });
        setMessage("Mot de passe réinitialisé avec succès !");
        setStep(1);
      }
    }
  } catch (err) {
    setError(err.response?.data || "Échec de la réinitialisation du mot de passe.");
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
          <Typography variant="h5" fontWeight="bold" mb={2}>
            Mot de passe oublié
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={4}>
            {step === 1
              ? "Entrez votre adresse e-mail pour recevoir un code de réinitialisation."
              : "Entrez le code reçu et votre nouveau mot de passe."}
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}

          {step === 1 ? (
            <Box component="form" onSubmit={handleSendCode}>
              <Stack spacing={3}>
                <TextField
                  label="Adresse e-mail"
                  variant="outlined"
                  fullWidth
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={loading}
                >
                  {loading ? "Envoi..." : "Envoyer le code"}
                </Button>
              </Stack>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleResetPassword}>
              <Stack spacing={3}>
                <TextField
                  label="Code de vérification"
                  variant="outlined"
                  fullWidth
                  required
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                />
                <TextField
                  label="Nouveau mot de passe"
                  type="password"
                  variant="outlined"
                  fullWidth
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={loading}
                >
                  {loading ? "Réinitialisation..." : "Réinitialiser"}
                </Button>
              </Stack>
            </Box>
          )}
        </Paper>
      </Container>
    </>
  );
};

export default ForgotPasswordPage;
