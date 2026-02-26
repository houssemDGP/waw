import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import React, { useState , useEffect} from 'react';
import { Modal } from "../../ui/modal";
import axios from "axios";
import Badge from "../../ui/badge/Badge";
import dayjs from "dayjs";
import "dayjs/locale/fr";  // si tu veux le format français
dayjs.locale("fr");
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import Button from "../../ui/button/Button";
import { Link } from "react-router-dom";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import Input from "../../form/input/InputField";
import TextArea from "../../form/input/TextArea";
import {
Divider,Grid,
  Typography,IconButton,Box,FormControl ,RadioGroup ,FormControlLabel ,Radio ,Autocomplete ,TextField ,Chip
 
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS
import L from 'leaflet';
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CircularProgress from "@mui/material/CircularProgress";

  const paymentOptions = ['Carte bancaire', 'Espèces', 'Virement', 'Chèque','Autres'];
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
type AdminStatus = "ACTIVE" | "BLOCKED";

dayjs.extend(isSameOrBefore);
function EventDetailModal({ isOpen, onClose, event }) {
  if (!isOpen || !event) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] p-6">
      <div className="no-scrollbar relative w-full max-w-5xl overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{event.nom}</h2>
        </div>
        {/* Images */}
        <div className="mb-4 flex gap-2 overflow-x-auto">
          {event.imageUrls.map((url, idx) => (
            <img key={idx} src={`https://waw.com.tn/api${url}`} alt={`${event.nom} image ${idx + 1}`} className="w-32 h-20 object-cover rounded" />
          ))}
        </div>
        {/* Description */}
        <p className="mb-4 text-gray-700 dark:text-gray-300">{event.description}</p>
        {/* Infos générales */}
        <div className="mb-4 grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div><strong>Ville:</strong> {event.ville}</div>
          <div><strong>Pays:</strong> {event.pays}</div>
          <div><strong>Adresse:</strong> {event.rue}</div>
          <div><strong>Âge minimum:</strong> {event.ageMinimum} ans</div>
          <div><strong>Accepte enfants:</strong> {event.accepteEnfants ? "Oui" : "Non"}</div>
          <div><strong>Accepte bébés:</strong> {event.accepteBebes ? "Oui" : "Non"}</div>
          <div><strong>Animaux:</strong> {event.animaux ? "Oui" : "Non"}</div>
          <div><strong>Langues:</strong> {event.languages.join(", ")}</div>
          <div><strong>Équipements inclus:</strong> {event.includedEquipments.join(", ")}</div>
          <div><strong>Moyens de paiement:</strong> {event.paymentMethods.join(", ")}</div>
        </div>
        {event.nonInclus.length > 0 && (
          <div className="mb-4">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-2">nonInclus</h3>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
              {event.nonInclus.map(nonInclu => (
                <li>{nonInclu}</li>
              ))}
            </ul>
          </div>
        )}        {event.extras.length > 0 && (
          <div className="mb-4">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Extras</h3>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
              {event.extras.map(extra => (
                <li key={extra.id}>{extra.titre} — {extra.prix}TND</li>
              ))}
            </ul>
          </div>
        )}
        {/* Horaires */}
        <div>
          <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Horaires Normaux</h3>
          {event.scheduleRanges.map((range, i) => (
            <div key={i} className="mb-3 p-3 border rounded">
              <div><strong>Période:</strong> {range.startDate} au {range.endDate}</div>
              {range.dailySchedules.map((schedule, j) => (
                <div key={j} className="ml-4">
                  <div>{schedule.startTime} - {schedule.endTime}</div>
                  <ul className="list-disc list-inside">
                    <strong>formulas</strong>
                    {schedule.formulas.map((formula, k) => (
                      <li key={k}>{formula.label}: {formula.price}TND (Capacité: {formula.capacity ?? "N/A"} )(attende: {formula.attende ?? "N/A"} )</li>
                    ))}
                    <strong>Packs</strong>
                                        {schedule.packs.map((pack, k) => (
                      <li key={k}>{pack.label}, nbr de personnes {pack.nbr}: {pack.price}TND (Capacité: {pack.capacity ?? "N/A"} )(attende: {pack.attende ?? "N/A"} )</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}
function EventEditModal({ isOpen, onClose, event }) {
  if (!isOpen || !event) return null;
const [activityName, setActivityName] = useState(event.nom);
  const [activityDescription, setActivityDescription] = useState(event.description);
    const [position, setPosition] = useState([event.latitude,event.longitude]); 
  const [searchQuery, setSearchQuery] = useState("");
      const [formData, setFormData] = useState({
    rue: event.rue,
    ville:event.ville,
    pays: event.pays,
  });
        const [errors, setErrors] = useState({});
  const [geoError, setGeoError] = useState(null);
const [imagesFiles, setImagesFiles] = useState(event.imageUrls); // fichiers images sélectionnés
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
  const [instagramVideo, setInstagramVideo] = useState('');
const [instagramVideos, setInstagramVideos] = useState(event.videosInstagram);
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
const [youtubeVideos, setYoutubeVideos] = useState(event.videosYoutube);
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
  const [equipmentToBring, setEquipmentToBring] = useState(event.includedEquipments);

  const [newEquipment, setNewEquipment] = useState('');
  const [newDocumentName, setNewDocumentName] = useState('');
const [newDocumentPrice, setNewDocumentPrice] = useState('');
const [documentToProvide, setDocumentToProvide] = useState(event.extras);
const handleAddDocument = () => {
  if (newDocumentName.trim() !== '' && newDocumentPrice !== '') {
    const newExtra = {
      titre: newDocumentName.trim(),
      prix: parseFloat(newDocumentPrice)
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
    const [newDocument, setNewDocument] = useState('');
const [cgv, setCgv] = useState(event.cgv);
const [accepteEnfants, setAccepteEnfants] = useState(event.accepteEnfants);
const [accepteBebes, setAccepteBebes] = useState(event.accepteBebes);
const [mobiliteReduite, setMobiliteReduite] = useState(event.mobiliteReduite);
const [groupes, setGroupes] = useState(event.groupes);
const [animaux, setAnimaux] = useState(event.animaux);
const [ageMinimum, setAgeMinimum] = useState(event.ageMinimum);
const [selectedPayments, setSelectedPayments] = useState(event.paymentMethods);
  const [languages, setLanguages] = useState(event.languages);
  const [Listactivites, setListactivites] = useState([]);
useEffect(() => {
  setLoading(true);
  fetch("https://waw.com.tn/api/activites")
    .then((res) => res.json())
    .then((data) => {
      setListactivites(data);
    })
    .catch((err) => console.error("❌ Fetch error:", err))
    .finally(() => setLoading(false));
}, []);

useEffect(() => {
}, [Listactivites]);

  const [activiteSelected, setActiviteSelected] = useState(null);

const [allCategories, setAllCategories] = useState([]);
const [selectedCategories, setSelectedCategories] = useState([]);
const [selectedSubCategories, setSelectedSubCategories] = useState({});
  useEffect(() => {
    setLoading(true); // start loading
    fetch("https://waw.com.tn/api/categories")
      .then((res) => res.json())
      .then((data) => {
        setAllCategories(data);
      })
      .catch((err) => console.error("❌ Fetch error:", err))
      .finally(() => setLoading(false)); // stop loading
  }, []);

// handle changement sous-catégorie
const handleSubCategoryChange = (catId, newSubList) => {
  setSelectedSubCategories((prev) => ({
    ...prev,
    [catId]: newSubList,
  }));
};
  // Gérer ajout et suppression en même temps via onChange
  const handleLanguageChange = (event, newValue) => {
    setLanguages(newValue);
  };

  // Supprimer un chip
  const handleLanguageDelete = (languageToDelete) => () => {
    setLanguages((langs) => langs.filter((lang) => lang !== languageToDelete));
  };


    const [loading, setLoading] = useState(false);
const buildUpdatedEvent = () => {
  const updatedEvent = {};

  if (activityName !== event.nom) updatedEvent.nom = activityName;
  if (activityDescription !== event.description) updatedEvent.description = activityDescription;
  if (position[0] !== event.latitude) updatedEvent.latitude = position[0];
  if (position[1] !== event.longitude) updatedEvent.longitude = position[1];

  ["rue", "ville", "pays"].forEach((field) => {
    if (formData[field] !== event[field]) updatedEvent[field] = formData[field];
  });

  if (instagramVideos !== event.videosInstagram) updatedEvent.videosInstagram = instagramVideos;
  if (youtubeVideos !== event.videosYoutube) updatedEvent.videosYoutube = youtubeVideos;

  if (equipmentToBring !== event.includedEquipments) updatedEvent.includedEquipments = equipmentToBring;
  if (documentToProvide !== event.extras) updatedEvent.extras = documentToProvide;

  if (activiteSelected && activiteSelected.id !== event.activite?.id) updatedEvent.activite = { id: activiteSelected.id };
  if (selectedCategories !== event.categories) updatedEvent.categories = selectedCategories.map(c => ({ id: c.id }));
  if (Object.keys(selectedSubCategories).length > 0) {
    updatedEvent.subCategories = Object.values(selectedSubCategories).flat().map(sc => ({ id: sc.id }));
  }

  if (mobiliteReduite !== event.mobiliteReduite) updatedEvent.mobiliteReduite = mobiliteReduite;
  if (groupes !== event.groupes) updatedEvent.groupes = groupes;
  if (animaux !== event.animaux) updatedEvent.animaux = animaux;
  if (selectedPayments !== event.paymentMethods) updatedEvent.paymentMethods = selectedPayments;
  if (languages !== event.languages) updatedEvent.languages = languages;
  if (cgv !== event.cgv) updatedEvent.cgv = cgv;
  if (ageMinimum !== event.ageMinimum) updatedEvent.ageMinimum = ageMinimum;
  if (accepteEnfants !== event.accepteEnfants) updatedEvent.accepteEnfants = accepteEnfants;
  if (accepteBebes !== event.accepteBebes) updatedEvent.accepteBebes = accepteBebes;

  return updatedEvent;
};
const handleSave = async () => {
  const updatedEvent = buildUpdatedEvent();
  
  if (Object.keys(updatedEvent).length === 0) {
    console.log("Aucun champ modifié");
    return;
  }

  try {
    const response = await fetch(`https://waw.com.tn/api/events/${event.id}`, {
      method: "PUT", // ou PATCH si backend supporte
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedEvent),
    });

    if (!response.ok) throw new Error("Erreur lors de la mise à jour");

    const data = await response.json();
    onClose(); // fermer le modal
  } catch (err) {
    console.error(err);
  }
};

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] p-6">
      <div className="no-scrollbar relative w-full max-w-5xl overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{event.nom}</h2>
        </div>
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
         "border-gray-300"
      )}
    />


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
         "border-gray-300"
      )}
    />

  </div>
              </div>
                <div>
<Typography variant="subtitle1" gutterBottom>Définissez votre activité</Typography>

    <Typography variant="body1">Activité principale</Typography>

 <Autocomplete
      options={Listactivites}
      getOptionLabel={(option) => option.titre || option.nom || ""}
      value={activiteSelected}
      onChange={(event, newValue) => setActiviteSelected(newValue)}
      loading={loading} // 👈 tells MUI it's loading
      renderInput={(params) => (
        <TextField
          {...params}
          label="Sélectionnez une activité principale"
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
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

              
            
            </div>
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
  const imgUrl = `https://waw.com.tn/api${file}`;

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
      onClick={handleAddInstagramVideo}
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
              onClick={() => handleRemoveInstagramVideo(link)}
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
      onClick={handleAddYoutubeVideo}
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
              onClick={() => handleRemoveYoutubeVideo(link)}
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
          disabled={!newEquipment.trim()}
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
                onClick={() => handleRemoveEquipment(index)}
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
          onClick={handleAddDocument}
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
              <span>{item.titre} - {parseFloat(item.prix).toFixed(2)} TND</span>
              <button
                onClick={() => handleRemoveDocument(index)}
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




<div className="flex justify-end mt-6 space-x-3">
  <Button
    variant="outlined"
    onClick={onClose}
    sx={{ bgcolor: "#f0f0f0", "&:hover": { bgcolor: "#e0e0e0" } }}
  >
    Annuler
  </Button>

  <Button
    variant="contained"
    onClick={handleSave}
    sx={{ bgcolor: "#181AD6", "&:hover": { bgcolor: "#1210A0" } }}
  >
    Enregistrer
  </Button>
</div>






      </div>
    </Modal>
  );
}
const defaultScheduleRangeExceptions = [
  {
    id: 1,
    startDate: "2025-08-01",
    endDate: "2025-08-01",
    reason: "Exception pour test",
    dailyScheduleExceptions: [
      {
        id: 1,
        startTime: "09:00",
        endTime: "11:00",
        formulas: [
          {
            id: 1,
            label: "Matinée spéciale",
            price: 25,
            capacity: 15
          }
        ]
      }
    ]
  },
  {
    id: 2,
    startDate: "2025-08-15",
    endDate: "2025-08-15",
    reason: "Jour férié",
    dailyScheduleExceptions: [
      {
        id: 2,
        startTime: "14:00",
        endTime: "17:00",
        formulas: [
          {
            id: 2,
            label: "Formule après-midi",
            price: 30,
            capacity: 12
          }
        ]
      }
    ]
  }
];
export default function BackOfficeVendeurEvents() {
  const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch(`https://waw.com.tn/api/events`);
        if (!res.ok) throw new Error("Erreur de récupération des événements");
        const data = await res.json();

        // Optionnel : Mapper/adapter les données si nécessaire (exemple simplifié)
        setEvents(data);
      } catch (e: any) {
        setError(e.message || "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);
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
function renderScheduleRangeNormalEditable(range, idx, {
  updateScheduleRange,
  removeScheduleRange,
  updateDailySchedule,
  removeDailySchedule,
  updateFormula,
  removeFormula,
  addFormula,

  addDailySchedule,
  scheduleRangesLength,
}) {
  // Définit selectedDays localement, avec fallback
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

  return (
    <div key={idx} className="mb-6 p-4 border border-gray-300 rounded-lg relative">
      {scheduleRangesLength > 1 && (
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
          className="mb-4 p-3 border border-gray-200 rounded relative"
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
          </div>

          {schedule.formulas.map((formula, formulaIndex) => (
            <div
              key={formulaIndex}
              className="flex flex-wrap gap-2 items-center mb-2"
            >
              <input
                type="text"
                placeholder="Label (ex: Solo)"
                className="border rounded px-2 py-1 flex-1"
                value={formula.label}
                onChange={(e) =>
                  updateFormula(idx, scheduleIndex, formulaIndex, "label", e.target.value)
                }
              />
              <input
                type="number"
                placeholder="Prix"
                className="border rounded px-2 py-1 w-20"
                value={formula.price}
                onChange={(e) =>
                  updateFormula(idx, scheduleIndex, formulaIndex, "price", e.target.value)
                }
              />
              <input
                type="number"
                placeholder="Capacité"
                className="border rounded px-2 py-1 w-20"
                value={formula.capacity}
                onChange={(e) =>
                  updateFormula(idx, scheduleIndex, formulaIndex, "capacity", e.target.value)
                }
              />
              <input
                type="number"
                placeholder="attende"
                className="border rounded px-2 py-1 w-20"
                value={formula.attende}
                onChange={(e) =>
                  updateFormula(idx, scheduleIndex, formulaIndex, "attende", e.target.value)
                }
              />
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
<h3> Packs</h3>
                    {schedule.packs.map((pack, packIndex) => (
            <div
              key={packIndex}
              className="flex flex-wrap gap-2 items-center mb-2"
            >
              <input
                type="text"
                placeholder="Label (ex: Solo)"
                className="border rounded px-2 py-1 flex-1"
                value={pack.label}
                onChange={(e) =>
                  updatePack(idx, scheduleIndex, packIndex, "label", e.target.value)
                }
              />
              <input
                type="number"
                placeholder="nbr"
                className="border rounded px-2 py-1 w-20"
                value={pack.nbr}
                onChange={(e) =>
                  updatePack(idx, scheduleIndex, packIndex, "nbr", e.target.value)
                }
              />
              <input
                type="number"
                placeholder="Prix"
                className="border rounded px-2 py-1 w-20"
                value={pack.price}
                onChange={(e) =>
                  updatePack(idx, scheduleIndex, packIndex, "price", e.target.value)
                }
              />
              <input
                type="number"
                placeholder="Capacité"
                className="border rounded px-2 py-1 w-20"
                value={pack.capacity}
                onChange={(e) =>
                  updatePack(idx, scheduleIndex, packIndex, "capacity", e.target.value)
                }
              />
              <input
                type="number"
                placeholder="attende"
                className="border rounded px-2 py-1 w-20"
                value={pack.attende}
                onChange={(e) =>
                  updatePack(idx, scheduleIndex, packIndex, "attende", e.target.value)
                }
              />
                <button
                  onClick={() => removePack(idx, scheduleIndex, packIndex)}
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
  onClick={() => addPack(idx, scheduleIndex)}  
  className="text-green-600 hover:text-green-800 mb-1"
  type="button"
>
  Ajouter un pack
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
const WEEK_DAYS = [
  { label: "Lun", value: "MONDAY" },
  { label: "Mar", value: "TUESDAY" },
  { label: "Mer", value: "WEDNESDAY" },
  { label: "Jeu", value: "THURSDAY" },
  { label: "Ven", value: "FRIDAY" },
  { label: "Sam", value: "SATURDAY" },
  { label: "Dim", value: "SUNDAY" },
];

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
function renderScheduleRangeExceptionnelEditable(
  range,
  idx,
  {
    updateScheduleRangeExcep,
    removeScheduleRangeExcep,
    updateDailyScheduleExcep,
    removeDailyScheduleExcep,
    updateFormulaExcep,
    removeFormulaExcep,
    addFormulaExcep,
    addDailyScheduleExcep,
    scheduleRangesExceptionnelsLength,
  }
) {
  const selectedDays = Array.isArray(range.selectedDays) ? range.selectedDays : [];
  const selectedExclureDates = Array.isArray(range.selectedExclureDates) ? range.selectedExclureDates : [];

  const toggleDay = (dayValue) => {
    const updated = selectedDays.includes(dayValue)
      ? selectedDays.filter((d) => d !== dayValue)
      : [...selectedDays, dayValue];
    updateScheduleRangeExcep(idx, "selectedDays", updated);
  };

  const selectAllDays = () => {
    updateScheduleRangeExcep(idx, "selectedDays", WEEK_DAYS.map((d) => d.value));
  };

  const resetDays = () => {
    updateScheduleRangeExcep(idx, "selectedDays", []);
  };

  // ✅ Dates à exclure
  const datesInRange =
    range.startDate && range.endDate
      ? getAllDatesBetween(range.startDate, range.endDate)
      : [];

  const toggleDateExcep = (date) => {
    const updated = selectedExclureDates.includes(date)
      ? selectedExclureDates.filter((d) => d !== date)
      : [...selectedExclureDates, date];
    updateScheduleRangeExcep(idx, "selectedExclureDates", updated);
  };

  return (
    <div key={idx} className="mb-6 p-4 border border-gray-300 rounded-lg relative">
      {scheduleRangesExceptionnelsLength > 1 && (
        <button
          onClick={() => removeScheduleRangeExcep(idx)}
          className="absolute top-2 right-2 text-red-600 hover:text-red-800"
          title="Supprimer plage"
          type="button"
        >
          Supprimer
        </button>
      )}

      {/* Sélection période */}
      <div className="mb-3 flex flex-wrap gap-2 items-center">
        <label>
          Du{" "}
          <input
            type="date"
            className="border rounded px-2 py-1"
            value={range.startDate}
            onChange={(e) => updateScheduleRangeExcep(idx, "startDate", e.target.value)}
          />
        </label>
        <label>
          au{" "}
          <input
            type="date"
            className="border rounded px-2 py-1"
            value={range.endDate}
            onChange={(e) => updateScheduleRangeExcep(idx, "endDate", e.target.value)}
          />
        </label>
      </div>

      {/* ✅ Sélection dates à exclure */}
      <div className="mb-3 max-h-40 overflow-auto border rounded p-2">
        <strong>Sélectionnez les dates à exclure :</strong>
        <div className="flex flex-wrap gap-2 mt-1">
          {datesInRange.map(date => (
            <label key={date} className="inline-flex items-center gap-1">
              <input
                type="checkbox"
                checked={selectedExclureDates.includes(date)}
                onChange={() => toggleDateExcep(date)}
                className="form-checkbox"
              />
              <span>{date}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Jours sélectionnés */}
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

      {/* Résumé */}
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

      {/* Horaires + Formules */}
      {range.dailyScheduleExceptions.map((schedule, scheduleIndex) => (
        <div key={scheduleIndex} className="mb-4 p-3 border border-gray-200 rounded relative">
          {range.dailyScheduleExceptions.length > 1 && (
            <button
              onClick={() => removeDailyScheduleExcep(idx, scheduleIndex)}
              className="absolute top-1 right-1 text-red-600 hover:text-red-800"
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
                  updateDailyScheduleExcep(idx, scheduleIndex, "startTime", e.target.value)
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
                  updateDailyScheduleExcep(idx, scheduleIndex, "endTime", e.target.value)
                }
              />
            </label>
          </div>

          {schedule.formulas.map((formula, formulaIndex) => (
            <div key={formulaIndex} className="flex flex-wrap gap-2 items-center mb-2">
              <input
                type="text"
                placeholder="Label (ex: Solo)"
                className="border rounded px-2 py-1 flex-1"
                value={formula.label}
                onChange={(e) =>
                  updateFormulaExcep(idx, scheduleIndex, formulaIndex, "label", e.target.value)
                }
              />
              <input
                type="number"
                placeholder="Prix"
                className="border rounded px-2 py-1 w-20"
                value={formula.price}
                onChange={(e) =>
                  updateFormulaExcep(idx, scheduleIndex, formulaIndex, "price", e.target.value)
                }
              />
              <input
                type="number"
                placeholder="Capacité"
                className="border rounded px-2 py-1 w-20"
                value={formula.capacity}
                onChange={(e) =>
                  updateFormulaExcep(idx, scheduleIndex, formulaIndex, "capacity", e.target.value)
                }
              />
              {schedule.formulas.length > 1 && (
                <button
                  onClick={() => removeFormulaExcep(idx, scheduleIndex, formulaIndex)}
                  className="text-red-600 hover:text-red-800"
                  title="Supprimer formule"
                  type="button"
                >
                  Supprimer
                </button>
              )}
            </div>
          ))}

          <button
            onClick={() => addFormulaExcep(idx, scheduleIndex)}
            className="text-green-600 hover:text-green-800 mb-1"
            type="button"
          >
            Ajouter une formule
          </button>
        </div>
      ))}

      <button
        onClick={() => addDailyScheduleExcep(idx)}
        className="w-full py-2 border rounded text-center hover:bg-gray-100"
        type="button"
      >
        Ajouter un horaire quotidien
      </button>
    </div>
  );
}

const cleanScheduleRanges = (ranges) => {
  return ranges.map(range => {
    const { id, ...rangeWithoutId } = range; // supprime id de range
    return {
      ...rangeWithoutId,
      dailySchedules: range.dailySchedules?.map(daily => {
        const { id, ...dailyWithoutId } = daily; // supprime id de dailySchedules
        return {
          ...dailyWithoutId,
          formulas: daily.formulas?.map(formula => {
            const { id, ...formulaWithoutId } = formula; // supprime id de formulas
            return { ...formulaWithoutId };
          }) || [],
        };
      }) || [],
    };
  });
};
    const handleSaveSchedules = async () => {
      try {
    // Send updated event to backend
    await axios.put(`https://waw.com.tn/api/schedule-ranges/event/${selectedEvent.id}`, selectedNormalSchedules);

    // Update local state
    setEvents((prev) =>
      prev.map((ev) => (ev.id === selectedEvent.id ? selectedEvent : ev))
    );
    setSelectedEvent(selectedEvent);
    setShowNormalModal(false);
  } catch (error) {
    console.error("Erreur lors de la mise à jour :", error);
  }
    console.log('Sauvegarder horaires pour événement:', selectedEvent.id);
    console.log(cleanScheduleRanges(selectedNormalSchedules));
  };
const handleSaveScheduleExceptions = async () => {
  try {
    await axios.put(
      `https://waw.com.tn/api/schedule-range-exceptions/event/${selectedEvent.id}`,
      cleanScheduleRangeExceptions(selectedExceptionSchedules)
    );

    setEvents((prev) =>
      prev.map((ev) =>
        ev.id === selectedEvent.id
          ? { ...ev, selectedExceptionSchedules }
          : ev
      )
    );

    setSelectedEvent((prev) => ({
      ...prev,
      selectedExceptionSchedules,
    }));

setShowExceptionModal(false);
  } catch (error) {
    console.log(selectedEvent.id);
    console.log(cleanScheduleRangeExceptions(selectedExceptionSchedules));
    console.error("Erreur lors de la mise à jour des exceptions :", error);
  }
};
function cleanScheduleRangeExceptions(data) {
  return data.map(range => ({
    // Ne PAS inclure l'id pour forcer création
    startDate: range.startDate,
    endDate: range.endDate,
        selectedDays:range.selectedDays,
selectedExclureDates:range.selectedExclureDates,
    reason: range.reason || null,
    dailyScheduleExceptions: (range.dailyScheduleExceptions || []).map(daily => ({
      // pas d'id non plus ici
      startTime: daily.startTime,
      endTime: daily.endTime,
      formulas: (daily.formulas || []).map(formula => ({
        // idem pas d'id
        label: formula.label || "",
        price: Number(formula.price) || 0,
        capacity: Number(formula.capacity) || 0,
        attende: Number(formula.attende) || 0,
      })),
    })),
  }));
}


  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
    const [selectedEvent2, setSelectedEvent2] = useState(null);

function handleVoirDetails(event: EventDetail) {
  setSelectedEvent(event);
  setShowDetailModal(true);
}
  const [editEvent, setEditEvent] = useState(null);




    const [showNormalModal, setShowNormalModal] = useState(false);
    const [showDetailsModal, setshowDetailsModal] = useState(false);
const [showExceptionModal, setShowExceptionModal] = useState(false);
const [selectedNormalSchedules, setSelectedNormalSchedules] = useState<ScheduleRange[]>([]);
const [selectedExceptionSchedules, setSelectedExceptionSchedules] = useState([]);
const [staticRanges, setStaticRanges] = useState<ScheduleRange[]>([]);

 const addScheduleRange = () => {
    setSelectedNormalSchedules((prev) => [
      ...prev,
      {
        startDate: "",
        endDate: "",
        dailySchedules: [
          {
            startTime: "",
            endTime: "",
            formulas: [{ label: "", price: 0, capacity: 0,attende: 0 }],
            packs: [{ label: "",nbr:0, price: 0, capacity: 0,attende: 0 }],

          },
        ],
      },
    ]);
  };
  const addScheduleRangeException = () => {
  setSelectedExceptionSchedules((prev) => [
    ...prev,
    {
      startDate: "",
      endDate: "",
      dailyScheduleExceptions: [
        {
          startTime: "",
          endTime: "",
          formulas: [{ label: "", price: 0, capacity: 0, }],
        },
      ],
    },
  ]);
};
const updateScheduleRange = (idx: number, field: string, value: string) => {
  const updated = [...selectedNormalSchedules];
  updated[idx] = { ...updated[idx], [field]: value };
  setSelectedNormalSchedules(updated);
};

const removeScheduleRange = (idx: number) => {
  const updated = selectedNormalSchedules.filter((_, i) => i !== idx);
  setSelectedNormalSchedules(updated);
};

const updateDailySchedule = (rangeIdx: number, dailyIdx: number, field: string, value: string) => {
  const updated = [...selectedNormalSchedules];
  updated[rangeIdx].dailySchedules[dailyIdx] = {
    ...updated[rangeIdx].dailySchedules[dailyIdx],
    [field]: value,
  };
  setSelectedNormalSchedules(updated);
};

const removeDailySchedule = (rangeIdx: number, dailyIdx: number) => {
  const updated = [...selectedNormalSchedules];
  updated[rangeIdx].dailySchedules = updated[rangeIdx].dailySchedules.filter((_, i) => i !== dailyIdx);
  setSelectedNormalSchedules(updated);
};

const updateFormula = (rangeIdx: number, dailyIdx: number, formulaIdx: number, field: string, value: string | number) => {
  const updated = [...selectedNormalSchedules];
  updated[rangeIdx].dailySchedules[dailyIdx].formulas[formulaIdx] = {
    ...updated[rangeIdx].dailySchedules[dailyIdx].formulas[formulaIdx],
    [field]: value,
  };
  setSelectedNormalSchedules(updated);
};

const removeFormula = (rangeIdx: number, dailyIdx: number, formulaIdx: number) => {
  const updated = [...selectedNormalSchedules];
  updated[rangeIdx].dailySchedules[dailyIdx].formulas = updated[rangeIdx].dailySchedules[dailyIdx].formulas.filter((_, i) => i !== formulaIdx);
  setSelectedNormalSchedules(updated);
};

const addPack = (rangeIdx: number, dailyIdx: number) => {
  const updated = [...selectedNormalSchedules];
  updated[rangeIdx].dailySchedules[dailyIdx].packs.push({ label: "",nbr:0, price: 0, capacity: 0 });
  setSelectedNormalSchedules(updated);
};
const updatePack = (rangeIdx: number, dailyIdx: number, formulaIdx: number, field: string, value: string | number) => {
  const updated = [...selectedNormalSchedules];
  updated[rangeIdx].dailySchedules[dailyIdx].packs[formulaIdx] = {
    ...updated[rangeIdx].dailySchedules[dailyIdx].packs[formulaIdx],
    [field]: value,
  };
  setSelectedNormalSchedules(updated);
};

const removePack = (rangeIdx: number, dailyIdx: number, formulaIdx: number) => {
  const updated = [...selectedNormalSchedules];
  updated[rangeIdx].dailySchedules[dailyIdx].packs = updated[rangeIdx].dailySchedules[dailyIdx].packs.filter((_, i) => i !== formulaIdx);
  setSelectedNormalSchedules(updated);
};

const addFormula = (rangeIdx: number, dailyIdx: number) => {
  const updated = [...selectedNormalSchedules];
  updated[rangeIdx].dailySchedules[dailyIdx].formulas.push({ label: "", price: 0, capacity: 0 });
  setSelectedNormalSchedules(updated);
};
const addDailySchedule = (rangeIdx: number) => {
  const updated = [...selectedNormalSchedules];
  updated[rangeIdx].dailySchedules.push({
    startTime: "",
    endTime: "",
    formulas: [{ label: "", price: 0, capacity: 0 ,attende : 0}],
    packs: [{ label: "", nbr:0,price: 0, capacity: 0 ,attende : 0}],

  });
  setSelectedNormalSchedules(updated);
};
const updateScheduleRangeExcep = (idx: number, field: string, value: string) => {
  const updated = [...selectedExceptionSchedules];
  updated[idx] = { ...updated[idx], [field]: value };
  setSelectedExceptionSchedules(updated);
};

const removeScheduleRangeExcep = (idx: number) => {
  const updated = selectedExceptionSchedules.filter((_, i) => i !== idx);
  setSelectedExceptionSchedules(updated);
};

const updateDailyScheduleExcep = (
  rangeIdx: number,
  dailyIdx: number,
  field: string,
  value: string
) => {
  const updated = [...selectedExceptionSchedules];
  const dailyList = updated[rangeIdx].dailyScheduleExceptions || [];

  dailyList[dailyIdx] = {
    ...dailyList[dailyIdx],
    [field]: value,
  };

  updated[rangeIdx].dailyScheduleExceptions = dailyList;
  setSelectedExceptionSchedules(updated);
};

const removeDailyScheduleExcep = (rangeIdx: number, dailyIdx: number) => {
  const updated = [...selectedExceptionSchedules];
  updated[rangeIdx].dailyScheduleExceptions = updated[rangeIdx].dailyScheduleExceptions.filter(
    (_, i) => i !== dailyIdx
  );
  setSelectedExceptionSchedules(updated);
};

const updateFormulaExcep = (
  rangeIdx: number,
  dailyIdx: number,
  formulaIdx: number,
  field: string,
  value: string | number
) => {
  const updated = [...selectedExceptionSchedules];
  updated[rangeIdx].dailyScheduleExceptions[dailyIdx].formulas[formulaIdx] = {
    ...updated[rangeIdx].dailyScheduleExceptions[dailyIdx].formulas[formulaIdx],
    [field]: value,
  };
  setSelectedExceptionSchedules(updated);
};

const removeFormulaExcep = (rangeIdx: number, dailyIdx: number, formulaIdx: number) => {
  const updated = [...selectedExceptionSchedules];
  updated[rangeIdx].dailyScheduleExceptions[dailyIdx].formulas = updated[rangeIdx].dailyScheduleExceptions[dailyIdx].formulas.filter(
    (_, i) => i !== formulaIdx
  );
  setSelectedExceptionSchedules(updated);
};

const addFormulaExcep = (rangeIdx: number, dailyIdx: number) => {
  const updated = [...selectedExceptionSchedules];
  updated[rangeIdx].dailyScheduleExceptions[dailyIdx].formulas.push({
    label: "",
    price: 0,
    capacity: 0,
  });
  setSelectedExceptionSchedules(updated);
};

const addDailyScheduleExcep = (rangeIdx: number) => {
  const updated = [...selectedExceptionSchedules];
  if (!updated[rangeIdx].dailyScheduleExceptions) {
    updated[rangeIdx].dailyScheduleExceptions = [];
  }

  updated[rangeIdx].dailyScheduleExceptions.push({
    startTime: "",
    endTime: "",
    formulas: [{ label: "", price: 0, capacity: 0 }],
  });

  setSelectedExceptionSchedules(updated);
};
const [filterTitre, setFilterTitre] = useState("");
const [filterRS, setFilterRS] = useState("");
const [filterEtat, setFilterEtat] = useState("");
const filteredEvents = events.filter(event => {
  const matchesTitre = event.nom?.toLowerCase().includes(filterTitre.toLowerCase());
  const matchesRS = filterRS === "" || event.business?.rs === filterRS;
  const matchesEtat =
    filterEtat === ""
      ? true
      : filterEtat === "actif"
      ? event.active
      : !event.active;

  return matchesTitre && matchesRS && matchesEtat;
});

const rsList = Array.from(
  new Set(events.map(event => event.business?.rs).filter(rs => rs))
);

const handleToggle = async (id) => {
  try {
    const res = await axios.put(`https://waw.com.tn/api/events/status/${id}`);
    const updatedEvent = res.data;

    // Update the events state without reloading
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === id ? { ...event, active: updatedEvent.active } : event
      )
    );
  } catch (err) {
    console.error('Error updating status', err);
  }
};
const navigate = useNavigate();

const handleEditDetails = (event) => {
    setSelectedEvent2(event);
  navigate(`/admin/events/edit/${event.id}`);
};

    if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;
  return (

    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Liste des activités</h2>
      </div>
      <div className="flex flex-wrap gap-4 items-center mb-6">
        <input
          type="text"
          placeholder="Filtrer par titre"
    value={filterTitre}
    onChange={(e) => setFilterTitre(e.target.value)}
          className="flex-1 min-w-[250px] pl-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
  value={filterRS}
  onChange={(e) => setFilterRS(e.target.value)}
          className="border px-4 py-2 rounded-md focus:outline-none"
>
  <option value="">Tous</option>
  {rsList.map((rs, i) => (
    <option key={i} value={rs}>{rs}</option>
  ))}
</select>

        <select
    value={filterEtat}
    onChange={(e) => setFilterEtat(e.target.value)}
          className="border px-4 py-2 rounded-md focus:outline-none"
        >
    <option value="">Tous</option>
    <option value="actif">Actif</option>
    <option value="inactif">Inactif</option>
        </select>
      </div>
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">

      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Titre
              </TableCell>
                            <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Raison sociale
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Status
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {filteredEvents.map((event) => (
              <TableRow key={event.id}>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
  <Link
    to={`/detailsEvent?id=${event.id}`} // ou la route de ton détail d'événement
    className="text-blue-600 hover:underline"
  >
    {event.nom}
  </Link>                   </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    <Link
    to={`/profile?id=${event.business?.id}`} // ou la route de ton détail d'événement
    className="text-blue-600 hover:underline"
  >
                   {event.business?.rs && <span>{event.business.rs}</span>}
 </Link>   
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <Badge size="sm" color={event.active ? "success" : "error"}>
                    {event.active ? "Actif" : "Inactif"}
                  </Badge>
                </TableCell>
<TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
  <div className="flex flex-wrap items-center gap-3">
    {/*     <button
      title="Voir détails"
      onClick={() => handleVoirDetails(event)}
      className="flex items-center gap-1 text-blue-600 hover:underline"
    >
      <VisibilityIcon fontSize="small" />
      <span className="hidden md:inline">Détails</span>
    </button>


    <button
      title="Éditer"
      onClick={() => handleEditDetails(event)}
      className="flex items-center gap-1 text-blue-600 hover:underline"
    >
      <EditIcon fontSize="small" />
      <span className="hidden md:inline">Éditer</span>
    </button>

    <button
      title="Voir horaires"
      onClick={() => {
        setSelectedEvent(event);
        setSelectedNormalSchedules(event.scheduleRanges || []);
        setShowNormalModal(true);
      }}
      className="flex items-center gap-1 text-blue-600 hover:underline"
    >
      <AccessTimeIcon fontSize="small" />
      <span className="hidden md:inline">Horaires</span>
    </button>

    <button
      title="Voir horaires exceptionnels"
      onClick={() => {
        const fallbackExceptions = defaultScheduleRangeExceptions;
        const exceptions = event.scheduleRangeExceptions?.length
          ? event.scheduleRangeExceptions
          : fallbackExceptions;
        setSelectedEvent(event);
        setSelectedExceptionSchedules(exceptions);
        setShowExceptionModal(true);
      }}
      className="flex items-center gap-1 text-purple-600 hover:underline"
    >
      <EventBusyIcon fontSize="small" />
      <span className="hidden md:inline">Exceptions</span>
    </button>
 */}
    <button
      title={event.active ? "Bloquer" : "Activer"}
      onClick={() => handleToggle(event.id)}
      className="flex items-center gap-1 text-blue-600 hover:underline"
    >
      <PowerSettingsNewIcon fontSize="small" />
      <span className="hidden md:inline">
        {event.active ? "Bloquer" : "Activer"}
      </span>
    </button>
        <button
      title="Éditer"
      onClick={() => handleEditDetails(event)}
      className="flex items-center gap-1 text-blue-600 hover:underline"
    >
      <EditIcon fontSize="small" />
      <span className="hidden md:inline">Éditer</span>
    </button>
  </div>

  {/* Modales */}
  {selectedEvent && (
    <EventDetailModal
      isOpen={showDetailModal}
      onClose={() => setShowDetailModal(false)}
      event={selectedEvent}
    />
  )}

  {selectedEvent2 && (
    <EventEditModal
      isOpen={showEditModal}
      onClose={() => setEditEvent(false)}
      event={selectedEvent}
    />
  )}
</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
<Modal isOpen={showNormalModal} onClose={() => setShowNormalModal(false)} className="max-w-[700px] p-6">
  <div className="no-scrollbar relative w-full max-w-5xl overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-6">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Horaires Normaux</h2>
    </div>

    {selectedNormalSchedules.map((range, idx) =>
      renderScheduleRangeNormalEditable(range, idx, {
        updateScheduleRange,
        removeScheduleRange,
        updateDailySchedule,
        removeDailySchedule,
        updateFormula,
        removeFormula,
        addFormula,
        addDailySchedule,
        scheduleRangesLength: selectedNormalSchedules.length,
      })
    )}
     <button
        onClick={addScheduleRange}
        className="mt-4 w-full py-3 bg-green-600 text-white rounded hover:bg-green-700 transition"
        type="button"
      >
        Ajouter une nouvelle plage complète
      </button>

      {/* Bouton global pour sauvegarder toutes les plages */}
      <button
        onClick={handleSaveSchedules}
        className="mt-4 w-full py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        type="button"
      >
        Sauvegarder les horaires
      </button>
  </div>
</Modal>


{/* Modal Horaires Exceptionnels */}
<Modal isOpen={showExceptionModal} onClose={() => setShowExceptionModal(false)} className="max-w-[700px] p-6">
  <div className="no-scrollbar relative w-full max-w-5xl overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-6">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Horaires Exceptionnels</h2>
    </div>
{selectedExceptionSchedules.map((range, idx) =>
  renderScheduleRangeExceptionnelEditable(range, idx, {
    updateScheduleRangeExcep,
    removeScheduleRangeExcep,
    updateDailyScheduleExcep,
    removeDailyScheduleExcep,
    updateFormulaExcep,
    removeFormulaExcep,
    addFormulaExcep,
    addDailyScheduleExcep,
    scheduleRangesExceptionnelsLength: selectedExceptionSchedules.length,
  })
)}
     <button
        onClick={addScheduleRangeException}
        className="mt-4 w-full py-3 bg-green-600 text-white rounded hover:bg-green-700 transition"
        type="button"
      >
        Ajouter une nouvelle plage complète
      </button>

      {/* Bouton global pour sauvegarder toutes les plages */}
      <button
        onClick={handleSaveScheduleExceptions}
        className="mt-4 w-full py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        type="button"
      >
        Sauvegarder les horaires
      </button>

  </div>
</Modal>
    </div>
  </div>
  );
}
