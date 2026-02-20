import React, { useState,useEffect } from "react";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import Input from "../components/form/input/InputField";
import TextArea from "../components/form/input/TextArea";
import Select from "../components/form/Select";
import MultiSelect from "../components/form/MultiSelect";
import { clsx } from "clsx";
import { TrashIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";
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
  Stack ,FormHelperText,useMediaQuery, useTheme
} from "@mui/material";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { Stepper, Step, StepLabel } from "@mui/material";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import EventIcon from "@mui/icons-material/Event";
import HomeIcon from "@mui/icons-material/Home";
import DeleteIcon from "@mui/icons-material/Delete";
// New imports for the map functionality
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS
import L from 'leaflet';
import axios from "axios";
import dayjs from "dayjs";
import "dayjs/locale/fr";  // si tu veux le format français
dayjs.locale("fr");
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


const handleCloseSnackbar = (event, reason) => {
  if (reason === 'clickaway') return;
  setOpenSnackbar(false);
  navigate("/vendeur/events");
};
const handleOpenSnackbar = (event, reason) => {
  if (reason === 'clickaway') return;
  setOpenSnackbar(true);
};
  const [equipmentToBring, setEquipmentToBring] = useState([]);
  const [newEquipment, setNewEquipment] = useState('');

  const [NonInclusList, setNonInclusList] = useState([]);
  const [NonInclus, setNonInclus] = useState('');
  const handleAddNonInclus = () => {
    if (NonInclus.trim() !== '') {
      setNonInclusList([...NonInclusList, NonInclus]);
      setNonInclus('');
    }
  };

  const handleRemoveNonInclus = (index) => {
    const updatedList = NonInclusList.filter((_, i) => i !== index);
    setNonInclusList(updatedList);
  };

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
  const paymentOptions = ['Carte bancaire', 'Espèces','Paiement en Ligne','Virement', 'Chèque','Autres'];
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
  const BASE_URL = "https://waw.com.tn";

  // fetch activites
  const fetchActivities = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/activites`);
      const data = await res.json();
      setListactivites(data);
    } catch (err) {
      console.error("Erreur fetch activites :", err);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

const [allCategories, setAllCategories] = useState([]);
const [selectedCategories, setSelectedCategories] = useState([]);
const [selectedSubCategories, setSelectedSubCategories] = useState({});useEffect(() => {
    fetch("https://waw.com.tn/api/categories")
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

  function addScheduleRange() {
    setScheduleRanges([
      ...scheduleRanges,
      {
        startDate: "",
        endDate: "",
        dailySchedules: [
          { startTime: "", endTime: "", formulas: [{ label: "", price: "", capacity: "" }] },
        ],
      },
    ]);
  }

  function removeScheduleRange(index) {
    if (scheduleRanges.length <= 1) return;
    const copy = [...scheduleRanges];
    copy.splice(index, 1);
    setScheduleRanges(copy);
  }

  function updateScheduleRange(index, field, value) {
    const copy = [...scheduleRanges];
    copy[index][field] = value;
    setScheduleRanges(copy);
  }

  function addDailySchedule(rangeIndex) {
    const copy = [...scheduleRanges];
    copy[rangeIndex].dailySchedules.push({
      startTime: "",
      endTime: "",
      formulas: [{ label: "", price: "", capacity: "" }],
    });
    setScheduleRanges(copy);
  }

  function removeDailySchedule(rangeIndex, scheduleIndex) {
    const copy = [...scheduleRanges];
    if (copy[rangeIndex].dailySchedules.length <= 1) return;
    copy[rangeIndex].dailySchedules.splice(scheduleIndex, 1);
    setScheduleRanges(copy);
  }

  function updateDailySchedule(rangeIndex, scheduleIndex, field, value) {
    const copy = [...scheduleRanges];
    copy[rangeIndex].dailySchedules[scheduleIndex][field] = value;
    setScheduleRanges(copy);
  }

  function addFormula(rangeIndex, scheduleIndex) {
    const copy = [...scheduleRanges];
    copy[rangeIndex].dailySchedules[scheduleIndex].formulas.push({
      label: "",
      price: "",
      capacity: "",
    });
    setScheduleRanges(copy);
  }

  function removeFormula(rangeIndex, scheduleIndex, formulaIndex) {
    const copy = [...scheduleRanges];
    if (copy[rangeIndex].dailySchedules[scheduleIndex].formulas.length <= 1) return;
    copy[rangeIndex].dailySchedules[scheduleIndex].formulas.splice(formulaIndex, 1);
    setScheduleRanges(copy);
  }

  function updateFormula(rangeIndex, scheduleIndex, formulaIndex, field, value) {
    const copy = [...scheduleRanges];
    copy[rangeIndex].dailySchedules[scheduleIndex].formulas[formulaIndex][field] = value;
    setScheduleRanges(copy);
  }


function renderScheduleRangeNormal(range, idx) {
  const WEEK_DAYS = [
  { label: "Lun", value: "MONDAY" },
  { label: "Mar", value: "TUESDAY" },
  { label: "Mer", value: "WEDNESDAY" },
  { label: "Jeu", value: "THURSDAY" },
  { label: "Ven", value: "FRIDAY" },
  { label: "Sam", value: "SATURDAY" },
  { label: "Dim", value: "SUNDAY" },
];
    const selectedDays = Array.isArray(range.selectedDays) ? range.selectedDays : [];

  const toggleDay = (dayValue) => {
    const updated = selectedDays.includes(dayValue)
      ? selectedDays.filter((d) => d !== dayValue)
      : [...selectedDays, dayValue];
    updateScheduleRange(idx, "selectedDays", updated);
  };

  const selectAllDays = () => {
    updateScheduleRange(idx, "selectedDays", WEEK_DAYS.map((d) => d.value));
  };

  const resetDays = () => {
    updateScheduleRange(idx, "selectedDays", []);
  };

  const datesInRange =
    range.startDate && range.endDate
      ? getAllDatesBetween(range.startDate, range.endDate)
      : [];
  function getAllDatesBetween(startDate, endDate) {
  const dates = [];
  let currentDate = new Date(startDate);
  const lastDate = new Date(endDate);

  while (currentDate <= lastDate) {
    // Format date as YYYY-MM-DD
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    dates.push(`${year}-${month}-${day}`);

    // Increment by one day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}
function toggleDate(idx, date, selectedExclureDates) {
  const selected = selectedExclureDates || [];
  let newSelected;
  if (selected.includes(date)) {
    newSelected = selected.filter(d => d !== date);
  } else {
    newSelected = [...selected, date];
  }
  updateScheduleRange(idx, "selectedExclureDates", newSelected);
}
const getMatchingDatesInPeriod = (start, end, selectedDays) => {
  if (!start || !end || !selectedDays?.length) return [];

  const selectedIndices = selectedDays.map((day) =>
    ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].indexOf(day)
  );

  const results = [];
  let current = dayjs(start);
  const endDate = dayjs(end);

  while (current.isSameOrBefore(endDate)) {
    if (selectedIndices.includes(current.day())) {
      results.push(current.format("D MMMM"));
    }
    current = current.add(1, "day");
  }
  return results;
};
  return (
    <div key={idx} className="mb-6 p-4 border border-gray-300 rounded-lg relative">
      {scheduleRanges.length > 1 && (
        <button
          onClick={() => removeScheduleRange(idx)}
          className="absolute top-2 right-2 text-red-600 hover:text-red-800"
          aria-label="Supprimer plage"
          title="Supprimer plage"
          type="button"
        >
          Supprimer
        </button>
      )}

      {/* Dates de début et fin */}
      <div className="mb-3 flex flex-wrap gap-2 items-center">
        <label>
          Du{" "}
          <input
            type="date"
            className="border rounded px-2 py-1"
            value={range.startDate}
            onChange={(e) => updateScheduleRange(idx, "startDate", e.target.value)}
          />
        </label>
        <label>
          au{" "}
          <input
            type="date"
            className="border rounded px-2 py-1"
            value={range.endDate}
            onChange={(e) => updateScheduleRange(idx, "endDate", e.target.value)}
          />
        </label>
      </div>

      {/* Sélection dates à exclure */}
      <div className="mb-3 max-h-40 overflow-auto border rounded p-2">
        <strong>Sélectionnez les dates :</strong>
        <div className="flex flex-wrap gap-2 mt-1">
          {datesInRange.map(date => (
            <label key={date} className="inline-flex items-center gap-1">
              <input
                type="checkbox"
                checked={range.selectedExclureDates?.includes(date) || false}
                onChange={() => toggleDate(idx, date, range.selectedExclureDates)}
                className="form-checkbox"
              />
              <span>{date}</span>
            </label>
          ))}
        </div>
      </div>

      {/* ✅ Sélection jours */}
      <div className="flex gap-3 mb-4 flex-wrap">
        {WEEK_DAYS.map((day) => (
          <label key={day.value} className="mr-2 flex items-center gap-1">
            <input
              type="checkbox"
              value={day.value}
              checked={selectedDays.includes(day.value)}
              onChange={() => toggleDay(day.value)}
              className="accent-blue-500"
            />
            {day.label}
          </label>
        ))}

        <div className="mt-2 w-full">
          <button
            type="button"
            className="text-sm text-blue-600 underline mr-4"
            onClick={selectAllDays}
          >
            Tous les jours
          </button>
          <button
            type="button"
            className="text-sm text-red-600 underline"
            onClick={resetDays}
          >
            Réinitialiser les jours
          </button>
        </div>
      </div>

      {/* ✅ Résumé jours + dates équivalentes */}
      {range.startDate && range.endDate && selectedDays.length > 0 && (
        <div className="mt-3 text-sm text-gray-700">
          <strong>
            {selectedDays.length === 7
              ? "Tous les jours"
              : selectedDays
                  .map((d) => WEEK_DAYS.find((w) => w.value === d)?.label)
                  .filter(Boolean)
                  .join(", ")}
          </strong>{" "}
          choisis entre le{" "}
          <strong>{dayjs(range.startDate).format("D MMMM YYYY")}</strong> et le{" "}
          <strong>{dayjs(range.endDate).format("D MMMM YYYY")}</strong> :
          <div className="mt-1 text-gray-600">
            {getMatchingDatesInPeriod(range.startDate, range.endDate, selectedDays).join(", ")}
          </div>
        </div>
      )}

      {/* Horaires quotidiens */}
      {range.dailySchedules.map((schedule, scheduleIndex) => (
        <div
          key={scheduleIndex}
          className="mb-4 p-3 border border-gray-200 border-l-0 rounded relative"
        >
          {range.dailySchedules.length > 1 && (
            <button
              onClick={() => removeDailySchedule(idx, scheduleIndex)}
              className="absolute top-1 right-1 text-red-600 hover:text-red-800"
              aria-label="Supprimer horaire"
              title="Supprimer horaire"
              type="button"
            >
              Supprimer
            </button>
          )}
          <div className="flex flex-wrap gap-4 mb-2">
            <label>
              Début{" "}
              <input
                type="time"
                className="border rounded px-2 py-1"
                value={schedule.startTime}
                onChange={(e) =>
                  updateDailySchedule(idx, scheduleIndex, "startTime", e.target.value)
                }
              />
            </label>
            <label>
              Fin{" "}
              <input
                type="time"
                className="border rounded px-2 py-1"
                value={schedule.endTime}
                onChange={(e) =>
                  updateDailySchedule(idx, scheduleIndex, "endTime", e.target.value)
                }
              />
            </label>
            <label>
              label{" "}
              <input
                type="text"
                placeholder="Label"
                className="border rounded px-2 py-1 flex-1"
                value={schedule.label}
                onChange={(e) =>
                  updateDailySchedule(idx, scheduleIndex, "label", e.target.value)
                }
              />
            </label>    
                    <label>
              capacity
              <input
                type="number"
                placeholder="capacity"
                className="border rounded px-2 py-1 flex-1"
                value={schedule.capacity}
                                onChange={(e) =>
                  updateDailySchedule(idx, scheduleIndex, "capacity", e.target.value)
                }
              />
            </label>  
                                <label>
              attende
              <input
                type="number"
                placeholder="attende"
                className="border rounded px-2 py-1 flex-1"
                value={schedule.attende}
                                onChange={(e) =>
                  updateDailySchedule(idx, scheduleIndex, "attende", e.target.value)
                }
              />
            </label>
          </div>
<h3> Liste des formules</h3>


          {schedule.formulas.map((formula, formulaIndex) => (
            <div
              key={formulaIndex}
              className="flex flex-wrap gap-2 items-center mb-2"
            >
              <label>Formule</label>
<div className="flex flex-col mr-2">
  <label className="text-sm font-medium mb-1">Prix</label>
  <input
    type="number"
    placeholder="Entrez le prix"
    className="border rounded px-2 py-1 w-20"
    value={formula.price}
    onChange={(e) =>
      updateFormula(idx, scheduleIndex, formulaIndex, "price", e.target.value)
    }
  />
</div>

<div className="flex flex-col">
  <label className="text-sm font-medium mb-1">nombre de personnes</label>
  <input
    type="number"
    placeholder="Entrez la nbr"
    className="border rounded px-2 py-1 w-20"
    value={formula.nbr}
    onChange={(e) =>
      updateFormula(idx, scheduleIndex, formulaIndex, "nbr", e.target.value)
    }
  />
</div>

                <button
                  onClick={() => removeFormula(idx, scheduleIndex, formulaIndex)}
                  className="text-red-600 hover:text-red-800"
                  aria-label="Supprimer formule"
                  title="Supprimer formule"
                  type="button"
                >
                  ×
                </button>
            </div>
          ))}
          <button
            onClick={() => addFormula(idx, scheduleIndex)}
            className="text-green-600 hover:text-green-800 mb-1"
            type="button"
          >
            Ajouter une formule
          </button>



        </div>
      ))}

      <button
        onClick={() => addDailySchedule(idx)}
        className="w-full py-2 border rounded text-center hover:bg-gray-100"
        type="button"
      >
        Ajouter un horaire quotidien
      </button>
    </div>
  );
}


  const [openNotification, setOpenNotification] = useState(false);

  const [openSnackbar, setOpenSnackbar] = useState(false);



const [cgv, setCgv] = useState("");
const [accepteEnfants, setAccepteEnfants] = useState(false);
const [accepteBebes, setAccepteBebes] = useState(false);
const [mobiliteReduite, setMobiliteReduite] = useState(false);
const [groupes, setGroupes] = useState(false);
const [animaux, setAnimaux] = useState(false);
const [ageMinimum, setAgeMinimum] = useState('');
  const [activiteSelected, setActiviteSelected] = useState(null);




const [searchTerm, setSearchTerm] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customActivite, setCustomActivite] = useState("");
    const handleCustomClick = () => {
    setShowCustomInput(true);
    setActiviteSelected({ titre: customActivite }); // optionnel, pour préremplir
  };
  const handleAddCustom = () => {
    if (customActivite.trim() === "") return;

    // Ajouter à la liste
    const newAct = { id: Date.now(), titre: customActivite.trim() };
    setListactivites((prev) => [...prev, newAct]);

    // Sélectionner cette activité
    setActiviteSelected(newAct);

    // Réinitialiser le champ
    setCustomActivite("");
    setShowCustomInput(false);
  };


const [instagramVideo, setInstagramVideo] = useState('');
const [instagramVideos, setInstagramVideos] = useState([]);
const handleAddInstagramVideo = () => {
  if (instagramVideo.trim() !== '') {
    setInstagramVideos([...instagramVideos, instagramVideo.trim()]);
    setInstagramVideo('');
  }
};
const handleRemoveInstagramVideo = (index) => {
  const updated = [...instagramVideos];
  updated.splice(index, 1);
  setInstagramVideos(updated);
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
  const navigate = useNavigate();

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
    nonInclus:NonInclusList,
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
    const response = await fetch("https://waw.com.tn/api/events", {
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
            handleOpenSnackbar();

    } else {
      console.log(payload);
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
    const response = await fetch(`https://waw.com.tn/api/events/${id}/upload-images`, {
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
      `https://waw.com.tn/api/events/${id}/upload-videos`,
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

const handleConfirm = async () => {
  setOpenConfirm(false);
  try {
    await handleSubmit(); // ta fonction d’envoi (POST etc)
    // Afficher message succès (optionnel) puis redirection
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
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // mobile breakpoint

  return (
<>      <PageBreadcrumb pageTitle="Ajouter un événement" />
      <div className="space-y-6">
      <PageMeta title="Ajouter un événement" description="Ajouter un événement" />


<div className="rounded-2xl bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6 mt-4 border-l-0">
{!isMobile && (
  <Stepper
    activeStep={step}
    alternativeLabel
    orientation="horizontal"
    sx={{ mb: 4 }}
  >
    {steps.map((stepData, index) => (
      <Step
        key={stepData.label}
        onClick={() => {
          if (index !== step && validateStep()) {
            setStep(index);
          }
        }}
        sx={{
          cursor: "pointer",
          "& .MuiStepIcon-root": {
            color: "#181AD6",
          },
          "& .Mui-completed .MuiStepIcon-root": {
            color: "#AF0B0Cff",
          },
          "& .Mui-active .MuiStepIcon-root": {
            color: "#AF0B0Cff",
          },
        }}
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
)}



          {step  === 0 && (
            <div>
               <div>
    <label
      className={clsx(
        twMerge(
          "mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
        )
      )}
      htmlFor="activityName"
    >
      Décrivez votre activité
    </label>
    <Input
      id="activityName"
      type="text"
      placeholder="Nom de l’activité"
      value={activityName}
      onChange={(e) => setActivityName(e.target.value)}
      className={twMerge(
        "w-full border rounded-md px-3 py-2",
        errors.activityName ? "border-red-500" : "border-gray-300"
      )}
    />
    {errors.activityName && (
      <p className="mt-1 text-sm text-red-500">{errors.activityName}</p>
    )}

    {/* Champ : Description */}
    <label
      className={clsx(
        twMerge(
          "mt-4 mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
        )
      )}
      htmlFor="activityDescription"
    >
      Description
    </label>
    <TextArea
      placeholder="Saisir un texte pour cet article"
      rows={6}
      value={activityDescription}
      onChange={(e) => setActivityDescription(e.target.value)}
      className={twMerge(
        "w-full border rounded-md px-3 py-2",
        errors.activityDescription ? "border-red-500" : "border-gray-300"
      )}
    />
    {errors.activityDescription && (
      <p className="mt-1 text-sm text-red-500">{errors.activityDescription}</p>
    )}
  </div>
              </div>
          )}
          {step  === 1 && (
            <div>
<Typography variant="subtitle1" gutterBottom>
  Définissez votre activité
</Typography>

<Typography variant="body1">Activité principale</Typography>

{/* Champ de recherche sans dropdown */}
<TextField
  label="Rechercher une activité"
  variant="outlined"
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  fullWidth
  sx={{ mb: 2 }}
  error={Boolean(errors.activiteSelected)}
  helperText={errors.activiteSelected}
/>

{/* Boutons filtrés */}
    <Box>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1,
          maxHeight: 300,
          overflowY: "auto",
          p: 1,
          border: "1px solid #e0e0e0",
          borderRadius: 2,
        }}
      >
        {Listactivites
          .filter((act) =>
            act.titre.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .slice(0, 100)
          .map((act) => (
            <Button
              key={act.id}
              variant={activiteSelected?.titre === act.titre ? "contained" : "outlined"}
              type="button"
              onClick={() => {
                setActiviteSelected(act);
                setShowCustomInput(false);
              }}
              sx={{
                flex: "0 0 auto",
                borderColor: "rgb(24, 26, 214)",
                color: activiteSelected?.titre === act.titre ? "#fff" : "rgb(24, 26, 214)",
                backgroundColor:
                  activiteSelected?.titre === act.titre ? "rgb(24, 26, 214)" : "transparent",
                "&:hover": {
                  backgroundColor: "rgba(24, 26, 214, 0.1)",
                  borderColor: "rgb(24, 26, 214)",
                },
              }}
            >
              {act.titre}
            </Button>
          ))}

        {/* Bouton Autre */}
        <Button
          variant={showCustomInput ? "contained" : "outlined"}
          onClick={handleCustomClick}
          type="button"
          sx={{
            flex: "0 0 auto",
            borderColor: "rgb(24, 26, 214)",
            color: showCustomInput ? "#fff" : "rgb(24, 26, 214)",
            backgroundColor: showCustomInput ? "rgb(24, 26, 214)" : "transparent",
            "&:hover": {
              backgroundColor: "rgba(24, 26, 214, 0.1)",
              borderColor: "rgb(24, 26, 214)",
            },
          }}
        >
          Autre
        </Button>
      </Box>

{showCustomInput && (
  <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
    <TextField
      label="Entrez votre activité"
      variant="outlined"
      value={customActivite}
      onChange={(e) => setCustomActivite(e.target.value)}
      sx={{ flex: 1 }}
    />
    <Button
      variant="contained"type="button"
      sx={{ backgroundColor: "rgb(24, 26, 214)" }}
      onClick={async () => {
        if (!customActivite.trim()) return;

        // Préparer le formulaire
        const data = new FormData();
        data.append("titre", customActivite.trim());

        try {
          // Appel POST pour ajouter l'activité
          await axios.post(`https://waw.com.tn/api/activites`, data, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          const newAct = { id: Date.now(), titre: customActivite.trim() };
          setListactivites((prev) => [...prev, newAct]);
          setActiviteSelected(newAct);

          setCustomActivite("");
          setShowCustomInput(false);

          fetchActivities();
        } catch (err) {
          console.error(err);
          alert("Erreur lors de l'ajout de l'activité");
        }
      }}
    >
      Ajouter
    </Button>
  </Box>
)}

    </Box>



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

              
            
            </div>
          )}
          {step  === 2 && (
            <div>

                <Typography variant="subtitle1" gutterBottom>Localisation</Typography>
                <Box sx={{ height: 300, mb: 2 ,borderRadius: 2, overflow: "hidden" }}>
                  <MapContainer center={position} zoom={13} style={{ height: "100%", width: "100%" }}>
                    <TileLayer
                      attribution="&copy; OpenStreetMap"
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationSelector position={position} setPosition={setPosition} setFormData={setFormData} />
                  </MapContainer>
                </Box>
{["rue", "ville", "pays"].map((field) => (
  <div key={field} className="mb-4">
    <label
      htmlFor={field}
      className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-400"
    >
      {field === "rue"
        ? "Rue / Adresse complète"
        : field.charAt(0).toUpperCase() + field.slice(1)}
    </label>
    <Input
      id={field}
      type="text"
      placeholder={
        field === "rue"
          ? "Saisir la rue ou adresse complète"
          : `Saisir la ${field}`
      }
      value={formData[field]}
      onChange={(e) => handleChange(e)}
      className={twMerge(
        "w-full border rounded-md px-3 py-2",
        errors[field] ? "border-red-500" : "border-gray-300"
      )}
    />
    {errors[field] && (
      <p className="mt-1 text-sm text-red-600">{errors[field]}</p>
    )}
  </div>
))}

{geoError && (
  <Typography color="error" sx={{ mb: 2 }}>
    {geoError}
  </Typography>
)}
                <Typography variant="body2">
                  📍 Latitude : {position[0].toFixed(5)} | Longitude : {position[1].toFixed(5)}
                </Typography>
              </div>
          )}

{step === 3 && (

            <div>
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
          variant="contained"type="button"
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
  </div>
)}
          {step  === 4 && (
            <div>
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
            component="span"type="button"
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

  <div className="flex items-center space-x-2">
    <input
      type="text"
      value={instagramVideo}
      onChange={(e) => setInstagramVideo(e.target.value)}
      placeholder="Lien vidéo Instagram"
    onKeyPress={(e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleAddInstagramVideo();
      }
    }}
      className="w-full border px-3 py-2 rounded-md"
    />
    <button
      onClick={handleRemoveInstagramVideo}type="button"
      className="px-3 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700"
    >
      +
    </button>
  </div>
{/* Instagram Input */}
<div>

  {instagramVideos.length > 0 && (
    <div className="mt-4">
      <h3 className="font-semibold mb-2">Vidéos Instagram :</h3>
      <ul className="space-y-2">
        {instagramVideos.map((link, index) => (
          <li
            key={index}
            className="flex items-center justify-between bg-gray-100 px-4 py-2 rounded-md"
          >
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-600 underline break-all"
            >
              {link}
            </a>
            <button
              onClick={() => handleRemoveInstagramVideo(link)}type="button"
              className="ml-4 text-sm text-red-500 hover:underline"
            >
              Supprimer
            </button>
          </li>
        ))}
      </ul>
    </div>
  )}
</div>
<Typography variant="subtitle1" gutterBottom>Liste vidéos depuis YouTube</Typography>
<div className="mt-6">
  <div className="flex items-center space-x-2">
    <input
      type="text"
      value={youtubeVideo}
      onChange={(e) => setYoutubeVideo(e.target.value)}
      placeholder="Lien vidéo YouTube"
    onKeyPress={(e) => {
      if (e.key === 'Enter') handleAddYoutubeVideo();
    }}
      className="w-full border px-3 py-2 rounded-md"
    />
    <button
      onClick={handleAddYoutubeVideo}type="button"
      className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
    >
      +
    </button>
  </div>

  {youtubeVideos.length > 0 && (
    <div className="mt-4">
      <h3 className="font-semibold mb-2">Vidéos YouTube :</h3>
      <ul className="space-y-2">
        {youtubeVideos.map((link, index) => (
          <li
            key={index}
            className="flex items-center justify-between bg-gray-100 px-4 py-2 rounded-md"
          >
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-600 underline break-all"
            >
              {link}
            </a>
            <button
              onClick={() => handleRemoveYoutubeVideo(link)}type="button"
              className="ml-4 text-sm text-red-500 hover:underline"
            >
              Supprimer
            </button>
          </li>
        ))}
      </ul>
    </div>
  )}
</div>

            </div>
          )}

          {step  === 5 && (
            <div>
                  <div>
      <h2 className="text-xl font-semibold mb-4">Horaires Normaux</h2>
      {scheduleRanges.map(renderScheduleRangeNormal)}
      <button
        onClick={addScheduleRange}
        className="w-full py-3 bg-blue-600 text-white rounded hover:bg-blue-700 mb-10"
        type="button"
      >
        Ajouter une nouvelle plage complète
      </button>
    </div>
          
            </div>
          )}
          {step  === 6 && (
            <div>
               <div className="space-y-6 max-w-md mx-auto">
    {/* Inclus */}
    <div>
      <h3 className="text-lg font-semibold mb-2">Inclus</h3>
      <div className="flex space-x-2 mb-2">
        <input
          type="text"
          placeholder="Ajouter un inclus"
          value={newEquipment}
          onChange={(e) => setNewEquipment(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && newEquipment.trim() && handleAddEquipment()}
          className="flex-1 border border-gray-300 rounded px-3 py-2"
        />
        <button
          onClick={handleAddEquipment}
          disabled={!newEquipment.trim()}type="button"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          +
        </button>
      </div>


      {equipmentToBring.length > 0 && (
        <ul className="space-y-2">
          {equipmentToBring.map((item, index) => (
            <li
              key={index}
              className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded"
            >
              <span>{item}</span>
              <button
                onClick={() => handleRemoveEquipment(index)}type="button"
                className="text-red-600 hover:underline text-sm"
              >
                Supprimer
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>

    <hr className="border-gray-300" />
    <div>
      <h3 className="text-lg font-semibold mb-2">Non Inclus</h3>
      <div className="flex space-x-2 mb-2">
        <input
          type="text"
          placeholder="Ajouter un Non inclus"
          value={NonInclus}
          onChange={(e) => setNonInclus(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && NonInclus.trim() && handleAddNonInclus()}
          className="flex-1 border border-gray-300 rounded px-3 py-2"
        />
        <button
          onClick={handleAddNonInclus}type="button"
          disabled={!NonInclus.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          +
        </button>
      </div>
      

      {NonInclusList.length > 0 && (
        <ul className="space-y-2">
          {NonInclusList.map((item, index) => (
            <li
              key={index}
              className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded"
            >
              <span>{item}</span>
              <button
                onClick={() => handleRemoveNonInclus(index)}type="button"
                className="text-red-600 hover:underline text-sm"
              >
                Supprimer
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>

    <hr className="border-gray-300" />

    {/* Extras */}
    <div>
      <h3 className="text-lg font-semibold mb-2">Extras</h3>
      <div className="flex space-x-2 mb-2">
        <input
          type="text"
          placeholder="Nom"
          value={newDocumentName}
          onChange={(e) => setNewDocumentName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && newDocumentName.trim() && newDocumentPrice) {
              handleAddDocument();
            }
          }}
          className="flex-1 border border-gray-300 rounded px-3 py-2"
        />
        <input
          type="number"
          placeholder="Prix"
          value={newDocumentPrice}
          onChange={(e) => setNewDocumentPrice(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && newDocumentName.trim() && newDocumentPrice) {
              handleAddDocument();
            }
          }}
          className="w-24 border border-gray-300 rounded px-3 py-2"
          min="0"
          step="0.01"
        />
        <button
          onClick={handleAddDocument}type="button"
          disabled={!newDocumentName.trim() || !newDocumentPrice}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          +
        </button>
      </div>

      {documentToProvide.length > 0 && (
        <ul className="space-y-2">
          {documentToProvide.map((item, index) => (
            <li
              key={index}
              className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded"
            >
              <span>{item.name} - {parseFloat(item.price).toFixed(2)} TND</span>
              <button
                onClick={() => handleRemoveDocument(index)}type="button"
                className="text-red-600 hover:underline text-sm"
              >
                Supprimer
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>
              
            </div>
          )}
          {step  === 7 && (
            <div>
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
              <TextField
                fullWidth
                multiline
                rows={8}
                placeholder="Vos conditions générales de vente (la saisie des CGV est obligatoire pour pouvoir vendre en ligne)"
                variant="outlined"
                  value={cgv}
  onChange={(e) => setCgv(e.target.value)}
              />
            </div>
          )}
            {/* Navigation */}
  <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
    <Button disabled={step === 0} onClick={handleBack} type="button">
      Précédent
    </Button>
    {step < steps.length - 1 ? (
<Button
  variant="contained"type="button"
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
      setOpenConfirm(true);
    }
  }}
>
  Terminer
</Button>
    )}
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
    <Button onClick={() => setOpenConfirm(false)} type="button">Annuler</Button>
    <Button variant="contained" color="primary" onClick={handleConfirm}>Confirmer</Button>
  </DialogActions>
</Dialog>
</div>
      </div>

</>
  );
}