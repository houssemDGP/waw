import React, { useState,useEffect } from "react";
import { useNavigate } from 'react-router-dom';

import {
  Tabs, Tab, Paper, Link,
  Box,
  CssBaseline,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  TextField,
  Button,
  Grid,
  MenuItem,
  FormControlLabel,
  Radio,
  RadioGroup,
  Autocomplete,
  Chip,
  IconButton,FormControl,
  Stack ,FormHelperText
} from "@mui/material";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { Stepper, Step, StepLabel } from "@mui/material";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import EventIcon from "@mui/icons-material/Event";
import HomeIcon from "@mui/icons-material/Home";
import DeleteIcon from "@mui/icons-material/Delete";
import SideBar from "./SideBar";

// New imports for the map functionality
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS
import L from 'leaflet';
import axios from "axios";
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
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
const drawerWidth = 240;

export default function AddActivityPage() {
    const [formData, setFormData] = useState({
    rue: "",
    ville: "",
    pays: "",
  });
  const [tabValue, setTabValue] = useState(0);
  const [services, setServices] = useState(['Animation groupe', 'Location de matériel', 'Rafraîchissements', 'Stand-up Paddle']);
  const [equipment, setEquipment] = useState(['Douche', 'Bar', 'Parking privé', 'Piscine', 'WC publics', 'Restaurant']);
const [scheduleRanges, setScheduleRanges] = useState([
  {
    startDate: '',
    endDate: '',
    dailySchedules: [
      {
        startTime: '',
        endTime: '',
        formulas: [
          {
            label: '',
            price: 0,
            capacity: 0
          }
        ]
      }
    ]
  }
]);

const [openSnackbar, setOpenSnackbar] = useState(false);

const handleCloseSnackbar = (event, reason) => {
  if (reason === 'clickaway') return;
  setOpenSnackbar(false);
};
  const [equipmentToBring, setEquipmentToBring] = useState([]);
  const [newEquipment, setNewEquipment] = useState('');
  const [newDocument, setNewDocument] = useState('');

  // New states for the map search and position
  const [position, setPosition] = useState([36.8065, 10.1815]); // Default to Tunis, Tunisia
  const [searchQuery, setSearchQuery] = useState("");

  const handleTabChange = (e, newValue) => {
    setTabValue(newValue);
  };

  const handleServiceAdd = (event, newValue) => {
    if (newValue && !services.includes(newValue)) {
      setServices([...services, newValue]);
    }
  };

  const handleServiceDelete = (serviceToDelete) => () => {
    setServices((chips) => chips.filter((chip) => chip !== serviceToDelete));
  };

  const handleEquipmentAdd = (event, newValue) => {
    if (newValue && !equipment.includes(newValue)) {
      setEquipment([...equipment, newValue]);
    }
  };

  const handleEquipmentDelete = (equipmentToDelete) => () => {
    setEquipment((chips) => chips.filter((chip) => chip !== equipmentToDelete));
  };

const handleAddScheduleRange = () => {
  setScheduleRanges([
    ...scheduleRanges,
    {
      startDate: '',
      endDate: '',
      dailySchedules: [
        {
          startTime: '',
          endTime: '',
          formulas: [{ label: '', price: '', capacity: '' }],
        },
      ],
    },
  ]);
};


  const handleRemoveScheduleRange = (rangeIndex) => {
    const newRanges = scheduleRanges.filter((_, i) => i !== rangeIndex);
    setScheduleRanges(newRanges);
  };

const handleAddDailySchedule = (rangeIndex) => {
  const newRanges = [...scheduleRanges];
  newRanges[rangeIndex].dailySchedules.push({
    startTime: '',
    endTime: '',
    formulas: [{ label: '', price: '', capacity: '' }],
  });
  setScheduleRanges(newRanges);
};


  const handleRemoveDailySchedule = (rangeIndex, scheduleIndex) => {
    const newRanges = [...scheduleRanges];
    newRanges[rangeIndex].dailySchedules.splice(scheduleIndex, 1);
    setScheduleRanges(newRanges);
  };

  const handleDailyScheduleChange = (rangeIndex, scheduleIndex, field, value) => {
    const newRanges = [...scheduleRanges];
    newRanges[rangeIndex].dailySchedules[scheduleIndex][field] = value;
    setScheduleRanges(newRanges);
  };

  const handleDateRangeChange = (rangeIndex, field, value) => {
    const newRanges = [...scheduleRanges];
    newRanges[rangeIndex][field] = value;
    setScheduleRanges(newRanges);
  };
  
  const handleAddEquipment = () => {
    if (newEquipment.trim() !== '') {
      setEquipmentToBring([...equipmentToBring, newEquipment]);
      setNewEquipment('');
    }
  };

  const handleRemoveEquipment = (index) => {
    const updatedList = equipmentToBring.filter((_, i) => i !== index);
    setEquipmentToBring(updatedList);
  };


  // Function to handle the map search
  const handleSearch = async () => {
    if (!searchQuery) return;

    try {
      const response = await axios.get("https://nominatim.openstreetmap.org/search", {
        params: {
          q: searchQuery,
          format: "json",
          addressdetails: 1, // To get more detailed address info
          limit: 1, // Get only the best result
          countrycodes: 'tn' // Search within Tunisia (Qibilī, Kebili Governorate)
        },
      });

      if (response.data && response.data.length > 0) {
        const { lat, lon } = response.data[0];
        setPosition([parseFloat(lat), parseFloat(lon)]);
      } else {
        alert("Aucun résultat trouvé pour cette adresse.");
      }
    } catch (error) {
      console.error("Erreur de géocodage :", error);
      alert("Une erreur est survenue lors de la recherche.");
    }
  };
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
  const paymentOptions = ['Carte bancaire', 'Espèces', 'Virement', 'Chèque'];
  const availableServices = ['Animation groupe', 'Location de matériel', 'Rafraîchissements', 'Stand-up Paddle', 'Navette', 'Guide'];
  const availableEquipment = ['Douche', 'Bar', 'Parking privé', 'Piscine', 'WC publics', 'Restaurant', 'Vestiaire', 'Wifi'];
const availableLanguages = [
  'Français',
  'Anglais',
  'Espagnol',
  'Allemand',
  'Italien',
  'Portugais',
  'Néerlandais',
  'Arabe',
  'Chinois (Mandarin)',
  'Japonais',
  'Coréen',
  'Russe',
  'Turc',
  'Hindi',
  'Bengali',
  'Vietnamien',
  'Thaï',
  'Grec',
  'Polonais',
  'Suédois',
  'Norvégien',
  'Danois',
  'Finnois',
  'Tchèque',
  'Roumain',
  'Hongrois',
  'Hébreu',
  'Indonésien',
  'Malais',
  'Swahili',
  'Filipino (Tagalog)',
  'Ukrainien',
  'Persan (Farsi)',
  'Tamoul',
  'Ourdou',
  'Serbe',
  'Croate',
  'Slovaque',
  'Slovène',
  'Bulgare',
  'Lituanien',
  'Letton',
  'Estonien',
  'Islandais',
  'Basque',
  'Catalan',
  'Galicien'
];
const [step, setStep] = useState(0);


const steps = [
  { label: "Définir l'activité", optional: false },
  { label: "Choisir les catégories", optional: false },
  { label: "Position de l'événement", optional: false },
  { label: "Ajouter des images", optional: false },
  { label: "Ajouter des vidéos", optional: true },
  { label: "Ajouter horaires", optional: false },
  { label: "Ajouter inclus et extras", optional: true },
  { label: "Conditions d'accueil", optional: false },
];
  const handleBack = () => {
    setStep((prev) => prev - 1);
  };
const handleAddFormula = (rangeIndex, scheduleIndex) => {
  const updatedRanges = [...scheduleRanges];
  updatedRanges[rangeIndex].dailySchedules[scheduleIndex].formulas.push({
    label: '',
    price: '',
    capacity: '',
  });
  setScheduleRanges(updatedRanges);
};
const handleRemoveFormula = (rangeIndex, scheduleIndex, formulaIndex) => {
  const updatedRanges = [...scheduleRanges];
  updatedRanges[rangeIndex].dailySchedules[scheduleIndex].formulas.splice(formulaIndex, 1);
  setScheduleRanges(updatedRanges);
};
const handleFormulaChange = (rangeIndex, scheduleIndex, formulaIndex, field, value) => {
  const updatedRanges = [...scheduleRanges];
  updatedRanges[rangeIndex].dailySchedules[scheduleIndex].formulas[formulaIndex][field] = value;
  setScheduleRanges(updatedRanges);
};
const [activityName, setActivityName] = useState("");
  const [activityDescription, setActivityDescription] = useState("");
  const [mainActivity, setMainActivity] = useState("");
  const [categories, setCategories] = useState([]);
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("FRANCE");

  const [errors, setErrors] = useState({});

const validateStep = () => {
  let currentErrors = {};

  // Étape 0 : Définir l'activité
  if (step === 0) {
    if (!activityName?.trim()) {
      currentErrors.activityName = "Le nom de l'activité est requis.";
    }
    if (!activityDescription?.trim()) {
      currentErrors.activityDescription = "La description est requise.";
    }
  }

if (step === 1) {
  if (!activiteSelected) {
    currentErrors.activiteSelected = "Veuillez sélectionner une activité principale.";
  }

  if (!selectedCategories || selectedCategories.length === 0) {
    currentErrors.selectedCategories = "Veuillez sélectionner au moins une catégorie.";
  }
}
if (step === 2) {
  if (!formData.rue?.trim()) {
    currentErrors.rue = "L'adresse complète est requise.";
  }

  if (!formData.ville?.trim()) {
    currentErrors.ville = "La ville est requise.";
  }

  if (!formData.pays?.trim()) {
    currentErrors.pays = "Le pays est requis.";
  }

  if (!position || position.length !== 2 || isNaN(position[0]) || isNaN(position[1])) {
    currentErrors.position = "La position géographique est invalide.";
  }
}
if (step === 3) {
  if (!imagesFiles || imagesFiles.length === 0) {
    currentErrors.imagesFiles = "Veuillez charger au moins une photo.";
  }
}
if (step === 5) {
  if (!scheduleRanges || scheduleRanges.length === 0) {
    currentErrors.scheduleRanges = "Veuillez ajouter au moins une plage horaire.";
  } else {
    scheduleRanges.forEach((range, rangeIndex) => {
      if (!range.startDate) {
        currentErrors[`startDate_${rangeIndex}`] = "Date de début requise.";
      }
      if (!range.endDate) {
        currentErrors[`endDate_${rangeIndex}`] = "Date de fin requise.";
      }
      if (!range.dailySchedules || range.dailySchedules.length === 0) {
        currentErrors[`dailySchedules_${rangeIndex}`] = "Ajoutez au moins un horaire quotidien.";
      } else {
        range.dailySchedules.forEach((schedule, scheduleIndex) => {
          if (!schedule.startTime) {
            currentErrors[`startTime_${rangeIndex}_${scheduleIndex}`] = "Heure de début requise.";
          }
          if (!schedule.endTime) {
            currentErrors[`endTime_${rangeIndex}_${scheduleIndex}`] = "Heure de fin requise.";
          }
          schedule.formulas.forEach((formula, formulaIndex) => {
            if (!formula.label || formula.label.trim() === "") {
              currentErrors[`formulaLabel_${rangeIndex}_${scheduleIndex}_${formulaIndex}`] = "Label requis.";
            }
            if (formula.price == null || formula.price <= 0) {
              currentErrors[`formulaPrice_${rangeIndex}_${scheduleIndex}_${formulaIndex}`] = "Prix > 0 requis.";
            }
            if (formula.capacity == null || formula.capacity <= 0) {
              currentErrors[`formulaCapacity_${rangeIndex}_${scheduleIndex}_${formulaIndex}`] = "Capacité > 0 requise.";
            }
          });
        });
      }
    });
  }
}
if (step === 7) {
  if (mobiliteReduite === null) currentErrors.mobiliteReduite = "Veuillez préciser l'accessibilité.";
  if (groupes === null) currentErrors.groupes = "Veuillez préciser si ouvert aux groupes.";
  if (animaux === null) currentErrors.animaux = "Veuillez préciser si ouvert aux animaux.";
  if (!selectedPayments || selectedPayments.length === 0) currentErrors.selectedPayments = "Veuillez sélectionner au moins un moyen de paiement.";
  if (!languages || languages.length === 0) currentErrors.languages = "Veuillez sélectionner au moins une langue.";
  if (!ageMinimum || isNaN(Number(ageMinimum)) || Number(ageMinimum) < 0) currentErrors.ageMinimum = "Âge minimum valide requis.";
  if (accepteEnfants === null) currentErrors.accepteEnfants = "Veuillez préciser si vous acceptez les enfants.";
  if (accepteBebes === null) currentErrors.accepteBebes = "Veuillez préciser si vous acceptez les bébés.";
  if (!cgv || cgv.trim().length === 0) currentErrors.cgv = "Les conditions générales de vente sont obligatoires.";
}
  setErrors(currentErrors);
  return Object.keys(currentErrors).length === 0;
};


  const handleNext = () => {
    if (validateStep()) {
      setStep((prev) => prev + 1);
    }
  };  const handleChange = (e) =>
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

  const [Listactivites, setListactivites] = useState([]);
useEffect(() => {
    fetch("http://102.211.209.131:3011/api/activites")
      .then((res) => res.json())
      .then((data) => {
        setListactivites(data);
        console.log(data);
      })
      .catch((err) => {
        console.error("Erreur fetch activites :", err);
      });
  }, []);

const [allCategories, setAllCategories] = useState([]);
const [selectedCategories, setSelectedCategories] = useState([]);
const [selectedSubCategories, setSelectedSubCategories] = useState({});useEffect(() => {
    fetch("http://102.211.209.131:3011/api/categories")
      .then((res) => res.json())
      .then((data) => {
        setAllCategories(data);
        console.log(data);
      })
      .catch((err) => {
        console.error("Erreur fetch activites :", err);
      });
  }, []);

// handle changement sous-catégorie
const handleSubCategoryChange = (catId, newSubList) => {
  setSelectedSubCategories((prev) => ({
    ...prev,
    [catId]: newSubList,
  }));
};

const allSelectedSubCategoryIds = Object.values(selectedSubCategories)
  .flat()
  .map((sub) => ({ id: sub.id }));








const [cgv, setCgv] = useState("");
const [accepteEnfants, setAccepteEnfants] = useState(false);
const [accepteBebes, setAccepteBebes] = useState(false);
const [mobiliteReduite, setMobiliteReduite] = useState(false);
const [groupes, setGroupes] = useState(false);
const [animaux, setAnimaux] = useState(false);
const [ageMinimum, setAgeMinimum] = useState('');
  const [activiteSelected, setActiviteSelected] = useState(null);

const [instagramVideo, setInstagramVideo] = useState('');
const [instagramVideos, setInstagramVideos] = useState([]);
const handleAddInstagramVideo = () => {
  if (instagramVideo.trim() !== '') {
    setInstagramVideos([...instagramVideos, instagramVideo.trim()]);
    setInstagramVideo('');
  }
};
const [youtubeVideo, setYoutubeVideo] = useState('');
const [youtubeVideos, setYoutubeVideos] = useState([]);
const handleAddYoutubeVideo = () => {
  if (youtubeVideo.trim() !== '') {
    setYoutubeVideos([...youtubeVideos, youtubeVideo.trim()]);
    setYoutubeVideo('');
  }
};

const handleRemoveYoutubeVideo = (index) => {
  const updated = [...youtubeVideos];
  updated.splice(index, 1);
  setYoutubeVideos(updated);
};
const [selectedPayments, setSelectedPayments] = useState([]);
  const [languages, setLanguages] = useState([]);

  // Gérer ajout et suppression en même temps via onChange
  const handleLanguageChange = (event, newValue) => {
    setLanguages(newValue);
  };

  // Supprimer un chip
  const handleLanguageDelete = (languageToDelete) => () => {
    setLanguages((langs) => langs.filter((lang) => lang !== languageToDelete));
  };

  const [newDocumentName, setNewDocumentName] = useState('');
const [newDocumentPrice, setNewDocumentPrice] = useState('');
const [documentToProvide, setDocumentToProvide] = useState([]);
const handleAddDocument = () => {
  if (newDocumentName.trim() !== '' && newDocumentPrice !== '') {
    const newExtra = {
      name: newDocumentName.trim(),
      price: parseFloat(newDocumentPrice)
    };
    setDocumentToProvide([...documentToProvide, newExtra]);
    setNewDocumentName('');
    setNewDocumentPrice('');
  }
};

const handleRemoveDocument = (index) => {
  const updated = [...documentToProvide];
  updated.splice(index, 1);
  setDocumentToProvide(updated);
};
const [eventId, setEventId] = useState(null);
const [imagesFiles, setImagesFiles] = useState([]); // fichiers images sélectionnés
const [uploading, setUploading] = useState(false);
  const handleFilesChange = (e) => {
    const files = Array.from(e.target.files);
    setImagesFiles((prev) => [...prev, ...files]);
  };
    const [videoFiles, setVideoFiles] = useState([]);

  const handleVideoFilesChange = (e) => {
    const files = Array.from(e.target.files);
    setVideoFiles((prev) => [...prev, ...files]);
  };
const businessId = localStorage.getItem("businessId");

const handleSubmit = async () => {
  const payload = {
      business: businessId ? { id: businessId } : null, 
      activite: activiteSelected ? { id: activiteSelected.id } : null,
          subCategories: allSelectedSubCategoryIds,
 categories: selectedCategories.map((cat) => ({ id: cat.id })),
     nom: activityName,
    description: activityDescription,
    scheduleRanges,
    mainActivity,
    rue: formData.rue,
    ville: formData.ville,
    pays: formData.pays,
    latitude: position[0],
    longitude: position[1],
    includedEquipments: equipmentToBring,
    videosInstagram:  instagramVideos ,
    videosYoutube: youtubeVideos,
    paymentMethods:selectedPayments,
    languages,
    cgv,
    ageMinimum,
    accepteEnfants,
    accepteBebes,
    mobiliteReduite,
    groupes,
    animaux,
      extras: documentToProvide.map((item) => ({
    titre: item.name,
    prix: item.price

  }))
  };

  try {
    const response = await fetch("http://102.211.209.131:3011/api/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      const savedEvent = await response.json();
      console.log("Événement créé avec succès :", savedEvent);
      console.log("Selected activite:", activiteSelected);
      console.log("Payload envoyé :", payload);

      if (imagesFiles.length > 0) {
        await handleUploadImages(savedEvent.id, imagesFiles);
      }
            if (videoFiles.length > 0) {
        await handleUploadVideos(savedEvent.id, videoFiles);
      }
    } else {
      console.error("Erreur lors de la création");
    }
  } catch (error) {
    console.error("Erreur réseau", error);
  }
};
const handleUploadImages = async (id, files) => {
  setUploading(true);

  const formData = new FormData();
  for (const file of files) {
    formData.append("images", file);  // "images" = nom attendu côté backend
  }

  try {
    const response = await fetch(`http://102.211.209.131:3011/api/events/${id}/upload-images`, {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const uploadedUrls = await response.json();
      console.log("Images uploadées :", uploadedUrls);
      // ici tu peux mettre à jour ton state local avec les URLs reçues si besoin
    } else {
      console.error("Erreur lors de l’upload des images");
    }
  } catch (error) {
    console.error("Erreur réseau pendant upload images", error);
  } finally {
    setUploading(false);
  }
};
const handleUploadVideos = async (id, files) => {
  setUploading(true);
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);  // clé "videos" attendue côté backend
  });

  try {
    const response = await fetch(
      `http://102.211.209.131:3011/api/events/${id}/upload-videos`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (response.ok) {
      const uploadedUrls = await response.json();
      console.log("Vidéos uploadées :", uploadedUrls);
      // Met à jour le state local si besoin, par ex:
      // setVideoUrls(uploadedUrls);
    } else {
      console.error("Erreur lors de l’upload des vidéos");
    }
  } catch (error) {
    console.error("Erreur réseau pendant upload vidéos", error);
  } finally {
    setUploading(false);
  }
};

const [openConfirm, setOpenConfirm] = useState(false);
const navigate = useNavigate();

const handleConfirm = async () => {
  setOpenConfirm(false);
  try {
    await handleSubmit(); // ta fonction d’envoi (POST etc)
    // Afficher message succès (optionnel) puis redirection
    navigate('/backoffice/events');
  } catch (error) {
    // gérer erreurs submit (optionnel)
    alert('Erreur lors de la création de l\'événement');
  }
};
const StepHeader = ({ number, title }) => (
  <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
    <Box
      sx={{
        width: 32,
        height: 32,
        borderRadius: '50%',
        backgroundColor: '#1976d2',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
      }}
    >
      {number}
    </Box>
    <Typography variant="h6">{title}</Typography>
  </Stack>
);

  return (
    <Box sx={{ display: "flex" }}>
      <SideBar />

      {/* Main content */}
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, backgroundColor: "#f5f5f5", minHeight: "100vh" }}
      >
        <Toolbar />
        <Box sx={{ p: 3, backgroundColor: "#f6f9fc", minHeight: "100vh" }}>
<Stepper activeStep={step} alternativeLabel sx={{ mb: 4 }}>
  {steps.map((stepData, index) => (
    <Step
      key={stepData.label}
      // Ne change d'étape que si :
      // - on clique sur une autre étape
      // - l'étape actuelle est valide
      onClick={() => {
        if (index !== step && validateStep()) {
          setStep(index);
        }
      }}
      sx={{ cursor: "pointer" }}
    >
      <StepLabel
        optional={
          stepData.optional ? (
            <Typography variant="caption" color="text.secondary">
              Facultatif
            </Typography>
          ) : undefined
        }
      >
        {stepData.label}
      </StepLabel>
    </Step>
  ))}
</Stepper>


          {/* Section Général */}
          {step  === 0 && (
            <Box sx={{ mt: 3 }}>
              {/* Nom commercial */}
              <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
                <Typography variant="subtitle1" gutterBottom>Décrivez votre activité</Typography>
<TextField
  fullWidth
  placeholder="Décrivez votre activité"
  variant="outlined"
  sx={{ mt: 1 }}
  required
  value={activityName}
  onChange={(e) => setActivityName(e.target.value)}
  error={Boolean(errors.activityName)}
  helperText={errors.activityName}
/>


                              <Typography variant="body2" sx={{ mb: 1 }}>
                Description
              </Typography>
<TextField
  fullWidth
  multiline
  rows={6}
  placeholder="Saisir un texte pour cet article"
  variant="outlined"
  required
  value={activityDescription}
  onChange={(e) => setActivityDescription(e.target.value)}
  error={Boolean(errors.activityDescription)}
  helperText={errors.activityDescription}
/>
              </Paper>

              
            </Box>
          )}
          {step  === 1 && (
            <Paper sx={{ p: 3, borderRadius: 2 }}>
             {/* Activité principale */}
<Typography variant="subtitle1" gutterBottom>Définissez votre activité</Typography>

    <Typography variant="body1">Activité principale</Typography>

<Autocomplete
  options={Listactivites}
  getOptionLabel={(option) => option.titre || ""}
  value={activiteSelected}
  onChange={(event, newValue) => setActiviteSelected(newValue)}
  renderInput={(params) => (
    <TextField
      {...params}
      label="Sélectionnez une activité principale"
      variant="outlined"
      error={Boolean(errors.activiteSelected)}
      helperText={errors.activiteSelected}
    />
  )}
/>

<Divider sx={{ my: 3 }} />

{/* Catégories multiples */}
<Typography variant="subtitle1" gutterBottom>Précisez la ou les catégories</Typography>
  <Typography variant="body1">Catégories</Typography>
<Autocomplete
  multiple
  options={allCategories}
  getOptionLabel={(option) => option.nom}
  onChange={(e, newValue) => {
    setSelectedCategories(newValue);
    const updatedSubCats = {};
    newValue.forEach((cat) => {
      updatedSubCats[cat.id] = selectedSubCategories[cat.id] || [];
    });
    setSelectedSubCategories(updatedSubCats);
  }}
  renderInput={(params) => (
    <TextField
      {...params}
      label="Sélectionner les catégories"
      variant="outlined"
      error={Boolean(errors.selectedCategories)}
      helperText={errors.selectedCategories}
    />
  )}
/>

{selectedCategories.map((cat) => (
  <Box key={cat.id} sx={{ mt: 2 }}>
    <Typography variant="subtitle2">{cat.nom} - Sous-catégories</Typography>
    <Autocomplete
      multiple
      options={cat.subCategories || []}
      getOptionLabel={(option) => option.nom}
      value={selectedSubCategories[cat.id] || []}
      onChange={(e, newVal) => handleSubCategoryChange(cat.id, newVal)}
      renderInput={(params) => (
        <TextField {...params} label={`Sous-catégories de ${cat.nom}`} variant="outlined" />
      )}
    />
  </Box>
))}

              
            
            </Paper>
          )}
          {step  === 2 && (
            <Box sx={{ mt: 3 }}>
              {/* Localisation - Replaced with the interactive map */}
              <Paper sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="subtitle1" gutterBottom>Localisation</Typography>
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

                <Box sx={{ height: 300, mb: 2 ,borderRadius: 2, overflow: "hidden" }}>
                  <MapContainer center={position} zoom={13} style={{ height: "100%", width: "100%" }}>
                    <TileLayer
                      attribution="&copy; OpenStreetMap"
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationSelector position={position} setPosition={setPosition} setFormData={setFormData} />
                  </MapContainer>
                </Box>

<TextField
  label="Rue / Adresse complète"
  name="rue"
  fullWidth
  required
  value={formData.rue}
  onChange={handleChange}
  error={Boolean(errors.rue)}
  helperText={errors.rue}
  sx={{ mb: 2 }}
/>
<TextField
  label="Ville"
  name="ville"
  fullWidth
  required
  value={formData.ville}
  onChange={handleChange}
  error={Boolean(errors.ville)}
  helperText={errors.ville}
  sx={{ mb: 2 }}
/>
<TextField
  label="Pays"
  name="pays"
  fullWidth
  required
  value={formData.pays}
  onChange={handleChange}
  error={Boolean(errors.pays)}
  helperText={errors.pays}
  sx={{ mb: 2 }}
/>
{geoError && (
  <Typography color="error" sx={{ mb: 2 }}>
    {geoError}
  </Typography>
)}
                <Typography variant="body2">
                  📍 Latitude : {position[0].toFixed(5)} | Longitude : {position[1].toFixed(5)}
                </Typography>
              </Paper>
            </Box>
          )}

{step === 3 && (
  <Paper sx={{ p: 3, borderRadius: 2 }}>
    <Typography variant="subtitle1" gutterBottom>
      Photos
    </Typography>
    <Box
      sx={{
        border: "2px dashed #ccc",
        borderRadius: 2,
        p: 4,
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 200,
        cursor: "pointer",
        mb: 3,
      }}
    >
      <input
        accept="image/*"
        style={{ display: "none" }}
        id="raised-button-file-photo"
        multiple
        type="file"
        onChange={handleFilesChange}
      />
      <label htmlFor="raised-button-file-photo">
        <Button
          variant="contained"
          component="span"
          startIcon={<AddCircleIcon />}
          sx={{ bgcolor: "#181AD6", "&:hover": { bgcolor: "#181AD6" } }}
        >
          Charger une photo
        </Button>
      </label>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        Glissez et déposez vos photos ici, ou cliquez pour en charger.
      </Typography>
    </Box>

    {errors.imagesFiles && (
      <Typography color="error" sx={{ mt: 1 }}>
        {errors.imagesFiles}
      </Typography>
    )}

{imagesFiles.length > 0 && (
  <Box sx={{ mt: 2 }}>
    <Typography variant="subtitle2">Photos sélectionnées :</Typography>
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 1 }}>
      {imagesFiles.map((file, index) => {
        // URL pour afficher l'image
        const imgUrl = URL.createObjectURL(file);

        return (
          <Box
            key={index}
            sx={{
              position: "relative",
              width: 100,
              height: 100,
              border: "1px solid #ccc",
              borderRadius: 1,
              overflow: "hidden",
            }}
          >
            <img
              src={imgUrl}
              alt={file.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <IconButton
              size="small"
              onClick={() => {
                // Supprime l'image à cet index
                const newFiles = [...imagesFiles];
                newFiles.splice(index, 1);
                setImagesFiles(newFiles);
              }}
              sx={{
                position: "absolute",
                top: 2,
                right: 2,
                bgcolor: "rgba(255,255,255,0.7)",
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        );
      })}
    </Box>
  </Box>
)}
  </Paper>
)}
          {step  === 4 && (
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
        Vidéos
      </Typography>
      <Box
        sx={{
          border: "2px dashed #ccc",
          borderRadius: 2,
          p: 4,
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 200,
          cursor: "pointer",
        }}
      >
        <input
          accept="video/*"
          style={{ display: "none" }}
          id="raised-button-file-video"
          multiple
          type="file"
          onChange={handleVideoFilesChange}
        />
        <label htmlFor="raised-button-file-video">
          <Button
            variant="contained"
            component="span"
            startIcon={<AddCircleIcon />}
            sx={{ bgcolor: "#181AD6", "&:hover": { bgcolor: "#181AD6" } }}
          >
            Charger une vidéo
          </Button>
        </label>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Glissez et déposez vos vidéos ici, ou cliquez pour en charger.
        </Typography>
      </Box>

      {videoFiles.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2">Vidéos sélectionnées :</Typography>
          <ul>
            {videoFiles.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        </Box>
      )}
              <Typography variant="subtitle1" gutterBottom>Liste vidéos depuis Instagram</Typography>

<Box display="flex" alignItems="center" gap={1} mb={2}>
  <TextField
    fullWidth
    placeholder="Lien ou identifiant Instagram"
    value={instagramVideo}
    onChange={(e) => setInstagramVideo(e.target.value)}
    onKeyPress={(e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleAddInstagramVideo();
      }
    }}
  />
  <Button
    variant="contained"
    onClick={handleAddInstagramVideo}
    sx={{ bgcolor: '#181AD6', '&:hover': { bgcolor: '#181AD6' } }}
  >
    +
  </Button>
</Box>

<List sx={{ p: 0 }}>
  {instagramVideos.map((item, index) => (
    <ListItem
      key={index}
      disablePadding
      secondaryAction={
        <IconButton
          edge="end"
          aria-label="delete"
          onClick={() =>
            setInstagramVideos(instagramVideos.filter((_, i) => i !== index))
          }
        >
          <DeleteIcon />
        </IconButton>
      }
      sx={{
        border: '1px solid #eee',
        borderRadius: 1,
        mb: 1,
        pl: 2,
        pr: 1,
        bgcolor: 'background.paper',
      }}
    >
      <ListItemText primary={item} />
    </ListItem>
  ))}
</List>
<Typography variant="subtitle1" gutterBottom>Liste vidéos depuis YouTube</Typography>

<Box display="flex" alignItems="center" gap={1} mb={2}>
  <TextField
    fullWidth
    placeholder="Lien YouTube"
    value={youtubeVideo}
    onChange={(e) => setYoutubeVideo(e.target.value)}
    onKeyPress={(e) => {
      if (e.key === 'Enter') handleAddYoutubeVideo();
    }}
  />
  <Button
    variant="contained"
    onClick={handleAddYoutubeVideo}
    sx={{ bgcolor: '#181AD6', '&:hover': { bgcolor: '#181AD6' } }}
  >
    +
  </Button>
</Box>

<List sx={{ p: 0 }}>
  {youtubeVideos.map((item, index) => (
    <ListItem
      key={index}
      disablePadding
      secondaryAction={
        <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveYoutubeVideo(index)}>
          <DeleteIcon />
        </IconButton>
      }
      sx={{ border: '1px solid #eee', borderRadius: 1, mb: 1, pl: 2, pr: 1, bgcolor: 'background.paper' }}
    >
      <ListItemText primary={item} />
    </ListItem>
  ))}
</List>

            </Paper>
          )}

          {step  === 5 && (
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="subtitle1" gutterBottom>Horaires disponibles</Typography>

             {scheduleRanges.map((range, rangeIndex) => (
  <Box key={rangeIndex} sx={{ mb: 4, p: 3, border: '1px solid #ddd', borderRadius: 2, position: 'relative' }}>
    {/* ... bouton delete ... */}

    <Typography variant="h6" sx={{ mb: 2 }}>Plage de dates</Typography>
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12} sm={5}>
        <TextField
          fullWidth
          label="Du"
          type="date"
          value={range.startDate}
          onChange={(e) => handleDateRangeChange(rangeIndex, 'startDate', e.target.value)}
          InputLabelProps={{ shrink: true }}
          error={Boolean(errors[`startDate_${rangeIndex}`])}
          helperText={errors[`startDate_${rangeIndex}`]}
        />
      </Grid>
      <Grid item xs={12} sm={1} sx={{ textAlign: 'center' }}>
        <Typography>au</Typography>
      </Grid>
      <Grid item xs={12} sm={5}>
        <TextField
          fullWidth
          label="au"
          type="date"
          value={range.endDate}
          onChange={(e) => handleDateRangeChange(rangeIndex, 'endDate', e.target.value)}
          InputLabelProps={{ shrink: true }}
          error={Boolean(errors[`endDate_${rangeIndex}`])}
          helperText={errors[`endDate_${rangeIndex}`]}
        />
      </Grid>
    </Grid>

    <Divider sx={{ my: 3 }} />

    <Typography variant="h6" sx={{ mb: 2 }}>Horaires quotidiens</Typography>
    {range.dailySchedules.map((schedule, scheduleIndex) => (
      <Box key={scheduleIndex} sx={{ mb: 2, border: '1px solid #eee', p: 2, borderRadius: 1, position: 'relative' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Heure de début"
              type="time"
              InputLabelProps={{ shrink: true }}
              value={schedule.startTime}
              onChange={(e) => handleDailyScheduleChange(rangeIndex, scheduleIndex, 'startTime', e.target.value)}
              error={Boolean(errors[`startTime_${rangeIndex}_${scheduleIndex}`])}
              helperText={errors[`startTime_${rangeIndex}_${scheduleIndex}`]}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Heure de fin"
              type="time"
              InputLabelProps={{ shrink: true }}
              value={schedule.endTime}
              onChange={(e) => handleDailyScheduleChange(rangeIndex, scheduleIndex, 'endTime', e.target.value)}
              error={Boolean(errors[`endTime_${rangeIndex}_${scheduleIndex}`])}
              helperText={errors[`endTime_${rangeIndex}_${scheduleIndex}`]}
            />
          </Grid>

          <Typography variant="subtitle1" sx={{ mt: 2 }}>Formules</Typography>

          {schedule.formulas.map((formula, formulaIndex) => (
            <Grid container spacing={1} key={formulaIndex} alignItems="center" mb={1}>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label="Label (ex: nom de l'activité)"
                  value={formula.label}
                  onChange={(e) =>
                    handleFormulaChange(rangeIndex, scheduleIndex, formulaIndex, 'label', e.target.value)
                  }
                  error={Boolean(errors[`formulaLabel_${rangeIndex}_${scheduleIndex}_${formulaIndex}`])}
                  helperText={errors[`formulaLabel_${rangeIndex}_${scheduleIndex}_${formulaIndex}`]}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  fullWidth
                  label="Prix"
                  type="number"
                  value={formula.price}
                  onChange={(e) =>
                    handleFormulaChange(rangeIndex, scheduleIndex, formulaIndex, 'price', e.target.value)
                  }
                  error={Boolean(errors[`formulaPrice_${rangeIndex}_${scheduleIndex}_${formulaIndex}`])}
                  helperText={errors[`formulaPrice_${rangeIndex}_${scheduleIndex}_${formulaIndex}`]}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  fullWidth
                  label="Capacité"
                  type="number"
                  value={formula.capacity}
                  onChange={(e) =>
                    handleFormulaChange(rangeIndex, scheduleIndex, formulaIndex, 'capacity', e.target.value)
                  }
                  error={Boolean(errors[`formulaCapacity_${rangeIndex}_${scheduleIndex}_${formulaIndex}`])}
                  helperText={errors[`formulaCapacity_${rangeIndex}_${scheduleIndex}_${formulaIndex}`]}
                />
              </Grid>
              <Grid item xs={2}>
                <IconButton onClick={() => handleRemoveFormula(rangeIndex, scheduleIndex, formulaIndex)}>
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          ))}

          <Button
            variant="outlined"
            onClick={() => handleAddFormula(rangeIndex, scheduleIndex)}
            startIcon={<AddCircleIcon />}
            sx={{ mt: 1 }}
          >
            Ajouter une formule
          </Button>

          {range.dailySchedules.length > 1 && (
            <Grid item xs={12}>
              <IconButton
                aria-label="delete"
                onClick={() => handleRemoveDailySchedule(rangeIndex, scheduleIndex)}
                color="error"
                sx={{ position: 'absolute', top: 8, right: 8 }}
              >
                <DeleteIcon />
              </IconButton>
            </Grid>
          )}
        </Grid>
      </Box>
    ))}

    <Button
      variant="outlined"
      startIcon={<AddCircleIcon />}
      sx={{ mt: 2, width: '100%' }}
      onClick={() => handleAddDailySchedule(rangeIndex)}
    >
      Ajouter une nouvelle plage horaire
    </Button>
  </Box>
))}
{errors.scheduleRanges && (
  <Typography color="error" sx={{ mt: 2 }}>
    {errors.scheduleRanges}
  </Typography>
)}

<Button
  variant="contained"
  startIcon={<AddCircleIcon />}
  sx={{ mt: 3, width: '100%', bgcolor: '#181AD6', '&:hover': { bgcolor: '#181AD6' } }}
  onClick={handleAddScheduleRange}
>
  AJOUTER DE NOUVEAUX HORAIRES DISPONIBLES
</Button>
            </Paper>
          )}
          {step  === 6 && (
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="subtitle1" gutterBottom>Inclus</Typography>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <TextField
                  fullWidth
                  placeholder="Inclus"
                  value={newEquipment}
                  onChange={(e) => setNewEquipment(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddEquipment();
                    }
                  }}
                />
                {/* Updated Button Color */}
                <Button
                  variant="contained"
                  onClick={handleAddEquipment}
                  sx={{ bgcolor: '#181AD6', '&:hover': { bgcolor: '#181AD6' } }}
                >
                  +
                </Button>
              </Box>
              <List sx={{ p: 0 }}>
                {equipmentToBring.map((item, index) => (
                  <ListItem
                    key={index}
                    disablePadding
                    secondaryAction={
                      <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveEquipment(index)}>
                        <DeleteIcon />
                      </IconButton>
                    }
                    sx={{ border: '1px solid #eee', borderRadius: 1, mb: 1, pl: 2, pr: 1, bgcolor: 'background.paper' }}
                  >
                    <ListItemText primary={item} />
                  </ListItem>
                ))}
              </List>

              <Divider sx={{ my: 3 }} />

             <Typography variant="subtitle1" gutterBottom>Extrats</Typography>

<Box display="flex" alignItems="center" gap={1} mb={2}>
  <TextField
    fullWidth
    placeholder="Nom"
    value={newDocumentName}
    onChange={(e) => setNewDocumentName(e.target.value)}
    onKeyPress={(e) => {
      if (e.key === 'Enter') handleAddDocument();
    }}
  />
  <TextField
    type="number"
    placeholder="Prix"
    value={newDocumentPrice}
    onChange={(e) => setNewDocumentPrice(e.target.value)}
    onKeyPress={(e) => {
      if (e.key === 'Enter') handleAddDocument();
    }}
    sx={{ width: 100 }}
  />
  <Button
    variant="contained"
    onClick={handleAddDocument}
    sx={{ bgcolor: '#181AD6', '&:hover': { bgcolor: '#181AD6' } }}
  >
    +
  </Button>
</Box>

<List sx={{ p: 0 }}>
  {documentToProvide.map((item, index) => (
    <ListItem
      key={index}
      disablePadding
      secondaryAction={
        <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveDocument(index)}>
          <DeleteIcon />
        </IconButton>
      }
      sx={{ border: '1px solid #eee', borderRadius: 1, mb: 1, pl: 2, pr: 1, bgcolor: 'background.paper' }}
    >
      <ListItemText primary={`${item.name} - ${item.price} TND`} />
    </ListItem>
  ))}
</List>

            </Paper>
          )}
          {step  === 7 && (
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Divider sx={{ my: 3 }} />


              <Grid container spacing={3} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={6}>

                 <FormControl component="fieldset" error={Boolean(errors.mobiliteReduite)}>
  <Typography variant="body2">Votre activité est-elle accessible aux personnes à mobilité réduite ?</Typography>
  <RadioGroup
    row
    value={mobiliteReduite}
    onChange={(e) => setMobiliteReduite(e.target.value === 'true')}
  >
    <FormControlLabel value={true} control={<Radio />} label="Oui" />
    <FormControlLabel value={false} control={<Radio />} label="Non" />
  </RadioGroup>
  {errors.mobiliteReduite && (
    <FormHelperText>{errors.mobiliteReduite}</FormHelperText>
  )}
</FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">Votre activité est-elle ouverte aux groupes ?</Typography>
                  <RadioGroup row
                    value={groupes}
  onChange={(e) => setGroupes(e.target.value)}
                  >
 <FormControlLabel value={true} control={<Radio />} label="Oui" />
  <FormControlLabel value={false} control={<Radio />} label="Non" />
                  </RadioGroup>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">Votre activité est-elle ouverte aux animaux ?</Typography>
                  <RadioGroup row
                    value={animaux}
  onChange={(e) => setAnimaux(e.target.value)}
                  >
 <FormControlLabel value={true} control={<Radio />} label="Oui" />
  <FormControlLabel value={false} control={<Radio />} label="Non" />
                  </RadioGroup>
                </Grid>
              </Grid>

              <Typography variant="body2" sx={{ mb: 1 }}>Quel(s) moyen(s) de paiement acceptez-vous ?</Typography>
<Autocomplete
  multiple
  options={paymentOptions}
  value={selectedPayments}
  onChange={(event, newValue) => setSelectedPayments(newValue)}
  freeSolo
  renderTags={(value, getTagProps) =>
    value.map((option, index) => (
      <Chip variant="outlined" label={option} {...getTagProps({ index })} />
    ))
  }
  renderInput={(params) => (
    <TextField {...params} placeholder="Pour ajouter un moyen de paiement cliquer ici" />
  )}
/>

                <Typography variant="body2" sx={{ mt: 2, mb: 1 }}>
        Quelles sont les langues parlées au sein de votre activité ?
      </Typography>
      <Autocomplete
        multiple
        freeSolo
        options={availableLanguages}
        value={languages}
        onChange={handleLanguageChange}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              key={option}
              label={option}
              onDelete={handleLanguageDelete(option)}
              {...getTagProps({ index })}
            />
          ))
        }
        renderInput={(params) => (
          <TextField {...params} placeholder="Pour ajouter une langue cliquer ici" />
        )}
      />
              <Typography variant="subtitle1" gutterBottom>Conditions générales de vente</Typography>

              <Divider sx={{ my: 3 }} />
              <Typography variant="subtitle1" gutterBottom>Âge minimum</Typography>
              <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                  <Grid item xs={12} sm={6}>
                      <Typography variant="body2">Âge minimum requis pour participer à l'activité</Typography>
<TextField
  fullWidth
  label="Âge (ans)"
  type="number"
  placeholder="Ex: 10"
  value={ageMinimum}
  onChange={(e) => setAgeMinimum(e.target.value)}
  error={Boolean(errors.ageMinimum)}
  helperText={errors.ageMinimum}
/>
                  </Grid>
                  <Grid item xs={12} sm={6}>
<Typography variant="body2">Acceptez-vous les enfants ?</Typography>
<RadioGroup
  row
  value={accepteEnfants}
  onChange={(e) => setAccepteEnfants(e.target.value)}
>
 <FormControlLabel value={true} control={<Radio />} label="Oui" />
  <FormControlLabel value={false} control={<Radio />} label="Non" />
</RadioGroup>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                      <Typography variant="body2">Acceptez-vous les bébés ?</Typography>
                      <RadioGroup row
  value={accepteBebes}
  onChange={(e) => setAccepteBebes(e.target.value)}
                      >
 <FormControlLabel value={true} control={<Radio />} label="Oui" />
  <FormControlLabel value={false} control={<Radio />} label="Non" />
                      </RadioGroup>
                  </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ mb: 2 }}>
                <Link href="#" underline="hover">Traduire</Link> | <Link href="#" underline="hover">Voir les versions étrangères (0)</Link>
              </Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Vous pouvez télécharger un modèle de conditions générales de vente en cliquant <Link href="#">ici</Link>
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={8}
                placeholder="Vos conditions générales de vente (la saisie des CGV est obligatoire pour pouvoir vendre en ligne)"
                variant="outlined"
                  value={cgv}
  onChange={(e) => setCgv(e.target.value)}
              />
            </Paper>
          )}
            {/* Navigation */}
  <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
    <Button disabled={step === 0} onClick={handleBack}>
      Précédent
    </Button>
    {step < steps.length - 1 ? (
<Button
  variant="contained"
  onClick={() => {
    if (validateStep()) {
      handleNext();
    }
  }}
                      sx={{ backgroundColor: "#181AD6", "&:hover": { backgroundColor: "#12149a" } }}

>
  Suivant
</Button>
    ) : (
<Button
  variant="contained"
  color="success"
  onClick={() => {
    if (validateStep()) {
      // Affiche popup confirmation avant submit
      setOpenConfirm(true);
    }
  }}
>
  Terminer
</Button>
    )}
  </Box>
        </Box>
      </Box>
      <Snackbar
  open={openSnackbar}
  autoHideDuration={3000}
  onClose={handleCloseSnackbar}
  anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
>
  <MuiAlert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
    Événement créé avec succès !
  </MuiAlert>
</Snackbar>

<Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
  <DialogTitle>Confirmer la création</DialogTitle>
  <DialogContent>
    <Typography>Voulez-vous vraiment créer cet événement ?</Typography>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setOpenConfirm(false)}>Annuler</Button>
    <Button variant="contained" color="primary" onClick={handleConfirm}>Confirmer</Button>
  </DialogActions>
</Dialog>
    </Box>
  );
}