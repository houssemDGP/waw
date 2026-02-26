import React, { useState, useEffect } from "react";
import {
  Modal,
  Typography,
  TextField,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Chip,
  Divider,
  Box,
  Grid,
  Autocomplete,
  CircularProgress
} from "@mui/material";
import Input from "../../form/input/InputField";
import TextArea from "../../form/input/TextArea";
import LocationSelector from "./LocationSelector";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export default function EventEditModal({ isOpen, onClose, event }) {
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
      <Input
        accept="image/*"
        multiple
        type="file"
        onChange={handleFilesChange}
      />

      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        déposez vos photos ici, ou cliquez pour en charger.
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
        mb: 3,
      }}
    >
        <Input
          accept="video/*"
          multiple
          type="file"
          onChange={handleVideoFilesChange}
        />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          déposez vos vidéos ici, ou cliquez pour en charger.
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
    <div className="space-y-6 max-w-md mx-auto">
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
          className="w-24 border border-gray-300 rounded px-3 py-2"
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