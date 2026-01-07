import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from 'styled-components';import {
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
  ListItemText,Avatar,Modal, Tab, Tabs
} from '@mui/material';
import { Link } from "@mui/material";

import MenuIcon from '@mui/icons-material/Menu';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LanguageIcon from '@mui/icons-material/Language'; // icône globe (remplace svg custom)
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';
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
const activityCategories = [
  {
    name: "Activités Outdoor",
    subCategories: [
      "Randonnée (mer, montagne, forêt)",
      "Vélo / VTT / Trottinette",
      "Escalade",
      "Parcs d’accrobranche",
      "Plage & jeux extérieurs",
      "Activités nautiques (jet ski, kayak, paddle, snorkeling)",
      "Quad / buggy / 4x4",
      "Balade à cheval / dromadaire",
      "Tir à l’arc / paintball / airsoft",
      "Yoga ou sport en plein air",
      "Cinéma ou théâtre en plein air",
      "Croisière / promenade en mer",
      "Camping / bivouac",
      "Observation de la faune / coucher de soleil"
    ]
  },
  {
    name: "Activités Indoor",
    subCategories: [
      "Escape Game",
      "Salle de jeux / VR / simulation",
      "Ateliers créatifs (céramique, peinture, tissage)",
      "Cours de danse",
      "Cours de chant",
      "Massages / spa / hammam",
      "Théâtre, spectacles, concerts",
      "Jeux de société / quiz / café-jeux",
      "Ateliers culinaires",
      "Activités pour enfants en salle",
      "Activités artistiques (tatouage henné, maquillage)",
      "Karaoké",
      "Formations & masterclass",
      "Tous les Ateliers et les Workshops"
    ]
  },
  {
    name: "Excursions / Tours",
    subCategories: [
      "Visite guidée",
      "Guides",
      "Circuit culturel (ex. Carthage, Dougga, Kairouan)",
      "Food tour / street food tour",
      "Safari désert / montagne",
      "Croisière ou balade en mer",
      "Journée chez l’habitant",
      "Circuit nature",
      "Dégustations itinérantes (vin, huile, fromage..)",
      "Tour de street art",
      "Tour en tuk-tuk / calèche / bus touristique"
    ]
  },
  {
    name: "Sport",
    subCategories: [
      "Location terrain de sport",
      "Coach",
      "Cours de fitness / gym / musculation",
      "Boxe, MMA, self-défense",
      "Yoga",
      "Pilates",
      "Stretching",
      "Natation",
      "Danse sportive (zumba, salsa, bachata…)",
      "Football, basket, volley (activités de groupe)",
      "Sports nautiques (surf, kitesurf, wakeboard)",
      "Escalade, slackline",
      "Randonnée sportive",
      "Bootcamp & team building sportif",
      "Sport extrême",
      "Balade vélos",
      "Footing",
      "Associations Sportive"
    ]
  },
  {
    name: "Culture",
    subCategories: [
      "Visite de musée",
      "Événement",
      "Site historique",
      "Guide",
      "Spectacle traditionnel / théâtre / conte",
      "Calligraphie, artisanat, peinture",
      "Rencontre avec artistes / créateurs",
      "Projections cinéma + débat",
      "Club de lecture, slam ou poésie",
      "Festivals culturels",
      "Ateliers musique ou chant",
      "Découverte de rites, coutumes ou langues",
      "Cours de darbouka, oud",
      "Expo",
      "Street Art",
      "Jardin",
      "Architecture",
      "Pâtisserie",
      "Institutions culinaires"
    ]
  },
  {
    name: "Bien-être",
    subCategories: [
      "Massage",
      "Hammam",
      "Spa",
      "Yoga",
      "Méditation",
      "Breathwork",
      "Cours de développement personnel",
      "Retraite bien-être",
      "Digitale détox",
      "Cours de nutrition",
      "Coaching mental / gestion du stress",
      "Bains sonores",
      "Reiki",
      "Thérapies douces",
      "Balade méditative en forêt ou nature",
      "Journée hammam + brunch / relaxation"
    ]
  },
  {
    name: "Famille",
    subCategories: [
      "Ateliers parents-enfants",
      "Activités manuelles & jeux éducatifs",
      "Spectacles ou contes pour enfants",
      "Parc de jeux / trampoline / mini-golf",
      "Balade à poney ou à la ferme",
      "Journée plage + jeux encadrés",
      "Activités multi-générations (ex. cuisine, poterie)",
      "Fête d’anniversaire organisée",
      "Chasse au trésor ou escape game enfant",
      "Ateliers écologiques ou associatifs enfants"
    ]
  },
  {
    name: "Nature",
    subCategories: [
      "Randonnée guidée",
      "Jardin botanique / balade nature",
      "Bivouac / camping / glamping",
      "Observation des oiseaux / étoiles",
      "Activités en forêt (land art, sylvothérapie)",
      "Récolte et cueillette (plantes, olives)",
      "Eco-expériences (permaculture, compost, recyclage)",
      "Participation à des actions environnementales",
      "Apiculture, jardinage, potager bio"
    ]
  },
  {
    name: "Attractions",
    subCategories: [
      "Parc d’attraction",
      "Parc aquatique",
      "Zoo / aquarium",
      "Cinéma immersif",
      "Musée interactif",
      "Centre de réalité virtuelle",
      "Observation deck / rooftop view",
      "Lieux instagrammables",
      "Pass multi-activités",
      "Pass journalier",
      "Pass demi-journée"
    ]
  },
  {
    name: "Animaux de compagnie acceptés",
    subCategories: [
      "Balades nature avec chien",
      "Ateliers ou événements “pet friendly”",
      "Hôtels / restaurants acceptant les animaux",
      "Activités canines (dressage, agility)",
      "Séances photo avec animaux",
      "Visites d’expo ou jardins autorisant les animaux",
      "Séjours ou randonnées avec animaux de compagnie"
    ]
  },
  {
    name: "Adapté aux enfants",
    subCategories: [
      "Toutes les activités famille ci-dessus",
      "Adaptation d’ateliers adultes (ex. peinture, cuisine)",
      "Parcs, animaux, zoo",
      "Activités sensorielles pour petits",
      "Jeux d’eau, baby piscine",
      "Mini ferme ou ferme pédagogique",
      "Séances photo enfants",
      "Petits festivals ou spectacles doux"
    ]
  },
  {
    name: "Ateliers / Workshop",
    subCategories: [
      "Céramique / poterie",
      "Cuisine (pâtisserie, plats locaux…)",
      "Parfum & cosmétique naturel",
      "Peinture, calligraphie",
      "Tissage, couture",
      "Bijouterie artisanale",
      "Arts de la scène (impro, théâtre, voix)",
      "Écriture créative, slam",
      "Photographie",
      "Permaculture / jardinage",
      "Cours de musique"
    ]
  },
  {
    name: "Gastronomie",
    subCategories: [
      "Table d’hôte / chez l’habitant",
      "Food tour",
      "Cours de cuisine",
      "Dégustation huile d’olive / vin / miel / thé",
      "Soirée à thème culinaire (italien, syrien, tunisien…)",
      "Dîner spectacle",
      "Brunch / pique-nique",
      "Expérience gastronomique haut de gamme",
      "Bar à jus ou café slow food",
      "Repas immersif (dans le noir, avec musique, surprise…)",
      "Traiteur"
    ]
  },
  {
    name: "Expériences à la mer",
    subCategories: [
      "Jet-ski",
      "Bouée tractée / banane",
      "Ski nautique / wakeboard",
      "Paddle / kayak de mer",
      "Snorkeling / plongée",
      "Croisière en catamaran / bateau",
      "Balade en mer traditionnelle (felouque, barque)",
      "Pêche en mer",
      "Excursion vers des îles (Kuriat, Djerba, Kerkennah…)",
      "Baignade et plage privée",
      "Cours de surf / kitesurf / windsurf",
      "Yoga sur la plage / paddle yoga",
      "Dîner ou brunch sur la plage",
      "Cinéma ou concert en bord de mer",
      "Stand-up comedy / scène ouverte plage",
      "Photographie / shooting bord de mer",
      "Événement privé à la mer (EVJF, anniversaire, baby shower)",
      "Nettoyage de plage & éco-activisme"
    ]
  },
  {
    name: "Célébrations et Fêtes privées",
    subCategories: [
      "Anniversaires",
      "EVJF / EVG",
      "Baby shower",
      "Propositions de mariage",
      "Soirées privées à thème",
      "Décoration événementielle",
      "Afterworks et team building",
      "Cocktails & dîners privés"
    ]
  },
  {
    name: "Expériences exclusives & Premium",
    subCategories: [
      "Croisières privées",
      "Accès VIP à événements ou lieux",
      "Chef à domicile",
      "Spa privatif",
      "Dégustation haut de gamme",
      "Séjours de luxe",
      "Expériences sur-mesure",
      "Ateliers exclusifs avec experts"
    ]
  },
  {
    name: "Engagement citoyen & Impact social",
    subCategories: [
      "Ateliers éco-responsables",
      "Chantier participatif",
      "Visites d’associations",
      "Plogging (ramassage déchets en marchant)",
      "Recyclage créatif",
      "Projets communautaires",
      "Actions de sensibilisation environnementale"
    ]
  },
  {
    name: "Photo, Vidéo & Création digitale",
    subCategories: [
      "Shooting lifestyle / portraits",
      "Vidéo souvenir",
      "Ateliers TikTok / Reels",
      "Balade photo",
      "Studio création digitale",
      "Montage photo / vidéo",
      "Création de contenu pour réseaux sociaux",
      "Photographie événementielle"
    ]
  },
  {
    name: "Développement personnel & compétences",
    subCategories: [
      "Ateliers de communication (prise de parole, confiance en soi)",
      "Cours de leadership et management",
      "Coaching individuel ou en groupe",
      "Ateliers de créativité (design thinking, brainstorming)",
      "Compétences numériques (bureautique, codage, marketing digital)",
      "Cours de langues",
      "Gestion du temps et productivité",
      "Méditation guidée",
      "Intelligence émotionnelle",
      "Gestion du stress et bien-être mental",
      "Écriture et storytelling",
      "Assertivité et gestion des conflits",
      "Développement artistique",
      "Entrepreneuriat et création d’entreprise",
      "Organisation personnelle (minimalisme, méthode Marie Kondo)"
    ]
  }
];
const allActivities = [
  "4 x 4", "Accrobranches", "Agritourisme", "Alpinisme", "Animation", "Antiquités",
  "Aquabike", "Aquarium", "Archéologie", "Art floral", "Arts du spectacle", "Arts martiaux",
  "Arts plastiques", "Astrologie", "Astronomie", "Ateliers travaux manuels", "Athlétisme",
  "Avion (transport)", "Aviron", "Badminton", "Bains d'eaux chaudes sulfureuses",
  "Balade ou veillée contée", "Ballon captif", "Balnéothérapie", "Bar à thème", "Basket",
  "Bateau à moteur", "Bateau électrique", "Bateaux promenade", "Beach Volley",
  "Bibliothèque / Médiathèque", "Bicross", "Big Foot", "Bijouterie", "Billard", "Bodyboard",
  "Botanique", "Bouée tractée", "Bowling", "Boxe", "Bricolage", "Brocante", "Buggy",
  "Bun J Ride", "Bus touristique", "Cabaret", "Cable car", "Calligraphie", "Canoé kayak",
  "Canoraft", "Canyoning", "Carnaval", "Cascade de glace", "Casino / Jeux", "Catamaran",
  "Centre aquatique", "Centre de loisirs", "Céramique", "Cerf volant", "Chant et chorale",
  "Chantiers de restauration", "Char à voile", "Chasse", "Château", "Chiens de traineau",
  "Chute libre", "Cinéastes amateurs / vidéo", "Cinéma", "Circuit / Route touristique",
  "Circuit auto moto", "Cirque", "Cirque / mime / magie", "Citadelle, remparts",
  "Club de plage", "Colombophilie", "Compétition sportive", "Concert", "Concours",
  "Conduite sur glace", "Conférence", "Congrès", "Construction igloo", "Contes et Légendes",
  "Cours de cuisine", "Cours de langue", "Cours de musique", "Course d'orientation",
  "Cybercafé", "Danse", "Deltaplane", "Dériveur", "Descente de tyrolienne",
  "Descente en rappel", "DevalKart", "Développement personnel", "Discothèque",
  "Donjon, tour, beffroi", "Drones", "Ecriture / lecture / poésie", "Edifice religieux",
  "Equitation", "Escalade", "Escape Game", "Escrime", "Événement sportif", "Excursions",
  "Exposition", "Fatbike", "Faune - flore", "Ferme pédagogique", "Ferronnerie-fonderie",
  "Festival", "Fest-Noz", "Fitness", "Fléchettes", "Flyboard", "Foire", "Football",
  "Freeride", "Galerie", "Gastronomie", "Généalogie", "Géologie", "Golf", "Gymnastique",
  "Hammam", "Handball", "Hélicoptère (transport)", "Hippodrome", "Hobbie Cat",
  "Hockey sur gazon", "Hockey sur glace", "Hors-Bord", "Hot-dog (rafting)", "Hydravion",
  "Hydrospeed", "Jet ski / Flyboard", "Jeux de société", "Jeux pour enfants",
  "Jeux stratégiques", "Karting", "Kayak de mer", "Kite-surf", "Labyrinthe",
  "Lac et plan d'eau", "Laser Game", "Location de matériel", "Location de vélos",
  "Location de voitures", "Loisirs 3ème âge", "Loto", "Ludothèque", "Luge", "Manade",
  "Maquettes - aéromodélisme", "Marché", "Marché d'art", "Marche nordique", "Massage",
  "Méditation", "Meeting", "Mini golf", "Monoski", "Montgolfière", "Moto", "Moto-cross",
  "Motoneige", "Mountain Board", "Multimédia", "Multisport", "Musculation", "Musée",
  "Natation", "Nautisme", "Navette", "Oenologie", "Opéra", "Paddle-yoga", "Padel",
  "Paint ball", "Parachute Ascensionnel", "Parachutisme", "Parapente", "Parapente hiver",
  "Parc d'attractions", "Parc Jeux gonflables", "Parcours Aventure", "Parcours de Santé",
  "Parcs à Thème", "Patinage", "Pêche", "Peintures & Arts Graphiques", "Pelote basque",
  "Philatélie", "Photographie", "Pièce de théâtre", "Pilates", "Pilotage aérien / Baptême de l'air",
  "Ping-pong", "Pirogue", "Piscine", "Piste de luge / bobsleigh", "Plage surveillée",
  "Planche à voile", "Planeur", "Plongée", "Polo", "Poney", "Porcelaine", "Port de plaisance",
  "Poterie", "Quad", "Rafting", "Randonnée avec âne", "Randonnée équestre", "Randonnée pédestre",
  "Raquettes", "Reliure et encadrements", "Remise en forme", "Retraites spirituelles", "Roller",
  "Rugby", "Salle de jeux", "Salon", "Saut à l'élastique", "Scooter de neige", "Scooter de mer",
  "Sculpture", "Segway - Gyropode", "Service Touristique", "Shopping", "Skate", "Skate électrique",
  "Ski alpin", "Ski de fond", "Ski de randonnée", "Ski d'été", "Ski nautique / Wakeboard",
  "Ski-joering", "Skwal", "Sky fly", "Snake-gliss", "Snorkeling", "Snow kite",
  "Sorties Cheval & Calèche", "Sorties de nuit", "Sorties photographiques", "Spa", "Spectacle",
  "Speed Sail", "Speedle Snow", "Spéléologie", "Sport équestre", "Sports à voile",
  "Sports d'hiver", "Squash", "Stage Aventure", "Stand-up Paddle", "Stretching", "Surf",
  "Surf des neiges", "Taxi", "Taxi Boat", "Téléphérique", "Téléphérique touristique",
  "Téléski nautique", "Tennis", "Thalassothérapie", "Théâtre", "Théâtre de rue", "Thermes",
  "Tir", "Tir à l'arc", "Tissage", "Trail Running", "Train touristique",
  "Transport en autocar - bus - van", "Transport maritime", "Travail du bois",
  "Travail du cuir", "Travail du tissu", "Trial", "Trimaran", "Trottinette électrique",
  "Tubing", "Twirling", "ULM", "Vannerie", "Vélotaxi", "Verrerie", "Via Cordata",
  "Via ferrata", "Vide-grenier", "Vin - oenologie", "Visites", "Visites à la ferme",
  "Visites Studios TV & films", "Voile", "Voilier", "Voitures", "Vol à voile", "Volley ball",
  "Voltige aérienne", "Water-polo", "Wave-ski", "Wellness", "Yoga / Qigong", "Yooner",
  "Zoo - Parc animalier"
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
function Navbar() {
    const [hoveredCategory, setHoveredCategory] = useState(null);
      const [clickedCategory, setClickedCategory] = useState(null);

  const handleClick = (cat) => {
    setClickedCategory(clickedCategory?.name === cat.name ? null : cat);
  };

  const activeCategory = clickedCategory || hoveredCategory;

  const [anchorEl, setAnchorEl] = useState(null);
  const [activitiesAnchorEl, setActivitiesAnchorEl] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const activitiesOpen = Boolean(activitiesAnchorEl);
  const [mobileOpenCategories, setMobileOpenCategories] = useState({});
  const [activityCategoriess, setActivityCategories] = useState([]);

  // 🔄 Charger les catégories dynamiquement depuis l'API
  useEffect(() => {
    fetch('http://102.211.209.131:3011/api/categories')
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
    .get(`http://102.211.209.131:3011/api/business/${businessId}`)
    .then((res) => {
      const data = res.data;

      if (data.imageUrl) {
        const fullImageUrl = data.imageUrl.startsWith("http")
          ? data.imageUrl
          : `http://102.211.209.131:3011${data.imageUrl}`;

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

  {isMobile ? (
    <>
<Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
  <Box
    sx={{ width: 300 }}
    role="presentation"
    onKeyDown={toggleDrawer(false)}
  >
  </Box>
</Drawer>
</>
) : (
          <Box sx={{ display: 'flex', alignItems: 'stretch', flexGrow: 1 }}>
            <Box sx={{ position: 'relative' }}>
            </Box>
          </Box>
        )}
{!isMobile && (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
    <IconButton onClick={handleOpen} aria-label="Ouvrir sélection langue et devise">
      <LanguageIcon />
    </IconButton>

    <IconButton onClick={handleFavorites} aria-label="Voir favoris">
      <FavoriteIcon />
    </IconButton>

    {localStorage.getItem("businessId") ? (
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
            borderRadius: '50%',
            transition: 'box-shadow 0.3s ease',
            '&:hover': { boxShadow: '0 4px 10px #d9d9d9' },
          }}
          aria-label="Profil"
        >
<Avatar
  src={image || "/default-avatar.png"}
  alt="Profil"
  sx={{ width: 32, height: 32 }}
/>
        </IconButton>

        <Menu
          id="profile-menu"
          anchorEl={profileAnchorEl}
          open={openProfileMenu}
          onClose={handleProfileClose}
          MenuListProps={{ 'aria-labelledby': 'profile-button' }}
        >
          <MenuItem component={Link} href="/Backoffice/Dashboard">Dashboard</MenuItem>
          <MenuItem
            onClick={() => {
              localStorage.removeItem("businessId");
              localStorage.removeItem("businessImage");
              handleProfileClose();
              window.location.href = "/"; // redirection après logout
            }}
          >
            Se déconnecter
          </MenuItem>
        </Menu>
      </>
    ) : (
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
          <MenuItem component={Link} href="/login">Se connecter</MenuItem>
          <MenuItem component={Link} href="/inscrire2">S'inscrire</MenuItem>
          <MenuItem component={Link} href="/inscrire">S'inscrire en tant que vendeur</MenuItem>
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
      <MenuItem component={Link} href="/login">Se connecter</MenuItem>
      <MenuItem component={Link} href="/inscrire2">S'inscrire</MenuItem>
      <MenuItem component={Link} href="/inscrire">S'inscrire en tant que vendeur</MenuItem>

      <MenuItem>
        <IconButton onClick={handleOpen} aria-label="Ouvrir sélection langue et devise">
          <LanguageIcon />
        </IconButton>
        sélection langue et devise
      </MenuItem>

      <MenuItem component={Link} href="/wishlist">
        <IconButton onClick={handleFavorites} aria-label="Voir favoris">
          <FavoriteIcon />
        </IconButton>
        Favoris
      </MenuItem>
    </Menu>
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
      </>
  );
}

export default Navbar;
