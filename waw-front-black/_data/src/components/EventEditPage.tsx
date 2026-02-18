import React, { useState, useEffect } from "react";
import {
  Typography,
  TextField,
  Button,
  Chip,
  CircularProgress,RadioGroup ,FormControlLabel ,Radio ,
  Grid,
  Autocomplete,Box,IconButton ,Divider ,FormControl 
} from "@mui/material";
import { useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import Input from "./form/input/InputField";
import TextArea from "./form/input/TextArea";
import DeleteIcon from "@mui/icons-material/Delete";






const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Map click component
const LocationSelector = ({ position, setPosition, setFormData }) => {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      try {
        const res = await axios.get("https://nominatim.openstreetmap.org/reverse", {
          params: { lat, lon: lng, format: "json", addressdetails: 1 },
        });
        const addr = res.data.address || {};
        setFormData(prev => ({
          ...prev,
          rue: res.data.display_name || "",
          ville: addr.state || addr.state_district || "",
          pays: addr.country || "",
        }));
      } catch (err) {
        console.error("Reverse geocoding error:", err);
      }
    },
  });
  return position ? <Marker position={position} icon={markerIcon} /> : null;
};

const paymentOptions = ['Carte bancaire','Espèces','Virement','Chèque','Autres'];
const availableLanguages = ['Français','Anglais','Espagnol','Allemand','Italien','Portugais','Néerlandais','Arabe'];

export default function EventEditPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState(null);

  // --- Form states ---
  const [activityName, setActivityName] = useState("");
  const [activityDescription, setActivityDescription] = useState("");
  const [position, setPosition] = useState([0, 0]);
  const [formData, setFormData] = useState({ rue:"", ville:"", pays:"" });
  const [imagesFiles, setImagesFiles] = useState([]);
  const [videoFiles, setVideoFiles] = useState([]);
  const [instagramVideo, setInstagramVideo] = useState("");
  const [instagramVideos, setInstagramVideos] = useState([]);
  const [youtubeVideo, setYoutubeVideo] = useState("");
  const [youtubeVideos, setYoutubeVideos] = useState([]);
  const [equipmentToBring, setEquipmentToBring] = useState([]);
  const [newEquipment, setNewEquipment] = useState("");
  const [documentToProvide, setDocumentToProvide] = useState([]);
  const [newDocumentName, setNewDocumentName] = useState("");
  const [newDocumentPrice, setNewDocumentPrice] = useState("");
  const [cgv, setCgv] = useState("");
  const [accepteEnfants, setAccepteEnfants] = useState(false);
  const [accepteBebes, setAccepteBebes] = useState(false);
  const [mobiliteReduite, setMobiliteReduite] = useState(false);
  const [groupes, setGroupes] = useState(false);
  const [animaux, setAnimaux] = useState(false);
  const [ageMinimum, setAgeMinimum] = useState(0);
  const [selectedPayments, setSelectedPayments] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState({});
  const [Listactivites, setListactivites] = useState([]);
  const [activiteSelected, setActiviteSelected] = useState(null);
  const [nonInclus, setNonInclus] = useState([]);
  const [newnonInclus, setNewnonInclus] = useState("");
const [uploading, setUploading] = useState(false);
const [existingImages, setExistingImages] = useState([]); // URLs existantes du serveur
const [newImagesFiles, setNewImagesFiles] = useState([]); 

const [newVideoFiles, setNewVideoFiles] = useState([]);

  // --- Fetch event ---
  useEffect(() => {
    setLoading(true);
    fetch(`https://waw.com.tn/api/api/events/${id}`)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setEvent(data);
        setActivityName(data.nom);
        setActivityDescription(data.description);
        setPosition([data.latitude||0, data.longitude||0]);
        setFormData({ rue:data.rue||"", ville:data.ville||"", pays:data.pays||"" });
        setImagesFiles(data.imageUrls||[]);
        setInstagramVideos(data.videosInstagram||[]);
        setYoutubeVideos(data.videosYoutube||[]);
        setEquipmentToBring(data.includedEquipments||[]);
        setDocumentToProvide(data.extras||[]);
        setCgv(data.cgv||"");
        setAccepteEnfants(data.accepteEnfants||false);
        setAccepteBebes(data.accepteBebes||false);
        setMobiliteReduite(data.mobiliteReduite||false);
        setGroupes(data.groupes||false);
        setAnimaux(data.animaux||false);
        setAgeMinimum(data.ageMinimum||0);
        setSelectedPayments(data.paymentMethods||[]);
        setLanguages(data.languages||[]);
        setActiviteSelected(data.activite||null);
        setSelectedCategories(data.categories||[]);
                setNonInclus(data.nonInclus||[]);
      setExistingImages(data.imageUrls || []);
      setNewImagesFiles([]);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  // --- Fetch activities & categories ---
  useEffect(() => {
    fetch("https://waw.com.tn/api/api/activites")
      .then(res => res.json())
      .then(setListactivites)
      .catch(console.error);
    fetch("https://waw.com.tn/api/api/categories")
      .then(res => res.json())
      .then(setAllCategories)
      .catch(console.error);
  }, []);

  if (loading) return <CircularProgress />;
  if (!event) return <p>Événement non trouvé</p>;

  // --- Handlers ---
  const handleAddInstagramVideo = () => {
    if(instagramVideo.trim()) { setInstagramVideos([...instagramVideos, instagramVideo]); setInstagramVideo(""); }
  };
  const handleRemoveInstagramVideo = (v) => setInstagramVideos(instagramVideos.filter(i=>i!==v));
  const handleAddYoutubeVideo = () => { if(youtubeVideo.trim()) { setYoutubeVideos([...youtubeVideos,youtubeVideo]); setYoutubeVideo(""); }};
  const handleRemoveYoutubeVideo = (v) => setYoutubeVideos(youtubeVideos.filter(i=>i!==v));
  const handleAddEquipment = () => { if(newEquipment.trim()){ setEquipmentToBring([...equipmentToBring,newEquipment]); setNewEquipment(""); }};
  const handleRemoveEquipment = i => setEquipmentToBring(equipmentToBring.filter((_,idx)=>idx!==i));
  const handleAddDocument = () => { if(newDocumentName.trim()&&newDocumentPrice){ setDocumentToProvide([...documentToProvide,{titre:newDocumentName,prix:parseFloat(newDocumentPrice)}]); setNewDocumentName(""); setNewDocumentPrice(""); } };
  const handleRemoveDocument = i => setDocumentToProvide(documentToProvide.filter((_,idx)=>idx!==i));


  const handleFilesChange = (e) => {
  const files = Array.from(e.target.files);
  setNewImagesFiles(prev => [...prev, ...files]);
};
const handleRemoveImage = (index, type) => {
  if (type === 'existing') {
    // Supprimer une image existante
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  } else {
    // Supprimer une nouvelle image
    setNewImagesFiles(prev => prev.filter((_, i) => i !== index));
  }
};
const handleVideoFilesChange = (e) => {
  const files = Array.from(e.target.files);
  setVideoFiles(prev => [...prev, ...files]);
  setNewVideoFiles(prev => [...prev, ...files]);
};
  const handleAddNonInclus = () => {
    const value = newnonInclus.trim();
    if (value && !nonInclus.includes(value)) {
      setNonInclus([...nonInclus, value]);
      setNewNonInclus("");
    }
  };

  const handleRemoveNonInclus = (index) => {
    setNonInclus(nonInclus.filter((_, i) => i !== index));
  };

const handleUploadImages = async (id, files) => {
  setUploading(true);

  const formData = new FormData();
  for (const file of files) {
    formData.append("images", file);
  }

  try {
    const response = await fetch(`https://waw.com.tn/api/api/events/${id}/upload-images`, {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const uploadedUrls = await response.json();
      console.log("Images uploadées :", uploadedUrls);
      return uploadedUrls; // ← Retourner les URLs pour les utiliser
    } else {
      console.error("Erreur lors de l'upload des images");
      return [];
    }
  } catch (error) {
    console.error("Erreur réseau pendant upload images", error);
    return [];
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
      `https://waw.com.tn/api/api/events/${id}/upload-videos`,
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
  const buildUpdatedEvent = () => {
    const updated = {};
    if(activityName!==event.nom) updated.nom=activityName;
    if(activityDescription!==event.description) updated.description=activityDescription;
    if(position[0]!==event.latitude) updated.latitude=position[0];
    if(position[1]!==event.longitude) updated.longitude=position[1];
    ["rue","ville","pays"].forEach(f=>{ if(formData[f]!==event[f]) updated[f]=formData[f] });
    if(JSON.stringify(instagramVideos)!==JSON.stringify(event.videosInstagram)) updated.videosInstagram=instagramVideos;
    if(JSON.stringify(youtubeVideos)!==JSON.stringify(event.videosYoutube)) updated.videosYoutube=youtubeVideos;
    if(JSON.stringify(equipmentToBring)!==JSON.stringify(event.includedEquipments)) updated.includedEquipments=equipmentToBring;
    if(JSON.stringify(documentToProvide)!==JSON.stringify(event.extras)) updated.extras=documentToProvide;
    if(activiteSelected?.id!==event.activite?.id) updated.activite={id:activiteSelected.id};
    if(JSON.stringify(selectedCategories)!==JSON.stringify(event.categories)) updated.categories=selectedCategories.map(c=>({id:c.id}));
    if(Object.keys(selectedSubCategories).length>0) updated.subCategories=Object.values(selectedSubCategories).flat().map(sc=>({id:sc.id}));
    if(mobiliteReduite!==event.mobiliteReduite) updated.mobiliteReduite=mobiliteReduite;
    if(groupes!==event.groupes) updated.groupes=groupes;
    if(animaux!==event.animaux) updated.animaux=animaux;
    if(JSON.stringify(selectedPayments)!==JSON.stringify(event.paymentMethods)) updated.paymentMethods=selectedPayments;
    if(JSON.stringify(languages)!==JSON.stringify(event.languages)) updated.languages=languages;
    if(cgv!==event.cgv) updated.cgv=cgv;
    if(ageMinimum!==event.ageMinimum) updated.ageMinimum=ageMinimum;
    if(accepteEnfants!==event.accepteEnfants) updated.accepteEnfants=accepteEnfants;
    if(accepteBebes!==event.accepteBebes) updated.accepteBebes=accepteBebes;
        if(JSON.stringify(nonInclus)!==JSON.stringify(event.nonInclus)) updated.nonInclus=nonInclus;
    return updated;
  };

const handleSave = async () => {
  try {
    setUploading(true);
    
    let finalImageUrls = [...existingImages];
    
    // 1. Uploader les nouvelles images d'abord
    if (newImagesFiles.length > 0) {
      console.log("Uploading new images...", newImagesFiles.length);
      const uploadedImageUrls = await handleUploadImages(event.id, newImagesFiles);
      console.log("Uploaded image URLs:", uploadedImageUrls);
      
      // Combiner les anciennes images avec les nouvelles URLs
      finalImageUrls = [...existingImages, ...uploadedImageUrls];
      console.log("Final image URLs:", finalImageUrls);
    }

    // 2. Construire la mise à jour finale avec TOUTES les images
    const updated = buildUpdatedEvent();
    const finalUpdate = {
      ...updated,
      imageUrls: finalImageUrls  // ← Inclure toutes les images
    };
    
    console.log("Final update data:", finalUpdate);

    // 3. Mettre à jour l'événement
    const res = await fetch(`https://waw.com.tn/api/api/events/${event.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(finalUpdate)
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();
    console.log("Event updated successfully:", data);

    // 4. Uploader les vidéos si nécessaire
    if (newVideoFiles.length > 0) {
      console.log("Uploading new videos...");
      await handleUploadVideos(event.id, newVideoFiles);
    }
    
    // Redirection
    window.location.href = "/vendeur/events";
    
  } catch(e) { 
    console.error("Error saving event:", e);
    alert("Erreur lors de l'enregistrement: " + e.message);
  } finally {
    setUploading(false);
  }
};
const handleSubCategoryChange = (catId, newSubList) => {
  setSelectedSubCategories((prev) => ({
    ...prev,
    [catId]: newSubList,
  }));
};

  const handleLanguageChange = (event, newValue) => {
    setLanguages(newValue);
  };

  // Supprimer un chip
  const handleLanguageDelete = (languageToDelete) => () => {
    setLanguages((langs) => langs.filter((lang) => lang !== languageToDelete));
  };
  return (
<>     
 <PageBreadcrumb pageTitle="Editer une activité" />
      <div className="space-y-6">
      <PageMeta title="Editer une activité" description="Editer une activité" />


<div className="rounded-2xl bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6 mt-4 border-l-0">

    <div className="p-6 max-w-6xl mx-auto space-y-6 text-black">
      <Typography variant="h4">{event.nom}</Typography>
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
<Typography variant="subtitle1" gutterBottom className="text-black">Précisez la ou les catégories</Typography>
  <Typography variant="body1" className="text-black">Catégories</Typography>
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
    />
  )}
/>

{selectedCategories.map((cat) => (
  <Box key={cat.id} sx={{ mt: 2 }}>
    <Typography variant="subtitle2" className="text-black">{cat.nom} - Sous-catégories</Typography>
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
      <div className="h-64">
        <MapContainer center={position} zoom={13} className="h-full w-full">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <LocationSelector position={position} setPosition={setPosition} setFormData={setFormData} />
        </MapContainer>
      </div>

          <label
      className={clsx(
        twMerge(
          "mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
        )
      )}
      htmlFor="activityName"
    >
      rue
    </label>
      <Input label="Rue" fullWidth value={formData.rue} onChange={e=>setFormData({...formData,rue:e.target.value})} />
                <label
      className={clsx(
        twMerge(
          "mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
        )
      )}
      htmlFor="activityName"
    >
      ville
    </label>
      <Input label="Ville" fullWidth value={formData.ville} onChange={e=>setFormData({...formData,ville:e.target.value})} />
                <label
      className={clsx(
        twMerge(
          "mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
        )
      )}
      htmlFor="activityName"
    >
      pays
    </label>
      <Input label="Pays" fullWidth value={formData.pays} onChange={e=>setFormData({...formData,pays:e.target.value})} />
                <Typography variant="body2 text-black">
                  📍 Latitude : {position[0].toFixed(5)} | Longitude : {position[1].toFixed(5)}
                </Typography>


                <Typography variant="subtitle1" gutterBottom className="text-black">
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

{existingImages.map((imageUrl, index) => (
  <Box key={`existing-${index}`} sx={{ position: 'relative', width: 100, height: 100 }}>
    <img
      src={`https://waw.com.tn${imageUrl}`}
      alt={`Existante ${index}`}
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
    />
    <IconButton
      onClick={() => handleRemoveImage(index, 'existing')}
      sx={{ position: 'absolute', top: 2, right: 2 }}
    >
      <DeleteIcon />
    </IconButton>
  </Box>
))}

{/* Nouvelles images */}
{newImagesFiles.map((file, index) => (
  <Box key={`new-${index}`} sx={{ position: 'relative', width: 100, height: 100 }}>
    <img
      src={URL.createObjectURL(file)}
      alt={file.name}
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
    />
    <IconButton
      onClick={() => handleRemoveImage(index, 'new')}
      sx={{ position: 'absolute', top: 2, right: 2 }}
    >
      <DeleteIcon />
    </IconButton>
  </Box>
))}
        <Typography variant="subtitle1" gutterBottom className="text-black">
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
          <Typography variant="subtitle2"className="text-black">Vidéos sélectionnées :</Typography>
          <ul>
            {videoFiles.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        </Box>
      )}

    <Typography variant="subtitle1"className="text-black" gutterBottom>Liste vidéos depuis Instagram</Typography>

  <div className="flex items-center space-x-2 text-black">
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
      className="px-3 py-2 bg-pink-600 text-black rounded-md hover:bg-pink-700"
    >
      +
    </button>
  </div>
{/*       <h3 className="text-lg font-semibold mb-2 text-black">non Inclus</h3>
      <div className="flex space-x-2 mb-2 text-black">
        <input
          type="text"
          placeholder="Ajouter un nonInclus"
          value={newnonInclus}
          onChange={(e) => setNewnonInclus(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && newnonInclus.trim() && handleAddNonInclus()}
          className="flex-1 border border-gray-300 rounded px-3 py-2"
        />
        <button
          onClick={handleAddNonInclus}
          disabled={!newnonInclus.trim()}
          className="px-4 py-2 bg-blue-600 text-black rounded hover:bg-blue-700 disabled:opacity-50"
        >
          +
        </button>
      </div>

      {nonInclus.length > 0 && (
        <ul className="space-y-2 text-black">
          {nonInclus.map((item, index) => (
            <li
              key={index}
              className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded"
            >
              <span>{item}</span>
              <button
                onClick={() => handleRemoveNonInclus(index)}
                className="text-red-600 hover:underline text-sm"
              >
                Supprimer
              </button>
            </li>
          ))}
        </ul>
      )} */}
<div>

  {instagramVideos.length > 0 && (
    <div className="mt-4">
<h3 className="font-semibold mb-2 text-black">Vidéos Instagram :</h3>
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
<Typography variant="subtitle1" gutterBottom className="text-black">Liste vidéos depuis YouTube</Typography>
<div className="mt-6">
  <div className="flex items-center space-x-2 text-black">
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
      className="px-3 py-2 bg-red-600 text-black rounded-md hover:bg-red-700"
    >
      +
    </button>
  </div>

  {youtubeVideos.length > 0 && (
    <div className="mt-4">
      <h3 className="font-semibold mb-2 text-black">Vidéos YouTube :</h3>
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
 <div>
               <div className="space-y-6 max-w-md mx-auto">
    {/* Inclus */}
    <div>
      <h3 className="text-lg font-semibold mb-2 text-black">Inclus</h3>
      <div className="flex space-x-2 mb-2 text-black">
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
          className="px-4 py-2 bg-blue-600 text-black rounded hover:bg-blue-700 disabled:opacity-50"
        >
          +
        </button>
      </div>

      {equipmentToBring.length > 0 && (
        <ul className="space-y-2 text-black">
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
{/*       <h3 className="text-lg font-semibold mb-2 text-black">non Inclus</h3>
      <div className="flex space-x-2 mb-2 text-black">
        <input
          type="text"
          placeholder="Ajouter un nonInclus"
          value={newnonInclus}
          onChange={(e) => setNewnonInclus(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && newnonInclus.trim() && handleAddNonInclus()}
          className="flex-1 border border-gray-300 rounded px-3 py-2"
        />
        <button
          onClick={handleAddNonInclus}
          disabled={!newnonInclus.trim()}
          className="px-4 py-2 bg-blue-600 text-black rounded hover:bg-blue-700 disabled:opacity-50"
        >
          +
        </button>
      </div>

      {nonInclus.length > 0 && (
        <ul className="space-y-2 text-black">
          {nonInclus.map((item, index) => (
            <li
              key={index}
              className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded"
            >
              <span>{item}</span>
              <button
                onClick={() => handleRemoveNonInclus(index)}
                className="text-red-600 hover:underline text-sm"
              >
                Supprimer
              </button>
            </li>
          ))}
        </ul>
      )} */}
    <hr className="border-gray-300" />

    {/* Extras */}
    <div className="space-y-6 max-w-md mx-auto text-black">
      <h3 className="text-lg font-semibold mb-2">Extras</h3>
      <div className="flex space-x-2 mb-2 text-black">
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
          className="px-4 py-2 bg-blue-600 text-black rounded hover:bg-blue-700 disabled:opacity-50"
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

  <Typography variant="body2" className="text-black">Votre activité est-elle accessible aux personnes à mobilité réduite ?</Typography>
  <RadioGroup
    row
    value={mobiliteReduite}
    onChange={(e) => setMobiliteReduite(e.target.value === 'true')}
  >
    <FormControlLabel value={true} control={<Radio />} label="Oui" />
    <FormControlLabel value={false} control={<Radio />} label="Non" />
  </RadioGroup>

                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography className="text-black" variant="body2">Votre activité est-elle ouverte aux groupes ?</Typography>
                  <RadioGroup row
                    value={groupes}
  onChange={(e) => setGroupes(e.target.value)}
                  >
 <FormControlLabel value={true} control={<Radio />} label="Oui" />
  <FormControlLabel value={false} control={<Radio />} label="Non" />
                  </RadioGroup>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography className="text-black" variant="body2">Votre activité est-elle ouverte aux animaux ?</Typography>
                  <RadioGroup row
                    value={animaux}
  onChange={(e) => setAnimaux(e.target.value)}
                  >
 <FormControlLabel value={true} control={<Radio />} label="Oui" />
  <FormControlLabel value={false} control={<Radio />} label="Non" />
                  </RadioGroup>
                </Grid>
              </Grid>

              <Typography className="text-black" variant="body2" sx={{ mb: 1 }}>Quel(s) moyen(s) de paiement acceptez-vous ?</Typography>
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

                <Typography className="text-black" variant="body2" sx={{ mt: 2, mb: 1 }}>
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
              <Typography className="text-black" variant="subtitle1" gutterBottom>Conditions générales de vente</Typography>

              <Divider sx={{ my: 3 }} />
              <Typography className="text-black" variant="subtitle1" gutterBottom>Âge minimum</Typography>
              <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                  <Grid item xs={12} sm={6}>
                      <Typography className="text-black" variant="body2">Âge minimum requis pour participer à l'activité</Typography>
<TextField
  fullWidth
  label="Âge (ans)"
  type="number"
  placeholder="Ex: 10"
  value={ageMinimum}
  onChange={(e) => setAgeMinimum(e.target.value)}
/>
                  </Grid>
                  <Grid item xs={12} sm={6}>
<Typography className="text-black" variant="body2">Acceptez-vous les enfants ?</Typography>
<RadioGroup
  row
  value={accepteEnfants}
  onChange={(e) => setAccepteEnfants(e.target.value)}
>
 <FormControlLabel className="text-black" value={true} control={<Radio />} label="Oui" />
  <FormControlLabel className="text-black"value={false} control={<Radio />} label="Non" />
</RadioGroup>
                  </Grid>

                  <Grid item xs={12} sm={6} className="text-black">
                      <Typography className="text-black" variant="body2">Acceptez-vous les bébés ?</Typography>
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
              <div className="text-black">
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
            </div>
      
<div className="mt-8 flex justify-end">
  <Button 
    variant="contained" 
    color="primary" 
    onClick={handleSave}
    disabled={uploading}
  >
    {uploading ? "Enregistrement en cours..." : "Enregistrer"}
  </Button>
</div>
    </div>
  </div>
</div>
</>
  );
}
