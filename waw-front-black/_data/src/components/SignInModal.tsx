import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { EyeCloseIcon, EyeIcon } from "../icons";
import Label from "./form/Label";
import Checkbox from "./form/input/Checkbox";

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  error?: string;
  successMessage?: string;
  onLogin: (email: string, password: string, isChecked: boolean) => void;
  loading?: boolean;
}

const SignInModal: React.FC<SignInModalProps> = ({
  isOpen,
  onClose,
  error,
  successMessage,
  onLogin,
  loading = false,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password, isChecked);
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="signin-modal-title"
      aria-describedby="signin-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "100%",
          maxWidth: 500,
          bgcolor: "background.paper",
          borderRadius: 3,
          boxShadow: 24,
          p: 4,
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        {/* Bouton fermer */}
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 16, top: 16 }}
        >
          <CloseIcon />
        </IconButton>

        {/* Header */}
        <Typography
          id="signin-modal-title"
          variant="h6"
          component="h2"
          gutterBottom
        >
          Se connecter
        </Typography>
        <Typography
          id="signin-modal-description"
          variant="body2"
          color="text.secondary"
          mb={2}
        >
          Entrez votre email et votre mot de passe pour vous connecter !
        </Typography>

        {/* Messages */}
        {error && <Typography color="error">{error}</Typography>}
        {successMessage && (
          <Typography color="success.main">{successMessage}</Typography>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ marginTop: 16 }}>
          <div>
            <Label>Email <span className="text-error-500">*</span></Label>
            <input
              type="email"
              value={email}
              placeholder="info@gmail.com"
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border rounded px-3 py-2 mt-1"
            />
          </div>

          <div style={{ marginTop: 16 }}>
            <Label>Mot de passe <span className="text-error-500">*</span></Label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                placeholder="votre mot de passe"
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border rounded px-3 py-2 mt-1"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
              >
                {showPassword ? (
                  <EyeIcon className="w-5 h-5 fill-gray-500" />
                ) : (
                  <EyeCloseIcon className="w-5 h-5 fill-gray-500" />
                )}
              </span>
            </div>
          </div>

          <div
            className="flex items-center justify-between"
            style={{ marginTop: 16 }}
          >
            <div className="flex items-center gap-2">
              <Checkbox checked={isChecked} onChange={setIsChecked} />
              <span className="text-sm">Rester connecté ?</span>
            </div>
            <a
              href="/reset-password"
              className="text-sm text-blue-600 hover:underline"
            >
              Mot de passe oublié ?
            </a>
          </div>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3 }}
            disabled={loading}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </Button>
        </form>

        {/* Footer */}
        <Typography
          variant="body2"
          align="center"
          sx={{ mt: 3, color: "text.secondary" }}
        >
          Vous n'avez pas de compte ?{" "}
          <a href="/signup" className="text-blue-600 hover:underline">
            Créer un compte
          </a>
        </Typography>
      </Box>
    </Modal>
  );
};

export default SignInModal;
