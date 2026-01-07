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

const steps = [
  { label: "Type de compte" },
  { label: "Informations personnelles" },
  { label: "Informations géographiques" },
];

const currencies = [
  { code: 'USD', name: 'Dollar des États-Unis', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'Livre sterling', symbol: '£' },
  // ajoute d'autres monnaies ici
];
const categoriesData = [
  {
    name: 'Meilleures catégories',
    subItems: [
      'Visites à pied',
      'Circuits historiques',
      "Excursions d'une journée",
    ],
  },
  {
    name: 'Meilleures villes a visiter',
    subItems: [
      'Tunis',
      "Hammamet",
      'Sousse',
      "Djerba",
    ],
  },
  { name: 'inspirez moi', url: '/Inspire-moi', subItems: [] }, // note url with leading slash
];
const MenuContainer = styled.div`
  display: flex;
  position: relative;
  width: 500px;
  height: 400px;
  border: 1px solid #ccc;
`;

const CategoryList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  width: 200px;
  background-color: #f8f8f8;
  overflow-y: auto;
  height: 100%;
`;

const CategoryItem = styled.li`
  padding: 10px;
  cursor: pointer;
  border-bottom: 1px solid #ddd;
  &:hover {
    background-color: #e0e0e0;
  }
`;

const Popup = styled.div`
  position: absolute;
  left: 200px;
  top: 0;
  background: white;
  border-left: 1px solid #ccc;
  width: 100%;
  height: 100%;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
`;

const SubCategory = styled.div`
  padding: 5px 0;
  font-size: 14px;
`;
const ButtonNav = styled.a`
  background: #181AD6;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 10px 20px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background: #b7410e;
  }
`;
const ButtonNav2 = styled.a`
  background: rgb(228, 228, 228);
  color: #000000;
  border-radius: 20px;
  padding: 10px 20px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: filter 0.3s ease;

  &:hover {
    filter: brightness(1.1);
  }

  &.red {
    background: #BC0000;
    color: #fff;
    border: none; /* tu peux enlever la bordure dégradée ici */
  }

  &.white {
    background: #fff;
    color: #000;
    border: 1px solid #ccc;
  }
`;
const GradientBorderButtonWrapper = styled.div`
  border-radius: 20px;
  background: #181AD6;
  padding: 3px; 
  display: inline-block;
`;

const GradientBorderButton = styled.a`
  border: none;
  border-radius: 20px; /* comme avant */
  background: white;
  color: #000000;
  padding: 7px 17px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  outline: none;
  display: inline-block; /* pour ressembler à un bouton */
  text-align: center;
  text-decoration: none; /* pour enlever le souligné du lien */

  &:hover {
    filter: brightness(1.1);
  }
`;

function Navbar() {


 const [count, setCount] = useState(0);

useEffect(() => {
  const updateCount = () => {
    const stored = Number(localStorage.getItem("fav-count")) || 0;
    setCount(stored);
  };
  window.addEventListener("fav-count-changed", updateCount);

  const handleStorage = (e) => {
    if (e.key === "fav-count") updateCount();
  };
  window.addEventListener("storage", handleStorage);
  updateCount();
  return () => {
    window.removeEventListener("fav-count-changed", updateCount);
    window.removeEventListener("storage", handleStorage);
  };
}, []);



   const [formDataUser, setFormDataUser] = useState({
    nom: "",
    prenom: "",
    mail: "",
    password: "",
    phone: "",
        rue: "",
    ville: "",
    pays: "",
      latitude: null,
  longitude: null,
  });

  const [imageFileUser, setImageFileUser] = useState(null);
  const [imagePreviewUser, setImagePreviewUser] = useState(null);
  const [showPasswordUser, setShowPasswordUser] = useState(false);
  const [confirmPasswordUser, setConfirmPasswordUser] = useState("");
    const [modalOpenUser, setModalOpenUser] = useState(false);
  const [searchQueryUser, setSearchQueryUser ] = useState("");
    const [positionUser, setPositionUser ] = useState([36.8065, 10.1815]);
  const [geoErrorUser, setGeoErrorUser] = useState(null);
const [fromSearchUser, setFromSearchUser] = useState(false);
const [fromSearchVendeur, setFromSearchVendeur] = useState(false);

// LocationSelector pour User
const LocationSelectorUser = ({ position, setPosition, setFormDataUser }) => {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      try {
        const res = await axios.get(
          "https://nominatim.openstreetmap.org/reverse",
          {
            params: { lat, lon: lng, format: "json", addressdetails: 1 },
          }
        );
        const addr = res.data.address || {};
        const rue = res.data.display_name || "";
        const ville = addr.state || addr.state_district || "";
        const pays = addr.country || "";
        setFormDataUser((prev) => ({ ...prev, rue, ville, pays, latitude: lat, longitude: lng }));
      } catch (err) {
        console.error("Reverse geocoding error:", err);
      }
    },
  });
  return position ? <Marker position={position} icon={markerIcon} /> : null;
};

// Recherche par texte pour User
const handleSearchUser = async () => {
  if (!searchQueryUser) return;
  try {
    const response = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: { q: searchQueryUser, format: "json", addressdetails: 1 },
      }
    );
    if (response.data.length > 0) {
      const { lat, lon, display_name, address } = response.data[0];
      setPositionUser([parseFloat(lat), parseFloat(lon)]);
      const rue = display_name;
      const ville = address.city || address.town || address.village || "";
      const pays = address.country || "";
      setFormDataUser((prev) => ({ ...prev, rue, ville, pays, latitude: parseFloat(lat), longitude: parseFloat(lon) }));
    }
  } catch (error) {
    console.error("Geocoding search failed:", error);
  }
};

  const handleOpenUser = () => {
    setModalOpenUser(true);
    console.log(modalOpenUser);
  };
  const handleChangeUser = (e) => {
    setFormDataUser({ ...formDataUser, [e.target.name]: e.target.value });
  };

const handleFileChangeUser = (e) => {
  const file = e.target.files[0];
  setImageFileUser(file);
  setImagePreviewUser(file ? URL.createObjectURL(file) : null);
};

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

 const [formData, setFormData] = useState({
    nom: "",
    telephone: "",
    email: "",
    password: "",
    cin: "",
    rne: "",
    raisonSociale: "",
    description: "",
    rue: "",
    ville: "",
    pays: "",
    facebook: "",
    instagram: "",
    tiktok: "",

  });

  const [step, setStep] = useState(0);
  const [position, setPosition] = useState([36.8065, 10.1815]);
  const [searchQuery, setSearchQuery] = useState("");
  const [geoError, setGeoError] = useState(null);
  const [accountType, setAccountType] = useState(""); // "pro" or "personne"
  const [imageFile, setImageFile] = useState(null);
const [imagePreview, setImagePreview] = useState(null);
const [confirmPassword, setConfirmPassword] = useState("");
const [errors, setErrors] = useState({});
const handleChange = (e) => {
  const { name, value } = e.target;
    if (name === "countryCode") {
    setFormData((prev) => ({
      ...prev,
      countryCode: value,
      telephone: value + (prev.telephone.replace(/^(\+\d+)?/, "")), 
    }));
  } else if (name === "telephone") {
    setFormData((prev) => ({
      ...prev,
      telephone: prev.countryCode + value.replace(/^(\+\d+)?/, ""), 
    }));
  } else {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
  setFormData({ ...formData, [name]: value });

  // Effacer l'erreur de ce champ s'il y a une valeur
  if (value.trim()) {
    setErrors((prevErrors) => {
      const { [name]: removed, ...rest } = prevErrors;
      return rest;
    });
  }
};
  const handleNext = () => {
    if (step < steps.length - 1) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const requiredFieldsPerStep = {
    1: [
      "nom",
      "email",
      "telephone",
      "password",
      "description",
      ...(accountType === "personne" ? ["cin"] : ["rne", "raisonSociale"]),
    ],
    2: ["rue", "ville", "pays"],
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
if (formData.password !== confirmPassword) {
  alert("Les mots de passe ne correspondent pas.");
  setLoading(false);
  return;
}
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailRegex.test(formData.email)) {
  alert("Email non valide");
  setLoading(false);
  return;
}

if (!imageFile) {
  alert("Veuillez sélectionner un logo.");
  return;
}
    // Check acceptance of terms
    if (!isChecked) {
      alert("Veuillez accepter les conditions.");
      return;
    }
const missing =
  requiredFieldsPerStep[step]?.filter(
    (key) => !formData[key] || !formData[key].trim()
  ) || [];

if (missing.length > 0) {
  const newErrors = {};
  missing.forEach((field) => {
    newErrors[field] = "Ce champ est requis.";
  });
  setErrors(newErrors); // <-- mise à jour des erreurs
  alert("Veuillez remplir tous les champs obligatoires.");
  return;
}

    try {
      const businessData = {
        nom: formData.nom,
        phone: formData.countryCode + formData.telephone ,
        email: formData.email,
        rne: formData.rne,
        rs: formData.raisonSociale,
        description: formData.description,
        adresse: formData.rue,
        ville: formData.ville,
        pays: formData.pays,
        latitude: position[0],
        longitude: position[1],
        role: accountType === "pro" ? "ENTREPRISE" : "VENDEUR",
        type: accountType,
        password: formData.password,
        facebook: formData.facebook,
        instagram: formData.instagram,
        tiktok: formData.tiktok,
      };

      const res = await axios.post(
        "https://waw.com.tn/api/api/business",
        businessData
      );
      const createdBusiness = res.data;

      if (imageFile) {
        const formImageData = new FormData();
        formImageData.append("image", imageFile);

        await axios.post(
          `https://waw.com.tn/api/api/business/${createdBusiness.id}/upload-image`,
          formImageData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }
alert("Votre inscription a bien été enregistrée. Elle sera traitée dans les plus brefs délais par notre équipe, qui ne manquera pas de vous contacter prochainement.");
setModalOpenpartenaire(false);

    } catch (error) {
      console.error("Erreur lors de l'inscription :", error);
const message = error.response?.data || "Erreur lors de la création du compte.";
  alert(message);

      }
  };

  const markerIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  const LocationSelector = ({ position, setPosition, setFormData }) => {
    useMapEvents({
      click: async (e) => {
        const { lat, lng } = e.latlng;
        setPosition([lat, lng]);
        try {
          const res = await axios.get(
            "https://nominatim.openstreetmap.org/reverse",
            {
              params: { lat, lon: lng, format: "json", addressdetails: 1 },
            }
          );
          const addr = res.data.address || {};
          const rue = res.data.display_name || "";
          const ville = addr.state || addr.state_district || "";
          const pays = addr.country || "";
          setFormData((prev) => ({ ...prev, rue, ville, pays }));
        } catch (err) {
          console.error("Reverse geocoding error:", err);
        }
      },
    });
    return position ? <Marker position={position} icon={markerIcon} /> : null;
  };

  const handleSearch = async () => {
    if (!searchQuery) return;
    try {
      const response = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
          params: { q: searchQuery, format: "json", addressdetails: 1 },
        }
      );
      if (response.data.length > 0) {
        const { lat, lon, display_name, address } = response.data[0];
        setPosition([parseFloat(lat), parseFloat(lon)]);
        const rue = display_name;
        const ville = address.city || address.town || address.village || "";
        const pays = address.country || "";
        setFormData((prev) => ({ ...prev, rue, ville, pays }));
      }
    } catch (error) {
      console.error("Geocoding search failed:", error);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);
          setGeoError(null);
        },
        (err) => setGeoError("Géolocalisation désactivée ou refusée."),
        { timeout: 10000 }
      );
    }
  }, []);



    const [hoveredCategory, setHoveredCategory] = useState(null);
      const [clickedCategory, setClickedCategory] = useState(null);

  const handleClick = (cat) => {
    setClickedCategory(clickedCategory?.name === cat.name ? null : cat);
  };

  const activeCategory = clickedCategory || hoveredCategory;
  const [modalOpensignin, setModalOpensignin] = useState(false);
    const [modalOpenpartenaire, setModalOpenpartenaire] = useState(false);

    const [error, setError] = useState(null);
      const [successMessage, setSuccessMessage] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOpensignin = () => {
    setModalOpensignin(true);
  };
    const handleOpenpartenaire = () => {
    setModalOpenpartenaire(true);
  };
const handleLogin = async () => {
  setError(null);
  setSuccessMessage(null);
  setLoading(true);

  try {
    // 🔐 Tenter en tant qu'admin
    const resAdmin = await axios.post("https://waw.com.tn/api/api/admins/login", {
      email,
      password,
    });

    const admin = resAdmin.data;
    localStorage.setItem("adminId", admin.id);
    localStorage.setItem("adminemailId", admin.email);
    localStorage.setItem("activites", JSON.stringify(admin.activites || []));
    localStorage.setItem("banners", JSON.stringify(admin.banners || []));
    localStorage.setItem("categories", JSON.stringify(admin.categories || []));
    localStorage.setItem("events", JSON.stringify(admin.events || []));
    localStorage.setItem("reservations", JSON.stringify(admin.reservations || []));
    localStorage.setItem("role", admin.role);

    setSuccessMessage("Connexion admin réussie !");
    setTimeout(() => navigate("/admin/events"), 1000);
    return;
  } catch (adminErr) {
    // Échec admin : on essaie business
  }

  try {
    // 🔐 Tenter en tant que business
    const resBusiness = await axios.post("https://waw.com.tn/api/api/business/login", {
      email,
      password,
    });

    const business = resBusiness.data;
    localStorage.setItem("businessId", business.id);

    setSuccessMessage("Connexion vendeur réussie !");
    setTimeout(() => navigate("/vendeur/DashboradVendeur"), 1000);
    return;
  } catch (businessErr) {
    // Échec business : on essaie user
  }

  try {
    // 🔐 Tenter en tant que user
    const resUser = await axios.post("https://waw.com.tn/api/api/users/login", {
      email,
      password,
    });

    const user = resUser.data;
    localStorage.setItem("userId", user.id);

    setSuccessMessage("Connexion utilisateur réussie !");
    setModalOpensignin(false);
    return;
  } catch (userErr) {
    setError("Erreur de connexion. Identifiants incorrects.");
  } finally {
    setLoading(false);
  }
};

  const [anchorEl, setAnchorEl] = useState(null);
  const [activitiesAnchorEl, setActivitiesAnchorEl] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const activitiesOpen = Boolean(activitiesAnchorEl);
  const [mobileOpenCategories, setMobileOpenCategories] = useState({});
  const [activityCategoriess, setActivityCategories] = useState([]);

  // 🔄 Charger les catégories dynamiquement depuis l'API
  useEffect(() => {
    fetch('https://waw.com.tn/api/api/categories')
      .then((res) => res.json())
      .then((data) => {
        setActivityCategories(data);

        // Initialiser les états d'ouverture pour chaque catégorie
        const initialState = {};
        data.forEach((cat) => {
          initialState[cat.nom] = false;
        });
        setMobileOpenCategories(initialState);
      })
      .catch((error) => {
        console.error('Erreur lors du chargement des catégories :', error);
      });
  }, []);

  const handleMobileCategoryToggle = (categoryName) => {
    setMobileOpenCategories((prev) => ({
      ...prev,
      [categoryName]: !prev[categoryName],
    }));
  };
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMobileOpenCategories({});
  };
  const [langAnchorEl, setLangAnchorEl] = useState(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);

  const openLangMenu = Boolean(langAnchorEl);
  const openProfileMenu = Boolean(profileAnchorEl);

  const handleLangClick = (event) => {
    setLangAnchorEl(event.currentTarget);
  };
  const handleLangClose = () => {
    setLangAnchorEl(null);
  };

  const handleProfileClick = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };
  const handleProfileClose = () => {
    setProfileAnchorEl(null);
  };
   const [open, setOpen] = useState(false);
  const [tab, setTab] = useState(1); // 0 = Langue, 1 = Devise

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };
    const navigate = useNavigate();

  const handleFavorites = () => {
    navigate('/wishlist');
  };
  const [drawerOpen, setDrawerOpen] = useState(false);
const toggleDrawer = (open) => (event) => {
  if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) return;
  setDrawerOpen(open);
};
const businessId = localStorage.getItem("businessId");
const [image, setImage] = useState(null);
useEffect(() => {
  if (!businessId) return;

  axios
    .get(`https://waw.com.tn/api/api/business/${businessId}`)
    .then((res) => {
      const data = res.data;

      if (data.imageUrl) {
        const fullImageUrl = data.imageUrl.startsWith("http")
          ? data.imageUrl
          : `https://waw.com.tn/api${data.imageUrl}`;

        setImage(fullImageUrl);
        localStorage.setItem("businessImage", fullImageUrl); // Optionnel pour reuse ailleurs
      }
    })
    .catch((err) => {
      console.error("Erreur chargement image de profil:", err);
    });
}, [businessId]);
  return (
    <>
    <AppBar
      position="static"
      sx={{ backgroundColor: 'white', boxShadow: 'none', borderBottom: '1px solid #e0e0e0' }}
    >

      <Toolbar sx={{ gap: 0, minHeight: '64px !important', px: { xs: 2, lg: 3 } }}>
      <Box component="a" href="/" sx={{ display: 'flex', alignItems: 'center', mr: 2, py: '2px' }}>
 
  <Box
    component="img"
    src="logo/waw.png" // ⬅️ Replace with your actual image path
    alt="Logo"
    sx={{
      height: 80,
      width: 'auto',
    }}
  />
</Box>

          <Box sx={{ display: 'flex', alignItems: 'stretch', flexGrow: 1 }}>
            <Box sx={{ position: 'relative' }}>
              <Button
                color="inherit"
                onClick={(e) => setActivitiesAnchorEl(activitiesAnchorEl ? null : e.currentTarget)}
                sx={{
                  fontWeight: 'normal',
                  color: 'white',
                  textTransform: 'none',
                  borderRadius: "20px",
                  alignItems: 'center',
                    background: '#181AD6',
                  gap: 1,
                  padding:"10px 20px"

                }}
              >                    <Link
        to={`/decouvrir`}
        style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}
        onClick={toggleDrawer(false)}
      >
                Découvrir
                              </Link>

              </Button>

            </Box>
          </Box>
{!isMobile && (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>

{/*     <IconButton onClick={handleOpen} aria-label="Ouvrir sélection langue et devise">
                          
  <LanguageIcon />
    </IconButton> */}
    <div className="relative inline-block">
      <IconButton onClick={handleFavorites} aria-label="Voir favoris">
        <FavoriteIcon />
      </IconButton>
      {count > 0 && (
        <span className="absolute top-0 right-0 text-xs bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
          {count}
        </span>
      )}
    </div>

    {  !localStorage.getItem("userId") &&
  !localStorage.getItem("adminId") &&
  !localStorage.getItem("businessId") && (
<>
<ButtonNav onClick={handleOpensignin}>Se connecter</ButtonNav>
<GradientBorderButtonWrapper>
  <GradientBorderButton onClick={handleOpenUser}>S'inscrire</GradientBorderButton>
</GradientBorderButtonWrapper>
<ButtonNav2 onClick={handleOpenpartenaire}>Partenaire</ButtonNav2>
</>
)}

{localStorage.getItem("adminId") && (
  <>
    <IconButton
      id="profile-button-admin"
      aria-controls={openProfileMenu ? "profile-menu-admin" : undefined}
      aria-haspopup="true"
      aria-expanded={openProfileMenu ? "true" : undefined}
      onClick={handleProfileClick}
      sx={{
        p: 0.5,
        border: "1px solid #d9d9d9",
        borderRadius: "50%",
        transition: "box-shadow 0.3s ease",
        "&:hover": { boxShadow: "0 4px 10px #d9d9d9" },
      }}
      aria-label="Profil admin"
    >
      <Avatar
        src={localStorage.getItem("adminImage") || "/default-avatar.png"}
        alt="Admin"
        sx={{ width: 32, height: 32 }}
      />
    </IconButton>

    <Menu
      id="profile-menu-admin"
      anchorEl={profileAnchorEl}
      open={openProfileMenu}
      onClose={handleProfileClose}
      MenuListProps={{ "aria-labelledby": "profile-button-admin" }}
    >
      <MenuItem component={Link} to="/admin/events">Dashboard Admin</MenuItem>
      <MenuItem component={Link} to="/"
        onClick={() => {
          localStorage.clear();
          handleProfileClose();
        }}
      >
        Se déconnecter
      </MenuItem>
    </Menu>
  </>
)}

{localStorage.getItem("userId") && (
  <>
    <IconButton
      id="profile-button-user"
      aria-controls={openProfileMenu ? "profile-menu-user" : undefined}
      aria-haspopup="true"
      aria-expanded={openProfileMenu ? "true" : undefined}
      onClick={handleProfileClick}
      sx={{
        p: 0.5,
        border: "1px solid #d9d9d9",
        borderRadius: "50%",
        transition: "box-shadow 0.3s ease",
        "&:hover": { boxShadow: "0 4px 10px #d9d9d9" },
      }}
      aria-label="Profil user"
    >
      <Avatar
        src={localStorage.getItem("userImage") || "/default-avatar.png"}
        alt="User"
        sx={{ width: 32, height: 32 }}
      />
    </IconButton>

    <Menu
      id="profile-menu-user"
      anchorEl={profileAnchorEl}
      open={openProfileMenu}
      onClose={handleProfileClose}
      MenuListProps={{ "aria-labelledby": "profile-button-user" }}
    >
      <MenuItem component={Link} to="/moncompte">Mon Profil</MenuItem>
      <MenuItem component={Link} to="/mesreservations">Mes Réservations</MenuItem>
      <MenuItem component={Link} to="/"
        onClick={() => {
          localStorage.clear();
          handleProfileClose();
        }}
      >
        Se déconnecter
      </MenuItem>
    </Menu>
  </>
)}
{localStorage.getItem("businessId") && (
  <>
    <IconButton
      id="profile-button-user"
      aria-controls={openProfileMenu ? "profile-menu-user" : undefined}
      aria-haspopup="true"
      aria-expanded={openProfileMenu ? "true" : undefined}
      onClick={handleProfileClick}
      sx={{
        p: 0.5,
        border: "1px solid #d9d9d9",
        borderRadius: "50%",
        transition: "box-shadow 0.3s ease",
        "&:hover": { boxShadow: "0 4px 10px #d9d9d9" },
      }}
      aria-label="Profil vendeur"
    >
      <Avatar
        src={localStorage.getItem("businessImage") || "/default-avatar.png"}
        alt="Business"
        sx={{ width: 32, height: 32 }}
      />
    </IconButton>

    <Menu
      id="profile-menu-admin"
      anchorEl={profileAnchorEl}
      open={openProfileMenu}
      onClose={handleProfileClose}
      MenuListProps={{ "aria-labelledby": "profile-button-admin" }}
    >
      <MenuItem component={Link} to="/vendeur/events">Dashboard vendeur</MenuItem>
      <MenuItem component={Link} to="/"
        onClick={() => {
          localStorage.clear();
          handleProfileClose();
        }}
      >
        Se déconnecter
      </MenuItem>
    </Menu>
  </>
)}

  </Box>
)}

{isMobile && (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end', // aligne tout à droite
      flexGrow: 1, // prend tout l'espace horizontal
    }}
  >
        <div className="relative inline-block">
      <IconButton onClick={handleFavorites} aria-label="Voir favoris">
        <FavoriteIcon />
      </IconButton>
      {count > 0 && (
        <span className="absolute top-0 right-0 text-xs bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
          {count}
        </span>
      )}
    </div>
        {  !localStorage.getItem("userId") &&
  !localStorage.getItem("adminId") &&
  !localStorage.getItem("businessId") && (
<>
    <IconButton
      id="profile-button"
      aria-controls={openProfileMenu ? 'profile-menu' : undefined}
      aria-haspopup="true"
      aria-expanded={openProfileMenu ? 'true' : undefined}
      onClick={handleProfileClick}
      sx={{
        p: 0.5,
        border: '1px solid #d9d9d9',
        borderRadius: '25%',
        transition: 'box-shadow 0.3s ease',
        '&:hover': { boxShadow: '0 4px 10px #d9d9d9' },
      }}
      aria-label="Profil"
    >
      <KeyboardArrowDownIcon />
    </IconButton>

    <Menu
      id="profile-menu"
      anchorEl={profileAnchorEl}
      open={openProfileMenu}
      onClose={handleProfileClose}
      MenuListProps={{ 'aria-labelledby': 'profile-button' }}
    >
      <MenuItem onClick={handleOpensignin}>Se connecter</MenuItem>
      <MenuItem onClick={handleOpenUser}>S'inscrire</MenuItem>
      <MenuItem onClick={handleOpenpartenaire}>Partenaire</MenuItem>
    </Menu>
    </>
    )}
    {localStorage.getItem("userId") && (
  <>
    <IconButton
      id="profile-button-user"
      aria-controls={openProfileMenu ? "profile-menu-user" : undefined}
      aria-haspopup="true"
      aria-expanded={openProfileMenu ? "true" : undefined}
      onClick={handleProfileClick}
      sx={{
        p: 0.5,
        border: "1px solid #d9d9d9",
        borderRadius: "50%",
        transition: "box-shadow 0.3s ease",
        "&:hover": { boxShadow: "0 4px 10px #d9d9d9" },
      }}
      aria-label="Profil user"
    >
      <Avatar
        src={localStorage.getItem("userImage") || "/default-avatar.png"}
        alt="User"
        sx={{ width: 32, height: 32 }}
      />
    </IconButton>

    <Menu
      id="profile-menu-user"
      anchorEl={profileAnchorEl}
      open={openProfileMenu}
      onClose={handleProfileClose}
      MenuListProps={{ "aria-labelledby": "profile-button-user" }}
    >
      <MenuItem component={Link} to="/moncompte">Mon Profil</MenuItem>
      <MenuItem component={Link} to="/mesreservations">Mes Réservations</MenuItem>
      <MenuItem component={Link} to="/"
        onClick={() => {
          localStorage.clear();
          handleProfileClose();
        }}
      >
        Se déconnecter
      </MenuItem>
    </Menu>
  </>
)}
    {localStorage.getItem("adminId") && (
  <>
    <IconButton
      id="profile-button-admin"
      aria-controls={openProfileMenu ? "profile-menu-admin" : undefined}
      aria-haspopup="true"
      aria-expanded={openProfileMenu ? "true" : undefined}
      onClick={handleProfileClick}
      sx={{
        p: 0.5,
        border: "1px solid #d9d9d9",
        borderRadius: "50%",
        transition: "box-shadow 0.3s ease",
        "&:hover": { boxShadow: "0 4px 10px #d9d9d9" },
      }}
      aria-label="Profil admin"
    >
      <Avatar
        src={localStorage.getItem("adminImage") || "/default-avatar.png"}
        alt="Admin"
        sx={{ width: 32, height: 32 }}
      />
    </IconButton>

    <Menu
      id="profile-menu-admin"
      anchorEl={profileAnchorEl}
      open={openProfileMenu}
      onClose={handleProfileClose}
      MenuListProps={{ "aria-labelledby": "profile-button-admin" }}
    >
      <MenuItem component={Link} to="/admin/events">Dashboard Admin</MenuItem>
      <MenuItem component={Link} to="/"
        onClick={() => {
          localStorage.clear();
          handleProfileClose();
        }}
      >
        Se déconnecter
      </MenuItem>
    </Menu>
  </>
)}
        {localStorage.getItem("businessId") && (
  <>
    <IconButton
      id="profile-button-admin"
      aria-controls={openProfileMenu ? "profile-menu-admin" : undefined}
      aria-haspopup="true"
      aria-expanded={openProfileMenu ? "true" : undefined}
      onClick={handleProfileClick}
      sx={{
        p: 0.5,
        border: "1px solid #d9d9d9",
        borderRadius: "50%",
        transition: "box-shadow 0.3s ease",
        "&:hover": { boxShadow: "0 4px 10px #d9d9d9" },
      }}
      aria-label="Profil vendeur"
    >
      <Avatar
        src={localStorage.getItem("businessImage") || "/default-avatar.png"}
        alt="Business"
        sx={{ width: 32, height: 32 }}
      />
    </IconButton>

    <Menu
      id="profile-menu-admin"
      anchorEl={profileAnchorEl}
      open={openProfileMenu}
      onClose={handleProfileClose}
      MenuListProps={{ "aria-labelledby": "profile-button-admin" }}
    >
      <MenuItem component={Link} to="/vendeur/events">Dashboard vendeur</MenuItem>
      <MenuItem component={Link} to="/"
        onClick={() => {
          localStorage.clear();
          handleProfileClose();
        }}
      >
        Se déconnecter
      </MenuItem>
    </Menu>
  </>
)}
  </Box>
)}


      </Toolbar>
    </AppBar>
    <Modal open={open} onClose={handleClose} aria-labelledby="modal-language-currency" >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 600,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 2,
            borderRadius: 2,
          }}
        >

          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography id="modal-language-currency" variant="h6" component="h2">
              Langue et pays
            </Typography>
            <IconButton onClick={handleClose} aria-label="Fermer">
              <CloseIcon />
            </IconButton>
          </Box>

          <Tabs value={tab} onChange={handleTabChange} aria-label="Sélection onglet langue ou devise">
            <Tab label="Langue" />
            <Tab label="Devise" />
          </Tabs>

          {tab === 1 && (
            <Box mt={2} maxHeight={300} overflow="auto">
              {currencies.map(({ code, name, symbol }) => (
                <Button
                  key={code}
                  fullWidth
                  sx={{ justifyContent: 'space-between', mb: 1 }}
                >
                  <span>{name}</span>
                  <span>{code} - {symbol}</span>
                </Button>
              ))}
            </Box>
          )}

          {tab === 0 && (
            <Box mt={2}>
              {/* Ici tu peux mettre la liste des langues */}
              <Typography variant="body2" color="text.secondary">
                Liste des langues à implémenter...
              </Typography>
            </Box>
          )}
        </Box>
      </Modal>
<Modal
  isOpen={modalOpensignin}
  onClose={() => setModalOpensignin(false)}
className="max-w-[700px] p-6"
>

        <div className="space-y-4">
            <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="mb-5 sm:mb-8">
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
            Se connecter
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Entrez votre email et votre mot de passe pour vous connecter !
          </p>
        </div>

        {error && <div className="mb-4 text-sm text-red-600">{error}</div>}
        {successMessage && <div className="mb-4 text-sm text-green-600">{successMessage}</div>}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <Label>Email <span className="text-error-500">*</span></Label>
            <Input
              type="email"
              value={email}
              placeholder="info@gmail.com"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <Label>Mot de passe <span className="text-error-500">*</span></Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                placeholder="votre mot de passe"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
              >
                {showPassword ? (
                  <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                ) : (
                  <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                )}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Checkbox checked={isChecked} onChange={setIsChecked} />
              <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                Rester connecté ?
              </span>
            </div>
            <a
              href="/mot-de-passe-oublie"
              className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
            >
              Mot de passe oublié ?
            </a>
          </div>

          <Button
            className="w-full"
            size="sm"
onClick={(e) => handleLogin(e)}            disabled={loading}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </Button>
        </form>

        <div className="mt-5 text-center">
            <p className="text-sm font-normal text-gray-700 dark:text-gray-400">
              Vous n'avez pas de compte ?{" "}
<a
  className="text-brand-500 hover:text-brand-600 dark:text-brand-400 cursor-pointer"
  onClick={() => {
    setModalOpenUser(true);     
    setModalOpensignin(false); 
  }}
>
  Créer un compte
</a>
            </p>
        </div>
      </div>
    </div>
        </div>

      </Modal>
          <Modal isOpen={modalOpenpartenaire} onClose={() => setModalOpenpartenaire(false)} className="max-w-[700px] p-6">


        <div className="space-y-4">
   <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="mb-5 sm:mb-8">
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
            Créer un compte
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Demande d’inscription
          </p>
        </div>

        <div className="w-full max-w-xl mx-auto">
          <Stepper activeStep={step} alternativeLabel>
            {steps.map((stepData, index) => (
              <Step
                key={index}
                onClick={() => setStep(index)}
                sx={{ cursor: "pointer" }}
              >
                <StepLabel>{stepData.label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 0 && (
              <div className="grid grid-cols-2 gap-4">

                <Button
                  type="button"
                  onClick={() => {
                    setAccountType("pro");
                    handleNext();
                  }}
                    sx={{
                  fontWeight: 'normal',
                  color: 'white',
                  textTransform: 'none',
                  borderRadius: "20px",
                  alignItems: 'center',
                    background: 'linear-gradient(90deg, #181AD6 0%, #FF7900 100%)',
                  gap: 1,
  padding:"10px 20px"

                }}
                >
                  Personne Morale
                </Button>

                <Button
                  type="button"
                  onClick={() => {
                    setAccountType("personne");
                    handleNext();
                  }}
                    sx={{
                  fontWeight: 'normal',
                  color: 'white',
                  textTransform: 'none',
                  borderRadius: "20px",
                  alignItems: 'center',
                    background: 'linear-gradient(90deg, #181AD6 0%, #FF7900 100%)',
                  gap: 1,
  padding:"10px 20px"

                }}                >
                  Personne Physique
                </Button>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                                <div>
                  <Label>Logo<span className="text-error-500">*</span></Label>
<input
  type="file"
  accept="image/*"
  onChange={(e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  }}
    className="block w-full p-2 rounded border-2 border-[#FF7900] cursor-pointer"

/>
{imagePreview && (
  <img
    src={imagePreview}
    alt="Aperçu du logo"
    className="mt-2 max-h-32 rounded border border-gray-300"
  />
)}

                </div>
                <div>
                  <Label>Nom<span className="text-error-500">*</span></Label>
                  <Input
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    placeholder="Entrez votre nom"
                    required
                  />
                  {errors.nom && (
  <p className="mt-1 text-sm text-red-500">{errors.nom}</p>
)}
                </div>

                <div>
<Label>
  Téléphone<span className="text-error-500">*</span>
</Label>
<div className="flex">
<select
  name="countryCode"
  value={formData.countryCode}
  onChange={handleChange}
  className="w-32 sm:w-40  px-3 py-2 border rounded-l-md"
>
  <option value="+93">Afghanistan (+93)</option>
  <option value="+355">Albania (+355)</option>
  <option value="+213">Algeria (+213)</option>
  <option value="+376">Andorra (+376)</option>
  <option value="+244">Angola (+244)</option>
  <option value="+54">Argentina (+54)</option>
  <option value="+374">Armenia (+374)</option>
  <option value="+61">Australia (+61)</option>
  <option value="+43">Austria (+43)</option>
  <option value="+994">Azerbaijan (+994)</option>
  <option value="+973">Bahrain (+973)</option>
  <option value="+880">Bangladesh (+880)</option>
  <option value="+32">Belgium (+32)</option>
  <option value="+229">Benin (+229)</option>
  <option value="+591">Bolivia (+591)</option>
  <option value="+387">Bosnia & Herzegovina (+387)</option>
  <option value="+267">Botswana (+267)</option>
  <option value="+55">Brazil (+55)</option>
  <option value="+359">Bulgaria (+359)</option>
  <option value="+226">Burkina Faso (+226)</option>
  <option value="+257">Burundi (+257)</option>
  <option value="+855">Cambodia (+855)</option>
  <option value="+237">Cameroon (+237)</option>
  <option value="+1">Canada (+1)</option>
  <option value="+238">Cape Verde (+238)</option>
  <option value="+236">Central African Republic (+236)</option>
  <option value="+235">Chad (+235)</option>
  <option value="+56">Chile (+56)</option>
  <option value="+86">China (+86)</option>
  <option value="+57">Colombia (+57)</option>
  <option value="+243">Congo - Kinshasa (+243)</option>
  <option value="+242">Congo - Brazzaville (+242)</option>
  <option value="+506">Costa Rica (+506)</option>
  <option value="+385">Croatia (+385)</option>
  <option value="+53">Cuba (+53)</option>
  <option value="+357">Cyprus (+357)</option>
  <option value="+420">Czech Republic (+420)</option>
  <option value="+45">Denmark (+45)</option>
  <option value="+253">Djibouti (+253)</option>
  <option value="+1">Dominican Republic (+1)</option>
  <option value="+593">Ecuador (+593)</option>
  <option value="+20">Egypt (+20)</option>
  <option value="+503">El Salvador (+503)</option>
  <option value="+240">Equatorial Guinea (+240)</option>
  <option value="+291">Eritrea (+291)</option>
  <option value="+372">Estonia (+372)</option>
  <option value="+251">Ethiopia (+251)</option>
  <option value="+358">Finland (+358)</option>
  <option value="+33">France (+33)</option>
  <option value="+241">Gabon (+241)</option>
  <option value="+220">Gambia (+220)</option>
  <option value="+995">Georgia (+995)</option>
  <option value="+49">Germany (+49)</option>
  <option value="+233">Ghana (+233)</option>
  <option value="+30">Greece (+30)</option>
  <option value="+502">Guatemala (+502)</option>
  <option value="+224">Guinea (+224)</option>
  <option value="+245">Guinea-Bissau (+245)</option>
  <option value="+509">Haiti (+509)</option>
  <option value="+504">Honduras (+504)</option>
  <option value="+852">Hong Kong (+852)</option>
  <option value="+36">Hungary (+36)</option>
  <option value="+354">Iceland (+354)</option>
  <option value="+91">India (+91)</option>
  <option value="+62">Indonesia (+62)</option>
  <option value="+98">Iran (+98)</option>
  <option value="+964">Iraq (+964)</option>
  <option value="+353">Ireland (+353)</option>
  <option value="+39">Italy (+39)</option>
  <option value="+81">Japan (+81)</option>
  <option value="+962">Jordan (+962)</option>
  <option value="+7">Kazakhstan (+7)</option>
  <option value="+254">Kenya (+254)</option>
  <option value="+965">Kuwait (+965)</option>
  <option value="+961">Lebanon (+961)</option>
  <option value="+218">Libya (+218)</option>
  <option value="+370">Lithuania (+370)</option>
  <option value="+352">Luxembourg (+352)</option>
  <option value="+853">Macao (+853)</option>
  <option value="+261">Madagascar (+261)</option>
  <option value="+265">Malawi (+265)</option>
  <option value="+60">Malaysia (+60)</option>
  <option value="+223">Mali (+223)</option>
  <option value="+356">Malta (+356)</option>
  <option value="+222">Mauritania (+222)</option>
  <option value="+230">Mauritius (+230)</option>
  <option value="+52">Mexico (+52)</option>
  <option value="+212">Morocco (+212)</option>
  <option value="+258">Mozambique (+258)</option>
  <option value="+95">Myanmar (+95)</option>
  <option value="+264">Namibia (+264)</option>
  <option value="+977">Nepal (+977)</option>
  <option value="+31">Netherlands (+31)</option>
  <option value="+64">New Zealand (+64)</option>
  <option value="+505">Nicaragua (+505)</option>
  <option value="+227">Niger (+227)</option>
  <option value="+234">Nigeria (+234)</option>
  <option value="+47">Norway (+47)</option>
  <option value="+968">Oman (+968)</option>
  <option value="+92">Pakistan (+92)</option>
  <option value="+970">Palestine (+970)</option>
  <option value="+507">Panama (+507)</option>
  <option value="+51">Peru (+51)</option>
  <option value="+63">Philippines (+63)</option>
  <option value="+48">Poland (+48)</option>
  <option value="+351">Portugal (+351)</option>
  <option value="+974">Qatar (+974)</option>
  <option value="+40">Romania (+40)</option>
  <option value="+7">Russia (+7)</option>
  <option value="+250">Rwanda (+250)</option>
  <option value="+966">Saudi Arabia (+966)</option>
  <option value="+221">Senegal (+221)</option>
  <option value="+381">Serbia (+381)</option>
  <option value="+65">Singapore (+65)</option>
  <option value="+421">Slovakia (+421)</option>
  <option value="+386">Slovenia (+386)</option>
  <option value="+27">South Africa (+27)</option>
  <option value="+82">South Korea (+82)</option>
  <option value="+34">Spain (+34)</option>
  <option value="+94">Sri Lanka (+94)</option>
  <option value="+46">Sweden (+46)</option>
  <option value="+41">Switzerland (+41)</option>
  <option value="+963">Syria (+963)</option>
  <option value="+886">Taiwan (+886)</option>
  <option value="+255">Tanzania (+255)</option>
  <option value="+66">Thailand (+66)</option>
  <option value="+216">Tunisia (+216)</option>
  <option value="+90">Turkey (+90)</option>
  <option value="+256">Uganda (+256)</option>
  <option value="+380">Ukraine (+380)</option>
  <option value="+971">United Arab Emirates (+971)</option>
  <option value="+44">United Kingdom (+44)</option>
  <option value="+1">United States (+1)</option>
  <option value="+598">Uruguay (+598)</option>
  <option value="+998">Uzbekistan (+998)</option>
  <option value="+58">Venezuela (+58)</option>
  <option value="+84">Vietnam (+84)</option>
  <option value="+967">Yemen (+967)</option>
  <option value="+260">Zambia (+260)</option>
  <option value="+263">Zimbabwe (+263)</option>
</select>

  <Input
    type="number"
    name="telephone"
    value={formData.telephone}
    onChange={handleChange}
    placeholder="Entrez votre numéro"
    required
    className="rounded-l-none"
  />
</div>

                  {errors.nom && (
  <p className="mt-1 text-sm text-red-500">{errors.telephone}</p>
)}
                </div>

                <div>
                  <Label>Email<span className="text-error-500">*</span></Label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Entrez votre email"
                    required
                  />
                </div>

                {accountType === "personne" && (
                  <div>
                    <Label>CIN<span className="text-error-500">*</span></Label>
                    <Input
                      type="text"
                      name="cin"
                      value={formData.cin}
                      onChange={handleChange}
                      placeholder="Entrez votre CIN"
                      required
                    />
                  </div>
                )}

                {accountType === "pro" && (
                  <>
                    <div>
                      <Label>RNE<span className="text-error-500">*</span></Label>
                      <Input
                        type="text"
                        name="rne"
                        value={formData.rne}
                        onChange={handleChange}
                        placeholder="Entrez votre RNE"
                        required
                      />
                    </div>
                    <div>
                      <Label>Raison sociale<span className="text-error-500">*</span></Label>
                      <Input
                        type="text"
                        name="raisonSociale"
                        value={formData.raisonSociale}
                        onChange={handleChange}
                        placeholder="Entrez votre raison sociale"
                        required
                      />
                    </div>
                  </>
                )}

                <div>
                  <Label>Mot de passe<span className="text-error-500">*</span></Label>
                  <div className="relative">
                    <Input
                      placeholder="Entrez votre mot de passe"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                </div>
<div>
  <Label>Confirmer le mot de passe <span className="text-error-500">*</span></Label>
  <div className="relative">
    <Input
      type={showPassword ? "text" : "password"}
      value={confirmPassword}
      placeholder="confirmez votre mot de passe"
      onChange={(e) => setConfirmPassword(e.target.value)}
      required
    />
    <span
      onClick={() => setShowPassword(!showPassword)}
      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
    >
      {showPassword ? (
        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
      ) : (
        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
      )}
    </span>
  </div>
</div>
                <div>
                  <Label>Description</Label>
                  <Input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Décrivez votre activité"
                    required
                  />
                </div>
                                <div>
                  <Label>Lien de facebook</Label>
                  <Input
                    type="text"
                    name="facebook"
                    value={formData.facebook}
                    onChange={handleChange}
                    placeholder="facebook"
                    required
                  />
                </div>
                                <div>
                  <Label>Lien de instagram</Label>
                  <Input
                    type="text"
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleChange}
                    placeholder="instagram"
                    required
                  />
                </div>
                                <div>
                  <Label>Lien de tiktok</Label>
                  <Input
                    type="text"
                    name="tiktok"
                    value={formData.tiktok}
                    onChange={handleChange}
                    placeholder="tiktok"
                    required
                  />
                </div>

                <div className="flex justify-between">
                  <Button
                    type="button"
                    sx={{
                  fontWeight: 'normal',
                  color: 'white',
                  textTransform: 'none',
                  borderRadius: "20px",
                  alignItems: 'center',
                    background: 'linear-gradient(90deg, #181AD6 0%, #FF7900 100%)',
                  gap: 1,
  padding:"10px 40px"

                }}                    onClick={handleBack}
                  >
                    Retour
                  </Button>
                  <Button
                    type="button"
                    sx={{
                  fontWeight: 'normal',
                  color: 'white',
                  textTransform: 'none',
                  borderRadius: "20px",
                  alignItems: 'center',
                    background: 'linear-gradient(90deg, #181AD6 0%, #FF7900 100%)',
                  gap: 1,
  padding:"10px 40px"

                }}                    onClick={handleNext}
                  >
                    Suivant
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <Input
                  fullWidth
                  placeholder="Rechercher une ville ou une adresse (ex : Hammamet)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <center>
                <Button
                  type="button"
                    onClick={async () => {
    await handleSearch();
    setFromSearchVendeur(true);
  }}
                    sx={{
                  fontWeight: 'normal',
                  color: 'white',
                  textTransform: 'none',
                  borderRadius: "20px",
                  alignItems: 'center',
                    background: 'linear-gradient(90deg, #181AD6 0%, #FF7900 100%)',
                  gap: 1,
  padding:"10px 35%"

                }}                >
                  Rechercher
                </Button></center>
                <Box sx={{ height: 300 }}>
                  <MapContainer
                    center={position}
                    zoom={13}
                    style={{ height: "100%" }}
                        key={fromSearchVendeur ? `${position[0]}-${position[1]}` : undefined} 

                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <LocationSelector
                      position={position}
      setPosition={(pos) => {
        setPosition(pos);
        setFromSearchVendeur(false); // 🔹 clic manuel → pas de re-render complet
      }}
      setFormData={setFormData}
                    />
                  </MapContainer>
                </Box>
                        <Label>Adress : {formData.rue}</Label>
                <Label>Ville : {formData.ville}</Label>
        <Label>Pays : {formData.pays}</Label>
               
                {geoError && <Typography color="error">{geoError}</Typography>}
                <Typography variant="body2">
                  📍 {position[0].toFixed(5)} | {position[1].toFixed(5)}
                </Typography>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={isChecked}
                    onChange={() => setIsChecked(!isChecked)}
                  />
                  <span>J'accepte les conditions</span>
                </div>

                <div className="flex justify-between">
                  <Button
                    type="button"
                    sx={{
                  fontWeight: 'normal',
                  color: 'white',
                  textTransform: 'none',
                  borderRadius: "20px",
                  alignItems: 'center',
                    background: 'linear-gradient(90deg, #181AD6 0%, #FF7900 100%)',
                  gap: 1,
  padding:"10px 40px"

                }}                    onClick={handleBack}
                  >
                    Retour
                  </Button>
                  <Button
                    type="submit"
                    sx={{
                  fontWeight: 'normal',
                  color: 'white',
                  textTransform: 'none',
                  borderRadius: "20px",
                  alignItems: 'center',
                    background: 'linear-gradient(90deg, #181AD6 0%, #FF7900 100%)',
                  gap: 1,
  padding:"10px 40px"

                }}                  >
                    S'inscrire
                  </Button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
        </div>

      </Modal>
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
<AIChatButton />
      </>
  );
}

export default Navbar;
