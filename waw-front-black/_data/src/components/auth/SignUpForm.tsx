import { useState, useEffect } from "react";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { Box, Stepper, Step, StepLabel, Typography ,Button} from "@mui/material";
import axios from "axios";
import L from "leaflet";

const steps = [
  { label: "Type de compte" },
  { label: "Informations personnelles" },
  { label: "Informations géographiques" },
];

export default function SignUpForm() {
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
  });

  const [step, setStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [position, setPosition] = useState([36.8065, 10.1815]);
  const [searchQuery, setSearchQuery] = useState("");
  const [geoError, setGeoError] = useState(null);
  const [accountType, setAccountType] = useState(""); // "pro" or "personne"
  const [imageFile, setImageFile] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
const [imagePreview, setImagePreview] = useState(null);
const [confirmPassword, setConfirmPassword] = useState("");
const [errors, setErrors] = useState({});

const handleChange = (e) => {
  const { name, value } = e.target;
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
        phone: formData.telephone,
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
      };

      const res = await axios.post(
        "http://102.211.209.131:3011/api/business",
        businessData
      );
      const createdBusiness = res.data;

      localStorage.setItem("businessId", createdBusiness.id);

      if (imageFile) {
        const formImageData = new FormData();
        formImageData.append("image", imageFile);

        await axios.post(
          `http://102.211.209.131:3011/api/business/${createdBusiness.id}/upload-image`,
          formImageData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      window.location.href = "http://102.211.209.131:3333/vendeur/DashboradVendeur";
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error);
      alert("Erreur lors de la création du compte.");
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

  return (
    <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="mb-5 sm:mb-8">
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
            Créer un compte
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Entrez votre email et mot de passe pour vous inscrire.
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
                  Compte Pro
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
                  <Label>Téléphone<span className="text-error-500">*</span></Label>
                  <Input
                    type="text"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleChange}
                    placeholder="Entrez votre téléphone"
                    required
                  />
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
                  <Label>Description<span className="text-error-500">*</span></Label>
                  <Input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Décrivez votre activité"
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
                  onClick={handleSearch}
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
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <LocationSelector
                      position={position}
                      setPosition={setPosition}
                      setFormData={setFormData}
                    />
                  </MapContainer>
                </Box>
                <Input
                  name="rue"
                  value={formData.rue}
                  onChange={handleChange}
                  placeholder="Rue / Adresse complète"
                  required
                />
                <Input
                  name="ville"
                  value={formData.ville}
                  onChange={handleChange}
                  placeholder="Ville"
                  required
                />
                <Input
                  name="pays"
                  value={formData.pays}
                  onChange={handleChange}
                  placeholder="Pays"
                  required
                />
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
  );
}
