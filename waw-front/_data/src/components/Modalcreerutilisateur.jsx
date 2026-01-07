import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal } from "./ui/modal/ModalNav";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../icons";
import Label from "./form/Label";
import Input from "./form/input/InputField";
import Checkbox from "./form/input/Checkbox";
import styled from 'styled-components';
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  Collapse,
  List,
  ListItem,Drawer ,
  ListItemText,Avatar, Tab, Tabs
} from '@mui/material';
import { Link } from "react-router-dom";
import {  Stepper, Step, StepLabel} from "@mui/material";

import MenuIcon from '@mui/icons-material/Menu';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LanguageIcon from '@mui/icons-material/Language'; // icône globe (remplace svg custom)
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AIChatButton from './AIChatButton';

const Modalcreerutilisateur = ({ profile }) => {
const handleSubmitUser = async (e) => {
  e.preventDefault();

  if (formDataUser.password !== confirmPasswordUser) {
    alert("Les mots de passe ne correspondent pas !");
    return;
  }

  try {
    // 1️⃣ Créer l'utilisateur (sans image)
    const userResponse = await axios.post(
      "https://waw.com.tn/api/api/users/create",
      formDataUser,
        { headers: { "Content-Type": "application/json" } }
    );

    const createdUser = userResponse.data;
    console.log("Utilisateur créé :", createdUser);

    // 2️⃣ Upload de l'image si elle existe
    if (imageFileUser) {
      const imageData = new FormData();
      imageData.append("image", imageFileUser);

      const imageResponse = await axios.post(
        `https://waw.com.tn/api/api/users/${createdUser.id}/upload-image`,
        imageData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Image uploadée :", imageResponse.data);
    }

    // 3️⃣ Réinitialiser le formulaire
    setModalOpenUser(false);
    setFormDataUser({ nom: "", prenom: "", mail: "", password: "", phone: "" });
    setImageFileUser(null);
    setImagePreviewUser(null);
    setConfirmPasswordUser("");
    setShowPasswordUser(false);

  } catch (error) {
        console.log("Utilisateur créé :", formDataUser);

    console.error("Erreur lors de la création :", error);
  }
};

  return (
     <Modal
  isOpen={modalOpenUser}
  onClose={() => setModalOpenUser(false)}
  className="max-w-[700px] p-6"
>
  <div className="space-y-4">
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
      Créer un utilisateur
    </h1>

    <form onSubmit={handleSubmitUser} className="space-y-4">
      {/* Nom */}
      <div>
        <Label>Nom</Label>
        <Input
          type="text"
          name="nom"
          value={formDataUser.nom}
          onChange={handleChangeUser}
          required
        />
      </div>

      {/* Prénom */}
      <div>
        <Label>Prénom</Label>
        <Input
          type="text"
          name="prenom"
          value={formDataUser.prenom}
          onChange={handleChangeUser}
          required
        />
      </div>

      {/* Email */}
      <div>
        <Label>Email</Label>
        <Input
          type="email"
          name="mail"
          value={formDataUser.mail}
          onChange={handleChangeUser}
          required
        />
      </div>

      {/* Téléphone */}
      <div>
        <Label>Téléphone</Label>
        <Input
          type="text"
          name="phone"
          value={formDataUser.phone}
          onChange={handleChangeUser}
        />
      </div>

      {/* Logo / Photo */}
      <div>
        <Label>Photo</Label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChangeUser}
          className="block w-full p-2 rounded border-2 border-[#FF7900] cursor-pointer"
        />
        {imagePreviewUser && (
          <img
            src={imagePreviewUser}
            alt="Aperçu"
            className="mt-2 max-h-32 rounded border border-gray-300"
          />
        )}
      </div>

      {/* Mot de passe */}
      <div>
        <Label>Mot de passe</Label>
        <div className="relative">
          <Input
            type={showPasswordUser ? "text" : "password"}
            name="password"
            value={formDataUser.password}
            onChange={handleChangeUser}
            required
          />
          <span
            onClick={() => setShowPasswordUser(!showPasswordUser)}
            className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
          >
            {showPasswordUser ? (
              <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
            ) : (
              <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
            )}
          </span>
        </div>
      </div>

      {/* Confirmer le mot de passe */}
      <div>
        <Label>Confirmer le mot de passe</Label>
        <div className="relative">
          <Input
            type={showPasswordUser ? "text" : "password"}
            value={confirmPasswordUser}
            onChange={(e) => setConfirmPasswordUser(e.target.value)}
            required
          />
          <span
            onClick={() => setShowPasswordUser(!showPasswordUser)}
            className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
          >
            {showPasswordUser ? (
              <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
            ) : (
              <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
            )}
          </span>
        </div>
      </div>

      {/* Recherche adresse */}
      <Input
        fullWidth
        placeholder="Rechercher une ville ou une adresse (ex : Hammamet)"
        value={searchQueryUser}
        onChange={(e) => setSearchQueryUser(e.target.value)}
      />
      <center>
<Button
  type="button"
  onClick={async () => {
    await handleSearchUser();
    setFromSearchUser(true); // 🔹 on indique que la map doit se re-render
  }}
  sx={{
    fontWeight: 600,
    color: "white",
    textTransform: "none",
    borderRadius: "20px",
    background: "linear-gradient(90deg, #181AD6 0%, #FF7900 100%)",
    padding: "10px 35%",
  }}
>
  Rechercher
</Button>
      </center>

      {/* Map */}
      <Box sx={{ height: 300 }}>
<MapContainer
    key={fromSearchUser ? `${positionUser[0]}-${positionUser[1]}` : undefined} 
    center={positionUser}
    zoom={13}
    style={{ height: "100%" }}
  >
    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
    <LocationSelectorUser
      position={positionUser}
      setPosition={(pos) => {
        setPositionUser(pos);
        setFromSearchUser(false); // 🔹 clic manuel → pas de re-render complet
      }}
      setFormDataUser={setFormDataUser}
    />
  </MapContainer>
      </Box>

        <Label>Adress : {formDataUser.rue}</Label>
                <Label>Ville : {formDataUser.ville}</Label>
        <Label>Pays : {formDataUser.pays}</Label>



      {geoErrorUser && <Typography color="error">{geoErrorUser}</Typography>}
      <Typography variant="body2">
        📍 {positionUser[0].toFixed(5)} | {positionUser[1].toFixed(5)}
      </Typography>

      {/* Bouton de soumission */}
      <Button
        type="submit"
        sx={{
          fontWeight: 600,
          color: "white",
          textTransform: "none",
          borderRadius: "20px",
          background: "linear-gradient(90deg, #181AD6 0%, #FF7900 100%)",
          padding: "10px 40px",
          width: "100%",
        }}
      >
        Créer l'utilisateur
      </Button>
    </form>
  </div>
</Modal>
  );
};

export default Modalcreerutilisateur;
